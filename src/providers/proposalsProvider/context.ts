import { createContext } from "react";

export interface IProposalLineItem {
  id: string;
  productServiceName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  lineTotal?: number;
}

export interface IProposal {
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
  lineItems?: IProposalLineItem[];
  rejectionReason?: string;
  createdAt?: string;
}

export interface IProposalPagedResult {
  items: IProposal[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface IProposalsQuery {
  clientId?: string;
  opportunityId?: string;
  status?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface ICreateLineItemPayload {
  productServiceName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface ICreateProposalPayload {
  opportunityId: string;       // ← replace clientId with this
  title: string;
  description?: string;
  currency?: string;
  validUntil?: string;
  lineItems: ICreateLineItemPayload[];
}

export interface IUpdateProposalPayload {
  title?: string;
  description?: string;
  currency?: string;
  validUntil?: string;
}

export interface IRejectProposalPayload {
  reason: string;
}

export interface IProposalsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  proposals?: IProposalPagedResult;
  proposal?: IProposal;
  createdProposal?: IProposal;
  updatedProposal?: IProposal;
  deletedProposalId?: string;
}

export interface IProposalsActionContext {
  getProposals: (query?: IProposalsQuery) => void;
  getProposal: (id: string) => void;
  createProposal: (payload: ICreateProposalPayload) => void;
  updateProposal: (id: string, payload: IUpdateProposalPayload) => void;
  deleteProposal: (id: string) => void;
  addLineItem: (proposalId: string, payload: ICreateLineItemPayload) => void;
  updateLineItem: (proposalId: string, lineItemId: string, payload: ICreateLineItemPayload) => void;
  deleteLineItem: (proposalId: string, lineItemId: string) => void;
  submitProposal: (id: string) => void;
  approveProposal: (id: string) => void;
  rejectProposal: (id: string, payload: IRejectProposalPayload) => void;
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