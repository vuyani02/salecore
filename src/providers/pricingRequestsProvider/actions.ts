import { createAction } from "redux-actions";
import type {
  IPricingRequestsStateContext,
  PricingRequest,
  PricingRequestPagedResult,
} from "./context";

export enum PricingRequestsActionEnums {
  getPricingRequestsPending = "GET_PRICING_REQUESTS_PENDING",
  getPricingRequestsSuccess = "GET_PRICING_REQUESTS_SUCCESS",
  getPricingRequestsError   = "GET_PRICING_REQUESTS_ERROR",

  getPricingRequestPending  = "GET_PRICING_REQUEST_PENDING",
  getPricingRequestSuccess  = "GET_PRICING_REQUEST_SUCCESS",
  getPricingRequestError    = "GET_PRICING_REQUEST_ERROR",

  getMyRequestsPending      = "GET_MY_PRICING_REQUESTS_PENDING",
  getMyRequestsSuccess      = "GET_MY_PRICING_REQUESTS_SUCCESS",
  getMyRequestsError        = "GET_MY_PRICING_REQUESTS_ERROR",

  getPendingRequestsPending = "GET_PENDING_PRICING_REQUESTS_PENDING",
  getPendingRequestsSuccess = "GET_PENDING_PRICING_REQUESTS_SUCCESS",
  getPendingRequestsError   = "GET_PENDING_PRICING_REQUESTS_ERROR",

  createPricingRequestPending = "CREATE_PRICING_REQUEST_PENDING",
  createPricingRequestSuccess = "CREATE_PRICING_REQUEST_SUCCESS",
  createPricingRequestError   = "CREATE_PRICING_REQUEST_ERROR",

  updatePricingRequestPending = "UPDATE_PRICING_REQUEST_PENDING",
  updatePricingRequestSuccess = "UPDATE_PRICING_REQUEST_SUCCESS",
  updatePricingRequestError   = "UPDATE_PRICING_REQUEST_ERROR",

  assignPricingRequestPending = "ASSIGN_PRICING_REQUEST_PENDING",
  assignPricingRequestSuccess = "ASSIGN_PRICING_REQUEST_SUCCESS",
  assignPricingRequestError   = "ASSIGN_PRICING_REQUEST_ERROR",

  completePricingRequestPending = "COMPLETE_PRICING_REQUEST_PENDING",
  completePricingRequestSuccess = "COMPLETE_PRICING_REQUEST_SUCCESS",
  completePricingRequestError   = "COMPLETE_PRICING_REQUEST_ERROR",

  deletePricingRequestPending = "DELETE_PRICING_REQUEST_PENDING",
  deletePricingRequestSuccess = "DELETE_PRICING_REQUEST_SUCCESS",
  deletePricingRequestError   = "DELETE_PRICING_REQUEST_ERROR",
}

// ── Get All ───────────────────────────────────────────────────────────────────
export const getPricingRequestsPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPricingRequestsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getPricingRequestsSuccess = createAction<IPricingRequestsStateContext, PricingRequestPagedResult>(
  PricingRequestsActionEnums.getPricingRequestsSuccess,
  (pricingRequests) => ({ isPending: false, isSuccess: true, isError: false, pricingRequests })
);
export const getPricingRequestsError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPricingRequestsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Get Single ────────────────────────────────────────────────────────────────
export const getPricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPricingRequestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getPricingRequestSuccess = createAction<IPricingRequestsStateContext, PricingRequest>(
  PricingRequestsActionEnums.getPricingRequestSuccess,
  (pricingRequest) => ({ isPending: false, isSuccess: true, isError: false, pricingRequest })
);
export const getPricingRequestError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPricingRequestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Get My Requests ───────────────────────────────────────────────────────────
export const getMyRequestsPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getMyRequestsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getMyRequestsSuccess = createAction<IPricingRequestsStateContext, PricingRequestPagedResult>(
  PricingRequestsActionEnums.getMyRequestsSuccess,
  (myRequests) => ({ isPending: false, isSuccess: true, isError: false, myRequests })
);
export const getMyRequestsError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getMyRequestsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Get Pending (unassigned) ──────────────────────────────────────────────────
export const getPendingRequestsPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPendingRequestsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const getPendingRequestsSuccess = createAction<IPricingRequestsStateContext, PricingRequestPagedResult>(
  PricingRequestsActionEnums.getPendingRequestsSuccess,
  (pendingRequests) => ({ isPending: false, isSuccess: true, isError: false, pendingRequests })
);
export const getPendingRequestsError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.getPendingRequestsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Create ────────────────────────────────────────────────────────────────────
export const createPricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.createPricingRequestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const createPricingRequestSuccess = createAction<IPricingRequestsStateContext, PricingRequest>(
  PricingRequestsActionEnums.createPricingRequestSuccess,
  (createdPricingRequest) => ({ isPending: false, isSuccess: true, isError: false, createdPricingRequest })
);
export const createPricingRequestError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.createPricingRequestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Update ────────────────────────────────────────────────────────────────────
export const updatePricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.updatePricingRequestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const updatePricingRequestSuccess = createAction<IPricingRequestsStateContext, PricingRequest>(
  PricingRequestsActionEnums.updatePricingRequestSuccess,
  (updatedPricingRequest) => ({ isPending: false, isSuccess: true, isError: false, updatedPricingRequest })
);
export const updatePricingRequestError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.updatePricingRequestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Assign ────────────────────────────────────────────────────────────────────
export const assignPricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.assignPricingRequestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const assignPricingRequestSuccess = createAction<IPricingRequestsStateContext, PricingRequest>(
  PricingRequestsActionEnums.assignPricingRequestSuccess,
  (updatedPricingRequest) => ({ isPending: false, isSuccess: true, isError: false, updatedPricingRequest })
);
export const assignPricingRequestError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.assignPricingRequestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Complete ──────────────────────────────────────────────────────────────────
export const completePricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.completePricingRequestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const completePricingRequestSuccess = createAction<IPricingRequestsStateContext, PricingRequest>(
  PricingRequestsActionEnums.completePricingRequestSuccess,
  (updatedPricingRequest) => ({ isPending: false, isSuccess: true, isError: false, updatedPricingRequest })
);
export const completePricingRequestError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.completePricingRequestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// ── Delete ────────────────────────────────────────────────────────────────────
export const deletePricingRequestPending = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.deletePricingRequestPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const deletePricingRequestSuccess = createAction<IPricingRequestsStateContext, string>(
  PricingRequestsActionEnums.deletePricingRequestSuccess,
  (deletedPricingRequestId) => ({ isPending: false, isSuccess: true, isError: false, deletedPricingRequestId })
);
export const deletePricingRequestError = createAction<IPricingRequestsStateContext>(
  PricingRequestsActionEnums.deletePricingRequestError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);