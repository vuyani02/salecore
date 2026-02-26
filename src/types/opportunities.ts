export type Opportunity = {
  id: string;
  title: string;
  clientId: string;
  clientName?: string | null;
  contactId?: string | null;
  ownerId?: string | null;
  ownerName?: string | null;
  estimatedValue: number;
  currency: string;
  stage: number;
  stageName?: string | null;
  probability: number;
  expectedCloseDate?: string | null;
  description?: string | null;
};

export type OpportunityPagedResult = {
  items: Opportunity[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages?: number;
};

export type OpportunitiesQuery = {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  stage?: number;
  clientId?: string;
  ownerId?: string;
};

export type CreateOpportunityPayload = {
  title: string;
  clientId: string;
  contactId?: string;
  estimatedValue: number;
  currency: string;
  stage: number;
  source: number;
  probability: number;
  expectedCloseDate?: string;
  description?: string;
};