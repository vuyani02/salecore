"use client";

import React from "react";
import { OpportunitiesProvider } from "@/providers/opportunitiesProvider";

const OpportunitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return <OpportunitiesProvider>{children}</OpportunitiesProvider>;
};

export default OpportunitiesLayout;