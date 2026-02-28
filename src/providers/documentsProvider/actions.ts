import { createAction } from "redux-actions";
import type { IDocumentsStateContext, IDocument, IDocumentPagedResult } from "./context";

export enum DocumentsActionEnums {
  getDocumentsPending = "GET_DOCUMENTS_PENDING",
  getDocumentsSuccess = "GET_DOCUMENTS_SUCCESS",
  getDocumentsError   = "GET_DOCUMENTS_ERROR",

  getDocumentPending = "GET_DOCUMENT_PENDING",
  getDocumentSuccess = "GET_DOCUMENT_SUCCESS",
  getDocumentError   = "GET_DOCUMENT_ERROR",

  uploadDocumentPending = "UPLOAD_DOCUMENT_PENDING",
  uploadDocumentSuccess = "UPLOAD_DOCUMENT_SUCCESS",
  uploadDocumentError   = "UPLOAD_DOCUMENT_ERROR",

  downloadDocumentPending = "DOWNLOAD_DOCUMENT_PENDING",
  downloadDocumentSuccess = "DOWNLOAD_DOCUMENT_SUCCESS",
  downloadDocumentError   = "DOWNLOAD_DOCUMENT_ERROR",

  deleteDocumentPending = "DELETE_DOCUMENT_PENDING",
  deleteDocumentSuccess = "DELETE_DOCUMENT_SUCCESS",
  deleteDocumentError   = "DELETE_DOCUMENT_ERROR",
}

const pending = (type: string) =>
  createAction<IDocumentsStateContext>(type, () => ({ isPending: true, isSuccess: false, isError: false }));

const error = (type: string) =>
  createAction<IDocumentsStateContext>(type, () => ({ isPending: false, isSuccess: false, isError: true }));

export const getDocumentsPending = pending(DocumentsActionEnums.getDocumentsPending);
export const getDocumentsSuccess = createAction<IDocumentsStateContext, IDocumentPagedResult>(
  DocumentsActionEnums.getDocumentsSuccess,
  (documents) => ({ isPending: false, isSuccess: true, isError: false, documents })
);
export const getDocumentsError = error(DocumentsActionEnums.getDocumentsError);

export const getDocumentPending = pending(DocumentsActionEnums.getDocumentPending);
export const getDocumentSuccess = createAction<IDocumentsStateContext, IDocument>(
  DocumentsActionEnums.getDocumentSuccess,
  (document) => ({ isPending: false, isSuccess: true, isError: false, document })
);
export const getDocumentError = error(DocumentsActionEnums.getDocumentError);

export const uploadDocumentPending = pending(DocumentsActionEnums.uploadDocumentPending);
export const uploadDocumentSuccess = createAction<IDocumentsStateContext, IDocument>(
  DocumentsActionEnums.uploadDocumentSuccess,
  (document) => ({ isPending: false, isSuccess: true, isError: false, document })
);
export const uploadDocumentError = error(DocumentsActionEnums.uploadDocumentError);

export const downloadDocumentPending = pending(DocumentsActionEnums.downloadDocumentPending);
export const downloadDocumentSuccess = createAction<IDocumentsStateContext>(
  DocumentsActionEnums.downloadDocumentSuccess,
  () => ({ isPending: false, isSuccess: true, isError: false })
);
export const downloadDocumentError = error(DocumentsActionEnums.downloadDocumentError);

export const deleteDocumentPending = pending(DocumentsActionEnums.deleteDocumentPending);
export const deleteDocumentSuccess = createAction<IDocumentsStateContext, string>(
  DocumentsActionEnums.deleteDocumentSuccess,
  (deletedDocumentId) => ({ isPending: false, isSuccess: true, isError: false, deletedDocumentId })
);
export const deleteDocumentError = error(DocumentsActionEnums.deleteDocumentError);