// + Imports +

// Base

// Custom
import * as config from '../config';
import suggestedSearchView from './suggestedSearchView';

// + Classes +

// Base WebflowView
class FinderView {
  // - - - Main - - -
  #renderSuggestedSearchFunctionalty(
    el: HTMLInputElement,
    stateData: any,
    index: number
  ) {
    // Values
    const searchPath = el.getAttribute('data-search-path') || '/rendite';

    // Elements
    const wrapper = el.closest('form') as any;
    const submit = wrapper?.querySelector('[finder="submit"]');

    // Manipulate DOM
    el.setAttribute('suggested-search', 'input-' + index);

    // Log
    // console.log(el);

    // Call search view
    suggestedSearchView.init(
      stateData,
      `[suggested-search="input-${index}"]`,
      true,
      true
    );

    // + + + NEW + + +

    // Is germany wide event listener
    let isGermanyWide = false;
    wrapper
      ?.querySelector('[finder="germany-wide"]')
      ?.querySelector('input')
      ?.addEventListener('click', function () {
        if (isGermanyWide) isGermanyWide = false;
        else isGermanyWide = true;
      });

    // - - - Slide 2 Event Listener - - -

    let typeVals: any = {};
    [
      'pflegeimmobilien',
      'renditeimmobilien',
      'denkmalimmobilien',
      'ferienimmobilien',
      'studentenimmobilien',
    ].forEach((str, index) => {
      // Elements
      const input = wrapper
        ?.querySelector(`[finder="${str}"]`)
        ?.querySelector('input');

      // Listener
      input?.addEventListener('click', function () {
        // Logic
        if (typeVals[str] === true) {
          typeVals[str] = false;
        } else {
          typeVals[str] = true;
        }

        // Log
        // console.log(typeVals[str], typeVals);
      });
    });

    // - - - Slide 2 Event Listener - - -

    // Log
    // console.log(submit, wrapper, el, searchPath);

    // Listen to submit
    submit?.addEventListener('click', function () {
      // Change text
      submit.innerHTML =
        submit.getAttribute('data-waiting-text') || 'Einen Moment bitte...';

      // - Get all values -

      // Slide 1
      const state = isGermanyWide
        ? ''
        : wrapper?.querySelector('[finder="states"]').value || '';
      const zip = isGermanyWide
        ? ''
        : wrapper
            ?.querySelector(`[suggested-search="input-${index}"]`)
            .getAttribute('data-value') || '';
      const city = isGermanyWide
        ? ''
        : wrapper
            ?.querySelector(`[suggested-search="input-${index}"]`)
            .getAttribute('data-city-value') || '';

      // Log
      // console.log(isGermanyWide, state, zip, city);

      // Slide 2
      // Loop through every object key
      const selectedTypes: string[] = [];
      Object.entries(typeVals).forEach(arr => {
        if (arr[1] === true) selectedTypes.push(arr[0]);
      });

      // Log
      // console.log(selectedTypes);

      // Slide 3
      let yieldFrom: number | string = parseInt(
        wrapper
          ?.querySelector('[finder="yield-from"]')
          .value.replace(/\D/g, '') || 0
      );
      let priceTo: number | string = parseInt(
        wrapper
          ?.querySelector('[finder="price-to"]')
          .value.replace(/\D/g, '') || 0
      );
      yieldFrom = yieldFrom === 0 ? '' : yieldFrom;
      priceTo = priceTo === 0 ? '' : priceTo;

      // Log
      // console.log(yieldFrom, priceTo);

      // * Define url *
      const url =
        searchPath +
        '?' +
        'bundeslaender=' +
        state +
        '&plz=' +
        zip +
        '&stadt=' +
        city +
        '&art=' +
        selectedTypes.join(',') +
        '&zins-von=' +
        yieldFrom +
        '&preis-bis=' +
        priceTo;

      // Log
      // console.log(url);

      // Redirect
      location.href = url;
    });
  }

  // - - - Default - - -

  // Initialize
  init(stateData: any) {
    // Values
    this.#styles = stateData.styles;
    this.#objects = stateData.objects;
    this.#handlers = stateData.handlers;

    // Elements
    this.#elements = {
      searchInputs: document.querySelectorAll('[suggested-search="input"]'),
    };

    // Loop
    this.#elements.searchInputs.forEach(
      (input: HTMLInputElement, index: number) => {
        this.#renderSuggestedSearchFunctionalty(input, stateData, index);
      }
    );
  }

  // Define
  #styles: any;
  #elements: any;
  #objects: any;
  #handlers: any;
  #urlParams: any;

  // - - - Helper - - -
}

// + Exports +

// FinderView object
export default new FinderView();
