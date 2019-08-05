const express = require("express");
const passport = require("passport");

const User = require("../../models/User");
const Book = require("../../models/Book");

const validateBookInput = require("../../validation/book");
const validateChapterInput = require("../../validation/chapter");
const validateCharacterInput = require("../../validation/character");
const validatePlotlineInput = require("../../validation/plotline");
const validateCommentInput = require("../../validation/comment");
const validateChapterdescInput = require("../../validation/chapterdesc");

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "Book Works" }));

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateBookInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    genre = req.body.genre.split(",");
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    const newBook = new Book({
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      genre: genre,
      image: "noimage",
      bookdesc: req.body.bookdesc,
      user: req.user.id
    });

    newBook.save().then(book => res.json(book));
  }
);

router.post(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateBookInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    genre = req.body.genre.split(",");
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    Book.findOne({ _id: req.params.id }).then(book => {
      if (book) {
        Book.updateOne(
          { _id: req.params.id },
          {
            $set: {
              title: req.body.title,
              status: req.body.status,
              allowComments: allowComments,
              genre: genre,
              bookdesc: req.body.bookdesc,
              user: req.user.id
            }
          }
        )
          .then(book =>
            Book.findById(req.params.id)
              .populate("user", ["handle"])
              .then(book => res.json(book))
              .catch(err => {
                res.status(404).json({ nobookfound: "Book not found" });
              })
          )
          .catch(err => {
            res.status(404).json({ nobookfound: "Book not found" });
          });
      } else {
        res.status(404).json({ nobookfound: "Book not found" });
      }
    });
  }
);

router.get("/", (req, res) => {
  Book.find({ status: "Public" })
    .sort({ date: -1 })
    .populate("user", ["handle"])
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
});

router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("user", ["handle"])
    .then(book => res.json(book))
    .catch(err => {
      res.status(404).json({ nobookfound: "Book not found" });
    });
});

router.get("/user/:user", (req, res) => {
  Book.find({ user: req.params.user })
    .populate("user", ["handle"])
    .then(book => res.json(book))
    .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
});

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Book.findById(req.params.id)
        .then(book => {
          if (book.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User Not Authorized" });
          }
          book.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
    });
  }
);

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Book.findById(req.params.id)
        .then(book => {
          if (
            book.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked the book" });
          }
          book.likes.unshift({ user: req.user.id });
          book.save().then(book => res.json(book));
        })
        .catch(err => {
          res.status(404).json({ nobookfound: "Book not found" });
        });
    });
  }
);

router.post(
  "/dislike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(user => {
      Book.findById(req.params.id)
        .then(book => {
          if (
            book.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "user has not yet liked the book" });
          }
          const removeIndex = book.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          book.likes.splice(removeIndex, 1);
          book.save().then(book => res.json(book));
        })
        .catch(err => {
          res.status(404).json({ nobookfound: "Book not found" });
        });
    });
  }
);

