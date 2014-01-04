/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var pocketKnife = require("support/pocketKnife"),

        terrain,

        prototype = {},

        create = function create(trrn) {

            if (terrain !== trrn) {

                terrain = trrn;
            }

            return pocketKnife.create(prototype);
        };

    return create;
});
