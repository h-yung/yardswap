const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const itemsController = require("../controllers/listings");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, itemsController.getPost);

router.post("/createPost", upload.single("file"), itemsController.createPost);

router.put("/likePost/:id", itemsController.likePost);

//like from feed:
router.put("/likePostFromFeed/:id", itemsController.likePostFromFeed);

router.delete("/deletePost/:id", itemsController.deletePost);

module.exports = router;
