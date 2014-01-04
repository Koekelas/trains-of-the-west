/*jslint browser: true, plusplus: true, nomen: true*/
/*global define, Raphael*/

define(function (require) {

    "use strict";

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        directions = require("game/constants").directions,
        overlay = require("core/overlay"),
        pocketKnife = require("support/pocketKnife"),

        NUMBER_OF_ELEMENTS_OUTLINE = 2, //topPath and bottomPath
        NUMBER_OF_ANIMATION_CYCLES = 5,

        prototype = {

            _createPosition: function _createPosition(x, y) {

                return { x: x, y: y };
            },

            _show: function _show() {

                this._outline.show();
                this._isVisible = true;
            },

            _updateElements: function _updateElements(x, y) {

                var specificationTop = "M",
                    specificationBottom = "M",
                    tileCorners = this._tile.getMetadata("corners", true),
                    cornerWest = tileCorners[directions.WEST],
                    cornerNorth = tileCorners[directions.NORTH],
                    cornerEast = tileCorners[directions.EAST],
                    cornerSouth = tileCorners[directions.SOUTH],
                    positionSpecificationTopWest = this._createPosition(x + cornerWest.x, y + cornerWest.y + 1),
                    positionNorth = this._createPosition(

                        cornerNorth.x - cornerWest.x,
                        cornerNorth.y - cornerWest.y - 1
                    ),
                    positionSpecificationTopEast = this._createPosition(

                        cornerEast.x - positionNorth.x + 1,
                        cornerEast.y - cornerNorth.y + 1
                    ),
                    positionSpecificationBottomWest = this._createPosition(x + cornerWest.x, y + cornerWest.y),
                    positionSouth = this._createPosition(

                        cornerSouth.x - cornerWest.x,
                        cornerSouth.y - cornerWest.y + 1
                    ),
                    positionSpecificationBottomEast = this._createPosition(

                        cornerEast.x - positionSouth.x + 1,
                        cornerEast.y - cornerSouth.y - 1
                    );

                specificationTop += positionSpecificationTopWest.x;
                specificationTop += " ";
                specificationTop += positionSpecificationTopWest.y;
                specificationTop += "l";
                specificationTop += positionNorth.x;
                specificationTop += " ";
                specificationTop += positionNorth.y;
                specificationTop += " ";
                specificationTop += positionSpecificationTopEast.x;
                specificationTop += " ";
                specificationTop += positionSpecificationTopEast.y;
                specificationBottom += positionSpecificationBottomWest.x;
                specificationBottom += " ";
                specificationBottom += positionSpecificationBottomWest.y;
                specificationBottom += "l";
                specificationBottom += positionSouth.x;
                specificationBottom += " ";
                specificationBottom += positionSouth.y;
                specificationBottom += " ";
                specificationBottom += positionSpecificationBottomEast.x;
                specificationBottom += " ";
                specificationBottom += positionSpecificationBottomEast.y;
                this._topPath.attr("path", specificationTop);
                this._bottomPath.attr("path", specificationBottom);

                if (!this._isVisible) {

                    this._show();
                }
            },

            update: function update(x, y, layer) {

                this._updateElements(x, y);

                return layer;
            },

            _hide: function _hide() {

                this._outline.hide();
                this._isVisible = false;
            },

            releaseElements: function releaseElements() {

                this._hide();
            },

            _createElements: function _createElements() {

                this._outline = overlay.createSet();
                this._topPath = overlay.createPath("");
                this._bottomPath = overlay.createPath("");
                this._outline.push(this._topPath);
                this._outline.push(this._bottomPath);
            },

            _destroyElements: function _destroyElements() {

                this._outline.remove();
            },

            _styleElements: function _styleElements() {

                var that = this;

                this._outline.attr({ "stroke": "#b11", "stroke-width": 3 });

                //a tile can be highlighted even tough it's not visible
                if (this._tile.hasAcquiredElements()) {

                    this._updateElements(this._tile.getX(), this._tile.getY());
                } else {

                    this._hide();
                }

                this._outline.animate(Raphael.animation(

                    { "stroke-opacity": 0 },
                    timeInMilliseconds.ONE_SECOND * 0.5,

                    function onComplete() {

                        ++that._numberOfAnimationCyclesCompleted;

                        if (that._numberOfAnimationCyclesCompleted >= NUMBER_OF_ANIMATION_CYCLES * NUMBER_OF_ELEMENTS_OUTLINE) {

                            that._destroyElements();
                            that._tile.removeTileEntity("highlight");
                        }
                    }
                ).repeat(NUMBER_OF_ANIMATION_CYCLES));
            },

            initialise: function initialise(tile) {

                this._tile = tile;
                this._isVisible = true;
                this._numberOfAnimationCyclesCompleted = 0;
                this._createElements();
                this._styleElements();

                return this;
            }
        },

        create = function create(tile) {

            return pocketKnife.create(prototype).initialise(tile);
        };

    return create;
});
