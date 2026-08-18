const {
  findAllByUser,
  findByIdAndUser,
  createNote,
  updateNote,
  deleteNote,
} = require("../repositories/noteRepository");
const logger = require("../config/logger");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

const listNotes = async (userId, { page, pageSize, sortBy, order, search }) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await findAllByUser(userId, {
    limit,
    offset,
    sortBy,
    order,
    search,
  });

  return {
    notes: rows,
    pagination: {
      page,
      pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

const getNoteById = async (id, userId) => {
  const note = await findByIdAndUser(id, userId);
  if (!note) {
    throw new NotFoundError("Note not found");
  }
  return note;
};

const create = async (userId, { title, body }) => {
  const note = await createNote({ userId, title, body });
  logger.info({ userId, noteId: note.id }, "Note created");
  return note;
};

const update = async (id, userId, { title, body }) => {
  const note = await findByIdAndUser(id, userId);
  if (!note) {
    throw new NotFoundError("Note not found");
  }
  const updated = await updateNote(note, { title, body });
  logger.info({ userId, noteId: id }, "Note updated");
  return updated;
};

const remove = async (id, userId) => {
  const note = await findByIdAndUser(id, userId);
  if (!note) {
    throw new NotFoundError("Note not found");
  }
  await deleteNote(note);
  logger.info({ userId, noteId: id }, "Note deleted");
};

module.exports = {
  listNotes,
  getNoteById,
  create,
  update,
  remove,
  NotFoundError,
};
