'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _strongParams = require('strong-params');

var _strongParams2 = _interopRequireDefault(_strongParams);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// external
var Server = function () {
  function Server(_ref) {
    var config = _ref.config,
        routes = _ref.routes;
    (0, _classCallCheck3.default)(this, Server);

    this._logger = new _Logger2.default('Server');
    this._app = null;
    this._expressServer = null;
    this._views = [];
    this._expressPlugins = [];
    this._handlers = [];
    this._config = config;

    this.setRoutes(routes);

    this._initApp();
  }

  (0, _createClass3.default)(Server, [{
    key: 'start',
    value: function start() {
      this._logger.debug('Starting Server...');

      this._initExpressPlugins();
      this._initRoutes();
      this._initViews();
      this._initExpressServer();

      return this;
    }
  }, {
    key: 'setRoutes',
    value: function setRoutes(routes) {
      this._routes = routes || [];

      return this;
    }
  }, {
    key: 'addHandlers',
    value: function addHandlers(handlers) {
      this._handlers = [].concat((0, _toConsumableArray3.default)(this._handlers), (0, _toConsumableArray3.default)(handlers));

      handlers.forEach(function (handler) {
        return handler.start();
      });

      return this;
    }
  }, {
    key: 'addViews',
    value: function addViews(views) {
      if (views && views.length) {
        this._views = [].concat((0, _toConsumableArray3.default)(this._views), (0, _toConsumableArray3.default)(views));
      }

      return this;
    }
  }, {
    key: 'addExpressPlugins',
    value: function addExpressPlugins(expressPlugins) {
      if (expressPlugins && expressPlugins.length) {
        this._expressPlugins = [].concat((0, _toConsumableArray3.default)(this._expressPlugins), (0, _toConsumableArray3.default)(expressPlugins));
      }

      return this;
    }
  }, {
    key: 'addPlugin',
    value: function addPlugin(routePath, Plugin) {
      var plugin = new Plugin();
      var routes = plugin.getRoutes();
      var views = plugin.getViews();

      this._app.use(routePath, routes);
      this.addViews(views);

      return this;
    }
  }, {
    key: '_initApp',
    value: function _initApp() {
      // EXPRESS SET-UP
      // create app
      this._app = (0, _express2.default)();

      // use pug and set views and static directories
      this._app.set('view engine', 'pug');

      this.addViews([this._config.path.view]);

      this._app.use(_express2.default.static(this._config.path.static));

      // add middlewares
      this._app.use(_bodyParser2.default.json({
        verify: function verify(req, res, buf) {
          req.rawBody = buf;
        }
      }));
      this._app.use(_bodyParser2.default.urlencoded({
        extended: true,
        verify: function verify(req, res, buf) {
          req.rawBody = buf;
        }
      }));
      this._app.use((0, _compression2.default)());
      this._app.use((0, _cookieParser2.default)());
      this._app.use((0, _helmet2.default)());
      this._app.use(_strongParams2.default.expressMiddleware());

      // passport for authenticate
      this._app.use(_passport2.default.initialize());
      this._app.use(_passport2.default.session());
    }
  }, {
    key: '_initRoutes',
    value: function _initRoutes() {
      var _this = this;

      if (this._routes) {
        // routes
        this._app.use('/', this._routes);
        // catch 404 and forward to error handler
        this._app.use(function (req, res, next) {
          var err = new Error('Route Not Found');
          err.statusCode = 404;
          next(err);
        });
      }

      // general errors
      this._app.use(function (err, req, res, next) {
        var sc = err.statusCode || 500;
        res.status(sc);

        _this._logger.error('Error on status', sc, err.stack);

        if (sc === 500) {
          res.render('error', {
            status: sc,
            message: err.message,
            stack: _this._config.env === 'development' ? err.stack : ''
          });
        } else {
          res.json({
            error: err.message
          });
        }
      });

      return this;
    }
  }, {
    key: '_initViews',
    value: function _initViews() {
      this._app.set('views', this._views);
    }
  }, {
    key: '_initExpressPlugins',
    value: function _initExpressPlugins() {
      var _this2 = this;

      this._expressPlugins.forEach(function (plugin) {
        if (plugin.path) {
          _this2._app.use(plugin.path, plugin.content);
        } else {
          _this2._app.use(plugin.content);
        }
      });
    }
  }, {
    key: '_initExpressServer',
    value: function _initExpressServer() {
      var _this3 = this;

      this.setRoutes();
      // START AND STOP
      this._expressServer = this._app.listen(this._config.port, function () {
        _this3._logger.info('Started server and listening on port ' + _this3._config.port);
      });

      process.on('SIGINT', function () {
        _this3._logger.info('Server shutting down!');
        _this3._expressServer.close();
        process.exit();
      });

      process.on('uncaughtException', function (error) {
        _this3._logger.error('uncaughtException: ' + error.message);
        _this3._logger.error(error.stack);
        process.exit(1);
      });
    }
  }, {
    key: 'expressServer',
    get: function get() {
      return this._expressServer;
    }
  }]);
  return Server;
}();

// lib


exports.default = Server;
//# sourceMappingURL=Server.js.map