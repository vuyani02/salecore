import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IContractsStateContext } from "./context";
import { ContractsActionEnums } from "./actions";

export const ContractsReducer = handleActions<IContractsStateContext, IContractsStateContext>(
  {
    [ContractsActionEnums.getContractsPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.getContractsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.getContractsError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.getContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.getContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.getExpiringPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.getExpiringSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.getExpiringError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.createContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.createContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.updateContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.updateContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.updateContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.activateContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.activateContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.activateContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.cancelContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.cancelContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.cancelContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.createRenewalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.createRenewalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.createRenewalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.completeRenewalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.completeRenewalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.completeRenewalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractsActionEnums.deleteContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractsActionEnums.deleteContractSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
      contracts: state.contracts
        ? {
            ...state.contracts,
            items: state.contracts.items.filter((c) => c.id !== action.payload.deletedContractId),
            totalCount: state.contracts.totalCount - 1,
          }
        : state.contracts,
    }),
    [ContractsActionEnums.deleteContractError]: (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);