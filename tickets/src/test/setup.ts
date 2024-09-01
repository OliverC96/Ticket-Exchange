import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { server } from "../server";
import { TicketDocument } from "../models/tickets";
import { TicketType } from "../models/tickets";

declare global {
    function getCookie(): string[];
    function createTicket({ newTicket, cookie }: { newTicket?: TicketType, cookie?: string[] }): Promise<TicketDocument>;
}

// Create a mock implementation of the natsWrapper.client.publish() method for testing purposes
jest.mock('@ojctickets/common', () => {
    const original = jest.requireActual('@ojctickets/common');

    return {
        __esmodule: true,
        ...original,
        natsWrapper: {
            client: {
                publish: jest
                    .fn()
                    .mockImplementation(
                        (subject: string, data: string, callback: () => void) => {
                            callback();
                        }
                    ),
            },
        },
    };
});

let mongoDB: any;

beforeAll(async() => {
    process.env.JWT_KEY = "mySecret";
    mongoDB = await MongoMemoryServer.create();
    const mongoURI = mongoDB.getUri();
    await mongoose.connect(mongoURI, {});
});

beforeEach(async() => {
    jest.clearAllMocks();
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
global.getCookie = (): string[] => {
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    const payload = {
        id: ticketID,
        email: "oliverc@gmail.com"
    }
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    const session = {
        jwt: token
    };
    const sessionJSON = JSON.stringify(session);
    const encodedSession = Buffer.from(sessionJSON).toString("base64");
    return [`session=${encodedSession}`];
};

/**
 * Helper method which creates a ticket document via a POST request to /api/tickets
 * @param {TicketType} [newTicket] Ticket attributes
 * @param {string[]} [cookie] A session cookie
 * @returns {Promise<TicketDocument>} The newly-created ticket document
 */
global.createTicket = async ({ newTicket, cookie }: { newTicket?: TicketType, cookie?: string[] }): Promise<TicketDocument> => {
    let t: TicketType;
    if (newTicket !== undefined) { // Use the provided ticket attributes
        t = newTicket;
    }
    else { // Use the default ticket attributes
        t = {
            title: "ticketName",
            price: 30
        };
    }
    const c = cookie || global.getCookie();
    const response = await request(server)
        .post("/api/tickets")
        .set("Cookie", c)
        .send(t)
        .expect(201);
    return response.body;
};