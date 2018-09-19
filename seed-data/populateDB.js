'use strict';

const mongoose = require('mongoose');
const {TEST_DATABASE_URL} = require('../config');

const Question = require('../mongo_schema/question-data-schema');

const seedQuestions = require('./questions-data.json');

console.log('Connecting to MongoDB');
return mongoose.connect(TEST_DATABASE_URL)
  .then( function(){
    console.info('DROPPING DATABASE');
    return mongoose.connection.db.dropDatabase();
  })
  .then( () => {
    return Question.insertMany(seedQuestions);
  })
  .then( res => {
    console.info(res);
    console.info('DISCONNECTING');
    mongoose.disconnect();
  });