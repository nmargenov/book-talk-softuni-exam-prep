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

function getBookById(bookId){
    return Book.findById(bookId);
}

function wishToRead(bookId,userId){
    return Book.findByIdAndUpdate(bookId,{$push:{wishingList:userId}});
}

function checkIfCurrentUserHasWishedTheBook(book,userId){
    return book.wishingList.map(b=>b.toString()).includes(userId);
}

module.exports = {
    getAllBooks,
    createBook,
    getBookById,
    wishToRead,
    checkIfCurrentUserHasWishedTheBook,
}