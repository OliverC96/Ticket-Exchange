import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Order, OrderDocument } from "../models/orders";
import { OrderStatus } from "@ojctickets/common";

declare global {
    function getCookie(id?: string): string[];
    function createOrder(userID?: string): Promise<OrderDocument>;
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

process.env.STRIPE_SECRET_KEY = "sk_test_51PdklUDO089tzeAmRUGze6hivnUhhy787kKzLSnfh5gN2SiBYGW3YfcnlyxUstY3qe2PdThFqPGuHScwhVQV1rek00fRsqWaEZ";
process.env.JWT_KEY = 'mySecret';
process.env.POSTHOG_KEY = "phc_NE49LvOVJSBZATykB3x9fLoFi2J1wbcqPmtuhb294og";

let mongoDB: any;
beforeAll(async() => {
    mongoDB = await MongoMemoryServer.create();
    const mongoURI = mongoDB.getUri();
    await mongoose.connect(mongoURI, {});
});

beforeEach(async() => {
    jest.clearAllMocks();
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
});

/**
 * Forges a JWT cookie (for testing purposes; to emulate user authentication)
 * @param {string} [id] An id corresponding to a ticket document
 * @returns {string[]} JWT session cookie
 */
global.getCookie = (id?: string): string[] => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
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
 * Helper method which directly creates an order document through the Orders model
 * @param {string} [userID] A JWT cookie
 * @return {Promise<OrderDocument>} The newly-created order document
 */
global.createOrder = async (userID?: string): Promise<OrderDocument> => {
    const order: OrderDocument = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userID: userID || new mongoose.Types.ObjectId().toHexString(),
        price: 50,
        status: OrderStatus.Created
    });
    await order.save();
    return order;
}