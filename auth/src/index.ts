import mongoose from "mongoose"
import { DatabaseConnectionError } from "@ojctickets/common";
import { server } from "./server";

const initialize = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined.");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo URI must be defined.");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to MongoDB database.");
    }
    catch (err) {
        console.log("Failed to connect to MongoDB database: ", err);
        throw new DatabaseConnectionError();
    }
    server.listen(3001, () => {
        console.log("Successfully launched on port 3001");
    });
}

initialize();