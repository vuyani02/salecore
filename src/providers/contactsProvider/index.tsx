"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  ContactsStateContext,
  ContactsActionContext,
  type IContactsActionContext,
  type IContactsQuery,
  type ICreateContactPayload,
  type IUpdateContactPayload,
  type IContactPagedResult,
  type IContact,
} from "./context";
import { ContactsReducer } from "./reducer";
import {
  getContactsPending, getContactsSuccess, getContactsError,
  getContactPending,  getContactSuccess,  getContactError,
  createContactPending, createContactSuccess, createContactError,
  updateContactPending, updateContactSuccess, updateContactError,
  deleteContactPending, deleteContactSuccess, deleteContactError,
} from "./actions";

export const ContactsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ContactsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getContacts = async (query?: IContactsQuery) => {
    dispatch(getContactsPending());
    await instance
      .get<IContactPagedResult>("/api/contacts", { params: query })
      .then((res) => dispatch(getContactsSuccess(res.data)))
      .catch(() => { dispatch(getContactsError()); message.error("Failed to load contacts"); });
  };

  const getContact = async (id: string) => {
    dispatch(getContactPending());
    await instance
      .get<IContact>(`/api/contacts/${id}`)
      .then((res) => dispatch(getContactSuccess(res.data)))
      .catch(() => { dispatch(getContactError()); message.error("Failed to load contact"); });
  };

  const createContact = async (payload: ICreateContactPayload) => {
    dispatch(createContactPending());
    await instance
      .post<IContact>("/api/contacts", payload)
      .then((res) => { dispatch(createContactSuccess(res.data)); message.success("Contact created"); })
      .catch(() => { dispatch(createContactError()); message.error("Failed to create contact"); });
  };

  const updateContact = async (id: string, payload: IUpdateContactPayload) => {
    dispatch(updateContactPending());
    await instance
      .put<IContact>(`/api/contacts/${id}`, payload)
      .then((res) => { dispatch(updateContactSuccess(res.data)); message.success("Contact updated"); })
      .catch(() => { dispatch(updateContactError()); message.error("Failed to update contact"); });
  };

  const deleteContact = async (id: string) => {
    dispatch(deleteContactPending());
    await instance
      .delete(`/api/contacts/${id}`)
      .then(() => { dispatch(deleteContactSuccess(id)); message.success("Contact deleted"); })
      .catch(() => { dispatch(deleteContactError()); message.error("Failed to delete contact"); });
  };

  const actions: IContactsActionContext = {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
  };

  return (
    <ContactsStateContext.Provider value={state}>
      <ContactsActionContext.Provider value={actions}>
        {children}
      </ContactsActionContext.Provider>
    </ContactsStateContext.Provider>
  );
};

export const useContactsState = () => {
  const context = useContext(ContactsStateContext);
  if (!context) throw new Error("useContactsState must be used within ContactsProvider");
  return context;
};

export const useContactsActions = () => {
  const context = useContext(ContactsActionContext);
  if (!context) throw new Error("useContactsActions must be used within ContactsProvider");
  return context;
};