const express = require("express");
const route = express.Router();

const vrf = require('../app/Controllers/Verify.controller');
route.get('/', vrf.verify);
route.get('/not-have-been-verified', vrf.requireVerify);

module.exports = route;