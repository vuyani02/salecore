import { createAction } from "redux-actions";
import type { INotesStateContext, INote, INotePagedResult } from "./context";

export enum NotesActionEnums {
  getNotesPending = "GET_NOTES_PENDING",
  getNotesSuccess = "GET_NOTES_SUCCESS",
  getNotesError   = "GET_NOTES_ERROR",

  getNotePending = "GET_NOTE_PENDING",
  getNoteSuccess = "GET_NOTE_SUCCESS",
  getNoteError   = "GET_NOTE_ERROR",

  createNotePending = "CREATE_NOTE_PENDING",
  createNoteSuccess = "CREATE_NOTE_SUCCESS",
  createNoteError   = "CREATE_NOTE_ERROR",

  updateNotePending = "UPDATE_NOTE_PENDING",
  updateNoteSuccess = "UPDATE_NOTE_SUCCESS",
  updateNoteError   = "UPDATE_NOTE_ERROR",

  deleteNotePending = "DELETE_NOTE_PENDING",
  deleteNoteSuccess = "DELETE_NOTE_SUCCESS",
  deleteNoteError   = "DELETE_NOTE_ERROR",
}

const pending = (type: string) =>
  createAction<INotesStateContext>(type, () => ({ isPending: true, isSuccess: false, isError: false }));

const error = (type: string) =>
  createAction<INotesStateContext>(type, () => ({ isPending: false, isSuccess: false, isError: true }));

export const getNotesPending = pending(NotesActionEnums.getNotesPending);
export const getNotesSuccess = createAction<INotesStateContext, INotePagedResult>(
  NotesActionEnums.getNotesSuccess,
  (notes) => ({ isPending: false, isSuccess: true, isError: false, notes })
);
export const getNotesError = error(NotesActionEnums.getNotesError);

export const getNotePending = pending(NotesActionEnums.getNotePending);
export const getNoteSuccess = createAction<INotesStateContext, INote>(
  NotesActionEnums.getNoteSuccess,
  (note) => ({ isPending: false, isSuccess: true, isError: false, note })
);
export const getNoteError = error(NotesActionEnums.getNoteError);

export const createNotePending = pending(NotesActionEnums.createNotePending);
export const createNoteSuccess = createAction<INotesStateContext, INote>(
  NotesActionEnums.createNoteSuccess,
  (createdNote) => ({ isPending: false, isSuccess: true, isError: false, createdNote })
);
export const createNoteError = error(NotesActionEnums.createNoteError);

export const updateNotePending = pending(NotesActionEnums.updateNotePending);
export const updateNoteSuccess = createAction<INotesStateContext, INote>(
  NotesActionEnums.updateNoteSuccess,
  (updatedNote) => ({ isPending: false, isSuccess: true, isError: false, updatedNote })
);
export const updateNoteError = error(NotesActionEnums.updateNoteError);

export const deleteNotePending = pending(NotesActionEnums.deleteNotePending);
export const deleteNoteSuccess = createAction<INotesStateContext, string>(
  NotesActionEnums.deleteNoteSuccess,
  (deletedNoteId) => ({ isPending: false, isSuccess: true, isError: false, deletedNoteId })
);
export const deleteNoteError = error(NotesActionEnums.deleteNoteError);