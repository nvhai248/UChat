const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const Customer_account = require('../app/Models/customer.user');
const dotenv = require('dotenv');

function generatePassword(length) {
    let password = '';
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

    for (let i = 0; i < length; i++) {
        password += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return password;
}

module.exports = app => {
    dotenv.config();

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
        })
    )

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());


    // Khai báo một local strategy cho passport
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
        async function (email, password, done) {
            try {
                user = await Customer_account.findOne({ email: email });
                if (!user) return done(null, false, { message: 'Incorrect email!' });
                if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: 'Incorrect password!' });
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    ));

    // setting up facebook
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        async function (accessToken, refreshToken, profile, done) {
            // find or create a user in the database based on the Facebook profile information
            const existingUser = await Customer_account.findOne({ facebookID: profile.id });
            if (!existingUser) {
                userSave = new Customer_account({
                    facebookID: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    password: generatePassword(10),
                });
                userSave.save();
                done(null, userSave);
            }       
            else {
                done(null, existingUser);
            }
        }
    ));

    // setting up passport google oauth2.0
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await Customer_account.findOne({ googleID: profile.id });
            if (existingUser) {
                done(null, existingUser);
            } else {
                const newUser = await Customer_account.create({
                    googleID: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    password: generatePassword(10),
                });
                done(null, newUser);
            }
        } catch (error) {
            done(error, null);
        }
    }));

    // Lưu user vào session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // Lấy user từ session
    passport.deserializeUser(async function (_id, done) {
        user = await Customer_account.findOne({ _id: _id });
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });

}