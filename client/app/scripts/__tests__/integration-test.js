import jsdom from 'jsdom';
import expect from 'expect';
import { map as makeMap } from 'immutable';
import each from 'lodash/each';

// import { initialState } from '../reducers/root';
import { getTopologies } from '../utils/web-api-utils';
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

    before((done) => {
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
      // it('from path "/"', (done) => {
      //
      // });
      // it('from path "app/loud-breeze-77"', (done) => {
      //   server.test((req) => {
      //     expect(req.url).toEqual('/api/app/loud-breeze-77/api/topology?');
      //     done();
      //   });
      //   setPath('/app/loud-breeze-77');
      //   getTopologies(makeMap, dispatch);
      // });
      // it('from path "/demo"', (done) => {
      //   server.test((req) => {
      //     expect(req.url).toEqual('/demo/api/topology?');
      //     done();
      //   });
      //   setPath('/demo');
      //   getTopologies(makeMap, dispatch);
      // });
    });
  });
});
