const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

router.post("/register", (req, res) => {
  const password = req.body.password;

  bcrypt.hash(password, 10, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: data,
      });
      newUser.save();
      res.json({ success: true, message: "user registered successfully" });
    }
  });
});

router.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username:username},function(err,data){
      if(data===null){
          res.status(500).json("User doesn't exist")
      }else if(err){
          return res.status(500).json("can't find user")

      }else{
          bcrypt.compare(password,data.password,function(err,result){
              if(err){
                  console.log(err);
              }
              else if(result===false){
                  return res.status(500).json("wrong password")
              }else{
                  const accessToken = jwt.sign({
                      id:data._id,
                      isAdmin:data.isAdmin
                  },process.env.JWT_SECRET)

                  const{password, ...others} = data._doc
                  return res.status(200).json({...others,accessToken})
              }
          })
      }
  })
})

// router.post("/login", function (req, res) {
//   const users = new User({
//     username: req.body.username,
//     password: req.body.password,
//   });
//   if (!req.body.username) {
//     res.json({ success: false, message: "please enter username" });
//   } else if (!req.body.password) {
//     res.json({ success: false, message: "please enter password" });
//   } else {
//     req.login(users, function (err) {
//       if (err) {
//         res.json({ success: false, message: "user can't login" });
//       } else {
//         passport.authenticate("local", {
//           failureMessage: "incorrect password or username",
//           successMessage: "login successful",
//         });

//         User.findOne({ username: users.username }, function (err, user) {
//           if (err) {
//             console.log(err);
//           }else if (!user){
//             res.json({success:false,message:"no user with this username"})
//           }
//            else {
//             const accessToken = jwt.sign(
//               {
//                 id: user._id,
//                 isAdmin: user.isAdmin,
//               },
//               process.env.JWT_SECRET
//             );

//             const { password, ...others } = user;
//             return res.status(200).json({ ...others, accessToken });
//           }
//         });
//       }
//     });
//   }
// });



module.exports = router;
