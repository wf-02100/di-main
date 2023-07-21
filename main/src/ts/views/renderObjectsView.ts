// + Imports +

// Base

// Custom
import * as config from '../config';
import { scriptLoader } from '../helper';
// import { getDiData } from '../model';

// + Declare +
declare var gsap: any; // Magic
declare var ls: any; // Magic

// + Classes +

// Base JVectorMapView
class RenderObjectsView {
  // Object comparison bar
  #objectComparisonItems: {
    id: number;
    src: string;
    checkbox: HTMLInputElement;
  }[] = [];
  #initObjectComparisonBar() {
    // Values
    const _this = this;

    // Add a clear object comparison bar handler
    this.#handlers.clearObjectComparisonBar = function (clearDeep = false) {
      // Clear deep
      if (clearDeep) {
        // Update
        _this.#objectComparisonCheckBoxClickHandlerPause = true;

        // Loop through normal items
        _this.#objectComparisonItems.forEach(item => {
          // Guard 1
          if (!item.checkbox) return;

          // Guard 2
          if (!item.checkbox.classList.contains('w--redirected-checked'))
            return;

          // Action
          item.checkbox.click();
        });

        // Loop through paginated items
        _this.#currentlySelectedObjects.forEach(id => {
          // Elements
          const card = document.querySelector(`[data-di-id="${id}"]`);
          const checkbox: HTMLElement | null | undefined =
            card?.querySelector('.w-checkbox-input');

          // Guard 1
          if (!checkbox) return;

          // Guard 2
          if (!checkbox.classList.contains('w--redirected-checked')) return;

          // Action
          checkbox.click();
        });

        // Timeout
        setTimeout(function () {
          _this.#objectComparisonCheckBoxClickHandlerPause = false;
        }, 10);
      }

      // Clear
      _this.#objectComparisonItems = [];
      _this.#currentlySelectedObjects = [];

      // Remove all image templates
      _this.#removeAllImgaeClones();

      // Show comparison bar
      _this.#elements.comparisonWrapper.style.display = 'none';
    };

    // By default hide comp wrapper
    this.#handlers.clearObjectComparisonBar();

    // Handle x close
    this.#elements.comparisonXButton.addEventListener('click', function () {
      _this.#handlers.clearObjectComparisonBar(true);
    });

    // Init comparison anchor
    this.#elements.comparisonAnchor.setAttribute('href', '#');
    this.#initialComparisonAnchorText =
      this.#elements.comparisonAnchor.innerText;

    // Values
    const minItems = parseInt(
      _this.#elements.comparisonWrapper.getAttribute('data-min-items') || 2
    );
    const maxItems = parseInt(
      _this.#elements.comparisonWrapper.getAttribute('data-max-items') || 5
    );
    this.#maxCheckedBoxes = maxItems;

    // Listener
    this.#elements.comparisonAnchor.addEventListener('click', function () {
      // - Logic & values -
      const n = _this.#objectComparisonItems.length;
      const button = this;

      // Guard
      if (n < minItems) {
        button.children[0].innerHTML = 'Bitte weitere Objekte auswählen';
        setTimeout(function () {
          button.children[0].innerHTML = _this.#initialComparisonAnchorText;
        }, 1200);
        return;
      }

      // Guard 2
      if (n > maxItems) {
        this.children[0].innerHTML = `Bitte maximal ${maxItems} Objekte auswählen`;
        setTimeout(function () {
          button.children[0].innerHTML = _this.#initialComparisonAnchorText;
        }, 1200);
        return;
      }

      // Reroute
      this.children[0].innerHTML = 'Laden ...';
      setTimeout(function () {
        button.children[0].innerHTML = _this.#initialComparisonAnchorText;
      }, 1200);

      const newUrl =
        _this.#elements.comparisonAnchorDefaultHrefValue +
        '?objekte=' +
        _this.#objectComparisonItems.map(item => item.id).join(',');

      window.open(newUrl, '_blank')?.focus();

      // Log
      // console.log('Reroute the customer: ', newUrl);
    });

    // Remove all image templates
    // this.#removeAllImgaeClones();

    // Log
    // console.log(this.#initialComparisonAnchorText);
  }

  #removeAllImgaeClones() {
    this.#elements.comparisonWrapper
      .querySelectorAll('[comparison="image-template"]')
      .forEach((imgTmp: HTMLElement) => {
        imgTmp.remove();
      });
  }

  #initialComparisonAnchorText = '';
  #maxCheckedBoxes = 5;

  #objectComparisonCheckBoxClickHandlerPause = false;
  #objectComparisonCheckBoxClickHandler(data: any, checkBox: HTMLInputElement) {
    // Guard
    if (this.#objectComparisonCheckBoxClickHandlerPause) return;

    // Values
    const _this = this;

    // Timeout
    this.#objectComparisonCheckBoxClickHandlerPause = true;
    setTimeout(() => {
      // Logic
      _this.#objectComparisonCheckBoxClickHandlerPause = false;

      // Log
      // console.log('neutral', data.id, this.#objectComparisonItems);

      // Logic
      let itemExists = false;
      _this.#objectComparisonItems.forEach((item, index) => {
        if (data.id === item.id) {
          // Remove item
          _this.#objectComparisonItems.splice(index, 1);
          itemExists = true;

          // Remove element from DOM
          document.querySelector(`[data-comp-img-id="${data.id}"]`)?.remove();

          // Remove from currently selected
          const tmpIndex = this.#currentlySelectedObjects.indexOf(data.id);
          if (tmpIndex > -1) {
            this.#currentlySelectedObjects.splice(tmpIndex, 1);
          }

          // Log
          // console.log('removed', this.#objectComparisonItems);

          // Skip
          return;
        }
      });

      // Item exists
      if (itemExists && _this.#objectComparisonItems.length >= 1) {
        // return;
      }

      // Add logic
      if (
        !itemExists &&
        _this.#objectComparisonItems.length < _this.#maxCheckedBoxes
      ) {
        // Add item
        _this.#objectComparisonItems.push({
          id: data.id,
          src: data.mainImage?.urlSmall,
          checkbox: checkBox,
        });

        // Log
        // console.log(
        //   _this.#elements.comparisonImgTemplate,
        //   _this.#elements.comparisonImagesParent
        // );

        // Add element to DOM
        const clone = _this.#elements.comparisonImgTemplate.cloneNode(
          true
        ) as HTMLElement;
        const img = clone.querySelector('img');
        clone.setAttribute('data-comp-img-id', data.id);
        if (data.mainImage?.urlSmall)
          img?.setAttribute('src', data.mainImage?.urlSmall);

        // Guard
        if (!_this.#elements.comparisonImagesParent) {
          console.warn(
            'Potential Error: renderObjectView.ts -> #objectComparisonCheckBoxClickHandler -> Add item logic -> try adding comparisonImgTemplate -> Guard: comparisonImagesParent = ',
            _this.#elements.comparisonImagesParent
          );
          return;
        }

        // Add
        _this.#elements.comparisonImagesParent?.append(clone);

        // Show comparison bar
        _this.#elements.comparisonWrapper.style.display = 'flex';

        // Log
        // console.log('added', this.#objectComparisonItems);
      } else if (
        !itemExists &&
        _this.#objectComparisonItems.length >= _this.#maxCheckedBoxes
      ) {
        _this.#objectComparisonCheckBoxClickHandlerPause = true;

        // Change text
        const button = _this.#elements.comparisonAnchor.children[0];
        button.innerHTML = `Bitte maximal ${
          _this.#maxCheckedBoxes
        } Objekte auswählen`;
        setTimeout(function () {
          button.innerHTML = _this.#initialComparisonAnchorText;
        }, 1200);

        // Action
        checkBox.click();
        setTimeout(function () {
          _this.#objectComparisonCheckBoxClickHandlerPause = false;
        }, 10);
      }

      // O items logic
      if (_this.#objectComparisonItems.length < 1) {
        _this.#handlers.clearObjectComparisonBar();
        // return;
      }

      // - Logic for changing numbers texts -
      _this.#elements.comparisonCount.innerHTML =
        _this.#objectComparisonItems.length;

      if (_this.#objectComparisonItems.length === 1) {
        _this.#elements.comparisonPlural.style.display = 'none';
      } else {
        _this.#elements.comparisonPlural.style.display = 'inline';
      }

      // Log
      // console.log("added", this.#objectComparisonItems);

      // Log
      // console.log(data);
      // Timeout end
    }, 10);
  }

  // Initialize
  init(stateData: any) {
    // Values
    this.#styles = stateData.styles;
    this.#objects = stateData.objects;
    this.#handlers = stateData.handlers;

    // Elements
    this.#elements = stateData.elements;

    // Call
    this.#renderLoop();

    // Add renderLoop handler for other views
    this.#addRenderLoopHandler();

    // Add reset number of skippings variable handler
    this.#addResetNumberOfSkippingsHandler();

    // Init object comparison bar
    this.#initObjectComparisonBar();
  }

  // Define
  #styles: any;
  #elements: any;
  #objects: any;
  #handlers: any;

  // Add add handler
  #addRenderLoopHandler() {
    // Values
    const _this = this;

    // Function
    this.#handlers.renderLoop = function (objectData: object[] = []) {
      // Update
      _this.#objects = objectData;

      // Fire
      _this.#renderLoop();
    };
  }

  /**
   *
   * Render object items
   *
   */

  #manipulateClone(el = document.body, data: any) {
    // Values
    const _this = this;

    // Set id
    el.setAttribute('id', `c-card-${data.id}`);

    // Object comparison event listener
    const objCompCheckBox = el.querySelector('.w-checkbox-input');
    setTimeout(function () {
      objCompCheckBox?.addEventListener('click', function () {
        _this.#objectComparisonCheckBoxClickHandler(
          data,
          objCompCheckBox as HTMLInputElement
        );
      });
    }, 100);

    // Swap image
    if (!data.mainImage) {
      (() => {
        // Guard
        if (!_this.#styles.renderObjectsAsyncImageLoadIfMainImageNotDeclared)
          return;

        // Asncy call
        (async function () {
          try {
            // Values
            const img: any = el.querySelector('img');
            const imgData = await _this.#handlers.returnObjectImageData(
              data.id
            );
            // Guard
            if (imgData.length < 1) return;
            // Set
            img.setAttribute('src', `${imgData[0].urlLarge}`);
            img.setAttribute('alt', `Async: ${imgData[0].prettyName}`);
          } catch (err) {
            throw (
              'RenderObjectsView -> #manipulateClone -> async image loading: ' +
              err
            );
          }
        })();
      })();
    } else {
      const img: any = el.querySelector('img');
      img.setAttribute('src', `${data.mainImage.urlLarge}`);
      img.setAttribute('alt', `${data.mainImage.prettyName}`);
    }

    // Title
    const title = el.querySelector('[data="name"]');
    if (title) title.innerHTML = data.name;

    // Subtitle
    const subTitle1 = el.querySelector('[data="city"]');
    if (subTitle1) subTitle1.innerHTML = data.address.city;
    const subTitle2 = el.querySelector('[data="state"]');
    if (subTitle2) subTitle2.innerHTML = data.address.state;
    if (data.address.state === null) {
      (async () => {
        try {
          console.warn(
            'RenderObjectsView -> #manipulateClone -> async address.state loading: ',
            data.address.city,
            data.name
          );
        } catch (err) {
          throw (
            'RenderObjectsView -> #manipulateClone -> async address.state loading: ' +
            err
          );
        }
      })();
    }

    // Construction year
    const constructionYear = el.querySelector('[data="construction-year"]');
    const yearString = data.data.completionYear;
    const constructionYearString = yearString !== null ? yearString : '–';
    if (constructionYear) constructionYear.innerHTML = constructionYearString;

    // Purchase price start
    const purchasePriceFrom = el.querySelector('[data="price-from"]');
    let purchasePriceFromText = parseInt(data.stats.minTotalPrice)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    purchasePriceFromText =
      purchasePriceFromText === 'NaN' ? 'k.A.&nbsp' : purchasePriceFromText;
    if (purchasePriceFrom) purchasePriceFrom.innerHTML = purchasePriceFromText; // alt. .minPrice

    // Units
    const units = el.querySelector('[data="units"]');
    if (units)
      units.innerHTML = data.stats.numUnits ? data.stats.numUnits : '–';

    // From to yield
    const yieldFromTo = el.querySelector('[data="average-yield"]');
    const yieldFromToText =
      data.stats.minYield !== null && data.stats.maxYield !== null
        ? `${(
            (parseFloat(data.stats.minYield) +
              parseFloat(data.stats.maxYield)) /
            2
          ).toFixed(2)}`
        : `${data.stats.minYield || data.stats.maxYield || 'k.A.&nbsp'}`;
    if (yieldFromTo)
      yieldFromTo.innerHTML = yieldFromToText.replace(/\./gi, ',');

    // Anchors
    const anchors = el.querySelectorAll('a');
    anchors.forEach(anchor => {
      // Init
      anchor.setAttribute('href', `#`);

      // Event listener
      anchor.addEventListener('click', async function () {
        try {
          // Change text
          // anchor.children[0].innerHTML = 'Einen Moment bitte ...';

          // Retrieve
          const href = await _this.#handlers.returnObjectWfCmsHref(data.id); // data.id

          // Change text
          setTimeout(function () {
            // anchor.children[0].innerHTML = 'Laden ...';
          }, _this.#styles.suggestedSearchBufferTime * 1000);

          // Set
          location = (_this.#styles.renderObjectsHrefPathBase + href) as any;

          // Log
          // console.log('Href: ' + href);
        } catch (err) {
          // Change text
          setTimeout(function () {
            anchor.children[0].innerHTML = '(404) Objekt nicht gefunden';
            // Change text
            setTimeout(function () {
              anchor.children[0].innerHTML = 'Zum Objekt';
            }, _this.#styles.suggestedSearchBufferTime * 1000 * 2.5);
          }, _this.#styles.suggestedSearchBufferTime * 1000);

          // throw (
          //   'RenderObjectsView -> #manipulateClone -> anchors.forEach() callback: ' +
          //   err
          // );
        }
      });
    });

    // Log
    // console.log(el, data);
  }

  /**
   *
   * Handle load more button click
   *
   */

  // Add reset number of skippings variable handler
  #addResetNumberOfSkippingsHandler() {
    // Values
    const _this = this;

    // Action
    this.#handlers.resetNumberOfSkippings = function (
      isPaginationCall = false
    ) {
      // DOM based working
      _this.#currentNumberOfSkippings = 0;
      _this.#elements.pagiantionPrevButton.style.display = 'none';
      _this.#elements.pagiantionNextButton.style.display = 'flex';
      if (!isPaginationCall) _this.#currentlySelectedObjects = [];
    };
  }

  // Load more / paginate logic
  #currentlySelectedObjects: number[] = [];
  #maxNumberOfObjects = 0;
  #currentNumberOfSkippings = 0;
  #maxNumberOfSkippings = 0;
  #paginationNumberElements: HTMLElement[];
  #paginationPrevElement: HTMLElement;
  #paginationNextElement: HTMLElement;
  #loadMoreClickHandler(
    numberOfSkippings: number,
    element: HTMLElement,
    type: string
  ) {
    // Move pagination element to the correct anchor
    // console.log(element);

    // Values
    const _this = this;

    // Guard
    if (this.#currentNumberOfSkippings === numberOfSkippings) return;

    // Currently selected objects
    const compImgs =
      this.#elements.comparisonWrapper.querySelectorAll('[data-comp-img-id]');

    compImgs.forEach((img: HTMLElement) => {
      // Value
      const val = parseInt(img.getAttribute('data-comp-img-id') || '');

      // Push
      if (!isNaN(val)) {
        if (this.#currentlySelectedObjects.indexOf(val) === -1) {
          this.#currentlySelectedObjects.push(val);
        }
      }
    });
    // console.log(this.#currentlySelectedObjects);

    // Prev
    if (type === 'next') {
      numberOfSkippings =
        _this.#currentNumberOfSkippings + _this.#maxNumberOfObjects;
    }

    // Prev
    if (type === 'prev') {
      numberOfSkippings =
        _this.#currentNumberOfSkippings - _this.#maxNumberOfObjects;
    }

    // Update current number of skippings
    this.#currentNumberOfSkippings = numberOfSkippings;

    // Clear current list
    this.#paginationNumberElements.forEach(el =>
      el.classList.remove('w--current')
    );
    if (type === 'number') element.classList.add('w--current');
    if (type !== 'number')
      this.#paginationNumberElements[
        numberOfSkippings / this.#maxNumberOfObjects
      ]?.classList.add('w--current');

    // Arrow display logic
    this.#paginationNextElement.style.display = 'flex';
    this.#paginationPrevElement.style.display = 'flex';
    if (this.#maxNumberOfSkippings <= numberOfSkippings) {
      // console.log('no next');
      this.#paginationNextElement.style.display = 'none';
      this.#maxNumberOfSkippings = numberOfSkippings;
    }
    if (0 >= numberOfSkippings) {
      // console.log('no prev');
      this.#paginationPrevElement.style.display = 'none';
      this.#currentNumberOfSkippings = 0;
    }

    // Call filter main
    _this.#handlers.filter(numberOfSkippings, true, () => {
      _this.#renderLoop(true, numberOfSkippings);
    });

    // Scroll to top
    gsap.to(window, {
      duration: _this.#styles.gsapScrollToTime,
      scrollTo: {
        y: document.querySelector('[objects="list"]')?.closest('section'),
        offsetY: this.#elements.nav.offsetHeight,
      },
    });
  }

  /**
   *
   * Loop over every list & every object
   *
   */

  #isLoadMoreButtonHandlerSet = false;
  #isFirstRenderLoop = true;
  #renderLoop(isPaginationCall = false, numberOfSkippings = 0) {
    // If pagination
    if (this.#isFirstRenderLoop) {
      const urlParams = new URLSearchParams(location.search);
      const urlSkip = parseInt(urlParams.get('ueberspringen') || '');
      if (!isNaN(urlSkip)) {
        numberOfSkippings = urlSkip;
        if (numberOfSkippings < 0) numberOfSkippings = 0;
        this.#currentNumberOfSkippings = urlSkip;
        isPaginationCall = true;
      }
    }

    // Render wheel handler call
    this.#handlers.tryHideLoadingWheel();

    // Values
    let objects = this.#objects;
    const elements = this.#elements,
      numberOfLists = elements.objectLists.length as number,
      maxNumberOfObjects = (this.#styles.numberOfObjectsPerList *
        numberOfLists) as number,
      numberOfItemsPerList = maxNumberOfObjects / numberOfLists,
      _this = this;

    // Show number of results
    const results = document.getElementById('ergebnisse');
    const pluralResults = document.getElementById('plural-ergebnisse');
    if (results) results.innerHTML = `${objects.length}`;
    if (pluralResults) {
      if (objects.length === 1) pluralResults.style.display = 'none';
      else pluralResults.style.display = 'inline';
    }

    // Hide skeleton load
    if (this.#isFirstRenderLoop) {
      // Elements
      const skeletonWrapper = document.querySelector(
        '[skeleton-loading="wrapper"]'
      );

      // Hide
      if (skeletonWrapper) {
        document.head.insertAdjacentHTML(
          'beforeend',
          `<style>[skeleton-loading="wrapper"]{display: none !important}</style>`
        );
      }
    }

    // Log
    // console.log(objects);

    // Show or hide load more
    this.#maxNumberOfObjects = maxNumberOfObjects;
    const paginationExists = objects.length > maxNumberOfObjects;

    if (
      elements.pagiantionContainer &&
      (this.#isFirstRenderLoop || !isPaginationCall)
    ) {
      if (objects.length > maxNumberOfObjects) {
        elements.pagiantionContainer.style.display = 'flex';

        // Figure out number of page numbers
        elements.pagiantionNumberWrapper.innerHTML = '';
        this.#paginationNumberElements = [];
        for (
          let i = 0, n = Math.ceil(objects.length / maxNumberOfObjects);
          i < n;
          i++
        ) {
          // Elements
          const clone = elements.pagiantionNumberTemplate?.cloneNode(true);
          const numberOfSkippings = maxNumberOfObjects * i;

          // Add to DOM
          if (clone) elements.pagiantionNumberWrapper.append(clone);
          else continue;
          this.#paginationNumberElements.push(clone);
          this.#maxNumberOfSkippings = numberOfSkippings;

          // Manipulate
          clone.children[0].innerHTML = i + 1;

          // Add w--current to current page
          if (_this.#currentNumberOfSkippings === numberOfSkippings)
            clone.classList.add('w--current');
          else clone.classList.remove('w--current');

          // Event listener
          // if (i !== 0)
          clone.addEventListener('click', function () {
            _this.#loadMoreClickHandler(numberOfSkippings, clone, 'number');
            // console.log('Jump to page: ', i + 1, n);
          });
        }

        if (!this.#isLoadMoreButtonHandlerSet) {
          // Event listeners
          elements.pagiantionNextButton?.addEventListener('click', function () {
            _this.#loadMoreClickHandler(
              -1,
              elements.pagiantionNextButton,
              'next'
            );
          });
          elements.pagiantionPrevButton?.addEventListener('click', function () {
            _this.#loadMoreClickHandler(
              -1,
              elements.pagiantionPrevButton,
              'prev'
            );
          });

          // Add as reference
          _this.#paginationNextElement = elements.pagiantionNextButton;
          _this.#paginationPrevElement = elements.pagiantionPrevButton;

          // Hide
          elements.pagiantionPrevButton.style.display = 'flex';
          elements.pagiantionNextButton.style.display = 'flex';
          if (this.#currentNumberOfSkippings <= 0)
            elements.pagiantionPrevButton.style.display = 'none';
          if (this.#currentNumberOfSkippings >= this.#maxNumberOfSkippings)
            elements.pagiantionNextButton.style.display = 'none';
        }
        this.#isLoadMoreButtonHandlerSet = true;

        // this.#initialLoadMoreButtonString;
        // this.#numberOfSkippings;
        this.#maxNumberOfObjects;
      } else {
        elements.pagiantionContainer.style.display = 'none';
      }
    }

    // Update
    if (isPaginationCall) {
      let tmpObjects: any[] = [];
      for (let i = 0, n = this.#maxNumberOfObjects; i < n; i++) {
        if (objects[i + numberOfSkippings])
          tmpObjects.push(objects[i + numberOfSkippings]);
        // console.log(i + numberOfSkippings);
      }
      objects = tmpObjects;
    }
    this.#isFirstRenderLoop = false;

    // Show or hide - empty state
    if (objects.length < 1) {
      elements.objectsEmptyMsgWrapper.style.display = 'block';
    } else {
      elements.objectsEmptyMsgWrapper.style.display = 'none';
    }

    // Log
    // console.log(this.#currentlySelectedObjects);

    // List loop
    let indexOfLastFilledItemGrid = numberOfLists - 1;
    elements.objectLists.forEach(
      (
        objectList: { listElement: HTMLElement; itemTemplate: any },
        index: number
      ) => {
        // Values
        const list = objectList.listElement as any,
          template = objectList.itemTemplate;

        // Clear list
        list.innerHTML = '';

        // Get updated objects
        const updatedObjects: any[] = returnUpdatedObjects(
          index,
          numberOfItemsPerList
        );

        // Pagination case
        if (
          paginationExists &&
          updatedObjects.length > 0 &&
          updatedObjects.length < numberOfItemsPerList
        ) {
          indexOfLastFilledItemGrid = index;
        }

        // Guard
        if (updatedObjects.length < 1) {
          // Hide section
          list.closest('section').style.display = 'none';
          list.style.display = 'grid';

          // Skip section below
          return;
        } else {
          // Unhide after different filter results
          list.style.display = 'grid';
          list.closest('section').style.display = 'block';
        }

        // Object loop
        updatedObjects.forEach((object: any) => {
          // Values
          const clone = template.cloneNode(true);

          // Manipulate clone
          this.#manipulateClone(clone, object);
          clone.setAttribute('data-di-id', object.id);

          // Append
          list.append(clone);

          // Pagination
          if (this.#currentlySelectedObjects.includes(object.id)) {
            clone.querySelector('.w-checkbox-input')?.click();
          }

          // Log
          // console.log('I work');
        });

        // Log
        // console.log('I work');
      }
    );

    // * Pagination exists and postion logic
    if (paginationExists) {
      // Elements
      const list: HTMLElement | undefined =
        elements.objectLists[indexOfLastFilledItemGrid].listElement;

      // Move
      if (list) insertAfter(elements.pagiantionContainer, list);
    }

    // - Helper -

    // Insert after
    function insertAfter(newNode, existingNode) {
      existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    // Update objects
    function returnUpdatedObjects(i1: number, n: number) {
      // Define
      const arr: any[] = [];

      // Loop
      for (let i2 = 0; i2 < n; i2++) {
        try {
          // Values
          const x = i2 + i1 * n;

          // Push
          if (objects[x]) arr.push(objects[x]);
        } catch (err) {}
      }

      // Return
      return arr;
    }

    // Log
    // console.log('I work', elements.objectLists);
  }
}

// + Exports +

// RenderObjectsView object
export default new RenderObjectsView();
