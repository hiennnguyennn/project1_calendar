const siteRouter = require('./site');
const userRouter = require('./user');
const eventRouter = require('./event');

const auth = require('../app/middleware/auth');

function route(app) {
  app.use('/user', auth.requireAuth, userRouter);
  app.use('/events', auth.requireAuth, eventRouter);
  app.use('/', siteRouter);
}
module.exports = route;
