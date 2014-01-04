/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var startView = require("gui/startView"),

        startController = function startController(startModel) {

            var startVw,
                instance = {},

                signIn = function signIn() {

                    startModel.signIn();
                    startVw.showLoadingDialog();
                },

                newAccount = function newAccount() {

                    startVw.showNewAccountDialog();
                },

                createNewAccount = function createNewAccount() {

                    startVw.showSignInDialog();
                },

                cancelNewAccount = function cancelNewAccount() {

                    startVw.showSignInDialog();
                },

                activateView = function activateView() {

                    startVw.activate();
                },

                animateView = function animateView(deltaTime) {

                    startVw.animate(deltaTime);
                },

                deactivateView = function deactivateView() {

                    startVw.deactivate();
                },

                createView = function createView() {

                    return startView(instance, startModel);
                },

                initialise = function initialise() {

                    startVw = createView();
                };

            instance.signIn = signIn;
            instance.newAccount = newAccount;
            instance.createNewAccount = createNewAccount;
            instance.cancelNewAccount = cancelNewAccount;
            instance.activateView = activateView;
            instance.animateView = animateView;
            instance.deactivateView = deactivateView;
            initialise();

            return instance;
        };

    return startController;
});
