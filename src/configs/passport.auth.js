const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const Customer_account = require('../app/Models/customer.user');
const dotenv = require('dotenv');
const my_nodemailer = require('./node-mailer');


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
            const clientEmail = profile.emails[0].value;
            const is_auth_with_other_way = await Customer_account.findOne({ email: clientEmail });
            if (existingUser) {
                return done(null, existingUser);
            }
            if (is_auth_with_other_way) {
                await Customer_account.updateOne({ email: clientEmail }, { facebookID: profile.id });
                return done(null, is_auth_with_other_way);
            }
            const token = my_nodemailer.generateVerificationToken();
            userSave = new Customer_account({
                facebookID: profile.id,
                name: profile.displayName,
                email: clientEmail,
                photo: profile.photos[0].value,
                password: generatePassword(10),
                state: 0,
                verificationToken: token,
            });
            userSave.save();
            done(null, userSave);
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
            const clientEmail = profile.emails[0].value;

            if (existingUser) {
                return done(null, existingUser);
            }
            const is_auth_with_other_way = await Customer_account.findOne({ email: clientEmail });
            if (is_auth_with_other_way) {
                await Customer_account.updateOne({ email: clientEmail }, { googleID: profile.id });
                return done(null, is_auth_with_other_way);
            }
            const token = my_nodemailer.generateVerificationToken();
            const newUser = await Customer_account.create({
                googleID: profile.id,
                displayName: profile.displayName,
                email: clientEmail,
                photo: profile.photos[0].value,
                password: generatePassword(10),
                state: 0,
                verificationToken: token,
            });
            newUser.save();
            done(null, newUser);
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