import { jsPDF } from "jspdf";

/**
 * Generate and download an invoice PDF for an order
 * @param {Object} order - The order object
 */
export function downloadOrderInvoice(order) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Colors
  const primary = [79, 70, 229]; // indigo-600
  const dark = [30, 41, 59]; // slate-800
  const gray = [100, 116, 139]; // slate-500
  const black = [15, 23, 42]; // slate-900

  // ========== HEADER ==========
  // Brand background bar
  doc.setFillColor(...primary);
  doc.rect(0, 0, pageWidth, 40, "F");

  // Brand name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("UnityShop", 20, 22);

  // Invoice label
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE", 20, 33);

  // Invoice number on right
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const invoiceId = `#${(order.transitionId || order._id || "N/A").slice(-8).toUpperCase()}`;
  doc.text(invoiceId, pageWidth - 20, 22, { align: "right" });

  // Date on right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  doc.text(invoiceDate, pageWidth - 20, 33, { align: "right" });

  // ========== CUSTOMER & SELLER INFO ==========
  let y = 55;

  // Bill To
  doc.setTextColor(...dark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 20, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...black);
  doc.text(order.customerName || "Customer", 20, y + 8);
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(order.customerEmail || "N/A", 20, y + 15);
  if (order.shippingAddress) {
    const addr = order.shippingAddress;
    const addressLines = [
      addr.address,
      [addr.city, addr.state, addr.zip].filter(Boolean).join(", "),
      addr.country,
    ].filter(Boolean);
    addressLines.forEach((line, i) => {
      doc.text(line, 20, y + 22 + i * 6);
    });
  }

  // Seller Info (right side)
  doc.setTextColor(...dark);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("SELLER", pageWidth - 80, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...black);
  doc.text(order.sellerName || "Seller", pageWidth - 80, y + 8);
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(order.sellerEmail || "N/A", pageWidth - 80, y + 15);

  // ========== DIVIDER ==========
  y = 100;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(20, y, pageWidth - 20, y);

  // ========== ORDER TABLE HEADER ==========
  y = 112;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(20, y - 6, pageWidth - 40, 14, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);
  doc.text("ITEM", 25, y + 2);
  doc.text("QTY", 120, y + 2);
  doc.text("PRICE", 145, y + 2);
  doc.text("TOTAL", pageWidth - 25, y + 2, { align: "right" });

  // ========== ORDER ITEM ROW ==========
  y = 126;
  const quantity = order.quantity || 1;
  const amountPaid = Number(order.amountPaid || order.amountpaid || 0);
  const unitPrice = quantity > 0 ? amountPaid / quantity : amountPaid;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...black);
  doc.text(order.productName || "Product", 25, y + 2);

  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(String(quantity), 125, y + 2);
  doc.text(`$${unitPrice.toFixed(2)}`, 145, y + 2);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...black);
  doc.text(`$${amountPaid.toFixed(2)}`, pageWidth - 25, y + 2, {
    align: "right",
  });

  // ========== DIVIDER ==========
  y = 142;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(20, y, pageWidth - 20, y);

  // ========== TOTALS ==========
  y = 155;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text("Subtotal", 130, y);
  doc.setTextColor(...black);
  doc.text(`$${amountPaid.toFixed(2)}`, pageWidth - 25, y, {
    align: "right",
  });

  y += 10;
  doc.setTextColor(...gray);
  doc.text("Shipping", 130, y);
  doc.setTextColor(...black);
  doc.text("$0.00", pageWidth - 25, y, { align: "right" });

  y += 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(130, y - 3, pageWidth - 20, y - 3);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...primary);
  doc.text("Total Paid", 130, y + 5);
  doc.text(`$${amountPaid.toFixed(2)}`, pageWidth - 25, y + 5, {
    align: "right",
  });

  // ========== STATUS BADGE ==========
  y += 25;
  const status = order.status || "New";
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...dark);
  doc.text("ORDER STATUS", 20, y);

  y += 8;
  const statusColors = {
    New: [168, 85, 247],
    Processing: [245, 158, 11],
    Shipped: [59, 130, 246],
    Delivered: [16, 185, 129],
    Cancelled: [239, 68, 68],
  };
  const statusColor = statusColors[status] || [100, 116, 139];
  doc.setFillColor(...statusColor);
  doc.roundedRect(20, y - 5, 35, 12, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(status, 37.5, y + 2, { align: "center" });

  // ========== TRANSACTION ID ==========
  if (order.transitionId) {
    y += 20;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("TRANSACTION ID", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(order.transitionId, 20, y + 8);
  }

  // ========== FOOTER ==========
  const footerY = 270;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);
  doc.text(
    "Thank you for shopping with UnityShop!",
    pageWidth / 2,
    footerY + 8,
    {
      align: "center",
    },
  );
  doc.text(
    "For support, contact us at support@unityshop.com",
    pageWidth / 2,
    footerY + 14,
    { align: "center" },
  );

  // ========== DOWNLOAD ==========
  const fileName = `UnityShop_Invoice_${invoiceId.replace("#", "")}.pdf`;
  doc.save(fileName);
}
