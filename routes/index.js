var express = require('express');
var data = require('../service/data');
var router = express.Router();

//home page
router.get('/', function(req, res, next) {
    data.getRecent(function(err, docs){
        console.log(docs.length);
        if(err){
            res.render('index', { recent: [] });
        }
        else{
            res.render('index', { recent: docs });
        }
    })
});

//display screenshots
router.get('/screenshot/:id', function(req, res, next){
    if(!req.params.id){ res.redirect('/'); }
    data.get(req.params.id, function(err, result){
        res.render('screenshots', { data: result });
    })
});

module.exports = router;
