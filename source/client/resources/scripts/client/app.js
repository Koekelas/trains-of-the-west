/**
 * @license Trains Of The West Copyright (c) 2012-2013 by Bart Coppens (art) and Nicolas De Jaeghere (code), All Rights Reserved.
 */

/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        client = require("core/client"),
        browser = require("support/browser"),

        app = function app() {

            var main = function main() {

                    if (browser.isSupported()) {

                        client();
                    } else {

                        var template = require("templates/browserNotSupported"),
                            languageBundle = require("i18n!templates/nls/browserNotSupported");

                        jquery("body").append(template(languageBundle));
                    }
                },

                addListeners = function addListeners() {

                    jquery(document).ready(function onReady() {

                        main();
                    });
                },

                initialise = function initialise() {

                    addListeners();
                };

            initialise();
        };

    return app();
});
