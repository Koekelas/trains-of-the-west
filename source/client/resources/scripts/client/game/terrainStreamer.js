/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var messageTypes = require("game/constants").messageTypes,
        messageDataKeysResponse = require("game/constants").messageDataKeysResponse[messageTypes.LOAD_CHUNK],
        chunkDimensions = require("game/constants").terrainDesc.chunkDimensions,
        listenable = require("support/listenable"),
        connection = require("core/connection"),
        pocketKnife = require("support/pocketKnife"),
        logger = require("utilities/logger"),

        terrainStreamer = function terrainStreamer(terrain) {

            var numberOfChunksToLoad = 0,
                numberOfChunksLoaded = 0,
                instance = listenable(),
                super_trigger = instance._superior("trigger"),

                loadChunk = function loadChunk(row, column) {

                    ++numberOfChunksToLoad;
                    connection.trigger(messageTypes.LOAD_CHUNK, [ row, column ]);
                },

                isReady = function isReady() {

                    return numberOfChunksLoaded >= numberOfChunksToLoad;
                },

                getNumberOfChunksToLoad = function getNumberOfChunksToLoad() {

                    return numberOfChunksToLoad;
                },

                getNumberOfChunksLoaded = function getNumberOfChunksLoaded() {

                    return numberOfChunksLoaded;
                },

                getChunkDesc = function getChunkDesc(data) {

                    var chunkDesc = {},
                        location = data[messageDataKeysResponse.LOCATION],
                        tiles = data[messageDataKeysResponse.TILES],
                        tls = [],
                        row,
                        numberOfRows,
                        column,
                        numberOfColumns,
                        tile;

                    if (pocketKnife.isNumber(location[messageDataKeysResponse.LOCATION_ROW]) && pocketKnife.isNumber(location[messageDataKeysResponse.LOCATION_COLUMN])) {

                        chunkDesc.location = {

                            row: location[messageDataKeysResponse.LOCATION_ROW],
                            column: location[messageDataKeysResponse.LOCATION_COLUMN]
                        };
                    } else {

                        throw { message: "LOCATION_ROW and/or LOCATION_COLUMN is not a number" };
                    }

                    for (row = 0, numberOfRows = chunkDimensions.ROWS; row < numberOfRows; ++row) {

                        tls[row] = [];

                        for (column = 0, numberOfColumns = chunkDimensions.COLUMNS; column < numberOfColumns; ++column) {

                            tile = tiles[row][column];

                            if (pocketKnife.isNumber(tile[messageDataKeysResponse.TILES_TILE_HEIGHT]) && pocketKnife.isNumber(tile[messageDataKeysResponse.TILES_TILE_SPRITE_SHEET_CELL])) {

                                tls[row][column] = {

                                    spriteSheetCell: tile[messageDataKeysResponse.TILES_TILE_SPRITE_SHEET_CELL],
                                    height: tile[messageDataKeysResponse.TILES_TILE_HEIGHT]
                                };
                            } else {

                                throw { message: "TILES_TILE_SPRITE_SHEET_CELL and/or TILES_TILE_HEIGHT is not a number" };
                            }
                        }
                    }

                    chunkDesc.tiles = tls;

                    return chunkDesc;
                },

                addListeners = function addListeners() {

                    /*jslint unparam: true*/
                    connection.on(messageTypes.LOAD_CHUNK, function onLoadChunk(event, data) {

                        var chunkDesc,
                            location,
                            tiles,
                            row,
                            numberOfRows,
                            column,
                            numberOfColumns,
                            tile;

                        try {

                            chunkDesc = getChunkDesc(data);
                        } catch (exception) {

                            logger.logError("LOAD_CHUNK is ill-formed");
                            logger.logError(exception.message, 1);

                            return;
                        }

                        location = chunkDesc.location;
                        tiles = chunkDesc.tiles;

                        for (row = 0, numberOfRows = tiles.length; row < numberOfRows; ++row) {

                            for (column = 0, numberOfColumns = tiles[0].length; column < numberOfColumns; ++column) {

                                tile = tiles[row][column];
                                terrain.createTile(location.row, location.column, row, column, tile.spriteSheetCell, tile.height);
                            }
                        }

                        ++numberOfChunksLoaded;
                        super_trigger("load");
                    });
                    /*jslint unparam: false*/
                },

                initialise = function initialise() {

                    addListeners();
                };

            instance.loadChunk = loadChunk;
            instance.isReady = isReady;
            instance.getNumberOfChunksToLoad = getNumberOfChunksToLoad;
            instance.getNumberOfChunksLoaded = getNumberOfChunksLoaded;
            initialise();

            return instance;
        };

    return terrainStreamer;
});
