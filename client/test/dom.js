import {jsdom} from 'jsdom';
import {fetch} from 'whatwg-fetch';
const WebSocket = require('ws');

global.document = jsdom('');
global.window = document.defaultView;
global.WebSocket = WebSocket;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
