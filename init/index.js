import "dotenv/config";
import mongoose from "mongoose";
import {Listing} from "../models/listing.js";
import {sampleListings as data} from "./data.js";

const DB_Url = process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("Conncetion Successful");
    })
    .catch((err) => {
        console.log(err);
    });
async function main()
{
    await mongoose.connect(DB_Url);
}

const initDb = async () => {
    await Listing.deleteMany({});
    let updatedData = data.map((ob) => ({...ob, owner : "69ca3663adb056a9f7cffc9d"}));
    await Listing.insertMany(updatedData);
    console.log("Data Reinitialized");
};
initDb();
