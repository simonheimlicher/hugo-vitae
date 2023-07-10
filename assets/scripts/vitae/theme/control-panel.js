import Knobs from '@yaireo/knobs';

const controlPanelSettings = {
  theme: {
    position: 'bottom right', // default is 'top left'
  },

  // update immediately (default true)
  live: true,

  // 0 - starts as hidden, 1 - starts as visible, 2 - always visible
  visible: 0,

  CSSVarTarget: document.querySelector('#vitaeContainer'),

  // Persist changes using the browser's localstorage.
  // Store key/ value per knob, where key is the knob's label.
  persist: true,

  standalone: false,

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
      cssVar: ['inner_margin_scale-factor', '-%'],
      label: 'Inner margins',
      labelTitle: 'Adjust inner margins',
      type: 'range',
      // value: 1, // try to get the value using getComputedStyle and getPropertyValue
      min: 0.25,
      max: 4,
      step: 0.01,
      // onChange: () => {
      //   if (window.vitae) {
      //     console.log('inner_margin_base changed. Calling renderPrintPreview');
      //     window.vitae.printView.renderPrintPreview();
      //   }
      //   else {
      //     console.log('inner_margin_base changed but window.vitae=', window.viae);
      //   }
      // },
    },
    {
      cssVar: ['inner_padding_scale-factor', '-%'],
      label: 'Inner padding',
      labelTitle: 'Adjust inner padding',
      type: 'range',
      // value: 1, // try to get the value using getComputedStyle and getPropertyValue
      min: 0.25,
      max: 4,
      step: 0.01,
      // onChange: () => {
      //   if (window.vitae) {
      //     console.log('inner_margin_base changed. Calling renderPrintPreview');
      //     window.vitae.printView.renderPrintPreview();
      //   }
      //   else {
      //     console.log('inner_margin_base changed but window.vitae=', window.viae);
      //   }
      // },
    },
    {
      cssVar: ['line_width_scale-factor', ''],
      label: 'Line width',
      labelTitle: 'Adjust line width',
      type: 'range',
      // value: 1, // try to get the value using getComputedStyle and getPropertyValue
      min: 0.25,
      max: 4,
      step: 0.01,
      // onChange: () => {
      //   if (window.vitae) {
      //     console.log('line_width_base changed. Calling renderPrintPreview');
      //     window.vitae.printView.renderPrintPreview();
      //   }
      //   else {
      //     console.log('line_width_base changed but window.vitae=', window.viae);
      //   }
      // },
    },
    {
      cssVar: ['em_base', 'pt'],
      label: 'Font size',
      labelTitle: 'Adjust base font size',
      type: 'range',
      // Getting the value using getComputedStyle and getPropertyValue does not work in Safari
      value: 10,
      min: 7,
      max: 12,
      step: 0.1,
      // onChange: console.log,
      // onChange: (e, knobData) => console.log(e, knobData, knobData.value),
      // onChange: () => {
      //   if (window.vitae) {
      //     console.log('em_base changed. Calling renderPrintPreview');
      //     window.vitae.printView.renderPrintPreview();
      //   }
      //   else {
      //     console.log('em_base changed but window.vitae=', window.viae);
      //   }
      // }
  },
    {
      cssVar: ['page_margin_base_top', 'mm'],
      label: 'Page margin top',
      labelTitle: 'Adjust top page margin',
      type: 'range',
      min: 0,
      value: 10,
      max: 100,
      step: 0.5,
    },
    {
      cssVar: ['page_margin_base_bottom', 'mm'],
      label: 'Page margin bottom',
      labelTitle: 'Adjust bottom page margin',
      type: 'range',
      min: 0,
      value: 15,
      max: 100,
      step: 0.5,
    },
    {
      cssVar: ['page_margin_base_left', 'mm'],
      label: 'Page margin left',
      labelTitle: 'Adjust left page margin',
      type: 'range',
      min: 0,
      value: 15,
      max: 100,
      step: 0.5,
    },
    {
      cssVar: ['page_margin_base_right', 'mm'],
      label: 'Page margin right',
      labelTitle: 'Adjust right page margin',
      type: 'range',
      min: 0,
      value: 15,
      max: 100,
      step: 0.5,
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
  if (true) {
    const controlPanel = new Knobs(controlPanelSettings);
  }
  else {
    controlPanelSettings.standalone = true;
    const controlPanel = new Knobs(controlPanelSettings);
    document.getElementsByName('body').append(controlPanel.knobs.DOM.scope);
  }
}

document.addEventListener("DOMContentLoaded", _e => initializeControlPanel());
