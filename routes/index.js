var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'CoderDojo Ballon Express' });
  res.redirect('/dashboard');
});

module.exports = router;