const bcrypt = require('bcryptjs');
const AuthService = require('../src/auth/auth-service');

function makeTeamsArray() {
  return [
    {
      id: 1,
      team_name: 'team 1',
    },
    {
      id: 2,
      team_name: 'team 2',
    },
    {
      id: 3,
      team_name: 'team 3',
    },
  ]
}

function makeUsersArray(teams) {
  return [
    {
      id: 1,
      team_id: teams[0].id,
      user_name: 'test-user-1',
      password: 'password',
    },
    {
      id: 2,
      team_id: teams[1].id,
      user_name: 'test-user-2',
      password: 'password',
    },
    {
      id: 3,
      team_id: teams[2].id,
      user_name: 'test-user-3',
      password: 'password',
    },
  ]
}

function makeGamesArray(users) {
  return [
    {
      game_id: 1,
      player_id: users[0].id,
      points: 5,
    },
    {
      game_id: 2,
      player_id: users[1].id,
      points: 10,
    },
    {
      game_id: 3,
      player_id: users[2].id,
      points: 15,
    },
  ]
}

function makeMaliciousUserEntry(user) {
  const maliciousUser = {
    id: 1,
    team_id: teams[0].id,
    user_name: 'test-user-<script>alert("xss");</script>-1',
    password: 'password <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
  }
  const expectedUser = {
    id: 1,
    team_id: teams[0].id,
    user_name: 'test-user-&lt;script&gt;alert(\"xss\");&lt;/script&gt-1',
    password: 'password <img src="https://url.to.file.which/does-not.exist">',
  }
  
  return {
    maliciousUser,
    expectedUser,
  }
}

function makeTestEntries() {
  const testTeams = makeTeamsArray()
  const testUsers = makeUsersArray(testTeams)
  const testGames = makeGamesArray(testTeams)
  return { testTeams, testUsers, testGames }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      gofetch_gamelog,
      gofetch_users,
      gofetch_teams
      RESTART IDENTITY CASCADE`
  )
}

function seedAllTables(db, teams, users, games=[]) {
  return seedTeams(db, teams)
    .then(() => seedUsers(db, users))
    .then(() => seedGames(db, games))
}

function seedTeams(db, teams) {
  return db.into('gofetch_teams').insert(teams)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('gofetch_teams_id_seq', ?)`,
        [teams[teams.length - 1].id]
      )
    )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('gofetch_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('gofetch_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedGames(db, games) {
  return db.into('gofetch_games').insert(games)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('gofetch_games_id_seq', ?)`,
        [games[games.length - 1].game_id],
      )
    )
}

 function makeAuthHeader(user) {
   const sub = user.user_name;
   const payload = { user_id: user.user_name};
   return  `Bearer ${AuthService.createJWT(sub, payload)}`;
  //const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
  //return `Basic ${token}`
}

module.exports = {
  makeTeamsArray,
  makeUsersArray,
  makeGamesArray,
  makeMaliciousUserEntry,
  makeTestEntries,

  cleanTables,
  seedAllTables,
  seedTeams,
  seedUsers,
  seedGames,
  makeAuthHeader,
}
