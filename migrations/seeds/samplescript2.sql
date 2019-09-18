SELECT user_name, SUM(points) as total_points, team_id
FROM gofetch_users
JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
group by user_name, team_id
order by SUM(points) desc
