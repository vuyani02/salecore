"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  ContractsStateContext,
  ContractsActionContext,
  type IContractsActionContext,
  type ContractsQuery,
  type CreateContractPayload,
  type UpdateContractPayload,
  type CreateRenewalPayload,
  type ContractPagedResult,
  type Contract,
  type ContractRenewal,
} from "./context";
import { ContractsReducer } from "./reducer";
import {
  getContractsPending,    getContractsSuccess,    getContractsError,
  getContractPending,     getContractSuccess,     getContractError,
  getExpiringPending,     getExpiringSuccess,     getExpiringError,
  createContractPending,  createContractSuccess,  createContractError,
  updateContractPending,  updateContractSuccess,  updateContractError,
  activateContractPending, activateContractSuccess, activateContractError,
  cancelContractPending,  cancelContractSuccess,  cancelContractError,
  createRenewalPending,   createRenewalSuccess,   createRenewalError,
  completeRenewalPending, completeRenewalSuccess, completeRenewalError,
  deleteContractPending,  deleteContractSuccess,  deleteContractError,
} from "./actions";

export const ContractsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ContractsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getContracts = async (query?: ContractsQuery) => {
    dispatch(getContractsPending());
    await instance
      .get<ContractPagedResult>("/api/contracts", { params: query })
      .then((r) => dispatch(getContractsSuccess(r.data)))
      .catch(() => { dispatch(getContractsError()); message.error("Failed to load contracts"); });
  };

  const getContract = async (id: string) => {
    dispatch(getContractPending());
    await instance
      .get<Contract>(`/api/contracts/${id}`)
      .then((r) => dispatch(getContractSuccess(r.data)))
      .catch(() => { dispatch(getContractError()); message.error("Failed to load contract"); });
  };

  const getExpiringContracts = async (days = 30) => {
    dispatch(getExpiringPending());
    await instance
      .get<ContractPagedResult>("/api/contracts/expiring", { params: { days } })
      .then((r) => dispatch(getExpiringSuccess(r.data)))
      .catch(() => { dispatch(getExpiringError()); message.error("Failed to load expiring contracts"); });
  };

  const createContract = async (payload: CreateContractPayload) => {
    dispatch(createContractPending());
    await instance
      .post<Contract>("/api/contracts", payload)
      .then((r) => { dispatch(createContractSuccess(r.data)); message.success("Contract created"); })
      .catch(() => { dispatch(createContractError()); message.error("Failed to create contract"); });
  };

  const updateContract = async (id: string, payload: UpdateContractPayload) => {
    dispatch(updateContractPending());
    await instance
      .put<Contract>(`/api/contracts/${id}`, payload)
      .then((r) => { dispatch(updateContractSuccess(r.data)); message.success("Contract updated"); })
      .catch(() => { dispatch(updateContractError()); message.error("Failed to update contract"); });
  };

  const activateContract = async (id: string) => {
    dispatch(activateContractPending());
    await instance
      .put<Contract>(`/api/contracts/${id}/activate`)
      .then((r) => { dispatch(activateContractSuccess(r.data)); message.success("Contract activated"); })
      .catch(() => { dispatch(activateContractError()); message.error("Failed to activate contract"); });
  };

  const cancelContract = async (id: string) => {
    dispatch(cancelContractPending());
    await instance
      .put<Contract>(`/api/contracts/${id}/cancel`)
      .then((r) => { dispatch(cancelContractSuccess(r.data)); message.success("Contract cancelled"); })
      .catch(() => { dispatch(cancelContractError()); message.error("Failed to cancel contract"); });
  };

  const createRenewal = async (id: string, payload: CreateRenewalPayload) => {
    dispatch(createRenewalPending());
    await instance
      .post<ContractRenewal>(`/api/contracts/${id}/renewals`, payload)
      .then((r) => { dispatch(createRenewalSuccess(r.data)); message.success("Renewal created"); })
      .catch(() => { dispatch(createRenewalError()); message.error("Failed to create renewal"); });
  };

  const completeRenewal = async (contractId: string, renewalId: string) => {
    dispatch(completeRenewalPending());
    await instance
      .put<Contract>(`/api/contracts/${contractId}/renewals/${renewalId}/complete`)
      .then((r) => { dispatch(completeRenewalSuccess(r.data)); message.success("Renewal completed"); })
      .catch(() => { dispatch(completeRenewalError()); message.error("Failed to complete renewal"); });
  };

  const deleteContract = async (id: string) => {
    dispatch(deleteContractPending());
    await instance
      .delete(`/api/contracts/${id}`)
      .then(() => { dispatch(deleteContractSuccess(id)); message.success("Contract deleted"); })
      .catch(() => { dispatch(deleteContractError()); message.error("Failed to delete contract"); });
  };

  const actions: IContractsActionContext = {
    getContracts, getContract, getExpiringContracts,
    createContract, updateContract,
    activateContract, cancelContract,
    createRenewal, completeRenewal,
    deleteContract,
  };

  return (
    <ContractsStateContext.Provider value={state}>
      <ContractsActionContext.Provider value={actions}>
        {children}
      </ContractsActionContext.Provider>
    </ContractsStateContext.Provider>
  );
};

export const useContractsState = () => {
  const context = useContext(ContractsStateContext);
  if (!context) throw new Error("useContractsState must be used within ContractsProvider");
  return context;
};

export const useContractsActions = () => {
  const context = useContext(ContractsActionContext);
  if (!context) throw new Error("useContractsActions must be used within ContractsProvider");
  return context;
};