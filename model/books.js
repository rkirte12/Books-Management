const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    username:{
        type : String,
        required : true,
        trim : true
    },
    role : {
        type : String,
        trim : true
    },
    roleTypeId : {
        type : Number
    },
    email : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        min : 5
    },
    booksType : {
        type : String,
        required : true,
        trim : true
    },
    bookTypeId : {
        type : String,
        trim : true
    },
    bookName : {
        type: String,
        trim : true
    }
});

module.exports = mongoose.model("books", bookSchema)
