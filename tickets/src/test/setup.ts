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

// Forges a JWT cookie (for testing purposes; to emulate user authentication within the ticketing service)
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

global.createTicket = async ({ newTicket, cookie }: { newTicket?: TicketType, cookie?: string[] }): Promise<TicketDocument> => {
    let t: TicketType;
    if (newTicket !== undefined) {
        t = newTicket;
    }
    else {
        t = {
            title: "ticketName",
            price: 30
        };
    }
    const c = cookie === undefined ? global.getCookie() : cookie;
    const response = await request(server)
        .post("/api/tickets")
        .set("Cookie", c)
        .send(t)
        .expect(201);
    return response.body;
};