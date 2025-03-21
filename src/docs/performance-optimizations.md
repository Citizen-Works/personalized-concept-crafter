
# Performance Optimizations

The Content Engine includes several optimizations to ensure good performance even with multiple tenants.

## Database Optimizations

### Indexes

Key database indexes have been added to improve query performance:

- `idx_content_drafts_idea_id` - Speeds up queries filtering drafts by idea
- `idx_content_drafts_user_id` - Improves performance when filtering by user
- `idx_content_ideas_user_id` - Optimizes idea queries filtered by user
- `idx_content_ideas_status` - Improves performance of status-based queries
- `idx_content_ideas_user_status` - Compound index for user+status filtering
- `idx_documents_user_id` - Speeds up document queries by user
- `idx_documents_processing_status` - Optimizes document status filtering

### Query Optimization

- Using `SELECT` columns instead of `SELECT *` to reduce data transfer
- Pagination implemented for list queries
- Proper JOIN conditions to avoid cartesian products

## Caching Strategy

React Query is used for client-side caching with tenant-aware query keys:

```tsx
useQuery({
  queryKey: ['resource-type', tenantId, otherParams],
  queryFn: () => fetchData(tenantId, otherParams)
})
```

Benefits:
- Automatic cache invalidation
- Deduplication of requests
- Background refreshing
- Tenant isolation in cache

## API Optimizations

- Batch requests where appropriate
- Debounced search inputs
- Rate limiting per tenant
- Optimized Claude AI prompts to reduce token usage

## Future Enhancements

- Implement edge caching for static resources
- Add server-side caching for expensive operations
- Database connection pooling optimization
- GraphQL API for more efficient data fetching
