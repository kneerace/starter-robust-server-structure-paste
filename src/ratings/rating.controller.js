const ratings = require("../data/ratings-data");

function list(req, res){
    const {noteId} = req.params;
    // res.json({data: ratings})
    // console.log("LIST:::::came here .......")
    res.json({data:
        ratings.filter(noteId ? rating=> rating.noteId==noteId:()=>true)
    });
}

function ratingExists(req, res, next){
    const {noteId,ratingId} = req.params;
    // console.log(`ratingExists:::::: noteId=${noteId}, ratingId=${ratingId}`);
    const ratingUnderNotes = ratings.filter(noteId ? rating=> rating.noteId==noteId:()=>true);
    const ratingFound = ratingUnderNotes.find((rating)=> rating.id === Number(ratingId));
    if(ratingFound){
        res.locals.rating = ratingFound;
        return next();
    }
    else{
        return next({
            status:404, 
            message: `Rating id not found: ${ratingId}`
        });
    }
}

function read(req, res, next){
    // console.log("READ:::::came here .......")
    res.json({data: res.locals.rating});
}

module.exports = {
    list,
    read:[ratingExists, read],
}
