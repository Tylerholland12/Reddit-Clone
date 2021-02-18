const Post = require('../models/post');

module.exports = app => {
    // CREATE
    app.get('/post/create', (req, res) => {
        res.render('post-create')
    })

    app.post("/post/create", (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    const post = new Post(req.body);
    // SAVE INSTANCE OF POST MODEL TO DB
    post
    .save((err, post) => {
      // REDIRECT TO THE ROOT
      return res.redirect(`/`);
      })
    });

    app.get("/post/all", (req, res) => {
        Post.find({}).lean()
        .then(posts => {
          res.render('post-all', { posts });
        })
        .catch(err => {
          console.log(err.message);
        })
    })

    app.get("/post/:id", (req, res) => {
        // LOOK UP THE POST
        Post
        .findById(req.params.id)
        .lean()
        .populate('comments')
        .then(post => {
          res.render("post-show", { post });
        })
        .catch(err => {
          console.log(err.message);
        });
      });
    
      app.get("/n/:subreddit", (req, res) => {
        Post
        .find({ subreddit: req.params.subreddit })
        .lean()
        .then(posts => {
          res.render("post-all", { posts });
        })
        .catch(err => {
          console.log(err);
        });
      });
  };