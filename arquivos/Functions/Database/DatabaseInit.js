const Mongoose = require("mongoose")

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.mongoConnection = Mongoose.connect(
            'mongodb+srv://rootuser:Gulox00101_@cluster0.tawpplt.mongodb.net/?retryWrites=true&w=majority'
        ).then((err) => {
            if (!err) return console.log(err)
            console.log("Database Funcionando!")
        }).catch((err) => console.log(err))
        Mongoose.set("strictQuery", false)
    }
}

module.exports = new Database()