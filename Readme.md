# Go Fetch! - Server Side
This web server is intended for use with its client-side application, which allows a user to play a card game, Go Fish, against an AI opponent. This server supports player profile creation and login, as well as updating and fetching leaderboard scores. <br>
You can see the entire project live [here](https://go-fetch.jessicaedoyle.now.sh/). <br>

This is only the server-side code, written with Javascript, Express, Node, and Postgresql.<br>

The client-side code can be found [here](https://github.com/jedoyle6/goFetch-client), and was written using React, Javascript, HTML, and CSS. <br>


Additional Information <br>

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.