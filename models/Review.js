var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new LibrarySchema object
// This is similar to a Sequelize model
var ReviewSchema = new Schema({
  // `title` must be of type String
  title: String,
  score: Number,
  link: String,
  comments: [
    {
      type: String,
    //   type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Review = mongoose.model("Review", ReviewSchema);

// Export the Review model
module.exports = Review;
