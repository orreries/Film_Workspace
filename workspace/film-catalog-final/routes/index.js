const express = require("express");

const router = express.Router();

router.get('/', (_req, res) => {
  res.render('index', {title: "The Film Catalog"})
});

router.get('/about_us', (_req, res) => {
  res.render('about_us', {title: "The Film Catalog"})
});

module.exports = router;