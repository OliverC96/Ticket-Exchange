import request from "supertest";
import { server } from "../../server";

it("Attaches a cookie upon successful registration", async() => {
    const user = {
        email: "tests@gmail.com",
        password: "password",
        auth_method: "native"
    }
    const response = await request(server)
        .post("/api/users/register")
        .send(user)
        .expect(201);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.auth_method).toEqual(user.auth_method);
    expect(response.get("Set-Cookie")).toBeDefined();
});

it("StatusCode = 400 with invalid email address", async() => {
    return request(server)
        .post("/api/users/register")
        .send({
            email: "testgmailcom",
            password: "password",
            auth_method: "native"
        })
        .expect(400);
});

it("StatusCode = 400 with invalid password", async() => {
    return request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "p",
            auth_method: "native"
        })
        .expect(400);
});

it("StatusCode = 400 with missing email and/or password", async() => {
    await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            auth_method: "native"
        })
        .expect(400);
    await request(server)
        .post("/api/users/register")
        .send({
            password: "myPassword",
            auth_method: "native"
        })
        .expect(400);
});

it("Does not allow duplicate email addresses", async() => {
    await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "password",
            auth_method: "native"
        })
        .expect(201);
    await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "password",
            auth_method: "native"
        })
        .expect(400);
});