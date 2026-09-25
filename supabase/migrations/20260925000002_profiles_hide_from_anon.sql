-- Les visiteurs non connectés n'ont aucun accès direct à la table des profils
revoke select on public.profiles from anon;
