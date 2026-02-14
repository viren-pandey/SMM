/**
 * Currency Utility
 * Handles conversion and formatting of prices based on the selected currency.
 */

export const formatCurrency = (amount, currency, exchangeRate) => {
    if (currency === 'INR') {
        const inrAmount = amount * exchangeRate;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(inrAmount);
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(amount);
};
