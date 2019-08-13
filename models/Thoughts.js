const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThoughtSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
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

module.exports = Thought = mongoose.model("quotes", ThoughtSchema);
