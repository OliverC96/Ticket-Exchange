const addressOptions = (apiKey) => {
    return {
        mode: "billing",
        autocomplete: {
            mode: "google_maps_api",
            apiKey: apiKey
        },
        allowedCountries: [
            "AU",
            "CA",
            "DE",
            "NZ",
            "SG",
            "AE",
            "US"
        ],
        fields: {
            phone: "never"
        }
    };
};

export default addressOptions;