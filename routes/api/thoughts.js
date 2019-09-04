const express = require("express");
const passport = require("passport");
const path = require("path");

const User = require("../../models/User");
const Thought = require("../../models/Thoughts");

const validateQuoteInput = require("../../validation/thought");
const validateCommentInput = require("../../validation/comment");

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Quote Works" }));

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateQuoteInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    const newQuote = new Thought({
      status: req.body.status,
      allowComments: allowComments,
      image: "noimage",
      body: req.body.body,
      user: req.user.id
    });

    newQuote.save().then(quote =>
      Thought.findById(quote._id)
        .populate("user", ["handle"])
        .then(quote => res.json(quote))
        .catch(err => {
          res.status(404).json({ noquotefound: "quote not found" });
        })
    );
  }
);

router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateQuoteInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    Thought.findOne({ _id: req.params.id }).then(quote => {
      if (quote) {
        Thought.updateOne(
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
          .then(quote =>
            Thought.findById(req.params.id)
              .populate("user", ["handle"])
              .then(quote => res.json(quote))
              .catch(err => {
                res.status(404).json({ noquotefound: "Thought not found" });
              })
          )
          .catch(err => {
            res.status(404).json({ noquotefound: "Thought not found" });
          });
      } else {
        res.status(404).json({ noquotefound: "Thought not found" });
      }
    });
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Thought.findById(req.params.id)
        .then(quote => {
          if (quote.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User Not Authorized" });
          }
          quote.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ noquotefound: "Thought not found" })
        );
    });
  }
);

router.get("/", (req, res) => {
  Thought.find({ status: "Public" })
    .sort({ date: -1 })
    .populate("user", ["handle"])
    .then(quotes => res.json(quotes))
    .catch(err => res.status(404).json({ noquotefound: "Thought not found" }));
});

router.get("/:id", (req, res) => {
  Thought.findById(req.params.id)
    .populate("user", ["handle"])
    .then(quote => res.json(quote))
    .catch(err => {
      res.status(404).json({ noquotefound: "Thought not found" });
    });
});

router.get("/user/:user", (req, res) => {
  Thought.find({ user: req.params.user })
    .sort({ date: -1 })
    .populate("user", ["handle"])
    .then(quote => res.json(quote))
    .catch(err => res.status(404).json({ noquotefound: "Thought not found" }));
});

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Thought.findById(req.params.id)
        .then(quote => {
          if (
            quote.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked the quote" });
          }
          quote.likes.unshift({ user: req.user.id });
          quote.save().then(quote => res.json(quote));
        })
        .catch(err => {
          res.status(404).json({ noquotefound: "Thought not found" });
        });
    });
  }
);

router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Thought.findById(req.params.id)
        .then(quote => {
          if (
            quote.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "user has not yet liked the quote" });
          }
          const removeIndex = quote.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          quote.likes.splice(removeIndex, 1);
          quote.save().then(quote => res.json(quote));
        })
        .catch(err => {
          res.status(404).json({ noquotefound: "Thought not found" });
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
    Thought.findById(req.params.id)
      .then(quote => {
        const newComment = {
          commentBody: req.body.body,
          commentUser: req.user.id,
          commentUserHandle: req.user.handle
        };
        quote.comments.unshift(newComment);
        quote.save().then(quote =>
          Thought.findById(req.params.id)
            .populate("user", ["handle"])
            .then(quote => res.json(quote))
            .catch(err => {
              res.status(404).json({ noquotefound: "Thought not found" });
            })
        );
      })
      .catch(err =>
        res.status(404).json({ noquotefound: "Thought not found" })
      );
  }
);

router.delete(
  "/comment/:id/:commentid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Thought.findById(req.params.id)
      .then(quote => {
        if (
          quote.comments.filter(
            comment => comment._id.toString() === req.params.commentid
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        const removeIndex = quote.comments
          .map(item => item._id.toString())
          .indexOf(req.params.commentid);
        quote.comments.splice(removeIndex, 1);
        quote.save().then(quote =>
          Thought.findById(req.params.id)
            .populate("user", ["handle"])
            .then(quote => res.json(quote))
            .catch(err => {
              res.status(404).json({ noquotefound: "Thought not found" });
            })
        );
      })
      .catch(err =>
        res.status(404).json({ noquotefound: "Thought not found" })
      );
  }
);

module.exports = router;
