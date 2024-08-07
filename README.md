This is a simple backend program written in JavaScript (Node.js Runtime). These are the following features of the backend:
1) The Backend has 3 endpoints ( /signup, /signin , /token)
2) In /signup The users details are extracted from the body and the body content is validated with the help of zod.
   -> After verifting the input datatype the details of the user will stored in a database of json format in mongo-db.
3) In /signin after the user has signed up the Backend will generate a JWT(jsonwebtoken) based on the user's username and return it to the user.
4) In /token to verify the token the user sends the token in the header and the backend will extract that and verify it.
   -> If verified the user will get a message verified with the username.
   -> If invalid the backend will respond with a 403 status code.
5) Librabries used:
   -> Express.js
   -> Zod
   -> Mongoose
   -> JWT (JsonWebToken)
