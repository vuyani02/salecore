import { createContext } from "react";

// ── Enums ─────────────────────────────────────────────────────────────────────
export const DOCUMENT_CATEGORY: Record<number, { label: string }> = {
  1: { label: "Proposal"     },
  2: { label: "Contract"     },
  3: { label: "Presentation" },
  4: { label: "RFP"          },
  5: { label: "Other"        },
};

export const RELATED_TO_TYPE: Record<number, { label: string }> = {
  1: { label: "Client"      },
  2: { label: "Opportunity"  },
  3: { label: "Proposal"    },
  4: { label: "Contract"    },
  5: { label: "Activity"    },
};

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface IDocument {
  id: string;
  fileName: string;
  fileSize?: number;
  contentType?: string;
  category: number;
  categoryName?: string;
  relatedToType: number;
  relatedToTypeName?: string;
  relatedToId: string;
  description?: string;
  uploadedById?: string;
  uploadedByName?: string;
  createdAt?: string;
}

export interface IDocumentPagedResult {
  items: IDocument[];
  totalCount: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface IDocumentsQuery {
  relatedToType?: number;
  relatedToId?: string;
  category?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface IUploadDocumentPayload {
  file: File;
  category: number;
  relatedToType: number;
  relatedToId: string;
  description?: string;
}

export interface IDocumentsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  documents?: IDocumentPagedResult;
  document?: IDocument;
  deletedDocumentId?: string;
}

export interface IDocumentsActionContext {
  getDocuments: (query?: IDocumentsQuery) => void;
  getDocument: (id: string) => void;
  uploadDocument: (payload: IUploadDocumentPayload) => void;
  downloadDocument: (id: string, fileName: string) => void;
  deleteDocument: (id: string) => void;
}

export const INITIAL_STATE: IDocumentsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

export const DocumentsStateContext =
  createContext<IDocumentsStateContext>(INITIAL_STATE);

export const DocumentsActionContext =
  createContext<IDocumentsActionContext | undefined>(undefined);