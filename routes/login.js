var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/', 
  passport.authenticate('local', { failureRedirect: '/controls?login=failed' }),
  function(req, res) {
    console.log(res);
    res.redirect('/controls', { user:res});
});

module.exports = router;