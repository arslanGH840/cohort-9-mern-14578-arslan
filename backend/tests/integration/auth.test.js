const { expect } = require("chai");
const request = require("supertest");
const app = require("../../src/app");
const { cleanDatabase } = require("../helpers/dbHelper");

describe("Auth API (integration)", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("registers a new user and returns 201", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "integrationuser",
        email: "integration@example.com",
        password: "SecurePass123",
      });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.data.user.username).to.equal("integrationuser");
      expect(res.body.data.user.password_hash).to.be.undefined;
    });

    it("rejects duplicate username with 409", async () => {
      await request(app).post("/api/auth/register").send({
        username: "dupeuser",
        email: "first@example.com",
        password: "SecurePass123",
      });
      it("rejects a username shorter than 3 characters", async () => {
        const res = await request(app).post("/api/auth/register").send({
          username: "ab",
          email: "valid@example.com",
          password: "SecurePass123",
        });
        expect(res.status).to.equal(400);
        expect(res.body.error.details.some((d) => d.field === "username")).to.be
          .true;
      });

      it("rejects a password shorter than 8 characters", async () => {
        const res = await request(app).post("/api/auth/register").send({
          username: "validuser",
          email: "valid@example.com",
          password: "short",
        });
        expect(res.status).to.equal(400);
        expect(res.body.error.details.some((d) => d.field === "password")).to.be
          .true;
      });

      it("rejects a malformed email address", async () => {
        const res = await request(app).post("/api/auth/register").send({
          username: "validuser",
          email: "not-an-email-at-all",
          password: "SecurePass123",
        });
        expect(res.status).to.equal(400);
        expect(res.body.error.details.some((d) => d.field === "email")).to.be
          .true;
      });

      const res = await request(app).post("/api/auth/register").send({
        username: "dupeuser",
        email: "second@example.com",
        password: "SecurePass123",
      });

      expect(res.status).to.equal(409);
      expect(res.body.success).to.be.false;
    });

    it("rejects invalid input with 400", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "ab",
        email: "not-an-email",
        password: "123",
      });

      expect(res.status).to.equal(400);
      expect(res.body.error.details).to.be.an("array");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        username: "loginuser",
        email: "loginuser@example.com",
        password: "SecurePass123",
      });
    });

    it("logs in with correct credentials and returns a token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "loginuser",
        password: "SecurePass123",
      });

      expect(res.status).to.equal(200);
      expect(res.body.data.token).to.be.a("string");
    });

    it("rejects incorrect password with 401", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "loginuser",
        password: "WrongPassword",
      });

      expect(res.status).to.equal(401);
    });

    it("rejects nonexistent username with 401 (same generic message)", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "nonexistent",
        password: "AnyPassword",
      });

      expect(res.status).to.equal(401);
      expect(res.body.error.message).to.equal("Invalid username or password");
    });
  });

  describe("GET /api/auth/me", () => {
    let token;

    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        username: "meuser",
        email: "meuser@example.com",
        password: "SecurePass123",
      });
      const loginRes = await request(app).post("/api/auth/login").send({
        username: "meuser",
        password: "SecurePass123",
      });
      token = loginRes.body.data.token;
    });

    it("returns the current user with a valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.user.username).to.equal("meuser");
    });

    it("rejects requests with no token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).to.equal(401);
    });

    it("rejects requests with an invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer garbage.token.here");

      expect(res.status).to.equal(401);
    });
  });
});
