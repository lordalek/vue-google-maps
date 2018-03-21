import { error } from "util";

/* vim: set softtabstop=2 shiftwidth=2 expandtab : */

var setUp = false;

export const loaded = new Promise((resolve, reject) => {
  // eslint-disable-line no-unused-vars
  if (typeof window === 'undefined') {
    // Do nothing if run from server-side
    return;
  }
  window['vueGoogleMapsInit'] = resolve;
});

/**
 * @param urlParams query params added to google api url
 * @param loadCn    Boolean. If set to true, the map will be loaded form goole maps China
 *                  (@see https://developers.google.com/maps/documentation/javascript/basics#GoogleMapsChina)
 *
 * Example:
 * ```
 *      import {load} from 'vue-google-maps'
 *
 *     
 *      load({
 *              key: <YOUR-API-KEY>,              
 *      }, loadCn: true)
 *
 *      load({
 *              client: <YOUR-CLIENT-ID>,
 *              channel: <YOUR CHANNEL>
 *      })
 * ```
 */
export const load = (urlParams, loadCn) => {
  if (typeof document === 'undefined') {
    // Do nothing if run from server-side
    return;
  }
  if (!setUp) {
    const googleMapScript = document.createElement('SCRIPT');

    // Allow apiKey to be an object.
    // This is to support more esoteric means of loading Google Maps,
    // such as Google for business
    // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth    
    if (typeof urlParams !== 'object') throw new Error("load must be typeof object");else {
      urlParams['callback'] = 'vueGoogleMapsInit';

      let baseUrl = 'https://maps.googleapis.com/';

      if (typeof loadCn === 'boolean' && loadCn === true) {
        baseUrl = 'http://maps.google.cn/';
      }

      let url = baseUrl + 'maps/api/js?' + Object.keys(urlParams).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(urlParams[key])).join('&');

      googleMapScript.setAttribute('src', url);
      googleMapScript.setAttribute('async', '');
      googleMapScript.setAttribute('defer', '');
      document.head.appendChild(googleMapScript);
    }
  } else {
    throw new Error('You already started the loading of google maps');
  }
};