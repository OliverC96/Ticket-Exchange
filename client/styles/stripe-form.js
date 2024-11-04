const elementStyle = {
    style: {
        base: {
            color: "#E0F4FF",
            fontSize: "16px",
            '::placeholder': {
                color: "#E0F4FFC0"
            }
        },
        invalid: {
            color: "#EF4444"
        }
    }
};

const appearanceOptions = {
    appearance: {
        variables: {
            colorText: "#E0F4FF",
            colorTextPlaceholder: "#E0F4FFC0",
            colorBackground: "#003049",
            borderRadius: "0.4rem",
            fontWeightNormal: "500"
        },
        rules: {
            ".Label": {
                fontSize: "1rem",
                marginBottom: "0.5rem"
            },
            ".Input": {
                borderColor: "#669bbc",
                padding: "10px 13px",
                letterSpacing: "-0.3px",
                marginBottom: "0.2rem"
            },
            ".Input:focus": {
                boxShadow: "none",
                borderColor: "#669bbc"
            }
        }
    }
}

export {
    elementStyle,
    appearanceOptions
}