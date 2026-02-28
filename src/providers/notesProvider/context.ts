import { createContext } from "react";

export const RELATED_TO_TYPE: Record<number, { label: string }> = {
  1: { label: "Client"      },
  2: { label: "Opportunity" },
  3: { label: "Proposal"    },
  4: { label: "Contract"    },
  5: { label: "Activity"    },
};

export interface INote {
  id: string;
  content: string;
  relatedToType: number;
  relatedToTypeName?: string;
  relatedToId: string;
  isPrivate: boolean;
  createdById?: string;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface INotePagedResult {
  items: INote[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface INotesQuery {
  relatedToType?: number;
  relatedToId?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ICreateNotePayload {
  content: string;
  relatedToType: number;
  relatedToId: string;
  isPrivate: boolean;
}

export interface IUpdateNotePayload {
  content: string;
  isPrivate: boolean;
}

export interface INotesStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  notes?: INotePagedResult;
  note?: INote;
  createdNote?: INote;
  updatedNote?: INote;
  deletedNoteId?: string;
}

export interface INotesActionContext {
  getNotes: (query?: INotesQuery) => void;
  getNote: (id: string) => void;
  createNote: (payload: ICreateNotePayload) => void;
  updateNote: (id: string, payload: IUpdateNotePayload) => void;
  deleteNote: (id: string) => void;
}

export const INITIAL_STATE: INotesStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const NotesStateContext =
  createContext<INotesStateContext>(INITIAL_STATE);

export const NotesActionContext =
  createContext<INotesActionContext | undefined>(undefined);