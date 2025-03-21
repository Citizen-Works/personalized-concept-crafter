
# Multi-tenant Architecture

The Content Engine uses a multi-tenant architecture to isolate data and provide customized experiences for different client organizations.

## Overview

Our multi-tenant system uses a domain-based approach where each tenant is identified by their email domain (e.g., example.com). This allows for automatic tenant assignment during user registration and login.

## Key Components

### TenantContext

The `TenantContext` provides tenant information throughout the application:

```tsx
import { useTenant } from '@/context/tenant/TenantContext';

const MyComponent = () => {
  const { currentTenant, tenantDomain, isLoading } = useTenant();
  
  // Use tenant information in component logic
}
```

### Tenant-Aware Queries

All data access is tenant-aware using React Query's query keys:

```tsx
const { data, isLoading } = useQuery({
  queryKey: ['ideas', tenantId],
  queryFn: () => fetchIdeasForTenant(tenantId)
});
```

### Tenant Provisioning

The system includes an admin interface for tenant management, allowing:

- Creating new tenants
- Viewing tenant usage statistics
- Managing tenant settings
- Provisioning users for a tenant

## Database Schema

Tenants are stored in the `tenants` table with RLS policies ensuring proper data isolation. Each data table includes a tenant_id foreign key reference.

## Future Enhancements

- Tenant-specific customization options
- Custom domains for tenants
- Tenant billing integration
