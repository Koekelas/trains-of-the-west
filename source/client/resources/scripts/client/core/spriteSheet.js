/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var listenable = require("support/listenable"),
        math = require("support/math"),
        pocketKnife = require("support/pocketKnife"),

        spriteSheet = function spriteSheet(image, cellWidth, cellHeight, metadata) {

            var numberOfRows,
                numberOfColumns,
                numberOfCells,
                instance = listenable(),
                super_trigger = instance.superior("trigger"),

                generateCss = function generateCss() {

                    var row,
                        column,
                        css = "",
                        imageCssClass = image.getCssClass(),
                        cell = 0,
                        imagePath = image.getPath();

                    for (row = 0; row < numberOfRows; ++row) {

                        for (column = 0; column < numberOfColumns; ++column) {

                            css += ".";
                            css += imageCssClass;
                            css += "Cell";
                            css += cell;
                            css += "{position:absolute;width:";
                            css += cellWidth;
                            css += "px;height:";
                            css += cellHeight;
                            css += "px;background:url(";
                            css += imagePath;
                            css += ") ";
                            css += (cellWidth * column) * -1;
                            css += "px ";
                            css += (cellHeight * row) * -1;
                            css += "px;}";
                            ++cell;
                        }
                    }

                    return css;
                },

                setMetadata = function setMetadata(cell, key, data) {

                    if (!metadata[cell]) {

                        metadata[cell] = {};
                    }

                    metadata[cell][key] = data;
                },

                isOpaque = function isOpaque(cell, x, y) {

                    if (!(math.isInInterval(x, 0, cellWidth) && math.isInInterval(y, 0, cellHeight))) {

                        return false;
                    }

                    var column = cell % numberOfColumns,
                        row = Math.floor(cell / numberOfColumns);

                    return image.isOpaque(x + column * cellWidth, y + row * cellHeight);
                },

                getCellWidth = function getCellWidth() {

                    return cellWidth;
                },

                getCellHeight = function getCellHeight() {

                    return cellHeight;
                },

                getNumberOfCells = function getNumberOfCells() {

                    return numberOfCells;
                },

                getMetadata = function getMetadata(cell, key) {

                    return metadata[cell] ? metadata[cell][key] : undefined;
                },

                getCssClass = function getCssClass(cell) {

                    var cssClass = image.getCssClass();

                    cssClass += "Cell";
                    cssClass += cell;

                    return cssClass;
                },

                onReady = function onReady() {

                    numberOfRows = Math.floor(image.getHeight() / cellHeight);
                    numberOfColumns = Math.floor(image.getWidth() / cellWidth);
                    numberOfCells = numberOfRows * numberOfColumns;
                    super_trigger("ready");
                },

                addListeners = function addListeners() {

                    image.one("ready", onReady);
                },

                make = function make() {

                    if (!image.isReady()) {

                        addListeners();
                    } else {

                        onReady();
                    }
                },

                initialise = function initialise() {

                    metadata = pocketKnife.clone(metadata) || {};
                };

            instance.generateCss = generateCss;
            instance.setMetadata = setMetadata;
            instance.isOpaque = isOpaque;
            instance.getCellWidth = getCellWidth;
            instance.getCellHeight = getCellHeight;
            instance.getNumberOfCells = getNumberOfCells;
            instance.getMetadata = getMetadata;
            instance.getCssClass = getCssClass;
            instance.make = make;
            initialise();

            return instance;
        };

    return spriteSheet;
});
