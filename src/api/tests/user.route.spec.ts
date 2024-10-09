import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import userRouter from "../routes/user.route";
import { User } from "../models/user.model";

const app = express();
app.use(express.json());
app.use("/users", userRouter);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("POST /users/register", () => {
  it("should create a new user", async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
      role: true,
    };

    const response = await request(app).post("/users/register").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.email).toBe(newUser.email);
  });

  it("should return 400 if user already exists", async () => {
    const existingUser = {
      email: "test@example.com",
      password: "password123",
      role: true,
    };

    await request(app).post("/users/register").send(existingUser);

    const response = await request(app)
      .post("/users/register")
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("POST /users/login", () => {
  beforeEach(async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
      role: true,
    };
    await request(app).post("/users/register").send(newUser);
  });

  it("should log in a user", async () => {
    const loginDto = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app).post("/users/login").send(loginDto);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 if credentials are incorrect", async () => {
    const loginDto = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    const response = await request(app).post("/users/login").send(loginDto);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});

describe("PUT /users/:id", () => {
  it("should update an existing user", async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
      role: true,
    };
    const createdUserResponse = await request(app)
      .post("/users/register")
      .send(newUser);
    const user = createdUserResponse.body;

    const updateUserDto = { email: "updated@example.com" };

    const response = await request(app)
      .put(`/users/${user._id}`)
      .send(updateUserDto);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(updateUserDto.email);
  });
});

describe("DELETE /users/:id", () => {
  it("should delete an existing user", async () => {
    const newUser = {
      email: "updated@example.com",
      password: "password123",
      role: true,
    };
    const createdUserResponse = await request(app)
      .post("/users/register")
      .send(newUser);
    const user = createdUserResponse.body;

    const response = await request(app).delete(`/users/${user._id}`);

    expect(response.status).toBe(204);
  });
});

describe("GET /users/all", () => {
  it("should get all users", async () => {
    await User.create({
      email: "test1@example.com",
      password: "password123",
      role: true,
    });
    await User.create({
      email: "test2@example.com",
      password: "password123",
      role: true,
    });

    const response = await request(app).get("/users/all");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /users/:id", () => {
  it("should get a user by id", async () => {
    const newUser = {
      email: "test@example.com",
      password: "password123",
      role: true,
    };
    const createdUserResponse = await request(app)
      .post("/users/register")
      .send(newUser);
    const user = createdUserResponse.body;

    const response = await request(app).get(`/users/${user._id}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(user.email);
  });
});
