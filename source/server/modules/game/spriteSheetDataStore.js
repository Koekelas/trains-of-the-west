/*jslint node: true, plusplus: true*/

"use strict";

var spriteSheetDataStore = function spriteSheetDataStore(numberOfCells, metadata) {

    var instance = {},

        getNumberOfCells = function getNumberOfCells() {

            return numberOfCells;
        },

        getMetadata = function getMetadata(cell, key) {

            if (!metadata[cell]) {

                return undefined;
            }

            return metadata[cell][key];
        };

    instance.getNumberOfCells = getNumberOfCells;
    instance.getMetadata = getMetadata;

    return instance;
};

module.exports = spriteSheetDataStore;
