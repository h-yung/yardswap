const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const itemsController = require("../controllers/listings");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, itemsController.getProfile);
router.get("/:userid/profile", ensureAuth, itemsController.getOtherUserProfile);

router.get("/feed", ensureAuth, itemsController.getFeed); //feed is member access only
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
