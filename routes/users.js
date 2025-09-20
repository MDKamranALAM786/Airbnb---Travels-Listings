import express from "express";
import passport from "passport";
import {saveRedirectURL} from "../middleware.js";
import {renderSignupForm, signupUser, renderLoginForm, loginUser, logoutUser} from "../controllers/users.js";
import {wrapAsync} from "../utils/wrapAsync.js";

export const router = express.Router();

router.route("/signup")
    .get(renderSignupForm)
    .post(wrapAsync(signupUser));
// ...

router.route("/login")
    .get(renderLoginForm)
    .post(saveRedirectURL, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), loginUser);
// ...

router.get("/logout", logoutUser);
