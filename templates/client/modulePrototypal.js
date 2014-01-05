/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var pocketKnife = require("support/pocketKnife"),

        prototype = {},

        create = function create() {

            return pocketKnife.create(prototype);
        };

    return create;
});
