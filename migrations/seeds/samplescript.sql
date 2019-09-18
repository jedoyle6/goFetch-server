SELECT user_name
FROM gofetch_users
JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
join gofetch_teams on gofetch_users.team_id = gofetch_teams.id
where user_name ilike '%mary%'
group by user_name