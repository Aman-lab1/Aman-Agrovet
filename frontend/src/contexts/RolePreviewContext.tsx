import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '../types';

interface RolePreviewContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOwner: boolean;
}

const RolePreviewContext = createContext<RolePreviewContextValue | undefined>(undefined);

export function RolePreviewProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('owner');

  return (
    <RolePreviewContext.Provider
      value={{
        role,
        setRole,
        isOwner: role === 'owner',
      }}
    >
      {children}
    </RolePreviewContext.Provider>
  );
}

export function useRolePreview(): RolePreviewContextValue {
  const ctx = useContext(RolePreviewContext);
  if (!ctx) {
    throw new Error('useRolePreview must be used within RolePreviewProvider');
  }
  return ctx;
}
