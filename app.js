import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import {fileURLToPath} from "url";
import methodOverride from "method-override";
import ejs_mate from "ejs-mate";
import {ExpressError} from "./utils/ExpressError.js";
import {router as listingsRoute} from "./routes/listings.js";
import {router as reviewsRoute} from "./routes/reviews.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import {User} from "./models/user.js";
import {router as usersRoute} from "./routes/users.js";

const app = express();
const port = 8080;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejs_mate);
app.use(express.static(path.join(__dirname, "/public/CSS")));
app.use(express.static(path.join(__dirname, "/public/JS")));

const DB_Url = process.env.ATLASDB_URL;
async function main()
{
    await mongoose.connect(DB_Url);
}
main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    });
// connection to database

let store = MongoStore.create({
    mongoUrl : DB_Url,
    crypto : {secret : process.env.SECRET},
    touchAfter : 24 * 3600
});
store.on("error", (err) => (console.log("ERROR in MONGO SESSION STORE", err)));
let sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", usersRoute);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {status=500, message} = err;
    res.status(status).render("errors/error", {message});
});
