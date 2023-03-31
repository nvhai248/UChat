const express = require("express");
const route = express.Router();

const home = require('../app/Controllers/Home.controller');
route.get('/', home.getDisplay);

module.exports = route;