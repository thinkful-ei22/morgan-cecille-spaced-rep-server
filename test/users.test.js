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
      User.create({username: 'billybob', password: 'password'})
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
          expect(decodedToken.user.username).to.deep.equal(newUser.username);
        });
    });
  });
});