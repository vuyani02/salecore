import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IClientsStateContext } from "./context";
import { ClientsActionEnums } from "./actions";

export const ClientsReducer = handleActions<IClientsStateContext, IClientsStateContext>(
  {
    [ClientsActionEnums.getClientsPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.getClientsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.getClientsError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientsActionEnums.getClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.getClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.getClientError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientsActionEnums.getClientStatsPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.getClientStatsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.getClientStatsError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientsActionEnums.createClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.createClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.createClientError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientsActionEnums.updateClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.updateClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.updateClientError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientsActionEnums.deleteClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.deleteClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientsActionEnums.deleteClientError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);