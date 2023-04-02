const logRoute = require('./log.route');
const homeRoute = require('./home.route');
const verifyRoute = require('./verify.route');

function routes(app) {
    // control remember login session 
    app.use(function (req, res, next) {
        if (req.session.rememberMe && req.isAuthenticated()) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        } else {
            req.session.cookie.expires = false;
        }
        next();
    });

    app.use('/', logRoute);
    app.use('/home', homeRoute);
    app.use('/verify', verifyRoute);
}

module.exports = routes;