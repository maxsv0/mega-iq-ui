/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */

import 'zone.js/dist/zone-node';

import * as express from 'express';
import {join} from 'path';
import {SitemapStream, streamToPromise} from 'sitemap';
import {createGzip} from 'zlib';
import {APP_LOCALE_ID} from './src/environments/app-locale';

const fs = require('fs');

const https = require('https');

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap} = require('./dist/server/main');

let sitemap;

app.get('/sitemap.xml', function (req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Content-Encoding', 'gzip');

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
    const pipeline = smStream.pipe(createGzip());

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

    if (fs.existsSync('/tmp/list-latest.json')) {
      const data = fs.readFileSync('/tmp/list-latest.json', 'utf8');
      const tests = JSON.parse(data);

      if (tests && tests.ok && tests.tests) {
        for (const testInfo of tests.tests) {
          smStream.write({
            url: testInfo.url,
            changefreq: 'monthly',
            priority: 0.3
          });
        }
      }
    }

    smStream.write({url: '/register', changefreq: 'monthly', priority: 0.2});
    smStream.write({url: '/login', changefreq: 'monthly', priority: 0.2});
    smStream.write({url: '/forget', changefreq: 'monthly', priority: 0.2});
    smStream.write({url: '/assets/static/about.html', changefreq: 'monthly', priority: 0.1});
    smStream.write({url: '/assets/static/privacy-policy.html', changefreq: 'monthly', priority: 0.1});
    smStream.write({url: '/assets/static/terms-conditions.html', changefreq: 'monthly', priority: 0.1});

    smStream.end();

    // cache the response
    streamToPromise(pipeline).then(sm => sitemap = sm);
    // stream write the response
    pipeline.pipe(res).on('error', (e) => {
      res.status(500).end();
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// // All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', {req});
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
