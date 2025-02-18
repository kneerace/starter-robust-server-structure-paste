const router = require("express").Router();
const controller = require("./user.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const pastesRouter = require("../pastes/pastes.router")
router.use("/:userId/pastes", controller.userExists, pastesRouter);

router
    .route("/")
        .get(controller.list)
            .all(methodNotAllowed);

router
    .route("/:userId")
        .get(controller.read)
            .all(methodNotAllowed);


module.exports = router;
