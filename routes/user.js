'use strict';

const express = require('express');

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../mongo_schema/user-schema.js');
const Question = require('../mongo_schema/question-data-schema');
const router = express.Router();
router.use(express.json());

// router.get('/:id', (req, res, next) => {
//   const { id } = req.params;

//   User
//     .findById(id)
//     .then(result => {
//       res.json(result);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

router.get('/users', passport.authenticate('jwt', {session: false, failWithError: true}), (req, res) => {
  const username = req.user.username;

  User.find({username})
  .then(userData => {
    return res.json(userData[0].questionLevels)
  })
})

router.put('/users', passport.authenticate('jwt', {session: false, failWithError: true}), (req, res, next) => {
  const username = req.user.username;

  User.findOne({username})
    .then(userData => {
      for(let i = 0; i < userData.questionLevels.length; i++) {
        if(userData.questionLevels[i].level !== 1) {
          userData.questionLevels[i].level = 1;
        }
      }
      const modifiedLevels = userData.questionLevels;
      console.log(modifiedLevels);
      return User.findOneAndUpdate({username}, { questionLevels: modifiedLevels }, { new: true });
    })
    .then((updatedUser) => {
      res.json(updatedUser.questionLevels)
    })
    .catch(err => next(err))
})

router.post('/users', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }
  return User
    .find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return Promise.all([
        User.hashPassword(password),
        Question.find()
      ]);
    })
    .then( ([digest, allQuestions]) => {
      const countries = allQuestions.map(question => {
        return {country: question.country};
      });

      return User.create({
        username,
        password: digest,
        questionLevels: countries
      });
    })
    .then(user => {
      return res.status(201).location(`${req.originalUrl}`).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

module.exports = router;
