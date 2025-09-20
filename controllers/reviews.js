import {Listing} from "../models/listing.js";
import {Review} from "../models/review.js";

export const createReview = async (req, res) => {
    let {id} = req.params;
    let {review} = req.body;
    let listing = await Listing.findById(id);

    let newReview = new Review(review);
    newReview.author = res.locals.currUser._id;
    listing.reviews.push(newReview);
    console.log(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!");

    res.redirect(`/listings/${id}`);
};

export const destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};
