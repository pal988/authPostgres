const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const dotenv = require('dotenv');

dotenv.config();


passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((user, done) => {
  done(null, user);
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:1000/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  const { id, displayName, emails } = profile;


  const userDB = await db.query('SELECT * FROM users WHERE provider = $1 AND provider_id = $2', ['google', id]);
  
  if (userDB.rows.length > 0) {
    return done(null, userRes.rows[0]);
  }

  
  const newUser = await db.query(
    'INSERT INTO users (username, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [displayName, emails[0].value, 'google', id]
  );

  done(null, newUser.rows[0]);
}));

;

 
  


