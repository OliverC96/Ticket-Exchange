import request from "supertest";
import { server } from "../../server";

it("Attaches a cookie upon successful registration", async() => {
    const response = await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "password"
        })
        .expect(201);
    expect(response.get("Set-Cookie")).toBeDefined();
})

it("StatusCode = 400 with invalid email address", async() => {
    return request(server)
        .post("/api/users/register")
        .send({
            email: "testgmailcom",
            password: "password"
        })
        .expect(400);
});

it("StatusCode = 400 with invalid password", async() => {
    return request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "p"
        })
        .expect(400);
});

it("StatusCode = 400 with missing email and/or password", async() => {
    await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com"
        })
        .expect(400);
    await request(server)
        .post("/api/users/register")
        .send({
            password: "myPassword"
        })
        .expect(400);
});

it("Does not allow duplicate email addresses", async() => {
    await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "password"
        })
        .expect(201);
    await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "password"
        })
        .expect(400);
});