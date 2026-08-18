const { Note } = require("../models");

const findAllByUser = async (
  userId,
  { limit, offset, sortBy, order, search },
) => {
  const { Op } = require("sequelize");

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
};

const findByIdAndUser = async (id, userId) => {
  return Note.findOne({ where: { id, user_id: userId } });
};

const createNote = async ({ userId, title, body }) => {
  return Note.create({ user_id: userId, title, body });
};

const updateNote = async (note, { title, body }) => {
  if (title !== undefined) note.title = title;
  if (body !== undefined) note.body = body;
  return note.save();
};

const deleteNote = async (note) => {
  return note.destroy();
};

module.exports = {
  findAllByUser,
  findByIdAndUser,
  createNote,
  updateNote,
  deleteNote,
};
