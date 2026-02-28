import { createContext } from "react";

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  isActive: boolean;
  roles: string[];
  lastLoginAt?: string;
  createdAt?: string;
}

export interface IUserPagedResult {
  items: IUser[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IUsersQuery {
  role?: string;
  searchTerm?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface IUsersStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  users?: IUserPagedResult;
  user?: IUser;
}

export interface IUsersActionContext {
  getUsers: (query?: IUsersQuery) => void;
  getUser: (id: string) => void;
}

export const INITIAL_STATE: IUsersStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const UsersStateContext =
  createContext<IUsersStateContext>(INITIAL_STATE);

export const UsersActionContext =
  createContext<IUsersActionContext | undefined>(undefined);