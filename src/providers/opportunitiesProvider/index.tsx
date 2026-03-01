"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  OpportunitiesActionContext,
  OpportunitiesStateContext,
  type IOpportunitiesActionContext,
  type MoveStagePayload,
  type Pipeline,
  type StageHistoryItem,
} from "./context";
import { OpportunitiesReducer } from "./reducer";
import {
  getOpportunitiesPending,  getOpportunitiesSuccess,  getOpportunitiesError,
  getMyOpportunitiesPending, getMyOpportunitiesSuccess, getMyOpportunitiesError,
  getPipelinePending,        getPipelineSuccess,        getPipelineError,
  getStageHistoryPending,    getStageHistorySuccess,    getStageHistoryError,
  createOpportunityPending,  createOpportunitySuccess,  createOpportunityError,
  updateOpportunityPending,  updateOpportunitySuccess,  updateOpportunityError,
  moveStagePending,          moveStageSuccess,          moveStageError,
  assignOpportunityPending,  assignOpportunitySuccess,  assignOpportunityError,
  deleteOpportunityPending,  deleteOpportunitySuccess,  deleteOpportunityError,
} from "./actions";
import type {
  OpportunitiesQuery,
  OpportunityPagedResult,
  Opportunity,
  CreateOpportunityPayload,
} from "@/types/opportunities";

export const OpportunitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(OpportunitiesReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getOpportunities = async (query?: OpportunitiesQuery) => {
    dispatch(getOpportunitiesPending());
    await instance
      .get<OpportunityPagedResult>("/api/opportunities", { params: query })
      .then((r) => dispatch(getOpportunitiesSuccess(r.data)))
      .catch(() => { dispatch(getOpportunitiesError()); message.error("Failed to load opportunities"); });
  };

  const getMyOpportunities = async (query?: OpportunitiesQuery) => {
    dispatch(getMyOpportunitiesPending());
    await instance
      .get<OpportunityPagedResult>("/api/opportunities/my-opportunities", { params: query })
      .then((r) => dispatch(getMyOpportunitiesSuccess(r.data)))
      .catch(() => { dispatch(getMyOpportunitiesError()); message.error("Failed to load my opportunities"); });
  };

  const getPipeline = async (ownerId?: string) => {
    dispatch(getPipelinePending());
    await instance
      .get<Pipeline>("/api/opportunities/pipeline", { params: ownerId ? { ownerId } : undefined })
      .then((r) => dispatch(getPipelineSuccess(r.data)))
      .catch(() => { dispatch(getPipelineError()); message.error("Failed to load pipeline"); });
  };

  const getStageHistory = async (id: string) => {
    dispatch(getStageHistoryPending());
    await instance
      .get<StageHistoryItem[]>(`/api/opportunities/${id}/stage-history`)
      .then((r) => dispatch(getStageHistorySuccess(r.data)))
      .catch(() => { dispatch(getStageHistoryError()); message.error("Failed to load stage history"); });
  };

  const createOpportunity = async (payload: CreateOpportunityPayload) => {
    dispatch(createOpportunityPending());
    await instance
      .post<Opportunity>("/api/opportunities", payload)
      .then((r) => { dispatch(createOpportunitySuccess(r.data)); message.success("Opportunity created"); })
      .catch(() => { dispatch(createOpportunityError()); message.error("Failed to create opportunity"); });
  };

  const updateOpportunity = async (id: string, payload: CreateOpportunityPayload) => {
    dispatch(updateOpportunityPending());
    await instance
      .put<Opportunity>(`/api/opportunities/${id}`, payload)
      .then((r) => { dispatch(updateOpportunitySuccess(r.data)); message.success("Opportunity updated"); })
      .catch(() => { dispatch(updateOpportunityError()); message.error("Failed to update opportunity"); });
  };

  const moveStage = async (id: string, payload: MoveStagePayload) => {
    dispatch(moveStagePending());
    await instance
      .put<Opportunity>(`/api/opportunities/${id}/stage`, payload)
      .then((r) => { dispatch(moveStageSuccess(r.data)); message.success("Stage updated"); })
      .catch(() => { dispatch(moveStageError()); message.error("Failed to update stage"); });
  };

  const assignOpportunity = async (id: string, userId: string) => {
    dispatch(assignOpportunityPending());
    await instance
      .post<Opportunity>(`/api/opportunities/${id}/assign`, { userId })
      .then((r) => { dispatch(assignOpportunitySuccess(r.data)); message.success("Opportunity assigned"); })
      .catch(() => { dispatch(assignOpportunityError()); message.error("Failed to assign opportunity"); });
  };

  const deleteOpportunity = async (id: string) => {
    dispatch(deleteOpportunityPending());
    await instance
      .delete(`/api/opportunities/${id}`)
      .then(() => { dispatch(deleteOpportunitySuccess(id)); message.success("Opportunity deleted"); })
      .catch(() => { dispatch(deleteOpportunityError()); message.error("Failed to delete opportunity"); });
  };

  const actions: IOpportunitiesActionContext = {
    getOpportunities, getMyOpportunities, getPipeline, getStageHistory,
    createOpportunity, updateOpportunity, moveStage, assignOpportunity,
    deleteOpportunity,
  };

  return (
    <OpportunitiesStateContext.Provider value={state}>
      <OpportunitiesActionContext.Provider value={actions}>
        {children}
      </OpportunitiesActionContext.Provider>
    </OpportunitiesStateContext.Provider>
  );
};

export const useOpportunitiesState = () => {
  const context = useContext(OpportunitiesStateContext);
  if (!context) throw new Error("useOpportunitiesState must be used within OpportunitiesProvider");
  return context;
};

export const useOpportunitiesActions = () => {
  const context = useContext(OpportunitiesActionContext);
  if (!context) throw new Error("useOpportunitiesActions must be used within OpportunitiesProvider");
  return context;
};