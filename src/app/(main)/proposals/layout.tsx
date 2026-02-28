"use client";

import React from "react";
import { ProposalsProvider } from "@/providers/proposalsProvider";

const ProposalsLayout = ({ children }: { children: React.ReactNode }) => {
  return <ProposalsProvider>{children}</ProposalsProvider>;
};

export default ProposalsLayout;