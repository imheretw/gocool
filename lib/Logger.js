/* eslint-disable no-console */

export default class Logger {
  constructor(prefix) {
    this._prefix = prefix;

    ['debug', 'verbose', 'info', 'warn', 'error'].forEach((level) => {
      this[level] = (...args) => this._log(level, args);
    });
  }

  _log(level, args) {
    const newArgs = this._appendPrefix(args);
    console.log(...newArgs);
  }

  _appendPrefix(args) {
    return this._prefix ? [`${this._prefix}:`, ...args] : [...args];
  }
}
