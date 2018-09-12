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

module.exports = LinkedList;


