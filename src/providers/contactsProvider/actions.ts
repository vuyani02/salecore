import { createAction } from "redux-actions";
import type { IContactsStateContext, IContact, IContactPagedResult } from "./context";

export enum ContactsActionEnums {
  getContactsPending = "GET_CONTACTS_PENDING",
  getContactsSuccess = "GET_CONTACTS_SUCCESS",
  getContactsError   = "GET_CONTACTS_ERROR",

  getContactPending = "GET_CONTACT_PENDING",
  getContactSuccess = "GET_CONTACT_SUCCESS",
  getContactError   = "GET_CONTACT_ERROR",

  createContactPending = "CREATE_CONTACT_PENDING",
  createContactSuccess = "CREATE_CONTACT_SUCCESS",
  createContactError   = "CREATE_CONTACT_ERROR",

  updateContactPending = "UPDATE_CONTACT_PENDING",
  updateContactSuccess = "UPDATE_CONTACT_SUCCESS",
  updateContactError   = "UPDATE_CONTACT_ERROR",

  deleteContactPending = "DELETE_CONTACT_PENDING",
  deleteContactSuccess = "DELETE_CONTACT_SUCCESS",
  deleteContactError   = "DELETE_CONTACT_ERROR",
}

const pending = (type: string) =>
  createAction<IContactsStateContext>(type, () => ({ isPending: true, isSuccess: false, isError: false }));

const error = (type: string) =>
  createAction<IContactsStateContext>(type, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Get All ───────────────────────────────────────────────────────────────────
export const getContactsPending = pending(ContactsActionEnums.getContactsPending);
export const getContactsSuccess = createAction<IContactsStateContext, IContactPagedResult>(
  ContactsActionEnums.getContactsSuccess,
  (contacts) => ({ isPending: false, isSuccess: true, isError: false, contacts })
);
export const getContactsError = error(ContactsActionEnums.getContactsError);

// ── Get Single ────────────────────────────────────────────────────────────────
export const getContactPending = pending(ContactsActionEnums.getContactPending);
export const getContactSuccess = createAction<IContactsStateContext, IContact>(
  ContactsActionEnums.getContactSuccess,
  (contact) => ({ isPending: false, isSuccess: true, isError: false, contact })
);
export const getContactError = error(ContactsActionEnums.getContactError);

// ── Create ────────────────────────────────────────────────────────────────────
export const createContactPending = pending(ContactsActionEnums.createContactPending);
export const createContactSuccess = createAction<IContactsStateContext, IContact>(
  ContactsActionEnums.createContactSuccess,
  (createdContact) => ({ isPending: false, isSuccess: true, isError: false, createdContact })
);
export const createContactError = error(ContactsActionEnums.createContactError);

// ── Update ────────────────────────────────────────────────────────────────────
export const updateContactPending = pending(ContactsActionEnums.updateContactPending);
export const updateContactSuccess = createAction<IContactsStateContext, IContact>(
  ContactsActionEnums.updateContactSuccess,
  (updatedContact) => ({ isPending: false, isSuccess: true, isError: false, updatedContact })
);
export const updateContactError = error(ContactsActionEnums.updateContactError);

// ── Delete ────────────────────────────────────────────────────────────────────
export const deleteContactPending = pending(ContactsActionEnums.deleteContactPending);
export const deleteContactSuccess = createAction<IContactsStateContext, string>(
  ContactsActionEnums.deleteContactSuccess,
  (deletedContactId) => ({ isPending: false, isSuccess: true, isError: false, deletedContactId })
);
export const deleteContactError = error(ContactsActionEnums.deleteContactError);