var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;


var ArchiveSchema = new Schema({
  // `name` must be of type String
  // `name` must be unique, the default mongoose error message is thrown if a duplicate value is given
  name: {
    type: String,
    unique: true
  },
 
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

var Archive = mongoose.model("Archive", ArchiveSchema);

// Export the Archive model
module.exports = Archive;
