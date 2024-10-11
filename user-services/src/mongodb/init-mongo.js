db.createUser({
  user: "first-user",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "my_db",
    },
  ],
});
db.createCollection("test");
