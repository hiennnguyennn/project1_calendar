const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');
const route = require('./routes');
const db = require('./config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.set('views', path.join(__dirname, 'resource\\views'));
app.set('view engine', 'ejs');
require('dotenv').config({ path: 'src/.env' });
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
db.connect();

route(app);

app.use(express.json());
app.use(cookieParser());
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LogRocket Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: [
    `${__dirname}/routes/site.js`,
    `${__dirname}/routes/user.js`,
    `${__dirname}/routes/event.js`,
  ],
};
const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
// app.get('/', (req, res) => {
//   res.render('login');
// });
app.listen(process.env.PORT, () => {
  console.log('server listen on port ' + process.env.PORT + '!');
});
