"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  ClientsActionContext,
  ClientsStateContext,
  type IClientsActionContext,
  type ClientsQuery,
  type CreateClientPayload,
  type UpdateClientPayload,
  type ClientPagedResult,
  type Client,
  type ClientStats,
} from "./context";
import { ClientsReducer } from "./reducer";
import {
  getClientsPending, getClientsSuccess, getClientsError,
  getClientPending, getClientSuccess, getClientError,
  getClientStatsPending, getClientStatsSuccess, getClientStatsError,
  createClientPending, createClientSuccess, createClientError,
  updateClientPending, updateClientSuccess, updateClientError,
  deleteClientPending, deleteClientSuccess, deleteClientError,
} from "./actions";

export const ClientsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ClientsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getClients = async (query?: ClientsQuery) => {
    dispatch(getClientsPending());
    await instance
      .get<ClientPagedResult>("/api/clients", { params: query })
      .then((response) => {dispatch(getClientsSuccess(response.data))
      })
      .catch(() => {
        dispatch(getClientsError());
        message.error("Failed to load clients");
      });
  };

  const getClient = async (id: string) => {
    dispatch(getClientPending());
    await instance
      .get<Client>(`/api/clients/${id}`)
      .then((response) => dispatch(getClientSuccess(response.data)))
      .catch(() => {
        dispatch(getClientError());
        message.error("Failed to load client");
      });
  };

  const getClientStats = async (id: string) => {
    dispatch(getClientStatsPending());
    await instance
      .get<ClientStats>(`/api/clients/${id}/stats`)
      .then((response) => dispatch(getClientStatsSuccess(response.data)))
      .catch(() => {
        dispatch(getClientStatsError());
        message.error("Failed to load client stats");
      });
  };

  const createClient = async (payload: CreateClientPayload) => {
    dispatch(createClientPending());
    await instance
      .post<Client>("/api/clients", payload)
      .then((response) => {
        dispatch(createClientSuccess(response.data));
        message.success("Client created");
      })
      .catch(() => {
        dispatch(createClientError());
        message.error("Failed to create client");
      });
  };

  const updateClient = async (id: string, payload: UpdateClientPayload) => {
    dispatch(updateClientPending());
    await instance
      .put<Client>(`/api/clients/${id}`, payload)
      .then((response) => {
        dispatch(updateClientSuccess(response.data));
        message.success("Client updated");
      })
      .catch(() => {
        dispatch(updateClientError());
        message.error("Failed to update client");
      });
  };

  const deleteClient = async (id: string) => {
    dispatch(deleteClientPending());
    await instance
      .delete(`/api/clients/${id}`)
      .then((response) => {
        dispatch(deleteClientSuccess(id));
        console.log(response.data)
        message.success("Client deleted");
      })
      .catch(() => {
        dispatch(deleteClientError());
        message.error("Failed to delete client");
      });
  };

  const actions: IClientsActionContext = {
    getClients, getClient, getClientStats,
    createClient, updateClient, deleteClient,
  };

  return (
    <ClientsStateContext.Provider value={state}>
      <ClientsActionContext.Provider value={actions}>
        {children}
      </ClientsActionContext.Provider>
    </ClientsStateContext.Provider>
  );
};

export const useClientsState = () => {
  const context = useContext(ClientsStateContext);
  if (!context) throw new Error("useClientsState must be used within ClientsProvider");
  return context;
};

export const useClientsActions = () => {
  const context = useContext(ClientsActionContext);
  if (!context) throw new Error("useClientsActions must be used within ClientsProvider");
  return context;
};