// * * * Styles * * *

// + + + Defaults + + +

// Search button mode
export const SEARCH_BUTTON_MODE_ACTIVE_DEFAULT = true;

// Object search
export const OBJECT_SEARCH_PATH_DEFAULT =
  '/immobilien-kaufen/test-immobilien-kaufen-und-vermieten-die-perfekte-altersvorsorge';
export const OBJECT_SEARCH_PATH_BASE_DEFAULT = '/immobilien-kaufen/';

// Xano
export const XANO_API_URL_BASE_DEFAULT =
  'https://x7x7-9xry-rcua.f2.xano.io/api:HEXuL5kJ';
export const XANO_API_URL_PATH_DEFAULT = '/get_object_cms_href';

// Other
export const SEARCH_RADIUS_DEFAULT = 50; // kilometer(s)
export const SUCCESS_COLOR_DEFAULT = '#175ada';

// - - - Suggested Search - - -
export const SUGGESTED_SEARCH_BUFFER_TIME_DEFAULT = 0.35; // Second(s);
export const SUGGESTED_SEARCH_NUMBER_OF_RESULTS_DEFAULT = 5;

// - - - Render Objects - - -
export const RENDER_OBJECTS_HREF_PATH_BASE_DEFAULT = '/objekt/';
export const RENDER_OBJECTS_ASYNC_IMAGE_LOAD_IF_MAIN_IMAGE_NOT_DECLARED_DEFAULT =
  false;
export const NUMBER_OF_OBJECTS_PER_LIST_DEFAULT = 8;

// - - - GSAP Scroll To - - -
export const GSAP_SCROLL_TO_TIME_DEFAULT = 1.2; // Second(s);

// - - - jVectorMap - - -

// Mount
export const J_VECTOR_MAP_MOUNT_ID_DEFAULT = 'jvectormap-mount';
export const J_VECTOR_MAP_MOUNT_CLASS_DEFAULT = 'jvectormap-mount';

// Map CSS
export const J_VECTOR_MAP_MOUNT_BACKGROUND_COLOR_DEFAULT = 'transparent';
export const J_VECTOR_MAP_MOUNT_BORDER_COLOR_DEFAULT = '#000';
export const J_VECTOR_MAP_ZIP_SELECT_COLOR_DEFAULT = '#f5f3f4';

// Tip
export const J_VECTOR_MAP_TIP_CSS_DEFAULT = {
  borderColor: '#EA496F',
  background: '#EA496F',
  borderRadius: '5px',
  color: 'white',
  padding: '5px, 10px, 5px, 10px',
  fontSize: '1em',
  lineHeight: '1.5',
  fontFamily: 'Work Sans, sans-serif',
};

// Markers
export const J_VECTOR_MAP_MARKERS_INITIAL_CSS_DEFAULT = {
  fill: '#EA496F',
  stroke: 'none',
  'stroke-width': 0,
  'stroke-opacity': 0,
};
export const J_VECTOR_MAP_MARKERS_HOVER_CSS_DEFAULT = {};
export const J_VECTOR_MAP_MARKERS_SELECTED_CSS_DEFAULT = {
  fill: '#EA496F', // fill: '#151e5b',
};

// Regions
export const J_VECTOR_MAP_REGIONS_INITIAL_CSS_DEFAULT = {
  fill: '#fff',
  stroke: '#000',
  'stroke-width': 4,
  'stroke-opacity': 1,
};
export const J_VECTOR_MAP_REGIONS_HOVER_CSS_DEFAULT = {
  fill: '#000',
  'fill-opacity': 1,
};
export const J_VECTOR_MAP_REGIONS_SELECTED_CSS_DEFAULT = {
  fill: '#151e5b',
};

// + + + Attribute + + +

// Search button mode
export const SEARCH_BUTTON_MODE_ACTIVE_ATTRIBUTE =
  'data-search-button-mode-active';

// Object search
export const OBJECT_SEARCH_PATH_ATTRIBUTE = 'data-object-search-path';
export const OBJECT_SEARCH_PATH_BASE_ATTRIBUTE =
  'data-object-search-includes-path';

// Xano
export const XANO_API_URL_BASE_ATTRIBUTE = 'data-xano-url-base';
export const XANO_API_URL_PATH_ATTRIBUTE = 'data-xano-url-path';

