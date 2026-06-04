# Tokyo Hibachi

Vercel-ready Next.js restaurant website with a server-side admin dashboard.

## Admin

- `/admin` redirects to `/admin/login` when signed out.
- Username: `admin`
- Password: `anaPZyJN135vll`

## Required Vercel Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=anaPZyJN135vll
SESSION_SECRET=change-this-long-random-secret
```

## Database

Run `supabase-schema.sql` in Supabase SQL editor.
