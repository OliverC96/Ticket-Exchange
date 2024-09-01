import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { server } from "../server";
import { TicketDocument } from "../models/tickets";
import { Ticket, TicketFields } from "../models/tickets";
import { OrderDocument } from "../models/orders";

declare global {
    function getCookie(): string[];
    function createTicket(newTicket?: TicketFields): Promise<TicketDocument>;
    function createOrder(ticketID: string, cookie?: string[]): Promise<OrderDocument>;
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
 * Helper method which creates a ticket document
 * @param {TicketFields} [newTicket] Ticket attributes (if not provided, the default attributes will be used)
 * @returns {Promise<TicketDocument>} The newly-created ticket document
 */
global.createTicket = async (newTicket?: TicketFields): Promise<TicketDocument> => {
    let t: TicketFields;
    if (newTicket !== undefined) {
        t = newTicket;
    }
    else {
        t = {
            id: new mongoose.Types.ObjectId().toHexString(),
            title: "ticketName",
            price: 30
        };
    }
    const ticket: TicketDocument = Ticket.build(t);
    await ticket.save();
    return ticket;
};

/**
 * Helper method which creates an order document
 * @param {string} ticketID The ID of the ticket associated with the order
 * @param {string[]} [cookie] A session cookie
 */
global.createOrder = async (ticketID: string, cookie?: string[]): Promise<OrderDocument> => {
    const c: string[] = cookie || global.getCookie();
    const response = await request(server)
        .post("/api/orders")
        .set("Cookie", c)
        .send({ ticketID })
        .expect(201);
    return response.body;
}