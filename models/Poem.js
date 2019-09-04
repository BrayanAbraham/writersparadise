const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PoemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true
  },
  body: {
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
  image: {
    type: String,
    default: "noimage"
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

module.exports = Poem = mongoose.model("poem", PoemSchema);
