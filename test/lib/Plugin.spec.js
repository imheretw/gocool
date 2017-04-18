import { expect } from 'chai';
import Plugin from '../../lib/Plugin';

describe('Test Plugin', () => {
  describe('constructor()', () => {
    it('should create a object', async () => {
      const obj = new Plugin();
      expect(obj).to.be.defined;
      expect(obj.getRoutes().length).to.be.eq(1);
      expect(obj.getViews().length).to.be.eq(1);
    });
  });
});
