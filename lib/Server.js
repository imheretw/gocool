import { EventEmitter2 } from 'eventemitter2';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import params from 'strong-params';

import Plugin from './Plugin';
import Logger from './Logger';

const EVENTS = {
  STARTED: 'server:started',
};

export default class Server extends EventEmitter2 {
  static get EVENTS() { return EVENTS; }

  constructor({ config, routes }) {
    super();

    this._logger = new Logger('Server');
    this._config = config;
    this._views = [];
    this._handlers = [];
    this._plugins = [];

    this._expressApp = null;
    this._expressServer = null;
    this._expressPlugins = [];

    this.setRoutes(routes);

    this._initApp();
    this._initListeners();
  }

  start() {
    this._logger.debug('Starting Server...');

    this._initExpressPlugins();
    this._initRoutes();
    this._initViews();
    this._initExpressServer();

    return this;
  }

  setRoutes(routes) {
    this._routes = routes || [];

    return this;
  }

  addHandlers(handlers) {
    this._handlers = [
      ...this._handlers,
      ...handlers,
    ];

    handlers.forEach(handler => handler.start());

    return this;
  }

  addViews(views) {
    if (views && views.length) {
      this._views = [
        ...this._views,
        ...views,
      ];
    }

    return this;
  }

  addExpressPlugins(expressPlugins) {
    if (expressPlugins && expressPlugins.length) {
      this._expressPlugins = [
        ...this._expressPlugins,
        ...expressPlugins,
      ];
    }

    return this;
  }

  addPlugin(plugin, routePath) {
    if (!(plugin instanceof Plugin)) {
      this._logger.warn('Invalid Plugin');
    }

    this._plugins.push(plugin);

    if (routePath) {
      const routes = plugin.getRoutes();
      const views = plugin.getViews();
      this._expressApp.use(routePath, routes);
      this.addViews(views);
    }

    return this;
  }

  _eventHandler(event, ...data) {
    this._logger.info(`Event "${event}" is triggered with data:`, data);

    switch (event) {
      case EVENTS.STARTED:
        this._notifyPlugins(EVENTS.STARTED, this);
        break;
      default:
    }
  }

  _initListeners() {
    this.onAny(this._eventHandler.bind(this));
  }

  _initApp() {
    // EXPRESS SET-UP
    // create app
    this._expressApp = express();

    // use pug and set views and static directories
    this._expressApp.set('view engine', 'pug');

    this.addViews([this._config.path.view]);

    this._expressApp.use(express.static(this._config.path.static));

    // add middlewares
    this._expressApp.use(bodyParser.json({
      verify(req, res, buf) {
        req.rawBody = buf;
      },
    }));
    this._expressApp.use(bodyParser.urlencoded({
      extended: true,
      verify(req, res, buf) {
        req.rawBody = buf;
      },
    }));
    this._expressApp.use(compress());
    this._expressApp.use(cookieParser());
    this._expressApp.use(helmet());
    this._expressApp.use(params.expressMiddleware());

    // passport for authenticate
    this._expressApp.use(passport.initialize());
    this._expressApp.use(passport.session());
  }

  _initRoutes() {
    if (this._routes) {
      // routes
      this._expressApp.use('/', this._routes);
      // catch 404 and forward to error handler
      this._expressApp.use((req, res, next) => {
        const err = new Error('Route Not Found');
        err.statusCode = 404;
        next(err);
      });
    }

    // general errors
    this._expressApp.use((err, req, res, next) => {
      const sc = err.statusCode || 500;
      res.status(sc);

      this._logger.error(
        'Error on status', sc, err.stack
      );

      if (sc === 500) {
        res.render('error', {
          status: sc,
          message: err.message,
          stack: this._config.env === 'development' ? err.stack : '',
        });
      } else {
        res.json({
          error: err.message,
        });
      }
    });

    return this;
  }

  _initViews() {
    this._expressApp.set('views', this._views);
  }

  _initExpressPlugins() {
    this._expressPlugins.forEach((plugin) => {
      if (plugin.path) {
        this._expressApp.use(plugin.path, plugin.content);
      } else {
        this._expressApp.use(plugin.content);
      }
    });
  }

  _initExpressServer() {
    this.setRoutes();
    // START AND STOP
    this._expressServer = this._expressApp.listen(this._config.port, () => {
      this._logger.info(`Started server and listening on port ${this._config.port}`);
      this.emit(EVENTS.STARTED);
    });

    process.on('SIGINT', () => {
      this._logger.info('Server shutting down!');
      this._expressServer.close();
      process.exit();
    });

    process.on('uncaughtException', (error) => {
      this._logger.error(`uncaughtException: ${error.message}`);
      this._logger.error(error.stack);
      process.exit(1);
    });
  }

  _notifyPlugins(event, ...args) {
    this._plugins.forEach(plugin => plugin.emit(event, ...args));
  }

  get expressServer() {
    return this._expressServer;
  }
}
