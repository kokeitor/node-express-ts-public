import request from "supertest";
import { app } from "../../app";
import { Roles } from "../../domain";
import {
  badEmailLoginCredentials,
  badPswLoginCredentials,
  goodLoginCredentials,
} from "./helper";

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
