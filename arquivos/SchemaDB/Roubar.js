const { Schema, model }= require("mongoose");

const CreateRoubo = new Schema({
   Time: Number,
   User: String
}); 

module.exports = model("Roubar", CreateRoubo);