// + Imports +

// Base
import { async } from 'regenerator-runtime';

// Custom
import * as config from './config';

// + Functions +

// Clean up
export const removeEmptyParameters = function (url: string) {
  //prefer to use l.search if you have a location/link object
  var urlparts = url.split('?');
  if (urlparts.length >= 2) {
    // var prefix = encodeURIComponent(parameter) + '=';
    var pars = urlparts[1].split(/[&;]/g);

    // Log
    // console.log(urlparts);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0; ) {
      // Values
      const val = pars[i].split('=')[1];

      // Logic
      if (
        val === 'undefined' ||
        val === undefined ||
        val === '0' ||
        val === ''
      ) {
        pars.splice(i, 1);
      }

      // Log
      // console.log(pars[i].split('=')[0], val);
    }

    return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
  }
  return url;
};

// Allows for loading other scripts
export function scriptLoader(externalScript = 'foo', callback) {
  const scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    document.head.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = externalScript;
  });

  scriptPromise.then(callback);
}

// String to array
export function stringToArray(
  string: string,
  splitter: any = ',',
  removeWhiteSpaces = true,
  removeQuotes = true,
  removeBrackets = true
) {
  // - Manipulation -

  // Remove brackets
  if (removeBrackets) string = string.replace(/[\[\]]/g, '');

  // Remove quotes
  if (removeQuotes) string = string.replace(/['"]/g, '');

  // Remove white spaces
  if (removeWhiteSpaces) string = string.replace(/ /g, '').replace(/\n/g, '');

  // Split
  const arr = splitter !== false ? string.split(splitter) : string;

  // Return
  return arr;
}

// Timeout
export const timeout = function (s: number) {
  // Return
  return new Promise(function (_, reject) {
    // Timeout
    setTimeout(function () {
      // Create error
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Return JSON
export const getJson = async function (
  url: string,
  token: string | boolean = false,
  _429retry: boolean = false
) {
  try {
    // Logig
    const payload =
      token === false
        ? {}
        : {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };

    // Values
    const res: any = await Promise.race([
      fetch(url, payload),
      timeout(config.TIMEOUT_SEC),
    ]);
    const data = await res.json();

    // // Too many requests
    // if (res.status === 429) {
    //   // Timeout & logic
    //   if (!_429retry)
    //     setTimeout(function () {
    //       // Retry
    //       getJson(url, token, true);
    //     }, config._429_RETRY_SEC * 1000);
    // }

    // Logic
    if (!res.ok)
      throw new Error(
        `helper.ts -> getJson -> ${data.message} (${res.status})`
      );

    // Return
    return data;
  } catch (err) {
    throw err;
  }
};

// - - String related functions - -

// - Get attribute values -
export function getJsonAttrVals(
  element,
  attribute,
  defaultVals,
  objectMode = true
) {
  let val =
    (element.getAttribute(attribute) || '{}') == '{}'
      ? { ...defaultVals }
      : JSON.parse(preJsonParse(element.getAttribute(attribute), objectMode));

  return val;
}

// - Prepare for JSON parse -
function preJsonParse(string, objectMode = true) {
  let array = trimBothStringSides(string.replace(/\, /g, ',')).split(','),
    newString = '',
    arrayLength = array.length - 1;

  array.forEach((item, i) => {
    item
      .replace(/\'/g, '')
      .replace(/\: /g, ':')
      .split(':')
      .forEach((item, i2) => {
        newString += `"${item}"${i2 > 0 ? '' : ': '}`;
      });

    newString += i < arrayLength ? ', ' : '';
  });

  if (objectMode) {
    return `{${newString}}`;
  } else {
    return newString;
  }
}

// Removes curly brackets
function trimBothStringSides(string) {
  return string.substring(1).slice(0, -1);
}
