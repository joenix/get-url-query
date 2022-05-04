function noop() {
  return {};
}

/**
 * @name recursive
 * ======== ======== ========
 * @param {Array} parts
 * @param {Function} callback
 * ======== ======== ========
 */
function recursive(parts, callback) {
  // Has
  parts.length &&
    // And
    (callback(parts.shift()), recursive(parts, callback));
}

/**
 * @name formatter
 * ======== ======== ========
 * @param {String} value
 * @return {String}
 * ======== ======== ========
 */
function formatter(value) {
  try {
    value = decodeURIComponent(value);
  } catch (e) {}

  return isNaN(value - 0) ? value : value - 0;
}

/**
 * @name search
 * ======== ======== ========
 * @param {String} query
 * @return {String}
 * ======== ======== ========
 */
function search(query) {
  // Escape
  query = decodeURIComponent(query);
  // Match Query
  query = query.match(/\?(.*)+$/);
  // Has
  if (query) query = query[1];
  // Return
  return query;
}

/**
 * @name cut
 * ======== ======== ========
 * @param {String} query
 * @param {String} mode - pt | kv
 * @return {Array}
 * ======== ======== ========
 */
function cut(query, mode, symbol = { pt: "&", kv: "=" }[mode]) {
  // Split
  return query.split(symbol);
}

/**
 * @name factory
 * ======== ======== ========
 * @param {Array} parts
 * @return {Object}
 * ======== ======== ========
 */
function factory(parts, result = {}) {
  // Foreach
  recursive(parts, (
    // One
    part,
    // Cake
    cake = cut(part, "kv")
  ) =>
    // Make
    make(
      // Key
      cake[0],
      // Value
      cake[1],
      // Proxy
      result
    )
  );

  // Result
  return result;
}

/**
 * @name make
 * ======== ======== ========
 * @param {String} key
 * @param {String} value
 * ======== ======== ========
 */
function make(key, value, result, exp = new RegExp(/\[\]$/)) {
  // Formatter
  value = formatter(value);

  // W3C Rule
  if (exp.test(key)) {
    // Rebuild
    key = key.replace(exp, "");
    // Merge
    result[key] = result[key] ? [].concat(result[key]) : [];
    // Rec
    make(key, value, result);
    // Stop
    return;
  }

  // Donate
  let ing = result[key];

  // Is Undefined
  if (ing === undefined) {
    result[key] = value;
  }

  // Is Array
  else if (ing.constructor === Array) {
    result[key] = result[key].concat(value);
  }

  // Is Others
  else {
    result[key] = [ing, value];
  }
}

/**
 * @name json
 * ======== ======== ========
 * @param {String} key
 * @param {String} value
 * ======== ======== ========
 */
function json(query) {
  // Get Query
  query = search(query || location.search || location.href);
  // None
  if (query === null) {
    return {};
  }
  // Make Part
  query = cut(query, "pt");
  // Donate
  query = factory(query);
  // Result
  return query;
}

/**
 * @name Extension-Location
 * ======== ======== ========
 * @description get query on get
 * ======== ======== ========
 */
Object.defineProperty(location, "query", {
  get() {
    return json();
  }
});

export default typeof location == "undefined" ? noop : json;
