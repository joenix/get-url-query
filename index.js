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

  return value; // isNaN(+value) ? value : +value;
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
    // No Set Value as `undefined`
    if (value === "undefined") {
      return;
    }

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
 * @name getUrlQuery
 * ======== ======== ========
 * @param {String} key
 * @param {String} value
 * ======== ======== ========
 */
function getUrlQuery(query = location.search) {
  // Get Query
  query = search(query || location.href);
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
try {
  Object.defineProperty(location, "query", {
    get() {
      return getUrlQuery();
    }
  });
}
catch(e) {}

// Export for Usage
export default typeof location == "undefined" ? noop : getUrlQuery;