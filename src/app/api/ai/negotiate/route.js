import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const data = await request.json();

    const {
      productId,
      productPrice,
      productName,
      userMessage,
      userId,
      sellerId,
    } = data;

    // Run AI logic to validate discount locally (less server calls is better for this step)
    const offerMatch = userMessage.match(/\$?(\d+(?:\.\d{2})?)/);
    const offerPrice = offerMatch ? parseFloat(offerMatch[1]) : null;

    let aiResponse = "";
    let suggestion = "";
    let shouldSaveToDB = false;

    if (offerPrice) {
      const discountPercentage = ((productPrice - offerPrice) / productPrice) * 100;

      if (offerPrice >= productPrice) {
        aiResponse = `Your offer of $${offerPrice} is at or above the listing price of $${productPrice}. You can proceed to purchase!`;
      } else if (discountPercentage <= 10) {
        aiResponse = `Great! Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) has been sent to the seller.`;
        suggestion = `This is a fair offer.`;
        shouldSaveToDB = true;
      } else if (discountPercentage <= 25) {
        aiResponse = `Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) has been sent to the seller. This is an aggressive offer.`;
        suggestion = `Consider starting slightly higher to increase chances.`;
        shouldSaveToDB = true;
      } else {
        const suggestedOffer = (productPrice * 0.85).toFixed(2);
        aiResponse = `Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) is too low.`;
        suggestion = `I recommend offering at least $${suggestedOffer}.`;
      }
    } else {
      aiResponse = `I didn't detect a specific price in your message.`;
    }

    // Call Backend Express API to save to DB only if a valid offer was made
    if (shouldSaveToDB) {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/negotiations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader // Proxying the token to the backend
        },
        body: JSON.stringify({
          productId, productPrice, productName, userMessage, userId, sellerId, offerPrice, aiResponse, suggestion
        }),
      });

      if (!backendResponse.ok) {
        console.error("Backend Error on negotiation creation");
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
    console.error("Negotiation API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process negotiation" },
      { status: 500 }
    );
  }
}
