const { getAllBooks } = require('../managers/bookManager');
const { getUserById } = require('../managers/userManager');
const { mustBeAuth } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.get(['/','/index'],(req,res)=>{
    res.status(302).render('home');
});

router.get('/profile',mustBeAuth,async(req,res)=>{
    try{
        const loggedUser = req.user._id;
        const user = await getUserById(loggedUser).lean();

        const books = await getAllBooks().lean();
        const myBooks = books.filter(b =>b.wishingList.toString().includes(loggedUser));
        const hasWishedBooks = myBooks.length>0 
        res.status(302).render('profile',{user,hasWishedBooks,myBooks});
    }catch(err){
        console.log(err);
        res.status(404).render('404');
    }
});

module.exports = router;