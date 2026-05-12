const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

// modeled after the users router but since there is only one admin (no registration) and no profile
// only the login/logout are necessary
// the admin registration is handled by adding it directly into the db once using a one-off query to save it

router.get('/login', async (req, res, next) => {
  res.render('admin/login', { title: 'The Film Catalog || Login' });
});

router.post('/login', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  let admin = await Admin.login(req.body);
  if (admin) {
    req.session.currentUser = admin;
    req.session.flash = {
      type: 'info',
      intro: 'Success!',
      message: `Welcome back, ${admin.name}!`,
    };
    res.redirect(303, '/films');
  } else {
    res.render('admin/login', {
      title: 'The Film Catalog || Login',
      flash: {
        type: 'danger',
        intro: 'Error!',
        message: 'Wrong email and password combination or the user could not be found',
      }
    });
  }
});

router.post('/logout', async (req, res, next) => {
  delete req.session.currentUser;
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: 'You are now logged out',
  };
  res.redirect(303, '/');
});

module.exports = router;