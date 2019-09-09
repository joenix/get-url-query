# get-url-query

[![npm version](https://img.shields.io/badge/npm-2.0.1-red.svg)](https://img.shields.io/badge/npm-2.0.1-red.svg)
[![github version](https://img.shields.io/badge/github-2.0.1-blue.svg)](https://img.shields.io/badge/github-2.0.1-blue.svg)

`get-url-query` is a package for easily convert query to json.

```bash
npm i get-url-query
# or
yarn add get-url-query
```

```js
import getUrlQuery from "get-url-query";

// get query from `location.search`
getUrlQuery();

// get query from `string`
getUrlQuery("http://example.com/?hello=world&hi=joenix");
```
