const express = require("express"),
    path = require("path"),
    session = require("express-session"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    passport = require("passport"),
    cors = require("cors"),
    mongoose = require("mongoose");

// Init App
const app = express();

// Cors middleware
app.use(cors());

// Connect to MongoDB
const Connection_URI = process.env.MONGODB_URI || "mongodb+srv://shinigami017newuser:newuser1234@shinigami017-azees.mongodb.net/TaskManagement?retryWrites=true&w=majority";
mongoose.connect(
    Connection_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
).then(() => console.log("DB Connected!")).catch(error => console.log(error));

// Express body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up cookie parser
app.use(cookieParser());

// Express Session Middleware
app.use(session({
    secret: "session secret",
    saveUninitialized: true,
    resave: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require("./config/passport")(passport);

// Routes
// const indexRoute = require("./routes/index"),
const userRoute = require("./routes/users"),
    todosRoute = require("./routes/todos");
// app.use("/", indexRoute);
app.use("/users", userRoute);
app.use("/todos", todosRoute);

// Port Setup
app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"), function() {
    console.log("\nServer started on port " + app.get("port") + "!");
    console.log("Browse the url http://localhost:" + app.get("port") + "/");
    console.log("Press Ctrl + C to stop the server.\n");
});