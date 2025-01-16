import request from "supertest";
import { server } from "../../server";

it("StatusCode = 400 with invalid email address", async () => {
    return request(server)
        .post("/api/users/reset/newUser@gmail.com")
        .send({
            password: "myNewPassword123"
        })
        .expect(404);
});

it("StatusCode = 400 with invalid password", async () => {
    const userEmail = "resetTest@gmail.com";
    await request(server)
        .post("/api/users/register")
        .send({
            email: userEmail,
            password: "resetPass",
            auth_method: "native"
        })
        .expect(201);
    return request(server)
        .post(`/api/users/reset/${userEmail}`)
        .send({
            password: "xYz"
        })
        .expect(400);
});

it("StatusCode = 400 for OAuth-authenticated users", async () => {
    const googleUser = {
        email: "googleTest@gmail.com",
        password: "googlePassword",
        auth_method: "google"
    }
    const githubUser = {
        email: "githubTest@gmail.com",
        password: "githubPassword",
        auth_method: "github"
    }

    await request(server)
        .post("/api/users/register")
        .send(googleUser)
        .expect(201)
    await request(server)
        .post("/api/users/register")
        .send(githubUser)
        .expect(201)

    await request(server)
        .post(`/api/users/reset/${googleUser.email}`)
        .send({
            password: "newGooglePass"
        })
        .expect(400);
    await request(server)
        .post(`/api/users/reset/${githubUser.email}`)
        .send({
            password: "newGithubPass"
        })
        .expect(400);
});

it("Successfully resets password when provided valid credentials", async () => {
    const user = {
        email: "resetTest@gmail.com",
        password: "resetPass",
        auth_method: "native"
    }
    await request(server)
        .post("/api/users/register")
        .send(user)
        .expect(201);

    const newPassword = user.password + "NEW";
    const response = await request(server)
        .post(`/api/users/reset/${user.email}`)
        .send({
            password: newPassword
        })
        .expect(200);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.auth_method).toEqual(user.auth_method);
    expect(response.body.password).not.toEqual(user.password);
});