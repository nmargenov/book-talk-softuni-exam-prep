const { getAllBooks, createBook } = require('../managers/bookManager');
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

module.exports = router;