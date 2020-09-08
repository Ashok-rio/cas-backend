const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  poster: { 
      type: mongoose.Types.ObjectId, 
      ref: "User" 
    },
  postText: {
      type:String,
  },
  savePost:{
    type:Boolean,
    default:false
  },
  publicPost:{
      type:Boolean,
      default:false
  },
  url:{
      type:String,
  },
  link:{
      type:Boolean,
      default:false
  },
  linkUrl:{
      type:String
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
