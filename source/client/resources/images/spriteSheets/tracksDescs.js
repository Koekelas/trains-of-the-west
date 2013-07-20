/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,

        PATH = "resources/images/spriteSheets/tracks{{scaleFactor}}x.png",

        tracksDescs = {};

    tracksDescs[zoomLevels.MINIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "1"),
        cellDimensions: {

            width: 128,
            height: 96
        }
    };
    tracksDescs[zoomLevels.MEDIUM] = {

        path: PATH.replace("{{scaleFactor}}", "2"),
        cellDimensions: {

            width: 256,
            height: 191
        }
    };
    tracksDescs[zoomLevels.MAXIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "3"),
        cellDimensions: {

            width: 384,
            height: 287
        }
    };

    return tracksDescs;
});
