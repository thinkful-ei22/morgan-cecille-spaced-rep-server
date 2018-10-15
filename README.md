# Atlas

### Links

[Live App](https://countries-client.herokuapp.com/)

[Client-Side Repo](https://github.com/thinkful-ei22/morgan-cecille-spaced-rep-client)


### Description

Atlas utilizes a spaced repition algorithm to help users learn geography.  The app functions like flash cards, and the algorithm allows users to see flash cards that are catered towards their personal weak spots.  Questions that are missed will be seen more frequently; while questions that are correct will be seen less frequently.  (See [Leitner Spaced-Repetion Algorithm](https://en.wikipedia.org/wiki/Leitner_system)).


### Tech-Stack

- Frontend: React, React-Router, Redux, Redux-Form, Redux-Thunk, Enzyme & Jest for testing

- Backend: Node/Express app with user authentication using BCrypt and JSON Web Tokens, passport.js, CORS, and Mocha & Chai for testing.  The spaced-repetition algorithm utilizes a Linked-List behavior to show users questions in an optimized, sequential order.

### API Documentation

#### Authorization

##### Register as a new user
- Request Type: `POST`
- Path `https://countries-server.herokuapp.com/api/users`
- Required Request Headers: ```{Content-Type: 'application/json'}```
- Request Body:
```
{
  username: 'usernameStringGoesHere',
  password: 'passwordStringGoesHere'
}
```
- Successful registration will have response status 201

##### GET a JSON Web Token for valid user (login)
- Request Type: `POST`
- Path `https://countries-server.herokuapp.com/api/login`
- Required Request Headers: ```{Content-Type: 'application/json'}```
- Request Body:
```
{
  username: 'usernameStringGoesHere',
  password: 'passwordStringGoesHere'
}
```
- JSON Response Body:
```
{
  authToken: 'WebTokenWillBeThisString'
}
```

#### Get user's Progress Levels
- Request Type: `GET`
- Path `https://countries-server.herokuapp.com/api/users`
- Required Request Headers: 
```
  {
    Content-Type: 'application/json',
    Authorization: 'Bearer JsonTokenGoesHere'
  }
```
- JSON Response Body:
```
  [
    {"level":3,"_id":"5b9c2fe3ab8abe00139c3487","country":"Canada"},
    {"level":1,"_id":"5b9c2fe3ab8abe00139c3486","country":"America"},
    {"level":3,"_id":"5b9c2fe3ab8abe00139c3485","country":"Mexico"},
    {"level":1,"_id":"5b9c2fe3ab8abe00139c3484","country":"Dominican Republic"},
    {"level":3,"_id":"5b9c2fe3ab8abe00139c3483","country":"Cuba"},
    {"level":1,"_id":"5b9c2fe3ab8abe00139c3482","country":"Haiti"},
    {"level":2,"_id":"5b9c2fe3ab8abe00139c3481","country":"Russia"},
    {"level":2,"_id":"5b9c2fe3ab8abe00139c3480","country":"Philippines"},
    {"level":2,"_id":"5b9c2fe3ab8abe00139c347f","country":"Poland"},
    {"level":2,"_id":"5b9c2fe3ab8abe00139c347e","country":"Norway"}
  ]
```

