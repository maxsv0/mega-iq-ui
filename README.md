# Mega-IQ UI

Mega-IQ Angular 8 application. Version 1.0-beta

[![Build Status](http://ci.msvhost.com:8080/job/mega-iq-ui-es/badge/icon)](http://ci.msvhost.com:8080/job/mega-iq-ui-es/)

## Features
* Multi-language UI for [Mega-IQ Free Online IQ Test](https://www.mega-iq.com)
* Enabled Server-side rendering
* Secure Firebase authentication
* Bootstrap responsive design
* Fortawesome, chart.js, owl-carousel, flipclock, infinite-scroll, ngx-share and more cool features.

## Issues Tracking
We use [GitHub Projects](https://github.com/maxsv0/mega-iq-ui/projects) and [Issues](https://github.com/maxsv0/mega-iq-ui/issues) 
for tracking the issues and development tasks.

## Contributors and sponsors

Thanks to the [Mega-IQ team](https://www.mega-iq.com/assets/static/about.html) and everyone who was contributing 
to the development and support of Mega-IQ since 2008. 

The Mega-IQ team:

[<img src="https://avatars0.githubusercontent.com/u/3890266?s=72&v=4" alt="Maksym Svistunov" width="72">](https://github.com/maxsv0)
[<img src="https://avatars0.githubusercontent.com/u/37509874?s=72&v=4" alt="Aisangon" width="72">](https://github.com/Aisangon)
[<img src="https://avatars1.githubusercontent.com/u/39739790?s=72&v=4" alt="Olga Svistunova" width="72">](https://github.com/olgasv1)

## Further help

Visit our [GitHub Sponsorship page](https://github.com/sponsors/maxsv0) if you would like 
to become a sponsor and support the Mega-IQ.

## Production server
Local end-point URL: 
* https://www.mega-iq.com (English)
* https://es.mega-iq.com (Español) - ONLINE
* https://ru.mega-iq.com (Русский) - ONLINE
* https://de.mega-iq.com (Deutsch)

## Development server

No separate development environment right now.

### Local development

To setup local development environment:
* Set locale value in the file `src/environments/app-locale.ts`. Possible values: `en`, `es`, `de`, `ru`
* Set the value of `apiUrl` and `apiKey` in the file `src/environments/environment.prod.ts`
* (only for run without SSR) Set the value of `apiUrl` and `apiKey` in the file `src/environments/environment.ts`
* Build app, for example, for English run `npm run build:ssr:en` 
* Run the SSR app `npm run serve:ssr`
* Navigate to `http://localhost:4000/`.
    
Another option is to run without SSR `ng serve` and navigate to `http://localhost:4200/`

## Build Angular application 

Build application 
* For `EN` locale run `npm run build:ssr:en`
* For `RU` locale run `npm run build:ssr:ru`
* For `ES` locale run `npm run build:ssr:es`
* For `DE` locale run `npm run build:ssr:de`

Dont' forget to change value of `APP_LOCALE_ID` and `apiUrl` before running
a build to an appropriate locale value.

The build artifacts will be stored in the `dist/` directory.
The browser app directory is `dist/browser` and a server-side app directory is `dist/server`.

Dont' forget to change locale value in the file `src/environments/app-locale.ts` before running a build.

Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests.

## New Mega-IQ

New Mega-IQ published in two projects 
[Front-end UI](https://github.com/maxsv0/mega-iq-ui/projects) and [Back-end API](https://github.com/maxsv0/mega-iq-api/projects).

| Status   | Tasks   | Repository           | Summary  |
| ------------- |-------------| -----|-----|
| DONE     | 12/12   | [mega-iq-api](https://github.com/maxsv0/mega-iq-api)   |  [Milestone 1. Enable Iq Website features](https://github.com/maxsv0/mega-iq-api/projects/1)  |
| DONE     | 11/11    | [mega-iq-ui](https://github.com/maxsv0/mega-iq-ui)   |  [Milestone 1. Enable Iq Website features](https://github.com/maxsv0/mega-iq-ui/projects/1) |
| DONE     | 17/17    | [mega-iq-api](https://github.com/maxsv0/mega-iq-api)   |  [Milestone 2. Mega-IQ 3.0 release](https://github.com/maxsv0/mega-iq-api/projects/2) |
| DONE     | 47/47    | [mega-iq-ui](https://github.com/maxsv0/mega-iq-ui)   |  [Milestone 2. Mega-IQ 3.0 release](https://github.com/maxsv0/mega-iq-ui/projects/3) |
