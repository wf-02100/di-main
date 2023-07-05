// + Imports +
import * as config from '../../config';

// + Exports +
export default function () {
  // Elments
  const body = document.querySelector(config.BODY_SELECTOR);
  const objectListElements = document.querySelectorAll(
    config.OBJECT_LIST_SELECTOR
  );

  // Modify object lists
  const objectLists: HTMLElement[] = [];
  objectListElements.forEach(objectListElement => {
    // Logic
    if (objectListElement.classList.contains('w-dyn-list'))
      objectLists.push(objectListElement.childNodes[0] as HTMLElement);
    else objectLists.push(objectListElement as HTMLElement);
  });

  // Object list loop
  const objectListsData: any = [];
  objectLists.forEach(objectList => {
    // Return
    objectListsData.push({
      listElement: objectList,
      itemTemplate: objectList.childNodes[0].cloneNode(true),
    });
  });

  // Object comparison
  const comparisonWrapper = document.querySelector('[comparison="wrapper"]');
  const comparisonImgTemplate = comparisonWrapper
    ?.querySelector('[comparison="image-template"]')
    ?.cloneNode(true);
  const comparisonAnchor = comparisonWrapper?.querySelector('a');
  const comparisonImagesParent = comparisonWrapper?.querySelector(
    '[comparison="image-template"]'
  )?.parentElement;

  // Log
  // console.log(comparisonImagesParent, comparisonImgTemplate);

  // - Define return object -
  const obj = {
    // Base
    body: body,
    nav: document.querySelector('.c-container.cc-nav'),

    // Objects
    objectLists: objectListsData,
    objectsEmptyMsgWrapper: document.querySelector('[objects="empty"]'),

    // Object comparison
    comparisonWrapper: comparisonWrapper,
    comparisonImgTemplate: comparisonImgTemplate,
    comparisonImagesParent: comparisonImagesParent,
    comparisonCount: comparisonWrapper?.querySelector('[comparison="count"]'),
    comparisonPlural: comparisonWrapper?.querySelector('[comparison="plural"]'),
    comparisonAnchor: comparisonAnchor,
    comparisonAnchorDefaultHrefValue: comparisonAnchor?.href,
    comparisonXButton: comparisonWrapper?.querySelectorAll('a')[1],

    // Load more
    loadMoreContainer: document.querySelector('[load-more="container"]'),
    loadMoreButton: document.querySelector('[load-more="button"]'),

    // Pagination
    pagiantionContainer: document.querySelector('[pagination="container"]'),
    pagiantionNextButton: document.querySelector('[pagination="next"]'),
    pagiantionPrevButton: document.querySelector('[pagination="prev"]'),
    pagiantionNumberWrapper: document.querySelector(
      '[pagination="number-link"]'
    )?.parentElement,
    pagiantionNumberTemplate: document
      .querySelector('[pagination="number-link"]')
      ?.cloneNode(true),

    // jVectorMap
    jVectorMapMount: document.querySelector(config.J_VECTOR_MAP_MOUNT),
  };

  // Log
  // console.log(obj);

  // Return
  return obj;
}
