'use strict';

const express = require('express');
//const mongoose = require('mongoose');

const passport = require('passport');
const { jwtStrategy } = require('../auth/strategies');

const User = require('../mongo_schema/user-schema.js');
const Question = require('../mongo_schema/question-data-schema.js');

const router = express.Router();
router.use(express.json());
router.use(passport.authenticate('jwt', {session: false, failWithError: true}));

router.get('/', (req, res, next) => {
  const username = req.user.username
  User.find({username})
    .then(questionUrl => res.json(questionUrl[0].filteredList[0].url))
    .catch(err => next(err));
});

module.exports = router;
