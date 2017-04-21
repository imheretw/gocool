/* eslint-disable no-console */

import { expect } from 'chai';
import Logger from '../../lib/Logger';

describe('Test Logger', () => {
  const prefix = 'prefix';

  describe('constructor()', () => {
    it('should create a object', async () => {
      const obj = new Logger();
      expect(obj).to.be.defined;
    });

    it('can pass prefix', async () => {
      const obj = new Logger(prefix);
      expect(obj._prefix).to.be.eq(prefix);
    });
  });
});
