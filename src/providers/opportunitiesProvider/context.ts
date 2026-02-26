import { createContext } from "react";
import type {
  Opportunity,
  OpportunityPagedResult,
  OpportunitiesQuery,
  CreateOpportunityPayload,
} from "@/types/opportunities";

export interface IOpportunitiesStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  opportunities?: OpportunityPagedResult;
  myOpportunities?: OpportunityPagedResult;
  createdOpportunity?: Opportunity;
  deletedOpportunityId?: string;
}

export interface IOpportunitiesActionContext {
  getOpportunities: (query?: OpportunitiesQuery) => void;
  getMyOpportunities: (query?: OpportunitiesQuery) => void;
  createOpportunity: (payload: CreateOpportunityPayload) => void;
  deleteOpportunity: (id: string) => void;
}

export const INITIAL_STATE: IOpportunitiesStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const OpportunitiesStateContext =
  createContext<IOpportunitiesStateContext>(INITIAL_STATE);

export const OpportunitiesActionContext =
  createContext<IOpportunitiesActionContext | undefined>(undefined);