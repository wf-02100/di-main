// + Imports +

// Base
// import { $, gsap } from '../../../global';

// Custom
import { mark } from 'regenerator-runtime';
import * as config from '../config';
import { scriptLoader } from '../helper';

// + Declare +
declare var $: any;
declare var gsap: any;

// + Helper data +
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

// + Classes +

// Base JVectorMapView
class JVectorMapView {
  // Main function
  #jVectorMapMain() {
    // Values
    const styles = this.#styles,
      objects = this.#objects,
      _this = this;

    // Marker value loop
    let markers: any = [];
    function createMarkers(objectsData: any[]) {
      // Clear
      markers = [];

      // Loop
      objectsData.forEach(
        (data: {
          address: { lat: any; lng: any; city: any; zip: any; state: any };
          name: any;
          id: any;
        }) => {
          // Push
          markers.push({
            latLng: [data.address.lat, data.address.lng],
            name: `${data.name} - ${data.address.city}`,
            id: data.id,
            zip: data.address.zip,
            city: data.address.city,
            stateCode: (() => {
              if (data.address.state) {
                return suggestedStateData.filter(
                  stateData => stateData.prettyName === data.address.state
                )[0].code;
              }
            })(),
          });

          // Log
          // console.log(markers);
        }
      );
    }
    createMarkers(objects);

    // const cityAreaData = [
    //   887.7, 755.16, 310.69, 405.17, 248.31, 207.35, 217.22, 280.71, 210.32,
    //   325.42,
    // ];

    // Regions code array
    const selectedRegionCodesArray: string[] = [];

    // Map
    let initialStatesAdded = false;
    let pauseMapDot = false;

    // Mount & define
    $(`#${this.#styles.jVectorMapId}`).vectorMap({
      // Base
      map: 'de_merc',

      // Config
      zoomOnScroll: false,
      panOnDrag: false,
      zoomButtons: false,

      regionsSelectable: true,
      markersSelectable: true,

      // * Functions *

      // . Region .
      onRegionSelected: function (
        event: Event,
        stateCode: string,
        clickState: boolean
      ) {
        // Guard
        // if (!initialStatesAdded) return;

        // Values
        const sCode = stateCode.replace('DE-', '').toLowerCase();

        // Logic
        if (clickState) {
          // State is selected
          selectedRegionCodesArray.push(sCode);
        } else {
          // State is not selected
          const tmpIndex = selectedRegionCodesArray.indexOf(sCode);
          if (tmpIndex > -1) {
            selectedRegionCodesArray.splice(tmpIndex, 1);
          }
        }

        // Try to filter the states
        if (initialStatesAdded)
          _this.#handlers.tryStateFilter(selectedRegionCodesArray.join(','));

        // Deseclt edgecase
        if (!clickState) {
          // Elements
          const svg: HTMLElement | null | undefined =
            _this.#elements.jVectorMapMount.querySelector(
              `[data-code="${stateCode}"]`
            );

          // Guard
          if (!svg) return;

          // Guard
          if (svg.style.fill === '') return;

          // Log
          // console.log('? me');

          // Manipulate
          svg.style.fill = '';

          // Clear search

          // Log
          // console.log('I am the choosen one!');
        }

        // Log
        // console.log(event, element, clickState);
        // console.log(sCode, selectedRegionCodesArray.join(','));

        // Store
        // if (window.localStorage) {
        //   window.localStorage.setItem(
        //     'jvectormap-selected-regions',
        //     JSON.stringify(mapObject.getSelectedRegions())
        //   );
        // }
      },

      // Nav element

      // . Marker .
      onMarkerSelected: function (
        event: Event,
        markerIndex: number,
        clickState: boolean
      ) {
        animateScroll();
        function animateScroll() {
          // Await new zip load click
          // console.log(
          //   'Programm: Await new zip code call!',
          //   markers[markerIndex]
          // );

          // Guard - multi click
          if (!pauseMapDot) {
            pauseMapDot = true;
            setTimeout(function () {
              pauseMapDot = false;
            }, 10);
          } else return;

          // Values
          const data = markers[markerIndex];

          // Log
          // console.log(data, event, clickState);

          // Dot click handler
          initialStatesAdded = false;
          if (clickState) {
            // Search call
            _this.#handlers.jVectorMapDotQuerySearch(
              data.zip,
              data.city,
              data.stateCode
            );

            // - Clear other states -

            // Elements
            const svgs: HTMLElement[] =
              _this.#elements.jVectorMapMount.querySelectorAll(`[data-code]`);

            // Log
            // console.log(svgs.length);s

            // Loop
            svgs.forEach(svg => {
              // If guard
              if (
                svg.getAttribute('data-code') ===
                `DE-${data.stateCode.toUpperCase()}`
              )
                return;

              // Log
              // console.log('? me', svg);

              // Manipulate
              svg.style.fill = '';
            });
          }
          mapObject.clearSelectedRegions();
          setTimeout(function () {
            initialStatesAdded = true;
          }, 10);

          // _this.#styles.suggestedSearchBufferTime * 2

          // GSAP scroll to object
          // gsap.to(window, {
          //   duration: _this.#styles.gsapScrollToTime,
          //   scrollTo: {
          //     y: `[data-di-id="${markers[markerIndex].id}"]`,
          //     offsetY: (_this.#elements.nav?.offsetHeight + 16) as number,
          //   },
          // });

          // // Click object checkbox
          // setTimeout(function () {
          //   // Elements
          //   const object = document.querySelector(
          //     `[data-di-id="${markers[markerIndex].id}"]`
          //   );
          //   const checkbox = object?.querySelector(
          //     '.w-checkbox-input'
          //   ) as HTMLElement;

          //   // Click
          //   if (checkbox) checkbox.click();
          // }, _this.#styles.gsapScrollToTime * 100);
        }

        // Store
        // if (window.localStorage) {
        //   window.localStorage.setItem(
        //     'jvectormap-selected-markers',
        //     JSON.stringify(mapObject.getSelectedMarkers())
        //   );
        // }

        // Log
        // console.log(event, element, index);
        // console.log(markerIndex);
        // console.log(
        //   `Objektname: ${markers[markerIndex].name},\nObjekt-ID: ${markers[markerIndex].id}`
        // );
      },

