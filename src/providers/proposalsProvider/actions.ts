import { createAction } from "redux-actions";
import type { IProposalsStateContext, Proposal, ProposalPagedResult, ProposalLineItem } from "./context";

export enum ProposalsActionEnums {
  getProposalsPending = "GET_PROPOSALS_PENDING",
  getProposalsSuccess = "GET_PROPOSALS_SUCCESS",
  getProposalsError   = "GET_PROPOSALS_ERROR",

  getProposalPending = "GET_PROPOSAL_PENDING",
  getProposalSuccess = "GET_PROPOSAL_SUCCESS",
  getProposalError   = "GET_PROPOSAL_ERROR",

  createProposalPending = "CREATE_PROPOSAL_PENDING",
  createProposalSuccess = "CREATE_PROPOSAL_SUCCESS",
  createProposalError   = "CREATE_PROPOSAL_ERROR",

  updateProposalPending = "UPDATE_PROPOSAL_PENDING",
  updateProposalSuccess = "UPDATE_PROPOSAL_SUCCESS",
  updateProposalError   = "UPDATE_PROPOSAL_ERROR",

  deleteProposalPending = "DELETE_PROPOSAL_PENDING",
  deleteProposalSuccess = "DELETE_PROPOSAL_SUCCESS",
  deleteProposalError   = "DELETE_PROPOSAL_ERROR",

  addLineItemPending = "ADD_LINE_ITEM_PENDING",
  addLineItemSuccess = "ADD_LINE_ITEM_SUCCESS",
  addLineItemError   = "ADD_LINE_ITEM_ERROR",

  updateLineItemPending = "UPDATE_LINE_ITEM_PENDING",
  updateLineItemSuccess = "UPDATE_LINE_ITEM_SUCCESS",
  updateLineItemError   = "UPDATE_LINE_ITEM_ERROR",

  deleteLineItemPending = "DELETE_LINE_ITEM_PENDING",
  deleteLineItemSuccess = "DELETE_LINE_ITEM_SUCCESS",
  deleteLineItemError   = "DELETE_LINE_ITEM_ERROR",

  submitProposalPending = "SUBMIT_PROPOSAL_PENDING",
  submitProposalSuccess = "SUBMIT_PROPOSAL_SUCCESS",
  submitProposalError   = "SUBMIT_PROPOSAL_ERROR",

  approveProposalPending = "APPROVE_PROPOSAL_PENDING",
  approveProposalSuccess = "APPROVE_PROPOSAL_SUCCESS",
  approveProposalError   = "APPROVE_PROPOSAL_ERROR",

  rejectProposalPending = "REJECT_PROPOSAL_PENDING",
  rejectProposalSuccess = "REJECT_PROPOSAL_SUCCESS",
  rejectProposalError   = "REJECT_PROPOSAL_ERROR",
}

const pending = (type: string) =>
  createAction<IProposalsStateContext>(type, () => ({ isPending: true, isSuccess: false, isError: false }));

