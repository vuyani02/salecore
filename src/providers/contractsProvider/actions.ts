import { createAction } from "redux-actions";
import type {
  IContractsStateContext,
  Contract,
  ContractPagedResult,
  ContractRenewal,
} from "./context";

export enum ContractsActionEnums {
  getContractsPending   = "GET_CONTRACTS_PENDING",
  getContractsSuccess   = "GET_CONTRACTS_SUCCESS",
  getContractsError     = "GET_CONTRACTS_ERROR",

  getContractPending    = "GET_CONTRACT_PENDING",
  getContractSuccess    = "GET_CONTRACT_SUCCESS",
  getContractError      = "GET_CONTRACT_ERROR",

  getExpiringPending    = "GET_EXPIRING_CONTRACTS_PENDING",
  getExpiringSuccess    = "GET_EXPIRING_CONTRACTS_SUCCESS",
  getExpiringError      = "GET_EXPIRING_CONTRACTS_ERROR",

  createContractPending = "CREATE_CONTRACT_PENDING",
  createContractSuccess = "CREATE_CONTRACT_SUCCESS",
  createContractError   = "CREATE_CONTRACT_ERROR",

  updateContractPending = "UPDATE_CONTRACT_PENDING",
  updateContractSuccess = "UPDATE_CONTRACT_SUCCESS",
  updateContractError   = "UPDATE_CONTRACT_ERROR",

  activateContractPending = "ACTIVATE_CONTRACT_PENDING",
  activateContractSuccess = "ACTIVATE_CONTRACT_SUCCESS",
  activateContractError   = "ACTIVATE_CONTRACT_ERROR",

  cancelContractPending = "CANCEL_CONTRACT_PENDING",
  cancelContractSuccess = "CANCEL_CONTRACT_SUCCESS",
  cancelContractError   = "CANCEL_CONTRACT_ERROR",

  createRenewalPending  = "CREATE_RENEWAL_PENDING",
  createRenewalSuccess  = "CREATE_RENEWAL_SUCCESS",
  createRenewalError    = "CREATE_RENEWAL_ERROR",

  completeRenewalPending = "COMPLETE_RENEWAL_PENDING",
  completeRenewalSuccess = "COMPLETE_RENEWAL_SUCCESS",
  completeRenewalError   = "COMPLETE_RENEWAL_ERROR",

  deleteContractPending = "DELETE_CONTRACT_PENDING",
  deleteContractSuccess = "DELETE_CONTRACT_SUCCESS",
  deleteContractError   = "DELETE_CONTRACT_ERROR",
}

// ── Get All ───────────────────────────────────────────────────────────────────
export const getContractsPending = createAction<IContractsStateContext>(ContractsActionEnums.getContractsPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getContractsSuccess = createAction<IContractsStateContext, ContractPagedResult>(ContractsActionEnums.getContractsSuccess, (contracts) => ({ isPending: false, isSuccess: true, isError: false, contracts }));
export const getContractsError   = createAction<IContractsStateContext>(ContractsActionEnums.getContractsError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Get Single ────────────────────────────────────────────────────────────────
export const getContractPending = createAction<IContractsStateContext>(ContractsActionEnums.getContractPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getContractSuccess = createAction<IContractsStateContext, Contract>(ContractsActionEnums.getContractSuccess, (contract) => ({ isPending: false, isSuccess: true, isError: false, contract }));
export const getContractError   = createAction<IContractsStateContext>(ContractsActionEnums.getContractError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Get Expiring ──────────────────────────────────────────────────────────────
export const getExpiringPending = createAction<IContractsStateContext>(ContractsActionEnums.getExpiringPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getExpiringSuccess = createAction<IContractsStateContext, ContractPagedResult>(ContractsActionEnums.getExpiringSuccess, (expiringContracts) => ({ isPending: false, isSuccess: true, isError: false, expiringContracts }));
export const getExpiringError   = createAction<IContractsStateContext>(ContractsActionEnums.getExpiringError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Create ────────────────────────────────────────────────────────────────────
export const createContractPending = createAction<IContractsStateContext>(ContractsActionEnums.createContractPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const createContractSuccess = createAction<IContractsStateContext, Contract>(ContractsActionEnums.createContractSuccess, (createdContract) => ({ isPending: false, isSuccess: true, isError: false, createdContract }));
export const createContractError   = createAction<IContractsStateContext>(ContractsActionEnums.createContractError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Update ────────────────────────────────────────────────────────────────────
export const updateContractPending = createAction<IContractsStateContext>(ContractsActionEnums.updateContractPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const updateContractSuccess = createAction<IContractsStateContext, Contract>(ContractsActionEnums.updateContractSuccess, (updatedContract) => ({ isPending: false, isSuccess: true, isError: false, updatedContract }));
export const updateContractError   = createAction<IContractsStateContext>(ContractsActionEnums.updateContractError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Activate ──────────────────────────────────────────────────────────────────
export const activateContractPending = createAction<IContractsStateContext>(ContractsActionEnums.activateContractPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const activateContractSuccess = createAction<IContractsStateContext, Contract>(ContractsActionEnums.activateContractSuccess, (updatedContract) => ({ isPending: false, isSuccess: true, isError: false, updatedContract }));
export const activateContractError   = createAction<IContractsStateContext>(ContractsActionEnums.activateContractError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Cancel ────────────────────────────────────────────────────────────────────
export const cancelContractPending = createAction<IContractsStateContext>(ContractsActionEnums.cancelContractPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const cancelContractSuccess = createAction<IContractsStateContext, Contract>(ContractsActionEnums.cancelContractSuccess, (updatedContract) => ({ isPending: false, isSuccess: true, isError: false, updatedContract }));
export const cancelContractError   = createAction<IContractsStateContext>(ContractsActionEnums.cancelContractError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Create Renewal ────────────────────────────────────────────────────────────
export const createRenewalPending = createAction<IContractsStateContext>(ContractsActionEnums.createRenewalPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const createRenewalSuccess = createAction<IContractsStateContext, ContractRenewal>(ContractsActionEnums.createRenewalSuccess, (renewal) => ({ isPending: false, isSuccess: true, isError: false, renewal }));
export const createRenewalError   = createAction<IContractsStateContext>(ContractsActionEnums.createRenewalError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Complete Renewal ──────────────────────────────────────────────────────────
export const completeRenewalPending = createAction<IContractsStateContext>(ContractsActionEnums.completeRenewalPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const completeRenewalSuccess = createAction<IContractsStateContext, Contract>(ContractsActionEnums.completeRenewalSuccess, (updatedContract) => ({ isPending: false, isSuccess: true, isError: false, updatedContract }));
export const completeRenewalError   = createAction<IContractsStateContext>(ContractsActionEnums.completeRenewalError, () => ({ isPending: false, isSuccess: false, isError: true }));

// ── Delete ────────────────────────────────────────────────────────────────────
export const deleteContractPending = createAction<IContractsStateContext>(ContractsActionEnums.deleteContractPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const deleteContractSuccess = createAction<IContractsStateContext, string>(ContractsActionEnums.deleteContractSuccess, (deletedContractId) => ({ isPending: false, isSuccess: true, isError: false, deletedContractId }));
export const deleteContractError   = createAction<IContractsStateContext>(ContractsActionEnums.deleteContractError, () => ({ isPending: false, isSuccess: false, isError: true }));