const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required!"],
        minLength:[2,'Title must be atleast 2 characters long!']
    },
    author:{
        type:String,
        required:[true,"Author is required!"],
        minLength:[5,'Author must be atleast 5 characters long!']
    },
    image:{
        type:String,
        required:[true,'Image is required!'],
    },
    bookReview:{
        type:String,
        required:[true,"Book Review is required!"],
        minLength:[10,'Book Review must be atleast 10 characters long!']
    },
    genre:{
        type:String,
        required:[true,"Genre is required!"],
        minLength:[3,'Genre must be atleast 3 characters long!']
    },
    stars:{
        type:Number,
        required:[true,"Stars are required"],
        min:[1,'Stars must be between 1 and 5'],
        max:[5,'Stars must be between 1 and 5'],
    },
    wishingList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Book = mongoose.model('Book',bookSchema);

module.exports = Book;