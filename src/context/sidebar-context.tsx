"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

const SidebarContext = createContext({
  isSidebarOpen: false,
  toggleSidebar: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext>
  );
};

export const useSidebar = () => {
  const sidebarContext = useContext(SidebarContext);

  if (!SidebarContext) {
    throw new Error("useSidebar has to be used within <SidebarProvider>");
  }

  return sidebarContext;
};
