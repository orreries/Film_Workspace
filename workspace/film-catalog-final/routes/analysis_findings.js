const express = require('express');
const router = express.Router();

const AnalysisFinding = require('../models/analysis_finding');

router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body));
  await AnalysisFinding.upsert(req.body);
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: 'The finding has been saved!',
  };
  res.redirect(303, `/analyses/show/${req.body.analysisId}`);
});

module.exports = router;