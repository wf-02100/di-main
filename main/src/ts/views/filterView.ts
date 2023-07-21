// + Imports +

// Base

// Custom
import * as config from '../config';
import suggestedSearchView from './suggestedSearchView';
import { removeEmptyParameters } from '../helper';

// + Helpers +
let isRadioCurrentlyOverwritten = false;
let isNotHumanFilterCall = true;

// + Classes +

// Base WebflowView
class FilterView {
  // - - - Main - - -

  // Main filter
  #filterMain(
    skip = 0,
    isPaginationCall = false,
    paginationCallback = () => {}
  ) {
    // Loading wheel handler
    if (!isNotHumanFilterCall) this.#handlers.showLoadingWheel();

    // First filter call logic
    if (isNotHumanFilterCall) {
      isNotHumanFilterCall = false;
    }

    // Values
    const _this = this;
    const zip =
      document
        .querySelector('[filter="location"]')
        ?.getAttribute('data-value') || '';
    const city =
      document
        .querySelector('[filter="location"]')
        ?.getAttribute('data-city-value') || '';
    let stateCode =
      document
        .querySelector('[filter="location"]')
        ?.getAttribute('data-state-code-value') || '';

    // Create query
    const query = `${
      zip !== '' || city !== ''
        ? `?plz=${zip}&stadt=${city}&bundeslaender=${stateCode}`
        : `?bundeslaender=${stateCode}`
    }&ueberspringen=${skip}&art=${this.#typeArray.join(',')}&sortieren=${
      this.#sortValue
    }&preis-von=${
      isNaN(this.#priceObject.from) ? '' : this.#priceObject.from
    }&preis-bis=${
      isNaN(this.#priceObject.to) ? '' : this.#priceObject.to
    }&zins-von=${
      isNaN(this.#yieldObject.from) ? '' : this.#yieldObject.from
    }&zins-bis=${
      isNaN(this.#yieldObject.to) ? '' : this.#yieldObject.to
    }&umkreis=${this.#radiusValue}`;

    // Type array logic
    const oldPathname = location.pathname;
    let pathname =
      document
        .querySelector('[filter-reset="type"]')
        ?.getAttribute('data-search-path') || location.pathname;
    if (this.#typeArray.length === 1) {
      // Elements
      const button = document
        .querySelector(`input[type="checkbox"][name="${this.#typeArray[0]}"]`)
        ?.closest('[filter="type"]') as HTMLInputElement;

      // Warn & guard
      if (!button) {
        console.warn(
          'Potential Error: filterView.ts -> #filterMain -> Click filter type buttons: button = ',
          button
        );
        return;
      }

      // Set
      pathname = button.getAttribute('data-search-path') || pathname;

      // Log
      // console.log(button.getAttribute('data-search-path'), pathname);
    }

    // Define
    const url = removeEmptyParameters(`${location.origin + pathname + query}`);

    // Log
    // console.log(url);

    // Update url without reloading
    window.history.replaceState('', '', url);

    // Reset load more button
    if (skip === 0) this.#handlers.resetNumberOfSkippings(isPaginationCall);

    // Clear object comparison bar
    if (!isPaginationCall) this.#handlers.clearObjectComparisonBar();

    // Log
    // console.log(query);
    // Await some filtered data
    // this.#handlers.updateMarkers();
    // this.#handlers.renderLoop();

    // Request data, manipulate if necessary & render
    if (isPaginationCall) paginationCallback();
    if (!isPaginationCall)
      (async () => {
        try {
          // Fetch
          const objectData = await _this.#handlers.getSearchObjectData(
            query,
            _this.#numberOfLists
          );

          // Render objects
          _this.#handlers.renderLoop(objectData);

          // Markers logic
          if (objectData.length > _this.#maxNumberOfObjects) objectData.pop();

          // Render markers
          _this.#handlers.updateMarkers(objectData);

          // Update Bundesänder
          if (zip !== '' && city !== '') {
            // Radius filter - Radius select
            isRadioCurrentlyOverwritten = true;
            const radiusSelect = document.querySelector(
              '[id="umkreis"]'
            ) as HTMLSelectElement;
            radiusSelect.value = _this.#radiusValue + 'km';
            isRadioCurrentlyOverwritten = false;

            // jVectorMap
            _this.#handlers.updateRegions(stateCode, 'zip');
            // console.log(stateCode, zip, city);
          } else {
            // Radius filter - Radius select
            isRadioCurrentlyOverwritten = true;
            const radiusSelect = document.querySelector(
              '[id="umkreis"]'
            ) as HTMLSelectElement;
            radiusSelect.value = '';
            isRadioCurrentlyOverwritten = false;

            // jVectorMap
            _this.#handlers.updateRegions(stateCode, 'standard');
          }

          // Log
          // console.log(objectData);
        } catch (err) {
          throw 'FilterView -> #filterMain -> (async () => {})(): ' + err;
        }
      })();

    // Different pathnames reload logic
    if (pathname !== oldPathname) {
      setTimeout(this.#handlers.showLoadingWheel, 10);
      location.reload();
    }
  }

  // Values
  #typeArray: string[] = [];
  #sortValue: string = '';
  #priceObject = { from: NaN, to: NaN };
  #yieldObject = { from: NaN, to: NaN };
  #statesString = '';
  #radiusValue: number;
  #tryFilterMain: () => void;

  // - - - Default - - -

  // Initialize
  init(stateData: any) {
    // Values
    this.#styles = stateData.styles;
    this.#objects = stateData.objects;
    this.#handlers = stateData.handlers;
    this.#urlParams = stateData.urlParams;

    // Umkreis default
    this.#radiusValue = this.#styles.searchRadiusDefault;

    // Elements
    this.#elements = stateData.elements;

    // Math helpers
    this.#numberOfLists = this.#elements.objectLists.length;
    this.#maxNumberOfObjects =
      this.#styles.numberOfObjectsPerList * this.#numberOfLists;

    // Log
    // console.log('I work');

    // Add suggest search
    suggestedSearchView.init(stateData, '.c-object_filter-search', false);

    // Init event listeners
    this.#initListeners();

    // Add filter handler
    this.#addFilterHandler();

    // Add existent url params data to filters
    this.#addUrlParamsData();

    // Update glocal value
    setTimeout(function () {
      isNotHumanFilterCall = false;
    }, 500);
  }

  // Math helpers
  #maxNumberOfObjects = 0;
  #numberOfLists = 0;

  // Define
  #styles: any;
  #elements: any;
  #objects: any;
  #handlers: any;
  #urlParams: any;

  // - - - Helpers - - -

  // Add existent url params data to filters
  #addUrlParamsData() {
    // Log
    // console.log('PRE FILL THE FILTERS BASED ON URL ! -- NEXT TODO!');
    // console.log(this.#urlParams);

    // Values
    const data = this.#urlParams;
    const _this = this;
    const formatter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });

    // + + + Set vals + + +
    this.#sortValue = data.sort;
    this.#radiusValue = data.radius;
    this.#statesString = data.states;

    // Log
    // console.log(data);

    // - - -

    // Sort select
    const sortSelect = document.querySelector(
      '[filter="sort"]'
    ) as HTMLSelectElement;
    sortSelect.value = data.sort;

    // Radius select
    const radiusSelect = document.querySelector(
      '[id="umkreis"]'
    ) as HTMLSelectElement;

    // Empty logic
    if (data.zip !== '') {
      isRadioCurrentlyOverwritten = true;
      radiusSelect.value = data.radius + 'km';
      isRadioCurrentlyOverwritten = false;
    } else {
      isRadioCurrentlyOverwritten = true;
      radiusSelect.value = '';
      isRadioCurrentlyOverwritten = false;
    }

    // Add zip to input if existent
    this.#addZipToSearchInput();

    // - Price -
    [
      { str: 'from', name: 'minPrice' },
      { str: 'to', name: 'maxPrice' },
    ].forEach(obj => {
      // Elements
      const input = document.querySelector(
        `[filter="price-${obj.str}"]`
      ) as HTMLInputElement;

      // Values
      const val = parseInt(data[obj.name].replace(/\D/g, ''));

      // Set
      _this.#priceObject[obj.str] = val;

      // Guard
      if (isNaN(val)) return;

      // Make it look nice
      input.value = formatter.format(val);
    });

    // - Yield -
    [
      { str: 'from', name: 'minYield' },
      { str: 'to', name: 'maxYield' },
    ].forEach(obj => {
      // Elements
      const input = document.querySelector(
        `[filter="yield-${obj.str}"]`
      ) as HTMLInputElement;

      // Values
      const val = parseFloat(
        data[obj.name].replace(/[^\d,]+/g, '').replace(',', '.')
      );

      // Set
      _this.#yieldObject[obj.str] = val;

      // Guard
      if (isNaN(val)) return;

      // Make it look nice
      input.value = val.toFixed(2).replace('.', ',') + ' %';
    });

    // - Click filter type buttons -
    data.assets.split(',').forEach((str: string) => {
      // Elements
      const input = document.querySelector(
        `input[type="checkbox"][name="${str}"]`
      ) as HTMLInputElement;

      // Warn
      if (!input)
        console.warn(
          'Potential Error: filterView.ts -> #addUrlParamsData -> Click filter type buttons: input = ',
          input
        );

      // Action
      input?.click();

      // Log
      // console.log(str, input);
    });

    // Log
    // console.log("Add url params data please")
  }

  // Add zip to input if existent
  #addZipToSearchInput() {
    // Values
    const zip = this.#urlParams.zip;
    const city = this.#urlParams.city;
    const stateCodes = this.#statesString;

    // Elements
    const input = document.querySelector(
      '[filter="location"]'
    ) as HTMLInputElement;

    // Action
    input.value =
      zip === '' || zip === null
        ? this.#urlParams.search
        : zip + (city === '' || city === null ? '' : ' ' + city);
    input.setAttribute('data-value', zip || '');
    input.setAttribute('data-city-value', city || '');
    input.setAttribute('data-state-code-value', stateCodes || '');

    // States code logic
    if (stateCodes !== '' && zip === '' && city === '')
      this.#overWriteSearch(
        this.#generateStatesOverWriteSearchString(stateCodes)
      );
  }

  // Add event listeners
  #initListeners() {
    // Values
    let timeout: null | number;
    const _this = this;
    const formatter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });

    // Buffer filterting
    function tryFilterMain() {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(function () {
        // Async call
        _this.#filterMain();
      }, _this.#styles.suggestedSearchBufferTime * 1000);
    }
    this.#tryFilterMain = tryFilterMain;

    // Log
    // console.log(this.#objects);

    // - - - Event listeners - - -

    // - Reset all -
    const resetAllButtons = document.querySelectorAll('[filter="reset-all"]');

    resetAllButtons.forEach((resetAllButton: any) => {
      resetAllButton.onclick = resetAllFunction;
    });

    function resetAllFunction() {
      // Elements
      const sort: HTMLSelectElement | null =
        document.querySelector('[filter="sort"]');
      const fromPrice: HTMLInputElement | null = document.querySelector(
        '[filter="price-from"]'
      );
      const toPrice: HTMLInputElement | null = document.querySelector(
        '[filter="price-to"]'
      );
      const fromYield: HTMLInputElement | null = document.querySelector(
        '[filter="yield-from"]'
      );
      const toYield: HTMLInputElement | null = document.querySelector(
        '[filter="yield-to"]'
      );
      const search: HTMLInputElement | null = document.querySelector(
        '[filter="location"]'
      );
      const typeReset: HTMLElement | null = document.querySelector(
        '[filter-reset="type"]'
      );

      // HTML action
      [sort, fromPrice, toPrice, fromYield, toYield, search].forEach(input => {
        if (input) input.value = '';
      });

      if (typeReset) typeReset.click();
      if (typeReset) typeReset.click();

      // Value reset
      search?.removeAttribute('data-value');
      search?.removeAttribute('data-city-value');
      search?.removeAttribute('data-state-code-value');

      _this.#sortValue = '';
      _this.#radiusValue = _this.#styles.searchRadiusDefault;
      _this.#priceObject.from = 0;
      _this.#priceObject.to = 0;
      _this.#yieldObject.from = 0;
      _this.#yieldObject.to = 0;

      // Call Filter function
      tryFilterMain();
    }

    // - Type -
    this.#addTypeFilterEventListeners();
    this.#addTryStateFilterHandler();

    // - Sort -
    document
      .querySelector('[filter="sort"]')
      ?.addEventListener('change', function () {
        _this.#sortValue = this.value;
        tryFilterMain();
      });

    // - Radius -
    document
      .querySelector('[id="umkreis"]')
      ?.addEventListener('change', function () {
        if (!isRadioCurrentlyOverwritten) {
          _this.#radiusValue = this.value.replace(/\D/g, '');
          tryFilterMain();
        }
      });

    // - Price -
    ['from', 'to'].forEach(str => {
      // Elements
      const input = document.querySelector(
        `[filter="price-${str}"]`
      ) as HTMLInputElement;

      // Event listeners
      input?.addEventListener('change', function () {
        // Values
        const val = parseInt(input.value.replace(/\D/g, ''));

        // Set
        _this.#priceObject[str] = val;
        tryFilterMain();

        // Guard
        if (isNaN(val)) {
          input.value = '';
          return;
        }

        // Make it look nice
        input.value = formatter.format(val);
      });
    });

    // - Yield -
    ['from', 'to'].forEach(str => {
      // Elements
      const input = document.querySelector(
        `[filter="yield-${str}"]`
      ) as HTMLInputElement;

      // Event listeners
      input?.addEventListener('change', function () {
        // Values
        const val = parseFloat(
          input.value.replace(/[^\d,]+/g, '').replace(',', '.')
        );

        // Set
        _this.#yieldObject[str] = val;
        tryFilterMain();

        // Guard
        if (isNaN(val)) {
          input.value = '';
          return;
        }

        // Make it look nice
        input.value = val.toFixed(2).replace('.', ',') + ' %';
      });
    });

    // - - -
  }

  #addTypeFilterEventListeners() {
    // Values
    const _this = this;
    const tryFilterMain = this.#tryFilterMain;

    // - Main -

    // Checkboxes
    const clickedTypeFiltersArray: any[] = [];
    const typeFilters = document.querySelectorAll('[filter="type"]') as any;
    typeFilters.forEach((typeFilter: any, index: number) => {
      // Values
      const type =
        typeFilter
          .querySelector('input')
          ?.getAttribute('data-name')
          ?.toLowerCase() || '';
      let typeFilterIsDoubleClick = false;

      // Event listener
      typeFilter.addEventListener('click', function () {
        // Guard
        if (typeFilterIsDoubleClick) return;

        // Timeout
        typeFilterIsDoubleClick = true;
        setTimeout(function () {
          typeFilterIsDoubleClick = false;
        }, 100);

        // Logic
        if (!clickedTypeFiltersArray.includes(index)) {
          // Add
          clickedTypeFiltersArray.push(index);
          _this.#typeArray.push(type);
        } else {
          // Remove
          const tmpIndex = clickedTypeFiltersArray.indexOf(index);
          if (tmpIndex > -1) {
            clickedTypeFiltersArray.splice(tmpIndex, 1);
            _this.#typeArray.splice(tmpIndex, 1);
          }
        }

        // Try Filter main
        tryFilterMain();
      });

      // Test
      // typeFilter.click();
    });

    // Clear
    const clearTypeFiltersCheckbox = document.querySelector(
      '[filter-reset="type"]'
    );
    let clearTypeFiltersCheckboxIsDoubleClick = false;
    clearTypeFiltersCheckbox?.addEventListener('click', function () {
      // Guard
      if (clearTypeFiltersCheckboxIsDoubleClick) return;

      // Timeout
      clearTypeFiltersCheckboxIsDoubleClick = true;
      setTimeout(function () {
        clearTypeFiltersCheckboxIsDoubleClick = false;
      }, 100);

      // Reset everything clicked
      this.click();

      // Guard two
      if (clickedTypeFiltersArray.length < 1) return;
      clickedTypeFiltersArray.forEach(n => {
        setTimeout(function () {
          typeFilters[n].click();
        }, 10);
      });

      // Try Filter main
      tryFilterMain();
    });
  }

  // Add handler
  #addFilterHandler() {
    // Values
    const _this = this;
    let timeout: null | number;

    // Add
    this.#handlers.filter = function (
      skip = 0,
      isPaginationCall = false,
      paginationCallback = () => {}
    ) {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(function () {
        // Filter
        _this.#filterMain(skip, isPaginationCall, paginationCallback);
      }, _this.#styles.suggestedSearchBufferTime * 1000);
    };
  }

  // Add try state filter handler
  #addTryStateFilterHandler() {
    // Values
    const _this = this;
    let timeout: null | number;

    // Add
    this.#handlers.tryStateFilter = function (statesString = '') {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(function () {
        // Async set & call
        _this.#statesString = statesString;

        // Clear suggested search & Fill with Bundesländer
        _this.#overWriteSearch(
          _this.#generateStatesOverWriteSearchString(statesString)
        );

        // Filter
        _this.#filterMain();
      }, _this.#styles.suggestedSearchBufferTime * 1000);
    };
  }

  // Generate states over write search string
  #generateStatesOverWriteSearchString(statesString: string) {
    // Log
    // console.log(statesString);

    // Values
    let str = statesString
      .split(',')
      .map(code => {
        // Values
        let stateData: any;

        // Suggested state data loop
        suggestedStateData.forEach(datum => {
          if (datum.code === code) stateData = datum;
        });

        // Guard
        if (!stateData) return ' ';

        // Return
        return stateData.prettyName;
      })
      .join(', ')
      .replace(/ , /g, '');
    str =
      statesString.split(',').length === 1
        ? str + ' (Bundesland)'
        : str + ' (Bundesländer)';
    str = str === '  (Bundesland)' ? '' : str;

    // Return
    return { prettyString: str, statesString: statesString };
  }

  // Clear suggested search & Fill with Bundesländer
  #overWriteSearch(obj: { prettyString: string; statesString: string }) {
    // Elements
    const input: HTMLInputElement | null = document.querySelector(
      '[filter="location"]'
    );

    // Guard
    if (!input) return;

    // Action
    input.setAttribute('data-value', ``);
    input.setAttribute('data-city-value', ``);
    input.setAttribute('data-state-code-value', `${obj.statesString}`);
    input.value = obj.prettyString;
  }

  // Event listeners
  // addHandler(handler, events = ['load', 'pageshow'], object = window) {
  //   events.forEach(event => object.addEventListener(event, handler));
  // }
}

// + Helpers +
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
  { code: 'ni', prettyName: 'Niedersachsen', searchStr: 'niedersachsen' },
  {
    code: 'nw',
    prettyName: 'Nordrhein-Westfalen',
    searchStr: 'nordrhein westfalen nrw North Rhine Westphalia',
  },
  { code: 'rp', prettyName: 'Rheinland-Pfalz', searchStr: 'rheinland pfalz' },
  { code: 'sl', prettyName: 'Saarland', searchStr: 'saarland' },
  { code: 'sn', prettyName: 'Sachsen', searchStr: 'sachsen' },
  { code: 'st', prettyName: 'Sachsen-Anhalt', searchStr: 'sachsen anhalt' },
  {
    code: 'sh',
    prettyName: 'Schleswig-Holstein',
    searchStr: 'schleswig holstein',
  },
  { code: 'th', prettyName: 'Thüringen', searchStr: 'thüringen' },
  { code: 'bb', prettyName: 'Brandenburg', searchStr: 'brandenburg' },
];

// + Exports +

// FilterView object
export default new FilterView();
