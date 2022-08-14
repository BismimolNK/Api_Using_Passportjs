require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/products");
const User = require("./models/user")


const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//session
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize());
app.use(passport.session());

//mongoose connection
mongoose
  .connect("mongodb://localhost:27017/ecommerce-app")
  .then(() => console.log("Database connected successfully"));

  passport.use(User.createStrategy());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  

app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);


app.listen(process.env.PORT || 7000, () =>
  console.log(`Server Started in PORT number ${process.env.PORT}`)
);
