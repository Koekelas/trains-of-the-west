/*jslint node: true, plusplus: true*/

"use strict";

var chunkDimensions = require("../game/constants").terrainDesc.chunkDimensions,
    terrainDimensions = require("../game/constants").terrainDesc.terrainDimensions,
    terrainData = require("../../resources/spriteSheetData/terrainData"),
    spriteSheetDataStore = require("../game/spriteSheetDataStore"),
    terrainModifier = require("../game/terrainModifier"),
    terrainStreamer = require("../game/terrainStreamer"),
    tile = require("../game/tile"),

    terrain = function terrain() {

        var grid = [],
            terrainDataStore,
            terrainStrmr,
            terrainMdfr,
            instance = {},

            getTile = function getTile(row, column) {

                if (!grid[row]) {

                    return undefined;
                }

                return grid[row][column];
            },

            getTerrainDataStore = function getTerrainDataStore() {

                return terrainDataStore;
            },

            initialise = function initialise() {

                var row,
                    numberOfRows,
                    column,
                    numberOfColumns;

                terrainDataStore = spriteSheetDataStore(terrainData.numberOfCells, terrainData.metadata);

                for (row = 0, numberOfRows = chunkDimensions.ROWS * terrainDimensions.ROWS; row < numberOfRows; ++row) {

                    grid[row] = [];

                    for (column = 0, numberOfColumns = chunkDimensions.COLUMNS * terrainDimensions.COLUMNS; column < numberOfColumns; ++column) {

                        grid[row][column] = tile(instance, row, column, 18, 0);
                    }
                }

                terrainStrmr = terrainStreamer(instance);
                terrainMdfr = terrainModifier(instance);
            };

        instance.getTile = getTile;
        instance.getTerrainDataStore = getTerrainDataStore;
        initialise();

        return instance;
    };

module.exports = terrain;
