import request from "supertest";
import { app, server } from "../app";
import { Roles } from "../domain";
import {
  badEmailLoginCredentials,
  badPswLoginCredentials,
  goodLoginCredentials,
} from "./auth/helper";
import { loginCredentials, updatedUserData, userId } from "./crud/helper";

describe("GET /api/v1/health", () => {
  it("Health check >> Should return a json with a string message and status code 200", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.statusCode).toEqual<number>(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.message).toBe<string>("Server is running");
    expect(res.body.status).toBe<number>(200);
  });
});

describe("Login resource", () => {
  test("POST /api/v1/auth/login >> bad email", async () => {
    const badloginResponse = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send(badEmailLoginCredentials);
    expect(badloginResponse.headers["content-type"]).toMatch(/json/);
    expect(badloginResponse.statusCode).toBe(400);
    expect(badloginResponse.body).toBeInstanceOf(Object);
    expect(badloginResponse.body).toMatchObject({
      message: expect.any(String),
      status: 400,
    });
  });

  test("POST /api/v1/auth/login >> bad password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send(badPswLoginCredentials);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.statusCode).toBe(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toMatchObject({
      message: expect.any(String),
      status: 401,
    });
  });

  test("POST /api/v1/auth/login >> email and password correct", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send(goodLoginCredentials);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User logged in");
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.content).toMatchObject({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        email: goodLoginCredentials.email,
        rol: expect.any(String),
      },
    });
    expect([Roles.user, Roles.admin].includes(res.body.content.user.rol)).toBe(
      true
    );
  });
});

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
