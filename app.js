//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "I'm a simple blog site " + String.fromCodePoint(0x1F601) + " Under the hood runs Node.js and MongoDB. Feel free to visit /compose to add a post.";
const aboutContent = "World's greatest blog site";
const contactContent = "nope@nope.at";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connection MongoDB Database
mongoose.connect(process.env.MONGODB_URI);

// Local DB for dev
// mongoose.connect("mongodb://localhost:27017/blog-v2");

// Creating MongoDB Schema
const blogPostSchema = new mongoose.Schema({
  date: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

//Creating MongoDB model
const blogPost = mongoose.model("Post", blogPostSchema);

//Routing
// - Home
app.get("/", (req, res) => {
  const allPosts = blogPost.find();
  allPosts.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    }
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts
    });
  });
});

// - About
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

// - Contact
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

// - Compose
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const post = new blogPost({
    date: new Date().toDateString(),
    title: req.body.postTitle,
    body: req.body.postBody
  });
  post.save();

  res.redirect("/");
});

// - Blog article
app.get("/posts/:postID", (req, res) => {
  
  blogPost.find({_id : req.params.postID}, (err, post) => {
    res.render("post", {ele : post[0]})
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("Server has started successfully!");
});
