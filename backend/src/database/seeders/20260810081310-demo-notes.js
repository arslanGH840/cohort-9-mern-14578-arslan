"use strict";

module.exports = {
  async up(queryInterface) {
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
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("notes", null, {});
  },
};
