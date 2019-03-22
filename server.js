var express = require("express");
var app = express();
var mongojs = require('mongojs');
var mongoose = require("mongoose");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var router = express.Router();

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var databaseUrl = "IGN";
var collections = ["reviews","comments"];
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// var db = mongojs(databaseUrl, collections);
var db = require("./models");

db.Archive.create({ name: "IGN Reviews" })
  .then(function(dbArchive) {
    // If saved successfully, print the new Library document to the console
    console.log(dbArchive);
  })
  .catch(function(err) {
    // If an error occurs, print it to the console
    console.log(err.message);
  });

// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

var results = [];
var axios = require('axios');
var cheerio = require('cheerio');
axios.get("https://www.ign.com/reviews/games").then(function
(response) {
    var $ = cheerio.load(response.data);
    $('article').each(function(i, element) {
        var title = $(element).find('h3').text();
        var score = $(element).find('.hexagon').text();
        var link = $(element).find('.anchor').attr('href');
        results.push({
            title: title,
            score: score,
            link: link
        });
    })
});

app.get("/", function(req,res){
    res.render("index", {
        articles: results
    });
});

app.get("/saved", function(req,res){
    db.Archive.find({})
        .populate("reviews")
        .then(function(dbArchive) {
            res.render("partials/saved", {
                archive: dbArchive
            });
        })
        .catch(function(err) {
            res.json(err);
        });
    
});

app.post("/submit", function(req,res) {
    db.Review.create(req.body)
        .then(function(result) {
            return db.Archive.findOneAndUpdate(
                {}, 
                { $push: {reviews: result._id } }, 
                { new: true });
        })
});

app.post("/comment", function(req,res) {
    db.Comment.create(req.body)
        .then(function(result) {
            console.log(result);
            return db.Review.findOneAndUpdate(
                { title : req.body.article}, 
                { $push: {comments: result.text} } 
            );
        })
});

app.delete("/delete", function(req,res){
    console.log(req.body);
    db.Comment.remove(
        {text: req.body.text},
        function(error, removed) {
            if (error) {
                console.log(error);
                // res.send(error);
            } else {
                console.log(removed);
                // res.send(removed);
            }
        }
    );
    db.Review.update(
        { _id: req.body.articleID },
        { $pull: {comments: req.body.text }},
        function(error, removed) {
            if (error) {
                console.log(error);
                // res.send(error);
            } else {
                console.log(removed);
                // res.send(removed);
            }
        }
    )
});

const port = 4000;
app.listen(port, function() {
  console.log("App running on port " + port);
});