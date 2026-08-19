const noteService = require("../services/noteService");

const list = async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 20,
      sortBy = "updated_at",
      order = "DESC",
      search,
    } = req.query;

    const result = await noteService.listNotes(req.user.id, {
      page: Number(page),
      pageSize: Number(pageSize),
      sortBy,
      order,
      search,
    });

    res.status(200).json({
      success: true,
      data: {
        notes: result.notes,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const note = await noteService.create(req.user.id, { title, body });

    res.status(201).json({
      success: true,
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const note = await noteService.update(req.params.id, req.user.id, {
      title,
      body,
    });

    res.status(200).json({
      success: true,
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await noteService.remove(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      data: { message: "Note deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { list, getById, create, update, remove };
