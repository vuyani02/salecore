import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IActivitiesStateContext } from "./context";
import { ActivitiesActionEnums } from "./actions";

export const ActivitiesReducer = handleActions<IActivitiesStateContext, IActivitiesStateContext>(
  {
    [ActivitiesActionEnums.getActivitiesPending]:    (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getActivitiesSuccess]:    (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getActivitiesError]:      (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.getActivityPending]:      (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getActivitySuccess]:      (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getActivityError]:        (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.getMyActivitiesPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getMyActivitiesSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getMyActivitiesError]:    (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.getUpcomingPending]:      (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getUpcomingSuccess]:      (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getUpcomingError]:        (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.getOverduePending]:       (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getOverdueSuccess]:       (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.getOverdueError]:         (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.createActivityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.createActivitySuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.createActivityError]:     (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.updateActivityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.updateActivitySuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.updateActivityError]:     (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.completeActivityPending]: (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.completeActivitySuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.completeActivityError]:   (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.cancelActivityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.cancelActivitySuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.cancelActivityError]:     (state, action) => ({ ...state, ...action.payload }),

    [ActivitiesActionEnums.deleteActivityPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivitiesActionEnums.deleteActivitySuccess]:   (state, action) => ({
      ...state,
      ...action.payload,
      activities: state.activities
        ? {
            ...state.activities,
            items: state.activities.items.filter((a) => a.id !== action.payload.deletedActivityId),
            totalCount: state.activities.totalCount - 1,
          }
        : state.activities,
    }),
    [ActivitiesActionEnums.deleteActivityError]:     (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);