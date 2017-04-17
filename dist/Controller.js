"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Controller = function () {
  function Controller() {
    (0, _classCallCheck3.default)(this, Controller);
  }

  (0, _createClass3.default)(Controller, [{
    key: "before",
    value: function before(actionName, middlewares) {
      this.beforeMiddlewares = this.beforeMiddlewares || {};
      this.beforeMiddlewares[actionName] = this.beforeMiddlewares[actionName] || [];

      if (middlewares.slice) {
        this.beforeMiddlewares[actionName].concat(middlewares);
      } else {
        this.beforeMiddlewares[actionName].push(middlewares);
      }
    }
  }], [{
    key: "action",
    value: function action(name) {
      var controller = new this();

      return {
        action: function action(req, res, next) {
          controller.req = req;
          controller.res = res;
          controller.next = next;
          controller[name].call(controller);
        },
        middlewares: (controller.beforeMiddlewares || {})[name]
      };
    }
  }]);
  return Controller;
}();

exports.default = Controller;
//# sourceMappingURL=Controller.js.map