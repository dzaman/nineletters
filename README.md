Solver and word tester for `nineletters`

## Use

This project has not been pushed to NPM, so it must be installed directly from Github

```
npm install github:dzaman/nineletters-helper
```

### Wordlists

This utility ships with the NASPA Word List 2020 (default) and Collins' Scrabble Words 2019 (formerly SOWPODS). You can switch wordlists using `setWords('<pathToLibrary/>wordlists/<filename>.txt')` or any valid path to an appropriately formatted wordlist. For more information about the included wordlists, please refer to [this article](https://wordfinder.yourdictionary.com/blog/csw-vs-nwl-the-difference-between-these-scrabble-dictionaries/).

## Develop

**Setup:**

```
npm install
```

**Test:**

```
npm test
```

**Examples:**

```
# test solving an example puzzle (takes 20 seconds)
node example-solve-ozzxsfebu.js

# test vaidating a word
node example-isword-fubar.js
```

# Changelog

Version | Notes
-|-
2.0.0 | Changed default dictionary to NWL2020 and added support for CWL2019
1.0.0 | Initial version
