/* eslint-disable @typescript-eslint/no-unused-vars */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/infrastructure/api/app.ts";

describe("Auth API Integration Tests", () => {
  let authToken: string;

  const testUser = {
    name: "Integration Test User",
    email: "integration@test.com",
    password: "password123"
  };

  beforeEach(() => {
    authToken = "";
  });

  afterEach(async () => {
    // Cleanup: Try to delete the test user if it exists
    try {
      const loginResponse = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });

      if (loginResponse.status === 200) {
        const cookies = loginResponse.headers["set-cookie"];
        const token = cookies![0]!.split(";")[0]!.split("=")[1]!;
        
        await request(app)
          .delete("/auth/delete")
          .set("Cookie", [`auth_token=${token}`]);
      }
    } catch (error) {
      // Ignore errors during cleanup
    }
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(testUser)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.password).toBeUndefined();
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "",
          email: "invalid-email",
          password: "123"
        })
        .expect(400);

      expect(response.body.error).toBeDefined();

      const responseShortPassword = await request(app)
        .post("/auth/register")
        .send({
          name: "Test User",
          email: "short-password@example.com",
          password: "123"
        })
        .expect(400);
      expect(responseShortPassword.body.error).toBeDefined();

      const responseInvalidEmail = await request(app)
        .post("/auth/register")
        .send({
          name: "Test User",
          email: "invalid-email",
          password: "validPassword123"
        })
        .expect(400);
      expect(responseInvalidEmail.body.error).toBeDefined();

      const responseEmptyName = await request(app)
        .post("/auth/register")
        .send({
          name: "",
          email: "empty-name@example.com",
          password: "validPassword123"
        })
        .expect(400);
      expect(responseEmptyName.body.error).toBeDefined();
    });

    it("should return 409 when user already exists", async () => {
      // Register user first time
      await request(app)
        .post("/auth/register")
        .send(testUser)
        .expect(201);

      // Try to register same user again
      const response = await request(app)
        .post("/auth/register")
        .send(testUser)
        .expect(409);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /auth/login", () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post("/auth/register")
        .send(testUser);
    });

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"]![0]).toContain("auth_token");
      expect(response.body).toBeDefined();
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword"
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it("should return 401 for non-existent user", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "nonexistent@test.com",
          password: "password123"
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /auth/profile", () => {
    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post("/auth/register")
        .send(testUser);

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const cookies = loginResponse.headers["set-cookie"];
      authToken = cookies![0]!.split(";")[0]!.split("=")[1]!;
    });

    it("should return user profile with valid token", async () => {
      const response = await request(app)
        .get("/auth/profile")
        .set("Cookie", [`auth_token=${authToken}`])
        .expect(200);
      console.log(response.body);

      expect(response.body).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.password).toBeUndefined();
    });

    it("should return 401 without token", async () => {
      const response = await request(app)
        .get("/auth/profile")
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it("should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/auth/profile")
        .set("Cookie", ["auth_token=invalid_token"])
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /auth/authenticate", () => {
    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post("/auth/register")
        .send(testUser);

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const cookies = loginResponse.headers["set-cookie"];
      authToken = cookies![0]!.split(";")[0]!.split("=")[1]!;
    });

    it("should authenticate valid token", async () => {
      const response = await request(app)
        .get("/auth/authenticate")
        .set("Cookie", [`auth_token=${authToken}`])
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.userId).toBeDefined();
    });

    it("should return 401 without token", async () => {
      const response = await request(app)
        .get("/auth/authenticate")
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it("should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/auth/authenticate")
        .set("Cookie", ["auth_token=invalid_token"])
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("POST /auth/logout", () => {
    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post("/auth/register")
        .send(testUser);

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const cookies = loginResponse.headers["set-cookie"];
      authToken = cookies![0]!.split(";")[0]!.split("=")[1]!;
    });

    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .set("Cookie", [`auth_token=${authToken}`])
        .expect(204);

      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"]![0]).toContain("auth_token=;");
    });

    it("should return 401 without token", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("DELETE /auth/delete", () => {
    beforeEach(async () => {
      // Register and login to get token
      await request(app)
        .post("/auth/register")
        .send(testUser);

      const loginResponse = await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        });

      const cookies = loginResponse.headers["set-cookie"];
      authToken = cookies![0]!.split(";")[0]!.split("=")[1]!;
    });

    it("should delete user account", async () => {
      const response = await request(app)
        .delete("/auth/delete")
        .set("Cookie", [`auth_token=${authToken}`])
        .expect(204);

      expect(response.body).toBeDefined();

      // Verify user is deleted by trying to login
      await request(app)
        .post("/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(401);
    });

    it("should return 401 without token", async () => {
      const response = await request(app)
        .delete("/auth/delete")
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });
});

describe("Health Check", () => {
  it("should return 200 for health check", async () => {
    const response = await request(app)
      .get("/health/healthz")
      .expect(200);

    expect(response.text).toBe("OK");
  });
});

describe("Root Endpoint", () => {
  it("should return welcome message", async () => {
    const response = await request(app)
      .get("/")
      .expect(200);

    expect(response.text).toBe("Welcome to the API");
  });
});
