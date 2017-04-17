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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

var Logger = function () {
  function Logger(prefix) {
    var _this = this;

    (0, _classCallCheck3.default)(this, Logger);

    this._prefix = prefix;

    ['debug', 'verbose', 'info', 'warn', 'error'].forEach(function (level) {
      _this[level] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _this._log(level, args);
      };
    });
  }

  (0, _createClass3.default)(Logger, [{
    key: '_log',
    value: function _log(level, args) {
      var _console;

      var newArgs = this._appendPrefix(args);
      (_console = console).log.apply(_console, (0, _toConsumableArray3.default)(newArgs));
    }
  }, {
    key: '_appendPrefix',
    value: function _appendPrefix(args) {
      return this._prefix ? [this._prefix + ':'].concat((0, _toConsumableArray3.default)(args)) : [].concat((0, _toConsumableArray3.default)(args));
    }
  }]);
  return Logger;
}();

exports.default = Logger;
//# sourceMappingURL=Logger.js.map