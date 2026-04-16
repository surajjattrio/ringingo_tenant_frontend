// src/contexts/DashboardContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  activeTab: 'normal',
  setActiveTab: () => {},
});

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState('normal');

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext
// export const useDashboardContext = () => useContext(DashboardContext);
