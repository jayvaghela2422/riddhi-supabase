# Go Shop Black – Supabase + Next.js Business Directory

A real-time business directory built with Supabase and Next.js, featuring user authentication, real-time updates, and secure data access controls.

## Features

- **User Authentication**: Email/password authentication with Supabase Auth
- **Business Directory**: View all businesses with name, category, city, and creation date
- **Add Business**: Authenticated users can add new businesses (ownership enforced)
- **Edit Business**: Business owners can edit their own businesses
- **Delete Business**: Business owners can delete their own businesses with confirmation
- **Real-time Updates**: All changes (add/edit/delete) appear instantly across all connected clients
- **Secure Access**: Row Level Security (RLS) policies enforce data ownership

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel
- **Styling**: Inline CSS with modern design patterns

## Security & RLS Policies

The application implements comprehensive Row Level Security (RLS) policies to ensure data security:

### Database Schema
```sql
-- Businesses table with RLS enabled
CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  city text,
  owner uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
```

### RLS Policies Applied

1. **Public Read Access** (`read_businesses`)
   - **Policy**: `USING (true)`
   - **Purpose**: Allows all users to view all businesses in the directory
   - **Rationale**: Business directory should be publicly accessible for discovery

2. **Ownership-based Insert** (`insert_own_business`)
   - **Policy**: `WITH CHECK (auth.uid() = owner)`
   - **Purpose**: Users can only create businesses with themselves as owner
   - **Enforcement**: Automatically sets `owner = auth.uid()` on insert

3. **Ownership-based Update** (`update_own_business`)
   - **Policy**: `USING (auth.uid() = owner) WITH CHECK (auth.uid() = owner)`
   - **Purpose**: Users can only modify their own businesses
   - **Security**: Prevents unauthorized business modifications

4. **Ownership-based Delete** (`delete_own_business`)
   - **Policy**: `USING (auth.uid() = owner)`
   - **Purpose**: Users can only delete their own businesses
   - **Protection**: Prevents accidental or malicious business deletion

## Real-time Updates

The application implements real-time synchronization using Supabase's realtime features:

### Implementation
```typescript
// Real-time subscription setup
const channel = supabase
  .channel('db')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'businesses' },
    (payload) => {
      console.log('New business added:', payload.new);
      setBiz(prev => [payload.new as Biz, ...prev]);
    }
  )
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'businesses' },
    (payload) => {
      console.log('Business updated:', payload.new);
      setBiz(prev => prev.map(b => b.id === payload.new.id ? payload.new as Biz : b));
    }
  )
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'businesses' },
    (payload) => {
      console.log('Business deleted:', payload.old);
      setBiz(prev => prev.filter(b => b.id !== payload.old.id));
    }
  )
  .subscribe();
```

### How It Works
1. **Database Replication**: Supabase automatically replicates the `businesses` table
2. **Event Listening**: Frontend subscribes to `INSERT`, `UPDATE`, and `DELETE` events on the `businesses` table
3. **Instant Updates**: All business changes (add/edit/delete) appear immediately across all connected clients
4. **No Refresh Required**: Users see updates in real-time without page reload

### Prerequisites
- **Supabase Configuration**: Realtime must be enabled for the `public.businesses` table
- **Database Setup**: Run `schema.sql` to set up the required policies and replication

## Authentication Flow

### Auth Configuration
- **Provider**: Supabase Auth with email/password
- **Session Management**: Persistent sessions with secure storage
- **Redirect Handling**: Automatic redirect to deployed app URL (not localhost)

### Auth Context
```typescript
// Global auth state management
const { user, loading, signOut } = useAuth();
```

## Environment Variables

Required environment variables for deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=your_vercel_preview_url
```

### Environment Variable Setup

1. **For Vercel Deployment**:
   - Set `NEXT_PUBLIC_SITE_URL` to your Vercel preview URL (e.g., `https://your-app-name.vercel.app`)
   - This ensures auth redirects go to your deployed app, not localhost

2. **For Local Development**:
   - Create `.env.local` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
   - This allows local development while maintaining proper redirect behavior

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Configuration
1. **Auth Settings**: Update redirect URLs to your Vercel domain
2. **Database**: Run `schema.sql` to set up tables and policies
3. **Realtime**: Enable replication for `public.businesses` table

## Limitations & Next Steps

### Current Limitations
1. **Basic Search**: No search or filtering capabilities
2. **No Categories Management**: Categories are free-text, not managed
3. **No Business Details**: No detailed business information or descriptions
4. **No Bulk Operations**: No ability to select and edit/delete multiple businesses
5. **No Business Images**: No support for business photos or logos

### Recommended Next Steps
1. **Search & Filter**: Implement search by name, category, or city
2. **Business Profiles**: Add detailed business information, images, contact details
3. **Category Management**: Implement predefined categories with admin controls
4. **User Profiles**: Add user profiles with business ownership history
5. **Admin Dashboard**: Add admin interface for managing all businesses
6. **Business Verification**: Add verification system for business authenticity
7. **Reviews & Ratings**: Implement business review and rating system
8. **Advanced Permissions**: Add role-based access control (admin, moderator, user)

## Development Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build
```

## Database Setup

1. Create a new Supabase project
2. Run the provided `schema.sql` to set up tables and policies
3. Enable realtime replication for the `businesses` table
4. Configure auth redirect URLs to your deployment domain

## Security Considerations

- **RLS Enforcement**: All database operations are protected by Row Level Security
- **Auth Validation**: User authentication is required for all write operations
- **Data Ownership**: Users can only modify their own business records
- **Public Read Access**: Business directory is publicly readable for discovery
- **Secure Sessions**: Authentication sessions are securely managed by Supabase

## Performance Optimizations

- **Client-side Caching**: Supabase client caches authentication state
- **Efficient Queries**: Optimized database queries with proper indexing
- **Real-time Efficiency**: Minimal real-time subscriptions for optimal performance
- **Type Safety**: Full TypeScript implementation for better development experience
