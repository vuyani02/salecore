export type Role =
  | "SalesRep"
  | "SalesManager"
  | "BusinessDevelopmentManager"
  | "Admin";

export type AuthResponse = {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  tenantId: string;
  expiresAt: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  tenantName?: string;
  tenantId?: string;
  role?: Role;
};

export type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  tenantName?: string;
  tenantId?: string;
  role?: Role;
};
