//framework imports
const express = require('express');
const bodyParser = require('body-parser');
const { credentials } = require('./config');
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const csrf = require('csurf')

// application imports
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const filmsRouter = require('./routes/films');
const analysesRouter = require('./routes/analyses');
const termsRouter = require('./routes/terms');

//framework setup
const app = express();
const port = 3000;

var handlebars = require('express-handlebars').create({
  helpers: {
    eq: (v1, v2) => v1 == v2,
    ne: (v1, v2) => v1 != v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    someId: (arr, id) => arr && arr.some(obj => obj.id == id),
    in: (arr, obj) => arr && arr.some(val => val == obj),
    dateStr: (v) => v && v.toLocaleDateString("en-US")
  }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(credentials.cookieSecret));
app.use(expressSession({
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(csrf({ cookie: true }))
app.use((req, res, next) => {
  res.locals._csrfToken = req.csrfToken()
  next();
})

// session configuration
//make it possible to use flash messages, and pass them to the view
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
})

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
})

//application setup
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/films', filmsRouter);
app.use('/analyses', analysesRouter);
app.use('/terms', termsRouter);

app.use((_req, res) => {
  res.status(404);
  res.send("<h1>404 - please go away, i am not home!</h1>");
});

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(500);
  res.send("<h1>500 - Aaaahrg, why did you do this to me!</h1>");
})




app.listen(port, () => console.log(
`Express started on http://localhost:${port}
press Ctrl-C to terminate.`));