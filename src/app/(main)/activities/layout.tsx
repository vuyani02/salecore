"use client";

import React from "react";
import { ActivitiesProvider } from "@/providers/activitiesProvider";

const OpportunitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return <ActivitiesProvider>{children}</ActivitiesProvider>;
};

export default OpportunitiesLayout;