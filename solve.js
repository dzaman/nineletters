const fs = require('fs');

const MIN = 'a';
const MAX = 'z';
const MAX_LENGTH = 9;

const CHAR_SCORES = {
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
};

const WORDS = readWords();

function computeScore(word) {
  let score = 0;

  for (const letter of word) {
    score += CHAR_SCORES[letter];
  }

  return score;
}

function makeLetterCounts(word) {
  const letterCounts = {};

  for (const letter of word) {
    if (!(letter in letterCounts)) {
      letterCounts[letter] = 0;
    }

    letterCounts[letter] += 1;
  }

  return letterCounts;
}

function parseWord(input) {
  // const word = input.toUpperCase();
  const word = input.toLowerCase();
  const score = computeScore(word);
  const letterCounts = makeLetterCounts(word);

  return {
    word,
    score,
    letterCounts,
  };
}

function makeWords(list) {
  const words = new Map();

  for (const item of list) {
    if (item.charAt(0) === '#') {
      continue;
    }

    const parsed = parseWord(item);
    words.set(parsed.word, parsed);
  }
  return words;
}

function readWords(filename = 'words.txt') {
  const words = new Map();

  const content = fs.readFileSync(filename).toString().split('\n').map((s) => s.trim());

  try {
    return makeWords(content);
  } catch (e) {
    console.log('error parsing line:', e);
  }
}

function makeMissingLetters(letterCounts) {
  const missingletters = [];

  for (let i = 97; i <= 122; i += 1) {
    const c = String.fromCharCode(i);

    if (!letterCounts[c]) {
      missingletters.push(String.fromCharCode(i));
    }
  }

  return new RegExp(`[${missingletters.join('')}]+`);
}

function isWordCovered(wordLetterCounts, letterCounts) {
  for (const [letter, count] of Object.entries(wordLetterCounts)) {
    if ((letterCounts[letter] || 0) < count) {
      return false;
    }
  }

  return true;
}

function makeNextLetters(letters, letterCounts) {
  const localLetters = { ...letterCounts };
  return letters.map((letter) => {
    if (!localLetters[letter]) {
      return letter;
    }

    localLetters[letter] -= 1;
    const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
    return nextLetter > MAX ? MIN : nextLetter;
  });
}

function isWord(word, words = WORDS) {
  return words.has(word);
}

function solve(letters = [], playsRemaining = 3, words = WORDS, plays = [], score = 0) {
  // console.log('solve():', {
  //   letters,
  //   playsRemaining,
  //   words,
  //   plays,
  //   score,
  // });

  if (playsRemaining === 0) {
    return {
      score, 
      plays,
    };
  }

  const letterCounts = makeLetterCounts(letters);
  const missingLetters = makeMissingLetters(letterCounts);

  // console.log('letterCounts', letterCounts);
  // console.log('missingLetters', missingLetters);

  const eligiblePlays = Array.from(words.values()).filter((play) => {
    if (play.word.length > MAX_LENGTH) {
      // console.log(`bad length ${play.word}`);
      return false;
    }

    if (missingLetters.test(play.word)) {
      // console.log(`bad letters ${play.word} (missingLetters: ${missingLetters})`);
      return false;
    }

    if (!isWordCovered(play.letterCounts, letterCounts)) {
      // console.log(`not covered ${play.word}`);
      return false;
    }

    return true;
  });

  let bestSolution;

  // console.log('eligiblePlays', eligiblePlays);

  for (const play of eligiblePlays) {
    const solution = solve(
      makeNextLetters(letters, play.letterCounts),
      playsRemaining - 1,
      words,
      [...plays, play.word],
      score + play.score
    );

    if (solution && (!bestSolution || solution.score > bestSolution.score)) {
      bestSolution = solution;
    }
  }

  return bestSolution;
}

module.exports = {
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
};
