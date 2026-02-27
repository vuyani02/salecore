"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  ProposalsActionContext,
  ProposalsStateContext,
  type IProposalsActionContext,
  type ProposalsQuery,
  type CreateProposalPayload,
  type UpdateProposalPayload,
  type CreateLineItemPayload,
  type RejectProposalPayload,
  type ProposalPagedResult,
  type Proposal,
  type ProposalLineItem,
} from "./context";
import { ProposalsReducer } from "./reducer";
import {
  getProposalsPending, getProposalsSuccess, getProposalsError,
  getProposalPending,  getProposalSuccess,  getProposalError,
  createProposalPending, createProposalSuccess, createProposalError,
  updateProposalPending, updateProposalSuccess, updateProposalError,
  deleteProposalPending, deleteProposalSuccess, deleteProposalError,
  addLineItemPending,    addLineItemSuccess,    addLineItemError,
  updateLineItemPending, updateLineItemSuccess, updateLineItemError,
  deleteLineItemPending, deleteLineItemSuccess, deleteLineItemError,
  submitProposalPending,  submitProposalSuccess,  submitProposalError,
  approveProposalPending, approveProposalSuccess, approveProposalError,
  rejectProposalPending,  rejectProposalSuccess,  rejectProposalError,
} from "./actions";

export const ProposalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ProposalsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getProposals = async (query?: ProposalsQuery) => {
    dispatch(getProposalsPending());
    await instance
      .get<ProposalPagedResult>("/api/proposals", { params: query })
      .then((res) => dispatch(getProposalsSuccess(res.data)))
      .catch(() => { dispatch(getProposalsError()); message.error("Failed to load proposals"); });
  };

  const getProposal = async (id: string) => {
    dispatch(getProposalPending());
    await instance
      .get<Proposal>(`/api/proposals/${id}`)
      .then((res) => dispatch(getProposalSuccess(res.data)))
      .catch(() => { dispatch(getProposalError()); message.error("Failed to load proposal"); });
  };

  const createProposal = async (payload: CreateProposalPayload) => {
    dispatch(createProposalPending());
    await instance
      .post<Proposal>("/api/proposals", payload)
      .then((res) => { dispatch(createProposalSuccess(res.data)); message.success("Proposal created"); })
      .catch(() => { dispatch(createProposalError()); message.error("Failed to create proposal"); });
  };

  const updateProposal = async (id: string, payload: UpdateProposalPayload) => {
    dispatch(updateProposalPending());
    await instance
      .put<Proposal>(`/api/proposals/${id}`, payload)
      .then((res) => { dispatch(updateProposalSuccess(res.data)); message.success("Proposal updated"); })
      .catch(() => { dispatch(updateProposalError()); message.error("Failed to update proposal"); });
  };

  const deleteProposal = async (id: string) => {
    dispatch(deleteProposalPending());
    await instance
      .delete(`/api/proposals/${id}`)
      .then(() => { dispatch(deleteProposalSuccess(id)); message.success("Proposal deleted"); })
      .catch(() => { dispatch(deleteProposalError()); message.error("Failed to delete proposal"); });
  };

  const addLineItem = async (proposalId: string, payload: CreateLineItemPayload) => {
    dispatch(addLineItemPending());
    await instance
      .post<ProposalLineItem>(`/api/proposals/${proposalId}/line-items`, payload)
      .then((res) => { dispatch(addLineItemSuccess(res.data)); message.success("Line item added"); })
      .catch(() => { dispatch(addLineItemError()); message.error("Failed to add line item"); });
  };

  const updateLineItem = async (proposalId: string, lineItemId: string, payload: CreateLineItemPayload) => {
    dispatch(updateLineItemPending());
    await instance
      .put<ProposalLineItem>(`/api/proposals/${proposalId}/line-items/${lineItemId}`, payload)
      .then((res) => { dispatch(updateLineItemSuccess(res.data)); message.success("Line item updated"); })
      .catch(() => { dispatch(updateLineItemError()); message.error("Failed to update line item"); });
  };

  const deleteLineItem = async (proposalId: string, lineItemId: string) => {
    dispatch(deleteLineItemPending());
    await instance
      .delete(`/api/proposals/${proposalId}/line-items/${lineItemId}`)
      .then(() => { dispatch(deleteLineItemSuccess()); message.success("Line item removed"); })
      .catch(() => { dispatch(deleteLineItemError()); message.error("Failed to remove line item"); });
  };

  const submitProposal = async (id: string) => {
    dispatch(submitProposalPending());
    await instance
      .put<Proposal>(`/api/proposals/${id}/submit`)
      .then((res) => { dispatch(submitProposalSuccess(res.data)); message.success("Proposal submitted"); })
      .catch(() => { dispatch(submitProposalError()); message.error("Failed to submit proposal"); });
  };

  const approveProposal = async (id: string) => {
    dispatch(approveProposalPending());
    await instance
      .put<Proposal>(`/api/proposals/${id}/approve`)
      .then((res) => { dispatch(approveProposalSuccess(res.data)); message.success("Proposal approved"); })
      .catch(() => { dispatch(approveProposalError()); message.error("Failed to approve proposal"); });
  };

  const rejectProposal = async (id: string, payload: RejectProposalPayload) => {
    dispatch(rejectProposalPending());
    await instance
      .put<Proposal>(`/api/proposals/${id}/reject`, payload)
      .then((res) => { dispatch(rejectProposalSuccess(res.data)); message.success("Proposal rejected"); })
      .catch(() => { dispatch(rejectProposalError()); message.error("Failed to reject proposal"); });
  };

  const actions: IProposalsActionContext = {
    getProposals, getProposal,
    createProposal, updateProposal, deleteProposal,
    addLineItem, updateLineItem, deleteLineItem,
    submitProposal, approveProposal, rejectProposal,
  };

  return (
    <ProposalsStateContext.Provider value={state}>
      <ProposalsActionContext.Provider value={actions}>
        {children}
      </ProposalsActionContext.Provider>
    </ProposalsStateContext.Provider>
  );
};

export const useProposalsState = () => {
  const context = useContext(ProposalsStateContext);
  if (!context) throw new Error("useProposalsState must be used within ProposalsProvider");
  return context;
};

export const useProposalsActions = () => {
  const context = useContext(ProposalsActionContext);
  if (!context) throw new Error("useProposalsActions must be used within ProposalsProvider");
  return context;
};