import express from "express";
import {wrapAsync} from "../utils/wrapAsync.js";
import {isLoggedIn, isAuthor, validateReview} from "../middleware.js";
import {createReview, destroyReview} from "../controllers/reviews.js";

export const router = express.Router({mergeParams : true});

// Add Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(destroyReview));
