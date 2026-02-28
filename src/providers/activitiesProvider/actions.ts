import { createAction } from "redux-actions";
import type { IActivitiesStateContext, Activity, ActivityPagedResult } from "./context";

export enum ActivitiesActionEnums {
  getActivitiesPending   = "GET_ACTIVITIES_PENDING",
  getActivitiesSuccess   = "GET_ACTIVITIES_SUCCESS",
  getActivitiesError     = "GET_ACTIVITIES_ERROR",

  getActivityPending     = "GET_ACTIVITY_PENDING",
  getActivitySuccess     = "GET_ACTIVITY_SUCCESS",
  getActivityError       = "GET_ACTIVITY_ERROR",

  getMyActivitiesPending = "GET_MY_ACTIVITIES_PENDING",
  getMyActivitiesSuccess = "GET_MY_ACTIVITIES_SUCCESS",
  getMyActivitiesError   = "GET_MY_ACTIVITIES_ERROR",

  getUpcomingPending     = "GET_UPCOMING_ACTIVITIES_PENDING",
  getUpcomingSuccess     = "GET_UPCOMING_ACTIVITIES_SUCCESS",
  getUpcomingError       = "GET_UPCOMING_ACTIVITIES_ERROR",

  getOverduePending      = "GET_OVERDUE_ACTIVITIES_PENDING",
  getOverdueSuccess      = "GET_OVERDUE_ACTIVITIES_SUCCESS",
  getOverdueError        = "GET_OVERDUE_ACTIVITIES_ERROR",

  createActivityPending  = "CREATE_ACTIVITY_PENDING",
  createActivitySuccess  = "CREATE_ACTIVITY_SUCCESS",
  createActivityError    = "CREATE_ACTIVITY_ERROR",

  updateActivityPending  = "UPDATE_ACTIVITY_PENDING",
  updateActivitySuccess  = "UPDATE_ACTIVITY_SUCCESS",
  updateActivityError    = "UPDATE_ACTIVITY_ERROR",

  completeActivityPending = "COMPLETE_ACTIVITY_PENDING",
  completeActivitySuccess = "COMPLETE_ACTIVITY_SUCCESS",
  completeActivityError   = "COMPLETE_ACTIVITY_ERROR",

  cancelActivityPending  = "CANCEL_ACTIVITY_PENDING",
  cancelActivitySuccess  = "CANCEL_ACTIVITY_SUCCESS",
  cancelActivityError    = "CANCEL_ACTIVITY_ERROR",

  deleteActivityPending  = "DELETE_ACTIVITY_PENDING",
  deleteActivitySuccess  = "DELETE_ACTIVITY_SUCCESS",
  deleteActivityError    = "DELETE_ACTIVITY_ERROR",
}

export const getActivitiesPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getActivitiesPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getActivitiesSuccess = createAction<IActivitiesStateContext, ActivityPagedResult>(ActivitiesActionEnums.getActivitiesSuccess, (activities) => ({ isPending: false, isSuccess: true, isError: false, activities }));
export const getActivitiesError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getActivitiesError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const getActivityPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getActivityPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getActivitySuccess = createAction<IActivitiesStateContext, Activity>(ActivitiesActionEnums.getActivitySuccess, (activity) => ({ isPending: false, isSuccess: true, isError: false, activity }));
export const getActivityError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getActivityError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const getMyActivitiesPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getMyActivitiesPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getMyActivitiesSuccess = createAction<IActivitiesStateContext, ActivityPagedResult>(ActivitiesActionEnums.getMyActivitiesSuccess, (myActivities) => ({ isPending: false, isSuccess: true, isError: false, myActivities }));
export const getMyActivitiesError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getMyActivitiesError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const getUpcomingPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getUpcomingPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getUpcomingSuccess = createAction<IActivitiesStateContext, ActivityPagedResult>(ActivitiesActionEnums.getUpcomingSuccess, (upcomingActivities) => ({ isPending: false, isSuccess: true, isError: false, upcomingActivities }));
export const getUpcomingError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getUpcomingError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const getOverduePending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getOverduePending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const getOverdueSuccess = createAction<IActivitiesStateContext, ActivityPagedResult>(ActivitiesActionEnums.getOverdueSuccess, (overdueActivities) => ({ isPending: false, isSuccess: true, isError: false, overdueActivities }));
export const getOverdueError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.getOverdueError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const createActivityPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.createActivityPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const createActivitySuccess = createAction<IActivitiesStateContext, Activity>(ActivitiesActionEnums.createActivitySuccess, (createdActivity) => ({ isPending: false, isSuccess: true, isError: false, createdActivity }));
export const createActivityError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.createActivityError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const updateActivityPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.updateActivityPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const updateActivitySuccess = createAction<IActivitiesStateContext, Activity>(ActivitiesActionEnums.updateActivitySuccess, (updatedActivity) => ({ isPending: false, isSuccess: true, isError: false, updatedActivity }));
export const updateActivityError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.updateActivityError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const completeActivityPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.completeActivityPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const completeActivitySuccess = createAction<IActivitiesStateContext, Activity>(ActivitiesActionEnums.completeActivitySuccess, (updatedActivity) => ({ isPending: false, isSuccess: true, isError: false, updatedActivity }));
export const completeActivityError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.completeActivityError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const cancelActivityPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.cancelActivityPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const cancelActivitySuccess = createAction<IActivitiesStateContext, Activity>(ActivitiesActionEnums.cancelActivitySuccess, (updatedActivity) => ({ isPending: false, isSuccess: true, isError: false, updatedActivity }));
export const cancelActivityError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.cancelActivityError, () => ({ isPending: false, isSuccess: false, isError: true }));

export const deleteActivityPending = createAction<IActivitiesStateContext>(ActivitiesActionEnums.deleteActivityPending, () => ({ isPending: true, isSuccess: false, isError: false }));
export const deleteActivitySuccess = createAction<IActivitiesStateContext, string>(ActivitiesActionEnums.deleteActivitySuccess, (deletedActivityId) => ({ isPending: false, isSuccess: true, isError: false, deletedActivityId }));
export const deleteActivityError   = createAction<IActivitiesStateContext>(ActivitiesActionEnums.deleteActivityError, () => ({ isPending: false, isSuccess: false, isError: true }));