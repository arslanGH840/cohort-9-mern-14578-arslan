const { expect } = require("chai");
const sinon = require("sinon");

const userRepository = require("../../src/repositories/userRepository");
const passwordUtil = require("../../src/utils/password");
const jwtUtil = require("../../src/utils/jwt");
const authService = require("../../src/services/authService");

describe("authService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("creates a user when username and email are both available", async () => {
      sinon.stub(userRepository, "findByUsername").resolves(null);
      sinon.stub(userRepository, "findByEmail").resolves(null);
      sinon.stub(passwordUtil, "hashPassword").resolves("hashed-password");
      sinon.stub(userRepository, "createUser").resolves({
        id: 1,
        username: "newuser",
        email: "newuser@example.com",
      });

      const result = await authService.register({
        username: "newuser",
        email: "newuser@example.com",
        password: "SecurePass123",
      });

      expect(result.username).to.equal("newuser");
      expect(userRepository.createUser.calledOnce).to.be.true;
    });

    it("throws ConflictError when username is already taken", async () => {
      sinon
        .stub(userRepository, "findByUsername")
        .resolves({ id: 1, username: "taken" });

      try {
        await authService.register({
          username: "taken",
          email: "new@example.com",
          password: "SecurePass123",
        });
        expect.fail("Expected register to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(authService.ConflictError);
        expect(error.statusCode).to.equal(409);
      }
    });

    it("throws ConflictError when email is already taken", async () => {
      sinon.stub(userRepository, "findByUsername").resolves(null);
      sinon
        .stub(userRepository, "findByEmail")
        .resolves({ id: 1, email: "taken@example.com" });

      try {
        await authService.register({
          username: "newuser",
          email: "taken@example.com",
          password: "SecurePass123",
        });
        expect.fail("Expected register to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(authService.ConflictError);
      }
    });
  });

  describe("login", () => {
    it("returns a user and token for valid credentials", async () => {
      const fakeUser = {
        id: 1,
        username: "demo_user",
        password_hash: "hashed",
      };
      sinon.stub(userRepository, "findByUsername").resolves(fakeUser);
      sinon.stub(passwordUtil, "comparePassword").resolves(true);
      sinon.stub(jwtUtil, "signToken").returns("fake.jwt.token");

      const result = await authService.login({
        username: "demo_user",
        password: "Demo@12345",
      });

      expect(result.token).to.equal("fake.jwt.token");
      expect(result.user.username).to.equal("demo_user");
    });

    it("throws AuthenticationError for a nonexistent username", async () => {
      sinon.stub(userRepository, "findByUsername").resolves(null);

      try {
        await authService.login({ username: "ghost", password: "whatever" });
        expect.fail("Expected login to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(authService.AuthenticationError);
        expect(error.statusCode).to.equal(401);
      }
    });

    it("throws AuthenticationError for an incorrect password", async () => {
      const fakeUser = {
        id: 1,
        username: "demo_user",
        password_hash: "hashed",
      };
      sinon.stub(userRepository, "findByUsername").resolves(fakeUser);
      sinon.stub(passwordUtil, "comparePassword").resolves(false);

      try {
        await authService.login({ username: "demo_user", password: "wrong" });
        expect.fail("Expected login to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(authService.AuthenticationError);
      }
    });
  });
});
