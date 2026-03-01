import { createContext } from "react";
import type {
  Opportunity,
  OpportunityPagedResult,
  OpportunitiesQuery,
  CreateOpportunityPayload,
} from "@/types/opportunities";

export interface PipelineStage {
  stage: number;
  stageName: string;
  count: number;
  totalValue: number;
  weightedValue: number;
}

export interface Pipeline {
  stages: PipelineStage[];
  totalOpportunities: number;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  winRate: number;
}

export interface StageHistoryItem {
  id: string;
  fromStage?: number;
  toStage: number;
  notes?: string;
  lossReason?: string;
  changedByName: string;
  changedAt: string;
}

export interface MoveStagePayload {
  stage: number;
  notes?: string;
  lossReason?: string;
}

export interface IOpportunitiesStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  opportunities?: OpportunityPagedResult;
  myOpportunities?: OpportunityPagedResult;
  pipeline?: Pipeline;
  stageHistory?: StageHistoryItem[];
  createdOpportunity?: Opportunity;
  updatedOpportunity?: Opportunity;
  deletedOpportunityId?: string;
}

export interface IOpportunitiesActionContext {
  getOpportunities: (query?: OpportunitiesQuery) => void;
  getMyOpportunities: (query?: OpportunitiesQuery) => void;
  getPipeline: (ownerId?: string) => void;
  getStageHistory: (id: string) => void;
  createOpportunity: (payload: CreateOpportunityPayload) => void;
  updateOpportunity: (id: string, payload: CreateOpportunityPayload) => void;
  moveStage: (id: string, payload: MoveStagePayload) => void;
  assignOpportunity: (id: string, userId: string) => void;
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