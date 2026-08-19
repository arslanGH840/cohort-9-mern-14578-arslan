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
  try {
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
  } catch (error) {
    logger.error({ err: error, userId }, "Failed to list notes");
    throw error;
  }
};

const getNoteById = async (id, userId) => {
  try {
    const note = await findByIdAndUser(id, userId);
    if (!note) {
      throw new NotFoundError("Note not found");
    }
    return note;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error({ err: error, userId, noteId: id }, "Failed to fetch note");
    throw error;
  }
};

const create = async (userId, { title, body }) => {
  try {
    const note = await createNote({ userId, title, body });
    logger.info({ userId, noteId: note.id }, "Note created");
    return note;
  } catch (error) {
    logger.error({ err: error, userId }, "Failed to create note");
    throw error;
  }
};

const update = async (id, userId, { title, body }) => {
  try {
    const note = await findByIdAndUser(id, userId);
    if (!note) {
      throw new NotFoundError("Note not found");
    }
    const updated = await updateNote(note, { title, body });
    logger.info({ userId, noteId: id }, "Note updated");
    return updated;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error({ err: error, userId, noteId: id }, "Failed to update note");
    throw error;
  }
};

const remove = async (id, userId) => {
  try {
    const note = await findByIdAndUser(id, userId);
    if (!note) {
      throw new NotFoundError("Note not found");
    }
    await deleteNote(note);
    logger.info({ userId, noteId: id }, "Note deleted");
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error({ err: error, userId, noteId: id }, "Failed to delete note");
    throw error;
  }
};

module.exports = {
  listNotes,
  getNoteById,
  create,
  update,
  remove,
  NotFoundError,
};
