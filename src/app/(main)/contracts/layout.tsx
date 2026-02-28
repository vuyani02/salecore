"use client";

import React from "react";
import { ContractsProvider } from "@/providers/contractsProvider";

const OpportunitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return <ContractsProvider>{children}</ContractsProvider>;
};

export default OpportunitiesLayout;