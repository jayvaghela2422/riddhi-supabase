# Setup Instructions

## Environment Variables

Create a `.env.local` file in the `starter` directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run the SQL from `../schema.sql` in your Supabase SQL editor
3. Get your project URL and anon key from Project Settings > API
4. Add them to your `.env.local` file

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Features Implemented

- ✅ Email/password authentication (Supabase Auth)
- ✅ List all businesses (name, category, city, created_at)
- ✅ Add Business form (logged-in only) with RLS enforcement
- ✅ Realtime updates - new businesses appear for all users without refresh
- ✅ Modern UI with responsive design
- ✅ Proper error handling and loading states
- ✅ Row Level Security (RLS) policies enforced

## Security Features

- Row Level Security (RLS) enabled on businesses table
- Users can only insert/update/delete their own businesses
- All users can read all businesses
- Authentication required for adding businesses
- Proper error handling for unauthorized access

