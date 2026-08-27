const { expect } = require("chai");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../src/app");
const env = require("../../src/config/env");
const { cleanDatabase } = require("../helpers/dbHelper");

describe("Authentication middleware (integration)", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("rejects an expired token with 401", async () => {
    const expiredToken = jwt.sign(
      { id: 1, username: "someuser" },
      env.jwt.secret,
      { expiresIn: -10 },
    );

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).to.equal(401);
  });

  it("rejects a malformed token on a Notes endpoint with 401", async () => {
    const res = await request(app)
      .get("/api/notes")
      .set("Authorization", "Bearer not.a.real.token");

    expect(res.status).to.equal(401);
  });

  it("rejects a token signed with the wrong secret", async () => {
    const forgedToken = jwt.sign(
      { id: 1, username: "attacker" },
      "wrong-secret-entirely",
    );

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${forgedToken}`);

    expect(res.status).to.equal(401);
  });
});
