import { jsPDF } from "jspdf";

const getBase64ImageFromUrl = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      resolve(reader.result);
    }, false);

    reader.addEventListener("error", function (err) {
      reject(err);
    });

    reader.readAsDataURL(blob);
  });
};

/**
 * Generate and download an invoice PDF for an order
 * @param {Object} order - The order object
 */
export async function downloadOrderInvoice(order) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const black = [0, 0, 0];
  const border = [0, 0, 0];
  
  // Set background to soft light gray like the image
  doc.setFillColor(244, 245, 247); // Lighter, cleaner, more white-ish background
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Format Date
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const invoiceId = `#${(order.transitionId || order._id || "N/A").slice(-8).toUpperCase()}`;
  const amountPaid = Number(order.amountPaid || order.amountpaid || 0);

  // ================= TOP HEADER (LOGO + INVOICE) =================
  try {
    const logoData = await getBase64ImageFromUrl("/unityshop.png");
    doc.addImage(logoData, 'PNG', 20, 12, 28, 28, undefined, 'FAST'); // Made logo much bigger
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22); // Made title bigger
    doc.setTextColor(...black);
    doc.text("UNITY SHOP", 52, 31);
  } catch (error) {
    console.error("Could not load logo", error);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...black);
    doc.text("UNITY SHOP", 20, 31);
  }

  // Add "Your Company" type small text at top right to balance
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Invoice Document", pageWidth - 20, 31, { align: "right" });

  // Big "Invoice" text below Logo
  doc.setFont("times", "bold");
  doc.setFontSize(55);
  doc.text("Invoice", 19, 58); // Pushed down slightly

  // ================= 2ND ROW (BOXES) =================
  let boxY = 70;
  
  // Left Box (Outline - Invoice From)
  doc.setDrawColor(...border);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, boxY, 80, 32, 3, 3);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Invoice From", 25, boxY + 8);
  
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("Unity Shop", 25, boxY + 16);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Main Street, Dhaka 1200,\nBangladesh", 25, boxY + 24);

  // Right Box (Solid Black - Invoice Info)
  doc.setFillColor(...black);
  doc.roundedRect(110, boxY, 80, 32, 3, 3, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Invoice Info", 150, boxY + 11, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Invoice No. ${invoiceId}`, 150, boxY + 19, { align: "center" });
  doc.text(`Issue Date. ${invoiceDate}`, 150, boxY + 25, { align: "center" });
  doc.setTextColor(...black); // Reset to black

  // ================= TABLE AND DETAILS =================
  let tY = 115;
  
  // --- TABLE LEFT (width 20 to 125) ---
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("QTY", 20, tY);
  doc.text("ITEM DESCRIPTION", 36, tY);
  doc.text("PRICE", 95, tY);
  doc.text("TOTAL", 125, tY, { align: "right" });
  
  doc.setDrawColor(...border);
  doc.setLineWidth(0.3);
  doc.line(20, tY + 4, 125, tY + 4);
  
  tY += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  
  const prodName = order.productName || "Product Name";
  
  // Parse items from productName "Item A (x2), Item B (x1)"
  let itemsList = [];
  if (prodName.includes("(x")) {
    const rawItems = prodName.split(", ");
    rawItems.forEach(rawItem => {
      const match = rawItem.match(/\(x(\d+)\)/);
      let tQty = 1;
      let tName = rawItem;
      if (match) {
        tQty = parseInt(match[1], 10);
        tName = rawItem.replace(match[0], "").trim();
      }
      itemsList.push({ name: tName, qty: tQty });
    });
  } else {
    itemsList.push({ name: prodName, qty: order.quantity || 1 });
  }

  // Distribute prices
  const totalItemsQty = itemsList.reduce((sum, item) => sum + item.qty, 0);
  const baseUnitPrice = totalItemsQty > 0 ? amountPaid / totalItemsQty : amountPaid;

  // Draw each product row
  itemsList.forEach((item, i) => {
    let lineText = item.name;
    if (lineText.length > 40) lineText = lineText.substring(0, 37) + "..."; 
    
    const itemTotal = baseUnitPrice * item.qty;
    const qtyFormatted = String(item.qty).padStart(2, '0') + ".";

    doc.text(qtyFormatted, 20, tY);
    doc.text(lineText, 36, tY);
    doc.text(`$${baseUnitPrice.toFixed(2)}`, 95, tY);
    doc.text(`$${itemTotal.toFixed(2)}`, 125, tY, { align: "right" });

    // Move down for the next item
    tY += 15;
  });

  doc.line(20, tY - 3, 125, tY - 3);
  
  tY += 8;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Subtotal", 20, tY);
  doc.text(":", 45, tY);
  doc.setFont("times", "bold");
  doc.text(`$${amountPaid.toFixed(2)}`, 125, tY, { align: "right" });
  
  tY += 7;
  doc.text("Tax", 20, tY);
  doc.text(":", 45, tY);
  doc.text("$0.00", 125, tY, { align: "right" });
  
  tY += 8;
  doc.line(20, tY - 2, 125, tY - 2);
  
  tY += 10;
  doc.setFontSize(14);
  doc.text("Total", 20, tY);
  doc.text(":", 45, tY);
  doc.text(`$${amountPaid.toFixed(2)}`, 125, tY, { align: "right" });

  // --- DETAILS RIGHT (width 140 to 190) ---
  let rY = 113;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Payment Info", 190, rY, { align: "right" });
  
  rY += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Account Name : Unity Shop", 190, rY, { align: "right" });
  rY += 5;
  doc.text("Bank Account : 01234567890", 190, rY, { align: "right" });
  rY += 5;
  doc.text(`Transaction ID : ${(order.transitionId || "N/A").slice(-8).toUpperCase()}`, 190, rY, { align: "right" });

  rY += 18;
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Customer Info", 190, rY, { align: "right" });
  
  rY += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const cName = order.customerName || "Customer";
  const cEmail = order.customerEmail || "No Email";
  doc.text(`Name: ${cName}`, 190, rY, { align: "right" });
  rY += 5;
  doc.text(`Email: ${cEmail}`, 190, rY, { align: "right" });
  if (order.shippingAddress) {
    rY += 5;
    const addr = `${order.shippingAddress.city || ""}, ${order.shippingAddress.country || ""}`;
    doc.text(`Region: ${addr}`, 190, rY, { align: "right" });
  }
  
  // ================= BOTTOM BOX (Terms & Sign) =================
  let bY = pageHeight - 75; // Approx 220
  
  doc.setFillColor(...black);
  doc.roundedRect(20, bY, 170, 52, 6, 6, "F");
  
  doc.setTextColor(255, 255, 255);
  
  // Terms Left
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Terms & Condition.", 28, bY + 14);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("1. Item must be inspected upon delivery.", 28, bY + 24);
  doc.text("2. Please contact support within 3 days for disputes.", 28, bY + 31);
  doc.text("3. This software guarantees secure transactions.", 28, bY + 38);
  doc.text("4. All sales are final based on our policies.", 28, bY + 45);
  
  // Manager Sign Right
  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.text("Manager Marketing", 175, bY + 14, { align: "right" });
  
  doc.setFont("times", "italic");
  doc.setFontSize(22);
  doc.text("Ahsan Habib", 150, bY + 33, { align: "center" });
  
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.3);
  doc.line(125, bY + 39, 175, bY + 39);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Authorized Sign", 150, bY + 45, { align: "center" });

  // ========== DOWNLOAD ==========
  const fileName = `UnityShop_Invoice_${invoiceId.replace("#", "")}.pdf`;
  doc.save(fileName);
}
