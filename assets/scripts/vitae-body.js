/* File='scripts/vitae-body.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// console.log('BEGIN vitae-body');
// NOTE: JavaScript code in this file is executed as a module at the bottom of the <body>
// This means that
// * Loading is "defer" on browsers that support the "module" attribute
//   while all other browsers ignore this script
// * Execution is synchronous, i.e., the script does not have the "async" attribute

// NOTE: Optional modules must be conditionally included at the Go template-level;
// otherwise, they would have to be installed independently of the Hugo config.
// Therefore, all optional NPM packages are loaded in this Go template script

let vitaeOptionalModules = [];
// Additional modules that can be imported: "./control-panel", "./print-view"
import { initializeControlPanel } from "scripts/vitae/optional/control-panel";
vitaeOptionalModules.push(initializeControlPanel);
import { initializePrintView } from "scripts/vitae/optional/print-view";
vitaeOptionalModules.push(initializePrintView);

onDOMContentLoaded(...vitaeOptionalModules);
// console.log('END   vitae-body');
