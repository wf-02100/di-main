// + Imports +

// Base

// Custom
import * as config from '../config';
import jVectorMapView from './jVectorMapView';
import renderObjectsView from './renderObjectsView';
import suggestedSearchView from './suggestedSearchView';
import filterView from './filterView';
import finderView from './finderView';
import loadingWheelView from './loadingWheelView';

// + Classes +

// Base WebflowView
class WebflowView {
  // Initialize
  initHomeView(stateData: any) {
    // Render object data
    // renderObjectsView.init(stateData);

    // Map object data
    // jVectorMapView.init(stateData);

    // Suggested search
    suggestedSearchView.init(stateData);
  }

  initObjectSearchView(stateData: any) {
    // Init loading wheel
    loadingWheelView.init(stateData);

    // Render object data
    renderObjectsView.init(stateData);

    // Map object data
    jVectorMapView.init(stateData);

    // Filter functionality
    filterView.init(stateData);

    // Log
    // console.log('Hey!');
  }

  initFinder(stateData: any) {
    finderView.init(stateData);
  }

  // Event listeners
  // addHandler(handler, events = ['load', 'pageshow'], object = window) {
  //   events.forEach(event => object.addEventListener(event, handler));
  // }
}

// + Exports +

// WebflowView object
export default new WebflowView();
