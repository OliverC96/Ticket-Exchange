const getTaxAmount = (basePrice, taxPercent) => {
    return (taxPercent / 100) * basePrice;
};

const getTotal = (basePrice, taxAmount, discount) => {
    return basePrice + taxAmount - discount;
}

export const getCharges = (basePrice, taxPercent, discount, isRefund) => {
    const taxAmount = getTaxAmount(basePrice, taxPercent);
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
    if (discount !== 0) {
        charges.push({
            type: "Discount",
            amount: discount.toFixed(2)
        });
    }
    if (isRefund) {
        const refundAmount = getTotal(basePrice, taxAmount, discount);
        charges.push({
            type: "Refund",
            amount: refundAmount.toFixed(2)
        });
    }
    charges.push({
        type: "Order Total",
        amount: (isRefund ? 0 : getTotal(basePrice, taxAmount, discount)).toFixed(2)
    });
    return charges;
}