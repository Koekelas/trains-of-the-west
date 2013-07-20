/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,

        PATH = "resources/images/spriteSheets/decorationsSmall{{scaleFactor}}x.png",

        decorationsSmallDescs = {};

    decorationsSmallDescs[zoomLevels.MINIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "1"),
        cellDimensions: {

            width: 32,
            height: 71
        }
    };
    decorationsSmallDescs[zoomLevels.MEDIUM] = {

        path: PATH.replace("{{scaleFactor}}", "2"),
        cellDimensions: {

            width: 48,
            height: 107
        }
    };
    decorationsSmallDescs[zoomLevels.MAXIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "3"),
        cellDimensions: {

            width: 96,
            height: 214
        }
    };

    return decorationsSmallDescs;
});
