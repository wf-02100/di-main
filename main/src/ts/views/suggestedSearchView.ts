// + Imports +

// Base

// Custom
import * as config from '../config';
import { scriptLoader } from '../helper';
import typeDropDownView from './typeDropDownView';

// import { getDiData } from '../model';

// Help data
let sufficientResultsFound = false;
let lastClickedStateCode = '';
const suggestedStateData = [
  { code: 'be', prettyName: 'Berlin', searchStr: 'berlin ' },
  { code: 'by', prettyName: 'Bayern', searchStr: 'bayern bavaria' },
  {
    code: 'bw',
    prettyName: 'Baden-Württemberg',
    searchStr: 'baden württemberg',
  },
  { code: 'hh', prettyName: 'Hamburg', searchStr: 'hamburg hanse stadt ' },
  { code: 'hb', prettyName: 'Bremen', searchStr: 'bremen' },
  { code: 'he', prettyName: 'Hessen', searchStr: 'hessen' },
  {
    code: 'mv',
    prettyName: 'Mecklenburg-Vorpommern',
    searchStr: 'mecklenburg vorpommern',
  },

  {
    code: 'nw',
    prettyName: 'Nordrhein-Westfalen',
    searchStr: 'nordrhein westfalen nrw North Rhine Westphalia',
  },
  { code: 'rp', prettyName: 'Rheinland-Pfalz', searchStr: 'rheinland pfalz' },
  { code: 'sl', prettyName: 'Saarland', searchStr: 'saarland' },
  { code: 'sn', prettyName: 'Sachsen', searchStr: 'sachsen' },
  { code: 'st', prettyName: 'Sachsen-Anhalt', searchStr: 'sachsen anhalt' },
  { code: 'ni', prettyName: 'Niedersachsen', searchStr: 'niedersachsen' },
  {
    code: 'sh',
    prettyName: 'Schleswig-Holstein',
    searchStr: 'schleswig holstein',
  },
  { code: 'th', prettyName: 'Thüringen', searchStr: 'thüringen' },
  { code: 'bb', prettyName: 'Brandenburg', searchStr: 'brandenburg' },
];

// + Classes +

// Base JVectorMapView
class SuggestedSearchView {
  // - Main function -

