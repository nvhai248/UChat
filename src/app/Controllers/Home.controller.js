const Customer_account = require('../Models/customer.user');
const mongoose_helpers = require('../Utils/mongoose.helper');

class HomeController {
    async getDisplay(req, res, next) {
        if (req.isAuthenticated()) {
            const userID = req.session.passport.user;
            const user = mongoose_helpers.mongoosesToObject(await Customer_account.findOne({ _id: userID }));
            return res.render("home", {
                user: user,
            });
        }
        res.redirect('/');
    }
}

module.exports = new HomeController();