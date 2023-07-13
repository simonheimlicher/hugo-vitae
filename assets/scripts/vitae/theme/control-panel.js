import Knobs from '@yaireo/knobs';

const controlPanelSettings = {
  theme: {
    position: 'top right', // default is 'top left'
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
      cssVar: ['page_margin_base_horizontal', 'mm'],
      label: 'Page margin horizontal',
      labelTitle: 'Adjust horizontal page margin',
      type: 'range',
      min: 0,
      // value: 15,
      max: 100,
      step: 0.5,
    },
    {
      cssVar: ['page_margin_base_center_horizontal', '-%'],
      label: 'Page margin horizontal center',
      labelTitle: 'Adjust page margin horizontal center',
      type: 'range',
      min: 0,
      value: 0.5,
      max: 1,
      step: 0.01,
    },
    {
      cssVar: ['page_margin_base_vertical', 'mm'],
      label: 'Page margin vertical',
      labelTitle: 'Adjust vertical page margin',
      type: 'range',
      min: 0,
      // value: 15,
      max: 100,
      step: 0.5,
    },
    {
      cssVar: ['page_margin_base_center_vertical', '-%'],
      label: 'Page margin vertical center',
      labelTitle: 'Adjust page margin vertical center',
      type: 'range',
      min: 0,
      value: 0.5,
      max: 1,
      step: 0.01,
    },
    ['Print', true], // group is collapsed by default
    {
      label: 'Control', // label is mandatory
      render: `
      <button id="renderPrintPreview" title="Render print preview">Render print preview</button>
      <button id="transferOverflow" title="Transfer overflow">Transfer overflow</button>
      <button id="printPreviewToggle" title="Toggle between screen view and print preview">Toggle print preview</button>
      <button id="printButton" title="Print">Print...</button>`,
      script(knobs, name) {
        knobs.getKnobElm(name).addEventListener("click", e => {
          if (e.target.id == 'renderPrintPreview') {
            alert(e.target.textContent);
            // window.vitae.printView.renderPrintPreview(true);
          };
          if (e.target.id == 'transferOverflow') {
            window.vitae.printView.transferOverflow();
          };
          if (e.target.id == 'printPreviewToggle') {
            window.vitae.printView.togglePreview(e.shiftKey);
          };
          if (e.target.id == 'printButton') {
            window.print();
          };
        })
      },
    },
  ]
};

const initializeControlPanel = (conf) => {
  if (true) {
    const controlPanel = new Knobs(controlPanelSettings);
  }
  else {
    const parentNode = document.body;

    // controlPanelSettings.standalone = true;
    const controlPanelSettingsStandalone = {
      CSSVarTarget: document.querySelector('#vitaeContainer'),
      // persist: true,
      standalone: true,
      // standalone: false,
      knobs: [
        ["Label example", false], // group is collapsed by default
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
      ]
    };

    // FIXME: Does not work as an error occurs already
    // in the constructor of Knobs when`standalone = true`
    const controlPanel = new Knobs(controlPanelSettingsStandalone);
    // parentNode.appendChild(controlPanel.knobs.DOM.scope);
  }
}

document.addEventListener("DOMContentLoaded", _e => initializeControlPanel());
