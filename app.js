const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const authRoutes = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');
const fixtureRoutes = require('./routes/fixtures.routes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/api/v1', authRoutes);
app.use('/api/v1', teamRoutes);
app.use('/api/v1', fixtureRoutes);

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Mock Premier League API',
  });
});

app.use((error, req, res, next) => {
  if (error.name === 'UnauthorizedError') {
    res.status(401).json({
      error: `${error.name}: ${error.message}`,
    });
  }
  // by default get the error message
  let err = error[0];
  let key = 'error';
  // for display purposes, if it's an array call it "errors"
  if (Array.isArray(error)) {
    key = 'errors';
  }

  return res.status(400).json({ [key]: err });
});

module.exports = app;
