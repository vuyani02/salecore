"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  NotesStateContext,
  NotesActionContext,
  type INotesActionContext,
  type INotesQuery,
  type ICreateNotePayload,
  type IUpdateNotePayload,
  type INotePagedResult,
  type INote,
} from "./context";
import { NotesReducer } from "./reducer";
import {
  getNotesPending, getNotesSuccess, getNotesError,
  getNotePending,  getNoteSuccess,  getNoteError,
  createNotePending, createNoteSuccess, createNoteError,
  updateNotePending, updateNoteSuccess, updateNoteError,
  deleteNotePending, deleteNoteSuccess, deleteNoteError,
} from "./actions";

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(NotesReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getNotes = async (query?: INotesQuery) => {
    dispatch(getNotesPending());
    await instance
      .get<INotePagedResult>("/api/notes", { params: query })
      .then((res) => dispatch(getNotesSuccess(res.data)))
      .catch(() => { dispatch(getNotesError()); message.error("Failed to load notes"); });
  };

  const getNote = async (id: string) => {
    dispatch(getNotePending());
    await instance
      .get<INote>(`/api/notes/${id}`)
      .then((res) => dispatch(getNoteSuccess(res.data)))
      .catch(() => { dispatch(getNoteError()); message.error("Failed to load note"); });
  };

  const createNote = async (payload: ICreateNotePayload) => {
    dispatch(createNotePending());
    await instance
      .post<INote>("/api/notes", payload)
      .then((res) => { dispatch(createNoteSuccess(res.data)); message.success("Note added"); })
      .catch(() => { dispatch(createNoteError()); message.error("Failed to add note"); });
  };

  const updateNote = async (id: string, payload: IUpdateNotePayload) => {
    dispatch(updateNotePending());
    await instance
      .put<INote>(`/api/notes/${id}`, payload)
      .then((res) => { dispatch(updateNoteSuccess(res.data)); message.success("Note updated"); })
      .catch(() => { dispatch(updateNoteError()); message.error("Failed to update note"); });
  };

  const deleteNote = async (id: string) => {
    dispatch(deleteNotePending());
    await instance
      .delete(`/api/notes/${id}`)
      .then(() => { dispatch(deleteNoteSuccess(id)); message.success("Note deleted"); })
      .catch(() => { dispatch(deleteNoteError()); message.error("Failed to delete note"); });
  };

  const actions: INotesActionContext = {
    getNotes, getNote, createNote, updateNote, deleteNote,
  };

  return (
    <NotesStateContext.Provider value={state}>
      <NotesActionContext.Provider value={actions}>
        {children}
      </NotesActionContext.Provider>
    </NotesStateContext.Provider>
  );
};

export const useNotesState = () => {
  const context = useContext(NotesStateContext);
  if (!context) throw new Error("useNotesState must be used within NotesProvider");
  return context;
};

export const useNotesActions = () => {
  const context = useContext(NotesActionContext);
  if (!context) throw new Error("useNotesActions must be used within NotesProvider");
  return context;
};