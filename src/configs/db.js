const mongoose = require("mongoose");

async function connect() {

    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        //mongodb://localhost:27017/Hospital
        //mongodb+srv://hospital:hospital123@cluster0.ybwogqe.mongodb.net/Hospital?retryWrites=true&w=majority
        const connection = mongoose.connection;
        connection.on('error', console.error.bind(console, 'connection error:'));
        connection.once('open', function () {
            // we're connected!
            console.log('Connected to MongoDB Atlas');
        });
    }
    catch (e) {
        console.log(e);
    }

}

module.exports = { connect };