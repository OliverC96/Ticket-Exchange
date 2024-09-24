// Maps provincial Alpha-2 codes to applicable sales taxes
const provincialTaxRates = {
    "AB": {
        "GST": 0.05
    },
    "BC": {
        "GST": 0.05,
        "PST": 0.07
    },
    "MB": {
        "GST": 0.05,
        "PST": 0.07
    },
    "NB": {
        "HST": 0.15
    },
    "NL": {
        "HST": 0.15
    },
    "NS": {
        "HST": 0.15
    },
    "PE": {
        "HST": 0.15
    },
    "NT": {
        "GST": 0.05
    },
    "NU": {
        "GST": 0.05
    },
    "YT": {
        "GST": 0.05
    },
    "ON": {
        "HST": 0.13
    },
    "QC": {
        "GST": 0.05,
        "QST": 0.09975
    },
    "SK": {
        "GST": 0.05,
        "PST": 0.06
    }
}

/**
 * Helper method which computes the total sales tax based on the given province
 * @param provinceCode An Alpha-2 province code
 * @returns { number } The total applicable sales tax (in percent form)
 */
const getTaxPercent = (provinceCode) => {
    if (!provincialTaxRates.hasOwnProperty(provinceCode)) return -1;
    const taxRates = provincialTaxRates[provinceCode];
    let totalTaxPercent = 0.00;
    for (const rate of Object.values(taxRates)) {
        totalTaxPercent += rate;
    }
    return totalTaxPercent;
}

export { getTaxPercent, provincialTaxRates };