// + Imports +
import * as config from '../config';

// + Exports +
export default function () {
  // Elments
  const body = document.querySelector(config.BODY_SELECTOR);
  const listWrapper = document.querySelector('[comparison="list"]');
  const list = listWrapper?.children[0];
  const template = list?.children[0].cloneNode(true);

  // - Define return object -
  const obj = {
    // Base
    body: body,
    listWrapper: listWrapper,
    list: list,
    template: template,
  };

  // Log
  // console.log(obj);

  // Return
  return obj;
}
