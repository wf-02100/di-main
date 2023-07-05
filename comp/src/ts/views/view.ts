// + Imports +

// Base

// Custom
import * as config from '../config';

// + Classes +

// Base WebflowView
class WebflowView {
  // Main manipulation
  #manipulate(clone: HTMLElement, data: any) {
    // Values
    const _this = this;

    // Image swap
    const img = clone.querySelector('[data="mainImage"]');
    if (data.mainImage) {
      img?.setAttribute('src', data.mainImage?.urlLarge);
      img?.setAttribute('alt', data.mainImage?.prettyName);
    }

    // Base values
    const emptyTextReplacer =
      document.body.getAttribute('data-empty-text') || '_empty_';
    const dateFormatter = new Intl.DateTimeFormat('de', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const energyEfficienyReferenceArray = [
      'k.A.',
      'A+',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
    ];

    // Simple texts loop
    const texts = clone.querySelectorAll(
      '[data]:not([data="mainImage"])' // :not([data="n/a"])
    );
    texts.forEach(el => {
      // k.A.
      if (el.getAttribute('data') === 'k.A.') {
        el.innerHTML = emptyTextReplacer;
        if (emptyTextReplacer === '_empty_')
          el.setAttribute('style', 'opacity: 0;');
        return true;
      }

      // Empty but prefix or suffix
      if (el.getAttribute('data') === 'empty') {
        el.innerHTML =
          (el.getAttribute('data-prefix') || '') +
          (el.getAttribute('data-suffix') || '');
        return true;
      }

      // - - - Standard case - - -
      const dataStr = el.getAttribute('data') || '';

      // Tmp data specifier loop
      let tmpData = data;
      dataStr.split('.').forEach(str => {
        try {
          tmpData = tmpData[str];
        } catch {
          tmpData = null;
        }
      });

      // - - - Data n/a case - - - override _tmpData
      if (el.getAttribute('data') === 'n/a') {
        // Just simple, hard coded logic

        // 1
        if (el.getAttribute('data-divide') === '100 / stats.numUnits') {
          tmpData = 100 / data.stats.numUnits;
          tmpData = isNaN(tmpData) || tmpData === Infinity ? null : tmpData;
        }

        // 2 - 'stats.sumTotalPurchasingPrice / areasqm'
        if (
          el.getAttribute('data-divide') ===
          'stats.sumTotalPurchasingPrice / areasqm'
        ) {
          tmpData =
            parseFloat(data.stats.sumTotalPurchasingPrice) /
            parseFloat(data.areasqm);
          tmpData =
            isNaN(tmpData) || tmpData === Infinity ? null : tmpData.toFixed(2);
        }

        // 3
        if (el.getAttribute('data-conditional') === 'data.termoflease >= 20') {
          tmpData =
            data.data.termoflease === 0 ||
            data.data.termoflease === null ||
            data.data.termoflease === undefined
              ? null
              : parseInt(data.data.termoflease) >= 20
              ? 'ja'
              : 'nein';
        }
      }

      // Handle empty / null case
      if (
        tmpData === null ||
        tmpData === '0.00' ||
        tmpData === 0 ||
        tmpData === Infinity
      ) {
        el.innerHTML = emptyTextReplacer;
        if (emptyTextReplacer === '_empty_')
          el.setAttribute('style', 'opacity: 0;');
        return true;
      }

      // Maniuplae tmpData if wanted

      // - Data type transformations -

      // Year Y-m-d
      if (el.getAttribute('data-type') === 'year-Y-m-d') {
        // tmpData = tmpData.split('-')[0];
        const tmpDate = new Date(tmpData);
        tmpData = dateFormatter.format(tmpDate);
      }

      // Energy efficiency class
      if (el.getAttribute('data-type') === 'energy-efficiency-class') {
        tmpData = energyEfficienyReferenceArray[parseInt(tmpData)];
      }

      // Decimals
      if (el.getAttribute('data-type') === 'decimal') {
        tmpData = parseFloat(tmpData).toLocaleString('de-DE');
      }

      // Integer
      if (el.getAttribute('data-type') === 'integer') {
        tmpData = parseInt(tmpData).toLocaleString('de-DE');
      }

      // Decimal point magic
      if (!isNaN(parseInt(el.getAttribute('data-decimal-points') || ''))) {
        const n = parseInt(el.getAttribute('data-decimal-points') || '');
        tmpData = parseFloat(parseFloat(tmpData).toFixed(n)).toLocaleString(
          'de-DE'
        );
      }

      // - Set -
      el.innerHTML = el.innerHTML =
        (el.getAttribute('data-prefix') || '') +
        tmpData +
        (el.getAttribute('data-suffix') || '');

      // Resize if necessary
      const htmlEl = el as HTMLElement;
      setTimeout(function () {
        if (htmlEl.offsetHeight > _this.#baseTextHeight) {
          // Get all existing elements with the same selector & do some height calc math
          const els = document.querySelectorAll(
            `[data="${el.getAttribute('data')}"]`
          );
          let highestHeight = 0;
          els.forEach(domEl => {
            // Manipulation
            const htmlDomEl = domEl as HTMLElement;

            // Log
            // console.log('Is same node? ', htmlEl.isSameNode(htmlDomEl));

            // Logic
            if (htmlDomEl.offsetHeight > highestHeight)
              highestHeight = htmlDomEl.offsetHeight;
          });

          // Log
          // console.log('Highest height: ', highestHeight);

          // Guard
          if (htmlEl.offsetHeight >= highestHeight) {
            // Append special CSS to top
            const style = document.createElement('style');
            style.innerHTML = `[data="${el.getAttribute(
              'data'
            )}"] { min-height: ${htmlEl.offsetHeight}px !important }`;
            document.head.append(style);

            // Log
            // console.log(
            //   'Special CSS added for: ',
            //   el,
            //   ' with the height of: ',
            //   htmlEl.offsetHeight
            // );
          }
        }
      }, 10);

      // Log
      // console.log(el, tmpData);
    });
  }

  // Define
  #baseTextHeight: number;

  // Initialize
  init(state: any) {
    // Log
    // console.log('hello, world', state, state.data);

    // Clear
    state.elements.list.innerHTML = '';

    // Clone loop
    state.data.forEach((datum: any, index: number) => {
      // Elements
      const clone = state.elements.template.cloneNode(true);

      // Append
      state.elements.list.append(clone);

      // Base calculation
      if (index === 0) {
        const baseTextElement = clone.querySelector(
          '[data]:not([data="mainImage"])'
        ) as HTMLElement;
        this.#baseTextHeight = baseTextElement?.offsetHeight;
      }

      // Manipulate
      this.#manipulate(clone, datum);
    });
  }

  showNLoadingTemplates(n: number, elements: any) {
    // Clear
    elements.list.innerHTML = '';

    // Append loop
    for (let i = 0; i < n; i++) {
      elements.list.append(elements.template.cloneNode(true));
    }

    // Log
    // console.log('Hello ', n);
  }
}

// + Exports +

// WebflowView object
export default new WebflowView();
