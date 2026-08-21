import axiosInstance from "../api/axiosInstance";

export const fetchNotes = async ({
  page = 1,
  pageSize = 20,
  sortBy = "updated_at",
  order = "DESC",
  search = "",
}) => {
  const response = await axiosInstance.get("/notes", {
    params: { page, pageSize, sortBy, order, search: search || undefined },
  });
  return response.data.data;
};

export const fetchNoteById = async (id) => {
  const response = await axiosInstance.get(`/notes/${id}`);
  return response.data.data.note;
};

export const createNote = async ({ title, body }) => {
  const response = await axiosInstance.post("/notes", { title, body });
  return response.data.data.note;
};

export const updateNote = async (id, { title, body }) => {
  const response = await axiosInstance.put(`/notes/${id}`, { title, body });
  return response.data.data.note;
};

export const deleteNote = async (id) => {
  const response = await axiosInstance.delete(`/notes/${id}`);
  return response.data.data;
};
