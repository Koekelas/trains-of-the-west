/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var toolbarView = require("gui/toolbarView"),

        toolbarDesktopView = function toolbarDesktopView(toolbarController, toolbarModel) {

            var shared = {},

                createTemplate = function createTemplate() {

                    return require("templates/toolbarDesktop");
                };

            shared.createTemplate = createTemplate;

            return toolbarView(toolbarController, toolbarModel, shared);
        };

    return toolbarDesktopView;
});
