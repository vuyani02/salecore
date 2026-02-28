"use client";
import { useContext, useReducer } from "react";
import { message } from "antd";
import { getAxiosInstance } from "@/util/axiosInstance";
import {
  INITIAL_STATE,
  DocumentsStateContext,
  DocumentsActionContext,
  type IDocumentsActionContext,
  type IDocumentsQuery,
  type IUploadDocumentPayload,
  type IDocumentPagedResult,
  type IDocument,
} from "./context";
import { DocumentsReducer } from "./reducer";
import {
  getDocumentsPending,    getDocumentsSuccess,    getDocumentsError,
  getDocumentPending,     getDocumentSuccess,     getDocumentError,
  uploadDocumentPending,  uploadDocumentSuccess,  uploadDocumentError,
  downloadDocumentPending, downloadDocumentSuccess, downloadDocumentError,
  deleteDocumentPending,  deleteDocumentSuccess,  deleteDocumentError,
} from "./actions";

export const DocumentsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(DocumentsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getDocuments = async (query?: IDocumentsQuery) => {
    dispatch(getDocumentsPending());
    await instance
      .get<IDocumentPagedResult>("/api/documents", { params: query })
      .then((res) => dispatch(getDocumentsSuccess(res.data)))
      .catch(() => { dispatch(getDocumentsError()); message.error("Failed to load documents"); });
  };

  const getDocument = async (id: string) => {
    dispatch(getDocumentPending());
    await instance
      .get<IDocument>(`/api/documents/${id}`)
      .then((res) => dispatch(getDocumentSuccess(res.data)))
      .catch(() => { dispatch(getDocumentError()); message.error("Failed to load document"); });
  };

  const uploadDocument = async (payload: IUploadDocumentPayload) => {
    dispatch(uploadDocumentPending());
    const formData = new FormData();
    formData.append("file",          payload.file);
    formData.append("category",      String(payload.category));
    formData.append("relatedToType", String(payload.relatedToType));
    formData.append("relatedToId",   payload.relatedToId);
    if (payload.description) formData.append("description", payload.description);

    await instance
      .post<IDocument>("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => { dispatch(uploadDocumentSuccess(res.data)); message.success("Document uploaded"); })
      .catch(() => { dispatch(uploadDocumentError()); message.error("Failed to upload document"); });
  };

  const downloadDocument = async (id: string, fileName: string) => {
    dispatch(downloadDocumentPending());
    await instance
      .get(`/api/documents/${id}/download`, { responseType: "blob" })
      .then((res) => {
        dispatch(downloadDocumentSuccess());
        const url  = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href  = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => { dispatch(downloadDocumentError()); message.error("Failed to download document"); });
  };

  const deleteDocument = async (id: string) => {
    dispatch(deleteDocumentPending());
    await instance
      .delete(`/api/documents/${id}`)
      .then(() => { dispatch(deleteDocumentSuccess(id)); message.success("Document deleted"); })
      .catch(() => { dispatch(deleteDocumentError()); message.error("Failed to delete document"); });
  };

  const actions: IDocumentsActionContext = {
    getDocuments, getDocument, uploadDocument, downloadDocument, deleteDocument,
  };

  return (
    <DocumentsStateContext.Provider value={state}>
      <DocumentsActionContext.Provider value={actions}>
        {children}
      </DocumentsActionContext.Provider>
    </DocumentsStateContext.Provider>
  );
};

export const useDocumentsState = () => {
  const context = useContext(DocumentsStateContext);
  if (!context) throw new Error("useDocumentsState must be used within DocumentsProvider");
  return context;
};

export const useDocumentsActions = () => {
  const context = useContext(DocumentsActionContext);
  if (!context) throw new Error("useDocumentsActions must be used within DocumentsProvider");
  return context;
};