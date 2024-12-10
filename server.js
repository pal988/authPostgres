const express = require('express');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { generateToken } = require('./auth');

dotenv.config();

const app = express();
const port = 1000;


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));


app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
}), (req, res) => {
  const token = jwt.sign({ userId: req.user.id, provider: req.user.provider }, process.env.JWT_SECRET);
  res.json({ message: 'Google authentication successful', token });
});



app.get('/admin', (req, res) => {
  if (req.user && req.user.role === 'admin') {
    res.status(200).json({ message: 'Welcome Admin' });
  } else {
    res.status(403).json({ message: 'Permission denied' });
  }
});


app.get('/profile', (req, res) => {
  if (req.user) {
    res.status(200).json({ message: 'Welcome User', user: req.user });
  } else {
    res.status(401).json({ message: 'Please log in' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
