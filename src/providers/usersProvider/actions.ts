import { createAction } from "redux-actions";
import type { IUsersStateContext, IUser, IUserPagedResult } from "./context";

export enum UsersActionEnums {
  getUsersPending = "GET_USERS_PENDING",
  getUsersSuccess = "GET_USERS_SUCCESS",
  getUsersError   = "GET_USERS_ERROR",

  getUserPending  = "GET_USER_PENDING",
  getUserSuccess  = "GET_USER_SUCCESS",
  getUserError    = "GET_USER_ERROR",
}

export const getUsersPending = createAction<IUsersStateContext>(UsersActionEnums.getUsersPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getUsersSuccess = createAction<IUsersStateContext, IUserPagedResult>(UsersActionEnums.getUsersSuccess, (users) => ({ isPending: false, isSuccess: true,  isError: false, users }));
export const getUsersError   = createAction<IUsersStateContext>(UsersActionEnums.getUsersError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getUserPending  = createAction<IUsersStateContext>(UsersActionEnums.getUserPending,  () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getUserSuccess  = createAction<IUsersStateContext, IUser>(UsersActionEnums.getUserSuccess, (user) => ({ isPending: false, isSuccess: true,  isError: false, user }));
export const getUserError    = createAction<IUsersStateContext>(UsersActionEnums.getUserError,    () => ({ isPending: false, isSuccess: false, isError: true  }));