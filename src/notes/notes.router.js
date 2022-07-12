const router = require("express").Router();
const controller = require("./notes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed");


const ratingRouter = require("../ratings/rating.router")
router.use("/:noteId/ratings",controller.noteExists, ratingRouter);
router.use("/:noteId/ratings/:ratingId",controller.noteExists, ratingRouter);

router
    .route("/")
        .get(controller.list)
            .post(controller.create)
                .all(methodNotAllowed);

router
    .route("/:noteId")
        .get(controller.read)
            .put(controller.update)
                .delete(controller.delete)
                    .all(methodNotAllowed);

module.exports = router;
