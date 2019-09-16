SELECT user_name, SUM(points) as points, count(*)
FROM gofetch_users
JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
group by user_name
order by SUM(points) desc
where points > 40;