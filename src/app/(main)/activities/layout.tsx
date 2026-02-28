"use client";

import React from "react";
import { ActivitiesProvider } from "@/providers/activitiesProvider";
import { UsersProvider } from "@/providers/usersProvider";

const ActivitiesLayout = ({ children }: { children: React.ReactNode }) => {
  return (<UsersProvider>
              <ActivitiesProvider>
                  {children}
              </ActivitiesProvider>
          </UsersProvider>);
};

export default ActivitiesLayout;