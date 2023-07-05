// + Imports +
import * as config from '../../config';

// + Exports +
export default function () {
  // Elments
  const body = document.querySelector(config.BODY_SELECTOR);
  // const objectLists = document.querySelectorAll(config.OBJECT_LIST_SELECTOR);

  // Object list loop
  // const objectListsData: any = [];
  // objectLists.forEach(objectList => {
  //   // Return
  //   objectListsData.push({
  //     listElement: objectList,
  //     itemTemplate: objectList.childNodes[0].cloneNode(true),
  //   });
  // });

  // - Define return object -
  const obj = {
    // Base
    body: body,
  };

  // Log
  // console.log(obj);

  // Return
  return obj;
}
