const { Schema, model }= require("mongoose");

const CreateUser = new Schema({
    name: String,
    telefone: String,
    vip: Boolean,
    money: Number,
    cash: Number,
    cargo: Number,
    TimeImagine: Number,
    TimeWork: Number
}); 

module.exports = model("User", CreateUser);