/*jslint node: true, plusplus: true, nomen: true*/

"use strict";

var prototype = {},

    create = function create() {

        return Object.create(prototype);
    };

module.exports = create;
