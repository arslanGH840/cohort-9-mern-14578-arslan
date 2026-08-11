"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    try {
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
    } catch (error) {
      console.error("Seeder failed: demo-user (up)", error);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      await queryInterface.bulkDelete("users", { username: "demo_user" });
    } catch (error) {
      console.error("Seeder failed: demo-user (down)", error);
      throw error;
    }
  },
};
