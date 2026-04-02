import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let { productId, productPrice, productName, userMessage, sellerId } = body;

    if (!sellerId && productId) {
      console.log("🔍 SellerId missing, fetching product details...");
      const backendUrl =
        process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
      const productRes = await fetch(`${backendUrl}/products/${productId}`);
      const productData = await productRes.json();
      const sellerEmail = productData.sellerEmail;
      if (sellerEmail) {
        // Fetch user by email to get ID
        const userRes = await fetch(
          `${backendUrl}/users/by-email/${encodeURIComponent(sellerEmail)}`,
          {
            headers: { Authorization: `Bearer ${session.backendToken}` },
          },
        );
        const userData = await userRes.json();
        sellerId = userData._id;
      }
    }

    const offerMatch = userMessage.match(/\$?(\d+(?:\.\d{2})?)/);
    const offerPrice = offerMatch ? parseFloat(offerMatch[1]) : null;
    let shouldSaveToDB = false;
    let aiResponse = "";
    let suggestion = "";

    if (offerPrice) {
      const discountPercentage =
        ((productPrice - offerPrice) / productPrice) * 100;
      if (offerPrice >= productPrice) {
        aiResponse = `Your offer of $${offerPrice} is at or above the listing price of $${productPrice}. You can proceed to purchase!`;
      } else if (discountPercentage <= 10) {
        aiResponse = `Great! Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) has been sent to the seller.`;
        suggestion = "This is a fair offer.";
        shouldSaveToDB = true;
      } else if (discountPercentage <= 25) {
        aiResponse = `Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) has been sent to the seller. This is an aggressive offer.`;
        suggestion = "Consider starting slightly higher to increase chances.";
        shouldSaveToDB = true;
      } else {
        const suggestedOffer = (productPrice * 0.85).toFixed(2);
        aiResponse = `Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) is too low.`;
        suggestion = `I recommend offering at least $${suggestedOffer}.`;
      }
    } else {
      aiResponse = "I didn't detect a specific price in your message.";
    }

    if (shouldSaveToDB) {
      const backendUrl =
        process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
      const backendResponse = await fetch(`${backendUrl}/api/negotiations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
        body: JSON.stringify({
          productId,
          productPrice,
          userMessage,
          sellerId,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        console.error("❌ Backend error:", errorData);
        return NextResponse.json({
          success: true,
          message: aiResponse,
          suggestion,
          offerPrice,
          offerSent: false,
          error: "Could not send to seller",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: aiResponse,
      suggestion,
      offerPrice,
      offerSent: shouldSaveToDB,
    });
  } catch (error) {
    console.error("🔥 Negotiation API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process negotiation" },
      { status: 500 },
    );
  }
}
