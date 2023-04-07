const Customer_account = require('../Models/customer.user');
const mongoose_helpers = require('../Utils/mongoose.helper');

class HomeController {
    async getDisplay(req, res, next) {
        if (req.isAuthenticated()) {
            const userID = req.session.passport.user;
            const user = mongoose_helpers.mongoosesToObject(await Customer_account.findOne({ _id: userID }));

            // is not have been verify go to require verify
            if (!(user.state)) return res.redirect('/verify/not-have-been-verified');

            const peoples = mongoose_helpers.multiMongooseToObject(await Customer_account.find());

            return res.render("home", {
                user: user,
                people: peoples,
            });
        }
        res.redirect('/');
    }
}

module.exports = new HomeController();