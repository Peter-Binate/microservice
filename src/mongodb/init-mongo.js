db.createUser({
  user: "gana",
  pwd: "test_g",
  roles: [
    {
      role: "readWrite",
      db: "my_db",
    },
  ],
});
db.createCollection("test");
