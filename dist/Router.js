'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _Logger2.default('resource');

var Router = function () {
  function Router() {
    (0, _classCallCheck3.default)(this, Router);

    this._router = new _express.Router({ mergeParams: true });
  }

  (0, _createClass3.default)(Router, [{
    key: 'resource',
    value: function resource(path, controller) {
      var _this = this;

      var settings = [{ method: 'get', action: 'index', url: '/' }, { method: 'get', action: 'show', url: '/:id' }, { method: 'post', action: 'store', url: '/' }, { method: 'delete', action: 'delete', url: '/' }, { method: 'put', action: 'update', url: '/update' }, { method: 'patch', action: 'update', url: '/update' }];

      settings.forEach(function (setting) {
        logger.debug('register route:', setting.method, '' + path + setting.url, controller.name, setting.action);
        _this.route(setting.method, '' + path + setting.url, controller, setting.action);
      });
    }
  }, {
    key: 'route',
    value: function route(method, path, controller, actionName) {
      var func = this._router[method];

      var _controller$action = controller.action(actionName),
          action = _controller$action.action,
          middlewares = _controller$action.middlewares;

      func.call(this._router, path, middlewares || [], action);
    }
  }, {
    key: 'expressRouter',
    get: function get() {
      return this._router;
    }
  }]);
  return Router;
}();

exports.default = Router;
//# sourceMappingURL=Router.js.map