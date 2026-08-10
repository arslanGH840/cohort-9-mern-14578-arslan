"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("Demo@12345", 10);

    await queryInterface.bulkInsert("users", [
      {
        username: "demo_user",
        email: "demo@notesapp.com",
        password_hash: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", { username: "demo_user" });
  },
};
