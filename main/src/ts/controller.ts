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
    const path = window.location.pathname;

    // Init
    model.init(path);

    // Test: Add state to window
    window['MainJsState'] = model.state.data;

    // - Route logic -
    if (path === '/') {
      // Async call
      // await model.getData('?max=8&skip=8&zip=88719&radius=250');

      // Log
      // console.log(model.state.data['objects']);

      // Render
      view.initHomeView(model.state.data);
    }

    if (path.includes(model.state.data['styles'].objectSearchPathBase)) {
      // Async call
      await model.getSearchObjectData(
        window.location.search,
        model.state.data['elements'].objectLists.length
      );

      // console.log(model.state.data['objects']);

      // Render
      view.initObjectSearchView(model.state.data);

      // Log
      // console.log(model.state.data['objects']);
    }

    // Multi-step forms - search support
    view.initFinder(model.state.data);

    // Log
    // console.log(model.state.data.objects);
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

// Control test
// const controlTest = async function () {
//   try {
//     // 1st view test
//     view.consoleLog('loading...');

//     // Model test
//     await model.testData();

//     // Log test data
//     console.log(model.state.data);

//     // 2nd view test
//     view.consoleLog();
//   } catch (err) {
//     console.log(`Error: ${err}`);
//   }
// };
