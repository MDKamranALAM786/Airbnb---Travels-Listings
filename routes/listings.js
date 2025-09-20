import express from "express";
import {wrapAsync} from "../utils/wrapAsync.js";
import {validateListing, isLoggedIn, isOwner} from "../middleware.js";
import {
    index, renderNewForm, createListing, showListing, renderEditForm, updateListing, destroyListing
} from "../controllers/listings.js";
import multer from "multer";
import {storage} from "../cloudConfig.js";

const upload = multer({storage});
export const router = express.Router();

router.get("/", wrapAsync(index)); // INDEX Route
// ...

router.route("/new")
    .get(isLoggedIn, renderNewForm) // NEW Route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(createListing)); // INSERT Route
// ...

router.route("/:id")
    .get(wrapAsync(showListing)) // SHOW Route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(updateListing)) // UPDATE Route
    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing)); // DESTROY Route
// ...

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm)); // EDIT Route
