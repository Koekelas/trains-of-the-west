/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var elementPool = require("core/elementPool"),
        pocketKnife = require("support/pocketKnife"),

        NUMBER_OF_LAYERS_ACQUIRED = 1,

        terrain,

        prototype = {

            update: function update(x, y, layer) {

                var spriteSheet = terrain.getActiveDecorationsSmallSpriteSheet();

                if (!this._element) {

                    this._element = elementPool.acquireElement();
                }

                this._element.setCssClass(spriteSheet.getCssClass(this._spriteSheetCell));
                this._element.setPosition(

                    x,
                    y + Math.floor(

                        terrain.getActiveTerrainSpriteSheet().getCellHeight() / 12
                    ) - spriteSheet.getCellHeight()
                );
                this._element.setLayer(layer);

                return NUMBER_OF_LAYERS_ACQUIRED;
            },

            releaseElements: function releaseElements() {

                elementPool.releaseElement(this._element);
                this._element = undefined;
            },

            setSpriteSheetCell: function setSpriteSheetCell(spriteSheetCell) {

                //todo: check if spriteSheetCell is valid
                //this._spriteSheetCell = spriteSheetCell;

                //tmp
                this._spriteSheetCell = this._spriteSheetCell !== undefined ? (this._spriteSheetCell + 1) % (terrain.getDecorationsLargeDataStore().getNumberOfCells()) : spriteSheetCell;
            },

            _initialise: function _initialise(spriteSheetCell) {

                this._spriteSheetCell = spriteSheetCell;

                return this;
            }
        },

        create = function create(trrn, spriteSheetCell) {

            if (terrain !== trrn) {

                terrain = trrn;
            }

            return pocketKnife.create(prototype)._initialise(spriteSheetCell);
        };

    return create;
});
