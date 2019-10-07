const debug = require('debug')('app:db');

const config = require('config');
const Joi = require('joi');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const homepage = require('./routes/homepage');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); //default

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// access to public folder
app.use(express.static('public'));
app.use(logger);
app.use('/api/courses', courses);
app.use('/', homepage);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

debug('Connected to the database...');

// PORT
// const port = process.env.PORT || 3000
const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = {
  app
};
