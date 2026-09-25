-- ========== Catalogue du jeu : saisons, raretés, Bannis, armes, cartes ==========

-- Raretés : simple liste modifiable (rank = ordre, 1 = la plus commune)
create table public.rarities (
  id smallint generated always as identity primary key,
  name text not null unique,
  rank smallint not null unique,
  color text not null default '#9ca3af'
);

-- Saisons : les cartes sortent par vagues
create table public.seasons (
  id smallint generated always as identity primary key,
  number smallint not null unique,
  name text not null,
  released_at date
);

-- Les Bannis
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  bio text,                -- texte de présentation
  power text,              -- son pouvoir
  season_id smallint references public.seasons (id),
  background_path text,    -- illustration de fond (fiche + effet 3D)
  cutout_path text,        -- personnage détouré, fond transparent (effet 3D)
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Les armes, liées en général à un Banni (facultatif)
create table public.weapons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  bio text,
  power text,
  owner_id uuid references public.characters (id) on delete set null,
  season_id smallint references public.seasons (id),
  background_path text,
  cutout_path text,        -- arme détourée (effet 3D)
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Les cartes à collectionner : chaque variante d'un Banni ou d'une arme
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  character_id uuid references public.characters (id) on delete cascade,
  weapon_id uuid references public.weapons (id) on delete cascade,
  rarity_id smallint not null references public.rarities (id),
  variant_name text,       -- « Holographique », « Dorée »… (vide = version de base)
  image_path text,         -- illustration : cachée tant que la carte n'est pas obtenue
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  -- une carte représente soit un Banni, soit une arme
  check ((character_id is null) <> (weapon_id is null))
);

-- Collection de chaque joueur
create table public.collection (
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id uuid not null references public.cards (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  first_obtained_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

create index on public.characters (season_id);
create index on public.weapons (owner_id);
create index on public.weapons (season_id);
create index on public.cards (character_id);
create index on public.cards (weapon_id);
create index on public.cards (rarity_id);
create index on public.collection (card_id);

-- ========== Droits ==========

alter table public.rarities enable row level security;
alter table public.seasons enable row level security;
alter table public.characters enable row level security;
alter table public.weapons enable row level security;
alter table public.cards enable row level security;
alter table public.collection enable row level security;

-- Rien pour les visiteurs non connectés ; lecture seule pour les joueurs.
-- Le contenu s'ajoute depuis Supabase, jamais depuis l'appli.
revoke all on public.rarities, public.seasons, public.characters, public.weapons,
  public.cards, public.collection from anon, authenticated;

grant select on public.rarities, public.seasons, public.characters, public.weapons
  to authenticated;

-- Cartes : tout sauf l'illustration
grant select (id, character_id, weapon_id, rarity_id, variant_name, sort_order, created_at)
  on public.cards to authenticated;

grant select on public.collection to authenticated;

create policy "Lecture par les joueurs" on public.rarities for select to authenticated using (true);
create policy "Lecture par les joueurs" on public.seasons for select to authenticated using (true);
create policy "Lecture par les joueurs" on public.characters for select to authenticated using (true);
create policy "Lecture par les joueurs" on public.weapons for select to authenticated using (true);
create policy "Lecture par les joueurs" on public.cards for select to authenticated using (true);

-- Chaque joueur ne voit que sa propre collection
create policy "Chaque joueur voit sa collection" on public.collection for select
  to authenticated using ((select auth.uid()) = user_id);

-- Illustrations des cartes que le joueur possède, et seulement celles-là
create function public.my_card_images()
returns table (card_id uuid, image_path text)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.image_path
  from public.cards c
  join public.collection col on col.card_id = c.id
  where col.user_id = (select auth.uid());
$$;

revoke execute on function public.my_card_images() from public, anon;
grant execute on function public.my_card_images() to authenticated;

-- ========== Valeurs de départ (provisoires, modifiables) ==========

insert into public.rarities (name, rank, color) values
  ('Commune', 1, '#9ca3af'),
  ('Rare', 2, '#3b82f6'),
  ('Épique', 3, '#a855f7'),
  ('Légendaire', 4, '#f59e0b');

insert into public.seasons (number, name) values (1, 'Saison 1');
