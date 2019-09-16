'use strict';
const AuthService = require('./auth-service');

function authenticateTokenJwt(req, res, next) {

  const authToken = req.get('Authorization') || '';
  let bearerToken;

  if (!authToken.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ error: 'Missing Bearer token'});
  } else {
    bearerToken = authToken.slice('bearer '.length, authToken.length);
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken);
    AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub
    )
      .then(user => {
        if (!user)
          return res.status(401).json({error: 'Unauthorized request'});
        req.user = user;
        
        next();
      })
      .catch(err => {
        next(err);
      });
  }catch (error){
    res.status(401).json({error: 'Unauthorized request'});
  }

}

module.exports = authenticateTokenJwt;
