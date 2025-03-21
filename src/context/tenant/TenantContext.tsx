
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  isActive: boolean;
  settings: Record<string, any>;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  tenantDomain: string | null;
  isLoading: boolean;
  error: Error | null;
  refetchTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantDomain, setTenantDomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenantInfo = async () => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const domain = user.email.split('@')[1];
      setTenantDomain(domain);

      // Fetch tenant by domain
      const { data, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .eq('domain', domain)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setCurrentTenant({
          id: data.id,
          name: data.name,
          domain: data.domain,
          isActive: data.is_active,
          settings: data.settings || {}
        });
      }
    } catch (err) {
      console.error('Error fetching tenant info:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tenant information'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTenantInfo();
    } else {
      setCurrentTenant(null);
      setTenantDomain(null);
      setIsLoading(false);
    }
  }, [user?.id]);

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        tenantDomain,
        isLoading,
        error,
        refetchTenant: fetchTenantInfo
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
