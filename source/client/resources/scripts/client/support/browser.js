/*jslint browser: true, plusplus: true, regexp: true*/
/*global define, DocumentTouch*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        pocketKnife = require("support/pocketKnife"),

        browser = function browser() {

            var isSpprtd,
                isIOsSfr,
                isAndroidBrwsr,
                isAndroidSlk,
                isWebOsBrwsr,
                isWindowsPhoneInternetXplrr,
                isFirefoxMbl,
                isOperaMbl,
                isOperaMn,
                isBlackBerryOsBrwsr,
                isMbl,
                isWebSocketSpprtd,
                isFullScreenSpprtd,
                arePointerEventsSpprtd,
                areTouchEventsSpprtd,
                areWheelEventsSpprtd,
                areMousewheelEventsSpprtd,
                instance = {},

                isSupported = function isSupported() {

                    return isSpprtd;
                },

                isDesktop = function isDesktop() {

                    return !isMbl;
                },

                isMobile = function isMobile() {

                    return isMbl;
                },

                isIOsSafari = function isIOsSafari() {

                    return isIOsSfr;
                },

                isAndroidBrowser = function isAndroidBrowser() {

                    return isAndroidBrwsr;
                },

                isAndroidSilk = function isAndroidSilk() {

                    return isAndroidSlk;
                },

                isWebOsBrowser = function isWebOsBrowser() {

                    return isWebOsBrwsr;
                },

                isWindowsPhoneInternetExplorer = function isWindowsPhoneInternetExplorer() {

                    return isWindowsPhoneInternetXplrr;
                },

                isFirefoxMobile = function isFirefoxMobile() {

                    return isFirefoxMbl;
                },

                isOperaMobile = function isOperaMobile() {

                    return isOperaMbl;
                },

                isOperaMini = function isOperaMini() {

                    return isOperaMn;
                },

                isBlackBerryOsBrowser = function isBlackBerryOsBrowser() {

                    return isBlackBerryOsBrwsr;
                },

                isWebSocketSupported = function isWebSocketSupported() {

                    return isWebSocketSpprtd;
                },

                isFullScreenSupported = function isFullScreenSupported() {

                    return isFullScreenSpprtd;
                },

                isJsonSupported = function isJsonSupported() {

                    return !!JSON;
                },

                isCanvasSupported = function isCanvasSupported() {

                    return !!jquery("<canvas>").get(0).getContext;
                },

                isCanvasTextSupported = function isCanvasTextSupported() {

                    return pocketKnife.isFunction(jquery("<canvas>").get(0).getContext("2d").fillText);
                },

                arePointerEventsSupported = function arePointerEventsSupported() {

                    return arePointerEventsSpprtd;
                },

                areTouchEventsSupported = function areTouchEventsSupported() {

                    return areTouchEventsSpprtd;
                },

                areWheelEventsSupported = function areWheelEventsSupported() {

                    return areWheelEventsSpprtd;
                },

                areMousewheelEventsSupported = function areMousewheelEventsSupported() {

                    return areMousewheelEventsSpprtd;
                },

                initialise = function initialise() {

                    var userAgent = navigator.userAgent;

                    isIOsSfr = (/iPhone|iPod|iPad/i).test(userAgent);
                    isAndroidBrwsr = (/Android/i).test(userAgent);
                    isAndroidSlk = (/Silk/i).test(userAgent);
                    isWebOsBrwsr = (/webOS|hpwOS/i).test(userAgent);
                    isWindowsPhoneInternetXplrr = (/IEMobile/i).test(userAgent);
                    isFirefoxMbl = (/(Mobile|Tablet).*Firefox/i).test(userAgent);
                    isOperaMbl = (/Opera Mobi/i).test(userAgent);
                    isOperaMn = (/Opera Mini/i).test(userAgent);
                    isBlackBerryOsBrwsr = (/BlackBerry/i).test(userAgent);
                    isSpprtd = isJsonSupported() && isCanvasSupported();
                    //>>excludeStart("clientRelease", pragmas.clientRelease);
                    isSpprtd = isJsonSupported() && isCanvasSupported() && isCanvasTextSupported();
                    //>>excludeEnd("clientRelease");
                    isMbl = isIOsSfr || isAndroidBrwsr || isAndroidSlk || isWebOsBrwsr || isWindowsPhoneInternetXplrr || isFirefoxMbl || isOperaMbl || isOperaMn || isBlackBerryOsBrwsr;
                    isWebSocketSpprtd = !!(window.WebSocket || window.MozWebSocket);
                    isFullScreenSpprtd = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled);
                    arePointerEventsSpprtd = !!navigator.msPointerEnabled;
                    areTouchEventsSpprtd = window.ontouchstart !== undefined || !!(window.DocumentTouch && document instanceof DocumentTouch);
                    areWheelEventsSpprtd = window.onwheel !== undefined;
                    areMousewheelEventsSpprtd = window.onmousewheel !== undefined;
                };

            instance.isSupported = isSupported;
            instance.isDesktop = isDesktop;
            instance.isMobile = isMobile;
            instance.isIOsSafari = isIOsSafari;
            instance.isAndroidBrowser = isAndroidBrowser;
            instance.isAndroidSilk = isAndroidSilk;
            instance.isWebOsBrowser = isWebOsBrowser;
            instance.isWindowsPhoneInternetExplorer = isWindowsPhoneInternetExplorer;
            instance.isFirefoxMobile = isFirefoxMobile;
            instance.isOperaMobile = isOperaMobile;
            instance.isOperaMini = isOperaMini;
            instance.isBlackBerryOsBrowser = isBlackBerryOsBrowser;
            instance.isWebSocketSupported = isWebSocketSupported;
            instance.isFullScreenSupported = isFullScreenSupported;
            instance.arePointerEventsSupported = arePointerEventsSupported;
            instance.areTouchEventsSupported = areTouchEventsSupported;
            instance.areWheelEventsSupported = areWheelEventsSupported;
            instance.areMousewheelEventsSupported = areMousewheelEventsSupported;
            initialise();

            return instance;
        };

    return browser();
});
