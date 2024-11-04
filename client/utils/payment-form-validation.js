const numDigits = (str) => {
    return str.match(/\d/g)?.length || 0;
}

// Payment form validation logic
const validateInput = (name, value) => {
    switch (name) {
        case "cardNumber": {
            const valid = (value.length <= 16) && (numDigits(value) === value.length);
            const extendedValid = (value.split(' ').length === 4) && ((value.match(/\d{4}/g)?.length || 0) === 4);
            return valid || extendedValid;
        }
        case "expiryDate": {
            const valid = (value.length <= 4) && (numDigits(value) === value.length);
            const extendedValid = value.match(/ \/ /) && ((value.match(/\d{2}/g)?.length || 0) === 2);
            return valid || extendedValid;
        }
        case "securityCode": {
            return (value.length <= 3) && (numDigits(value) === value.length);
        }
        default:
            return null;
    }
};

export {
    numDigits,
    validateInput
};