export const addressOptions = {
    mode: "billing",
    autocomplete: {
        mode: "google_maps_api",
        apiKey: process.env.NEXT_PUBLIC_PLACES_KEY
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
}