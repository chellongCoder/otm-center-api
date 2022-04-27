import express from "express";
import { Container } from "typedi";
import path from "path";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import {
  useExpressServer,
  getMetadataArgsStorage,
  useContainer,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import config from "config";
import { logger, stream } from "@utils/logger";
import passport from "passport";
import session from "express-session";
import "@/utils/passport";
import { DbConnection } from "@/database/dbConnection";

export default class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(Controllers: Function[]) {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.env = process.env.NODE_ENV || "development";
    this.connectToDatabase();

    this.initializeMiddlewares();

    this.initializeRoutes(Controllers);
    this.initializeSwagger(Controllers);
    this.initializePassport();
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(config.get("log.format"), { stream }));
    this.app.use(hpp());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(
      session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    );
  }

  private initializePassport() {
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private initializeSwagger(controllers: Function[]) {
    const { defaultMetadataStorage } = require("class-transformer/cjs/storage");

    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: "#/components/schemas/",
    });

    const storage = getMetadataArgsStorage();
    const routingControllersOptions = {
      routePrefix: "/api",
    };
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: "basic",
            type: "http",
          },
        },
      },
      info: {
        description: "Generated with `routing-controllers-openapi`",
        title: "A sample API",
        version: "1.0.0",
      },
    });

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
  }

  private async connectToDatabase() {
    await DbConnection.createConnection();
  }

  private initializeRoutes(controllers: Function[]) {
    useContainer(Container);
    useExpressServer(this.app, {
      cors: {
        origin: config.get("cors.origin"),
        credentials: config.get("cors.credentials"),
      },
      routePrefix: "/api",
      middlewares: [path.join(__dirname + "/middlewares/*.ts")],
      controllers: [path.join(__dirname + "/controllers/*.ts")],
      interceptors: [path.join(__dirname + "/interceptors/*.ts")],
      defaultErrorHandler: false,
    });
  }

  public listen() {
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
