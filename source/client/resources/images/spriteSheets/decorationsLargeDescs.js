/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,

        PATH = "resources/images/spriteSheets/decorationsLarge{{scaleFactor}}x.png",

        decorationsLargeDescs = {};

    decorationsLargeDescs[zoomLevels.MINIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "1"),
        cellDimensions: {

            width: 64,
            height: 39
        }
    };
    decorationsLargeDescs[zoomLevels.MEDIUM] = {

        path: PATH.replace("{{scaleFactor}}", "2"),
        cellDimensions: {

            width: 96,
            height: 59
        }
    };
    decorationsLargeDescs[zoomLevels.MAXIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "3"),
        cellDimensions: {

            width: 192,
            height: 117
        }
    };

    return decorationsLargeDescs;
});
