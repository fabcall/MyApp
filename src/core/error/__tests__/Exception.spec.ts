import { LocalException } from '../Exception';

describe('Exception', () => {
  describe('Local Exception', () => {
    it('get raw error', () => {
      const raw = { any: '' };
      const exception = new LocalException<typeof raw>(raw);
      expect(exception.rootCause).toBe(raw);
    });
  });
});
