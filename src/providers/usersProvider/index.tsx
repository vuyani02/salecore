"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  UsersStateContext,
  UsersActionContext,
  type IUsersActionContext,
  type IUsersQuery,
  type IUserPagedResult,
  type IUser,
} from "./context";
import { UsersReducer } from "./reducer";
import {
  getUsersPending, getUsersSuccess, getUsersError,
  getUserPending,  getUserSuccess,  getUserError,
} from "./actions";

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(UsersReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getUsers = async (query?: IUsersQuery) => {
    dispatch(getUsersPending());
    await instance
      .get<IUserPagedResult>("/api/users", { params: query })
      .then((r) => dispatch(getUsersSuccess(r.data)))
      .catch(() => { dispatch(getUsersError()); message.error("Failed to load users"); });
  };

  const getUser = async (id: string) => {
    dispatch(getUserPending());
    await instance
      .get<IUser>(`/api/users/${id}`)
      .then((r) => dispatch(getUserSuccess(r.data)))
      .catch(() => { dispatch(getUserError()); message.error("Failed to load user"); });
  };

  const actions: IUsersActionContext = { getUsers, getUser };

  return (
    <UsersStateContext.Provider value={state}>
      <UsersActionContext.Provider value={actions}>
        {children}
      </UsersActionContext.Provider>
    </UsersStateContext.Provider>
  );
};

export const useUsersState = () => {
  const context = useContext(UsersStateContext);
  if (!context) throw new Error("useUsersState must be used within UsersProvider");
  return context;
};

export const useUsersActions = () => {
  const context = useContext(UsersActionContext);
  if (!context) throw new Error("useUsersActions must be used within UsersProvider");
  return context;
};