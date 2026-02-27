import { createAction } from "redux-actions";
import type { IClientsStateContext, Client, ClientPagedResult, ClientStats } from "./context";

export enum ClientsActionEnums {
  getClientsPending = "GET_CLIENTS_PENDING",
  getClientsSuccess = "GET_CLIENTS_SUCCESS",
  getClientsError   = "GET_CLIENTS_ERROR",

  getClientPending = "GET_CLIENT_PENDING",
  getClientSuccess = "GET_CLIENT_SUCCESS",
  getClientError   = "GET_CLIENT_ERROR",

  getClientStatsPending = "GET_CLIENT_STATS_PENDING",
  getClientStatsSuccess = "GET_CLIENT_STATS_SUCCESS",
  getClientStatsError   = "GET_CLIENT_STATS_ERROR",

  createClientPending = "CREATE_CLIENT_PENDING",
  createClientSuccess = "CREATE_CLIENT_SUCCESS",
  createClientError   = "CREATE_CLIENT_ERROR",

  updateClientPending = "UPDATE_CLIENT_PENDING",
  updateClientSuccess = "UPDATE_CLIENT_SUCCESS",
  updateClientError   = "UPDATE_CLIENT_ERROR",

  deleteClientPending = "DELETE_CLIENT_PENDING",
  deleteClientSuccess = "DELETE_CLIENT_SUCCESS",
  deleteClientError   = "DELETE_CLIENT_ERROR",
}

// ── Get All ───────────────────────────────────────────────────────────────────
export const getClientsPending = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getClientsSuccess = createAction<IClientsStateContext, ClientPagedResult>(
  ClientsActionEnums.getClientsSuccess,
  (clients) => ({ isPending: false, isSuccess: true, isError: false, clients })
);
export const getClientsError = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Get Single ────────────────────────────────────────────────────────────────
export const getClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getClientSuccess = createAction<IClientsStateContext, Client>(
  ClientsActionEnums.getClientSuccess,
  (client) => ({ isPending: false, isSuccess: true, isError: false, client })
);
export const getClientError = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Get Stats ─────────────────────────────────────────────────────────────────
export const getClientStatsPending = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientStatsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getClientStatsSuccess = createAction<IClientsStateContext, ClientStats>(
  ClientsActionEnums.getClientStatsSuccess,
  (clientStats) => ({ isPending: false, isSuccess: true, isError: false, clientStats })
);
export const getClientStatsError = createAction<IClientsStateContext>(
  ClientsActionEnums.getClientStatsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Create ────────────────────────────────────────────────────────────────────
export const createClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.createClientPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const createClientSuccess = createAction<IClientsStateContext, Client>(
  ClientsActionEnums.createClientSuccess,
  (createdClient) => ({ isPending: false, isSuccess: true, isError: false, createdClient })
);
export const createClientError = createAction<IClientsStateContext>(
  ClientsActionEnums.createClientError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Update ────────────────────────────────────────────────────────────────────
export const updateClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.updateClientPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const updateClientSuccess = createAction<IClientsStateContext, Client>(
  ClientsActionEnums.updateClientSuccess,
  (updatedClient) => ({ isPending: false, isSuccess: true, isError: false, updatedClient })
);
export const updateClientError = createAction<IClientsStateContext>(
  ClientsActionEnums.updateClientError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Delete ────────────────────────────────────────────────────────────────────
export const deleteClientPending = createAction<IClientsStateContext>(
  ClientsActionEnums.deleteClientPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const deleteClientSuccess = createAction<IClientsStateContext, string>(
  ClientsActionEnums.deleteClientSuccess,
  (deletedClientId) => ({ isPending: false, isSuccess: true, isError: false, deletedClientId })
);
export const deleteClientError = createAction<IClientsStateContext>(
  ClientsActionEnums.deleteClientError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);