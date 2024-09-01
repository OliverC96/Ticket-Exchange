// Address configuration for the Stripe checkout form
const addressOptions = {
    mode: "billing",
    autocomplete: {
        mode: "google_maps_api",
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY
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

// Maps ISO Alpha-2 country codes to full country names
const countryMapping = {
    "AU": "Australia",
    "CA": "Canada",
    "DE": "Germany",
    "NZ": "New Zealand",
    "SG": "Singapore",
    "AE": "United Arab Emirates",
    "US": "United States"
};

export {
    addressOptions,
    countryMapping
}
