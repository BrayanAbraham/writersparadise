const express = require("express");
const passport = require("passport");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const validateProfileInput = require("../../validation/profile");

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error("Wrong file type"));
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
}).single("myImage");

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.bio) profileFields.bio = req.body.bio;

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists

        // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "email", "handle"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "email", "handle"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "email", "handle"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "email", "handle"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    upload(req, res, err => {
      // console.log("Request ---", req.body);
      // console.log("Request file ---", req.file); //Here you get file.
      /*Now do where ever you want to do*/
      if (!err && req.file) {
        Profile.findOne({ user: req.user.id }).then(profile => {
          if (profile) {
            if (profile.image !== "noimage") {
              const delpath = "./public/uploads/" + profile.image;
              try {
                fs.unlinkSync(delpath);
              } catch (err) {
                console.log(err);
              }
            }
            Profile.updateOne(
              { user: req.user.id },
              {
                $set: {
                  image: req.file.filename
                }
              }
            )
              .then(profile =>
                Profile.find({ user: req.user.id })
                  .populate("user", ["name", "email", "handle"])
                  .then(profile => res.json(profile))
                  .catch(err =>
                    res
                      .status(404)
                      .json({ profilenotfound: "Profile Not Found" })
                  )
              )
              .catch(err => {
                res.status(404).json({ profilenotfound: "Profile not found" });
              });
          } else {
            res.status(404).json({ profilenotfound: "Profile Not Found" });
          }
        });
      } else {
        const errors = {};
        if (err !== undefined && err.name === "MulterError") {
          errors.file = "File Too Large";
        } else {
          errors.file = "Only images Allowed";
        }
        return res.status(400).json(errors);
      }
    });
  }
);

module.exports = router;
