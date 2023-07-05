// + Imports +
import * as config from '../config';
import { getJsonAttrVals } from '../helper';
import jVectorMapStyles from './jVectorMapStyles';

// + Exports +
export default function () {
  // Elments
  const element = document.body as any;

  // Values
  const obj = {
    // - - - GSAP Scroll To - - -

    gsapScrollToTime: parseFloat(
      element.getAttribute(config.GSAP_SCROLL_TO_TIME_ATTRIBUTE) ||
        config.GSAP_SCROLL_TO_TIME_DEFAULT
    ),

    // - - - Render Objects - - -
    renderObjectsHrefPathBase:
      element.getAttribute(config.RENDER_OBJECTS_HREF_PATH_BASE_ATTRIBUTE) ||
      config.RENDER_OBJECTS_HREF_PATH_BASE_DEFAULT,

    renderObjectsAsyncImageLoadIfMainImageNotDeclared:
      (element.getAttribute(
        config.RENDER_OBJECTS_ASYNC_IMAGE_LOAD_IF_MAIN_IMAGE_NOT_DECLARED_ATTRIBUTE
      ) ||
        config.RENDER_OBJECTS_ASYNC_IMAGE_LOAD_IF_MAIN_IMAGE_NOT_DECLARED_DEFAULT.toString()) ===
      'true'
        ? true
        : false,

    numberOfObjectsPerList: parseInt(
      element.getAttribute(config.NUMBER_OF_OBJECTS_PER_LIST_ATTRIBUTE) ||
        config.NUMBER_OF_OBJECTS_PER_LIST_DEFAULT
    ),

    // Search button mode
    searchButtonModeActive:
      (element.getAttribute(config.SEARCH_BUTTON_MODE_ACTIVE_ATTRIBUTE) ||
        config.SEARCH_BUTTON_MODE_ACTIVE_DEFAULT.toString()) === 'true'
        ? true
        : false,

    // - Search results -

    // Search radius default
    searchRadiusDefault: parseFloat(
      element.getAttribute(config.SEARCH_RADIUS_ATTRIBUTE) ||
        config.SEARCH_RADIUS_DEFAULT
    ),

    // Object search
    objectSearchPath:
      element.getAttribute(config.OBJECT_SEARCH_PATH_ATTRIBUTE) ||
      config.OBJECT_SEARCH_PATH_DEFAULT,

    objectSearchPathBase:
      element.getAttribute(config.OBJECT_SEARCH_PATH_BASE_ATTRIBUTE) ||
      config.OBJECT_SEARCH_PATH_BASE_DEFAULT,

    // Xano
    xanoApiUrlBase:
      element.getAttribute(config.XANO_API_URL_BASE_ATTRIBUTE) ||
      config.XANO_API_URL_BASE_DEFAULT,

    xanoApiUrlPath:
      element.getAttribute(config.XANO_API_URL_PATH_ATTRIBUTE) ||
      config.XANO_API_URL_PATH_DEFAULT,

    // - Suggested Search -

    // Buffer time
    suggestedSearchBufferTime: parseFloat(
      element.getAttribute(config.SUGGESTED_SEARCH_BUFFER_TIME_ATTRIBUTE) ||
        config.SUGGESTED_SEARCH_BUFFER_TIME_DEFAULT
    ),

    // Number of results
    suggestedSearchNumberOfResults: parseInt(
      element.getAttribute(
        config.SUGGESTED_SEARCH_NUMBER_OF_RESULTS_ATTRIBUTE
      ) || config.SUGGESTED_SEARCH_NUMBER_OF_RESULTS_DEFAULT
    ),

    // - jVectorMap -
    ...jVectorMapStyles(),
  };

  // Log
  // console.log(obj);

  // Return
  return obj;
}
