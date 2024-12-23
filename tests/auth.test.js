const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./server.js"); // Your Express app
const User = require("./Modules/userModel.js");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Authentication API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      first_name: "Khadija",
      last_name: "Liman",
      email: "Khadija@gmail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("Khadija@gmail.com");
  });

  it("should not register a user with an existing email", async () => {
    await User.create({
      first_name: "Fatimah",
      last_name: "Aliyu",
      email: "FatimahAliyu@gmail.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/signup").send({
      first_name: "Hauwa",
      last_name: "Aliyu",
      email: "Hauwa@gmail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("duplicate");
  });

  it("should log in a user with valid credentials", async () => {
    const user = await User.create({
      first_name: "Hauwa",
      last_name: "Aliyu",
      email: "john@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/signin").send({
      email: "Hauwa@gmail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should reject login with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "invalid@gmail.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });
});
