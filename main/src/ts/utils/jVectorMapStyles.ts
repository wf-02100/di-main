// + Imports +
import * as config from '../config';
import { getJsonAttrVals } from '../helper';

// + Exports +
export default function () {
  // Elments
  const element = document.body as any;

  // Values
  const obj = {
    // - jVectorMap -

    // Tip
    jVectorMapTipCss: getJsonAttrVals(
      element,
      config.J_VECTOR_MAP_TIP_CSS_ATTRIBUTE,
      {
        ...config.J_VECTOR_MAP_TIP_CSS_DEFAULT,
      }
    ),

    // Markers
    jVectorMapMarkersInitialCss: getJsonAttrVals(
      element,
      config.J_VECTOR_MAP_MARKERS_INITIAL_CSS_ATTRIBUTE,
      {
        ...config.J_VECTOR_MAP_MARKERS_INITIAL_CSS_DEFAULT,
      }
    ),
    jVectorMapMarkersHoverCss: getJsonAttrVals(
      element,
      config.J_VECTOR_MAP_MARKERS_HOVER_CSS_ATTRIBUTE,
      {
        ...config.J_VECTOR_MAP_MARKERS_HOVER_CSS_DEFAULT,
      }
    ),
    jVectorMapMarkersSelectedCss: getJsonAttrVals(
      element,
      config.J_VECTOR_MAP_MARKERS_SELECTED_CSS_ATTRIBUTE,
      {
        ...config.J_VECTOR_MAP_MARKERS_SELECTED_CSS_DEFAULT,
      }
    ),
    jVectorMapZipSelectColor:
      element.getAttribute(config.J_VECTOR_MAP_ZIP_SELECT_COLOR_ATTRIBUTE) ||
      config.J_VECTOR_MAP_ZIP_SELECT_COLOR_DEFAULT,

    // Regions
    jVectorMapRegionsInitialCss: getJsonAttrVals(
      element,
      config.J_VECTOR_MAP_REGIONS_INITIAL_CSS_ATTRIBUTE,
      {
        ...config.J_VECTOR_MAP_REGIONS_INITIAL_CSS_DEFAULT,
      }
    ),
    jVectorMapRegionsHoverCss: getJsonAttrVals(
      element,
      config.J_VECTOR_MAP_REGIONS_HOVER_CSS_ATTRIBUTE,
      {
        ...config.J_VECTOR_MAP_REGIONS_HOVER_CSS_DEFAULT,
      }
    ),
    jVectorMapRegionsSelectedCss: getJsonAttrVals(
      element,
      config.J_VECTOR_MAP_REGIONS_SELECTED_CSS_ATTRIBUTE,
      {
        ...config.J_VECTOR_MAP_REGIONS_SELECTED_CSS_DEFAULT,
      }
    ),

    // Mount
    jVectorMapId:
      element.getAttribute(config.J_VECTOR_MAP_MOUNT_ID_ATTRIBUTE) ||
      config.J_VECTOR_MAP_MOUNT_ID_DEFAULT,
    jVectorMapClass:
      element.getAttribute(config.J_VECTOR_MAP_MOUNT_CLASS_ATTRIBUTE) ||
      config.J_VECTOR_MAP_MOUNT_CLASS_DEFAULT,

    // CSS
    jVectorMapBackgroundColor:
      element.getAttribute(
        config.J_VECTOR_MAP_MOUNT_BACKGROUND_COLOR_ATTRIBUTE
      ) || config.J_VECTOR_MAP_MOUNT_BACKGROUND_COLOR_DEFAULT,
    jVectorMapBorderColor:
      element.getAttribute(config.J_VECTOR_MAP_MOUNT_BORDER_COLOR_ATTRIBUTE) ||
      config.J_VECTOR_MAP_MOUNT_BORDER_COLOR_DEFAULT,
  };

  // Log
  // console.log(obj);

  // Return
  return obj;
}
