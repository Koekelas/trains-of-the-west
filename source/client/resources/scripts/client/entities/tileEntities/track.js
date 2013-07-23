/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var elementPool = require("core/elementPool"),
        pocketKnife = require("support/pocketKnife"),

        terrain,

        prototype = {

            update: function update(x, y, layer, cameraRotation) {

                var spriteSheet = terrain.getActiveTracksSpriteSheet();

                if (!this._element) {

                    this._element = elementPool.acquireElement();
                }

                this._element.setCssClass(

                    spriteSheet.getCssClass(spriteSheet.getMetadata(this._spriteSheetCell, "rotations")[cameraRotation])
                );
                this._element.setPosition(

                    x,
                    y + Math.floor(terrain.getActiveTerrainSpriteSheet().getCellHeight() / 3) - spriteSheet.getCellHeight()
                );
                this._element.setLayer(layer);
                ++layer;

                return layer;
            },

            releaseElements: function releaseElements() {

                elementPool.releaseElement(this._element);
                this._element = undefined;
            },

            setSpriteSheetCell: function setSpriteSheetCell(spriteSheetCell) {

                //todo: check if spriteSheetCell is valid
                //this._spriteSheetCell = spriteSheetCell;

                //tmp
                this._spriteSheetCell = this._spriteSheetCell !== undefined ? (this._spriteSheetCell + 1) % terrain.getTracksDataStore().getNumberOfCells() : spriteSheetCell;
            },

            initialise: function initialise(spriteSheetCell) {

                this.setSpriteSheetCell(spriteSheetCell);

                return this;
            }
        },

        create = function create(trrn, spriteSheetCell) {

            if (terrain !== trrn) {

                terrain = trrn;
            }

            return pocketKnife.create(prototype).initialise(spriteSheetCell);
        };

    return create;
});
