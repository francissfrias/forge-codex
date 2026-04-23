import React, { useContext } from 'react';
import DnDContext, { DnDProvider } from '../hooks/useDnd';

const DndProvider = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(DnDContext);
  if (context === undefined) {
    throw new Error(
      'DndProvider must be used within a DnDProvider'
    );
  }
  return <DnDProvider>{children}</DnDProvider>;
};

export default DndProvider;
