const express = require("express");
const passport = require("passport");
const route = express.Router();

const log = require('../app/Controllers/Log.controller');

// POST register 
route.post('/register', log.register);

// logout function
route.post('/logout', log.logout);

// login function
route.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true,
}), log.checkLogin);

//login with facebook 
route.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

route.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureMessage: true,
        failureRedirect: '/'
    }));

// login with google 
// Define routes
route.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
route.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/home',
    failureMessage: true,
    failureRedirect: '/'
}));

route.get('/', log.getDisplay);

module.exports = route;