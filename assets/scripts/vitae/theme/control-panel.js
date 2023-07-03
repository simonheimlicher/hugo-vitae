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

  // Persist changes using the browser's localstorage.
  // Store key/ value per knob, where key is the knob's label.
  persist: true,

  knobs: [
    {
      cssVar: ['page_scale-factor', '-%'], // prefix unit with '-' makes it only a part of the title but not of the variable
      label: 'Zoom',
      labelTitle: 'Adjust zoom',
      type: 'range',
      // value: 1, // try to get the value using getComputedStyle and getPropertyValue
      min: 0.25,
      max: 4,
      step: 0.01,
      // onChange: console.log  // javascript callback on every "input" event
    },
    {
      cssVar: ['rem_print', 'pt'], // prefix unit with '-' makes it only a part of the title but not of the variable
      label: 'Base unit',
      labelTitle: 'Adjust base unit',
      type: 'range',
      // value: 10, // try to get the value using getComputedStyle and getPropertyValue
      min: 7,
      max: 12,
      step: 0.1,
      // onChange: () => {
      //   console.log('window.vitae=', window.viae);
      //   if (window.vitae) {
      //     console.log('rem_print changed. Rendering print preview');
      //     window.vitae.printView.renderPrintPreview();
      //   }
      //   else {
      //     console.log('rem_print changed but window.vitae=', window.viae);
      //   }
      // },
    },
    {
      cssVar: ['em_print', 'pt'], // prefix unit with '-' makes it only a part of the title but not of the variable
      label: 'Font size',
      labelTitle: 'Adjust base font size',
      type: 'range',
      // value: 10, // try to get the value using getComputedStyle and getPropertyValue
      min: 7,
      max: 12,
      step: 0.1,
      // onChange: console.log,
      onChange: (e, knobData) => console.log(e, knobData, knobData.value),
    },
    /*
    {
      label: 'Control',
      render: `
      <button id="renderPrintPreview" title="Render print preview">Render print preview</button>
      <button id="transferOverflow" title="Transfer overflow">Transfer overflow</button>
      <button id="printPreviewToggle" title="Toggle between screen view and print preview">Toggle print preview</button>
      <button id="printButton" title="Print">Print...</button>`,
      script(knobs, name) {
        knobs.getKnobElm(name).addEventListener("click", e => {
          if (e.target.id == 'renderPrintPreview') {
            window.vitae.printView.renderPrintPreview();
          };
          if (e.target.id == 'transferOverflow') {
            window.vitae.printView.transferOverflow();
          };
          if (e.target.id == 'printPreviewToggle') {
            window.vitae.printView.togglePreview();
          };
          if (e.target.id == 'printButton') {
            window.print();
          };
        })
      },
    },
    */
  ]
};

const initializeControlPanel = (conf) => {
  new Knobs(controlPanelSettings);
}

document.addEventListener("DOMContentLoaded", _e => initializeControlPanel());
