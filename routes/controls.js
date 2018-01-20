var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

/* GET home page. */
router.get('/', function(req, res) {
    res.render('controls', {title: "Controls"});
});

module.exports = router;