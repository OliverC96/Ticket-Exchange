import request from "supertest";
import { server } from "../../server";

it("Successfully retrieves current user", async() => {
   const cookie = await global.getCookie();
   const response = await request(server)
       .get("/api/users/current-user")
       .set("Cookie", cookie)
       .send({})
       .expect(200);
   expect(response.body.currentUser.email).toEqual("test@gmail.com");
});

it("currentUser = null if the user is not authenticated", async() => {
   const response = await request(server)
       .get("/api/users/current-user")
       .send({})
       .expect(200);
   expect(response.body.currentUser).toEqual(null);
});