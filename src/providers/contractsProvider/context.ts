import { createContext } from "react";

// ContractStatus: 1=Draft, 2=Active, 3=Expired, 4=Renewed, 5=Cancelled
// RenewalStatus:  1=Pending, 2=Completed, 3=Cancelled

export interface Contract {
  id: string;
  opportunityId?: string;
  opportunityTitle?: string;
  clientId?: string;
  clientName?: string;
  title: string;
  terms?: string;
  contractValue: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  status: number;
  statusName?: string;
  autoRenew?: boolean;
  renewalNoticePeriod?: number;
  ownerId?: string;
  assignedToName?: string;
  createdAt?: string;
}

export interface ContractRenewal {
  id: string;
  contractId: string;
  newStartDate?: string;
  newEndDate?: string;
  newContractValue?: number;
  notes?: string;
  status: number;
  statusName?: string;
  createdAt?: string;
}

export interface ContractPagedResult {
  items: Contract[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface ContractsQuery {
  status?: number;
  clientId?: string;
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface CreateContractPayload {
  clientId?: string;
  opportunityId?: string;
  proposalId?: string;
  title: string;
  terms?: string;
  contractValue: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  autoRenew?: boolean;
  renewalNoticePeriod?: number;
  ownerId?: string;
}

export interface UpdateContractPayload extends CreateContractPayload {}

export interface CreateRenewalPayload {
  newStartDate?: string;
  newEndDate?: string;
  newContractValue?: number;
  notes?: string;
}

export interface IContractsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  contracts?: ContractPagedResult;
  contract?: Contract;
  expiringContracts?: ContractPagedResult;
  renewal?: ContractRenewal;
  createdContract?: Contract;
  updatedContract?: Contract;
  deletedContractId?: string;
}

export interface IContractsActionContext {
  getContracts: (query?: ContractsQuery) => void;
  getContract: (id: string) => void;
  getExpiringContracts: (days?: number) => void;
  createContract: (payload: CreateContractPayload) => void;
  updateContract: (id: string, payload: UpdateContractPayload) => void;
  activateContract: (id: string) => void;
  cancelContract: (id: string) => void;
  createRenewal: (id: string, payload: CreateRenewalPayload) => void;
  completeRenewal: (contractId: string, renewalId: string) => void;
  deleteContract: (id: string) => void;
}

export const INITIAL_STATE: IContractsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const ContractsStateContext =
  createContext<IContractsStateContext>(INITIAL_STATE);

export const ContractsActionContext =
  createContext<IContractsActionContext | undefined>(undefined);