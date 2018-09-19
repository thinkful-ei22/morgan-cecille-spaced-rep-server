'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const { app } = require('../index');
const { TEST_DATABASE_URL, JWT_EXPIRY, JWT_SECRET } = require('../config');
const User = require('../mongo_schema/user-schema');
const Question = require('../mongo_schema/question-data-schema');

const seedQuestions = require('../seed-data/questions-data.json');

const expect = chai.expect;
chai.use(chaiHttp);

describe('/LOGIN ENDPOINT', function(){
  let user;
  let webToken;

  before(function(){
    // this.timeout(30000);
    return mongoose.connect(TEST_DATABASE_URL)
      .then( () => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function(){
    // this.timeout(30000);
    return Promise.all([
      Question.insertMany(seedQuestions),
      User.create({username: 'nOtAreALUseR', password: 'password'})
    ])
      .then( function([questionRes, userRes]){
        webToken = jwt.sign(
          {username: userRes.username}, 
          JWT_SECRET,
          {expiresIn: JWT_EXPIRY, subject:userRes.username});
      })
      .catch(e => console.error(e));
  });

  afterEach(function(){
    // this.timeout(30000);
    return mongoose.connection.db.dropDatabase();
  });

  after(function(){
    // this.timeout(30000);
    return mongoose.disconnect();
  });


  describe('POST to /api/login', function(){
    const newUser = {username: 'newUser', password: 'baseball'};

    it('should respond with a jwt token when user provides valid login credentials', function(){
      return chai.request(app).post('/api/users').send(newUser)
        .then(function(){
          return chai.request(app).post('/api/login').send(newUser);
        })
        .then(function(loginRes){
          expect(loginRes).to.be.json;
          expect(loginRes).to.be.an('object');
          expect(loginRes.ok).to.equal(true);
          expect(loginRes.body.authToken).to.be.a('string');

          //makes sure the token is valid
          const decodedToken = jwt.verify(loginRes.body.authToken, JWT_SECRET);
          expect(decodedToken.user.username).to.equal(newUser.username);
        });
    });

  });


  describe('POST to /api/users', function(){
    const newUser = {username: 'newUser', password: 'baseball'};

    it('should register a user when valid username and password are provided', function(){
      return chai.request(app).post('/api/users').send(newUser)
        .then(function(apiRes){
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.body).to.have.keys('id', 'username');
          expect(apiRes).to.be.json;
          return User.findOne({username: newUser.username});
        })
        .then(function(databaseRes){
          expect(databaseRes).to.not.be.null;
          expect(databaseRes.username).to.equal(newUser.username);
          expect(databaseRes.password).to.not.equal(newUser.password); //should be hashed
          expect(databaseRes.questionLevels).to.exist;
          databaseRes.questionLevels.forEach(question => expect(question.level).to.equal(1));
          expect(databaseRes.filteredList).to.exist;
          expect(databaseRes.filteredList.length).to.equal(0);
        });
    });

  });


  // describe('PUT to /api/users', function(){
  //   it.only('should update all the users questionLevels back to 1', function(){
  //     console.log(webToken);
  //     return chai.request(app).put('/api/users').send()
  //       .set('Authorization', `Bearer ${webToken}`)
  //       .set('content-type', 'application/json')
  //       .then(function(apiRes){
  //         console.log(apiRes.body);
  //       });
  //   });

  // });
});