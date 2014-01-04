/*jslint node: true, plusplus: true*/
/*global window*/

"use strict";

var pocketKnife = function pocketKnife() {

    var instance = {},

        isBoolean = function isBoolean(x) {

            return typeof x === "boolean";
        },

        isNumber = function isNumber(x) {

            return typeof x === "number";
        },

        isString = function isString(x) {

            return typeof x === "string";
        },

        isPrimitive = function isPrimitive(x) {

            return isBoolean(x) || isNumber(x) || isString(x);
        },

        isObject = function isObject(x) {

            return typeof x === "object" && x.constructor === Object;
        },

        isArray = function isArray(x) {

            return typeof x === "object" && x.constructor === Array;
        },

        isFunction = function isFunction(x) {

            return typeof x === "function";
        },

        getType = function getType(x) {

            var type;

            if (isPrimitive(x)) {

                type = "primitive";
            } else if (isObject(x)) {

                type = "object";
            } else if (isArray(x)) {

                type = "array";
            }

            return type;
        },

        areEqual,

        areObjectsEqual = function (leftObject, rightObject) {

            var areQl = true,
                propertyName;

            if (leftObject === rightObject) {

                return areQl;
            }

            for (propertyName in leftObject) {

                if (leftObject.hasOwnProperty(propertyName) && rightObject.hasOwnProperty(propertyName)) {

                    if (!areEqual(leftObject[propertyName], rightObject[propertyName])) {

                        areQl = false;

                        break;
                    }
                }
            }

            return areQl;
        },

        areArraysEqual = function areArraysEqual(leftArray, rightArray) {

            var areQl = true,
                i,
                numberOfProperties;

            if (leftArray === rightArray) {

                return areQl;
            }

            if (leftArray.length !== rightArray.length) {

                areQl = false;

                return areQl;
            }

            for (i = 0, numberOfProperties = leftArray.length; i < numberOfProperties; ++i) {

                if (!areEqual(leftArray[i], rightArray[i])) {

                    areQl = false;

                    break;
                }
            }

            return areQl;
        },

        clone,

        cloneObject = function cloneObject(object) {

            var propertyName,
                clonedProperty,
                cln = {};

            for (propertyName in object) {

                if (object.hasOwnProperty(propertyName)) {

                    clonedProperty = clone(object[propertyName]);

                    if (clonedProperty !== undefined) {

                        cln[propertyName] = clonedProperty;
                    }
                }
            }

            return cln;
        },

        cloneArray = function cloneArray(array) {

            var i,
                numberOfProperties,
                clonedProperty,
                cln = [];

            for (i = 0, numberOfProperties = array.length; i < numberOfProperties; ++i) {

                clonedProperty = clone(array[i]);

                if (clonedProperty !== undefined) {

                    cln[i] = clonedProperty;
                }
            }

            return cln;
        },

        create = function create(prototype) {

            var nstnc,
                Fnctn;

            if (Object.create) {

                nstnc = Object.create(prototype);
            } else {

                Fnctn = function () { /*empty*/ };
                Fnctn.prototype = prototype;
                nstnc = new Fnctn();
            }

            return nstnc;
        },

        arrayify = function arrayify(phoneyArray, firstIndex, lastIndex) {

            return Array.prototype.slice.call(phoneyArray, firstIndex, lastIndex);
        },

        bind = function bind(fnctn, that) {

            var boundArguments = arrayify(arguments, 2);

            return function () {

                fnctn.apply(that, boundArguments.concat(arrayify(arguments)));
            };
        },

        nextTick = function nextTick(callback) {

            //isObject(process) and isObject(window) might throw a ReferenceError depending on the environment
            if (typeof process === "object" && isFunction(process.nextTick)) {

                process.nextTick(callback);
            } else if (typeof window === "object") {

                if (isFunction(window.setImmediate)) {

                    window.setImmediate(callback);
                } else {

                    window.setTimeout(callback, 0);
                }
            } else {

                throw { message: "Exhausted possible nextTick implementations" };
            }
        };

    areEqual = function areEqual(x, y) {

        var typeX = getType(x),
            typeY = getType(y),
            areQl = false;

        if (typeX === typeY) {

            switch (typeX) {

            case "primitive":

                areQl = x === y;

                break;
            case "object":

                areQl = areObjectsEqual(x, y);

                break;
            case "array":

                areQl = areArraysEqual(x, y);

                break;
            }
        }

        return areQl;
    };

    clone = function clone(x) {

        var cln;

        switch (getType(x)) {

        case "primitive":

            cln = x;

            break;
        case "object":

            cln = cloneObject(x);

            break;
        case "array":

            cln = cloneArray(x);

            break;
        }

        return cln;
    };

    instance.isBoolean = isBoolean;
    instance.isNumber = isNumber;
    instance.isString = isString;
    instance.isPrimitive = isPrimitive;
    instance.isObject = isObject;
    instance.isArray = isArray;
    instance.isFunction = isFunction;
    instance.create = create;
    instance.clone = clone;
    instance.areEqual = areEqual;
    instance.arrayify = arrayify;
    instance.bind = bind;
    instance.nextTick = nextTick;

    return instance;
};

module.exports = pocketKnife();
