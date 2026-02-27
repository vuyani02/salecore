import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IPricingRequestsStateContext } from "./context";
import { PricingRequestsActionEnums } from "./actions";

export const PricingRequestsReducer = handleActions<IPricingRequestsStateContext, IPricingRequestsStateContext>(
  {
    [PricingRequestsActionEnums.getPricingRequestsPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getPricingRequestsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getPricingRequestsError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getPricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getPricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getMyRequestsPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getMyRequestsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getMyRequestsError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.getPendingRequestsPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getPendingRequestsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.getPendingRequestsError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.createPricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.createPricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.createPricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.updatePricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.updatePricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.updatePricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.assignPricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.assignPricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.assignPricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.completePricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.completePricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.completePricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestsActionEnums.deletePricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestsActionEnums.deletePricingRequestSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
      pricingRequests: state.pricingRequests
        ? {
            ...state.pricingRequests,
            items: state.pricingRequests.items.filter(
              (r) => r.id !== action.payload.deletedPricingRequestId
            ),
            totalCount: state.pricingRequests.totalCount - 1,
          }
        : state.pricingRequests,
    }),
    [PricingRequestsActionEnums.deletePricingRequestError]: (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);