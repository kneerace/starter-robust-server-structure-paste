const notes = require("../data/notes-data")

function list(req, res) {
    res.json({ data: notes });
  }
  
function noteExists(req, res, next){
    const noteId = Number(req.params.noteId);
    const foundNote = notes.find((note) => note.id === noteId);
    if (foundNote) {
      res.locals.note = foundNote;
      return next();
    } else {
      return next({
        status: 404,
        message: `Note id not found: ${req.params.noteId}`,
      });
    }
}

function read(req, res){
    // const {noteId} = req.params;
    // const noteFound = notes.find((note)=> note.id === Number(noteId));
    res.json({data: res.locals.note});
}

const hasText = (req, res, next) => {
    const { data: { text } = {} } = req.body;
    if (text) {
      return next();
    }
    return next({ status: 400,
        message: "A 'text' property is required." });
  };
  
function create (req, res, next) {
    const { data: { text } = {} } = req.body;
  
    const newNote = {
      id: notes.length + 1, // Assign the next ID
      text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
  };
  
function bodyDataHas(propertyName){
    return function (req, res, next){
        const {data ={}}= req.body;
        if (data[propertyName]){
            return next();
        }
        else{
            return next ({
                status:400,
                message:`Must include a ${propertyName}`
            });
        }
    };
}

function update (req, res, next){
    // const noteId = Number(req.params.noteId);
    // const foundNote = notes.find((note) => note.id === noteId);
    const foundNote = res.locals.note;
    const {data:{text}={}} = req.body;

    foundNote.text = text;
    res.json({data: foundNote})
}

function destroy(req,res){
    const {noteId} = req.params;
    const noteIndex = notes.findIndex((note)=> note.id === Number(noteId));
    const deletedNote = notes.splice(noteIndex,1);
    res.sendStatus(204);
}

module.exports = { list,
    read:[noteExists, read],
    create:[
        hasText,
        create
    ],
    update: [
        noteExists,
        bodyDataHas("text"),        
        update
    ],
    delete:[ noteExists, destroy],
    noteExists,
};
