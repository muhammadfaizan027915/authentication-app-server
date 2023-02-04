const init = require("./Services/authService");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const app = express();

// Config Dotenv
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Session Configuration
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    name: "sessions",
    resave: true,
    saveUninitialized: true,
    key: "session",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  })
);

// // Configure passport
init(passport);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("", require("./Routes/index"));

// Connect to the database
mongoose
  .connect(
    `mongodb+srv://faizan027915:faizan027915@mern.jsr5rzh.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to the database..."))
  .catch((err) => console.log("Failed to connect to the database...", err));

// PORT to run the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
