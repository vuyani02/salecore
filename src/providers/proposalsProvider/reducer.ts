import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IProposalsStateContext } from "./context";
import { ProposalsActionEnums } from "./actions";

export const ProposalsReducer = handleActions<IProposalsStateContext, IProposalsStateContext>(
  {
    [ProposalsActionEnums.getProposalsPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.getProposalsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.getProposalsError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.getProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.getProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.getProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.createProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.createProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.createProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.updateProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.updateProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.deleteProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.deleteProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.addLineItemPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.addLineItemSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.addLineItemError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.updateLineItemPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.updateLineItemSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.updateLineItemError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.deleteLineItemPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.deleteLineItemSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.deleteLineItemError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.submitProposalPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.submitProposalSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.submitProposalError]:    (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.approveProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.approveProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.approveProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalsActionEnums.rejectProposalPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.rejectProposalSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ProposalsActionEnums.rejectProposalError]:    (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);