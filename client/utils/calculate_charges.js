const getTaxAmount = (basePrice, taxPercent) => {
    return (taxPercent / 100) * basePrice;
};

const getTotal = (basePrice, taxAmount, discount) => {
    return basePrice + taxAmount - discount;
}

/**
 * Constructs an array of charges comprising a single purchase
 * @param basePrice Price of the listing at time of purchase
 * @param taxPercent Tax percentage (based on the user's location)
 * @param discount Discount amount (when the user is purchasing a discounted listing)
 * @param isRefund True if the order is being refunded; false otherwise
 * @returns {[{amount: string, type: string},{amount: string, type: string}]}
 */
export const getCharges = (basePrice, taxPercent, discount, isRefund) => {
    const taxAmount = getTaxAmount(basePrice, taxPercent); // Compute applicable taxes
    // Initialize array of charges
    const charges = [
        {
            type: "Ticket Price",
            amount: basePrice.toFixed(2)
        },
        {
            type: `Tax (${taxPercent}%)`,
            amount: taxAmount.toFixed(2)
        }
    ];
    if (discount !== 0) { // Add discount charge (when applicable)
        charges.push({
            type: "Discount",
            amount: discount.toFixed(2)
        });
    }
    if (isRefund) { // Add refund charge (when applicable)
        const refundAmount = getTotal(basePrice, taxAmount, discount);
        charges.push({
            type: "Refund",
            amount: refundAmount.toFixed(2)
        });
    }
    // Add order total charge
    charges.push({
        type: "Order Total",
        amount: (isRefund ? 0 : getTotal(basePrice, taxAmount, discount)).toFixed(2)
    });
    return charges;
}