const router = require("express").Router();
const controller = require("./pastes.controller");

// main route
router
    .route("/")
        .get(controller.list)
            .post(controller.create);
// pasteID level route
router
    .route("/:pasteId")
        .get(controller.read)
            .put(controller.update)
                .delete(controller.destroy);
module.exports = router;