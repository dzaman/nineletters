const {
  computeScore,
  isWord,
  isWordCovered,
  makeLetterCounts,
  makeMissingLetters,
  makeNextLetters,
  makeWords,
  parseWord,
  readWords,
  solve,
} = require('./solve');

describe('solve', () => {
  describe('makeLetterCounts', () => {
    test('it can count the letters in a word', () => {
      expect(makeLetterCounts('catt')).toEqual({
        c: 1,
        a: 1,
        t: 2,
      });
    });
  });

  describe('computeScore', () => {
    test('it can score a word using scrabble values', () => {
      expect(computeScore('cat')).toEqual(5);
    });
  });

  describe('parseWord', () => {
    test('it can parse a word, score it, and compute letter counts', () => {
      expect(parseWord('cat')).toEqual({
        word: 'cat',
        score: 5,
        letterCounts: {
          c: 1,
          a: 1,
          t: 1,
        },
      });
    });
  });

  describe('readWords', () => {
    test('it can read in test word file', () => {
      const result = readWords('test-words.txt');
      expect(result).toEqual(
        new Map([
          ['cat', parseWord('cat')],
          ['dog', parseWord('dog')],
          ['fish', parseWord('fish')],
          ['bat', parseWord('bat')],
        ])
      );
    });
  });

  describe('makeWords', () => {
    test('it can make a word map', () => {
      const result = makeWords(['cat', 'dog', 'fish', 'bat']);
      expect(result).toEqual(
        new Map([
          ['cat', parseWord('cat')],
          ['dog', parseWord('dog')],
          ['fish', parseWord('fish')],
          ['bat', parseWord('bat')],
        ])
      );
    });
  });

  describe('isWordCovered', () => {
    test('returns true if all letters exist in the letter counts in sufficient quantity', () => {
      expect(isWordCovered(makeLetterCounts('bart'), makeLetterCounts('foobar'))).toEqual(false);
      expect(isWordCovered(makeLetterCounts('bar'), makeLetterCounts('foobar'))).toEqual(true);
    });
  });

  describe('makeMissingLetters', () => {
    test(`creates a regex with all of the letters that don't exist in the string`, () => {
      const re = /[cdeghijklmnpqstuvwxyz]+/;
      expect(makeMissingLetters(makeLetterCounts('foobar'))).toEqual(re);
    });
  });

  describe('makeNextLetters', () => {
    test('can increment letters in the array', () => {
      expect(makeNextLetters(['a', 'b', 'z', 'a', 'a'], { a: 2, z: 1 })).toEqual(['b', 'b', 'a', 'b', 'a']);
    });
  });

  describe('isWord', () => {
    test('returns true only if the word exists', () => {
      const words = makeWords(['cat','dog']);
      expect(isWord('cat', words)).toEqual(true);
      expect(isWord('frog', words)).toEqual(false);
    });
  });

  describe('solve', () => {
    test('can solve a 1-ply game', () => {
      const words = makeWords(['cat', 'dog']);
      const result = solve('catdogfly'.split(''), 1, words);
      expect(result).toEqual({
        score: 5,
        plays: ['cat'],
      });
    });

    test('can solve a 2-ply game', () => {
      const words = makeWords(['cat', 'dog', 'fly', 'dbueph']);
      const result = solve('catdogfly'.split(''), 3, words);
      console.log('result', result);
      expect(result).toEqual({
        score: 24,
        plays: ['cat', 'dog', 'dbueph'],
      });
    });
  });
});
