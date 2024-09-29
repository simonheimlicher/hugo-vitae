import Knobs from '@yaireo/knobs';

export const initializeControlPanel = () => {
  const varTargetSelector = '.vitae .view-print'
  const varTarget = document.querySelector(varTargetSelector);
  if (! varTarget) {
    console.log(`knobs: failed to bind varTarget to varTargetSelector=${varTargetSelector}`);
  }

  const controlPanelSettings = {
    theme: {
      position: 'bottom left', // default is 'top left'
    },

    // update immediately (default true)
    live: true,

    // 0 - starts as hidden, 1 - starts as visible, 2 - always visible
    visible: 0,

    CSSVarTarget: varTarget,

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
        step: 0.05,
        // onChange: console.log  // javascript callback on every "input" event
      },
      {
        cssVar: ['em_base', '-%'],
        label: 'Font size',
        labelTitle: 'Adjust base font size',
        type: 'range',
        // Getting the value using getComputedStyle and getPropertyValue does not work in Safari
        value: 1,
        min: 0.7,
        max: 1.2,
        step: 0.01,
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
      ['Spacing', true], // if false, group is collapsed by default
      {
        cssVar: ['inner_margin_scale-factor', '-%'],
        label: 'Inner margins',
        labelTitle: 'Adjust inner margins',
        type: 'range',
        // value: 1, // try to get the value using getComputedStyle and getPropertyValue
        min: 0,
        max: 5,
        step: 0.1,
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
        min: 0,
        max: 5,
        step: 0.1,
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
        cssVar: ['line-width_scale-factor', ''],
        label: 'Line width',
        labelTitle: 'Adjust line width',
        type: 'range',
        // value: 1, // try to get the value using getComputedStyle and getPropertyValue
        min: 0,
        max: 5,
        step: 0.1,
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
      ['Page margins', true], // if false, group is collapsed by default
      {
        cssVar: ['page_margin_base_horizontal', '-%'],
        label: 'Page margin horizontal',
        labelTitle: 'Adjust horizontal page margin',
        type: 'range',
        min: 0,
        value: 1,
        max: 5,
        step: 0.1,
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
        cssVar: ['page_margin_base_vertical', '-%'],
        label: 'Page margin vertical',
        labelTitle: 'Adjust vertical page margin',
        type: 'range',
        min: 0,
        value: 1,
        max: 5,
        step: 0.1,
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
      ['Print', false], // if false, group is collapsed by default
      {
        label: 'Control', // label is mandatory
        // FIXME: all buttons need attribute `type='button'`,
        // otherwise they stop live updating of Knobs when clicked for the first time
        render: `
        <button type='button' id="renderPrintPreview" title="Render print preview">Render print preview</button>
        <button type='button' id="transferOverflow" title="Transfer overflow">Transfer overflow</button>
        <button type='button' id="printPreviewToggle" title="Toggle between screen view and print preview">Toggle print preview</button>
        <button type='button' id="printButton" title="Print">Print...</button>`,
        script(knobs, name) {
          knobs.getKnobElm(name).addEventListener("click", e => {
            if (e.target.id == 'renderPrintPreview') {
              window.vitae.printView.renderPrintPreview(true);
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

  // console.log(`Initializing knobs with `, controlPanelSettings);
  const controlPanel = new Knobs(controlPanelSettings);
  controlPanel.render();
}

//———————————————————————————————————————————————
// https://github.com/yairEO/knobs
//———————————————————————————————————————————————

/*
const initializeControlPanelDemo = (conf) => {
  var settings = {
    theme: {
      // flow: 'compact',
      // position: 'bottom left', // default
    },
    // live: false, // should update immediately (default true)
    knobsToggle: true,
    persist: 0, // persist changes using the browser's localstorage. use a string to be able to flush the cache
    visible: 0, // 0 - starts as hidden, 1 - starts as visible, 2 - always visible
    CSSVarTarget: document.querySelector('.testSubject'),

    knobs: [
      {
        isToggled: false,
        cssVar: ['width', 'px'],
        label: 'Width preset',
        type: 'select',
        options: [20, 150, [200, '200 nice pixels'], 500],
        value: 150,
        defaultValue: 150
      },
      {
        cssVar: ['width', 'px'],
        label: 'Width',
        type: 'range',
        value: 200,
        min: 0,
        max: 500,
        step: 50,
        onChange: console.log
      },
      {
        cssVar: ['height', 'vh'],
        label: 'Height',
        type: 'range',
        value: 20,
        min: 0,
        max: 100,
        onChange: console.log
      },

      "So easy to add a group label",
      {
        cssVar: ['align'],
        label: 'Align text',
        type: 'radio',
        name: 'align-radio-group',
        options: [
          { value: 'flex-start', hidden: true, label: '<svg viewBox="0 0 28 28"><path d="M28 21v2c0 0.547-0.453 1-1 1h-26c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h26c0.547 0 1 0.453 1 1zM22 15v2c0 0.547-0.453 1-1 1h-20c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h20c0.547 0 1 0.453 1 1zM26 9v2c0 0.547-0.453 1-1 1h-24c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h24c0.547 0 1 0.453 1 1zM20 3v2c0 0.547-0.453 1-1 1h-18c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h18c0.547 0 1 0.453 1 1z"></path></svg>' },
          { value: 'center', label: 'Center' },
          { value: 'flex-end', hidden: true, label: '<svg viewBox="0 0 28 28"><path d="M28 21v2c0 0.547-0.453 1-1 1h-26c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h26c0.547 0 1 0.453 1 1zM28 15v2c0 0.547-0.453 1-1 1h-20c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h20c0.547 0 1 0.453 1 1zM28 9v2c0 0.547-0.453 1-1 1h-24c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h24c0.547 0 1 0.453 1 1zM28 3v2c0 0.547-0.453 1-1 1h-18c-0.547 0-1-0.453-1-1v-2c0-0.547 0.453-1 1-1h18c0.547 0 1 0.453 1 1z"></path></svg>' }
        ],
        value: 'center',
        defaultValue: 'flex-start'
      },
      {
        cssVar: ['radius', '%'],
        label: 'Radius of the big square here',
        type: 'range',
        value: 0,
        min: 0,
        max: 50,
        onChange: console.log
      },
      {
        cssVar: ['bg'], // alias for the CSS variable
        label: 'Color',
        type: 'color',
        value: '#45FDA9',
        onChange: console.log
      },
      {
        cssVar: ['main-bg', null, document.body], // [alias for the CSS variable, units, applies on element]
        label: 'Background',
        type: 'color',
        value: '#FFFFFF',
        onChange: console.log
      },
      {
        cssVar: ['hide'], // alias for the CSS variable
        label: 'Hide',
        type: 'checkbox',
        // checked: true,
        value: 'none',
        onChange: console.log
      }
    ]
  }

  var myKnobs = new Knobs(settings)

  // Add more knobs after initialization
  myKnobs.knobs = [...myKnobs.knobs, ...[
    "Knobs Self Parameters",
    {
      label: 'Compact View',
      type: 'checkbox',
      value: 'none',
      checked: myKnobs.settings.theme.flow == 'compact',
      onChange: (e, knobData = {}) => {
        console.log(knobData)
        if (myKnobs) {
          myKnobs.DOM.scope[`${(knobData.checked ? "set" : "remove")}Attribute`]("data-flow", "compact")
          setTimeout(() => {
            myKnobs.calculateGroupsHeights()
            myKnobs.toggle(myKnobs.state.visible)
          }, 300)
        }
      }
    },
    {
      cssVar: ['knobs-gap', 'px'],
      label: 'Space between knobs',
      type: 'range',
      value: 3,
      min: 0,
      max: 10,
      step: 1,
      onChange: (e, knobData = {}) => {
        if (myKnobs) {
          myKnobs.DOM.scope.style.setProperty(`--knobs-gap`, `${knobData.value}px`)
          myKnobs.calculateGroupsHeights()
          myKnobs.toggle(myKnobs.state.visible)
        }
      }
    },
    {
      cssVar: ['background', null, myKnobs.DOM.scope],
      label: 'Knobs Background',
      type: 'color',
      value: '#000000'
    },
    {
      cssVar: ['primaryColor', null, myKnobs.DOM.scope],
      label: 'Slider Color',
      type: 'color',
      value: '#0366D6'
    },
    {
      cssVar: ['textColor', null, myKnobs.DOM.scope],
      label: 'Text Color',
      type: 'color',
      value: '#FFFFFF',
    },

    "custom buttons",

    {
      label: 'Custom HTML with label',
      render: `
            <button type='button' class='specialBtn1'>1</button>
            <button type='button' class='specialBtn2'>2</button>
          `,
      script(knobs, name) {
        knobs.getKnobElm(name).addEventListener("click", e => {
          if (e.target.tagName == 'BUTTON')
            alert(e.target.textContent)
        })
      },
    },
    ['Print', true], // if false, group is collapsed by default
    {
      label: 'Control', // label is mandatory
      render: `
      <button type='button' class='specialBtn1'>1</button>
      <button type='button' class="renderPrintPreview" title="Render print preview">Render print preview</button>
      `,
      script(knobs, name) {
        knobs.getKnobElm(name).addEventListener("click", e => {
          if (e.target.tagName == 'BUTTON')
            alert(e.target.textContent)
        })
      },
    },
  ]]

  myKnobs.render();

  // open knobs after some delay
  setTimeout(myKnobs.toggle.bind(myKnobs), 1000);
}

document.addEventListener("DOMContentLoaded", _e => initializeControlPanelDemo());
*/
