/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,

        terrainWalker = function terrainWalker() {

            var instance = {},

                walk = function walk(terrain, tile, direction, times) {

                    times = times || 1;

                    switch (direction) {

                    case directions.NORTH:

                        return terrain.getTile(tile.getRow() - times, tile.getColumn() - times);
                    case directions.NORTH_EAST:

                        return terrain.getTile(tile.getRow() - times, tile.getColumn());
                    case directions.EAST:

                        return terrain.getTile(tile.getRow() - times, tile.getColumn() + times);
                    case directions.SOUTH_EAST:

                        return terrain.getTile(tile.getRow(), tile.getColumn() + times);
                    case directions.SOUTH:

                        return terrain.getTile(tile.getRow() + times, tile.getColumn() + times);
                    case directions.SOUTH_WEST:

                        return terrain.getTile(tile.getRow() + times, tile.getColumn());
                    case directions.WEST:

                        return terrain.getTile(tile.getRow() + times, tile.getColumn() - times);
                    case directions.NORTH_WEST:

                        return terrain.getTile(tile.getRow(), tile.getColumn() - times);
                    default:

                        return undefined;
                    }
                };

            instance.walk = walk;

            return instance;
        };

    return terrainWalker;
});