  // Format
  #formatStringForSearch(str = '', resultsText: false | string = false) {
    // Format query 1
    str = str
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z^0-9\-_ßöäü]/gi, '')
      .replace(/bundes(land|länder)/gi, '');

    // Zip / city logic
    let numbers = str.replace(/[^0-9]/gi, '');
    let city = str.replace(/[^a-z]/gi, '');
    str =
      numbers.length >= city.length
        ? str.replace(/[a-z]/gi, '').replace(/-/g, ' ')
        : str
            .replace(/[0-9]/gi, '')
            .replace(/-/g, ' ')
            .trim()
            .replace(/ /g, '-');

    // Format query 2
    str = str
      .trim()
      .split(/[_-]/g)
      .map(query => {
        const firstChar = query.charAt(0).toUpperCase();
        return firstChar + query.substring(1);
      })
      .join('-');

    // Response
    const res = {
      apiStr: str.replace(/-/g, ' '),
      prettyStr: str,
    };

    // Reformat pretty string
    // const tmpArr: any[] = [];
    // if (resultsText) {
    //   console.log('Ey - ');
    //   resultsText.split(/[\s\-]/gi).forEach(resultsStr => {
    //     // Push
    //     tmpArr.push({ rightChar: resultsText.split(resultsStr)[1][0] || '' });
    //     console.log(tmpArr);
    //   });
    // }

    // Log
    // console.log(res);

    // Return
    return res;
  }

  // Render
  #renderResults(data: any[], query: string) {
    // Values
    const _this = this;

    // Show results
    this.#showResults();

    // Elements
    const mount: HTMLElement = this.#elements.suggestedSearchResultsMount;
    const template: HTMLElement = this.#elements.suggestedSearchResultsTemplate;

    // Clear previous results
    mount.innerHTML = '';

    // Loop
    data.forEach(result => {
      // Elements
      const clone = template.cloneNode(true) as HTMLElement;

      // Define
      let text: string = result.zip + ' ' + result.city;

      // let text: string =
      //   result.category === 'administrative'
      //     ? result.address_line1
      //     : result.address_line2;
      // text = result.result_type === 'postcode' ? result.address_line1 : text;

      // // Clean up result
      // text = text.replace(', Deutschland', '');

      if (result) {
        result.state = suggestedStateData.filter(
          data => data.prettyName === result.state
        )[0]?.code;
      }

      // Event listener
      clone.addEventListener('click', function () {
        _this.#searchForQuery(result.zip, result.city, false, result.state);
      });

      // Highlight search
      let regex: string | RegExp = '_empty_';
      try {
        regex = new RegExp(
          `${_this.#formatStringForSearch(query).apiStr}`,
          'gi'
        );
      } catch {
        // Error log
        // console.log(regex);
      }

      const tmpArr = text.split(regex);
      if (tmpArr.length == 2) {
        text = `${tmpArr[0]}<span 
            style="font-weight: 600;"
          >${
            tmpArr[0] === ''
              ? text.split(tmpArr[1])[0]
              : text.split(tmpArr[0])[1].split(tmpArr[1]).length === 2
              ? text.split(tmpArr[0])[1].split(tmpArr[1])[0]
              : text.split(tmpArr[0])[1]
          }</span>${tmpArr[1]}`;
      }

      // Manipulate
      clone.innerHTML = text;

      // Append
      mount.append(clone);

      // Log
      // console.log(text);
    });

    // Add suggested bundesland
    let suggestedState = '';
    let suggestedStateCode = '';
    suggestedStateData.every(obj => {
      // Values
      const str = obj.searchStr.toLocaleLowerCase();
      const q = query.toLocaleLowerCase().replace(/[_-]/g, ' ');

      // Logic
      if (str.indexOf(q) > -1) {
        suggestedState = obj.prettyName;
        suggestedStateCode = obj.code;
        return false;
      }

      // Continue
      return true;
    });

    (() => {
      // Guard
      if (suggestedState === '') return;

      // Elements
      const clone = template.cloneNode(true) as HTMLElement;

      // Define
      let text: string = suggestedState + ' (Bundesland)';

      // Event listener
      clone.addEventListener('click', function () {
        lastClickedStateCode = suggestedStateCode;
        _this.#searchForQuery(
          suggestedState + ' (Bundesland)',
          '',
          suggestedStateCode
        );
      });

      // Adjust query
      query = _this.#formatStringForSearch(query, text).prettyStr;

      // Highlight search
      let tmpArr = text.split(query);
      if (tmpArr.length == 2) {
        text = `${tmpArr[0]}<span
            style="font-weight: 600;"
          >${query}</span>${tmpArr[1]}`;
      } else {
        tmpArr = text.split(query.toLowerCase());
        if (tmpArr.length == 2) {
          text = `${tmpArr[0]}<span 
              style="font-weight: 600;"
            >${query.toLowerCase()}</span>${tmpArr[1]}`;
        }
      }

      // Manipulate
      clone.innerHTML = text;

      // Append
      mount.append(clone);
    })();

    // Guard
    if (data.length < 1 && suggestedState === '') {
      this.#hideResults();
      sufficientResultsFound = false;
      return;
    } else {
      sufficientResultsFound = true;
    }

    // Log
    // console.log(data);
  }

  // Fetch suggested results
  async #tryFetchResults(str: string) {
    try {
      const res = this.#formatStringForSearch(str);

      // Call
      const data = await this.#handlers.returnSuggestSearchData(res.apiStr);
      const results: any[] = data;

      // // Guard
      // if (results.length < 1) {
      //   this.#hideResults();
      //   return;
      // }

      // Render results
      this.#renderResults(results, str);

      // Log
      // console.log(data);
    } catch (err) {
      throw `suggestedSearchView.ts -> #tryFetchResults: ${err}`;
    }
  }

  // Event listeners
  #addHandler(
    handler: () => void,
    events = ['load', 'pageshow'],
    object = window
  ) {
    events.forEach(event => object.addEventListener(event, handler));
  }

  // Add event listener
  #initListeners() {
    // Elements
    const elements = this.#elements;
    const form = elements.suggestedSearchInput.closest(
      'form'
    ) as HTMLFormElement;

    // Values
    const _this = this;
    let timeout: any;

    // Guard
    if (elements.suggestedSearchInput.nodeName !== 'INPUT')
      throw new Error('suggestedSearchView.ts -> #initListeners -> Guard');

    // On change listener - trim
    this.#addHandler(
      function () {
        // Elements
        const input = this as HTMLInputElement;

        // Trim
        input.value = input.value.trim();
      },
      ['change'],
      elements.suggestedSearchInput
    );

    // jVectorMapBased dot filter
    if (!this.#isNotFilterSearch) {
      // Add new handler
      this.#handlers.jVectorMapDotQuerySearch = function (
        zip = '',
        city = '',
        state = ''
      ) {
        _this.#searchForQuery(zip, city, false, state);
      };
    }

    // Object type listener - On homepage
    if (
      this.#isNotFilterSearch &&
      !this.#isFinderView &&
      this.#styles.searchButtonModeActive
    ) {
      // // Values
      // const _this = this;
      // // ELements
      // const objectTypeSelect = document.querySelector('[data-name="Art"]');
      // // Log
      // // console.log(objectTypeSelect);
      // // Listener
      // objectTypeSelect?.addEventListener('change', function () {
      //   _this.#searchForQuery();
      // });

      // Add new handler
      this.#handlers.searchForQuery = function (modes: {
        typeDropDownDownClick: false;
      }) {
        _this.#searchForQuery(
          false,
          '',
          false,
          '',
          modes.typeDropDownDownClick
        );
      };
    }

    // Focus out protection
    let hoveringOverSuggestedResults = false;
    this.#addHandler(
      function () {
        hoveringOverSuggestedResults = true;
      },
      ['mouseover'],
      elements.suggestedSearchResultsMount
    );
    this.#addHandler(
      function () {
        hoveringOverSuggestedResults = false;
      },
      ['mouseout'],
      elements.suggestedSearchResultsMount
    );

    // Focus out listener
    this.#addHandler(
      // Function
      function () {
        // Elements
        const input = this as HTMLInputElement;

        // Guard
        if (hoveringOverSuggestedResults) {
          return;
        }

        // If finder
        if (_this.#isFinderView) _this.#searchForQuery();

        // Log
        // console.log('I wanna hide!');

        // Hide
        _this.#hideResults();
      },
      ['focusout'],
      elements.suggestedSearchInput
    );

    // Event listener input
    this.#addHandler(
      function () {
        // Elements
        const input = this as HTMLInputElement;

        // Guard
        if (input.value.trim().length < 3) {
          input.setAttribute('data-value', '');
          input.setAttribute('data-city-value', '');
          input.setAttribute('data-state-code-value', '');
          if (!_this.#isNotFilterSearch) _this.#handlers.filter();
          _this.#hideResults();
          return;
        }

        // Buffer searches
        if (timeout !== null) clearTimeout(timeout);
        timeout = setTimeout(function () {
          // Async call
          _this.#tryFetchResults(input.value);
        }, _this.#styles.suggestedSearchBufferTime * 1000);

        // Log
        // console.log(input.value);
      },
      ['input'],
      elements.suggestedSearchInput
    );

    // Event listener focus on
    this.#addHandler(
      function () {
        // Elements
        const input = this as HTMLInputElement;

        // Show
        if (input.value.length >= 3 && sufficientResultsFound === true) {
          _this.#showResults();
          return;
        }
      },
      ['focus'],
      elements.suggestedSearchInput
    );

    // Prevent default
    form.addEventListener('keydown', function (event: KeyboardEvent) {
      if (event.which == 13 || event.keyCode == 13) {
        // Default
        event.preventDefault();

        // Guard
        if (elements.suggestedSearchInput.value.trim().length < 3) {
          _this.#hideResults();
          return;
        }

        // Action
        _this.#searchForQuery();

        // Alert
        // alert(event.keyCode);
      }
    });
  }

  // Search
  async #searchForQuery(
    zipCode: string | boolean = false,
    city = '',
    isStateClick: string | boolean = false,
    stateCode = '',
    typeDropDownDownClick = false
  ) {
    // Values
    const _this = this;

    // Log
    // console.log(zipCode, _this.#elements);

    // Try ... catch ...
    try {
      // Elements
      const input = _this.#elements.suggestedSearchInput as HTMLInputElement;

      // Await logic
      if (zipCode === false) {
        // console.log(
        //   zipCode,
        //   city,
        //   isStateClick,
        //   stateCode,
        //   this.#formatStringForSearch(
        //     _this.#elements.suggestedSearchInput.value
        //   )
        // );

        // Call
        let results: any[];
        if (
          !typeDropDownDownClick &&
          _this.#elements.suggestedSearchInput.value.indexOf('(Bundes') <= -1
        ) {
          const data =
            this.#formatStringForSearch(
              _this.#elements.suggestedSearchInput.value
            ).apiStr.length > 2
              ? await _this.#handlers.returnSuggestSearchData(
                  _this.#formatStringForSearch(
                    _this.#elements.suggestedSearchInput.value
                  ).apiStr
                )
              : [{ zip: '', city: '', state: '' }];
          results = data;
        } else {
          results = [];
        }

        // Manipulate state code
        if (results[0]) {
          results[0].state = suggestedStateData.filter(
            data => data.prettyName === results[0].state
          )[0]?.code;
        }

        // Log
        // console.log(results[0], ' <--');

        // Guard
        if (results.length < 1)
          results = [
            {
              zip: input.getAttribute('data-value') || '',
              city: input.getAttribute('data-city-value') || '',
              state: input.getAttribute('data-state-code-value') || '',
            },
          ];

        // Log
        // console.log(results, ' <-- Query search');

        // Set
        zipCode = results[0].zip;
        city = results[0].city;
        stateCode = results[0].state || '';

        if (stateCode !== '' && city === '' && zipCode === '')
          isStateClick = stateCode;

        // Log
        // console.log(zipCode, city, stateCode, isStateClick);
        // zipCode = results[0].address_line1 + ', ' + results[0].address_line2;
      }

      // Manipulate
      zipCode = zipCode.toString().split(',')[0];

      // Encode
      // zipCode = encodeURIComponent(zipCode);

      // // Log
      // console.log(zipCode, stateCode, city);

      // - - - + + + - - -

      // Action
      let fullSuggestedSearchString = '';
      suggestedStateData.forEach(datum => {
        if (datum.code === lastClickedStateCode)
          fullSuggestedSearchString = datum.prettyName + ' (Bundesland)';
      });
      input.value =
        zipCode === '' || zipCode === null
          ? isStateClick !== false
            ? fullSuggestedSearchString
            : ''
          : zipCode + ' ' + city;

      if (isStateClick !== false) {
        input.setAttribute('data-value', '');
        input.setAttribute('data-city-value', '');
        input.setAttribute('data-state-code-value', lastClickedStateCode);
      } else {
        input.setAttribute('data-value', zipCode);
        input.setAttribute('data-city-value', city);
        input.setAttribute('data-state-code-value', stateCode);
      }

      // Is not home search feature
      if (!_this.#isNotFilterSearch || _this.#isFinderView) {
        // Hide results
        _this.#hideResults();

        // Call filterView.ts
        if (!_this.#isNotFilterSearch) _this.#handlers.filter();

        // Return & skip code below
        return;
      }

      // - - - + + + - - -

      // Get object type
      const objectTypeSelect = document.querySelector(
        '.c-home_tags-container'
      ) as HTMLSelectElement;
      const objectTypeValue =
        objectTypeSelect?.getAttribute('data-value') || '';
      const objectSearchPath =
        objectTypeSelect?.getAttribute('data-search-path') || '';

      // State click logic
      if (isStateClick === false && zipCode.indexOf(' (Bundesland)') > -1)
        isStateClick = lastClickedStateCode;

      // Log
      // console.log(isStateClick, lastClickedStateCode);

      // Define
      const url = encodeURI(
        (objectSearchPath === ''
          ? _this.#styles.objectSearchPath
          : objectSearchPath) +
          (isStateClick === false ? '?plz=' + zipCode : '?suche=' + zipCode) +
          (isStateClick === false
            ? '&stadt=' + city + '&bundeslaender=' + stateCode
            : '&bundeslaender=' + lastClickedStateCode) +
          '&art=' +
          objectTypeValue
      );

      // Log
      // console.log(url);

      // Redirect logic
      if (!_this.#styles.searchButtonModeActive) {
        location.href = url;
      } else {
        // Action
        _this.#hideResults();

        // Change url of button
        const button = document.querySelector(
          '[suggested-search="submit"]'
        ) as HTMLButtonElement;
        button.setAttribute('href', url);

        // Log
        // console.log(
        //   decodeURIComponent(zipCode),
        //   url,
        //   objectTypeSelect,
        //   objectTypeValue
        // );
      }
    } catch (err) {
      throw `suggestedSearchView.ts -> #searchForQuery: ${err}`;
    }

    // Log
    // console.log(query);
  }

  // - Helpers -
  #showResults() {
    // Define
    const wrapper: HTMLElement = this.#elements.suggestedSearchResultsWrapper;

    // Guard
    if (wrapper === null) return;

    // Set
    wrapper.style.display = 'block';
  }

  #hideResults() {
    // Define
    const wrapper: HTMLElement = this.#elements.suggestedSearchResultsWrapper;

    // Guard
    if (wrapper === null) return;

    // Set
    wrapper.style.display = 'none';
  }

  // - Initialize -
  init(
    stateData: any,
    mountQuerySelector = '[data-name="Suche"]',
    isNotFilterSearch = true,
    isFinderView = false
  ) {
    // Values
    this.#styles = stateData.styles;
    // this.#objects = stateData.objects;
    this.#handlers = stateData.handlers;
    this.#isNotFilterSearch = isNotFilterSearch;
    this.#isFinderView = isFinderView;

    // Elements
    this.#elements = stateData.elements || {};

    // Create search element // Delete later
    this.#createSearchElement(mountQuerySelector);

    // Call
    this.#initListeners();

    // If home search
    if (isNotFilterSearch && !isFinderView) {
      typeDropDownView.init(stateData);
    }
  }

  // Define
  #styles: any;
  #elements: any;
  // #objects: any;
  #handlers: any;
  #isNotFilterSearch: boolean;
  #isFinderView: boolean;

  // Create search elements
  #createSearchElement(mountQuerySelector: string) {
    // Elements
    let mount = document.querySelectorAll(mountQuerySelector)[0] as HTMLElement;
    const parentForm = mount?.closest('form');

    // Log
    // console.log(mount, mountQuerySelector);

    // Guard
    if (typeof mount !== 'object')
      throw new Error(
        'suggestedSearchView.ts -> #createSearchElement -> Guard: mount does not equal object'
      );

    // Wrap input
    mount.outerHTML =
      '<div id="suggested-search-input-wrapper" class="" style="position:relative; width:100%; z-index: 3;">' +
      mount.outerHTML +
      '</div>';
    mount = parentForm?.querySelector(
      '[id="suggested-search-input-wrapper"]'
    ) as HTMLElement;

    // Log
    // console.log(mount);

    // Create & mount
    mount.insertAdjacentHTML(
      'beforeend',
      `
           <div
             id="suggested-search-result-wrapper"
             style="
               position: absolute;
               top: ${
                 this.#isNotFilterSearch && !this.#isFinderView
                   ? 38 + 8
                   : 38 + 16
               }px;
               left: 0em;
               background: white;
               width: 100%;
               border: 0.07em solid #000;
               border-radius: 0.35em;
               padding: 0.5em 0.5em 0.5em 0.5em;
               text-align: left;
               display: none;
             "
           >
             <ul
               id="suggested-search-result-mount"
               class="c-list w-list-unstyled"
               role="list"
             >
               <li
                 id="suggested-search-result-template"
                 style="
                   padding: 0.25em 0.5em 0.25em 0.5em;
                   margin: 0.25em 0em 0.25em 0;
                   background: #f9f9f9;
                   cursor: pointer;
                 "
               >${'... PLZ ... Stadt ...'}</li>
             </ul>
           </div>`
    );

    // - Add new elements to #elements -

    // Define
    const suggestedSearchInput = mount.querySelector('input'); // document.querySelector('[id="suggested-search"]');

    const suggestedSearchResultsWrapper = parentForm?.querySelector(
      '[id="suggested-search-result-wrapper"]'
    );
    const suggestedSearchResultsMount = parentForm?.querySelector(
      '[id="suggested-search-result-mount"]'
    );
    const suggestedSearchResultsTemplate = parentForm
      ?.querySelector('[id="suggested-search-result-template"]')
      ?.cloneNode(true);

    // Log
    // console.log(
    //   suggestedSearchInput,
    //   suggestedSearchResultsWrapper,
    //   suggestedSearchResultsMount,
    //   suggestedSearchResultsTemplate
    // );

    // Add
    const elements = this.#elements;
    elements.suggestedSearchInput = suggestedSearchInput;
    elements.suggestedSearchResultsWrapper = suggestedSearchResultsWrapper;
    elements.suggestedSearchResultsMount = suggestedSearchResultsMount;
    elements.suggestedSearchResultsTemplate = suggestedSearchResultsTemplate;
  }
}

