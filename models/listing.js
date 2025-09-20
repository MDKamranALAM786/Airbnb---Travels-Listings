import mongoose from "mongoose";
import {Review} from "./review.js";

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    image : {
        url : String,
        filename : String
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry : {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});
listingSchema.post("findOneAndDelete", async (listing) => {
    console.log(listing);
    console.log(listing.reviews);
    console.log(listing.reviews.length);
    if(listing.reviews.length > 0)
    {
        let result = await Review.deleteMany({_id : {$in : listing.reviews}});
        console.log(result);
    }
});
export const Listing = mongoose.model("Listing", listingSchema);
