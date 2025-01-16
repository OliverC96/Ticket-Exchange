import request from "supertest";
import { server } from "../../server";

it("StatusCode = 401 if user not authenticated", async() => {
    return request(server)
        .post("/api/users/logout")
        .send({})
        .expect(401);
});

it("Removes cookie upon successful logout", async() => {
    const cookie = await global.getCookie();
    const response = await request(server)
        .post("/api/users/logout")
        .set("Cookie", cookie)
        .send({})
        .expect(200)
    expect(response.headers["set-cookie"][0]).toMatch(new RegExp("^session=;.*"));
});