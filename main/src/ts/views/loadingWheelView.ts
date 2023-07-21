// + Imports +

// Base

// Custom
import * as config from '../config';

// + Declare +
declare var gsap: any; // Magic

// + Classes +

// Base LoadingWheelView
class LoadingWheelView {
  // Initialize
  init(stateData: any) {
    // Elements
    const globalConfig = document.querySelector('[di="global-config"]');
    const lottieWrapper = document.querySelector(
      '[filters="loading-lottie-wrapper"]'
    );

    // Values
    const handlers = stateData.handlers;
    const fadeInOutTime = parseFloat(
      globalConfig?.getAttribute('data-loading-wheel-fade-in-out-time') || '0.2'
    );
    const stayMinTime = parseFloat(
      globalConfig?.getAttribute('data-loading-wheel-stay-min-time') || '1.1'
    );

    // - Add -

    // Show
    let loadingWheelTimeout = false;
    let tryHideLoadingWheelWasCalled = false;
    handlers.showLoadingWheel = function () {
      // Update
      loadingWheelTimeout = true;
      tryHideLoadingWheelWasCalled = false;

      // Timeout
      setTimeout(function () {
        // Update
        loadingWheelTimeout = false;

        // Logic
        if (tryHideLoadingWheelWasCalled) handlers.tryHideLoadingWheel(true);
      }, (fadeInOutTime + stayMinTime) * 1000);

      // Animate
      gsap.to(lottieWrapper, {
        opacity: 1,
        display: 'block',
        duration: fadeInOutTime,
      });
    };

    // Hide
    handlers.tryHideLoadingWheel = function (timeoutCall = false) {
      // Logic
      if (!timeoutCall) tryHideLoadingWheelWasCalled = true;

      // Guards
      if (timeoutCall && !tryHideLoadingWheelWasCalled) return;
      if (!timeoutCall && loadingWheelTimeout) return;

      // Animate
      gsap.to(lottieWrapper, {
        opacity: 0,
        display: 'none',
        duration: fadeInOutTime,
      });
    };
  }
}

// + Exports +

// LoadingWheelView object
export default new LoadingWheelView();
