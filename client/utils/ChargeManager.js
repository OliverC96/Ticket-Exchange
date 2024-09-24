import { getTaxPercent, provincialTaxRates } from "./tax_data";

/**
 * Responsible for computing a collection of charges associated with the current order
 * e.g., Listing price, tax charge(s), applicable discounts, etc.
 */
export default class ChargeManager {
    #basePrice;
    #discountAmount;
    #forEmail;
    #isRefund;
    #provinceCode;
    #taxPercent;
    #taxAmount;

    /**
     * Constructor
     * @param { number } basePrice
     * @param { number } discountAmount
     * @param { string } provinceCode
     * @param { boolean } forEmail
     * @param { boolean } isRefund
     */
    constructor(basePrice, discountAmount, provinceCode, forEmail, isRefund) {
        this.#basePrice = basePrice;
        this.#discountAmount = discountAmount;
        this.#provinceCode = provinceCode;
        this.#taxPercent = getTaxPercent(provinceCode);
        this.#taxAmount = this.#taxPercent * basePrice;
        this.#forEmail = forEmail;
        this.#isRefund = isRefund;
    }

    /**
     * Aggregates all applicable tax charges (based on the province associated with the customer's billing address)
     * @returns {[{amount: string, type: string}]} An array of tax charges
     */
    #getTaxCharges() {
        let taxCharges = [];
        // Show a more concise summary of charges on the webpage UI (to reduce clutter and improve the user experience)
        if (!this.#forEmail) {
            const taxAmount = this.#basePrice * this.#taxPercent;
            taxCharges.push({
                type: `Tax (${Math.round(this.#taxPercent * 100)}%)`,
                amount: taxAmount.toFixed(2)
            });
        }
        // Show a detailed summary of charges on the email UI
        else {
            const salesTax = provincialTaxRates[this.#provinceCode];
            for (const [type, rate] of Object.entries(salesTax)) {
                const taxAmount = this.#basePrice * rate;
                taxCharges.push({
                    type: `${type} (${Math.round(rate * 100)}%)`,
                    amount: taxAmount.toFixed(2)
                });
            }
        }
        return taxCharges;
    }

    /**
     * Computes, and aggregates all charges relevant to the current order
     * @returns {[{amount: string, type: string}]} A comprehensive array of charges
     */
    getCharges() {
        const netPrice = this.#basePrice + this.#taxAmount - this.#discountAmount;
        // Initialize array of charges
        const charges = [
            {
                type: "Ticket Price",
                amount: this.#basePrice.toFixed(2)
            }
        ];
        charges.push(...this.#getTaxCharges()); // Add applicable taxes (e.g., GST, PST, HST)
        if (this.#discountAmount !== 0) { // Add discount charge (when applicable)
            charges.push({
                type: "Discount",
                amount: this.#discountAmount.toFixed(2)
            });
        }
        if (this.#isRefund) { // Add refund charge (when applicable)
            charges.push({
                type: "Refund",
                amount: netPrice.toFixed(2)
            });
        }
        // Add order total charge
        charges.push({
            type: "Order Total",
            amount: (this.#isRefund ? 0 : netPrice).toFixed(2)
        });
        return charges;
    }
}