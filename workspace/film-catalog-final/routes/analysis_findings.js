const express = require('express');
const router = express.Router();

const AnalysisFinding = require('../models/analysis_finding');

router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body))
  let filmId = req.body.filmId;
  let redirect = `/films/show/${filmId}`;
  await AnalysisFinding.upsert(req.body);
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: 'Your finding has been stored',
  };
  res.redirect(303, redirect)
});

module.exports = router;