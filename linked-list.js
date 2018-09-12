'use strict';

/* -------------------------------- LINKED LIST CLASS --------------------------- */
class _Node {
  constructor(value, next=null){
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor(){
    this.head = null;
  }

  insertFirst(value){
    const newNode = new _Node(value);

    if(!this.head){
      this.head = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
  }

  removeFirst(){
    if(this.head){
      this.head = this.head.next;
    } else {
      this.head.value = null;
      this.head.next = null;
    }
  }

  insertLast(value){
    const newNode = new _Node(value);

    if(!this.head){
      this.head = newNode;
    } else {
      let currentNode = this.head;
      let nextNode = this.head.next;
      while(currentNode.next !== null){
        currentNode = nextNode;
        nextNode = currentNode.next;
      }

      currentNode.next = newNode;
    }
  }
}


/* -------------------------------- FUNCTIONS FROM FRONT END --------------------------- */

generateNewQuestions(startIndex = 0){
  let questionList = new LinkedList();

  //check for lowest level
  let lowestLevel = 5;
  for(let i = 0; i < this.props.questionLevels.length; i++){
    if(this.props.questionLevels[i] !== '' && this.props.questionLevels[i] < lowestLevel){
      lowestLevel = this.props.questionLevels[i];
    }
  }

  //for all questions at the lowest level, insert them into question list
  for(let i = startIndex; i < this.props.questionLevels.length + startIndex; i++){
    const questionIndex = i % this.props.questions.length;
    if(this.props.questionLevels[questionIndex] === lowestLevel){
      questionList.insertLast(this.props.questions[questionIndex]);
    }
  }

  //update the state with the question list
  this.setState({currentList: questionList});
}

addQuestion(){
  //add new question if all levels are above 1
  const addNewQuestion = !this.props.questionLevels.find(val => typeof val === 'number' && val < 2); //Is there NOT a question level that is less than 2?
  if(addNewQuestion){
    for(let i = 0; i < this.props.questionLevels.length; i++){
      if(this.props.questionLevels[i] === ''){
        const newLevels = [...this.props.questionLevels];
        newLevels[i] = 1;
        this.props.dispatch(changeQuestionLevels(newLevels));
        break;
      }
    }
  }
}


handleAnswer(questionId, isCorrect){
  const questionIndex = this.props.questions.findIndex((value) => {
    return value._id === questionId;
  });

  if(isCorrect === true){
    const newLevels = [...this.props.questionLevels];
    if(newLevels[questionIndex] < 5){
      newLevels[questionIndex]++;
    }
    this.props.dispatch(changeQuestionLevels(newLevels));
    this.addQuestion();
    let newList = new LinkedList();
    newList = this.state.currentList;
    newList.removeFirst();
    this.setState({currentList: newList});
    if(this.state.currentList.head === null){
      this.generateNewQuestions(questionIndex + 1);
    }
  } else if (isCorrect === false) {
    const newLevels = [...this.props.questionLevels];
    newLevels[questionIndex] = 1;
    let secondLowestValue = 6;
    let secondLowestIndex = 0;
    for(let i = 0; i < newLevels.length; i++){
      if(i !== questionIndex && newLevels[i] < secondLowestValue){
        secondLowestIndex = i;
        secondLowestValue = newLevels[i];
      }
    }
    newLevels[secondLowestIndex] = 1;
    this.props.dispatch(changeQuestionLevels(newLevels));
    this.generateNewQuestions(questionIndex + 1);
  }
}

module.exports = LinkedList;


