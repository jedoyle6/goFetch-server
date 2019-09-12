CREATE TABLE gofetch_gamelog (
    game_id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES goFetch_users(id) ON DELETE CASCADE NOT NULL,
    points INTEGER NOT NULL
);