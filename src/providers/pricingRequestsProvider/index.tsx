"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  PricingRequestsStateContext,
  PricingRequestsActionContext,
  type IPricingRequestsActionContext,
  type PricingRequestsQuery,
  type CreatePricingRequestPayload,
  type UpdatePricingRequestPayload,
  type AssignPricingRequestPayload,
  type PricingRequestPagedResult,
  type PricingRequest,
} from "./context";
import { PricingRequestsReducer } from "./reducer";
import {
  getPricingRequestsPending, getPricingRequestsSuccess, getPricingRequestsError,
  getPricingRequestPending,  getPricingRequestSuccess,  getPricingRequestError,
  getMyRequestsPending,      getMyRequestsSuccess,      getMyRequestsError,
  getPendingRequestsPending, getPendingRequestsSuccess, getPendingRequestsError,
  createPricingRequestPending, createPricingRequestSuccess, createPricingRequestError,
  updatePricingRequestPending, updatePricingRequestSuccess, updatePricingRequestError,
  assignPricingRequestPending, assignPricingRequestSuccess, assignPricingRequestError,
  completePricingRequestPending, completePricingRequestSuccess, completePricingRequestError,
  deletePricingRequestPending, deletePricingRequestSuccess, deletePricingRequestError,
} from "./actions";

export const PricingRequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(PricingRequestsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // ── Get All ─────────────────────────────────────────────────────────────────
  const getPricingRequests = async (query?: PricingRequestsQuery) => {
    dispatch(getPricingRequestsPending());
    await instance
      .get<PricingRequestPagedResult>("/api/pricingrequests", { params: query })
      .then((response) => dispatch(getPricingRequestsSuccess(response.data)))
      .catch(() => {
        dispatch(getPricingRequestsError());
        message.error("Failed to load pricing requests");
      });
  };

  // ── Get Single ──────────────────────────────────────────────────────────────
  const getPricingRequest = async (id: string) => {
    dispatch(getPricingRequestPending());
    await instance
      .get<PricingRequest>(`/api/pricingrequests/${id}`)
      .then((response) => dispatch(getPricingRequestSuccess(response.data)))
      .catch(() => {
        dispatch(getPricingRequestError());
        message.error("Failed to load pricing request");
      });
  };

  // ── Get My Requests ─────────────────────────────────────────────────────────
  const getMyRequests = async (query?: PricingRequestsQuery) => {
    dispatch(getMyRequestsPending());
    await instance
      .get<PricingRequestPagedResult>("/api/pricingrequests/my-requests", { params: query })
      .then((response) => dispatch(getMyRequestsSuccess(response.data)))
      .catch(() => {
        dispatch(getMyRequestsError());
        message.error("Failed to load your pricing requests");
      });
  };

  // ── Get Pending (unassigned) ────────────────────────────────────────────────
  const getPendingRequests = async (query?: PricingRequestsQuery) => {
    dispatch(getPendingRequestsPending());
    await instance
      .get<PricingRequestPagedResult>("/api/pricingrequests/pending", { params: query })
      .then((response) => dispatch(getPendingRequestsSuccess(response.data)))
      .catch(() => {
        dispatch(getPendingRequestsError());
        message.error("Failed to load pending pricing requests");
      });
  };

  // ── Create ──────────────────────────────────────────────────────────────────
  const createPricingRequest = async (payload: CreatePricingRequestPayload) => {
    dispatch(createPricingRequestPending());
    await instance
      .post<PricingRequest>("/api/pricingrequests", payload)
      .then((response) => {
        dispatch(createPricingRequestSuccess(response.data));
        message.success("Pricing request created");
      })
      .catch(() => {
        dispatch(createPricingRequestError());
        message.error("Failed to create pricing request");
      });
  };

  // ── Update ──────────────────────────────────────────────────────────────────
  const updatePricingRequest = async (id: string, payload: UpdatePricingRequestPayload) => {
    dispatch(updatePricingRequestPending());
    await instance
      .put<PricingRequest>(`/api/pricingrequests/${id}`, payload)
      .then((response) => {
        dispatch(updatePricingRequestSuccess(response.data));
        message.success("Pricing request updated");
      })
      .catch(() => {
        dispatch(updatePricingRequestError());
        message.error("Failed to update pricing request");
      });
  };

  // ── Assign ──────────────────────────────────────────────────────────────────
  const assignPricingRequest = async (id: string, payload: AssignPricingRequestPayload) => {
    dispatch(assignPricingRequestPending());
    await instance
      .post<PricingRequest>(`/api/pricingrequests/${id}/assign`, payload)
      .then((response) => {
        dispatch(assignPricingRequestSuccess(response.data));
        message.success("Pricing request assigned");
      })
      .catch(() => {
        dispatch(assignPricingRequestError());
        message.error("Failed to assign pricing request");
      });
  };

  // ── Complete ────────────────────────────────────────────────────────────────
  const completePricingRequest = async (id: string) => {
    dispatch(completePricingRequestPending());
    await instance
      .put<PricingRequest>(`/api/pricingrequests/${id}/complete`)
      .then((response) => {
        dispatch(completePricingRequestSuccess(response.data));
        message.success("Pricing request marked as complete");
      })
      .catch(() => {
        dispatch(completePricingRequestError());
        message.error("Failed to complete pricing request");
      });
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const deletePricingRequest = async (id: string) => {
    dispatch(deletePricingRequestPending());
    await instance
      .delete(`/api/pricingrequests/${id}`)
      .then(() => {
        dispatch(deletePricingRequestSuccess(id));
        message.success("Pricing request deleted");
      })
      .catch(() => {
        dispatch(deletePricingRequestError());
        message.error("Failed to delete pricing request");
      });
  };

  const actions: IPricingRequestsActionContext = {
    getPricingRequests,
    getPricingRequest,
    getMyRequests,
    getPendingRequests,
    createPricingRequest,
    updatePricingRequest,
    assignPricingRequest,
    completePricingRequest,
    deletePricingRequest,
  };

  return (
    <PricingRequestsStateContext.Provider value={state}>
      <PricingRequestsActionContext.Provider value={actions}>
        {children}
      </PricingRequestsActionContext.Provider>
    </PricingRequestsStateContext.Provider>
  );
};

export const usePricingRequestsState = () => {
  const context = useContext(PricingRequestsStateContext);
  if (!context) throw new Error("usePricingRequestsState must be used within PricingRequestsProvider");
  return context;
};

export const usePricingRequestsActions = () => {
  const context = useContext(PricingRequestsActionContext);
  if (!context) throw new Error("usePricingRequestsActions must be used within PricingRequestsProvider");
  return context;
};