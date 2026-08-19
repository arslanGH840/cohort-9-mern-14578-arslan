const { Note } = require("../models");
const { Op } = require("sequelize");

const findAllByUser = async (
  userId,
  { limit, offset, sortBy, order, search },
) => {
  try {
    const where = { user_id: userId };
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Note.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
    });

    return { count, rows };
  } catch (error) {
    throw new Error(`Failed to fetch notes: ${error.message}`);
  }
};

const findByIdAndUser = async (id, userId) => {
  try {
    return await Note.findOne({ where: { id, user_id: userId } });
  } catch (error) {
    throw new Error(`Failed to fetch note: ${error.message}`);
  }
};

const createNote = async ({ userId, title, body }) => {
  try {
    return await Note.create({ user_id: userId, title, body });
  } catch (error) {
    throw new Error(`Failed to create note: ${error.message}`);
  }
};

const updateNote = async (note, { title, body }) => {
  try {
    if (title !== undefined) note.title = title;
    if (body !== undefined) note.body = body;
    return await note.save();
  } catch (error) {
    throw new Error(`Failed to update note: ${error.message}`);
  }
};

const deleteNote = async (note) => {
  try {
    return await note.destroy();
  } catch (error) {
    throw new Error(`Failed to delete note: ${error.message}`);
  }
};

module.exports = {
  findAllByUser,
  findByIdAndUser,
  createNote,
  updateNote,
  deleteNote,
};
