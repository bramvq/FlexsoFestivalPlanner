sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        AddEvent: function(oEvent) {
            MessageToast.show("Custom handler invoked.");
        }
    };
});
