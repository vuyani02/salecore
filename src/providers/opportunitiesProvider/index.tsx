"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  OpportunitiesActionContext,
  OpportunitiesStateContext,
  type IOpportunitiesActionContext,
} from "./context";
import { OpportunitiesReducer } from "./reducer";
import {
  getOpportunitiesPending,
  getOpportunitiesSuccess,
  getOpportunitiesError,
  getMyOpportunitiesPending,
  getMyOpportunitiesSuccess,
  getMyOpportunitiesError,
  createOpportunityPending,
  createOpportunitySuccess,
  createOpportunityError,
  deleteOpportunityPending,
  deleteOpportunitySuccess,
  deleteOpportunityError,
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
      .then((response) => {
        dispatch(getOpportunitiesSuccess(response.data));
        console.log(response.data)
      })
      .catch(() => {
        dispatch(getOpportunitiesError());
        message.error("Failed to load opportunities");
      });
  };

  const getMyOpportunities = async (query?: OpportunitiesQuery) => {
    dispatch(getMyOpportunitiesPending());
    await instance
      .get<OpportunityPagedResult>("/api/opportunities/my-opportunities", { params: query })
      .then((response) => {
        dispatch(getMyOpportunitiesSuccess(response.data));
      })
      .catch(() => {
        dispatch(getMyOpportunitiesError());
        message.error("Failed to load my opportunities");
      });
  };

  const createOpportunity = async (payload: CreateOpportunityPayload) => {
    dispatch(createOpportunityPending());
    await instance
      .post<Opportunity>("/api/opportunities", payload)
      .then((response) => {
        dispatch(createOpportunitySuccess(response.data));
        message.success("Opportunity created");
      })
      .catch(() => {
        dispatch(createOpportunityError());
        message.error("Failed to create opportunity");
      });
  };

  const deleteOpportunity = async (id: string) => {
    dispatch(deleteOpportunityPending());
    await instance
      .delete(`/api/opportunities/${id}`)
      .then(() => {
        dispatch(deleteOpportunitySuccess(id));
        message.success("Opportunity deleted");
      })
      .catch(() => {
        dispatch(deleteOpportunityError());
        message.error("Failed to delete opportunity");
      });
  };

  const actions: IOpportunitiesActionContext = {
    getOpportunities,
    getMyOpportunities,
    createOpportunity,
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