const getTaxAmount = (basePrice, taxPercent) => {
    return (taxPercent / 100) * basePrice;
};

const getTotal = (basePrice, taxAmount, discount) => {
    return basePrice + taxAmount - discount;
}

export {
    getTaxAmount,
    getTotal
}