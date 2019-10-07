const Joi = require('joi');
const morgan = require('morgan');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// access to public folder
app.use(express.static('public'));
app.use(logger);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...');
}

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' },
];

app.get('/', (req, res) => {
  res.send('hello world');
})

app.get('/api/courses', (req, res) => {
  res.send(courses);
})

// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id == parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the fiven ID was not found');
  res.send(course);
})

app.get('/api/posts/:year/:month', (req, res) => {
  res.send(req.query);
})

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id == parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the fiven ID was not found');

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
const course = courses.find(c => c.id == parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the fiven ID was not found');

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
})

const validateCourse = (course) => {
  const schema = {
    name: Joi.string().min(3).required(),
  }

  return Joi.validate(course, schema);
}

// PORT
// const port = process.env.PORT || 3000
const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = {
  app
};
