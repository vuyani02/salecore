"use client";

import React from "react";
import { PricingRequestsProvider } from "@/providers/pricingRequestsProvider";

const PricingRequestsLayout = ({ children }: { children: React.ReactNode }) => {
  return <PricingRequestsProvider>{children}</PricingRequestsProvider>;
};

export default PricingRequestsLayout;