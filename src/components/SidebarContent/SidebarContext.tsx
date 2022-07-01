import { createContext, useContext } from 'react';

import type { Request } from 'utils';

interface Sidebar {
  selectedLine?: Request;
  setSelectedLine: (id?: Request) => void;
}

export const SidebarContext = createContext<Sidebar | null>(null);

export const useSidebar = (): Sidebar => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar called outside of context provider');
  }

  return context;
};
