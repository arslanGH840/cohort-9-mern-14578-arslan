const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../database");

class Note extends Model {
  toJSON() {
    const values = { ...this.get() };
    delete values.user_id;
    return values;
  }
}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
      set(value) {
        this.setDataValue(
          "title",
          typeof value === "string" ? value.trim() : value,
        );
      },
    },
    body: {
      type: DataTypes.TEXT("medium"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Note",
    tableName: "notes",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Note;
