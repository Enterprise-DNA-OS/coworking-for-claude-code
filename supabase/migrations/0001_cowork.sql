create schema if not exists cowork;
create function cowork.touch() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create table cowork.locations(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, currency text not null check(currency in ('NZD','AUD','USD','EUR','GBP')), jurisdiction text not null check(jurisdiction in ('NZ','AU','OTHER')), emergency_plan_ref text, emergency_test_due date, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.locations for each row execute function cowork.touch();
alter table cowork.locations enable row level security;
create table cowork.plans(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, location_id uuid not null references cowork.locations, monthly_cents bigint not null check(monthly_cents>=0), room_minutes integer not null default 0 check(room_minutes>=0), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.plans for each row execute function cowork.touch();
alter table cowork.plans enable row level security;
create table cowork.members(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, location_id uuid not null references cowork.locations, email text not null check(position('@' in email)>1), company text, status text not null default 'contact' check(status in ('contact','active','ended')), last_contact_on date, privacy_review_on date, induction_on date, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.members for each row execute function cowork.touch();
alter table cowork.members enable row level security;
create table cowork.spaces(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, location_id uuid not null references cowork.locations, kind text not null check(kind in ('desk','office','room')), capacity integer not null default 1 check(capacity>0), active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.spaces for each row execute function cowork.touch();
alter table cowork.spaces enable row level security;
create table cowork.memberships(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, member_id uuid not null references cowork.members, plan_id uuid not null references cowork.plans, space_id uuid references cowork.spaces, start_on date not null, end_on date not null, renew_on date not null, status text not null default 'proposed' check(status in ('proposed','active','ended')), agreement_ref text, check(end_on>=start_on), check(renew_on>=start_on and renew_on<=end_on), check(status<>'active' or nullif(trim(agreement_ref),'') is not null), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.memberships for each row execute function cowork.touch();
alter table cowork.memberships enable row level security;
create table cowork.bookings(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, member_id uuid not null references cowork.members, space_id uuid not null references cowork.spaces, starts_at timestamptz not null, ends_at timestamptz not null, status text not null default 'confirmed' check(status in ('confirmed','cancelled','completed')), charge_cents bigint not null default 0 check(charge_cents>=0), invoiced boolean not null default false, check(ends_at>starts_at), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.bookings for each row execute function cowork.touch();
alter table cowork.bookings enable row level security;
create table cowork.invoices(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, member_id uuid not null references cowork.members, due_on date not null, amount_cents bigint not null check(amount_cents>=0), paid_cents bigint not null default 0 check(paid_cents>=0 and paid_cents<=amount_cents), reconciliation_ref text, check(paid_cents=0 or nullif(trim(reconciliation_ref),'') is not null), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.invoices for each row execute function cowork.touch();
alter table cowork.invoices enable row level security;
create table cowork.visits(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, member_id uuid not null references cowork.members, arrived_at timestamptz not null, departed_at timestamptz, check(departed_at is null or departed_at>=arrived_at), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.visits for each row execute function cowork.touch();
alter table cowork.visits enable row level security;
create table cowork.actions(id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, location_id uuid not null references cowork.locations, owner text not null, due_on date not null, status text not null default 'open' check(status in ('open','done')), completion_ref text, check(status<>'done' or nullif(trim(completion_ref),'') is not null), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.actions for each row execute function cowork.touch();
alter table cowork.actions enable row level security;
create table cowork.notes(id uuid primary key default gen_random_uuid(), member_id uuid not null references cowork.members, author text not null, body text not null, contact_on date not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.notes for each row execute function cowork.touch();
alter table cowork.notes enable row level security;
create table cowork.imports(id uuid primary key default gen_random_uuid(), source_id text not null unique, fingerprint text not null, member_id uuid not null references cowork.members, source_file text not null, mapped_fields jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create trigger touch before update on cowork.imports for each row execute function cowork.touch();
alter table cowork.imports enable row level security;

create function cowork.immutable() returns trigger language plpgsql as $$ begin raise exception 'append-only record'; end $$;
create trigger immutable before update or delete on cowork.notes for each row execute function cowork.immutable();
create trigger immutable before update or delete on cowork.imports for each row execute function cowork.immutable();
create function cowork.check_membership() returns trigger language plpgsql as $$
declare ml uuid; pl uuid; sl uuid; sk text;
begin
 select location_id into ml from cowork.members where id=new.member_id;
 select location_id into pl from cowork.plans where id=new.plan_id;
 if ml<>pl then raise exception 'Member and plan location mismatch'; end if;
 if new.space_id is not null then
  select location_id,kind into sl,sk from cowork.spaces where id=new.space_id for update;
  if sl<>ml or sk='room' then raise exception 'Invalid allocated space'; end if;
  if new.status='active' and exists(select 1 from cowork.memberships where space_id=new.space_id and id<>new.id and status='active' and start_on<=new.end_on and end_on>=new.start_on) then raise exception 'Space allocation overlaps'; end if;
 end if;
 return new;
end $$;
create trigger membership_check before insert or update on cowork.memberships for each row execute function cowork.check_membership();
create function cowork.check_booking() returns trigger language plpgsql as $$
declare ml uuid; sl uuid; sk text; enabled boolean;
begin
 select location_id into ml from cowork.members where id=new.member_id;
 select location_id,kind,active into sl,sk,enabled from cowork.spaces where id=new.space_id for update;
 if sl<>ml or sk<>'room' or not enabled then raise exception 'Invalid booking room or location'; end if;
 if new.status<>'cancelled' and exists(select 1 from cowork.bookings where space_id=new.space_id and id<>new.id and status<>'cancelled' and starts_at<new.ends_at and ends_at>new.starts_at) then raise exception 'Room booking overlaps'; end if;
 return new;
end $$;
create trigger booking_check before insert or update on cowork.bookings for each row execute function cowork.check_booking();
create view cowork.membership_register with(security_invoker=true) as
select x.*,m.name member,m.code member_code,m.last_contact_on,m.induction_on,p.name plan,p.monthly_cents,p.room_minutes,l.code location,l.currency,s.name space
from cowork.memberships x join cowork.members m on m.id=x.member_id join cowork.plans p on p.id=x.plan_id join cowork.locations l on l.id=p.location_id left join cowork.spaces s on s.id=x.space_id;
create view cowork.arrears with(security_invoker=true) as
select i.id,i.code,m.id member_id,m.name member,l.code location,l.currency,i.due_on,current_date-i.due_on days_overdue,i.amount_cents-i.paid_cents balance_cents
from cowork.invoices i join cowork.members m on m.id=i.member_id join cowork.locations l on l.id=m.location_id where i.due_on<current_date and i.amount_cents>i.paid_cents;
create view cowork.room_diary with(security_invoker=true) as
select b.*,m.name member,s.name room,l.code location,l.currency,round(extract(epoch from(b.ends_at-b.starts_at))/60)::integer minutes
from cowork.bookings b join cowork.members m on m.id=b.member_id join cowork.spaces s on s.id=b.space_id join cowork.locations l on l.id=s.location_id;
create view cowork.occupancy with(security_invoker=true) as
select s.id,s.code,s.name,s.kind,s.capacity,l.code location,l.currency,x.member,x.end_on
from cowork.spaces s join cowork.locations l on l.id=s.location_id left join cowork.membership_register x on x.space_id=s.id and x.status='active' and current_date between x.start_on and x.end_on where s.active and s.kind<>'room';
create view cowork.compliance with(security_invoker=true) as
select 'NZ-EMERGENCY' rule,l.code record,'Record emergency plan and operator-set testing date' action from cowork.locations l where jurisdiction='NZ' and (nullif(trim(emergency_plan_ref),'') is null or emergency_test_due is null or emergency_test_due<current_date)
union all select 'NZ-PRIVACY-REVIEW',m.code,'Review retention purpose; do not auto-delete' from cowork.members m join cowork.locations l on l.id=m.location_id where l.jurisdiction='NZ' and m.status='ended' and (m.privacy_review_on is null or m.privacy_review_on<current_date)
union all select 'OP-INDUCTION',code,'Record site induction evidence' from cowork.members where status='active' and induction_on is null;
