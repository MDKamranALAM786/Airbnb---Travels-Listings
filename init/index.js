import mongoose from "mongoose";
import {Listing} from "../models/listing.js";
import {sampleListings as data} from "./data.js";

const mongo_url = "mongodb://127.0.0.1:27017/WanderLust";
main()
    .then(() => {
        console.log("Conncetion Successful");
    })
    .catch((err) => {
        console.log(err);
    });
async function main()
{
    await mongoose.connect(mongo_url);
}

const initDb = async () => {
    await Listing.deleteMany({});
    let updatedData = data.map((ob) => ({...ob, owner : "68bf15b5a052f44cf8e66269"}));
    await Listing.insertMany(updatedData);
    console.log("Data Reinitialized");
};
initDb();
