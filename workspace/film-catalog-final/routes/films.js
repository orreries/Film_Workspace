const express = require('express');

const  Film = require('../models/film');

const router = express.Router();

router.get('/', async function(req, res, next) {
  let films = await Film.all();
  res.render('films/index', { title: 'The Film Catalog || Films', films: films });
});

router.get('/form', function(req, res, next) {
  res.render('films/form', { title: 'The Film Catalog || Films' });
});

router.post('/upsert', async function(req, res, next) {
  console.log(JSON.stringify(req.body));
  await Film.upsert(req.body);
  let createdOrupdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `the film has been ${createdOrupdated}!`,
  };
  res.redirect(303, "/films");
});

router.get('/edit', async function(req, res, next) {
  let filmId = req.query.id
  let film = await Film.get(filmId);
  res.render('films/form', { title: 'The Film Catalog || Films', film: film });
});

module.exports = router;

