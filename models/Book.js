const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "public"
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  genre: {
    type: [String]
  },
  bookdesc: {
    type: String,
    required: true
  },
  chapters: [
    {
      title: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      },
      comments: [
        {
          commentBody: {
            type: String,
            required: true
          },
          commentDate: {
            type: Date,
            default: Date.now()
          },
          commentUser: {
            type: Schema.Types.ObjectId,
            ref: "users"
          }
        }
      ],
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  characters: [
    {
      name: {
        type: String,
        required: true
      },
      profession: {
        type: String
      },
      height: {
        type: String
      },
      weight: {
        type: String
      },
      look: {
        type: String
      },
      behaviour: {
        type: String
      },
      about: {
        type: String
      },
      quotes: [
        {
          quote: {
            type: String,
            required: true
          }
        }
      ]
    }
  ],
  storyline: [
    {
      plotline: {
        type: String,
        required: true
      }
    }
  ],
  chapterdescription: [
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  comments: [
    {
      commentBody: {
        type: String,
        required: true
      },
      commentDate: {
        type: Date,
        default: Date.now()
      },
      commentUserHandle: {
        type: String,
        required: true
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Book = mongoose.model("book", BookSchema);
