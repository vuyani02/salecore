import { createContext } from "react";

export interface Client {
  id: string;
  name: string;
  industry?: string;
  clientType?: number;
  website?: string;
  billingAddress?: string;
  taxNumber?: string;
  companySize?: string;
  isActive?: boolean;
  contactsCount?: number;
  contractsCount?: number;
  opportunitiesCount?: number;
  createdByName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientStats {
  opportunitiesCount: number;
  contractsCount: number;
  totalContractValue: number;
}

export interface ClientPagedResult {
  items: Client[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface ClientsQuery {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  industry?: string;
  clientType?: number;
  isActive?: boolean;
}

export interface CreateClientPayload {
  name: string;
  industry?: string;
  clientType?: number;
  website?: string;
  billingAddress?: string;
  taxNumber?: string;
  companySize?: string;
}

export interface UpdateClientPayload extends CreateClientPayload {
  isActive?: boolean;
}

export interface IClientsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  clients?: ClientPagedResult;
  client?: Client;
  clientStats?: ClientStats;
  createdClient?: Client;
  updatedClient?: Client;
  deletedClientId?: string;
}

export interface IClientsActionContext {
  getClients: (query?: ClientsQuery) => void;
  getClient: (id: string) => void;
  getClientStats: (id: string) => void;
  createClient: (payload: CreateClientPayload) => void;
  updateClient: (id: string, payload: UpdateClientPayload) => void;
  deleteClient: (id: string) => void;
}

export const INITIAL_STATE: IClientsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const ClientsStateContext =
  createContext<IClientsStateContext>(INITIAL_STATE);

export const ClientsActionContext =
  createContext<IClientsActionContext | undefined>(undefined);