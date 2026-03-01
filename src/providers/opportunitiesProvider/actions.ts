import { createAction } from "redux-actions";
import type { IOpportunitiesStateContext, Pipeline, StageHistoryItem } from "./context";
import type { Opportunity, OpportunityPagedResult } from "@/types/opportunities";

export enum OpportunitiesActionEnums {
  getOpportunitiesPending    = "GET_OPPORTUNITIES_PENDING",
  getOpportunitiesSuccess    = "GET_OPPORTUNITIES_SUCCESS",
  getOpportunitiesError      = "GET_OPPORTUNITIES_ERROR",

  getMyOpportunitiesPending  = "GET_MY_OPPORTUNITIES_PENDING",
  getMyOpportunitiesSuccess  = "GET_MY_OPPORTUNITIES_SUCCESS",
  getMyOpportunitiesError    = "GET_MY_OPPORTUNITIES_ERROR",

  getPipelinePending         = "GET_PIPELINE_PENDING",
  getPipelineSuccess         = "GET_PIPELINE_SUCCESS",
  getPipelineError           = "GET_PIPELINE_ERROR",

  getStageHistoryPending     = "GET_STAGE_HISTORY_PENDING",
  getStageHistorySuccess     = "GET_STAGE_HISTORY_SUCCESS",
  getStageHistoryError       = "GET_STAGE_HISTORY_ERROR",

  createOpportunityPending   = "CREATE_OPPORTUNITY_PENDING",
  createOpportunitySuccess   = "CREATE_OPPORTUNITY_SUCCESS",
  createOpportunityError     = "CREATE_OPPORTUNITY_ERROR",

  updateOpportunityPending   = "UPDATE_OPPORTUNITY_PENDING",
  updateOpportunitySuccess   = "UPDATE_OPPORTUNITY_SUCCESS",
  updateOpportunityError     = "UPDATE_OPPORTUNITY_ERROR",

  moveStagePending           = "MOVE_STAGE_PENDING",
  moveStageSuccess           = "MOVE_STAGE_SUCCESS",
  moveStageError             = "MOVE_STAGE_ERROR",

  assignOpportunityPending   = "ASSIGN_OPPORTUNITY_PENDING",
  assignOpportunitySuccess   = "ASSIGN_OPPORTUNITY_SUCCESS",
  assignOpportunityError     = "ASSIGN_OPPORTUNITY_ERROR",

  deleteOpportunityPending   = "DELETE_OPPORTUNITY_PENDING",
  deleteOpportunitySuccess   = "DELETE_OPPORTUNITY_SUCCESS",
  deleteOpportunityError     = "DELETE_OPPORTUNITY_ERROR",
}

// ── Get All ───────────────────────────────────────────────────────────────────
export const getOpportunitiesPending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getOpportunitiesPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOpportunitiesSuccess = createAction<IOpportunitiesStateContext, OpportunityPagedResult>(OpportunitiesActionEnums.getOpportunitiesSuccess, (opportunities) => ({ isPending: false, isSuccess: true,  isError: false, opportunities }));
export const getOpportunitiesError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getOpportunitiesError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Get Mine ──────────────────────────────────────────────────────────────────
export const getMyOpportunitiesPending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getMyOpportunitiesPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getMyOpportunitiesSuccess = createAction<IOpportunitiesStateContext, OpportunityPagedResult>(OpportunitiesActionEnums.getMyOpportunitiesSuccess, (myOpportunities) => ({ isPending: false, isSuccess: true,  isError: false, myOpportunities }));
export const getMyOpportunitiesError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getMyOpportunitiesError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Pipeline ──────────────────────────────────────────────────────────────────
export const getPipelinePending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getPipelinePending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getPipelineSuccess = createAction<IOpportunitiesStateContext, Pipeline>(OpportunitiesActionEnums.getPipelineSuccess, (pipeline) => ({ isPending: false, isSuccess: true,  isError: false, pipeline }));
export const getPipelineError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getPipelineError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Stage History ─────────────────────────────────────────────────────────────
export const getStageHistoryPending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getStageHistoryPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getStageHistorySuccess = createAction<IOpportunitiesStateContext, StageHistoryItem[]>(OpportunitiesActionEnums.getStageHistorySuccess, (stageHistory) => ({ isPending: false, isSuccess: true,  isError: false, stageHistory }));
export const getStageHistoryError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.getStageHistoryError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Create ────────────────────────────────────────────────────────────────────
export const createOpportunityPending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.createOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createOpportunitySuccess = createAction<IOpportunitiesStateContext, Opportunity>(OpportunitiesActionEnums.createOpportunitySuccess, (createdOpportunity) => ({ isPending: false, isSuccess: true,  isError: false, createdOpportunity }));
export const createOpportunityError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.createOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Update ────────────────────────────────────────────────────────────────────
export const updateOpportunityPending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.updateOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateOpportunitySuccess = createAction<IOpportunitiesStateContext, Opportunity>(OpportunitiesActionEnums.updateOpportunitySuccess, (updatedOpportunity) => ({ isPending: false, isSuccess: true,  isError: false, updatedOpportunity }));
export const updateOpportunityError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.updateOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Move Stage ────────────────────────────────────────────────────────────────
export const moveStagePending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.moveStagePending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const moveStageSuccess = createAction<IOpportunitiesStateContext, Opportunity>(OpportunitiesActionEnums.moveStageSuccess, (updatedOpportunity) => ({ isPending: false, isSuccess: true,  isError: false, updatedOpportunity }));
export const moveStageError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.moveStageError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Assign ────────────────────────────────────────────────────────────────────
export const assignOpportunityPending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.assignOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const assignOpportunitySuccess = createAction<IOpportunitiesStateContext, Opportunity>(OpportunitiesActionEnums.assignOpportunitySuccess, (updatedOpportunity) => ({ isPending: false, isSuccess: true,  isError: false, updatedOpportunity }));
export const assignOpportunityError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.assignOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

// ── Delete ────────────────────────────────────────────────────────────────────
export const deleteOpportunityPending = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.deleteOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteOpportunitySuccess = createAction<IOpportunitiesStateContext, string>(OpportunitiesActionEnums.deleteOpportunitySuccess, (deletedOpportunityId) => ({ isPending: false, isSuccess: true,  isError: false, deletedOpportunityId }));
export const deleteOpportunityError   = createAction<IOpportunitiesStateContext>(OpportunitiesActionEnums.deleteOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));