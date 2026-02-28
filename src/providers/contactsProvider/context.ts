import { createContext } from "react";

export interface IContact {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  clientId?: string;
  clientName?: string;
  isPrimary?: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IContactPagedResult {
  items: IContact[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface IContactsQuery {
  clientId?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ICreateContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  clientId?: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface IUpdateContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  isPrimary?: boolean;
  notes?: string;
}

export interface IContactsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  contacts?: IContactPagedResult;
  contact?: IContact;
  createdContact?: IContact;
  updatedContact?: IContact;
  deletedContactId?: string;
}

export interface IContactsActionContext {
  getContacts: (query?: IContactsQuery) => void;
  getContact: (id: string) => void;
  createContact: (payload: ICreateContactPayload) => void;
  updateContact: (id: string, payload: IUpdateContactPayload) => void;
  deleteContact: (id: string) => void;
}

export const INITIAL_STATE: IContactsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const ContactsStateContext =
  createContext<IContactsStateContext>(INITIAL_STATE);

export const ContactsActionContext =
  createContext<IContactsActionContext | undefined>(undefined);