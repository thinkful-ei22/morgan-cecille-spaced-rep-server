'use strict';

const express = require('express');
//const mongoose = require('mongoose');

const passport = require('passport');
const { jwtStrategy } = require('../auth/strategies');

const User = require('../mongo_schema/user-schema.js');
const Question = require('../mongo_schema/question-data-schema.js');

const { handleAnswer, generateNewQuestions } = require('../linked-list');

const router = express.Router();
router.use(express.json());
router.use(passport.authenticate('jwt', {session: false, failWithError: true}));



/* -------- Endpoint for returning one question to the front end --------- */
router.get('/', (req, res, next) => {
  const username = req.user.username;
  User.find({username})
    .then(userData => {
      let level;
      for(let i = 0; i < userData[0].questionLevels.length; i++) {
        if(userData[0].questionLevels[i].country === userData[0].filteredList[0].country) {
          level = userData[0].questionLevels[i].level;
        }
      }
      //If the user's question list is not empty, send back the first quesetion
      if(userData[0].filteredList.length > 0){
        res.json({
          url: userData[0].filteredList[0].url,
          level: level
        });
      }
      //If the user's question list IS empty, we need to regenerate questions before sending back the first question
      else {
        return Question.find().then(allQuestions => {
          const newQuestionList = generateNewQuestions(allQuestions, userData[0].questionLevels);
          return User.findOneAndUpdate(
            {username},
            {filteredList: newQuestionList},
            {new: true}
          ).then(newUserData => {
            res.json({
              url: newUserData.filteredList[0].url,
              level: level
            });
          });
        });
      }
    })
    .catch(err => next(err));
});



/* -------- Endpoint for checking the user's answer, and send back correct or Incorrect --------- */
router.post('/', (req, res, next) => {
  const username = req.user.username;
  const answer = req.body.answer;
  let isCorrect;
  let country;

  return Promise.all([
    User.findOne({username}),
    Question.find()
  ])
    .then( ([userData, allQuestions]) => {
      if(!userData.filteredList[0]){
        const err = new Error('Cannot check answer. No question exists.');
        err.status = 400;
        return Promise.reject(err);
      }
      country = userData.filteredList[0].country;


      if(country.toLowerCase().trim() === answer.toLowerCase().trim()) { //Answer is Correct
        isCorrect = true;
      } else { //Answer is Wrong
        isCorrect = false;
      }

      const modifiedUserData = handleAnswer(allQuestions, userData, isCorrect);
      return User.findOneAndUpdate({username}, modifiedUserData, {new: true});
    })
    .then( (newUser) => {
      res.json({isCorrect, country});
    })
    .catch(err => next(err));
});


module.exports = router;
