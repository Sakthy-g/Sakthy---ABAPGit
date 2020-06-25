/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define([
 "sap/ui/core/mvc/Controller",
 "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
 "use strict";

 return Controller.extend("fcg.mdg.editbp.controller.App", {
  onInit: function() {
   //  var oViewModel,
   //  fnSetAppNotBusy,
   //  iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

   // oViewModel = new JSONModel({
   //  busy : true,
   //  delay : 0
   // });
   // this.getView().byId("app").setModel(oViewModel, "appView");

   // fnSetAppNotBusy = function() {
   //  oViewModel.setProperty("/busy", false);
   //  oViewModel.setProperty("/delay", iOriginalBusyDelay);
   // };

   // this.getOwnerComponent().getModel().metadataLoaded().
   //  then(fnSetAppNotBusy);

   // // apply content density mode to root view
   // this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
  }
 });

});