const express = require('express');
const router = express.Router();

const Film = require('../models/film');
const Analysis = require('../models/analysis');

router.get('/', async function(req, res, next) {
  let films = await Film.all();
  res.render('films/index', { title: 'The Film Catalog || Films', films: films });
});

router.get('/form', async (req, res, next) => {
  res.render('films/form', { title: 'The Film Catalog || Films' });
});

router.post('/upsert', async function(req, res, next) {
  console.log('body: ' + JSON.stringify(req.body));
  await Film.upsert(req.body);
  let createdOrUpdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `the film has been ${createdOrUpdated}!`,
  };
  res.redirect(303, '/films');
});

router.get('/edit', async function(req, res, next) {
  let filmId = req.query.id;
  let film = await Film.get(filmId);
  res.render('films/form', { title: 'The Film Catalog || Films', film: film });
});

router.get('/show/:id', async (req, res, next) => {
  let film = await Film.get(req.params.id);
  var templateVars = {
    title: 'The Film Catalog || Films',
    film: film,
    analyses: await Analysis.allForFilm(film),
    currentUser: req.session.currentUser
  }
  res.render('films/show', templateVars);
});

module.exports = router;