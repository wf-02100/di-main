// + Imports +

import { async } from 'regenerator-runtime';
import { scriptLoader } from '../helper';

// + Declare +
declare var $: any;
declare var gsap: any;
declare var ls: any;

// + Load helper +

// + Exports +

// Loader
export default function (handler: () => void) {
  handler();

  // 'undefined' === typeof gsap
  //   ? scriptLoader(
  //       'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js',
  //       load2ndScript
  //     )
  //   : load2ndScript();

  // function load2ndScript() {
  //   'undefined' === typeof ls
  //     ? scriptLoader(
  //         'https://cdn.jsdelivr.net/npm/localstorage-slim',
  //         load3rdScript
  //       )
  //     : load3rdScript();
  // }

  // function load3rdScript() {
  //   'undefined' === 'undefined'
  //     ? scriptLoader(
  //         'https://cdn.jsdelivr.net/gh/wf-02100/distribution@main/ScrollToPlugin.min.js',
  //         handler
  //       )
  //     : handler();
  // }
}
