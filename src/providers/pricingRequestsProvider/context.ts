import { createContext } from "react";

// ── Enums ─────────────────────────────────────────────────────────────────────
// PricingRequestStatus: 1=Pending, 2=InProgress, 3=Completed
// Priority:             1=Low, 2=Medium, 3=High, 4=Urgent

export interface PricingRequest {
  id: string;
  opportunityId?: string;
  opportunityTitle?: string;
  title: string;
  description?: string;
  assignedToId?: string;
  assignedToName?: string;
  requestedById?: string;
  requestedByName?: string;
  priority: number;
  priorityName?: string;
  status: number;
  statusName?: string;
  requiredByDate?: string;
  createdAt?: string;
}

export interface PricingRequestPagedResult {
  items: PricingRequest[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface PricingRequestsQuery {
  status?: number;
  priority?: number;
  assignedToId?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreatePricingRequestPayload {
  opportunityId?: string;
  title: string;
  description?: string;
  assignedToId?: string;
  priority: number;
  requiredByDate?: string;
}

export interface UpdatePricingRequestPayload extends CreatePricingRequestPayload {}

export interface AssignPricingRequestPayload {
  userId: string;
}

export interface IPricingRequestsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  pricingRequests?: PricingRequestPagedResult;
  pricingRequest?: PricingRequest;
  myRequests?: PricingRequestPagedResult;
  pendingRequests?: PricingRequestPagedResult;
  createdPricingRequest?: PricingRequest;
  updatedPricingRequest?: PricingRequest;
  deletedPricingRequestId?: string;
}

export interface IPricingRequestsActionContext {
  getPricingRequests: (query?: PricingRequestsQuery) => void;
  getPricingRequest: (id: string) => void;
  getMyRequests: (query?: PricingRequestsQuery) => void;
  getPendingRequests: (query?: PricingRequestsQuery) => void;
  createPricingRequest: (payload: CreatePricingRequestPayload) => void;
  updatePricingRequest: (id: string, payload: UpdatePricingRequestPayload) => void;
  assignPricingRequest: (id: string, payload: AssignPricingRequestPayload) => void;
  completePricingRequest: (id: string) => void;
  deletePricingRequest: (id: string) => void;
}

export const INITIAL_STATE: IPricingRequestsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const PricingRequestsStateContext =
  createContext<IPricingRequestsStateContext>(INITIAL_STATE);

export const PricingRequestsActionContext =
  createContext<IPricingRequestsActionContext | undefined>(undefined);