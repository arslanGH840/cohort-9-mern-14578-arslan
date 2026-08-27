const { expect } = require("chai");
const request = require("supertest");
const app = require("../../src/app");
const { cleanDatabase } = require("../helpers/dbHelper");

describe("Notes API (integration)", () => {
  let tokenA;
  let tokenB;
  let userAId;

  beforeEach(async () => {
    await cleanDatabase();

    await request(app).post("/api/auth/register").send({
      username: "userA",
      email: "userA@example.com",
      password: "SecurePass123",
    });
    const loginA = await request(app).post("/api/auth/login").send({
      username: "userA",
      password: "SecurePass123",
    });
    tokenA = loginA.body.data.token;
    userAId = loginA.body.data.user.id;

    await request(app).post("/api/auth/register").send({
      username: "userB",
      email: "userB@example.com",
      password: "SecurePass123",
    });
    const loginB = await request(app).post("/api/auth/login").send({
      username: "userB",
      password: "SecurePass123",
    });
    tokenB = loginB.body.data.token;
  });

  describe("POST /api/notes", () => {
    it("creates a note owned by the authenticated user", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "My Note", body: "<p>Content</p>" });

      expect(res.status).to.equal(201);
      expect(res.body.data.note.title).to.equal("My Note");
      expect(res.body.data.note.user_id).to.be.undefined;
    });

    it("rejects a request with no token", async () => {
      const res = await request(app)
        .post("/api/notes")
        .send({ title: "X", body: "Y" });
      expect(res.status).to.equal(401);
    });

    it("rejects an empty title with 400", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "   ", body: "<p>Content</p>" });

      expect(res.status).to.equal(400);
    });
    it("rejects a title longer than 255 characters", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "a".repeat(256), body: "<p>Content</p>" });

      expect(res.status).to.equal(400);
    });

    it("rejects a non-string title", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: { not: "a string" }, body: "<p>Content</p>" });

      expect(res.status).to.equal(400);
    });

    it("rejects a whitespace-only body", async () => {
      const res = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Valid Title", body: "   " });

      expect(res.status).to.equal(400);
    });
  });

  describe("GET /api/notes", () => {
    it("returns only the authenticated user's notes", async () => {
      await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "A's note",
          body: "<p>A</p>",
        });
      await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({
          title: "B's note",
          body: "<p>B</p>",
        });

      const res = await request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).to.equal(200);
      expect(res.body.data.notes).to.have.lengthOf(1);
      expect(res.body.data.notes[0].title).to.equal("A's note");
    });

    it("rejects an invalid sortBy with 400", async () => {
      const res = await request(app)
        .get("/api/notes?sortBy=password_hash")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).to.equal(400);
    });
  });

  describe("GET /api/notes/:id — ownership enforcement", () => {
    it("returns 404 when trying to access another user's note", async () => {
      const createRes = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "A's private note", body: "<p>Secret</p>" });
      const noteId = createRes.body.data.note.id;

      const res = await request(app)
        .get(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).to.equal(404);
    });

    it("returns 404 for a nonexistent note id", async () => {
      const res = await request(app)
        .get("/api/notes/999999")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).to.equal(404);
    });

    it("returns 400 for a malformed note id", async () => {
      const res = await request(app)
        .get("/api/notes/not-a-number")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).to.equal(400);
    });
  });

  describe("PUT /api/notes/:id — ownership enforcement", () => {
    it("prevents a user from updating another user's note", async () => {
      const createRes = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "A's note", body: "<p>Original</p>" });
      const noteId = createRes.body.data.note.id;

      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ title: "Hacked title" });

      expect(res.status).to.equal(404);
    });

    it("allows the owner to update their own note", async () => {
      const createRes = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Original", body: "<p>Original</p>" });
      const noteId = createRes.body.data.note.id;

      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Updated" });

      expect(res.status).to.equal(200);
      expect(res.body.data.note.title).to.equal("Updated");
    });
  });

  describe("DELETE /api/notes/:id — ownership enforcement", () => {
    it("prevents a user from deleting another user's note", async () => {
      const createRes = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "A's note", body: "<p>Content</p>" });
      const noteId = createRes.body.data.note.id;

      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).to.equal(404);
    });

    it("allows the owner to delete their own note", async () => {
      const createRes = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "To delete", body: "<p>Content</p>" });
      const noteId = createRes.body.data.note.id;

      const res = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).to.equal(200);

      const getRes = await request(app)
        .get(`/api/notes/${noteId}`)
        .set("Authorization", `Bearer ${tokenA}`);
      expect(getRes.status).to.equal(404);
    });
  });
});
