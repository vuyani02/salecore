"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  ProposalsActionContext,
  ProposalsStateContext,
  type IProposalsActionContext,
  type IProposalsQuery,
  type ICreateProposalPayload,
  type IUpdateProposalPayload,
  type ICreateLineItemPayload,
  type IRejectProposalPayload,
  type IProposalPagedResult,
  type IProposal,
  type IProposalLineItem,
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

  const getProposals = async (query?: IProposalsQuery) => {
    dispatch(getProposalsPending());
    await instance
      .get<IProposalPagedResult>("/api/proposals", { params: query })
      .then((res) => dispatch(getProposalsSuccess(res.data)))
      .catch(() => { dispatch(getProposalsError()); message.error("Failed to load proposals"); });
  };

  const getProposal = async (id: string) => {
    dispatch(getProposalPending());
    await instance
      .get<IProposal>(`/api/proposals/${id}`)
      .then((res) => dispatch(getProposalSuccess(res.data)))
      .catch(() => { dispatch(getProposalError()); message.error("Failed to load proposal"); });
  };

  const createProposal = async (payload: ICreateProposalPayload) => {
    dispatch(createProposalPending());
    await instance
      .post<IProposal>("/api/proposals", payload)
      .then((res) => { dispatch(createProposalSuccess(res.data)); message.success("Proposal created"); })
      .catch(() => { dispatch(createProposalError()); message.error("Failed to create proposal"); });
  };

  const updateProposal = async (id: string, payload: IUpdateProposalPayload) => {
    dispatch(updateProposalPending());
    await instance
      .put<IProposal>(`/api/proposals/${id}`, payload)
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

  const addLineItem = async (proposalId: string, payload: ICreateLineItemPayload) => {
    dispatch(addLineItemPending());
    await instance
      .post<IProposalLineItem>(`/api/proposals/${proposalId}/line-items`, payload)
      .then((res) => { dispatch(addLineItemSuccess(res.data)); message.success("Line item added"); })
      .catch(() => { dispatch(addLineItemError()); message.error("Failed to add line item"); });
  };

  const updateLineItem = async (proposalId: string, lineItemId: string, payload: ICreateLineItemPayload) => {
    dispatch(updateLineItemPending());
    await instance
      .put<IProposalLineItem>(`/api/proposals/${proposalId}/line-items/${lineItemId}`, payload)
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
      .put<IProposal>(`/api/proposals/${id}/submit`)
      .then((res) => { dispatch(submitProposalSuccess(res.data)); message.success("Proposal submitted"); })
      .catch(() => { dispatch(submitProposalError()); message.error("Failed to submit proposal"); });
  };

  const approveProposal = async (id: string) => {
    dispatch(approveProposalPending());
    await instance
      .put<IProposal>(`/api/proposals/${id}/approve`)
      .then((res) => { dispatch(approveProposalSuccess(res.data)); message.success("Proposal approved"); })
      .catch(() => { dispatch(approveProposalError()); message.error("Failed to approve proposal"); });
  };

  const rejectProposal = async (id: string, payload: IRejectProposalPayload) => {
    dispatch(rejectProposalPending());
    await instance
      .put<IProposal>(`/api/proposals/${id}/reject`, payload)
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