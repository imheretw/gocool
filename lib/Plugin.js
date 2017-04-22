import EventEmitter2 from 'eventemitter2';
import path from 'path';
import Router from './Router';

export default class Plugin extends EventEmitter2 {
  getRoutes() {
    return [new Router()];
  }

  getViews() {
    const rootPath = path.normalize(__dirname);
    return [`${rootPath}/views`];
  }
}
