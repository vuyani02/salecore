import { handleActions } from "redux-actions";
import { INITIAL_STATE, type IDocumentsStateContext } from "./context";
import { DocumentsActionEnums } from "./actions";

export const DocumentsReducer = handleActions<IDocumentsStateContext, IDocumentsStateContext>(
  {
    [DocumentsActionEnums.getDocumentsPending]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.getDocumentsSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.getDocumentsError]:   (state, action) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.getDocumentPending]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.getDocumentSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.getDocumentError]:   (state, action) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.uploadDocumentPending]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.uploadDocumentSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.uploadDocumentError]:   (state, action) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.downloadDocumentPending]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.downloadDocumentSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.downloadDocumentError]:   (state, action) => ({ ...state, ...action.payload }),

    [DocumentsActionEnums.deleteDocumentPending]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.deleteDocumentSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [DocumentsActionEnums.deleteDocumentError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_STATE
);