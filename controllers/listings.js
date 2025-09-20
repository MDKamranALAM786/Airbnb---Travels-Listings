import {Listing} from "../models/listing.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});

// INDEX Route
export const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

// NEW Route
export const renderNewForm = (req, res) => {
    res.render("listings/new");
};
// INSERT Route
export const createListing = async (req, res) => {
    let {listing} = req.body;
    let {path : url, filename} = req.file;

    let response = await geocodingClient.forwardGeocode({
        query: `${listing.location}, ${listing.country}`,
        limit: 1
    })
    .send();

    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// SHOW Route
export const showListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
    if(!listing)
    {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    let reviews = listing.reviews;
    res.render("listings/show", {listing, reviews});
};

// EDIT Route
export const renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_300");
    res.render("listings/edit", {listing, originalImageUrl});
};
// UPDATE Route
export const updateListing = async (req, res) => {
    let {id} = req.params;
    let {listing} = req.body;
    listing = await Listing.findByIdAndUpdate(id, {...listing});
    if(typeof req.file !== "undefined")
    {
        let {path : url, filename} = req.file;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// DESTROY Route
export const destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
