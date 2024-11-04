import axios from "axios";

// Constructs, and configures an axios client to manage backend API requests
export default ({ req }) => {
    // "window" variable only exists client-side (i.e., is not defined server-side)
    if (typeof window === "undefined") {
        return axios.create({
            baseURL: process.env.BASE_URL, // Base URL varies between dev and prod environments
            headers: req.headers
        });
    }
    else {
        return axios.create({
            baseURL: "/"
        });
    }
}