const error = (type: string) =>
  createAction<IProposalsStateContext>(type, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Get All ───────────────────────────────────────────────────────────────────
export const getProposalsPending = pending(ProposalsActionEnums.getProposalsPending);
export const getProposalsSuccess = createAction<IProposalsStateContext, ProposalPagedResult>(
  ProposalsActionEnums.getProposalsSuccess,
  (proposals) => ({ isPending: false, isSuccess: true, isError: false, proposals })
);
export const getProposalsError = error(ProposalsActionEnums.getProposalsError);

// ── Get Single ────────────────────────────────────────────────────────────────
export const getProposalPending = pending(ProposalsActionEnums.getProposalPending);
export const getProposalSuccess = createAction<IProposalsStateContext, Proposal>(
  ProposalsActionEnums.getProposalSuccess,
  (proposal) => ({ isPending: false, isSuccess: true, isError: false, proposal })
);
export const getProposalError = error(ProposalsActionEnums.getProposalError);

// ── Create ────────────────────────────────────────────────────────────────────
export const createProposalPending = pending(ProposalsActionEnums.createProposalPending);
export const createProposalSuccess = createAction<IProposalsStateContext, Proposal>(
  ProposalsActionEnums.createProposalSuccess,
  (createdProposal) => ({ isPending: false, isSuccess: true, isError: false, createdProposal })
);
export const createProposalError = error(ProposalsActionEnums.createProposalError);

// ── Update ────────────────────────────────────────────────────────────────────
export const updateProposalPending = pending(ProposalsActionEnums.updateProposalPending);
export const updateProposalSuccess = createAction<IProposalsStateContext, Proposal>(
  ProposalsActionEnums.updateProposalSuccess,
  (updatedProposal) => ({ isPending: false, isSuccess: true, isError: false, updatedProposal })
);
export const updateProposalError = error(ProposalsActionEnums.updateProposalError);

// ── Delete ────────────────────────────────────────────────────────────────────
export const deleteProposalPending = pending(ProposalsActionEnums.deleteProposalPending);
export const deleteProposalSuccess = createAction<IProposalsStateContext, string>(
  ProposalsActionEnums.deleteProposalSuccess,
  (deletedProposalId) => ({ isPending: false, isSuccess: true, isError: false, deletedProposalId })
);
export const deleteProposalError = error(ProposalsActionEnums.deleteProposalError);

// ── Line Items ────────────────────────────────────────────────────────────────
export const addLineItemPending    = pending(ProposalsActionEnums.addLineItemPending);
export const addLineItemSuccess    = createAction<IProposalsStateContext, ProposalLineItem>(
  ProposalsActionEnums.addLineItemSuccess,
  (lineItem) => ({ isPending: false, isSuccess: true, isError: false })
);
export const addLineItemError      = error(ProposalsActionEnums.addLineItemError);

export const updateLineItemPending = pending(ProposalsActionEnums.updateLineItemPending);
export const updateLineItemSuccess = createAction<IProposalsStateContext, ProposalLineItem>(
  ProposalsActionEnums.updateLineItemSuccess,
  (lineItem) => ({ isPending: false, isSuccess: true, isError: false })
);
export const updateLineItemError   = error(ProposalsActionEnums.updateLineItemError);

export const deleteLineItemPending = pending(ProposalsActionEnums.deleteLineItemPending);
export const deleteLineItemSuccess = createAction<IProposalsStateContext>(
  ProposalsActionEnums.deleteLineItemSuccess,
  () => ({ isPending: false, isSuccess: true, isError: false })
);
export const deleteLineItemError   = error(ProposalsActionEnums.deleteLineItemError);

// ── Status Changes ────────────────────────────────────────────────────────────
export const submitProposalPending  = pending(ProposalsActionEnums.submitProposalPending);
export const submitProposalSuccess  = createAction<IProposalsStateContext, Proposal>(
  ProposalsActionEnums.submitProposalSuccess,
  (proposal) => ({ isPending: false, isSuccess: true, isError: false, proposal })
);
export const submitProposalError    = error(ProposalsActionEnums.submitProposalError);

export const approveProposalPending = pending(ProposalsActionEnums.approveProposalPending);
export const approveProposalSuccess = createAction<IProposalsStateContext, Proposal>(
  ProposalsActionEnums.approveProposalSuccess,
  (proposal) => ({ isPending: false, isSuccess: true, isError: false, proposal })
);
export const approveProposalError   = error(ProposalsActionEnums.approveProposalError);

export const rejectProposalPending  = pending(ProposalsActionEnums.rejectProposalPending);
export const rejectProposalSuccess  = createAction<IProposalsStateContext, Proposal>(
  ProposalsActionEnums.rejectProposalSuccess,
  (proposal) => ({ isPending: false, isSuccess: true, isError: false, proposal })
);
export const rejectProposalError    = error(ProposalsActionEnums.rejectProposalError);