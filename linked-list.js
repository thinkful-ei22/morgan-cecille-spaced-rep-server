'use strict';
//
// /* -------------------------------- LINKED LIST CLASS --------------------------- */
// class _Node {
//   constructor(value, next=null){
//     this.value = value;
//     this.next = null;
//   }
// }
//
// class LinkedList {
//   constructor(){
//     this.head = null;
//   }
//
//   insertFirst(value){
//     const newNode = new _Node(value);
//
//     if(!this.head){
//       this.head = newNode;
//     } else {
//       newNode.next = this.head;
//       this.head = newNode;
//     }
//   }
//
//   removeFirst(){
//     if(this.head){
//       this.head = this.head.next;
//     } else {
//       this.head.value = null;
//       this.head.next = null;
//     }
//   }
//
//   insertLast(value){
//     const newNode = new _Node(value);
//
//     if(!this.head){
//       this.head = newNode;
//     } else {
//       let currentNode = this.head;
//       let nextNode = this.head.next;
//       while(currentNode.next !== null){
//         currentNode = nextNode;
//         nextNode = currentNode.next;
//       }
//
//       currentNode.next = newNode;
//     }
//   }
// }


/* -------------------------------- FUNCTIONS FROM FRONT END --------------------------- */

//Output
// [{"id": 1111, "url": "http:foo.com", "country": "mexico"}, {...}, {...}]

//Output for question levels
// [1, 2, 4]

const questions = [
  {
    id: 1111,
    url: 'foo.com',
    country: 'mexico'
  },
  {
    id: 2222,
    url: 'baz.com',
    country: 'america'
  },
  {
    id: 3333,
    url: 'bar.com',
    country: 'finland'
  }
]

const questionLevels = [1, 1, 2];

const generateNewQuestions = function(startIndex = 0) {
  let newArray = [];
  //We're trying to find the lowest values in the question level array and push them to newArray
  let lowestLevel = 5;
  for(let i = 0; i < questionLevels.length; i++) {
    if(questionLevels[i] < lowestLevel) {
      lowestLevel = questionLevels[i]
    }
  }

  //Now that we've found the lowest level - which is 1 - we need to loop through the
  //questions array to find the question within that index.

  for(let i = startIndex; i < questionLevels.length + startIndex; i++) {
    const questionIndex = i % questions.length;
    if(questionLevels[questionIndex] === lowestLevel) {
      newArray.push(questions[questionIndex])
    }
  }
  return newArray;
}

// addQuestion(){
//   //add new question if all levels are above 1
//   const addNewQuestion = !this.props.questionLevels.find(val => typeof val === 'number' && val < 2); //Is there NOT a question level that is less than 2?
//   if(addNewQuestion){
//     for(let i = 0; i < this.props.questionLevels.length; i++){
//       if(this.props.questionLevels[i] === ''){
//         const newLevels = [...this.props.questionLevels];
//         newLevels[i] = 1;
//         //change this - no longer in front end
//         this.props.dispatch(changeQuestionLevels(newLevels));
//         break;
//       }
//     }
//   }
// }
//
//
// handleAnswer(questionId, isCorrect){
//   const questionIndex = this.props.questions.findIndex((value) => {
//     return value._id === questionId;
//   });
//
//   if(isCorrect === true){
//     const newLevels = [...this.props.questionLevels];
//     if(newLevels[questionIndex] < 5){
//       newLevels[questionIndex]++;
//     }
//     //change this - no longer in front end
//     this.props.dispatch(changeQuestionLevels(newLevels));
//     this.addQuestion();
//     let newList = new LinkedList();
//     newList = this.state.currentList;
//     //change this - no longer using ll class
//     newList.removeFirst();
//     //change this - no longer in front end
//     this.setState({currentList: newList});
//     if(this.state.currentList.head === null){
//       this.generateNewQuestions(questionIndex + 1);
//     }
//   } else if (isCorrect === false) {
//     //change this
//     const newLevels = [...this.props.questionLevels];
//     newLevels[questionIndex] = 1;
//     let secondLowestValue = 6;
//     let secondLowestIndex = 0;
//     for(let i = 0; i < newLevels.length; i++){
//       if(i !== questionIndex && newLevels[i] < secondLowestValue){
//         secondLowestIndex = i;
//         secondLowestValue = newLevels[i];
//       }
//     }
//     newLevels[secondLowestIndex] = 1;
//     //change this...
//     this.props.dispatch(changeQuestionLevels(newLevels));
//     this.generateNewQuestions(questionIndex + 1);
//   }
// }
//
// module.exports = LinkedList;