router.post(
  "/chapter/:bookid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChapterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const newChapter = {
          title: req.body.title,
          body: req.body.body
        };
        book.chapters.unshift(newChapter);
        book.save().then(book => res.json(book));
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.post(
  "/chapter/edit/:bookid/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChapterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const chapterIndex = book.chapters
          .map(item => item._id.toString())
          .indexOf(req.params.id);
        if (chapterIndex !== -1) {
          const chapter = book.chapters[chapterIndex];
          chapter.title = req.body.title;
          chapter.body = req.body.body;
          book.chapters[chapterIndex] = chapter;
          book.save().then(book =>
            Book.findById(req.params.bookid)
              .populate("user", ["handle"])
              .then(book => res.json(book))
              .catch(err => {
                res.status(404).json({ nobookfound: "Book not found" });
              })
          );
        } else {
          res.status(404).json({ nochapterfound: "Chapter not found" });
        }
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.delete(
  "/chapter/:bookid/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Book.findById(req.params.bookid)
      .then(book => {
        const chapterIndex = book.chapters
          .map(item => item._id.toString())
          .indexOf(req.params.id);
        if (chapterIndex !== -1) {
          book.chapters.splice(chapterIndex, 1);
          book.save().then(book =>
            Book.findById(req.params.bookid)
              .populate("user", ["handle"])
              .then(book => res.json(book))
              .catch(err => {
                res.status(404).json({ nobookfound: "Book not found" });
              })
          );
        } else {
          res.status(404).json({ nochapterfound: "Chapter not found" });
        }
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.post(
  "/character/:bookid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCharacterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const newCharacter = {
          name: req.body.name,
          profession: req.body.profession,
          height: req.body.height,
          weight: req.body.weight,
          look: req.body.look,
          behaviour: req.body.behaviour,
          about: req.body.about
        };
        book.characters.unshift(newCharacter);
        book.save().then(book => res.json(book));
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.delete(
  "/character/:bookid/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Book.findById(req.params.bookid)
      .then(book => {
        const characterIndex = book.characters
          .map(item => item._id.toString())
          .indexOf(req.params.id);
        if (characterIndex !== -1) {
          book.characters.splice(characterIndex, 1);
          book.save().then(book =>
            Book.findById(req.params.bookid)
              .populate("user", ["handle"])
              .then(book => res.json(book))
              .catch(err => {
                res.status(404).json({ nobookfound: "Book not found" });
              })
          );
        } else {
          res.status(404).json({ nocharacterfound: "character not found" });
        }
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.post(
  "/storyline/:bookid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePlotlineInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const newStoryline = {
          plotline: req.body.plotline
        };
        book.storyline.unshift(newStoryline);
        book.save().then(book => res.json(book));
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.post(
  "/storyline/edit/:bookid/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePlotlineInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const plotlineIndex = book.storyline
          .map(item => item._id.toString())
          .indexOf(req.params.id);
        if (plotlineIndex !== -1) {
          const storyline = book.storyline[plotlineIndex];
          storyline.plotline = req.body.plotline;
          book.save().then(book =>
            Book.findById(req.params.bookid)
              .populate("user", ["handle"])
              .then(book => res.json(book))
              .catch(err => {
                res.status(404).json({ nobookfound: "Book not found" });
              })
          );
        } else {
          res.status(404).json({ noplotlinefound: "plotline not found" });
        }
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.delete(
  "/storyline/:bookid/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Book.findById(req.params.bookid)
      .then(book => {
        const plotlineIndex = book.storyline
          .map(item => item._id.toString())
          .indexOf(req.params.id);
        if (plotlineIndex !== -1) {
          book.storyline.splice(plotlineIndex, 1);
          book.save().then(book => res.json(book));
        } else {
          res.status(404).json({ noplotlinefound: "plotline not found" });
        }
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
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
    Book.findById(req.params.id)
      .then(book => {
        const newComment = {
          commentBody: req.body.body,
          commentUser: req.user.id
        };
        book.comments.unshift(newComment);
        book.save().then(book => res.json(book));
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.delete(
  "/comment/:id/:commentid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Book.findById(req.params.id)
      .then(book => {
        if (
          book.comments.filter(
            comment => comment._id.toString() === req.params.commentid
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        const removeIndex = book.comments
          .map(item => item._id.toString())
          .indexOf(req.params.commentid);
        book.comments.splice(removeIndex, 1);
        book.save().then(book => res.json(book));
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.post(
  "/chapter/comment/:id/:chapterid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.id)
      .then(book => {
        const chapterIndex = book.chapters
          .map(item => item._id.toString())
          .indexOf(req.params.chapterid);
        if (chapterIndex !== -1) {
          const newComment = {
            commentBody: req.body.body,
            commentUser: req.user.id
          };
          book.chapters[chapterIndex].comments.unshift(newComment);
          book.save().then(book => res.json(book));
        } else {
          res.status(404).json({ nochapterfound: "Chapter not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ nobookfound: "Book not found" });
      });
  }
);

router.delete(
  "/chapter/comment/:id/:chapterid/:commentid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Book.findById(req.params.id)
      .then(book => {
        const chapterIndex = book.chapters
          .map(item => item._id.toString())
          .indexOf(req.params.chapterid);
        if (chapterIndex !== -1) {
          if (
            book.chapters[chapterIndex].comments.filter(
              comment => comment._id.toString() === req.params.commentid
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentnotexists: "Comment does not exist" });
          }
          const removeIndex = book.chapters[chapterIndex].comments
            .map(item => item._id.toString())
            .indexOf(req.params.commentid);
          book.chapters[chapterIndex].comments.splice(removeIndex, 1);
          book.save().then(book => res.json(book));
        } else {
          res.status(404).json({ nochapterfound: "Chapter not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ nobookfound: "Book not found" });
      });
  }
);

router.post(
  "/chapterdesc/:bookid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChapterdescInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const newChapterdesc = {
          title: req.body.title,
          description: req.body.description
        };
        book.chapterdescription.unshift(newChapterdesc);
        book.save().then(book => res.json(book));
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.post(
  "/chapterdesc/edit/:bookid/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChapterdescInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const chapterdescIndex = book.chapterdescription
          .map(item => item._id.toString())
          .indexOf(req.params.id);
        if (chapterdescIndex !== -1) {
          const chapter = book.chapterdescription[chapterdescIndex];
          chapter.title = req.body.title;
          chapter.description = req.body.description;
          book.chapterdescription[chapterdescIndex] = chapter;
          book.save().then(book =>
            Book.findById(req.params.bookid)
              .populate("user", ["handle"])
              .then(book => res.json(book))
              .catch(err => {
                res.status(404).json({ nobookfound: "Book not found" });
              })
          );
        } else {
          res.status(404).json({ nochapterfound: "Chapter not found" });
        }
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.delete(
  "/chapterdesc/:bookid/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Book.findById(req.params.bookid)
      .then(book => {
        const chapterdescIndex = book.chapterdescription
          .map(item => item._id.toString())
          .indexOf(req.params.id);
        if (chapterdescIndex !== -1) {
          book.chapterdescription.splice(chapterdescIndex, 1);
          book.save().then(book => res.json(book));
        } else {
          res.status(404).json({ nochapterfound: "Chapter not found" });
        }
      })
      .catch(err => res.status(404).json({ nobookfound: "Book not found" }));
  }
);

router.post(
  "/character/quote/:bookid/:characterid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateQuoteInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Book.findById(req.params.bookid)
      .then(book => {
        const charIndex = book.characters
          .map(item => item._id.toString())
          .indexOf(req.params.characterid);
        if (charIndex !== -1) {
          const newQuote = {
            quote: req.body.quote
          };
          book.characters[charIndex].quotes.unshift(newQuote);
          book.save().then(book => res.json(book));
        } else {
          res.status(404).json({ nocharacterfound: "character not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ nobookfound: "Book not found" });
      });
  }
);

router.delete(
  "/character/quote/:bookid/:characterid/:quoteid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Book.findById(req.params.id)
      .then(book => {
        const charIndex = book.characters
          .map(item => item._id.toString())
          .indexOf(req.params.characterid);
        if (charIndex !== -1) {
          if (
            book.characters[charIndex].quotes.filter(
              quote => quote._id.toString() === req.params.quoteid
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ quotenotexists: "quote does not exist" });
          }
          const removeIndex = book.characters[charIndex].quotes
            .map(item => item._id.toString())
            .indexOf(req.params.quoteid);
          book.characters[charIndex].quotes.splice(removeIndex, 1);
          book.save().then(book => res.json(book));
        } else {
          res.status(404).json({ nocharacterfound: "character not found" });
        }
      })
      .catch(err => {
        res.status(404).json({ nobookfound: "Book not found" });
      });
  }
);

module.exports = router;
