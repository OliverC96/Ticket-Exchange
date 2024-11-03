import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { server } from "../server";

declare global {
    function getCookie(): Promise<string[]>;
}

let mongoDB: any;
beforeAll(async() => {
    process.env.JWT_KEY = "mySecret";
    mongoDB = await MongoMemoryServer.create();
    const mongoURI = mongoDB.getUri();
    await mongoose.connect(mongoURI, {});
});

beforeEach(async() => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async() => {
    if (mongoDB) {
        await mongoDB.stop();
    }
    await mongoose.connection.close();
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
            password
        })
        .expect(201)
    let cookie = authResponse.get("Set-Cookie");
    return cookie || [];
}