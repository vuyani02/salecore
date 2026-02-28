import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IContactsStateContext } from "./context";
import { ContactsActionEnums } from "./actions";

export const ContactsReducer = handleActions<IContactsStateContext, IContactsStateContext>(
  {
    [ContactsActionEnums.getContactsPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.getContactsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.getContactsError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.getContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.getContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.getContactError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.createContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.createContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.createContactError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.updateContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.updateContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.updateContactError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContactsActionEnums.deleteContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.deleteContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactsActionEnums.deleteContactError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);