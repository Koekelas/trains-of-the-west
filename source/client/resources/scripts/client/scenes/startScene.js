/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var startController = require("gui/startController"),
        startModel = require("gui/startModel"),

        startScene = function startScene(client) {

            var startMdl = startModel(client),
                startCntrllr = startController(startMdl),
                instance = {},

                activate = function activate() {

                    startCntrllr.activateView();
                },

                update = function update(deltaTime) {

                    startCntrllr.animateView(deltaTime);
                },

                deactivate = function deactivate() {

                    startMdl.removeListeners();
                    startCntrllr.deactivateView();
                };

            instance.activate = activate;
            instance.update = update;
            instance.deactivate = deactivate;

            return instance;
        };

    return startScene;
});
