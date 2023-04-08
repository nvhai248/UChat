// setting environment
const express = require('express');
const handlebars = require('express-handlebars').create({
    defaultLayout: "main",
    extname: "hbs",
});

const path = require('path');

// declare app
const port = process.env.PORT || 3000;
const app = express();

// setting environment
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//plugin session
require('./src/configs/passport.auth')(app);
// setting route
require('./src/routes')(app);
//connect database
require('./src/configs/db').connect();


// setting socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});

// setup resources for client
// all images,... are provided from the file "public"
app.use(express.static(path.join(__dirname, "src/public")));

//setup handlebars
app.engine("hbs", handlebars.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "resources", "views"));

app.use((err, req, res, next) => {
    res.status(500).send(err.message);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

