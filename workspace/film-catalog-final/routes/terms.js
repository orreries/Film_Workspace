const express = require('express');
const router = express.Router();
const Term = require('../models/term');

// ** help from claude creating this admin check**
// adding admin requirement check to make sure this is only viewable to the admin
// so if the current user is not the admin, go to the admin login
// if the current user is the admin continue to the term page
const requireAdmin = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/admin/login');
  } else {
    next();
  }
}

// requireAdmin redirects anyone who isn't logged in away from the terms routes 
router.get('/', requireAdmin, async function(req, res, next) {
  const terms = await Term.all();
  res.render('terms/index', { title: 'The Film Catalog || Terms', terms: terms });
});

router.get('/form', requireAdmin, async (req, res, next) => {
  res.render('terms/form', {title: 'The Film Catalog || Terms'});
});

router.get('/edit', requireAdmin, async (req, res, next) => {
  let termId = req.query.id;
  let term = await Term.get(termId);
  res.render('terms/form', { title: 'The Film Catalog || Terms', term: term });
});

router.post('/upsert', requireAdmin, async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  await Term.upsert(req.body);
  let createdOrupdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `the term has been ${createdOrupdated}!`,
  };
  res.redirect(303, '/terms');
});

module.exports = router;