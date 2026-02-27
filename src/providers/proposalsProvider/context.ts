import { createContext } from "react";

export interface ProposalLineItem {
  id: string;
  productServiceName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  lineTotal?: number;
}

export interface Proposal {
  id: string;
  opportunityId?: string;
  opportunityTitle?: string;
  clientId?: string;
  clientName?: string;
  title: string;
  description?: string;
  currency: string;
  validUntil?: string;
  status: number;
  statusName?: string;
  subtotal?: number;
  totalDiscount?: number;
  totalTax?: number;
  totalAmount?: number;
  lineItems?: ProposalLineItem[];
  createdAt?: string;
}

export interface ProposalPagedResult {
  items: Proposal[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface ProposalsQuery {
  clientId?: string;
  opportunityId?: string;
  status?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateLineItemPayload {
  productServiceName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface CreateProposalPayload {
  opportunityId: string;       // ← replace clientId with this
  title: string;
  description?: string;
  currency?: string;
  validUntil?: string;
  lineItems: CreateLineItemPayload[];
}

export interface UpdateProposalPayload {
  title?: string;
  description?: string;
  currency?: string;
  validUntil?: string;
}

export interface RejectProposalPayload {
  reason: string;
}

export interface IProposalsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  proposals?: ProposalPagedResult;
  proposal?: Proposal;
  createdProposal?: Proposal;
  updatedProposal?: Proposal;
  deletedProposalId?: string;
}

export interface IProposalsActionContext {
  getProposals: (query?: ProposalsQuery) => void;
  getProposal: (id: string) => void;
  createProposal: (payload: CreateProposalPayload) => void;
  updateProposal: (id: string, payload: UpdateProposalPayload) => void;
  deleteProposal: (id: string) => void;
  addLineItem: (proposalId: string, payload: CreateLineItemPayload) => void;
  updateLineItem: (proposalId: string, lineItemId: string, payload: CreateLineItemPayload) => void;
  deleteLineItem: (proposalId: string, lineItemId: string) => void;
  submitProposal: (id: string) => void;
  approveProposal: (id: string) => void;
  rejectProposal: (id: string, payload: RejectProposalPayload) => void;
}

export const INITIAL_STATE: IProposalsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const ProposalsStateContext =
  createContext<IProposalsStateContext>(INITIAL_STATE);

export const ProposalsActionContext =
  createContext<IProposalsActionContext | undefined>(undefined);