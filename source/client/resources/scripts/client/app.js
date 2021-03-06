/**
 * @license Trains of the West Copyright (c) 2012-2014 by Bart Coppens (art) and Nicolas De Jaeghere (code), All Rights Reserved.
 * https://github.com/Koekelas/trains-of-the-west/blob/master/LICENSE
 */

/*jslint browser: true, plusplus: true*/
/*global define*/

/**
 * The Trains of the West client.
 *
 * @module client
 * @namespace client
 */
define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        client = require("core/client"),
        browser = require("support/browser"),

        /**
         * Responsible for bootstrapping the client.
         *
         * @class app
         * @static
         */
        app = function app() {

                /**
                 * Checks if the browser is capable of running the client. If it is, it instantiates the client. If it isn't, it renders an error message.
                 *
                 * @method main
                 * @private
                 */
            var main = function main() {

                    if (browser.isSupported()) {

                        client();
                    } else {

                        var template = require("templates/browserNotSupported"),
                            languageBundle = require("i18n!templates/nls/browserNotSupported");

                        jquery("body").append(template(languageBundle));
                    }
                },

                /**
                 * Adds the listeners.
                 *
                 * @method addListeners
                 * @private
                 */
                addListeners = function addListeners() {

                    jquery(document).ready(function onReady() {

                        main();
                    });
                },

                /**
                 * Initialises the instance.
                 *
                 * @method initialise
                 * @private
                 */
                initialise = function initialise() {

                    addListeners();
                };

            initialise();
        };

    app();
});
