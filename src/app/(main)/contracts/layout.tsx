"use client";

import React from "react";
import { ContractsProvider } from "@/providers/contractsProvider";

const ContractsLayout = ({ children }: { children: React.ReactNode }) => {
  return <ContractsProvider>{children}</ContractsProvider>;
};

export default ContractsLayout;