-- SQLBook: Code
-- Active: 1670925863467@@dpg-cec37b1gp3jg4te4872g-a.frankfurt-postgres.render.com@5432@crafting@public
INSERT INTO app_user (
  username,
  email,
  password,
  registration_date,
  last_connection,
  verified
)
VALUES(
  'nico',
  'nico@email.com',
  '12345',
  '12-13-2022',
  '12-13-2022',
  'true'
)