const router = require('express').Router();

router.get('/catalog',async(req,res)=>{
    res.status(302).render('books/catalog');
});

module.exports = router;