export const calculateTotalCost = (productPrice, weight, shippingType = 'paid') => {
    // 1. Base Product Price
    const basePrice = Number(productPrice) || 0;
    const productWeight = Number(weight) || 0.5; // Default 0.5kg if missing

    // 2. International Shipping Cost (Simplified Model)
    // Rate: $15 for first kg, $10 for each additional kg
    let shippingCost = 0;
    if (shippingType === 'paid') {
        if (productWeight <= 0.5) {
            shippingCost = 10;
        } else if (productWeight <= 1) {
            shippingCost = 15;
        } else {
            // $15 for first kg + $10 per additional kg
            shippingCost = 15 + Math.ceil(productWeight - 1) * 10;
        }
    }

    // 3. Customs (Average 20%)
    const customsRate = 0.20;
    const customsFee = basePrice * customsRate;

    // 4. Platform Fee (10%)
    const platformFeeRate = 0.10;
    const platformFee = basePrice * platformFeeRate;

    // Total
    const total = basePrice + shippingCost + customsFee + platformFee;

    return {
        basePrice: parseFloat(basePrice.toFixed(2)),
        shippingCost: parseFloat(shippingCost.toFixed(2)),
        customsFee: parseFloat(customsFee.toFixed(2)),
        platformFee: parseFloat(platformFee.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
};
