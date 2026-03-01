import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IOpportunitiesStateContext } from "./context";
import { OpportunitiesActionEnums } from "./actions";

export const OpportunitiesReducer = handleActions<IOpportunitiesStateContext, IOpportunitiesStateContext>(
  {
    [OpportunitiesActionEnums.getOpportunitiesPending]:    (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getOpportunitiesSuccess]:    (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getOpportunitiesError]:      (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getMyOpportunitiesPending]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getMyOpportunitiesSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getMyOpportunitiesError]:    (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getPipelinePending]:         (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getPipelineSuccess]:         (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getPipelineError]:           (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.getStageHistoryPending]:     (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getStageHistorySuccess]:     (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.getStageHistoryError]:       (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.createOpportunityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.createOpportunitySuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.createOpportunityError]:     (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.updateOpportunityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.updateOpportunitySuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.updateOpportunityError]:     (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.moveStagePending]:           (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.moveStageSuccess]:           (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.moveStageError]:             (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.assignOpportunityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.assignOpportunitySuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.assignOpportunityError]:     (state, action) => ({ ...state, ...action.payload }),

    [OpportunitiesActionEnums.deleteOpportunityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunitiesActionEnums.deleteOpportunitySuccess]:   (state, action) => ({
      ...state,
      ...action.payload,
      opportunities: state.opportunities
        ? {
            ...state.opportunities,
            items: state.opportunities.items.filter((o) => o.id !== action.payload.deletedOpportunityId),
            totalCount: state.opportunities.totalCount - 1,
          }
        : state.opportunities,
    }),
    [OpportunitiesActionEnums.deleteOpportunityError]:     (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);