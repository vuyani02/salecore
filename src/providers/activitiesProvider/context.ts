import { createContext } from "react";

// ActivityType:   1=Meeting, 2=Call, 3=Email, 4=Task, 5=Presentation, 6=Other
// ActivityStatus: 1=Scheduled, 2=Completed, 3=Cancelled
// RelatedToType:  1=Client, 2=Opportunity, 3=Proposal, 4=Contract, 5=Activity

export interface Activity {
  id: string;
  title: string;
  description?: string;
  activityType: number;
  activityTypeName?: string;
  status: number;
  statusName?: string;
  scheduledAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  assignedToId?: string;
  assignedToName?: string;
  relatedToType?: number;
  relatedToId?: string;
  relatedToName?: string;
  createdAt?: string;
}

export interface ActivityPagedResult {
  items: Activity[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface ActivitiesQuery {
  status?: number;
  activityType?: number;
  assignedToId?: string;
  relatedToType?: number;
  relatedToId?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateActivityPayload {
  title: string;
  description?: string;
  activityType: number;
  scheduledAt?: string;
  durationMinutes?: number;
  assignedToId?: string;
  relatedToType?: number;
  relatedToId?: string;
}

export interface UpdateActivityPayload extends CreateActivityPayload {}

export interface IActivitiesStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  activities?: ActivityPagedResult;
  activity?: Activity;
  myActivities?: ActivityPagedResult;
  upcomingActivities?: ActivityPagedResult;
  overdueActivities?: ActivityPagedResult;
  createdActivity?: Activity;
  updatedActivity?: Activity;
  deletedActivityId?: string;
}

export interface IActivitiesActionContext {
  getActivities: (query?: ActivitiesQuery) => void;
  getActivity: (id: string) => void;
  getMyActivities: (query?: ActivitiesQuery) => void;
  getUpcomingActivities: (query?: ActivitiesQuery) => void;
  getOverdueActivities: (query?: ActivitiesQuery) => void;
  createActivity: (payload: CreateActivityPayload) => void;
  updateActivity: (id: string, payload: UpdateActivityPayload) => void;
  completeActivity: (id: string) => void;
  cancelActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

export const INITIAL_STATE: IActivitiesStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const ActivitiesStateContext =
  createContext<IActivitiesStateContext>(INITIAL_STATE);

export const ActivitiesActionContext =
  createContext<IActivitiesActionContext | undefined>(undefined);