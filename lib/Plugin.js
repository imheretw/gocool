import path from 'path';
import Router from './Router';

export default class Plugin {
  getRoutes() {
    return [new Router()];
  }

  getViews() {
    const rootPath = path.normalize(__dirname);
    return [`${rootPath}/views`];
  }
}
