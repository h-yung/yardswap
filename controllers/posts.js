const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { postLogin } = require("./auth");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean(); //only return useful parts. faster response
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const author = await User.findById(post.user);

      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc" }).lean();

      //prob not the most efficient approach
      //essentially tacking on the username outside the db
      for (const comment of comments){
        const writer = await User.findById(comment.user);
        comment.writer = writer.userName;
        console.log(writer.userName)
      }

      console.log(comments)
    
      //if req.user has liked this post, return a mark
      const likedByViewer = post.usersWhoLiked.includes(req.user.id)
      //returns a boolean

      res.render("post.ejs", { 
        post: post, 
        author: author,
        user: req.user, 
        likedByViewer,
        comments: comments 
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      //check if userid is in the array for that post, = already liked it
      let chosenPost = await Post.findOne(
        {_id: req.params.id, usersWhoLiked: req.user.id });
      if (chosenPost){
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pullAll: { 'usersWhoLiked': [req.user.id] } 
          }
        );
        console.log("Likes-1 and user from array");
        
      } else {
        await Post.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $addToSet: { 'usersWhoLiked': req.user.id } 
          }
        );
        console.log("Likes +1");
      }
      res.redirect(`/post/${req.params.id}`);

    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id - the following checks that it exists
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
