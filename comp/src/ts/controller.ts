// + Imports +

// Base
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Custom
import loader from './utils/loader';
import * as model from './model';
import view from './views/view';
import * as config from './config';

// // + Declare +
// declare var $: any; // Magic
// declare var gsap: any; // Magic

// + Functions +

// Main
const main = async function () {
  try {
    // Values
    const query = new URLSearchParams(window.location.search);
    const objectIdsString = query.get('objekte');

    // Simple guard
    if (objectIdsString === '' || objectIdsString === null) {
      location.href = '/';
      return;
    }

    // Elements
    model.init();
    const elements = model.state['elements'];

    // User config
    const minItems = parseInt(
      elements.listWrapper.getAttribute('data-min-items') || 2
    );
    const maxItems = parseInt(
      elements.listWrapper.getAttribute('data-max-items') || 5
    );

    // Clean & push
    const ids: number[] = [];
    objectIdsString.split(',').forEach(idStr => {
      // Clean
      const id = parseInt(idStr.replace(/\D/g, ''));

      // Skip if
      if (isNaN(id)) return true;

      // Push
      if (ids.indexOf(id) === -1) ids.push(id);
    });

    // Second guard
    if (ids.length < minItems || ids.length > maxItems) {
      location.href = '/';
      return;
    }

    // Show render templates
    view.showNLoadingTemplates(ids.length, elements);

    // Load relevant object data
    const objectData: any[] = await model.loadObjects(ids);

    // Third guard
    if (objectData.length < minItems || objectData.length > maxItems) {
      location.href = '/';
      return;
    }

    // Init object view
    view.init(model.state);

    // Log
    // console.log(ids, objectIdsString, objectData);
  } catch (err) {
    console.log(`Msg: ${err}`);
  }
};

// + Initialize +
const init = function () {
  // view.addHandler(main);
  main();
};
loader(init);
