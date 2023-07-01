import Knobs from '@yaireo/knobs';

const controlPanelSettings = {
  theme: {
    position: 'bottom right', // default is 'top left'
  },

  // update immediately (default true)
  live: true,

  // 0 - starts as hidden, 1 - starts as visible, 2 - always visible
  visible: 1,

  CSSVarTarget: document.querySelector('#vitaeContainer'),

  knobs: [
    {
      cssVar: ['page_scale-factor', '-%'], // prefix unit with '-' makes it only a part of the title but not of the variable
      label: 'Zoom',
      labelTitle: 'Adjust zoom',
      type: 'range',
      value: 1,
      min: 0.25,
      max: 4,
      step: 0.01,
      // onChange: console.log  // javascript callback on every "input" event
    },
  ]
};

const initializeControlPanel = (conf) => {
  new Knobs(controlPanelSettings);
}

document.addEventListener("DOMContentLoaded", _e => initializeControlPanel());
