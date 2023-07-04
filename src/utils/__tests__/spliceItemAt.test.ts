import { spliceItemAt } from '../spliceItemAt';

describe('spliceItemAt', () => {
  describe('when value is out of bound', () => {
    it('should return initial array & "item: default value"', () => {
      expect(spliceItemAt([1, 2, 3], 3, undefined)).toEqual({ array: [1, 2, 3] });
      expect(spliceItemAt([1, 2, 3], 3, null)).toEqual({ array: [1, 2, 3], item: null });
      expect(spliceItemAt([1, 2, 3], 3, -1)).toEqual({ array: [1, 2, 3], item: -1 });
    });
  });

  describe('when value is in bound', () => {
    it('should return modified array and item', () => {
      expect(spliceItemAt([1, 2, 3], 1, undefined)).toEqual({ array: [1, 3], item: 2 });
      expect(spliceItemAt([1, 2, 3], 1, null)).toEqual({ array: [1, 3], item: 2 });
      expect(spliceItemAt([1, 2, 3], 1, -1)).toEqual({ array: [1, 3], item: 2 });
    });
  });
});
