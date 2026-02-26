import { createAction } from "redux-actions";
import type { IOpportunitiesStateContext } from "./context";
import type { Opportunity, OpportunityPagedResult } from "@/types/opportunities";

export enum OpportunitiesActionEnums {
  getOpportunitiesPending = "GET_OPPORTUNITIES_PENDING",
  getOpportunitiesSuccess = "GET_OPPORTUNITIES_SUCCESS",
  getOpportunitiesError = "GET_OPPORTUNITIES_ERROR",

  getMyOpportunitiesPending = "GET_MY_OPPORTUNITIES_PENDING",
  getMyOpportunitiesSuccess = "GET_MY_OPPORTUNITIES_SUCCESS",
  getMyOpportunitiesError = "GET_MY_OPPORTUNITIES_ERROR",

  createOpportunityPending = "CREATE_OPPORTUNITY_PENDING",
  createOpportunitySuccess = "CREATE_OPPORTUNITY_SUCCESS",
  createOpportunityError = "CREATE_OPPORTUNITY_ERROR",

  deleteOpportunityPending = "DELETE_OPPORTUNITY_PENDING",
  deleteOpportunitySuccess = "DELETE_OPPORTUNITY_SUCCESS",
  deleteOpportunityError = "DELETE_OPPORTUNITY_ERROR",
}

export const getOpportunitiesPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getOpportunitiesPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getOpportunitiesSuccess = createAction<
  IOpportunitiesStateContext,
  OpportunityPagedResult
>(OpportunitiesActionEnums.getOpportunitiesSuccess, (opportunities) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  opportunities,
}));

export const getOpportunitiesError = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getOpportunitiesError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

export const getMyOpportunitiesPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getMyOpportunitiesPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getMyOpportunitiesSuccess = createAction<
  IOpportunitiesStateContext,
  OpportunityPagedResult
>(OpportunitiesActionEnums.getMyOpportunitiesSuccess, (myOpportunities) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  myOpportunities,
}));

export const getMyOpportunitiesError = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.getMyOpportunitiesError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

export const createOpportunityPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.createOpportunityPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createOpportunitySuccess = createAction<
  IOpportunitiesStateContext,
  Opportunity
>(OpportunitiesActionEnums.createOpportunitySuccess, (createdOpportunity) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  createdOpportunity,
}));

export const createOpportunityError = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.createOpportunityError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

export const deleteOpportunityPending = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.deleteOpportunityPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteOpportunitySuccess = createAction<
  IOpportunitiesStateContext,
  string
>(OpportunitiesActionEnums.deleteOpportunitySuccess, (deletedOpportunityId) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  deletedOpportunityId,
}));

export const deleteOpportunityError = createAction<IOpportunitiesStateContext>(
  OpportunitiesActionEnums.deleteOpportunityError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);