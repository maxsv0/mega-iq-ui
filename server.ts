/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

import 'localstorage-polyfill';
import {SitemapStream, streamToPromise} from 'sitemap';
import {APP_LOCALE_ID} from './src/environments/app-locale';
global['localStorage'] = localStorage;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser/' + APP_LOCALE_ID);
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  let sitemap;

  server.get('/sitemap.xml', function (req, res) {
    res.setHeader('Content-Type', 'application/xml');

    // if we have a cached entry send it
    if (sitemap) {
      res.send(sitemap);
      return;
    }

    try {
      let hostName = 'https://www.mega-iq.com/';
      // @ts-ignore
      if (APP_LOCALE_ID === 'de') {
        hostName = 'https://de.mega-iq.com/';
        // @ts-ignore
      } else if (APP_LOCALE_ID === 'es') {
        hostName = 'https://es.mega-iq.com/';
        // @ts-ignore
      } else if (APP_LOCALE_ID === 'ru') {
        hostName = 'https://ru.mega-iq.com/';
      }

      const smStream = new SitemapStream({hostname: hostName});

      // pipe your entries or directly write them.
      smStream.write({url: '/', changefreq: 'hourly', priority: 0.9});
      smStream.write({url: '/iqtest', changefreq: 'daily', priority: 0.95});
      smStream.write({url: '/iqtest/mega-iq', changefreq: 'weekly', priority: 0.9});
      smStream.write({url: '/iqtest/iq-practice', changefreq: 'weekly', priority: 0.9});
      smStream.write({url: '/iqtest/iq-standard', changefreq: 'weekly', priority: 0.9});
      smStream.write({url: '/iqtest/math', changefreq: 'weekly', priority: 0.9});
      smStream.write({url: '/iqtest/grammar', changefreq: 'weekly', priority: 0.9});
      smStream.write({url: '/iqtest/results', changefreq: 'hourly', priority: 0.8});
      smStream.write({url: '/iqtest/users', changefreq: 'hourly', priority: 0.8});

      // if (fs.existsSync('/tmp/list-latest.json')) {
      //   const data = fs.readFileSync('/tmp/list-latest.json', 'utf8');
      //   const tests = JSON.parse(data);
      //
      //   if (tests && tests.ok && tests.tests) {
      //     for (const testInfo of tests.tests) {
      //       smStream.write({
      //         url: testInfo.url,
      //         changefreq: 'monthly',
      //         priority: 0.3
      //       });
      //     }
      //   }
      // }

      smStream.write({url: '/register', changefreq: 'monthly', priority: 0.2});
      smStream.write({url: '/login', changefreq: 'monthly', priority: 0.2});
      smStream.write({url: '/forget', changefreq: 'monthly', priority: 0.2});
      smStream.write({url: '/assets/static/about.html', changefreq: 'monthly', priority: 0.1});
      smStream.write({url: '/assets/static/privacy-policy.html', changefreq: 'monthly', priority: 0.1});
      smStream.write({url: '/assets/static/terms-conditions.html', changefreq: 'monthly', priority: 0.1});

      smStream.end();

      // cache the response
      streamToPromise(smStream).then(sm => sitemap = sm);

      // stream write the response
      smStream.pipe(res).on('error', (e) => {
        console.error(e);
        res.status(500).end();
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
