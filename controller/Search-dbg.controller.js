/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable */
sap.ui.define([
 "sap/ui/core/mvc/Controller"
], function(Controller) {
 "use strict";
 jQuery.sap.require("fcg.mdg.editbp.util.Formatter");
 jQuery.sap.require("fcg.mdg.editbp.util.DataAccess");
 return Controller.extend("fcg.mdg.editbp.controller.Search", {
  vSearchFragmnt: "",
  i18nBundle: "",
  vSearchType: "",
  vInitialFlag: "",
  extHookbpModifySearchResultsOnInit: null,
  extHookbpModifySearchTblPersonalization: null,
  extHookbpModifySearchTblBindingComplete: null,
  extHookbpModifySearchTblBindinglessrecord: null,
  extHookbpModifyhandleitemPressed: null,
  extHookbpModifyopenRequestApp: null,
  /**
   * Called when a controller is instantiated and its View controls (if available) are already created.
   * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
   * @memberOf fcg.mdg.editbp.view.Search
   */
  onInit: function() {
   var vflag = this.setInitialFlag(this.vInitialFlag);
   // if(vflag === ""){
   this.vSearchType = "";
   var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
   var myComponent = sap.ui.component(sComponentId);
   if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {

    if (myComponent.getComponentData().startupParameters.SEARCH_MODE !== undefined) {
     this.vSearchType = myComponent.getComponentData().startupParameters.SEARCH_MODE[0];
    }
   }
   this.i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
   fcg.mdg.editbp.util.DataAccess.seti18nModel(this.i18nBundle);
   var mheaders = {};
   mheaders.SEARCH_MODE = this.vSearchType;
   var oModel = this.getOwnerComponent().getModel();
   oModel.setHeaders(mheaders);
   oModel.setUseBatch(true);
   this.getOwnerComponent().setModel(oModel);
   if (this.vSearchFragmnt === "") {
    this.vSearchFragmnt = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.search", this);
   } else {
    this.vSearchFragmnt.destroy();
    this.vSearchFragmnt = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.search", this);
   }
   this.getView().byId("SearchPage").removeAllContent();
   this.getView().byId("SearchPage").addContent(this.vSearchFragmnt);
   var oFilterBar = sap.ui.getCore().byId("searchFilterBar");
   var oRsltTbl = sap.ui.getCore().byId("searchRsltTbl");
   var oDfltTbl = sap.ui.getCore().byId("defaultRsltTbl");
   if (oFilterBar !== undefined && oFilterBar.getControlConfiguration()[0] !== undefined) {
    oFilterBar.getControlConfiguration()[0].setLabel(this.i18nBundle.getText("Customer_ID"));
   }
   if (this.vSearchType === "DB") {
    if (oFilterBar !== undefined) {
     oFilterBar.setEnableBasicSearch(false);
     oFilterBar.setFilterBarExpanded(true);
    }
    this.setFilterLabel(oFilterBar, this.i18nBundle.getText("DB_Name1"), this.i18nBundle.getText("DB_Name2"));
   } else if (this.vSearchType === "HA") {
    // if (oFilterBar !== undefined) {
    //  if (oFilterBar.getControlConfiguration()[10] !== undefined) {
    //   oFilterBar.getControlConfiguration()[10].setVisible(false);
    //  }
    // }
    this.setFilterLabel(oFilterBar, this.i18nBundle.getText("DB_Name1"), this.i18nBundle.getText("DB_Name2"));
   } else if (this.vSearchType === "ES") {
    this.setFilterLabel(oFilterBar, this.i18nBundle.getText("FrstName"), this.i18nBundle.getText("ScndName"));
   }

   if (oRsltTbl !== undefined) {
    oRsltTbl.setHeader(this.i18nBundle.getText("CUSTOMERS"));
   }
   if (oDfltTbl !== undefined) {
    oDfltTbl.getColumns()[1].getHeader().setText(this.i18nBundle.getText("CUSTOMER"));
    // oDfltTbl.getItems().forEach(function(item) {
    //  item.setType("DetailAndActive");
    // });
   }

   // if(this.vSearchType === "") {
   //  var dialog = new sap.m.Dialog({
   //   title: this.i18nBundle.getText("ERROR"),
   //   type: 'Message',
   //   state: 'Warning',
   //   content: [new sap.m.Text({
   //    text: this.i18nBundle.getText("Config_Msg")
   //   })],
   //   beginButton: new sap.m.Button({
   //    text: this.i18nBundle.getText("OK"),
   //    press: function() {
   //     dialog.close();
   //    }
   //   }),
   //   afterClose: function() {
   //    dialog.destroy();
   //   }
   //  });

   //  dialog.open();
   //  // return;
   // }
   //getting the ValueHelps
   fcg.mdg.editbp.util.DataAccess.getValueHelpData();
   //controller hook to bind the data with new fragment/section etc with importing parameter no return
   /**
    * @ControllerHook To give an access to Modify existing logic
    * Customer can modify the search result Page details or add another section for create/change
    * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookbpModifySearchResultsOnInit
    * @param {object} result View
    * @param {object} result Model
    * @return { }
    */
   if (this.extHookbpModifySearchResultsOnInit) {
    this.extHookbpModifySearchResultsOnInit(this, oModel);
   }
  },

  getPersonalization: function() {
   var oRsltTable = sap.ui.getCore().byId("searchRsltTbl");
   oRsltTable.getCustomToolbar().getContent()[3].setType("Transparent");
   //controller hook to bind the data with new fragment/section etc with importing parameter no return
   /**
    * @ControllerHook To give an access to Modify existing logic
    * Customer can modify the search result Page details or add another section for create/change
    * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookbpModifySearchTblPersonalization
    * @param {object} result View
    * @return { }
    */
   if (this.extHookbpModifySearchTblPersonalization) {
    this.extHookbpModifySearchTblPersonalization(this);
   }
  },

  setFilterLabel: function(oFlBar, sName1, sName2) {
   if (oFlBar !== undefined) {
    if (oFlBar.getControlConfiguration()[6] !== undefined) {
     oFlBar.getControlConfiguration()[6].setLabel(sName1);
    }
    if (oFlBar.getControlConfiguration()[7] !== undefined) {
     oFlBar.getControlConfiguration()[7].setLabel(sName2);
    }
   }
  },
  // onFilterSearch: function() {
  // var oFltrBar = sap.ui.getCore().byId("searchFilterBar");
  // if(oFltrBar.getFilterData().REF_POSTA !== undefined) {
  //  var oFilterData = oFltrBar.getFilterData()
  //  oFilterData.REF_POSTA.value = oFilterData.REF_POSTA.value.toUpperCase();
  // sap.ui.getCore().byId("searchFilterBar").setFilterData(oFilterData);
  // }
  // sap.ui.getCore().byId("searchFilterBar").getControlConfiguration()[1].getValue().toUpperCase();
  // var oRsltTbl = sap.ui.getCore().byId("searchRsltTbl");
  // oRsltTbl.getTable().getColumns()[0].getHeader().setText(this.i18nBundle.getText("Customer_ID"));
  // sap.ui.getCore().byId("searchFilterBar").getFilterData();
  // sap.ui.getCore().byId("searchFilterBar").getFilterData();
  // },
  onAfterRendering: function() {
   sap.ui.getCore().byId("searchRsltTbl").setIgnoreFromPersonalisation(
    "PARTNER_GUID,CATEGORY"
   );
  },
  // clearTable: function() {
  //  var vResultTbl = sap.ui.getCore().byId("defaultRsltTbl");
  //  if (vResultTbl !== undefined && vResultTbl.getItems().length > 0) {
  //   vResultTbl.destroyItems();
  //  }
  // },

  onCountryChange: function(oEvt) {},

  onBindingComplete: function(oEvt) {
   var vCount = oEvt.getParameters().getParameters().data.__count;
   if (vCount !== "0" && vCount !== undefined && vCount !== null && vCount !== "") {

    // show the message strip
    sap.ui.getCore().byId("moreRecordsMsg").setVisible(true);

    //controller hook to bind the data with new fragment/section etc with importing parameter no return
    /**
     * @ControllerHook To give an access to Modify existing logic
     * Customer can modify the search result Page details or add another section for create/change
     * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookbpModifySearchTblBindingComplete
     * @param {object} result View
     * @param {object} result dialog
     * @return { }
     */
    if (this.extHookbpModifySearchTblBindingComplete) {
     this.extHookbpModifySearchTblBindingComplete(this, dialog);
    }
    return;
   }

   // hide the message strip
   sap.ui.getCore().byId("moreRecordsMsg").setVisible(false);

   //controller hook to bind the data with new fragment/section etc with importing parameter no return
   /**
    * @ControllerHook To give an access to Modify existing logic
    * Customer can modify the search result Page details or add another section for create/change
    * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookbpModifySearchTblBindinglessrecord
    * @param {object} result View
    * @return { }
    */
   if (this.extHookbpModifySearchTblBindinglessrecord) {
    this.extHookbpModifySearchTblBindinglessrecord(this);
   }
  },

  handleItemPressed: function(oEvent) {
   var vTbl = sap.ui.getCore().byId("defaultRsltTbl");
   var vRowId = vTbl.indexOfItem(oEvent.getSource());
   fcg.mdg.editbp.util.DataAccess.setSelectedRecord(vRowId);
   var sCrequestNum = oEvent.getSource().getBindingContext().getProperty("CREQUEST");
   sCrequestNum = sCrequestNum.replace(/^0+/, '');
   var arr = [sCrequestNum];
   var custId = oEvent.getSource().getBindingContext().getProperty("PARTNER");
   // custId = custId.substring(custId.lastIndexOf("(") + 1, custId.lastIndexOf(")"));
   if (sCrequestNum !== "") {
    var message = this.i18nBundle.getText("MSG1", arr);
    var dialog = new sap.m.Dialog({
     title: this.i18nBundle.getText("WARNING"),
     type: 'Message',
     state: 'Warning',
     content: [new sap.m.Text({
      text: message
     })],
     beginButton: new sap.m.Button({
      text: this.i18nBundle.getText("OK"),
      press: function() {
       dialog.close();
      }
     }),
     afterClose: function() {
      dialog.destroy();
     }
    });

    dialog.open();
    return;
   }
   //controller hook to bind the data with new fragment/section etc with importing parameter no return
   /**
    * @ControllerHook To give an access to Modify existing logic
    * Customer can modify the search result Page details or add another section for create/change
    * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookbpModifyhandleitemPressed
    * @param {object} result event
    * @param {object} result View
    * @return { }
    */
   if (this.extHookbpModifyhandleitemPressed) {
    this.extHookbpModifyhandleitemPressed(oEvent, this);
   }
   this.getRouter().navTo("wizard", {
    cateogory: oEvent.getSource().getBindingContext().getProperty("TYPE"),
    selectedItem: oEvent.getSource().getBindingContext().getPath().substr(1),
    customerID: custId,
    RowId: vRowId
     // oEvent.getSource().getBindingContext().getProperty("FULL_NAME")
   }, true);
  },

  getRouter: function() {
   var that = this;
   return sap.ui.core.UIComponent.getRouterFor(that);
  },

  setInitialFlag: function(vInitialFlag) {
   return vInitialFlag;
  },

  openRequestApp: function(oEvent) {
   //controller hook to bind the data with new fragment/section etc with importing parameter no return
   /**
    * @ControllerHook To give an access to Modify existing logic
    * Customer can modify the search result Page details or add another section for create/change
    * @callback sap.ca.scfld.md.controller.BaseFullscreenController~extHookbpModifyopenRequestApp
    * @param {object} result event
    * @param {object} result View
    * @return { }
    */
   if (this.extHookbpModifyopenRequestApp) {
    this.extHookbpModifyopenRequestApp(oEvent, this);
   }
   var href = (sap.ushell && sap.ushell.Container &&
    sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
     target: {
      semanticObject: "Customer",
      action: "requestCustomer"
     },
     params: {
      "MAXDUPREC": "20",
      "CATEGORY": "",
      "USMD_CREQ_TYPE": "CUF1P1"
     }
    })) || "";

   var crossNav = sap.ushell.Container.getService("CrossApplicationNavigation");
   crossNav.hrefForExternal({
    target: {
     semanticObject: "Customer",
     action: "requestCustomer"
    },
    params: {
     "MAXDUPREC": "20",
     "CATEGORY": "",
     "USMD_CREQ_TYPE": "CUF1P1"
    }
   });

   crossNav.toExternal({
    target: {
     semanticObject: "Customer",
     action: "requestCustomer"
    },
    params: {
     "MAXDUPREC": "20",
     "CATEGORY": "",
     "USMD_CREQ_TYPE": "CUF1P1"
    }
   });

  }

 });

});