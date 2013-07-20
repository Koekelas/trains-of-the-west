/*jslint browser: true, plusplus: true*/
/*global define*/

define(function () {

    "use strict";

    var clientConstants = {

        time: {

            inMilliseconds: {

                ONE_SECOND: 1000,
                ONE_MINUTE: 60000
            },

            inSeconds: {

                ONE_SECOND: 1,
                ONE_MINUTE: 60
            }
        },

        zoomLevels: {

            MINIMUM: 1,
            MEDIUM: 2,
            MAXIMUM: 3
        }
    };

    return clientConstants;
});
