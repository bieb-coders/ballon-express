var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('graphs', { title: 'CoderDojo Ballon Express' });
});

module.exports = router;