/* File='scripts/claris/bundles/03_optional.js': hugo.Environment='{{ hugo.Environment }}' .Page='{{ .Page }}' .MediaType='{{ .MediaType }}' */

// JavaScript code in this file is loaded on the `load` event based on
// code that is added at the bottom of <body> This means that
// * Loading only starts after *First Contentful Paint*
// * Execution is synchronous, i.e., the script does not have the "async"
//   attribute

// NOTE: Optional modules must be conditionally included at the Go template-level;
// otherwise, they would have to be installed independently of the Hugo config.
// Therefore, all optional NPM packages are loaded in this Go template script
{{- $initializers := slice }}

{{- if page.Param "vitae.render.qrcode" }}
import { qrCodeInit } from "scripts/claris/optional/qrcode-svg";
  {{- $initializers = append "qrCodeInit" $initializers }}
{{- end }}

{{- if (page.Param "vitae.render.preview") }}
import { initializeControlPanel } from "scripts/vitae/optional/control-panel";
  {{- $initializers = append "initializeControlPanel" $initializers }}
{{- end }}

{{- with $initializers }}
import { onDOMContentLoaded } from "scripts/claris/base/functions";
onDOMContentLoaded({{ delimit $initializers ", " }});
{{- end }}
