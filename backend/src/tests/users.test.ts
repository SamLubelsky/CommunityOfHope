import { createTables } from '../config/database';
import { createUser } from '../models/userModel';
import { app } from '../index';
import request from 'supertest';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";

beforeEach(async () => {
  // await deleteAllTables();
  await createTables();
});
async function loginAsAdmin() {
  await createUser("Admin", ADMIN_PASSWORD, "Admin", "Admin", "Admin", "https://example.com/profile.jpg");
  const response = await request(app).post("/api/login").send({
    username: "Admin",
    password: ADMIN_PASSWORD
  });
  const cookie = response.headers['set-cookie'];
  return cookie;
}

describe("Test getting all users as admin", () => {
  test("Should return all users with admin role", async () => {
    const cookie = await loginAsAdmin();
    const response = await request(app).get("/api/users").set("Cookie", cookie);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.users.length).toBe(1);
  });
});


