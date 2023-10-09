import express from 'express';
import { Container } from 'typedi';
import path from 'path';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { useExpressServer, getMetadataArgsStorage, useContainer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import config from 'config';
import { logger, stream } from '@utils/logger';
import passport from 'passport';
import session from 'express-session';
import '@/utils/passport';
import { DbConnection } from '@/database/dbConnection';
import errorMiddleware from '@/middlewares/error.middleware';
import * as i18n from 'i18n';
import { LANGUAGES } from './constants';
import { authMiddleware } from './auth/authorizationChecker';

export default class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.env = process.env.NODE_ENV || 'development';
    this.connectToDatabase();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializePassport();
    this.initializeErrorHandling();
    this.initI18n();
    this.app.disable('etag');
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(config.get('log.format'), { stream }));
    this.app.use(hpp());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static('public'));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(
      session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
      }),
    );
  }

  private initializePassport() {
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private initializeSwagger() {
    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const storage = getMetadataArgsStorage();
    const routingControllersOptions = {
      routePrefix: '/api',
    };
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'A sample API',
        version: '1.0.0',
      },
    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  private async connectToDatabase() {
    await DbConnection.createConnection();
  }

  private initializeRoutes() {
    useContainer(Container);
    useExpressServer(this.app, {
      // cors: {
      //   origin: config.get('cors.origin'),
      //   credentials: config.get('cors.credentials'),
      // },
      routePrefix: '/api',
      middlewares: [path.join(__dirname + '/middlewares/*{.ts,.js}')],
      controllers: [path.join(__dirname + '/controllers/*{.ts,.js}')],
      interceptors: [path.join(__dirname + '/interceptors/*{.ts,.js}')],
      defaultErrorHandler: false,
      authorizationChecker: authMiddleware(),
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initI18n = () => {
    i18n.configure({
      locales: [LANGUAGES.EN, LANGUAGES.VI],
      directory: path.join(__dirname, '..', 'locales'),
    });
  };
  public healthCheck() {
    this.app.get('/health', (req, res) => {
      // Check the health of your application here
      const isHealthy = true; // Replace with your health check logic
      if (isHealthy) {
        res.status(200).send('OK');
      } else {
        res.status(500).send('Internal Server Error');
      }
    });
  }
  public listen() {
    this.healthCheck();
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
      logger.info(`🚀 API Document: http://localhost:${this.port}/api-docs`);
      logger.info(`=================================`);
    });
  }
}
