/* eslint-disable no-console */
import log from 'debug';

export default class Logger {
  constructor(prefix) {
    this._prefix = prefix;

    this.debug = this._createMethod('debug');
    this.info = this._createMethod('info');
    this.warn = this._createMethod('warn');
    this.error = this._createMethod('error');
  }

  _createMethod(level) {
    return log(`gocool:${level}:${this._prefix}`);
  }
}