// + Exports +

// SuggestedSearchView object
export default new SuggestedSearchView();

// `
//       <form style="margin-top: 3em; padding-bottom: 10em;" class="c-form">
//         <label
//           for="suggested-search"
//           class="c-text cc-400"
//         >${'Suchen Sie Immobilien in ganz Deutschland:'}</label>
//         <div style="position: relative;">
//           <input
//             type="text"
//             class="c-form_field w-input"
//             maxlength="256"
//             name="Suggested search"
//             data-name="Suggested search"
//             placeholder"Hamburg..."
//             id="suggested-search"
//           >
//           <div
//             id="suggested-search-result-wrapper"
//             style="
//               position: absolute;
//               top: ${38 + 8}px;
//               left: 0em;
//               background: white;
//               width: 100%;
//               border: 0.07em solid #000;
//               border-radius: 0.35em;
//               padding: 0.5em 0.5em 0.5em 0.5em;
//             "
//           >
//             <ul
//               id="suggested-search-result-mount"
//               class="c-list w-list-unstyled"
//               role="list"
//             >
//               <li
//                 id="suggested-search-result-template"
//                 style="
//                   padding: 0.25em 0.5em 0.25em 0.5em;
//                   margin: 0.25em 0em 0.25em 0;
//                   background: #f9f9f9;
//                   cursor: pointer;
//                 "
//               >${'Hamburg Altona, 08245'}</li>
//             </ul>
//           </div>
//         </div>

//       </form>
//     `
