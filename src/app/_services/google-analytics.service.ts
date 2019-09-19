import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

declare var ga: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  constructor() {
  }

  public appendGaTrackingCode() {
    try {
      const script = document.createElement('script');
      script.innerHTML = `
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', '` + environment.googleAnalyticsKey + `', 'auto');
      `;
      document.head.appendChild(script);
    } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
    }
  }

  public sendPageView(url: string) {
    try {
      if (typeof ga === 'function') {
        ga('set', 'page', url);
        ga('send', 'pageview');
        console.log('%%% Google Analytics page view event %%%');
      }
    } catch (e) {
      console.log(e);
    }
  }

  public sendEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    try {
      if (typeof ga === 'function') {
        ga('send', 'event', {
          eventCategory: eventCategory,
          eventLabel: eventLabel,
          eventAction: eventAction,
          eventValue: eventValue
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
