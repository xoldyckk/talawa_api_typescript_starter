import 'dotenv/config'; // pull env variables from .env file
import path from 'path';
import http from 'http';
import express from 'express';
import { ApolloServer, PubSub } from 'apollo-server-express';
import depthLimit from 'graphql-depth-limit';
import rateLimit from 'express-rate-limit';
// @ts-ignore
import xss from 'xss-clean';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import requestLogger from 'morgan';
import i18n from 'i18n';
import logger from '@talawa-api/logger';
import requestContext from '@talawa-api/request-context';
import requestTracing from '@talawa-api/request-tracing';

import isAuth from './middleware/is-auth';
import database from './db';
import config from './config';
import {
  AuthenticationDirective,
  RoleAuthorizationDirective,
} from './graphql/directives';
import { schema } from './graphql';

const app = express();

app.use(requestTracing.middleware());

const pubsub = new PubSub();

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

i18n.configure({
  directory: `${__dirname}/locales`,
  staticCatalog: {
    en: require('./locales/en.json'),
    hi: require('./locales/hi.json'),
    zh: require('./locales/zh.json'),
    sp: require('./locales/sp.json'),
    fr: require('./locales/fr.json'),
  },
  queryParameter: 'lang',
  defaultLocale: config.defaultLocale,
  locales: config.supportedLocales,
  autoReload: process.env.NODE_ENV !== 'production',
  updateFiles: process.env.NODE_ENV !== 'production',
  syncFiles: process.env.NODE_ENV !== 'production',
});

app.use(i18n.init);
app.use(apiLimiter);
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? true : false,
  })
);
app.use(mongoSanitize());
app.use(cors());
app.use(
  requestLogger(
    // @ts-ignore
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms',
    {
      stream: logger.stream,
    }
  )
);
app.use('/images', express.static(path.join(__dirname, './images')));
app.use(requestContext.middleware());

app.get('/', (req, res) =>
  res.json({
    'talawa-version': 'v1',
    status: 'healthy',
  })
);

const httpServer = http.createServer(app);

const apolloServer = new ApolloServer({
  schema,
  validationRules: [depthLimit(5)],
  schemaDirectives: {
    auth: AuthenticationDirective,
    role: RoleAuthorizationDirective,
  },
  context: ({ req, res, connection }) => {
    if (connection) {
      return {
        ...connection,
        pubsub,
        res,
        req,
      };
    } else {
      return {
        ...isAuth(req),
        pubsub,
        res,
        req,
      };
    }
  },
  formatError: (err: any) => {
    if (!err.originalError) {
      return err;
    }
    const message = err.message || 'Something went wrong !';
    const data = err.originalError.errors || [];
    const code = err.originalError.code || 422;
    logger.error(message, err);
    return {
      message,
      status: code,
      data,
    };
  },
  subscriptions: {
    onConnect: (connection) => {
      // @ts-ignore
      if (!connection.authorization) {
        throw new Error('userAuthentication');
      }
      let userId = null;
      // @ts-ignore
      const token = connection.authorization.split(' ')[1];
      if (token) {
        let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // @ts-ignore
        userId = decodedToken.userId;
      }

      return {
        currentUserToken: connection,
        currentUserId: userId,
      };
    },
  },
});

apolloServer.applyMiddleware({
  app,
});
apolloServer.installSubscriptionHandlers(httpServer);

const serverStart = async () => {
  try {
    await database.connect();
    httpServer.listen(process.env.PORT || 4000, () => {
      logger.info(
        `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${
          apolloServer.graphqlPath
        }`
      );
      logger.info(
        `🚀 Subscriptions ready at ws://localhost:${process.env.PORT || 4000}${
          apolloServer.subscriptionsPath
        }`
      );
    });
  } catch (e) {
    logger.error('Error while connecting to database', e);
  }
};

serverStart();
