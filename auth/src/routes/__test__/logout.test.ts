import request from "supertest";
import { server } from "../../server";

it("Removes cookie upon successful logout", async() => {
    await request(server)
        .post("/api/users/register")
        .send({
            email: "tests@gmail.com",
            password: "password"
        })
        .expect(201)
    const response = await request(server)
        .post("/api/users/logout")
        .send({})
        .expect(200)
    expect(response.headers["set-cookie"][0]).toMatch(new RegExp("^session=;.*"));
});