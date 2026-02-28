import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IUsersStateContext } from "./context";
import { UsersActionEnums } from "./actions";

export const UsersReducer = handleActions<IUsersStateContext, IUsersStateContext>(
  {
    [UsersActionEnums.getUsersPending]: (state, action) => ({ ...state, ...action.payload }),
    [UsersActionEnums.getUsersSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [UsersActionEnums.getUsersError]:   (state, action) => ({ ...state, ...action.payload }),

    [UsersActionEnums.getUserPending]:  (state, action) => ({ ...state, ...action.payload }),
    [UsersActionEnums.getUserSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [UsersActionEnums.getUserError]:    (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);