/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var toolbarView = require("gui/toolbarView"),

        toolbarMobileView = function toolbarMobileView(toolbarController, toolbarModel) {

            var shared = {},

                createTemplate = function createTemplate() {

                    return require("templates/toolbarMobile");
                };

            shared.createTemplate = createTemplate;

            return toolbarView(toolbarController, toolbarModel, shared);
        };

    return toolbarMobileView;
});
