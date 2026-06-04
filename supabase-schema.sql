create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  full_name text not null,
  phone text not null,
  email text not null,
  booking_date date not null,
  booking_time time not null,
  guests integer not null check (guests > 0),
  request text default '',
  status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'SCHEDULED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED')),
  priority text not null default 'STANDARD' check (priority in ('STANDARD', 'EXPRESS', 'EMERGENCY')),
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  interest text,
  message text,
  status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'CONVERTED', 'CLOSED')),
  created_at timestamptz not null default now()
);
