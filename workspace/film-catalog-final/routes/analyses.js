const express = require('express');
const router = express.Router();

const Analysis = require('../models/analysis');
const AnalysisFinding = require('../models/analysis_finding');
const Term = require('../models/term');
const Film = require('../models/film')

router.get('/', async function(req, res, next) {
  let analyses = await Analysis.all();
  res.render('analyses/index', { title: 'The Film Catalog || Analyses', analyses: analyses });
});

router.get('/form', async (req, res, next) => {
  let terms = await Term.all();
  res.render('analyses/form', { title: 'The Film Catalog || Analyses', terms: terms, films: await Film.all() });
});

router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  await Analysis.upsert(req.body);
  let createdOrUpdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `the analysis has been ${createdOrUpdated}!`,
  };
  res.redirect(303, '/analyses');
});

router.get('/edit', async (req, res, next) => {
  let analysisId = req.query.id;
  let analysis = await Analysis.get(analysisId);
  analysis.findingIds = (await AnalysisFinding.allForAnalysis(analysis)).map(finding => finding.id);
  let terms = await Term.all();
  res.render('analyses/form', {
    title: 'The Film Catalog || Analyses',
    analysis: analysis,
    terms: terms,
    films: await Film.all()
  });
});

router.get('/show/:id', async (req, res, next) => {
  let analysis = await Analysis.get(req.params.id);
  var templateVars = {
    title: 'The Film Catalog || Analyses',
    analysis: analysis,
    findings: await AnalysisFinding.allForAnalysis(analysis)
  }
  console.log('findings:', JSON.stringify(templateVars.findings));
  res.render('analyses/show', templateVars);
});

module.exports = router;