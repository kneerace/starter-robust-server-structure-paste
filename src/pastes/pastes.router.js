const router = require("express").Router({mergeParams:true});
const controller = require("./pastes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// main route
router
    .route("/")
        .get(controller.list)
            .post(controller.create)
                .all(methodNotAllowed);
// pasteID level route
router
    .route("/:pasteId")
        .get(controller.read)
            .put(controller.update)
                .delete(controller.destroy)
                    .all(methodNotAllowed);
module.exports = router;