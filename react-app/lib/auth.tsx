import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCurrentUser } from '@/lib/utils/api';
import type { components } from '@/types/swagger-types';
type User = components['schemas']['AuthUserDto'];
const AuthContext = createContext<{
  user: User | null;
  refreshUser: () => Promise<void>;
}>({ user: null, refreshUser: async () => {} });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const refreshUser = useCallback(async () => {
    const result = await getCurrentUser();
    setUser(result.ok && result.data ? result.data : null);
  }, []);
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);
  return (
    <AuthContext.Provider value={{ user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
