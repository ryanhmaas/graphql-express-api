const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const routes = require('./routes/routes');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(routes);

const isDev = process.env.NODE_ENV === 'production' ? false : true;
const port = process.env.EXPRESS_PORT || 3000;
const routePrefix = '/api/v2';

if (isDev) {
  dotenv.load();
  app.use(cors());
  mongoose.set('debug', true);
}

let version;
try {
  version = require('./app-version');
} catch(err) {
  version = '0.0.0';
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: isDev,
}));

let title = 'User Interaction Tracking API';
const specOptions = {
  definition: {
    info: {
      title: title,
      description: "GraphQL API to save and expose user agent and ip address data about page visitors to kellenschmidt.com",
      version: version,
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html"
      },
    },
  },
  apis: ['./routes/routes.js'],
};
const swaggerSpec = swaggerJSDoc(specOptions);
const uiOptions = {}
app.use('', swaggerUi.serve, swaggerUi.setup(swaggerSpec, uiOptions));

mongoose.connect(`mongodb://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${encodeURIComponent(process.env.MONGO_HOST)}:27017/${encodeURIComponent(process.env.MONGO_DATABASE)}?authSource=${encodeURIComponent(process.env.MONGO_AUTHDB)}&w=1`, { useNewUrlParser: true }).then(
  () => { console.log("Connected to MongoDB") },
  (err) => {
    console.log(err);
    console.log(`Connection string: mongodb://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${encodeURIComponent(process.env.MONGO_HOST)}:27017/${encodeURIComponent(process.env.MONGO_DATABASE)}?authSource=${encodeURIComponent(process.env.MONGO_AUTHDB)}&w=1`);
  }
);

app.listen(port, () => console.log(`${title} listening on port ${port}!`));
