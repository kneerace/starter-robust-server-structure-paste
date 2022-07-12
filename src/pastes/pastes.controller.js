const pastes = require("../data/pastes-data");


function list(req, res) {
  res.json({ data: pastes });
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id),0);

// //this validates the "text" parameter
// function bodyHasTextProperty(req, res, next){
//   const {data: {text} ={}} = req.body;
//   if(text){
//     return next();
//   }
//   next({
//     status: 400,
//     message: "A 'text' property is required.",
//   });
// }

// this to validate all the parameter in the data obj
function bodyDataHas (propertyName){
  return function (req, res, next){
    const { data = {} } = req.body;
    if(data[propertyName]){
      return next();
    }
    next({status:400,
    message: `Must include a ${propertyName}`});
  };
}

function exposurePropertyIsValid(req, res, next){
  const {data :{exposure}={}} = req.body;
  const validExposure = ["private", "public"];
  if (validExposure.includes(exposure)){
    return next()
  }
  next({
    status: 400,
    message: `Valud of 'exposure' must be one of '${validExposure.join(' or ')}', but Received: ${exposure}.`
  })
}

function isValidNumber (propertyName){
  return function (req, res, next){
    const {data={}} = req.body;
    if(data[propertyName]<=0 || !Number.isInteger(data[propertyName])){
      return next({
        status : 400, 
        message: `${propertyName} requires a valid number.`
      });
    }
    next();
  }
}

function create(req, res){
  const { data: {name, syntax, exposure, expiration, text, user_id} ={}} = req.body;
  const newPaste ={
    id: ++lastPasteId,
    name,
    syntax, 
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.status(201).json({data: newPaste});
}

//function to check if paste exists
function pasteExists(req, res, next){
  const {pasteId} = req.params;
  const foundPaste = pastes.find((paste)=> paste.id === Number(pasteId));
  if(foundPaste){
    return next();
  }
  next({
    status:404, 
    message: `Paste id not found: ${pasteId}`
  });
}

// return specific paste
function read(req, res){
  const {pasteId} = req.params;
  const foundPaste = pastes.find((paste)=> paste.id === Number(pasteId));
  res.json({data: foundPaste});
}

// functiomn to update the existing paste
function update(req, res){
  const {pasteId} = req.params;
  const foundPaste = pastes.find((paste)=> paste.id === Number(pasteId));
  const {data : { name, syntax, expiration, exposure, text} ={}} = req.body;

  //updating the required paste
  foundPaste.name = name;
  foundPaste.syntax = syntax;
  foundPaste.expiration = expiration;
  foundPaste.exposure = exposure;
  foundPaste.text = text;

  res.json({data: foundPaste});
}

// functiomn to delete the existing paste
function destroy(req, res){
  const {pasteId} = req.params;
  // pastes = pastes.filter((paste)=> paste.id !== Number(pasteId))
      // above doesnot work as pastes is const, so can't replace or reference with diff obj
  const index = pastes.findIndex((paste)=> paste.id === Number(pasteId));
    // splice() returns an array of the deleted elements, even if its of one element
  const deletedPastes = pastes.splice(index, 1); 
  res.sendStatus(204);
  res.send(`PasteID: ${pasteId}, deleted`);
}
module.exports = {
  // create :[bodyHasTextProperty, create],
  create :[
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    isValidNumber("expiration"),
    isValidNumber("user_id"),
    create
  ],
  list,
  read:[pasteExists, read],
  update:[
    pasteExists, 
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    isValidNumber("expiration"),
    isValidNumber("user_id"),
    update
  ],
  destroy:[ pasteExists, destroy ],
};