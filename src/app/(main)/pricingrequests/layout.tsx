"use client";

import React from "react";
import { PricingRequestsProvider } from "@/providers/pricingRequestsProvider";

const OpportunitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return <PricingRequestsProvider>{children}</PricingRequestsProvider>;
};

export default OpportunitiesLayout;