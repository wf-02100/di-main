// + Imports +

// Base
import { async } from 'regenerator-runtime';

// Custom
import * as config from './config';
import { getJson } from './helper';

import returnStyles from './utils/returnStyles';
import returnElementsHome from './utils/paths/returnElementsHome';
import returnElementsObjectSearch from './utils/paths/returnElementsObjectSearch';

// + Objects +

// State
export const state = {
  data: { handlers: { updateMarkers: () => {} } },
};

// + Functions +

// Search object data
let filterFields: string | string[] = [
  'id',
  'mainImage',
  'address',
  'data.endofconstruction',
  'data.rentbegin',
  'stats.minTotalPrice',
  'name',
  'stats.numUnits',
  'stats.minYield',
  'stats.maxYield',
];
filterFields = filterFields.join(',');
const availableStateOptions = {
  bw: 'baden-wurttemberg',
  by: 'bayern',
  be: 'berlin',
  bb: 'brandenburg',
  hb: 'bremen',
  hh: 'hamburg',
  he: 'hessen',
  mv: 'mecklenburg-vorpommern',
  ni: 'niedersachsen',
  nw: 'nordrhein-westfalen',
  rp: 'rheinland-pfalz',
  sl: 'saarland',
  sn: 'sachsen',
  st: 'sachsen-anhalt',
  sh: 'schleswig-holstein',
  th: 'thuringen',
};
export const getSearchObjectData = async function (
  query = '',
  numberOfLists = 1,
  filterMode = false
) {
  try {
    // - Define -
    const urlParams = new URLSearchParams(query);

    // Zip
    const zip = urlParams.get('plz') || '';

    // Radius
    let radius = urlParams.get('umkreis');
    radius =
      radius === null || radius === ''
        ? state.data['styles'].searchRadiusDefault
        : radius;

    // States
    let states = urlParams.get('bundeslaender') || '';
    states = states
      .split(',')
      .map(str => {
        // Values
        const val = availableStateOptions[str];

        // Return logic
        if (val !== undefined) return val;
      })
      .join(',');

    // Combine - &max=${ state.data['styles'].numberOfObjectsPerList * numberOfLists + 1 } - &skip=${urlParams.get('ueberspringen') || ''}
    const str = `?zip=${zip}&radius=${radius}&fields=${filterFields}&asset=${
      urlParams.get('art') || ''
    }&state=${zip === '' ? states : ''}&sort=${
      (urlParams.get('sortieren') || '').split('-')[0]
    }&sort-dir=${
      (urlParams.get('sortieren') || '-asc').split('-')[1]
    }&minPrice=${urlParams.get('preis-von') || ''}&maxPrice=${
      urlParams.get('preis-bis') || ''
    }&minYield=${urlParams.get('zins-von') || ''}&maxYield=${
      urlParams.get('zins-bis') || ''
    }`;

    // Update url data
    const asyncUrlParams = new URLSearchParams(str);
    state.data['urlParams'] = {
      zip: asyncUrlParams.get('zip'),
      city: urlParams.get('stadt') || '',
      assets: asyncUrlParams.get('asset'),
      states: urlParams.get('bundeslaender') || '',
      sort: urlParams.get('sortieren') || '',
      minPrice: asyncUrlParams.get('minPrice'),
      maxPrice: asyncUrlParams.get('maxPrice'),
      minYield: asyncUrlParams.get('minYield'),
      maxYield: asyncUrlParams.get('maxYield'),
      search: urlParams.get('suche') || '',
      radius: asyncUrlParams.get('radius'),
    };

    // Log
    // console.log(str, state.data['urlParams']);

    // Async
    if (!filterMode) await getData(str);
    if (filterMode) return await getData(str);

    // Log
    // console.log(str);
  } catch (err) {
    // throw err;
    console.log('Msg: Error: model.ts -> getSearchObjectData -> ' + err);
    state.data['objects'] = [];
    return [];
  }
};

// Object data
export const getData = async function (
  query = '',
  path = '/realestate',
  base = config.DI_API_URL_BASE,
  token: string | boolean = config.DI_API_TOKEN
) {
  try {
    // Values
    const url = base + path + query;
    const data = await getJson(url, token);

    // Update
    if (path === '/realestate') state.data['objects'] = data;
    return data; // else ...
  } catch (err) {
    throw err;
  }
};

// Initialize
export const init = function (path: string) {
  // Values
  const stateData = state.data;

  // - Paths -

  // Styles
  stateData['styles'] = returnStyles();

  // Home
  if (['/'].includes(path)) {
    // Set
    stateData['elements'] = returnElementsHome();
  }

  // Object search path === /kaufen
  if (path.includes(stateData['styles'].objectSearchPathBase)) {
    // Set
    stateData['elements'] = returnElementsObjectSearch();
  }

  // - Other -

  // * Handlers *

  // Object data related calls
  stateData.handlers['returnObjectImageData'] = function (id: number) {
    return getData('', `/realestate/${id}/images`);
  };
  stateData.handlers['returnObjectWfCmsHref'] = function (id: number) {
    return getData(
      `?di_id=${id}`,
      stateData['styles'].xanoApiUrlPath,
      stateData['styles'].xanoApiUrlBase,
      false
    );
  };

  // Suggested search
  stateData.handlers['returnSuggestSearchData'] = async function (str: string) {
    try {
      // - Define -
      return await getData(
        `?search=${str}&max=${stateData['styles'].suggestedSearchNumberOfResults}`,
        '/zipcode'
      );
    } catch (err) {
      throw err;
    }
  };

  // Add object search to handlers
  stateData.handlers['getSearchObjectData'] = async function (
    query = '',
    nOfList = 1
  ) {
    try {
      // - Return -
      return await getSearchObjectData(query, nOfList, true);
    } catch (err) {
      throw err;
    }
  };
};
