// const { json, application } = require("express");
const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");
app.use(express.json());


const pastesRouter = require("./pastes/pastes.router");


app.use("/pastes", pastesRouter); // its app.use not app.get, as get is defined in the router

//POST handler
app.post("/pastes", pastesRouter);


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
