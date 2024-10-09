import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import timerRouter from "../routes/timer.route";
import { Timer } from "../models/timer.model";
import { User } from "../models/user.model";

const app = express();
app.use(express.json());
app.use("/timers", timerRouter);

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
  await Timer.deleteMany({});
  await User.deleteMany({});
});

describe("POST /timers/:userId/add", () => {
  it("should create a new timer for a user", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "password123",
      role: true,
    });

    const newTimer = {
      startTimestamp: 100,
      clickTimestamp: 1100,
    };

    const response = await request(app)
      .post(`/timers/${user._id}/add`)
      .send(newTimer);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.user_id).toBe(String(user._id));
  });

  it("should return 400 if user does not exist", async () => {
    const newTimer = {
      startTimestamp: 100,
      clickTimestamp: 1100,
    };

    const response = await request(app)
      .post(`/timers/60f1a3f3f0a5c420e8b7c3ef/add`)
      .send(newTimer);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /timers/:userId/timers", () => {
  it("should get all timers for a user", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "password123",
      role: true,
    });

    await Timer.create({
      user_id: user._id,
      startTimestamp: 100,
      clickTimestamp: 1100,
      time: 1000,
    });

    const response = await request(app).get(`/timers/${user._id}/timers`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(app).get(
      `/timers/60f1a3f3f0a5c420e8b7c3ef/timers`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /timers/:userId/best", () => {
  it("should get the best timers for a user", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "password123",
      role: true,
    });

    await Timer.create({
      user_id: user._id,
      startTimestamp: 100,
      clickTimestamp: 1100,
      time: 1000,
    });

    await Timer.create({
      user_id: user._id,
      startTimestamp: 200,
      clickTimestamp: 1200,
      time: 900,
    });

    const response = await request(app).get(`/timers/${user._id}/best`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should return 404 if user does not exist", async () => {
    const response = await request(app).get(
      `/timers/60f1a3f3f0a5c420e8b7c3ef/best`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /timers/all", () => {
  it("should get all timers", async () => {
    const user1 = await User.create({
      email: "test1@example.com",
      password: "password123",
      role: true,
    });
    const user2 = await User.create({
      email: "test2@example.com",
      password: "password123",
      role: true,
    });

    await Timer.create({
      user_id: user1._id,
      startTimestamp: 100,
      clickTimestamp: 1100,
      time: 1000,
    });

    await Timer.create({
      user_id: user2._id,
      startTimestamp: 200,
      clickTimestamp: 1200,
      time: 900,
    });

    const response = await request(app).get(`/timers/all`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });
});
