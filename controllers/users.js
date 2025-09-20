import {User} from "../models/user.js";

export const renderSignupForm = (req, res) => {
    res.render("users/signup");
};
export const signupUser = async (req, res) => {
    try
    {
        let {user} = req.body;
        let newUser = new User({username : user.username, email : user.email});
        let registered = await User.register(newUser, user.password);
        req.login(registered, (err) => {
            if(err) {next(err)}
            req.flash("success", "User Registered");
            res.redirect("/listings");
        });
    }
    catch(err)
    {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

export const renderLoginForm = (req, res) => {
    res.render("users/login");
};
export const loginUser = (req, res) => {
    req.flash("success", "Login successful!");
    let redirectURL = res.locals.redirectURL || "/listings";
    console.log(redirectURL);
    res.redirect(redirectURL);
};

export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err) {next(err)}
        req.flash("success", "Logout Successful");
        res.redirect("/listings");
    });
};
