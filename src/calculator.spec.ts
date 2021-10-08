import { add } from './calculator';

describe('Addition', () => {
  test('returns 0 for empty string', () => {
    expect(add('')).toBe('0');
  });

  test('returns sums for numbers', () => {
    expect(add('1')).toBe('1');
    expect(add('1.1,2.2')).toBe('3.3');
    expect(add('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17')).toBe('153');
  });

  test('accept new line as separator', () => {
    expect(add('1\n2,3')).toBe('6');
  });

  test('accept "SEP" as custom separator', () => {
    expect(add('//SEP\n1SEP2SEP3')).toBe('6');
  });
});

describe('Handling error cases', () => {
  test('detect invalid separator', () => {
    expect(add('175.2,\n35')).toBe("Number expected but '\n' found at position 6.");
    expect(add('175.2\n,35')).toBe("Number expected but ',' found at position 6.");
  });

  test('detect invalid EOF - must finish with number', () => {
    expect(add('1,3,')).toBe('Number expected but EOF found');
    expect(add('//SEP\n1SEP3SEP')).toBe('Number expected but EOF found');
  });

  test('detect unknown separator', () => {
    expect(add('//|\n1|2,3')).toBe("'|' expected but ',' found at position 3.");
    expect(add('//SEP\n1|2SEP3')).toBe("'SEP' expected but '|' found at position 1.");
  });

  test('detect negative numbers and return error', () => {
    expect(add('-1,2')).toBe('Negative not allowed : -1');
    expect(add('2,-4,-5')).toBe('Negative not allowed : -4, -5');
  });

  test('detect invalid numbers and return error', () => {
    expect(add('--1,2')).toBe('Invalid number : --1');
    expect(add('2,2.5.5,6')).toBe('Invalid number : 2.5.5');
    expect(add('2,2 500 02.5,6')).toBe('Invalid number : 2 500 02.5');
  });

  test('detect multiple errors', () => {
    expect(add('-1,,2')).toBe("Number expected but ',' found at position 3.\nNegative not allowed : -1");
    expect(add('4.5.5,\n')).toBe(
      "Number expected but '\n' found at position 6.\nNumber expected but EOF found\nInvalid number : 4.5.5",
    );
    expect(add('//SEP\n1SEP3SEP456TE45')).toBe(
      "'SEP' expected but 'T' found at position 11.\n'SEP' expected but 'E' found at position 12.",
    );
  });
});
