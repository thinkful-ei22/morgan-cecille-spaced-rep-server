# Atlas

### Links

[Live App](https://countries-client.herokuapp.com/)

[Client-Side Repo](https://github.com/thinkful-ei22/morgan-cecille-spaced-rep-client)


### Description

Atlas utilizes a spaced repition algorithm to help users learn geography.  The app functions like flash cards, and the algorithm allows users to see flash cards that are catered towards their personal weak spots.  Questions that are missed will be seen more frequently; while questions that are correct will be seen less frequently.  (See [Leitner Spaced-Repetion Algorithm](https://en.wikipedia.org/wiki/Leitner_system)).


### Tech-Stack

- Frontend: React, React-Router, Redux, Redux-Form, Redux-Thunk, Enzyme & Jest for testing

- Backend: Node/Express app with user authentication using BCrypt and JSON Web Tokens, passport.js, CORS, and Mocha & Chai for testing.  The spaced-repetition algorithm utilizes a Linked-List behavior to show users questions in an optimized, sequential order.
