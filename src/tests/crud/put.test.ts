import request from "supertest";
import { app, server } from "../../app";
import { loginCredentials, updatedUserData, userId } from "./helper";

describe("Login as ADMIN and update user data", () => {
  let accessToken: string;

  test("POST /api/v1/auth/login >> 200 OK and userToken type inside res.body.content", async () => {
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send(loginCredentials);
    expect(loginResponse.headers["content-type"]).toMatch(/json/);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toBeInstanceOf(Object);
    expect(loginResponse.body.message).toBe("User logged in");
    expect(loginResponse.body.content).toMatchObject({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        email: loginCredentials.email,
        rol: "ADMIN",
      },
    });

    accessToken = loginResponse.body.content.token;
  });

  test("PUT /api/v1/users/:id >> 200 OK and user updated message inside res.body.message", async () => {
    const updateResponse = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Content-Type", "application/json")
      .send(updatedUserData);

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.headers["content-type"]).toMatch(/json/);
    expect(updateResponse.body).toMatchObject({
      message: "User updated",
      status: 200,
    });
  });
});

afterAll(() => {
  server.close();
});
