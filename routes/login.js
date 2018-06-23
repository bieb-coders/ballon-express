var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/controls?login=failed' }),
  function(req, res) {
    res.redirect('/controls');
});

module.exports = router;