"use client";

import React from "react";
import { ClientsProvider } from "@/providers/clientsProvider";

const ClientsLayout = ({ children }: { children: React.ReactNode }) => {
  return <ClientsProvider>{children}</ClientsProvider>;
};

export default ClientsLayout;