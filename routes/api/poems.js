const express = require("express");
const passport = require("passport");
const path = require("path");
const multer = require("multer");

const User = require("../../models/User");
const Poem = require("../../models/Poem");

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

router.get("/test", (req, res) => res.json({ msg: "Poem Works" }));

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

    const newPoem = new Poem({
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      image: "noimage",
      body: req.body.body,
      user: req.user.id
    });

    newPoem.save().then(poem =>
      Poem.findById(poem._id)
        .populate("user", ["handle"])
        .then(poem => res.json(poem))
        .catch(err => {
          res.status(404).json({ nopoemfound: "Poem not found" });
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

    Poem.findOne({ _id: req.params.id }).then(poem => {
      if (poem) {
        Poem.updateOne(
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
          .then(poem =>
            Poem.findById(req.params.id)
              .populate("user", ["handle"])
              .then(poem => res.json(poem))
              .catch(err => {
                res.status(404).json({ nopoemfound: "Poem not found" });
              })
          )
          .catch(err => {
            res.status(404).json({ nopoemfound: "Poem not found" });
          });
      } else {
        res.status(404).json({ nopoemfound: "Poem not found" });
      }
    });
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Poem.findById(req.params.id)
        .then(poem => {
          if (poem.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User Not Authorized" });
          }
          poem.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ nopoemfound: "Poem not found" }));
    });
  }
);

router.get("/", (req, res) => {
  Poem.find({ status: "Public" })
    .sort({ date: -1 })
    .populate("user", ["handle"])
    .then(poems => res.json(poems))
    .catch(err => res.status(404).json({ nopoemfound: "Poem not found" }));
});

router.get("/:id", (req, res) => {
  Poem.findById(req.params.id)
    .populate("user", ["handle"])
    .then(poem => res.json(poem))
    .catch(err => {
      res.status(404).json({ nopoemfound: "Poem not found" });
    });
});

router.get("/user/:user", (req, res) => {
  Poem.find({ user: req.params.user })
  .sort({ date: -1 })
    .populate("user", ["handle"])
    .then(poem => res.json(poem))
    .catch(err => res.status(404).json({ nopoemfound: "Poem not found" }));
});

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Poem.findById(req.params.id)
        .then(poem => {
          if (
            poem.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked the poem" });
          }
          poem.likes.unshift({ user: req.user.id });
          poem.save().then(poem => res.json(poem));
        })
        .catch(err => {
          res.status(404).json({ nopoemfound: "Poem not found" });
        });
    });
  }
);

router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Poem.findById(req.params.id)
        .then(poem => {
          if (
            poem.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "user has not yet liked the poem" });
          }
          const removeIndex = poem.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          poem.likes.splice(removeIndex, 1);
          poem.save().then(poem => res.json(poem));
        })
        .catch(err => {
          res.status(404).json({ nopoemfound: "Poem not found" });
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
    Poem.findById(req.params.id)
      .then(poem => {
        const newComment = {
          commentBody: req.body.body,
          commentUser: req.user.id,
          commentUserHandle: req.user.handle
        };
        poem.comments.unshift(newComment);
        poem.save().then(poem =>
          Poem.findById(req.params.id)
            .populate("user", ["handle"])
            .then(poem => res.json(poem))
            .catch(err => {
              res.status(404).json({ nopoemfound: "Poem not found" });
            })
        );
      })
      .catch(err => res.status(404).json({ nopoemfound: "Poem not found" }));
  }
);

router.delete(
  "/comment/:id/:commentid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Poem.findById(req.params.id)
      .then(poem => {
        if (
          poem.comments.filter(
            comment => comment._id.toString() === req.params.commentid
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        const removeIndex = poem.comments
          .map(item => item._id.toString())
          .indexOf(req.params.commentid);
        poem.comments.splice(removeIndex, 1);
        poem.save().then(poem =>
          Poem.findById(req.params.id)
            .populate("user", ["handle"])
            .then(poem => res.json(poem))
            .catch(err => {
              res.status(404).json({ nopoemfound: "Poem not found" });
            })
        );
      })
      .catch(err => res.status(404).json({ nopoemfound: "Poem not found" }));
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
        Poem.findById(req.params.id).then(poem => {
          if (poem) {
            Poem.updateOne(
              { _id: req.params.id },
              {
                $set: {
                  image: req.file.filename
                }
              }
            )
              .then(poem =>
                Poem.findById(req.params.id)
                  .populate("user", ["handle"])
                  .then(poem => res.json(poem))
                  .catch(err => {
                    res.status(404).json({ nopoemfound: "Poem not found" });
                  })
              )
              .catch(err => {
                res.status(404).json({ nopoemfound: "Poem not found" });
              });
          } else {
            res.status(404).json({ nopoemfound: "Poem not found" });
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
