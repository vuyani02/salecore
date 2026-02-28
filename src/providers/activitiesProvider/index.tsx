"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  ActivitiesStateContext,
  ActivitiesActionContext,
  type IActivitiesActionContext,
  type IActivitiesQuery,
  type ICreateActivityPayload,
  type IUpdateActivityPayload,
  type ICompleteActivityPayload,
  type IActivityPagedResult,
  type IActivity,
} from "./context";
import { ActivitiesReducer } from "./reducer";
import {
  getActivitiesPending,    getActivitiesSuccess,    getActivitiesError,
  getActivityPending,      getActivitySuccess,      getActivityError,
  getMyActivitiesPending,  getMyActivitiesSuccess,  getMyActivitiesError,
  getUpcomingPending,      getUpcomingSuccess,      getUpcomingError,
  getOverduePending,       getOverdueSuccess,       getOverdueError,
  createActivityPending,   createActivitySuccess,   createActivityError,
  updateActivityPending,   updateActivitySuccess,   updateActivityError,
  completeActivityPending, completeActivitySuccess, completeActivityError,
  cancelActivityPending,   cancelActivitySuccess,   cancelActivityError,
  deleteActivityPending,   deleteActivitySuccess,   deleteActivityError,
} from "./actions";

export const ActivitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(ActivitiesReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getActivities = async (query?: IActivitiesQuery) => {
    dispatch(getActivitiesPending());
    await instance
      .get<IActivityPagedResult>("/api/activities", { params: query })
      .then((r) => dispatch(getActivitiesSuccess(r.data)))
      .catch(() => { dispatch(getActivitiesError()); message.error("Failed to load activities"); });
  };

  const getActivity = async (id: string) => {
    dispatch(getActivityPending());
    await instance
      .get<IActivity>(`/api/activities/${id}`)
      .then((r) => dispatch(getActivitySuccess(r.data)))
      .catch(() => { dispatch(getActivityError()); message.error("Failed to load activity"); });
  };

  const getMyActivities = async (query?: IActivitiesQuery) => {
    dispatch(getMyActivitiesPending());
    await instance
      .get<IActivityPagedResult>("/api/activities/my-activities", { params: query })
      .then((r) => dispatch(getMyActivitiesSuccess(r.data)))
      .catch(() => { dispatch(getMyActivitiesError()); message.error("Failed to load your activities"); });
  };

  const getUpcomingActivities = async (daysAhead = 7) => {
    dispatch(getUpcomingPending());
    await instance
      .get<IActivityPagedResult>("/api/activities/upcoming", { params: { daysAhead } })
      .then((r) => dispatch(getUpcomingSuccess(r.data)))
      .catch(() => { dispatch(getUpcomingError()); message.error("Failed to load upcoming activities"); });
  };

  const getOverdueActivities = async () => {
    dispatch(getOverduePending());
    await instance
      .get<IActivityPagedResult>("/api/activities/overdue")
      .then((r) => dispatch(getOverdueSuccess(r.data)))
      .catch(() => { dispatch(getOverdueError()); message.error("Failed to load overdue activities"); });
  };

  const createActivity = async (payload: ICreateActivityPayload) => {
    dispatch(createActivityPending());
    await instance
      .post<IActivity>("/api/activities", payload)
      .then((r) => { dispatch(createActivitySuccess(r.data)); message.success("Activity created"); })
      .catch(() => { dispatch(createActivityError()); message.error("Failed to create activity"); });
  };

  const updateActivity = async (id: string, payload: IUpdateActivityPayload) => {
    dispatch(updateActivityPending());
    await instance
      .put<IActivity>(`/api/activities/${id}`, payload)
      .then((r) => { dispatch(updateActivitySuccess(r.data)); message.success("Activity updated"); })
      .catch(() => { dispatch(updateActivityError()); message.error("Failed to update activity"); });
  };

  const completeActivity = async (id: string, payload: ICompleteActivityPayload) => {
    dispatch(completeActivityPending());
    await instance
      .put<IActivity>(`/api/activities/${id}/complete`, payload)
      .then((r) => { dispatch(completeActivitySuccess(r.data)); message.success("Activity completed"); })
      .catch(() => { dispatch(completeActivityError()); message.error("Failed to complete activity"); });
  };

  const cancelActivity = async (id: string) => {
    dispatch(cancelActivityPending());
    await instance
      .put<IActivity>(`/api/activities/${id}/cancel`)
      .then((r) => { dispatch(cancelActivitySuccess(r.data)); message.success("Activity cancelled"); })
      .catch(() => { dispatch(cancelActivityError()); message.error("Failed to cancel activity"); });
  };

  const deleteActivity = async (id: string) => {
    dispatch(deleteActivityPending());
    await instance
      .delete(`/api/activities/${id}`)
      .then(() => { dispatch(deleteActivitySuccess(id)); message.success("Activity deleted"); })
      .catch(() => { dispatch(deleteActivityError()); message.error("Failed to delete activity"); });
  };

  const actions: IActivitiesActionContext = {
    getActivities, getActivity, getMyActivities,
    getUpcomingActivities, getOverdueActivities,
    createActivity, updateActivity,
    completeActivity, cancelActivity,
    deleteActivity,
  };

  return (
    <ActivitiesStateContext.Provider value={state}>
      <ActivitiesActionContext.Provider value={actions}>
        {children}
      </ActivitiesActionContext.Provider>
    </ActivitiesStateContext.Provider>
  );
};

export const useActivitiesState = () => {
  const context = useContext(ActivitiesStateContext);
  if (!context) throw new Error("useActivitiesState must be used within ActivitiesProvider");
  return context;
};

export const useActivitiesActions = () => {
  const context = useContext(ActivitiesActionContext);
  if (!context) throw new Error("useActivitiesActions must be used within ActivitiesProvider");
  return context;
};