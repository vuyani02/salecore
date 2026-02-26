import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IOpportunitiesStateContext } from "./context";
import { OpportunitiesActionEnums } from "./actions";

export const OpportunitiesReducer = handleActions<
  IOpportunitiesStateContext,
  IOpportunitiesStateContext
>(
  {
    [OpportunitiesActionEnums.getOpportunitiesPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.getOpportunitiesSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.getOpportunitiesError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [OpportunitiesActionEnums.getMyOpportunitiesPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.getMyOpportunitiesSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.getMyOpportunitiesError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [OpportunitiesActionEnums.createOpportunityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.createOpportunitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.createOpportunityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [OpportunitiesActionEnums.deleteOpportunityPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.deleteOpportunitySuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [OpportunitiesActionEnums.deleteOpportunityError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);