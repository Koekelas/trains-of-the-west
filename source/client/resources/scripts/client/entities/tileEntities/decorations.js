/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var pocketKnife = require("support/pocketKnife"),

        terrain,

        prototype = {

            addLarge: function addLarge(location, spriteSheetCell) {

                //todo
            },

            addSmall: function addSmall(location, spriteSheetCell) {

                //todo
            },

            update: function update(x, y, layer, cameraRotation) {

                //todo
            },

            releaseElements: function releaseElements() {

                //todo
            }
        },

        create = function create(trrn) {

            if (terrain !== trrn) {

                terrain = trrn;
            }

            return pocketKnife.create(prototype);
        };

    return create;
});
