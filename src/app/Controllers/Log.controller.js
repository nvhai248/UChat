const Customer_account = require('../Models/customer.user');
const bcrypt = require('bcrypt');
const path = require('path');

class LogController {
    // [GET] /
    getDisplay = (req, res, next) => {
        req.session.rememberMe = false;
        if (req.isAuthenticated())
            return res.redirect('home');
        res.render("logPage", {
            messageLogin: req.flash('error'),
            messageRegister: req.flash('error-reg'),
        });
    }

    // POST /login
    checkLogin = (req, res, next) => {
        if (req.body.rememberMe) {
            req.session.rememberMe = true;
        } else {
            req.session.rememberMe = false;
        }
        res.redirect("/home");
    }

    // POST /logout
    logout = (req, res, next) => {
        if (req.isAuthenticated()) {
            req.logout(err => {
                console.log("Log out");
                if (err) console.log(err);
            })
        }
        res.redirect("/")
    }

    // POST /register
    register = async (req, res, next) => {
        if (req.isAuthenticated()) {
            return res.redirect('/home');
        }

        // check Existing User
        const existingUser = await Customer_account.findOne({ email: req.body.email });
        if (existingUser) {
            req.flash('error-reg', 'Email may already be used by another user!');
            return res.redirect('/');
        }

        const hashPw = await bcrypt.hashSync(req.body.password, 10);

        // add new User 
        const newCustomer = new Customer_account({
            email: req.body.email,
            password: hashPw,
            name: req.body.name
        });
        newCustomer.save();

        // authenticate and go to homepage
        req.login(newCustomer, (err) => {
            res.redirect('/not-have-been-verified');
        })
    }

    changeAvatar = async (req, res) => {
        const photoUrl = `${process.env.HOST}/uploads/` + req.file.filename;
        const userID = req.session.passport.user;
        await Customer_account.updateOne({ _id: userID }, { photo: photoUrl });
        res.redirect('/home');
    }

    sendFile = (req, res) => {
        // Get the path to the uploaded photo file
        const photoPath = path.join(__dirname, '../../../uploads', req.params.filename);

        // Send the photo file to the client
        res.sendFile(photoPath);
    }
}

module.exports = new LogController();