"use client";

import React from "react";
import { ClientsProvider } from "@/providers/clientsProvider";

const OpportunitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return <ClientsProvider>{children}</ClientsProvider>;
};

export default OpportunitiesLayout;