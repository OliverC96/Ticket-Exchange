import request from "supertest";
import { server } from "../../server";

it("StatusCode = 400 with invalid (non-existent) email address", async() => {
    return request(server)
        .post("/api/users/login")
        .send({
            email: "test@gmail.com",
            password: "password"
        })
        .expect(400);
});

it("StatusCode = 400 with incorrect password", async() => {
    await request(server)
        .post("/api/users/register")
        .send({
            email: "test@gmail.com",
            password: "password"
        })
        .expect(201);
    await request(server)
        .post("/api/users/login")
        .send({
            email: "test@gmail.com",
            password: "incorrect"
        })
        .expect(400);
});

it("Attaches a cookie upon successful login", async() => {
    await request(server)
        .post("/api/users/register")
        .send({
            email: "test@gmail.com",
            password: "password"
        })
        .expect(201);
    const response = await request(server)
        .post("/api/users/login")
        .send({
            email: "test@gmail.com",
            password: "password"
        })
        .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
});