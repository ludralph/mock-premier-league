const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const authRoutes = require('./routes/auth.routes');
const teamRoutes = require('./routes/team.routes');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/api/v1', authRoutes);
app.use('/api/v1', teamRoutes)
app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Mock Premier League API',
  });
});

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: `${err.name}: ${err.message}`,
    });
  } else if (err) {
    res.status(400).json({
      error: `${err.name}: ${err.message}`,
    });
  }
});

module.exports = app;
