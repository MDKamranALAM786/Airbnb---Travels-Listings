import {listingSchema} from "./validSchemas/listing.js";
import {Listing} from "./models/listing.js";
import {reviewSchema} from "./validSchemas/reviews.js";
import {Review} from "./models/review.js";
import {ExpressError} from "./utils/ExpressError.js";

export const isLoggedIn = function (req, res, next) {
    if(!req.isAuthenticated())
    {
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "Please Login");
        return(res.redirect("/login"));
    }
    next();
};

export const saveRedirectURL = (req, res, next) => {
    let url = req.session.redirectURL;
    if(url)
    {
        res.locals.redirectURL = url;
    }
    next();
};

export const isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    console.log(listing.owner);
    console.log(res.locals.currUser);
    if(!listing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error", "Permission Denied. Must be Owner!");
        return(res.redirect(`/listings/${id}`));
    }
    next();
};

export const isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id))
    {
        req.flash("error", "Permission Denied. Must be Author!");
        return(res.redirect(`/listings/${id}`));
    }
    next();
};

export const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errorMsg = error.details.map((elem) => (elem.message)).join(", ");
        throw new ExpressError(400, errorMsg);
    }
    else
    {
        next();
    }
};

export const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errorMsg = error.details.map((elem) => (elem.message)).join(", ");
        throw new ExpressError(400, errorMsg);
    }
    else
    {
        next();
    }
};
