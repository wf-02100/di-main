// + Imports +

// Base
import { async } from 'regenerator-runtime';

// Custom
import * as config from './config';
import { getJson } from './helper';

import returnElements from './utils/returnElements';

// + Objects +

// State
export const state = {
  handlers: { updateMarkers: () => {} },
};

// + Functions +

// Load objects by id
export const loadObjects = async function (ids: number[]) {
  try {
    // Values
    const dataArr: any[] = [];

    // Loop
    for (const id of ids) {
      try {
        // Call
        const res = await getData('', `/realestate/${id}`);

        // Push
        dataArr.push(res);

        // Log
        // console.log(res);
      } catch (err) {}
    }

    // Await promise
    state['data'] = dataArr;
    return dataArr;
  } catch (err) {
    throw err;
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
    if (path === '/realestate') state['objects'] = data;
    return data; // else ...
  } catch (err) {
    throw err;
  }
};

// Initialize
export const init = function () {
  // Set
  state['elements'] = returnElements();
};
