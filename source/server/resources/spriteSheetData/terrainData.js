/*jslint node: true, plusplus: true*/

"use strict";

var directions = require("../../modules/game/constants").directions,

    createCellDesc = function createCellDesc(heightNorth, heightEast, heightSouth, heightWest) {

        var heights = {};

        heights[directions.NORTH] = heightNorth;
        heights[directions.EAST] = heightEast;
        heights[directions.SOUTH] = heightSouth;
        heights[directions.WEST] = heightWest;

        return { heights: heights };
    },

    terrainData = {

        numberOfCells: 19,

        metadata: {

            0: createCellDesc(1, 2, 1, 0),
            1: createCellDesc(0, 1, 2, 1),
            2: createCellDesc(1, 0, 1, 2),
            3: createCellDesc(2, 1, 0, 1),

            4: createCellDesc(1, 2, 1, 1),
            5: createCellDesc(1, 1, 2, 1),
            6: createCellDesc(1, 1, 1, 2),
            7: createCellDesc(2, 1, 1, 1),

            8: createCellDesc(2, 2, 1, 1),
            9: createCellDesc(1, 2, 2, 1),
            10: createCellDesc(1, 1, 2, 2),
            11: createCellDesc(2, 1, 1, 2),

            12: createCellDesc(2, 1, 2, 1),
            13: createCellDesc(1, 2, 1, 2),

            14: createCellDesc(2, 2, 2, 1),
            15: createCellDesc(1, 2, 2, 2),
            16: createCellDesc(2, 1, 2, 2),
            17: createCellDesc(2, 2, 1, 2),

            18: createCellDesc(2, 2, 2, 2)
        }
    };

module.exports = terrainData;
