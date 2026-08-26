const { expect } = require("chai");
const sinon = require("sinon");

const noteRepository = require("../../src/repositories/noteRepository");
const noteService = require("../../src/services/noteService");

describe("noteService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getNoteById", () => {
    it("returns the note when owned by the requesting user", async () => {
      sinon
        .stub(noteRepository, "findByIdAndUser")
        .resolves({ id: 1, title: "Test", user_id: 2 });

      const note = await noteService.getNoteById(1, 2);

      expect(note.title).to.equal("Test");
    });

    it("throws NotFoundError when the note doesn't exist or isn't owned by the user", async () => {
      sinon.stub(noteRepository, "findByIdAndUser").resolves(null);

      try {
        await noteService.getNoteById(999, 2);
        expect.fail("Expected getNoteById to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(noteService.NotFoundError);
        expect(error.statusCode).to.equal(404);
      }
    });
  });

  describe("create", () => {
    it("creates a note for the given user", async () => {
      sinon
        .stub(noteRepository, "createNote")
        .resolves({ id: 5, title: "New Note" });

      const note = await noteService.create(2, {
        title: "New Note",
        body: "<p>Body</p>",
      });

      expect(note.id).to.equal(5);
      expect(
        noteRepository.createNote.calledWith({
          userId: 2,
          title: "New Note",
          body: "<p>Body</p>",
        }),
      ).to.be.true;
    });
  });

  describe("update", () => {
    it("updates a note the user owns", async () => {
      const fakeNote = { id: 1, title: "Old Title" };
      sinon.stub(noteRepository, "findByIdAndUser").resolves(fakeNote);
      sinon
        .stub(noteRepository, "updateNote")
        .resolves({ id: 1, title: "New Title" });

      const updated = await noteService.update(1, 2, { title: "New Title" });

      expect(updated.title).to.equal("New Title");
    });

    it("throws NotFoundError when trying to update a note the user doesn't own", async () => {
      sinon.stub(noteRepository, "findByIdAndUser").resolves(null);

      try {
        await noteService.update(1, 999, { title: "Hacked" });
        expect.fail("Expected update to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(noteService.NotFoundError);
      }
    });
  });

  describe("remove", () => {
    it("deletes a note the user owns", async () => {
      const fakeNote = { id: 1 };
      sinon.stub(noteRepository, "findByIdAndUser").resolves(fakeNote);
      sinon.stub(noteRepository, "deleteNote").resolves();

      await noteService.remove(1, 2);

      expect(noteRepository.deleteNote.calledOnce).to.be.true;
    });

    it("throws NotFoundError when trying to delete a note the user doesn't own", async () => {
      sinon.stub(noteRepository, "findByIdAndUser").resolves(null);

      try {
        await noteService.remove(1, 999);
        expect.fail("Expected remove to throw");
      } catch (error) {
        expect(error).to.be.instanceOf(noteService.NotFoundError);
      }
    });
  });

  describe("listNotes", () => {
    it("returns notes with correct pagination metadata", async () => {
      sinon.stub(noteRepository, "findAllByUser").resolves({
        count: 25,
        rows: [{ id: 1 }, { id: 2 }],
      });

      const result = await noteService.listNotes(2, {
        page: 1,
        pageSize: 20,
        sortBy: "updated_at",
        order: "DESC",
      });

      expect(result.pagination.totalItems).to.equal(25);
      expect(result.pagination.totalPages).to.equal(2);
    });
  });
});
