const Customer_account = require('../Models/customer.user');
const my_nodemailer_func = require('../../configs/node-mailer');
const mongoose_helpers = require('../Utils/mongoose.helper');

class Verify {

    // GET /verify
    verify = async (req, res) => {
        const token = req.query.token;
        await Customer_account.updateOne({ verificationToken: token }, { state: 1 });

        res.redirect('/home');
    }

    requireVerify = async (req, res) => {
        if (req.isAuthenticated()) {
            const userID = req.session.passport.user;
            const user = mongoose_helpers.mongoosesToObject(await Customer_account.findOne({ _id: userID }));
            my_nodemailer_func.sendVerificationEmail(user.email, user.verificationToken);
            return res.render('notVerified');
        }

        res.redirect('/');
    }
}

module.exports = new Verify();