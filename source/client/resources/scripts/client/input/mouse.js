/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    require("hammerJquery");

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        directions = require("game/constants").directions,
        jquery = require("jquery"),
        Hammer = require("hammer"),
        listenable = require("support/listenable"),
        browser = require("support/browser"),
        math = require("support/math"),

        mouse = function mouse() {

            var pointerTypes = {

                    MOUSE: 0,
                    PEN: 1,
                    TOUCH: 2
                },
                buttons = {

                    LEFT: 0,
                    MIDDLE: 1,
                    RIGHT: 2
                },
                msPointerButtons = { //event.button, not event.which! which only supports left- and right-button

                    LEFT: 0,
                    MIDDLE: 1,
                    RIGHT: 2
                },
                jqueryButtons = {

                    LEFT: 1,
                    MIDDLE: 2,
                    RIGHT: 3
                },
                DRAG_THRESHOLD = 3,
                SCALE_THRESHOLD = 0.5,
                ROTATE_THRESHOLD = 30, //must be a divisor of 360
                ROTATE_OFFSET = 360 / ROTATE_THRESHOLD,
                pointerType,
                position = {},
                lastButtonDown,
                previousDragDelta = {},
                previousScale,
                previousRotation, //in steps, one step = ROTATE_THRESHOLD
                instance = listenable(),
                super_trigger = instance.superior("trigger"),

                getPointerType = function getPointerType() {

                    return pointerType;
                },

                getX = function getX() {

                    return position.x;
                },

                getY = function getY() {

                    return position.y;
                },

                translateButton = function translateButton(dictionary, button) {

                    var translatedButton;

                    switch (button) {

                    case dictionary.LEFT:

                        translatedButton = buttons.LEFT;

                        break;
                    case dictionary.MIDDLE:

                        translatedButton = buttons.MIDDLE;

                        break;
                    case dictionary.RIGHT:

                        translatedButton = buttons.RIGHT;

                        break;
                    }

                    return translatedButton;
                },

                translateMsPointerButton = function translateMsPointerButton(button) {

                    return translateButton(msPointerButtons, button);
                },

                translateJqueryButton = function translateJqueryButton(button) {

                    return translateButton(jqueryButtons, button);
                },

                onNormalisedDown = function onNormalisedDown(button) {

                    lastButtonDown = button;
                },

                onNormalisedMove = function onNormalisedMove(x, y) {

                    position.x = x;
                    position.y = y;
                },

                onNormalisedWheel = function onNormalisedWheel(deltaX, deltaY) {

                    super_trigger("scroll", { deltaX: deltaX, deltaY: deltaY });
                },

                translateHammerPointerType = function translateHammerPointerType(pointerTyp) {

                    var translatedPointerType;

                    switch (pointerTyp) {

                    case Hammer.POINTER_MOUSE:

                        translatedPointerType = pointerTypes.MOUSE;

                        break;
                    case Hammer.POINTER_PEN:

                        translatedPointerType = pointerTypes.PEN;

                        break;
                    case Hammer.POINTER_TOUCH:

                        translatedPointerType = pointerTypes.TOUCH;

                        break;
                    }

                    return translatedPointerType;
                },

                update = function update(jqueryHammerEvent) {

                    var gesture = jqueryHammerEvent.gesture,
                        center = gesture.center;

                    pointerType = translateHammerPointerType(gesture.pointerType);
                    position.x = center.pageX;
                    position.y = center.pageY;
                },

                addListeners = function addListeners() {

                    var windowElement = jquery(window),
                        windowHammerElement = windowElement.hammer({

                            prevent_default: true,
                            show_touches: false,
                            touch: false,
                            release: false,
                            tap: true,
                            hold: false,
                            hold_threshold: timeInMilliseconds.ONE_MINUTE,
                            drag: true,
                            drag_min_distance: DRAG_THRESHOLD,
                            swipe: false,
                            transform: true,
                            transform_min_scale: SCALE_THRESHOLD,
                            transform_min_rotation: ROTATE_THRESHOLD
                        });

                    if (browser.arePointerEventsSupported()) {

                        window.addEventListener("MSPointerDown", function onMSPointerDown(event) {

                            //event.preventDefault(); //not a good idea, this prevents a textbox from gaining/losing focus

                            if (event.isPrimary) {

                                onNormalisedDown(translateMsPointerButton(event.button));
                            }
                        }, false);
                        window.addEventListener("MSPointerMove", function onMSPointerMove(event) {

                            event.preventDefault();

                            if (event.isPrimary) {

                                onNormalisedMove(event.pageX, event.pageY);
                            }
                        }, false);

                        //disable context menu visual hint
                        window.addEventListener("MSHoldVisual", function onMSHoldVisual(event) {

                            event.preventDefault();
                        }, false);
                    } else if (browser.areTouchEventsSupported()) {

                        //disable elastic scrolling
                        window.addEventListener("touchmove", function onTouchmove(event) {

                            event.preventDefault();
                        }, false);
                    } else {

                        windowElement.on("mousedown", function onMousedown(event) {

                            //event.preventDefault(); //not a good idea, this prevents a textbox from gaining/losing focus
                            onNormalisedDown(translateJqueryButton(event.which));
                        });
                        windowElement.on("mousemove", function onMousemove(event) {

                            event.preventDefault();
                            onNormalisedMove(event.pageX, event.pageY);
                        });
                    }

                    if (!browser.areTouchEventsSupported()) {

                        //disable context menu
                        window.addEventListener("contextmenu", function onContextmenu(event) {

                            event.preventDefault();
                        }, false);
                    }

                    if (browser.areWheelEventsSupported()) {

                        window.addEventListener("wheel", function onWheel(event) {

                            event.preventDefault();
                            onNormalisedWheel(math.clamp(event.deltaX, -1, 1), math.clamp(event.deltaY, -1, 1));
                        }, false);
                    } else if (browser.areMousewheelEventsSupported()) {

                        window.addEventListener("mousewheel", function onMousewheel(event) {

                            event.preventDefault();
                            onNormalisedWheel(

                                math.clamp(event.wheelDeltaX || 0, -1, 1) * -1,
                                math.clamp(event.wheelDeltaY || event.wheelDelta, -1, 1) * -1
                            );
                        }, false);
                    }

                    windowHammerElement.on("tap", function onTap(event) {

                        var eventName;

                        update(event);

                        switch (lastButtonDown) {

                        case buttons.MIDDLE:

                            eventName = "middleclick";

                            break;
                        case buttons.RIGHT:

                            eventName = "rightclick";

                            break;
                        default:

                            eventName = "click";

                            break;
                        }

                        super_trigger(eventName, { x: position.x, y: position.y });
                    });
                    windowHammerElement.on("dragstart", function onDragstart(event) {

                        update(event);
                        previousDragDelta.x = previousDragDelta.y = 0;
                    });
                    windowHammerElement.on("drag", function onDrag(event) {

                        var gesture = event.gesture;

                        update(event);

                        if (lastButtonDown === buttons.LEFT || (browser.areTouchEventsSupported() && lastButtonDown === undefined)) {

                            super_trigger("drag", {

                                deltaX: gesture.deltaX - previousDragDelta.x,
                                deltaY: gesture.deltaY - previousDragDelta.y
                            });
                        }

                        previousDragDelta.x = gesture.deltaX;
                        previousDragDelta.y = gesture.deltaY;
                    });
                    windowHammerElement.on("transformstart", function onTransformstart(event) {

                        update(event);
                        previousScale = 1;
                        previousRotation = 0;
                    });
                    windowHammerElement.on("pinch", function onPinch(event) {

                        var scale = event.gesture.scale;

                        update(event);

                        if (scale <= previousScale - SCALE_THRESHOLD || scale >= previousScale + SCALE_THRESHOLD) {

                            super_trigger("scale", { scaleUp: scale > previousScale });
                            previousScale = Math.floor(scale / SCALE_THRESHOLD) * SCALE_THRESHOLD;
                        }
                    });
                    windowHammerElement.on("rotate", function onRotate(event) {

                        var rotation = Math.round(event.gesture.rotation / ROTATE_THRESHOLD);

                        update(event);

                        if (rotation < 0) {

                            rotation += ROTATE_OFFSET;
                        }

                        if (rotation !== previousRotation) {

                            super_trigger("rotate", {

                                direction: rotation > previousRotation ? directions.CLOCKWISE : directions.COUNTERCLOCKWISE
                            });
                            previousRotation = rotation;
                        }
                    });
                },

                initialise = function initialise() {

                    addListeners();
                };

            instance.pointerTypes = pointerTypes;
            instance.getPointerType = getPointerType;
            instance.getX = getX;
            instance.getY = getY;
            initialise();

            return instance;
        };

    return mouse();
});
