/*jslint node: true, plusplus: true*/

"use strict";

var messageTypes = require("./constants").messageTypes,
    messageDataKeysRequest = require("./constants").messageDataKeysRequest[messageTypes.LOAD_CHUNK],
    chunkDimensions = require("./constants").terrainDesc.chunkDimensions,
    terrainDimensions = require("./constants").terrainDesc.terrainDimensions,
    connections = require("../core/connections"),
    math = require("../support/math"),
    pocketKnife = require("../support/pocketKnife"),
    logger = require("../utilities/logger"),

    terrainStreamer = function terrainStreamer(terrain) {

        var instance = {},

            getLocation = function getLocation(data) {

                var location = {};

                if (pocketKnife.isNumber(data[messageDataKeysRequest.ROW]) && pocketKnife.isNumber(data[messageDataKeysRequest.COLUMN])) {

                    location.row = data[messageDataKeysRequest.ROW];
                    location.column = data[messageDataKeysRequest.COLUMN];
                } else {

                    throw { message: "ROW and/or COLUMN is not a number" };
                }

                return location;
            },

            addListeners = function addListeners() {

                /*jslint unparam: true*/
                connections.on(messageTypes.LOAD_CHUNK, function onLoadChunk(event, data, connectionId) {

                    var location,
                        row,
                        numberOfRows,
                        column,
                        numberOfColumns,
                        tiles,
                        chunkRow,
                        chunkColumn,
                        rowOffset,
                        columnOffset,
                        tile;

                    try {

                        location = getLocation(data);
                    } catch (exception) {

                        logger.logError("LOAD_CHUNK is ill-formed");
                        logger.group();
                        logger.logError(exception.message);
                        logger.ungroup();

                        return;
                    }

                    if (math.isInInterval(location.row, 0, terrainDimensions.ROWS) && math.isInInterval(location.column, 0, terrainDimensions.COLUMNS)) {

                        tiles = [];
                        chunkRow = location.row;
                        chunkColumn = location.column;
                        rowOffset = chunkRow * chunkDimensions.ROWS;
                        columnOffset = chunkColumn * chunkDimensions.COLUMNS;

                        for (row = 0, numberOfRows = chunkDimensions.ROWS; row < numberOfRows; ++row) {

                            tiles[row] = [];

                            for (column = 0, numberOfColumns = chunkDimensions.COLUMNS; column < numberOfColumns; ++column) {

                                tile = terrain.getTile(row + rowOffset, column + columnOffset);
                                tiles[row][column] = [ tile.getSpriteSheetCell(), tile.getHeight() ];
                            }
                        }

                        connections.trigger(messageTypes.LOAD_CHUNK, [ [ chunkRow, chunkColumn ], tiles ], connectionId);
                    }
                });
                /*jslint unparam: false*/
            },

            initialise = function initialise() {

                addListeners();
            };

        initialise();

        return instance;
    };

module.exports = terrainStreamer;
