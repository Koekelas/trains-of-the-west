/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        listenable = require("support/listenable"),
        map = require("support/map"),
        vector = require("support/vector"),

        keyboard = function keyboard() {

            var keys = {

                    ESC: 27,

                    F1: 112,
                    F2: 113,
                    F3: 114,
                    F4: 115,
                    F5: 116,
                    F6: 117,
                    F7: 118,
                    F8: 119,
                    F9: 120,
                    F10: 121,
                    F11: 122,
                    F12: 123,

                    ZERO: 48,
                    ONE: 49,
                    TWO: 50,
                    THREE: 51,
                    FOUR: 52,
                    FIVE: 53,
                    SIX: 54,
                    SEVEN: 55,
                    EIGHT: 56,
                    NINE: 57,

                    A: 65,
                    B: 66,
                    C: 67,
                    D: 68,
                    E: 69,
                    F: 70,
                    G: 71,
                    H: 72,
                    I: 73,
                    J: 74,
                    K: 75,
                    L: 76,
                    M: 77,
                    N: 78,
                    O: 79,
                    P: 80,
                    Q: 81,
                    R: 82,
                    S: 83,
                    T: 84,
                    U: 85,
                    V: 86,
                    W: 87,
                    X: 88,
                    Y: 89,
                    Z: 90,

                    CTRL: 17,
                    ALT: 18,
                    SHIFT: 16,
                    CAPS_LOCK: 20,
                    SPACE: 32,
                    TAB: 9,
                    ENTER: 13,
                    BACKSPACE: 8,

                    HOME: 36,
                    END: 35,
                    PAGE_UP: 33,
                    PAGE_DOWN: 34,
                    INSERT: 45,
                    DELETE: 46,

                    UP: 38,
                    DOWN: 40,
                    LEFT: 37,
                    RIGHT: 39,

                    NUM_LOCK: 144
                },
                maps,
                keysDown,
                mapsDown,
                instance = listenable(),
                super_off = instance.superior("off"),
                super_trigger = instance.superior("trigger"),

                mp = function mp(name, kys) {

                    maps.set(name, { name: name, keys: vector(kys) });
                },

                isDown = function isDown(name) {

                    return !!mapsDown.get(name);
                },

                areKeysDown = function areKeysDown(kys) {

                    var areKeysDwn = true;

                    kys.each(function eachKey(key) {

                        if (!keysDown[key]) {

                            areKeysDwn = false;

                            return false;
                        }

                        return true;
                    });

                    return areKeysDwn;
                },

                areKeysUp = function areKeysUp(kys) {

                    var areKeysP = true;

                    kys.each(function eachKey(key) {

                        if (keysDown[key]) {

                            areKeysP = false;

                            return false;
                        }

                        return true;
                    });

                    return areKeysP;
                },

                addListeners = function addListeners() {

                    var windowElement = jquery(window);

                    windowElement.on("keydown", function onKeydown(event) {

                        keysDown[event.which] = true;
                        maps.each(function eachMap(m, name) {

                            if (!isDown(name) && areKeysDown(m.keys)) {

                                mapsDown.set(name, true);
                                super_trigger(name.toLowerCase() + "down");
                                super_trigger("down", name);
                            }
                        });
                    });
                    windowElement.on("keyup", function onKeyup(event) {

                        keysDown[event.which] = false;
                        mapsDown.each(function eachMapDown(isDwn, name) {

                            if (isDwn && areKeysUp(maps.get(name).keys)) {

                                mapsDown.set(name, false);
                                super_trigger(name.toLowerCase() + "up");
                                super_trigger("up", name);
                            }
                        });
                    });
                },

                reset = function reset() {

                    maps = map();
                    keysDown = {};
                    mapsDown = map();
                    super_off();
                },

                initialise = function initialise() {

                    addListeners();
                    reset();
                };

            instance.keys = keys;
            instance.map = mp;
            instance.isDown = isDown;
            instance.reset = reset;
            initialise();

            return instance;
        };

    return keyboard();
});
