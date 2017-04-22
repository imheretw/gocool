import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import path from 'path';
import Server, { EVENTS } from '../../lib/Server';

chai.use(sinonChai);

describe('Test Server', () => {
  const config = {};
  let sandbox;
  let server;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    // path to root directory of this app
    const rootPath = path.normalize(__dirname);

    config.path = {
      view: path.join(rootPath, 'app/views'),
      static: path.join(rootPath, 'static'),
    };

    server = new Server({ config });
  });

  describe('constructor()', () => {
    it('should create a server', async () => {
      expect(server).to.be.defined;
    });
  });

  describe('emit()', () => {
    describe('when pass unknown event', () => {
      it('should only log', () => {
        const spy = sandbox.spy(server._logger, 'info');

        server.emit('test');

        expect(spy).to.have.been.called;
      });
    });

    describe(`when pass ${EVENTS.STARTED}`, () => {
      it('should call _notifyPlugins', () => {
        const spy = sandbox.spy(server, '_notifyPlugins');

        server.emit(EVENTS.STARTED);

        expect(spy).to.have.been.called;
      });
    });
  });
});
