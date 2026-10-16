-- Echo, Lasso and Fuse (repo nguyenware/prototypes): three casual prototypes, each a static Worker of
-- the same name on this account, proxied through its GAME_<ID> service binding. Invite-only while
-- the first round runs with the Friends and Family cohorts (access given on /admin/games).
INSERT INTO games (id, name, description, app_origin, visibility) VALUES
  ('echo',  'Echo',  'Haunt the whole house in one night, with help from your past selves.', 'https://echo.summer-sky-afc1.workers.dev', 'private'),
  ('lasso', 'Lasso', 'Herd black and white sheep with your dog, then rope one color at a time.', 'https://lasso.summer-sky-afc1.workers.dev', 'private'),
  ('fuse',  'Fuse',  'Turn the tiles ahead of the flame and keep the fuse burning.', 'https://fuse.summer-sky-afc1.workers.dev', 'private');
