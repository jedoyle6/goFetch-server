# Go Fetch! - Server Side
This web server is intended for use with its client-side application, which allows a user to play a card game, Go Fish, against an AI opponent. This server supports player profile creation and login, as well as updating and fetching leaderboard scores. <br>
You can see the entire project live [here](https://go-fetch.jessicaedoyle.now.sh/). <br>

This is only the server-side code, written with Javascript, Express, Node, and Postgresql.<br>

The client-side code can be found [here](https://github.com/jedoyle6/goFetch-client), and was written using React, Javascript, HTML, and CSS. <br>

## Endpoints

### /signup

1. `POST /signup`

Verifies input and creates a new account if valid.

### /login

1. `POST /login`

Verifies credentials and returns a JSON Web Token if valid.

### /profile

1. `GET /profile`

Returns information related to the user's profile.

### /leaderboard

1. `GET /leaderboard/team`

Returns information about accumulated points, grouped by player teams.

1. `GET /leaderboard/player`

Returns information about accumulated points, grouped by individual player.

### /gamelog

1. `POST /gamelog`

Adds a record of a won game, logging the number of points earned by the player to the database.