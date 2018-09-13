'use strict';

// const questions = [
//   {
//     id: 1111,
//     url: 'foo.com',
//     country: 'mexico'
//   },
//   {
//     id: 2222,
//     url: 'baz.com',
//     country: 'america'
//   },
//   {
//     id: 3333,
//     url: 'bar.com',
//     country: 'finland'
//   }
// ]
//
// const filteredQuestions = [
//   {
//     id: 1111,
//     url: 'foo.com',
//     country: 'mexico'
//   },
//   {
//     id: 2222,
//     url: 'baz.com',
//     country: 'america'
//   },
// ]
//
// const questionLevels = [1, 1, 2];

const generateNewQuestions = function(questions, questionLevels, startIndex = 0) {
  let newArray = [];
  //We're trying to find the lowest values in the question level array and push them to newArray
  let lowestLevel = 5;
  for(let i = 0; i < questionLevels.length; i++) {
    if(questionLevels[i] < lowestLevel) {
      lowestLevel = questionLevels[i];
    }
  }

  //Now that we've found the lowest level - which is 1 - we need to loop through the
  //questions array to find the question within that index.

  for(let i = startIndex; i < questionLevels.length + startIndex; i++) {
    const questionIndex = i % questionLevels.length;
    if(questionLevels[questionIndex] === lowestLevel) {
      newArray.push(questions[questionIndex]);
    }
  }
  return newArray;
};

//User POST request - looks at database - look at QuestionId -
const handleAnswer = function(questions, userData, questionId, isCorrect) {
  const questionIndex = questions.findIndex((value) => {
    return value.id === questionId;
  });

  if(isCorrect) {
    //if correct - go to question levels and increment by 1
    userData.questionLevels[questionIndex]++;
    //if correct - remove from list
  } else {
    if(userData.questionLevels[questionIndex] > 0) {
      userData.questionLevels[questionIndex]--;
    }
  }

  userData.filteredQuestions.shift();
  return userData.filteredQuestions;
};

// handleAnswer();

module.exports = {handleAnswer, generateNewQuestions};