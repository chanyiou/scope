import jsdom from 'jsdom';
import expect, { createSpy } from 'expect';
import { map as makeMap } from 'immutable';
import {each, keys} from 'lodash';

import { initialState } from '../reducers/root';
import { getTopologies, getAllNodes, getNodesDelta } from '../utils/web-api-utils';
import createMockServer from '../../../test/mockServer';

const possiblePathnames = {
  '/': '/api/',
  '/demo/': '/demo/api/',
  '/scoped/': '/scoped/api/',
  '/terminal.html': '/api/',
  '/contrast.html': '/api/',
  '/app/loud-breeze-77': '/api/app/loud-breeze-77/api/'
};

// Run with mocha --compilers js:babel-register  --require test/dom.js app/scripts/__tests__/

const port = 7070;

function setPath(path) {
  jsdom.changeURL(window, `http://localhost:${port}${path}`);
}

describe('integration', () => {
  describe('Scope API URLs', () => {
    let dispatch;
    let server;
    let getState;

    before((done) => {
      dispatch = createSpy();
      getState = overrides => () => initialState.merge(overrides);
      jsdom.changeURL(window, `http://localhost:${port}`);
      server = createMockServer();
      server.listen(port, done);
    });
    after(() => {
      server.close();
    });
    describe('getTopologies', () => {
      const urlSuffix = 'topology?';
      each(possiblePathnames, (desired, path) => {
        it(`from ${path}`, (done) => {
          server.test((req) => {
            expect(req.url).toEqual(`${desired}${urlSuffix}`);
            done();
          });

          setPath(path);
          getTopologies(makeMap, dispatch);
        });
      });
    });
    describe.skip('getAllNodes', () => {
      each(possiblePathnames, (desired, path) => {
        const topologyUrlsById = {
          containers: '/api/topology/containers',
          'containers-by-hostname': '/api/topology/containers-by-hostname',
          'containers-by-image': '/api/topology/containers-by-image',
          hosts: '/api/topology/hosts',
          weave: '/api/topology/weave',
          processes: '/api/topology/processes',
        };
        const requests = [];
        it(`from ${path}`, (done) => {
          server.test((req) => {
            requests.push({path, desired, actual: req.url });
            debugger;
            if (requests.length >= keys(topologyUrlsById).length) {
              // This is broken becaues of fetch
              done();
            }
          });
          setPath(path);
          getAllNodes(getState({ topologyUrlsById }), dispatch);
        });
      });
    });
    describe('getNodesDelta', () => {
      const urlSuffix = 'topology/containers';
      each(possiblePathnames, (desired, path) => {
        it(`from ${path}`, (done) => {
          server.test((req) => {
            expect(req.url).toEqual(`${desired}${urlSuffix}`);
            done();
          });

          setPath(path);
          debugger;
          getNodesDelta(`api/${urlSuffix}`, [], dispatch);
        });
      });
    });
  });
});
