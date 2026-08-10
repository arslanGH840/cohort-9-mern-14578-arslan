const User = require("./user");
const Note = require("./note");

User.hasMany(Note, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

Note.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
});

module.exports = { User, Note };
