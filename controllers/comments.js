const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = function(app) {
// CREATE Comment
app.post("/post/:postId/comment/create", (req, res) => {
    // INSTANTIATE INSTANCE OF MODEL
    const comment = new Comment(req.body);
  
    // SAVE INSTANCE OF POST MODEL TO DB
    comment
      .save()
      .then(comment => {
        return Post.findById(req.params.postId);
      })
      .then(post => {
        post.comments.unshift(comment);
        return post.save();
      })
      .then(post => {
        res.redirect(`/`);
      })
      .catch(err => {
        console.log(err);
      });
  });
};