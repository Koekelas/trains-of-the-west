/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var listenable = require("support/listenable"),
        math = require("support/math"),
        pocketKnife = require("support/pocketKnife"),

        CSS_CELL = ".{{cssClass}}_{{cell}}{position:absolute;width:{{cellWidth}}px;height:{{cellHeight}}px;background:url({{path}}) {{backgroundX}}px {{backgroundY}}px;}",

        prototype = listenable(),

        create = function create(image, cellWidth, cellHeight, metadata) {

            return pocketKnife.create(prototype)._initialise(image, cellWidth, cellHeight, metadata);
        };

    prototype.generateCss = function generateCss() {

        var row,
            column,
            css = "",
            partialCssCell = CSS_CELL
                .replace("{{cssClass}}", this._image.getCssClass())
                .replace("{{cellWidth}}", this._cellWidth)
                .replace("{{cellHeight}}", this._cellHeight)
                .replace("{{path}}", this._image.getPath());

        for (row = 0; row < this._numberOfRows; ++row) {

            for (column = 0; column < this._numberOfColumns; ++column) {

                css += partialCssCell
                    .replace("{{cell}}", (row * this._numberOfColumns + column).toString())
                    .replace("{{backgroundX}}", ((this._cellWidth * column) * -1).toString())
                    .replace("{{backgroundY}}", ((this._cellHeight * row) * -1).toString());
            }
        }

        return css;
    };

    prototype.setMetadata = function setMetadata(cell, key, data) {

        if (!this._metadata[cell]) {

            this._metadata[cell] = {};
        }

        this._metadata[cell][key] = data;
    };

    prototype.isOpaque = function isOpaque(cell, x, y) {

        if (!(math.isInInterval(x, 0, this._cellWidth) && math.isInInterval(y, 0, this._cellHeight))) {

            return false;
        }

        return this._image.isOpaque(

            (cell % this._numberOfColumns) * this._cellWidth + x,
            Math.floor(cell / this._numberOfColumns) * this._cellHeight + y
        );
    };

    prototype.getCellWidth = function getCellWidth() {

        return this._cellWidth;
    };

    prototype.getCellHeight = function getCellHeight() {

        return this._cellHeight;
    };

    prototype.getNumberOfCells = function getNumberOfCells() {

        return this._numberOfCells;
    };

    prototype.getMetadata = function getMetadata(cell, key) {

        return this._metadata[cell] ? this._metadata[cell][key] : undefined;
    };

    prototype.getCssClass = function getCssClass(cell) {

        return this._image.getCssClass() + "_" + cell;
    };

    prototype._onReady = function _onReady() {

        this._numberOfRows = Math.floor(this._image.getHeight() / this._cellHeight);
        this._numberOfColumns = Math.floor(this._image.getWidth() / this._cellWidth);
        this._numberOfCells = this._numberOfRows * this._numberOfColumns;
        this.trigger("ready");
    };

    prototype._addListeners = function _addListeners() {

        this._image.one("ready", pocketKnife.bind(prototype._onReady, this));
    };

    prototype._initialise = function _initialise(image, cellWidth, cellHeight, metadata) {

        var that = this;

        this._superior("_initialise")();
        this._image = image;
        this._cellWidth = cellWidth;
        this._cellHeight = cellHeight;
        this._metadata = pocketKnife.clone(metadata) || {};
        pocketKnife.nextTick(function onNextTick() {

            if (!that._image.isReady()) {

                that._addListeners();
            } else {

                that._onReady();
            }
        });

        return this;
    };

    return create;
});