      // CSS
      backgroundColor: styles.jVectorMapBackgroundColor,
      borderColor: styles.jVectorMapBorderColor,

      // Markers
      markerStyle: {
        initial: styles.jVectorMapMarkersInitialCss,
        hover: styles.jVectorMapMarkersHoverCss,
        selected: styles.jVectorMapMarkersSelectedCss,
      },

      markers: markers,

      // Regions
      regionStyle: {
        initial: styles.jVectorMapRegionsInitialCss,
        hover: styles.jVectorMapRegionsHoverCss,
        selected: styles.jVectorMapRegionsSelectedCss,
      },

      // Series
      // series: {
      //   markers: [
      //     {
      //       attribute: 'r',
      //       scale: [5, 15],
      //       values: cityAreaData,
      //     },
      //   ],
      // },
    });

    // . Style tip .
    const tip = document.querySelector('.jvectormap-tip');
    gsap.set(tip, styles.jVectorMapTipCss);

    // Map object
    const mapObject = $(`#${this.#styles.jVectorMapId}`).vectorMap(
      'get',
      'mapObject'
    );

    // * Manipulate *

    // Set local storage based

    const acceptTableSCodes: string[] = [
      'bw',
      'by',
      'be',
      'bb',
      'hb',
      'hh',
      'he',
      'mv',
      'ni',
      'nw',
      'rp',
      'sl',
      'sn',
      'st',
      'sh',
      'th',
    ];

    // Log
    // console.log(
    //   JSON.parse(
    //     window.localStorage.getItem('jvectormap-selected-regions') || '[]'
    //   )
    // );

    // Markers
    // mapObject.setSelectedMarkers(
    //   JSON.parse(
    //     window.localStorage.getItem('jvectormap-selected-markers') || '[]'
    //   )
    // );

    // Add handler - markers
    _this.#handlers.updateMarkers = function (objectData: object[] = []) {
      // Action
      createMarkers(objectData);
      mapObject.removeAllMarkers();
      mapObject.addMarkers(markers);
    };

    // Add handler - regions
    _this.#handlers.updateRegions = function (
      statesString: string = '',
      mode = 'standard'
    ) {
      // Logic
      const obj = (() => {
        if (statesString === '')
          // Guard
          return [];

        // Split
        const statesArray: string[] = [];
        statesString.split(',').forEach(sCode => {
          // Guard
          if (!acceptTableSCodes.includes(sCode.toLowerCase())) return true;

          // Push
          statesArray.push('DE-' + sCode.toUpperCase());
        });

        // Return
        return statesArray;
      })();

      // Log
      // console.log(obj, mode);

      // Log
      if (mode === 'zip') {
        obj.forEach(str => {
          // Elements
          const svg: HTMLElement | null | undefined =
            _this.#elements.jVectorMapMount.querySelector(
              `[data-code="${str}"]`
            );

          // Manipulate
          if (svg) svg.style.fill = _this.#styles.jVectorMapZipSelectColor;
        });
      } else {
        mapObject.getSelectedRegions().forEach(str => {
          // Elements
          const svg: HTMLElement | null | undefined =
            _this.#elements.jVectorMapMount.querySelector(
              `[data-code="${str}"]`
            );

          // Log
          // console.log('? me');

          // Manipulate
          if (svg) svg.style.fill = '';
        });
      }

      // Log
      // console.log(obj, mode);

      // Action
      initialStatesAdded = false;
      mapObject.clearSelectedRegions();
      mapObject.setSelectedRegions(obj);
      setTimeout(function () {
        initialStatesAdded = true;
      }, 10);
    };

    // Map - start population
    setTimeout(function () {
      initialStatesAdded = true;
    }, 10);
    (() => {
      // Get selected bundesländer from url
      const urlParams = new URLSearchParams(location.search);

      // Statesstring
      const statesString = urlParams.get('bundeslaender') || '';
      const zip = urlParams.get('plz') || '';
      const city = urlParams.get('stadt') || '';

      // Zip async handler
      if (zip !== '' && city !== '' && statesString !== '') {
        _this.#handlers.updateRegions(statesString, 'zip');
        return;
      }

      // Standard
      _this.#handlers.updateRegions(statesString);
    })();

    // Log
    // console.log(mapObject, markers);
  }

  /**
   *
   * Loading the required assets and preparing the DOM
   *
   */

  // Initialize
  init(stateData: any) {
    // Values
    const _this = this;
    this.#styles = stateData.styles;
    this.#objects = stateData.objects;
    this.#handlers = stateData.handlers;
    this.#state = stateData;

    // Elements
    this.#elements = stateData.elements;
    const mount = this.#elements.jVectorMapMount;
    const mountSibling = mount.previousElementSibling;
    this.#elements.jVectorMapMountSibling = mountSibling;

    // Manipulate number of markers - - - See model
    const elements = this.#elements,
      numberOfLists = elements.objectLists.length as number;
    this.#maxNumberOfObjects = (this.#styles.numberOfObjectsPerList *
      numberOfLists) as number;
    // if (this.#objects.length > maxNumberOfObjects) this.#objects.pop();

    // Append style sheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = config.J_VECTOR_MAP_CSS_HREF;
    link.type = 'text/css';
    link.media = 'screen';
    document.head.append(link);

    // Import scripts
    scriptLoader(config.J_VECTOR_MAP_MAIN_JS_SRC, () => {
      scriptLoader(config.J_VECTOR_MAP_COUNTRY_JS_SRC, mountMap);
    });

    // Mount map
    function mountMap() {
      // Define
      const mapMount = _this.#returnJVectorMapMount();
      mount.innerHTML = '';
      mount.append(mapMount);

      // Calculate map mount height
      function calcMapMountHeight() {
        if (window.innerWidth >= 767) {
          mount.style.height = `${mountSibling.offsetHeight}px`;
        } else {
          // mount.style.height = '';
          mount.style.height = `${mountSibling.offsetHeight}px`;
        }
      }
      calcMapMountHeight();
      window.addEventListener('resize', calcMapMountHeight);

      // Call jVectorMap function
      _this.#jVectorMapMain();
    }
  }

  #returnJVectorMapMount() {
    // Create
    const mapMount = document.createElement('div');

    // Set attributes
    mapMount.classList.add(`${this.#styles.jVectorMapClass}`);

    // Style
    mapMount.style.maxHeight = '100%';
    mapMount.style.height = '100%';
    // mapMount.style.marginTop = '-20%';
    // mapMount.style.zIndex = 1;

    // Set id
    mapMount.setAttribute('id', `${this.#styles.jVectorMapId}`);

    // Return
    return mapMount;
  }

  // Define
  #styles: any;
  #elements: any;
  #objects: any;
  #handlers: any;
  #maxNumberOfObjects: number;
  #state: any;

  // Helpers
  // #dotOnCurrentPage(id: number) {
  //   // Values
  //   const objects: any[] = this.#state.objects;
  //   const currentlySkippedObjects: number = this.#state.objectsSkip || 0;
  //   const max = this.#maxNumberOfObjects;
  //   let returnVal = false;
  //   let clickedIndexVals = { diId: 0, index: 0 };

  //   // Loop
  //   objects.forEach((object, index) => {
  //     // Guard
  //     if (object.id !== id) return;

  //     // Log
  //     console.log(' ello orld  !', object);

  //     // Math logic
  //     const x = 1 + index;
  //     if (x > currentlySkippedObjects && x <= max + currentlySkippedObjects) {
  //       returnVal = true;
  //     } else {
  //       clickedIndexVals.diId = object.id;
  //       clickedIndexVals.index = x;
  //     }
  //   });

  //   console.log(returnVal, clickedIndexVals);

  //   // Test
  //   returnVal = false;

  //   // Return
  //   return false;
  // }
}

// + Exports +

// JVectorMapView object
export default new JVectorMapView();
