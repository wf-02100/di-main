// + Imports +

// Base

// Custom
import * as config from '../config';

// + Classes +

// Base WebflowView
class TypeDropDownView {
  // - - - Main - - -
  #renderSuggestedSearchFunctionalty(
    el: HTMLInputElement,
    stateData: any,
    index: number
  ) {
    // Manipulate DOM
    // Log
    // console.log(el);
    // Call search view
  }

  // - - - Default - - -

  // Initialize
  init(stateData: any) {
    // Values
    this.#styles = stateData.styles;
    this.#objects = stateData.objects;
    this.#handlers = stateData.handlers;
    const _this = this;

    // Elements
    const tagsContainer = document.querySelector('.c-home_tags-container');
    this.#elements = {
      tagsContainer: tagsContainer,
      tagsWrapper: tagsContainer?.querySelector('.c-home_tags'),
      dropdownTrigger: tagsContainer?.querySelector('.c-home_tags-arrow_wrap'),
      searchButton: document.querySelector('[suggested-search="submit"]'),
    };

    // Guard
    if (!tagsContainer)
      throw new Error(
        `typeDrowDownView.ts -> init: Error: tagsContainer = ${typeof tagsContainer}`
      );

    // Event listener

    // Dropdown trigger hover
    this.#elements.dropdownTrigger?.addEventListener('mouseover', function () {
      dropdownTriggerIsHovered = true;
    });
    this.#elements.dropdownTrigger?.addEventListener('mouseout', function () {
      dropdownTriggerIsHovered = false;
    });

    // - Add values to link -
    let eventListenerShallPause = false;
    let dropdownTriggerIsHovered = false;
    this.#elements.tagsContainer?.addEventListener('click', function () {
      // Guard
      if (eventListenerShallPause) return;
      eventListenerShallPause = true;
      setTimeout(function () {
        eventListenerShallPause = false;
      }, 10);

      // Count visible tags
      _this.#countVisibleTags(true);

      // Logic - Count number of still available to select tags
      if (_this.#allTagsSelected) {
        // Artificial double click
        if (dropdownTriggerIsHovered) {
          _this.#elements.dropdownTrigger.click();
        }

        // Guard
        if (
          _this.#getCurrentRotation(
            _this.#elements.dropdownTrigger.children[0]
          ) === 0
        )
          return;

        // Action
        _this.#elements.dropdownTrigger.click();

        // Log
        // console.log('Hi');
      }

      // - Action - change link -
      _this.#elements.tagsContainer.setAttribute(
        'data-value',
        _this.#searchTypeStringArray.join(',')
      );
      if (_this.#searchTypeStringArray.length === 1) {
        // Define
        const path =
          _this.#searchFilterPathStringArray[0] === ''
            ? '/' + _this.#searchTypeStringArray[0]
            : _this.#searchFilterPathStringArray[0];

        // Set
        _this.#elements.tagsContainer.setAttribute('data-search-path', path);

        // Log
        // console.log(path);
      } else {
        // Set
        _this.#elements.tagsContainer.setAttribute('data-search-path', '');
      }

      // Handler call
      _this.#handlers.searchForQuery();
    });

    // - Open & close tags dropdown in a nicer way
    this.#elements.tagsWrapper?.addEventListener('click', function () {
      // Count visible tags
      _this.#countVisibleTags();

      // Logic
      if (_this.#numberOfSelectedTags === 0) {
        // Action
        _this.#elements.dropdownTrigger.click();

        // Log
        // console.log('Hi');
      }
    });
  }

  #countVisibleTags(changeButtonHref = false) {
    // Elements
    const children: HTMLElement[] = this.#elements.tagsWrapper.children;

    // Log
    // console.log(children.length);

    // Values
    let count = 0;
    let maxCount = children.length;
    let searchTypeStrArr: string[] = [];
    let filterPathStrArr: string[] = [];

    // Loop
    for (let i = 0, n = children.length; i < n; i++) {
      // Logic
      if (children[i].style.display === 'flex') {
        // Count
        count++;

        // Mode
        if (changeButtonHref) {
          searchTypeStrArr.push(children[i].getAttribute('data-name') || '');
          filterPathStrArr.push(
            children[i].getAttribute('data-search-path') || ''
          );
        }
      }

      // Log
      //   console.log(children[i].style.display, children[i].style);
    }

    // All tags selected logic
    if (maxCount === count) {
      this.#allTagsSelected = true;
    } else {
      this.#allTagsSelected = false;
    }

    // Log
    // console.log(searchTypeStrArr);

    // Update
    this.#searchTypeStringArray = searchTypeStrArr;
    this.#searchFilterPathStringArray = filterPathStrArr;
    this.#numberOfSelectedTags = count;
  }

  // Variables
  #searchTypeStringArray: string[] = [];
  #searchFilterPathStringArray: string[] = [];
  #numberOfSelectedTags = 0;
  #allTagsSelected = false;

  // Define
  #styles: any;
  #elements: any;
  #objects: any;
  #handlers: any;
  #urlParams: any;

  // - - - Helper - - -

  #getCurrentRotation(el: HTMLElement) {
    var st = window.getComputedStyle(el, null);
    var tm =
      st.getPropertyValue('-webkit-transform') ||
      st.getPropertyValue('-moz-transform') ||
      st.getPropertyValue('-ms-transform') ||
      st.getPropertyValue('-o-transform') ||
      st.getPropertyValue('transform') ||
      'none';
    if (tm != 'none') {
      var values: any[] = tm.split('(')[1].split(')')[0].split(',');
      /*
      a = values[0];
      b = values[1];
      angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
      */
      //return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added
      var angle = Math.round(
        Math.atan2(values[1], values[0]) * (180 / Math.PI)
      );
      return angle < 0 ? angle + 360 : angle; //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
    }
    return 0;
  }
}

// + Exports +

// TypeDropDownView object
export default new TypeDropDownView();
