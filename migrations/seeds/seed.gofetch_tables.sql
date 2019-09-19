BEGIN;

TRUNCATE
  gofetch_gamelog,
  gofetch_users,
  gofetch_teams  
  RESTART IDENTITY CASCADE;

INSERT INTO gofetch_teams (team_name)
VALUES
  ('Terrific Terriers'),
  ('Bestest Bulldogs'),
  ('Precious Poodles');

INSERT INTO gofetch_users (team_id, user_name, password)
VALUES
  (1, 'Terry', '$2a$12$WoUMtmpFZoslfBNfF4o9EuaB5P11vkwigCH7CiWGWKltPvm2xQL9G'),
  (2, 'Billy', '$2a$12$WoUMtmpFZoslfBNfF4o9EuaB5P11vkwigCH7CiWGWKltPvm2xQL9G'),
  (3, 'Penelope', '$2a$12$WoUMtmpFZoslfBNfF4o9EuaB5P11vkwigCH7CiWGWKltPvm2xQL9G');

INSERT INTO gofetch_gamelog (player_id, points)
VALUES
  (1, 10),
  (2, 13),
  (3, 17),
  (1, 10),
  (3, 19),
  (2, 11);

COMMIT;
