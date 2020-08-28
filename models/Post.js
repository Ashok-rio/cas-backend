const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  poster: { type: mongoose.Types.ObjectId, ref: "User" },
  postText: {
      type:String,
  },
  postMediaUrl:{
      type:String,
  },
  postTime:{
      type:Date,
      default:new Date()
  },
  mediaType:{
      type:String,
      enum:['image','video']
  }
});

module.exports = new mongoose.model('Post', PostSchema);
