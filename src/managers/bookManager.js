const Book = require("../models/Book");

const pattern = /^https?:\/\//;

function getAllBooks(){
    return Book.find();
}

function createBook(title,author,genre,stars,image,bookReview,owner){
    if(!pattern.test(image)){
        throw new Error('The URL for the image is invalid!');
    }

    const book = {
        title,
        author,
        genre,
        stars,
        image,
        bookReview,
        owner
    };

    return Book.create(book);
}

module.exports = {
    getAllBooks,
    createBook
}