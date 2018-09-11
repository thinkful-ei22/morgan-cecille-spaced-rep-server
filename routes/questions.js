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
  
  Question.findOne()
    .then(question => res.json(question));
  //const user = req.username;
});

module.exports = router;