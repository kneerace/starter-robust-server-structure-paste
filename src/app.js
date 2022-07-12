// const { json, application } = require("express");
const express = require("express");
const app = express();
app.use(express.json());

// PASTE
    const pastesRouter = require("./pastes/pastes.router");
    app.use("/pastes", pastesRouter); // its app.use not app.get, as get is defined in the router

// NOTES
    const notesRouter = require("./notes/notes.router");
    app.use("/notes",notesRouter);

//USERS
    const userRouter = require("./users/user.router");
    app.use("/users",userRouter);

// RATINGS
    const ratingRouter = require("./ratings/rating.router");
    app.use("/ratings", ratingRouter);

// Not found handler
app.use((request, response, next) => {
  next({
    status:404, 
    message :`Not found: ${request.originalUrl}`
})
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const {status = 500, message = "Something went wrong!!" } = error;
  response.status(status).json({error: message});
});

module.exports = app;
