-- Profil de chaque joueur : son pseudo
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null
    check (username = btrim(username))
    check (username ~ '^[A-Za-zÀ-ÖØ-öø-ÿ0-9 _-]{2,16}$'),
  created_at timestamptz not null default now()
);

-- Pseudo unique, sans tenir compte des majuscules (Kael = kael)
create unique index profiles_username_unique on public.profiles (lower(username));

alter table public.profiles enable row level security;

-- Les joueurs connectés voient tous les pseudos
create policy "Profiles visibles par les joueurs connectés"
  on public.profiles for select
  to authenticated
  using (true);

-- Chaque joueur ne modifie que son propre profil
create policy "Chaque joueur modifie son profil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Seul le pseudo est modifiable par le joueur
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (username) on public.profiles to authenticated;

-- Création automatique du profil à l'inscription, avec le pseudo choisi
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, btrim(new.raw_user_meta_data ->> 'username'));
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Vérifie si un pseudo est libre, avant l'inscription
create function public.username_available(name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.profiles where lower(username) = lower(btrim(name))
  );
$$;

revoke execute on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;
