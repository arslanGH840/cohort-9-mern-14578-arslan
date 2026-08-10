"use strict";

module.exports = {
  async up(queryInterface) {
    try {
      const [users] = await queryInterface.sequelize.query(
        "SELECT id FROM users WHERE username = 'demo_user' LIMIT 1;",
      );
      const demoUserId = users[0].id;

      await queryInterface.bulkInsert("notes", [
        {
          user_id: demoUserId,
          title: "Welcome to Notes App",
          body: "<p>This is your first note. Try editing or deleting it!</p>",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: demoUserId,
          title: "Grocery List",
          body: "<ul><li>Milk</li><li>Eggs</li><li>Bread</li></ul>",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: demoUserId,
          title: "Meeting Notes",
          body: "<p>Discuss project timeline and next steps.</p>",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Seeder failed: demo-notes (up)", error);
      throw error;
    }
  },

  async down(queryInterface) {
    try {
      const [users] = await queryInterface.sequelize.query(
        "SELECT id FROM users WHERE username = 'demo_user' LIMIT 1;",
      );

      if (users.length === 0) {
        return;
      }

      const demoUserId = users[0].id;

      await queryInterface.bulkDelete("notes", {
        user_id: demoUserId,
        title: ["Welcome to Notes App", "Grocery List", "Meeting Notes"],
      });
    } catch (error) {
      console.error("Seeder failed: demo-notes (down)", error);
      throw error;
    }
  },
};
