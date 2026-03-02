import { NextResponse } from "next/server";
// Optional: if you want to save negotiations to database later
// import connectDB from "@/lib/db";
// import Negotiation from "@/models/Negotiation";

export async function POST(request) {
  try {
    // No authentication required – for testing
    const {
      productId,
      productPrice,
      productName,
      userMessage,
      conversationHistory,
      userId,
      sellerId,
    } = await request.json();

    // Extract offer amount from user message
    const offerMatch = userMessage.match(/\$?(\d+(?:\.\d{2})?)/);
    const offerPrice = offerMatch ? parseFloat(offerMatch[1]) : null;

    // AI Logic - Analyze offer
    let aiResponse = "";
    let suggestion = "";
    let offerSent = false;

    if (offerPrice) {
      const discountPercentage =
        ((productPrice - offerPrice) / productPrice) * 100;

      if (offerPrice >= productPrice) {
        aiResponse = `Your offer of $${offerPrice} is at or above the listing price of $${productPrice}. You can proceed to purchase at the current price!`;
      } else if (discountPercentage <= 10) {
        // 0-10% discount - Reasonable, send to seller
        aiResponse = `Great! Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) has been sent to the seller. You'll be notified when they respond.`;
        suggestion = `This is a fair offer. Most sellers accept offers within 10% of the listing price.`;
        offerSent = true;

        // Optional: Save to database (uncomment when ready)
        // await connectDB();
        // await Negotiation.create({
        //   product: productId,
        //   buyer: userId,
        //   seller: sellerId,
        //   offerPrice,
        //   originalPrice: productPrice,
        //   status: "pending",
        //   messages: [{
        //     sender: userId,
        //     message: userMessage,
        //     timestamp: new Date(),
        //   }],
        // });
      } else if (discountPercentage <= 25) {
        // 10-25% discount - Aggressive but possible
        aiResponse = `Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) has been sent to the seller. This is an aggressive offer, so be prepared for negotiation.`;
        suggestion = `Consider starting with a slightly higher offer (around $${(productPrice * 0.85).toFixed(2)}) to increase your chances of acceptance.`;
        offerSent = true;

        // Optional: Save to database
        // await connectDB();
        // await Negotiation.create({ ... });
      } else {
        // >25% discount - Too low
        const suggestedOffer = (productPrice * 0.85).toFixed(2);
        aiResponse = `Your offer of $${offerPrice} (${discountPercentage.toFixed(1)}% discount) is significantly below the listing price. Sellers rarely accept offers this low.`;
        suggestion = `I recommend offering at least $${suggestedOffer} to show you're serious about purchasing.`;
      }
    } else {
      // No price detected - Ask for clarification
      aiResponse = `I didn't detect a specific price in your message. Please specify your offer amount. For example: "I'd like to offer $${(productPrice * 0.9).toFixed(2)}"`;
      suggestion = `Tip: Most sellers accept offers between 10-15% below the listing price ($${(productPrice * 0.85).toFixed(2)} - $${(productPrice * 0.9).toFixed(2)})`;
    }

    return NextResponse.json({
      success: true,
      message: aiResponse,
      suggestion,
      offerPrice,
      offerSent,
    });
  } catch (error) {
    console.error("Negotiation API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process negotiation" },
      { status: 500 },
    );
  }
}
