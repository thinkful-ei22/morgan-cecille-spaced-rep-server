'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./mongo_schema/user-schema.js');
const userRouter = require('./routes/user.js');
const questionsRouter = require('./routes/questions.js');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
mongoose.Promise = global.Promise;

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const app = express();
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api/questions', questionsRouter);

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);



function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
