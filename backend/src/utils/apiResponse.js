/**
 * Standard API Response Utility
 * @param {boolean} success - Operation success status
 * @param {string} message - Response message
 * @param {any} data - Response data (optional)
 * @param {string} errorCode - Specific error code (optional)
 * @returns {Object} Standardized response object
 */
const apiResponse = (success, message, data = null, errorCode = null) => {
    return {
        success,
        message,
        data,
        errorCode
    };
};

module.exports = apiResponse;
