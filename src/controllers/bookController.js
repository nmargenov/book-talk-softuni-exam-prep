const { getAllBooks, createBook, getBookById, wishToRead, checkIfCurrentUserHasWishedTheBook, deleteBook, editBook } = require('../managers/bookManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelper');

const router = require('express').Router();

router.get('/catalog',async(req,res)=>{
    try{
        const books = await getAllBooks().lean();
        const hasBooks = books.length>0;
        res.status(302).render('books/catalog',{books,hasBooks});
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/createReview',mustBeAuth,(req,res)=>{
    res.status(302).render('books/create');
});

router.post('/createReview',mustBeAuth,async(req,res)=>{
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();
    const genre = req.body.genre?.trim();
    const stars = req.body.stars?.trim();
    const image = req.body.image?.trim();
    const bookReview = req.body.bookReview?.trim();

    const owner = req.user._id;

    try{
        await createBook(title,author,genre,stars,image,bookReview,owner);
        res.redirect('/books/catalog');
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('books/create',{error,title,author,genre,stars,image,bookReview});
    }
});

router.get('/:bookId/details',async(req,res)=>{
    try{
        const loggedUser = req.user?._id;
        const bookId = req.params.bookId;
        
        const book = await getBookById(bookId).lean();
        if(!book){
            throw new Error();
        }
        const isOwner = loggedUser && loggedUser == book.owner;
        const notOwner = !isOwner;
        const alreadyWished = notOwner && checkIfCurrentUserHasWishedTheBook(book,loggedUser);
        res.status(302).render('books/details',{book,loggedUser,isOwner,alreadyWished,notOwner});
    }catch(err){
        console.log(err);
        res.status(404).render('404');
    }
});

router.get('/:bookId/wish',mustBeAuth,async(req,res)=>{
    try{
        const bookId = req.params.bookId;
        const loggedUser = req.user._id;

        const book = await getBookById(bookId);
        if(!book || book.owner == loggedUser){
            throw new Error();
        }

        if(checkIfCurrentUserHasWishedTheBook(book,loggedUser)){
            throw new Error();
        }

        await wishToRead(bookId,loggedUser);
        res.redirect(`/books/${bookId}/details`);
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/:bookId/delete',mustBeAuth,async(req,res)=>{
    try{
        const bookId = req.params.bookId;
        const loggedUser = req.user._id;

        const book = await getBookById(bookId);
        if(!book || book.owner != loggedUser){
            throw new Error();
        }

        await deleteBook(bookId);

        res.redirect('/books/catalog');
    }catch(err){
        res.status(404).render('404');
    }
});

router.get('/:bookId/edit',mustBeAuth,async(req,res)=>{
    try{
        const bookId = req.params.bookId;
        const loggedUser = req.user._id;

        const book = await getBookById(bookId).lean();
        if(!book || book.owner != loggedUser){
            throw new Error();
        }

        res.status(302).render('books/edit',{book});        
    }catch(err){
        res.status(404).render('404');
    }
});

router.post('/:bookId/edit',mustBeAuth,async(req,res)=>{
    const title = req.body.title?.trim();
    const author = req.body.author?.trim();
    const genre = req.body.genre?.trim();
    const stars = req.body.stars?.trim();
    const image = req.body.image?.trim();
    const bookReview = req.body.bookReview?.trim();

    const book = {
        title,
        author,
        genre,
        stars,
        image,
        bookReview
    }

    try{
        const bookId = req.params.bookId;
        const loggedUser = req.user._id;

        const book = await getBookById(bookId).lean();
        if(!book || book.owner != loggedUser){
            throw new Error();
        }

        await editBook(bookId,title,author,genre,stars,image,bookReview);
        res.redirect(`/books/${book._id}/details`);
    }catch(err){
        const error = getErrorMessage(err);
        res.status(400).render('books/edit',{error,book});
    }
});
module.exports = router;