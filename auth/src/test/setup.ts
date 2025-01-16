import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { server } from "../server";
import { posthogClient } from "../posthog";

declare global {
    function getCookie(): Promise<string[]>;
}

process.env.JWT_KEY = "mySecret";
process.env.POSTHOG_KEY = "phc_NE49LvOVJSBZATykB3x9fLoFi2J1wbcqPmtuhb294og";

let mongoDB: any;
beforeAll(async() => {
    mongoDB = await MongoMemoryServer.create();
    const mongoURI = mongoDB.getUri();
    await mongoose.connect(mongoURI, {});
});

beforeEach(async() => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async() => {
    if (mongoDB) {
        await mongoDB.stop();
    }
    await mongoose.connection.close();
    await posthogClient.shutdown();
});

/**
 * Forges a JWT cookie (for testing purposes; to emulate user authentication)
 * @returns {string[]} JWT session cookie
 */
global.getCookie = async(): Promise<string[]> => {
    const email: string = "tests@gmail.com";
    const password: string = "password";
    const authResponse = await request(server)
        .post("/api/users/register")
        .send({
            email,
            password,
            auth_method: "native"
        })
        .expect(201)
    let cookie = authResponse.get("Set-Cookie");
    return cookie || [];
}