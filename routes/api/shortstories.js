const express = require("express");
const passport = require("passport");
const path = require("path");
const multer = require("multer");

const User = require("../../models/User");
const ShortStory = require("../../models/ShortStory");

const validatePoemInput = require("../../validation/poem");
const validateCommentInput = require("../../validation/comment");

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

router.get("/test", (req, res) => res.json({ msg: "ShortStory Works" }));

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePoemInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    const newShortStory = new ShortStory({
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      image: "noimage",
      body: req.body.body,
      user: req.user.id
    });

    newShortStory.save().then(shortstory =>
      ShortStory.findById(shortstory._id)
        .populate("user", ["handle"])
        .then(shortstory => res.json(shortstory))
        .catch(err => {
          res.status(404).json({ noshortstoryfound: "ShortStory not found" });
        })
    );
  }
);

router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePoemInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    ShortStory.findOne({ _id: req.params.id }).then(shortstory => {
      if (shortstory) {
        ShortStory.updateOne(
          { _id: req.params.id },
          {
            $set: {
              title: req.body.title,
              status: req.body.status,
              allowComments: allowComments,
              body: req.body.body,
              user: req.user.id
            }
          }
        )
          .then(shortstory =>
            ShortStory.findById(req.params.id)
              .populate("user", ["handle"])
              .then(shortstory => res.json(shortstory))
              .catch(err => {
                res.status(404).json({ noshortstoryfound: "ShortStory not found" });
              })
          )
          .catch(err => {
            res.status(404).json({ noshortstoryfound: "ShortStory not found" });
          });
      } else {
        res.status(404).json({ noshortstoryfound: "ShortStory not found" });
      }
    });
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      ShortStory.findById(req.params.id)
        .then(shortstory => {
          if (shortstory.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User Not Authorized" });
          }
          shortstory.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ noshortstoryfound: "ShortStory not found" }));
    });
  }
);

router.get("/", (req, res) => {
  ShortStory.find({ status: "Public" })
    .sort({ date: -1 })
    .populate("user", ["handle"])
    .then(shortstorys => res.json(shortstorys))
    .catch(err => res.status(404).json({ noshortstoryfound: "ShortStory not found" }));
});

router.get("/:id", (req, res) => {
  ShortStory.findById(req.params.id)
    .populate("user", ["handle"])
    .then(shortstory => res.json(shortstory))
    .catch(err => {
      res.status(404).json({ noshortstoryfound: "ShortStory not found" });
    });
});

router.get("/user/:user", (req, res) => {
  ShortStory.find({ user: req.params.user })
  .sort({ date: -1 })
    .populate("user", ["handle"])
    .then(shortstory => res.json(shortstory))
    .catch(err => res.status(404).json({ noshortstoryfound: "ShortStory not found" }));
});

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      ShortStory.findById(req.params.id)
        .then(shortstory => {
          if (
            shortstory.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked the shortstory" });
          }
          shortstory.likes.unshift({ user: req.user.id });
          shortstory.save().then(shortstory => res.json(shortstory));
        })
        .catch(err => {
          res.status(404).json({ noshortstoryfound: "ShortStory not found" });
        });
    });
  }
);

router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      ShortStory.findById(req.params.id)
        .then(shortstory => {
          if (
            shortstory.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "user has not yet liked the shortstory" });
          }
          const removeIndex = shortstory.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          shortstory.likes.splice(removeIndex, 1);
          shortstory.save().then(shortstory => res.json(shortstory));
        })
        .catch(err => {
          res.status(404).json({ noshortstoryfound: "ShortStory not found" });
        });
    });
  }
);

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    ShortStory.findById(req.params.id)
      .then(shortstory => {
        const newComment = {
          commentBody: req.body.body,
          commentUser: req.user.id,
          commentUserHandle: req.user.handle
        };
        shortstory.comments.unshift(newComment);
        shortstory.save().then(shortstory =>
          ShortStory.findById(req.params.id)
            .populate("user", ["handle"])
            .then(shortstory => res.json(shortstory))
            .catch(err => {
              res.status(404).json({ noshortstoryfound: "ShortStory not found" });
            })
        );
      })
      .catch(err => res.status(404).json({ noshortstoryfound: "ShortStory not found" }));
  }
);

router.delete(
  "/comment/:id/:commentid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ShortStory.findById(req.params.id)
      .then(shortstory => {
        if (
          shortstory.comments.filter(
            comment => comment._id.toString() === req.params.commentid
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        const removeIndex = shortstory.comments
          .map(item => item._id.toString())
          .indexOf(req.params.commentid);
        shortstory.comments.splice(removeIndex, 1);
        shortstory.save().then(shortstory =>
          ShortStory.findById(req.params.id)
            .populate("user", ["handle"])
            .then(shortstory => res.json(shortstory))
            .catch(err => {
              res.status(404).json({ noshortstoryfound: "ShortStory not found" });
            })
        );
      })
      .catch(err => res.status(404).json({ noshortstoryfound: "ShortStory not found" }));
  }
);

router.post(
  "/upload/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    upload(req, res, err => {
      // console.log("Request ---", req.body);
      // console.log("Request file ---", req.file); //Here you get file.
      /*Now do where ever you want to do*/
      if (!err && req.file) {
        ShortStory.findById(req.params.id).then(shortstory => {
          if (shortstory) {
            ShortStory.updateOne(
              { _id: req.params.id },
              {
                $set: {
                  image: req.file.filename
                }
              }
            )
              .then(shortstory =>
                ShortStory.findById(req.params.id)
                  .populate("user", ["handle"])
                  .then(shortstory => res.json(shortstory))
                  .catch(err => {
                    res.status(404).json({ noshortstoryfound: "ShortStory not found" });
                  })
              )
              .catch(err => {
                res.status(404).json({ noshortstoryfound: "ShortStory not found" });
              });
          } else {
            res.status(404).json({ noshortstoryfound: "ShortStory not found" });
          }
        });
      } else {
        console.log(err);
        console.log("hi");
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
