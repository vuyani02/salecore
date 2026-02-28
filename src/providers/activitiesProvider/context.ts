import { createContext } from "react";

// ActivityType:   1=Meeting, 2=Call, 3=Email, 4=Task, 5=Presentation, 6=Other
// ActivityStatus: 1=Scheduled, 2=Completed, 3=Cancelled
// Priority:       1=Low, 2=Medium, 3=High, 4=Urgent
// RelatedToType:  1=Client, 2=Opportunity, 3=Proposal, 4=Contract

export interface IActivity {
  id: string;
  type: number;
  typeName?: string;
  subject: string;
  description?: string;
  priority?: number;
  priorityName?: string;
  status: number;
  statusName?: string;
  dueDate?: string;
  completedAt?: string;
  duration?: number;
  location?: string;
  assignedToId?: string;
  assignedToName?: string;
  relatedToType?: number;
  relatedToId?: string;
  relatedToName?: string;
  outcome?: string;
  createdAt?: string;
}

export interface IActivityPagedResult {
  items: IActivity[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface IActivitiesQuery {
  status?: number;
  type?: number;
  assignedToId?: string;
  relatedToType?: number;
  relatedToId?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ICreateActivityPayload {
  type: number;
  subject: string;
  description?: string;
  priority?: number;
  dueDate?: string;
  duration?: number;
  location?: string;
  assignedToId?: string;
  relatedToType?: number;
  relatedToId?: string;
}

export interface IUpdateActivityPayload extends ICreateActivityPayload {}

export interface ICompleteActivityPayload {
  outcome?: string;
}

export interface IActivitiesStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  activities?: IActivityPagedResult;
  activity?: IActivity;
  myActivities?: IActivityPagedResult;
  upcomingActivities?: IActivityPagedResult;
  overdueActivities?: IActivityPagedResult;
  createdActivity?: IActivity;
  updatedActivity?: IActivity;
  deletedActivityId?: string;
}

export interface IActivitiesActionContext {
  getActivities: (query?: IActivitiesQuery) => void;
  getActivity: (id: string) => void;
  getMyActivities: (query?: IActivitiesQuery) => void;
  getUpcomingActivities: (daysAhead?: number) => void;
  getOverdueActivities: () => void;
  createActivity: (payload: ICreateActivityPayload) => void;
  updateActivity: (id: string, payload: IUpdateActivityPayload) => void;
  completeActivity: (id: string, payload: ICompleteActivityPayload) => void;
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