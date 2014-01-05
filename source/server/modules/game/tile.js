/*jslint node: true, plusplus: true, nomen: true*/

"use strict";

var chunkDimensions = require("../game/constants").terrainDesc.chunkDimensions,
    terrainDimensions = require("../game/constants").terrainDesc.terrainDimensions,
    tileHeightLevels = require("../game/constants").terrainDesc.tileHeightLevels,
    math = require("../support/math"),
    pocketKnife = require("../support/pocketKnife"),

    terrain,

    prototype = {

        setSpriteSheetCell: function setSpriteSheetCell(spriteSheetCell) {

            //todo: check if spriteSheetCell is valid
            this._spriteSheetCell = spriteSheetCell;
        },

        setHeight: function setHeight(height) {

            if (math.isInInterval(height, tileHeightLevels.MINIMUM, tileHeightLevels.MAXIMUM + 1)) {

                this._height = height;
            }
        },

        getRow: function getRow() {

            return this._location.row;
        },

        getColumn: function getColumn() {

            return this._location.column;
        },

        getSpriteSheetCell: function getSpriteSheetCell() {

            return this._spriteSheetCell;
        },

        getHeight: function getHeight() {

            return this._height;
        },

        getMetadata: function getMetadata(key) {

            return terrain.getTerrainDataStore().getMetadata(this._spriteSheetCell, key);
        },

        toString: function toString() {

            return this._hash;
        },

        initialise: function initialise(row, column, spriteSheetCell, height) {

            this._location = { row: row, column: column };
            this._hash = (chunkDimensions.COLUMNS * terrainDimensions.COLUMNS * row + column).toString();
            this.setSpriteSheetCell(spriteSheetCell);
            this.setHeight(height);

            return this;
        }
    },

    create = function create(trrn, row, column, spriteSheetCell, height, spriteSheetDataStore) {

        terrain = trrn;

        return pocketKnife.create(prototype).initialise(row, column, spriteSheetCell, height, spriteSheetDataStore);
    };

module.exports = create;
