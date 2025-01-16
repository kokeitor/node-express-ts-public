import request from "supertest";
import { app, server } from "../../app";

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

afterAll(() => {
  server.close();
});
