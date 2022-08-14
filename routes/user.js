const User = require("../models/user");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//update user
router.put("/:id", verifyTokenAndAuthorization, (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true },
    function (err, data) {
      if (err) {
        return res.status(401).json("can't update");
      } else {
        return res.status(200).json(data);
      }
    }
  );
});

//Get all the users
router.get("/", verifyTokenAndAdmin, (req, res) => {
  let query = req.query.new;
  console.log(query);

  query
    ? User.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
      return res.status(200).json(post);
    })
    : User.find({}, (err, value) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).json(value);
        }
      });
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
