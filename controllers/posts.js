const Post = require('../models/post');
const User = require('../models/user');

module.exports = app => {
    // CREATE
    app.get('/post/create', (req, res) => {
        res.render('post-create')
    })

    app.post("/post/create", (req, res) => {
      if (req.user) {
        var post = new Post(req.body);
        post.author = req.user._id;
        post.upVotes = [];
        post.downVotes = [];
        post.voteScore = 0;
    
        post
        .save()
        .then(post => {
          return User.findById(req.user._id);
        })
        .then(user => {
          user.posts.unshift(post);
          user.save();
          // REDIRECT TO THE NEW POST
          res.redirect(`/post/${post._id}`);
        })
        .catch(err => {
          console.log(err.message);
        });
      } else {
        res.status(401).send({'401': 'Not authorised'})
      }
    });

    app.get("/post/all", (req, res) => {
        var currentUser = req.user;
        console.log(req.cookies);
        Post.find({}).lean().populate('author')
        .then(posts => {
          res.render('post-all', { posts, currentUser });
        })
        .catch(err => {
          console.log(err.message);
        })
    })

    app.get("/post/:id", (req, res) => {
        var currentUser = req.user;
        // LOOK UP THE POST
        Post
        .findById(req.params.id)
        .populate('comments')
        .lean()
        .then(post => {
          res.render("post-show", { post, currentUser});
        })
        .catch(err => {
          console.log(err.message);
        });
      });
    
      app.get("/n/:subreddit", (req, res) => {
        var currentUser = req.user;
        Post
        .find({ subreddit: req.params.subreddit })
        .lean()
        .then(posts => {
          res.render("post-all", { posts, currentUser });
        })
        .catch(err => {
          console.log(err);
        });
      });
    
      app.put("/post/:id/vote-up", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
          post.upVotes.push(req.user._id);
          post.voteScore = post.voteScore + 1;
          post.save();
      
          res.status(200).send({'yay': 'It worked'});
        });
      });
      
      app.put("/post/:id/vote-down", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
          post.downVotes.push(req.user._id);
          post.voteScore = post.voteScore - 1;
          post.save();
      
          res.status(200).send({'yay': 'It worked'});
        });
      });
      
      app.get("/post/:id/vote-count", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
      
          res.status(200).send({'count': post.voteScore});
        });
      });
  };