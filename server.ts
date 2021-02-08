/************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/dist/zone-node';

import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {join} from 'path';

import {AppServerModule} from './src/main.server';
import {existsSync} from 'fs';

import 'localstorage-polyfill';
import {SitemapStream} from 'sitemap';
import {APP_LOCALE_ID} from './src/environments/app-locale';
import {DATA_TEST_RESULT, DATA_TESTS, DATA_USERS_LIST, DATA_USERS_TOP} from './src/app/_helpers/tokens';
import {ApiResponseTests, ApiResponseUsersList, ApiResponseUsersTop} from './src/app/_models';
import {ApiResponsePublicTestResultList} from './src/app/_models/api-response-public-test-result-list';

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

// we will load latest IQ test results from API and save to a local file
// periodically, so it could be used by /sitemap.xml request
// job set every hour.
let sitemap = '';
let apiTests: ApiResponseTests;
let apiUsersTop: ApiResponseUsersTop;
let apiListLatest: ApiResponsePublicTestResultList;
const apiListLatestPages: ApiResponsePublicTestResultList[] = [];
let apiUserList: ApiResponseUsersList;
const http = require('https');

const CronJob = require('cron').CronJob;
const job = new CronJob('0 7 * * * *', function () {
  http.get(hostName + 'api/v1/list-latest-all', function (response) {
    let body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      sitemap = body;
    });
  });
}, null, true, 'Europe/Berlin');
job.start();

const jobTestTypes = new CronJob('0 3 * * * *', function () {
  http.get(hostName + 'api/v1/test', function (response) {
    let body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      apiTests = JSON.parse(body);
      console.log('Data for api/v1/test updated at=' + apiTests.date);
    });
  });
}, null, true, 'Europe/Berlin', null, true);
jobTestTypes.start();

const jobUserTop = new CronJob('0 */5 * * * *', function () {
  http.get(hostName + 'api/v1/user/top', function (response) {
    let body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      apiUsersTop = JSON.parse(body);
      console.log('Data for api/v1/user/top updated at=' + apiUsersTop.date);
    });
  });
}, null, true, 'Europe/Berlin', null, true);
jobUserTop.start();

const jobListLatest = new CronJob('0 */17 * * * *', function () {
  http.get(hostName + 'api/v1/list-latest?page=0&size=20', function (response) {
    let body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      apiListLatest = JSON.parse(body);
      console.log('Data for api/v1/user/top updated at=' + apiListLatest.date);
    });
  });
}, null, true, 'Europe/Berlin', null, true);
jobListLatest.start();

for (let i = 0; i < 10; i++) {
  const jobListLatestPage = new CronJob('0 */' + (17 + i * 2) + ' * * * *', function () {
    http.get(hostName + 'api/v1/list-latest?p`age=' + i + '&size=50', function (response) {
      let body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        apiListLatestPages[i] = JSON.parse(body);
        console.log('Data for api/v1/user/list-latest:Page ' + i + ' updated at=' + apiListLatestPages[i].date);
      });
    });
  }, null, true, 'Europe/Berlin', null, true);
  jobListLatestPage.start();
}

const jobUserList = new CronJob('0 */7 * * * *', function () {
  http.get(hostName + 'api/v1/user/list', function (response) {
    let body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      apiUserList = JSON.parse(body);
      console.log('Data for api/v1/user/list updated at=' + apiUserList.date);
    });
  });
}, null, true, 'Europe/Berlin', null, true);
jobUserList.start();

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/browser/' + APP_LOCALE_ID);
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
    providers: []
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('/sitemap.xml', function (req, res) {
    res.setHeader('Content-Type', 'application/xml');

    try {
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

      if (apiUserList && apiUserList.ok && apiUserList.users) {
        for (const user of apiUserList.users) {
          if (user.url) {
            smStream.write({
              url: user.url,
              changefreq: 'weekly',
              priority: 0.5
            });
          }
        }
      }

      if (sitemap && sitemap !== '') {
        const tests = JSON.parse(sitemap);

        if (tests && tests.ok && tests.tests) {
          for (const testInfo of tests.tests) {
            if (testInfo.url) {
              smStream.write({
                url: testInfo.url,
                changefreq: 'monthly',
                priority: 0.3
              });
            }
          }
        }
      }

      smStream.write({url: '/register', changefreq: 'monthly', priority: 0.2});
      smStream.write({url: '/login', changefreq: 'monthly', priority: 0.2});
      smStream.write({url: '/forget', changefreq: 'monthly', priority: 0.2});

      // @ts-ignore
      if (APP_LOCALE_ID === 'en') {
        smStream.write({url: '/assets/static/about.html', changefreq: 'monthly', priority: 0.1});
        smStream.write({url: '/assets/static/privacy-policy.html', changefreq: 'monthly', priority: 0.1});
        smStream.write({url: '/assets/static/terms-conditions.html', changefreq: 'monthly', priority: 0.1});
      }

      smStream.end();

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


  server.get('/:page/sitemap-result.xml', function (req, res) {
    res.setHeader('Content-Type', 'application/xml');

    try {
      const smStream = new SitemapStream({hostname: hostName});
      const resultPage = apiListLatestPages[req.params.page];

      if (req.params.page && resultPage && resultPage.ok && resultPage.tests) {
        for (const testInfo of resultPage.tests) {
          if (testInfo.url) {
            smStream.write({
              url: testInfo.url,
              changefreq: 'monthly',
              priority: 0.3
            });
          }
        }
      }

      smStream.end();

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

  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      res,
      providers: [
        {
          provide: DATA_TESTS,
          useValue: apiTests
        },
        {
          provide: DATA_USERS_TOP,
          useValue: apiUsersTop
        },
        {
          provide: DATA_TEST_RESULT,
          useValue: apiListLatest
        },
        {
          provide: DATA_USERS_LIST,
          useValue: apiUserList
        }
      ]
    });
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
