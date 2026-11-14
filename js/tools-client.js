/* AMK Digital Agency: static showcase version of the shared tool code.
   The live website's file of the same name talks to the tools service.
   This one never contacts a server: callTool() returns a fixed sample report
   from js/demo-samples.js, so no page can fail for lack of a backend. */
'use strict';

// Any non-empty value keeps the tool buttons switched on. It is never used as an address.
const TOOLS_API = 'demo';

function demoWait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

// Same call as on the live website. Returns the sample data, or throws a plain message.
async function callTool(tool, body) {
  await demoWait(450);
  const data = window.AMK_DEMO ? window.AMK_DEMO.sample(tool, body) : null;
  if (!data) throw new Error('This tool has no sample report in the demo. Use the live website to run it.');
  return data;
}
