CREATE TABLE gofetch_users (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES goFetch_teams(id) NOT NULL,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);