// Other
export const SEARCH_RADIUS_ATTRIBUTE = 'data-search-radius-default'; // kilometer(s)
export const SUCCESS_COLOR_ATTRIBUTE = 'data-success-color';

// - - - Suggested Search - - -
export const SUGGESTED_SEARCH_BUFFER_TIME_ATTRIBUTE =
  'data-suggested-search-buffer-time'; // Second(s);
export const SUGGESTED_SEARCH_NUMBER_OF_RESULTS_ATTRIBUTE =
  'data-suggested-number-of-results';

// - - - Render Objects - - -
export const RENDER_OBJECTS_HREF_PATH_BASE_ATTRIBUTE =
  'data-render-objects-href-path-base';
export const RENDER_OBJECTS_ASYNC_IMAGE_LOAD_IF_MAIN_IMAGE_NOT_DECLARED_ATTRIBUTE =
  'data-render-objects-async-image-load-if-main-image-not-declared';
export const NUMBER_OF_OBJECTS_PER_LIST_ATTRIBUTE =
  'data-render-objects-number-of-objects-per-list';

// - - - GSAP Scroll To - - -
export const GSAP_SCROLL_TO_TIME_ATTRIBUTE = 'data-gsap-scroll-to-time';

// - - - jVectorMap - - -

// Mount
export const J_VECTOR_MAP_MOUNT_ID_ATTRIBUTE = 'data-j-vector-map-mount-id';
export const J_VECTOR_MAP_MOUNT_CLASS_ATTRIBUTE =
  'data-j-vector-map-mount-class';

// Map CSS
export const J_VECTOR_MAP_MOUNT_BACKGROUND_COLOR_ATTRIBUTE =
  'data-j-vector-map-background-color';
export const J_VECTOR_MAP_MOUNT_BORDER_COLOR_ATTRIBUTE =
  'data-j-vector-map-border-color';
export const J_VECTOR_MAP_ZIP_SELECT_COLOR_ATTRIBUTE =
  'data-j-vector-map-zip-select-color';

// Tip
export const J_VECTOR_MAP_TIP_CSS_ATTRIBUTE = 'data-j-vector-map-tip-css';

// Markers
export const J_VECTOR_MAP_MARKERS_INITIAL_CSS_ATTRIBUTE =
  'data-j-vector-map-markers-initial-css';
export const J_VECTOR_MAP_MARKERS_HOVER_CSS_ATTRIBUTE =
  'data-j-vector-map-markers-hover-css';
export const J_VECTOR_MAP_MARKERS_SELECTED_CSS_ATTRIBUTE =
  'data-j-vector-map-markers-selected-css';

// Regions
export const J_VECTOR_MAP_REGIONS_INITIAL_CSS_ATTRIBUTE =
  'data-j-vector-map-regions-initial-css';
export const J_VECTOR_MAP_REGIONS_HOVER_CSS_ATTRIBUTE =
  'data-j-vector-map-regions-hover-css';
export const J_VECTOR_MAP_REGIONS_SELECTED_CSS_ATTRIBUTE =
  'data-j-vector-map-regions-selected-css';

// * * * Selectors * * *

// Standard
export const BODY_SELECTOR = 'body';

// Objects
export const OBJECT_LIST_SELECTOR = '[objects="list"]';

// jVectorMap
export const J_VECTOR_MAP_MOUNT = '[j-vector-map="mount"]';

// * * * Other * * *

// jVectorMap
export const J_VECTOR_MAP_CSS_HREF =
  'https://cdn.jsdelivr.net/gh/wf-02100/jVectorMap@main/jquery-jvectormap.min.css';
export const J_VECTOR_MAP_MAIN_JS_SRC =
  'https://cdn.jsdelivr.net/gh/wf-02100/jVectorMap@main/jquery-jvectormap-2.0.5.min.js';
export const J_VECTOR_MAP_COUNTRY_JS_SRC =
  'https://cdn.jsdelivr.net/gh/wf-02100/jVectorMap@main/jquery-jvectormap-de-merc.js';

// * APIs *
export const DI_API_URL_BASE = 'https://portal-api.deutschland.immobilien/v1';
export const DI_API_TOKEN = '11|RypWPOMT3Pxbm8i36wEQs6HEihcHV5YfTaUChJTW';

// export const GEOAPIFY_API_TOKEN = '6cd561302ab54ab7ae73bc992e3281ea';

// Other
export const TIMEOUT_SEC = 10;
export const _429_RETRY_SEC = TIMEOUT_SEC;
