/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable */
sap.ui.define([
 "sap/ui/core/mvc/Controller",
 "sap/ui/core/routing/History",
 "sap/m/MessageToast",
 'sap/m/UploadCollectionParameter',
 "sap/m/MessageBox"
], function(Controller, History, MessageToast, MessageBox) {
 "use strict";
 jQuery.sap.require("fcg.mdg.editbp.util.DataAccess");
 jQuery.sap.require("fcg.mdg.editbp.util.Formatter");
 jQuery.sap.require("fcg.mdg.editbp.handlers.Communication");
 jQuery.sap.require("fcg.mdg.editbp.handlers.BankAccount");
 jQuery.sap.require("fcg.mdg.editbp.handlers.ContactPerson");
 jQuery.sap.require("fcg.mdg.editbp.handlers.GeneralData");
 jQuery.sap.require("fcg.mdg.editbp.handlers.TaxNumbers");
 jQuery.sap.require("fcg.mdg.editbp.handlers.Identification");
 jQuery.sap.require("fcg.mdg.editbp.handlers.Attachment");
 jQuery.sap.require("sap.m.MessageBox");
 return Controller.extend("fcg.mdg.editbp.controller.Wizard", {
  oWizard: "",
  sItemPath: "",
  oResult: "",
  oCommunicationListRBG: "",
  oCommunicationLayout: "",
  oActionLayout: "",
  sCategory: "",
  i18nBundle: "",
  oDetailComm: "",
  isAddressVisited: "",
  changedArray: "",
  finalChangedArray: "",
  finalQueryModel: "",
  changeSet: "",
  currentDataModel: "",
  resultIndex: "",
  vCurrentEntity: "",
  vCurrentActionId: "",
  vCurrentSelectdDataId: "",
  changedData: {},
  queryModel: {},
  selectedIndex: "",
  vCustomerID: "",
  vTaxCat: "",
  sumAdd: [],
  oFileUpload: "",
  oRequestReason: "",
  oAttach: [],
  requestFrag: "",
  attachDataModel: "",
  aCorrLangValues: "",
  vRequestReason: "",
  createdArray: [],
  reEdit: "",
  reEditSource: "",
  sFinOdataError: false,
  sFinOdataErrorMessage: "",
  vCRCode: "",
  sSearchTerm: "",
  oGenData: "",
  vMaxDupRec: 0,
  oDupCheckData: [],
  oDuplicatesResult: "",
  oDupDialog: "",
  vPARTNERID: "",
  oRequestDisplayFragment: "",
  crType: "",
  vRowId: "",
  vContEditTax: "",
  customerHeaderMsg: "",
  isCPExecuted: false,
  vTaxEntityIndex: "",
  vTaxReEdit: "",
  stepName: "",
  vDataLoss: "",
  oModelTemp: [],
  vCancelFlag: false,
  oEntityFrag: "",
  aEntity: [],
  oOldValuePairModel: [],
  vCurrentEntityTemp: "",
  vCurrentActionIdTemp: "",
  vCurrentSelectdDataIdTemp: "",
  aEntityValue: [],
  vTimedependency: "",
  oDupCheckFinalData: [],

  extHookbpHookReadAddressData: null,

  // Contact Person hook methods
  extHookbpHookModifyRelQueryCall: null,
  extHookbpHookModifygetContactPersonData: null,
  extHookbpHookModifygetAddressData: null,
  extHookbpHookModifyCreateContactPerson: null,
  extHookbpHookModifyLoadWPToolBar: null,
  extHookbpHookModifyCPCreateModel: null,
  extHookbpHookModifyCPDeleteModel: null,
  extHookbpHookModifyCPChangeModel: null,
  extHookbpHookModifygetIdentificationData: null,
  extHookbpHookModifycreateIdentification: null,
  extHookbpHookModifyIDDeleteModel: null,
  extHookbpHookModifyIDCreateModel: null,

  extHookbpHookModifyBankDeriveIban: null,
  extHookbpHookModifyBankKeyValueHelp: null,
  extHookbpHookModifyBankCountryValueHelp: null,
  extHookbpHookModifyBankUndoChanges: null,
  extHookbpHookModifyBankDeleteModel: null,
  extHookbpHookModifyBankChangeModel: null,
  extHookbpHookModifyBankCreateModel: null,
  extHookbpHookModifyBanklayout: null,
  extHookbpHookModifyBankAccounts: null,

  extHookbpHookOnChangeOfAddress: null,
  extHookbpHookOnCreateOfAddress: null,
  extHookbpHookCreateAddressDescrText: null,
  extHookbpHookReadGenData: null,
  extHookbpHookGeneralVH: null,
  extHookbpHookGenCreateSubmitQuery: null,
  extHookbpHookSetDeepEntityCount: null,
  extHookbpHookSetSelectRecordLayout: null,
  extHookbpHookAddressModelHandling: null,

  // Tax hook methods
  extHookbpHookReadTaxData: null,
  extHookbpHookCreateTaxData: null,
  extHookbpHookChangeTaxData: null,
  extHookbpHookDeleteTaxData: null,

  extHookbpHookAddressSubmitChangeQuery: null,
  extHookbpHookAddressSubmitCreateeQuery: null,
  extHookbpHookReadCommunicationData: null,
  extHookbpHookDisplayIAV: null,
  extHookbpHooksetDispAddressTitle: null,
  extHookbpHookAddNewTelAddress: null,
  extHookbpHookAddNewMobAddress: null,
  extHookbpHookAddNewFaxAddress: null,
  extHookbpHookAddNewEmailAddress: null,
  extHookbpHookAddNewURIAddress: null,
  extHookbpHookAddNewIAVAddress: null,
  extHookbpHookSetEnabledWPFields: null,
  extHookbpHookAddNewWPAddress: null,
  extHookbpHookAddNewWPAddressCP: null,
  extHookbpHookDisplayWPAddress: null,
  extHookbpHookDisplayWPAddressCP: null,
  extHookbpHookDisplayCommunicationAddress: null,

  onInit: function() {
   var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
   var myComponent = sap.ui.component(sComponentId);
   fcg.mdg.editbp.util.DataAccess.setCtrlInstance(this);
   if (myComponent && myComponent.getComponentData() && myComponent.getComponentData().startupParameters) {
    if (myComponent.getComponentData().startupParameters.USMD_CREQ_TYPE !== undefined) {
     this.crType = myComponent.getComponentData().startupParameters.USMD_CREQ_TYPE[0];
    }
    if (myComponent.getComponentData().startupParameters.MAXDUPREC !== undefined) {
     this.vMaxDupRec = myComponent.getComponentData().startupParameters.MAXDUPREC[0];
    }
    if (myComponent.getComponentData().startupParameters.CONF_MSG !== undefined) {
     this.showPopup = myComponent.getComponentData().startupParameters.CONF_MSG[0];
    }
   }
   this._initializeBusyDialog();
   this.i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
   fcg.mdg.editbp.handlers.BankAccount.seti18nModel(this.i18nBundle);
   fcg.mdg.editbp.handlers.TaxNumbers.seti18nModel(this.i18nBundle);
   fcg.mdg.editbp.util.DataAccess.seti18nModel(this.i18nBundle);
   this.oWizard = this.getView().byId("wizardId");
   this.oWizard.setFinishButtonText(this.i18nBundle.getText("review_Button"));
   this._oNavContainer = this.getView().byId("wizardNavContainer");
   this._oWizardContentPage = this.getView().byId("wizardContentPage");
   this.changedData = fcg.mdg.editbp.util.DataAccess.oChangedModel;
   this.requestFrag = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.RequestDetail', this);
   this._getRouter().attachRouteMatched(this.onRouteMatched, this);
   fcg.mdg.editbp.util.DataAccess.readMatchProfileFields(this.getOwnerComponent().getModel());
   this.vTimedependency = fcg.mdg.editbp.util.DataAccess.getTimeDependecy(this.getOwnerComponent().getModel());
   this.oOldValuePairModel = [];
  },
  _initializeBusyDialog: function() {
   this._busyDialog = new sap.m.BusyDialog();
  },
  // trigerred when an other option is selected after the wizard step
  onSelectOtherOption: function(stepName) {
   this.stepName = stepName;
   var that = this;
   var message = that.i18nBundle.getText("CANCEL_EDIT");
   var dialog = new sap.m.Dialog({
    title: that.i18nBundle.getText("WARNING"),
    type: 'Message',
    state: 'Warning',
    content: [new sap.m.Text({
     text: message
    })],
    beginButton: new sap.m.Button({
     text: that.i18nBundle.getText("YES"),
     press: function() {
      that.resetFormData();
      that.clearAllData();
      that.oWizard.discardProgress(that.getView().byId(that.stepName));
      dialog.close();
     }
    }),
    endButton: new sap.m.Button({
     text: that.i18nBundle.getText("NO"),
     press: function() {
      switch (that.stepName) {
       case "entityStep":
        sap.ui.getCore().byId(that.vCurrentEntityTemp).setSelected(true);
        that.vCurrentEntity = that.vCurrentEntityTemp;
        break;
       case "actionStep":
        sap.ui.getCore().byId(that.vCurrentActionIdTemp).setSelected(true);
        that.vCurrentActionId = that.vCurrentActionIdTemp;
        break;
       case "selectEntityInstanceStep":
        sap.ui.getCore().byId(that.vCurrentSelectdDataIdTemp).setSelected(true);
        that.vCurrentSelectdDataId = that.vCurrentSelectdDataIdTemp;
        break;
       default:
      }
      dialog.close();
     }
    }),
    afterClose: function() {
     dialog.destroy();
    }
   });

   dialog.open();
  },

  onClickDuplicateMsg: function() {

   if (this.oDupDialog === "") {
    this.oDupDialog = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.DispDuplicate", this);
   }

   var oLocalizationModel = new sap.ui.model.resource.ResourceModel({
    bundleUrl: jQuery.sap.getModulePath("fcg.mdg.editbp") + "/i18n/i18n.properties"
   });

   oLocalizationModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
   this.oDupDialog.setModel(oLocalizationModel, "i18n");

   //   sap.ui.getCore().byId('idDuplCheckResTable-subHeader').setVisible(false);
   var jsonModel = new sap.ui.model.json.JSONModel();
   jsonModel.setData(this.oDuplicatesResult[0].data);
   if (this.oDuplicatesResult !== undefined) {
    if (this.oDuplicatesResult[0].data.results.length !== 0) {
     this.oDupDialog.setModel(jsonModel);
     // sap.ui.getCore().byId("idDuplCheckResTable").bindItems("this.oDuplicatesResult[0].data");
     sap.ui.getCore().byId("duplicatesDialog").open();
    }
   }

  },
  handleClose: function(oEvent) {
   sap.ui.getCore().byId("duplicatesDialog").close();
  },
  _getRouter: function() {
   this.clearAllData();
   return sap.ui.core.UIComponent.getRouterFor(this);

  },

  clearAllData: function() {
   this.changedArray = [];
   this.createdArray = [];
   fcg.mdg.editbp.handlers.GeneralData.changedArray = [];
  },

  //activate="checkModel"
  checkModel: function() {
   for (var i = 0; i < this.getView().byId("communicationLayout").getItems().length; i++) {
    this.oModelTemp[i] = (JSON.parse(JSON.stringify(this.getView().byId("communicationLayout").getItems()[i].getModel().getData())));
   }
  },

  setBackModel: function() {
   var oModel = new sap.ui.model.json.JSONModel();
   for (var i = 0; i < this.getView().byId("communicationLayout").getItems().length; i++) {

    oModel.setData(this.oModelTemp[i]);
    this.getView().byId("communicationLayout").getItems()[i].setModel(null);
    this.getView().byId("communicationLayout").getItems()[i].setModel(oModel);
    // oModel = "";
   }
  },

  onRouteMatched: function(oEvent) {
   //for data loss message when Home button is pressed
   //sap.ushell.Container.setDirtyFlag(true);
   if (this.oEntityFrag === "") {
    this.oEntityFrag = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntity', this);
   } else {
    this.oEntityFrag.destroy();
    this.oEntityFrag = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntity', this);
   }
   this.getView().byId("entityLayout").removeAllContent();
   this.getView().byId("entityLayout").setVisible(true);
   this.getView().byId("entityLayout").addContent(this.oEntityFrag);

   //destroying the instance of request detail fragment
   if(this.oRequestDisplayFragment !== ""){
    this.oRequestDisplayFragment.destroy();
    this.oRequestDisplayFragment = "";
   }

   this.clearAllData();
   this.finalChangedArray = [];
   this.finalQueryModel = [];
   this.changeSet = [];
   this.aEntityValue = [];
   this.vRequestReason = "";
   this.oAttach = [];
   this.attachDataModel = "";
   this.aEntity = [];
   this.vDataLoss = this.i18nBundle.getText("NO_SELECT_LOSS");
   this.oModelTemp = [];
   this.initializeAttachments();
   this.oDupCheckData = [];
   this.oDupCheckFinalData = [];
   this.oDuplicatesResult = "";
   this.customerHeaderMsg = "";
   if (oEvent.getParameter("name") !== "wizard") {
    return;
   }
   fcg.mdg.editbp.handlers.BankAccount.clearGlobalVariables();
   fcg.mdg.editbp.handlers.GeneralData.clearGlobalVariables(this);
   fcg.mdg.editbp.handlers.Communication.clearGlobalVariables(this);
   fcg.mdg.editbp.handlers.TaxNumbers.clearGlobalVariables(this);
   fcg.mdg.editbp.handlers.ContactPerson.clearGlobalVariables(this);
   fcg.mdg.editbp.handlers.Identification.clearGlobalVariables();
   /**
    * @ControllerHook To perform action on entity selected
    * If customer extends the application with his own entity, the variables has to be cleared 
    * on navigation
    * @callback Controller~extHookClearHandlerVariables
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookClearHandlerVariables() !== undefined) {
    this.extHookClearHandlerVariables(this);
   }

   this.sCategory = oEvent.getParameters().arguments.cateogory;
   this.vCustomerID = oEvent.getParameters().arguments.customerID;
   this.vTaxCat = oEvent.getParameters().arguments.TAXTYPE;
   this.vRowId = oEvent.getParameters().arguments.RowId;
   this.sItemPath = oEvent.getParameters().arguments.selectedItem;
   this.sItemPath = this.sItemPath.split("(");
   this.sItemPath = this.sItemPath[1].split(")");
   this.sItemPath = this.sItemPath[0];
   this.setGeneralActionText(this.sCategory);

   // To display Customer detail in Wizard Step
   var path = "SearchCollection?$filter=" + jQuery.sap.encodeURL("PARTNER eq '" + this.vCustomerID + "'");
   var oResult = "";
   var oBatchModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
   var mheaders = {};
   oBatchModel.getHeaders(mheaders);
   mheaders.SEARCH_MODE = "DB"
   oBatchModel.setHeaders(mheaders);
   oBatchModel.setUseBatch(true);
   var aBatchOperation = [];
   var oBatchOperation1 = oBatchModel.createBatchOperation(path, "GET");
   aBatchOperation.push(oBatchOperation1);
   oBatchModel.clearBatch();
   oBatchModel.addBatchReadOperations(aBatchOperation);
   aBatchOperation = [];
   oBatchModel.submitBatch(function(odata, response) {
    oResult = odata.__batchResponses;
   }, null, false);
   oBatchModel.clearBatch();
   var mcName1 = oResult[0].data.results[0].MCNAME1;
   var postCod1 = oResult[0].data.results[0].POST_COD1;
   var city1 = oResult[0].data.results[0].CITY1;
   var PARTNER = oResult[0].data.results[0].PARTNER;
   this.vPARTNERID = oResult[0].data.results[0].PARTNER;
   var customerHeaderMsg = this.i18nBundle.getText("customer_header_msg") + " " + ":" + " " + mcName1 + " " + postCod1 + " " + city1 +
    " " + "(" + PARTNER + ")";
   this.byId("customerHeader").setText(customerHeaderMsg);
   sap.ui.getCore().byId("idInvTextRBG").setText(customerHeaderMsg);
   this.customerHeaderMsg = customerHeaderMsg.split(":")[1];
  },

  resetFormData: function() {
   for (var i = 0; i < this.oOldValuePairModel.length; i++) {
    sap.ui.getCore().byId(this.oOldValuePairModel[i].ID).setValue(this.oOldValuePairModel[i].value);
   }
   this.oOldValuePairModel = [];
  },
  //checks which entity ID is selected by the user
  checkEntitySelected: function() {
   fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = 0;
   fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
   this.vDataLoss = this.i18nBundle.getText("NO_SELECT_LOSS");
   this.vCurrentEntityTemp = this.vCurrentEntity;
   if (sap.ui.getCore().byId("entityRBG").getSelectedIndex() === -1) {
    this.oWizard.invalidateStep(this.getView().byId("entityStep"));
    return;
   }
   if (this.changedArray.length === 0 && this.createdArray.length === 0 && fcg.mdg.editbp.handlers.GeneralData.changedArray.length ===
    0) {
    this.oWizard.discardProgress(this.getView().byId("entityStep"));
   } else {
    this.onSelectOtherOption("entityStep");
   }
   this.vCurrentEntity = sap.ui.getCore().byId("entityRBG").getSelectedButton().getId();
   if (this.vCurrentEntity !== "") {
    this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
    this.oWizard.validateStep(this.getView().byId("entityStep"));
   } else {
    this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
    this.oWizard.invalidateStep(this.getView().byId("entityStep"));
   }
   /**
    * @ControllerHook To perform action on entity selected
    * If customer extends the application with his own entity, certain checks can be done
    * on selection if required here
    * @callback Controller~extHookCheckEntitySelected
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookCheckEntitySelected() !== undefined) {
    this.extHookCheckEntitySelected(this);
   }
  },
  //checks which action is selected by the user
  checkActionSelected: function() {
   // fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = 0;
   // fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
   this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
   this.vCurrentActionIdTemp = this.vCurrentActionId;
   if (sap.ui.getCore().byId("actionRBG").getSelectedIndex() === -1) {
    this.oWizard.invalidateStep(this.getView().byId("actionStep"));
    return;
   }
   if (this.changedArray.length === 0 && this.createdArray.length === 0 && fcg.mdg.editbp.handlers.GeneralData.changedArray.length ===
    0) {
    this.oWizard.discardProgress(this.getView().byId("actionStep"));
   } else {
    //this.clearAllData();
    this.onSelectOtherOption("actionStep");
   }

   this.vCurrentActionId = sap.ui.getCore().byId("actionRBG").getSelectedButton().getId();
   if (this.vCurrentActionId === "") {
    this.oWizard.invalidateStep(this.getView().byId("actionStep"));
   } else {
    this.oWizard.validateStep(this.getView().byId("actionStep"));
   }

   /**
    * @ControllerHook To perform action on Action selected
    * If customer extends the application with his own Action, certain checks can be done
    * on selection if required here
    * @callback Controller~extHookCheckActionSelected
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookCheckActionSelected() !== undefined) {
    this.extHookCheckActionSelected(this);
   }
  },
  //checks the which record is selected
  checkDataListSelected: function() {
   // fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = 0;
   // fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
   this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
   //activate="checkDataListSelected"

   this.vCurrentSelectdDataIdTemp = this.vCurrentSelectdDataId;
   if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
    if (sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex() === -1) {
     if (this.vCurrentActionId === "deleteRB") {
      this.oWizard.invalidateStep(this.getView().byId("editStep"));
      // this.oWizard.discardProgress(this.getView().byId("editStep"));
      return;
     } else if (this.vCurrentActionId === "changeRB") {
      this.oWizard.invalidateStep(this.getView().byId("selectEntityInstanceStep"));
      return;
     }
    }

    this.vCurrentSelectdDataId = sap.ui.getCore().byId("selectDataListRBG").getSelectedButton().getId();
    if (this.vCurrentSelectdDataId === "") {
     if (this.vCurrentActionId === "deleteRB") {
      this.oWizard.invalidateStep(this.getView().byId("editStep"));
     } else if (this.vCurrentActionId === "changeRB") {
      this.oWizard.invalidateStep(this.getView().byId("selectEntityInstanceStep"));
     }
    } else {
     if (this.vCurrentActionId === "deleteRB") {
      this.oWizard.validateStep(this.getView().byId("editStep"));
     } else if (this.vCurrentActionId === "changeRB") {
      // this.oWizard.discardProgress(this.getView().byId("selectEntityInstanceStep"));
      this.oWizard.validateStep(this.getView().byId("selectEntityInstanceStep"));

     }
    }
   }
   // }
   if (this.changedArray.length === 0 && this.createdArray.length === 0 && fcg.mdg.editbp.handlers.GeneralData.changedArray.length ===
    0) {
    this.oWizard.discardProgress(this.getView().byId("selectEntityInstanceStep"));
   } else {
    this.onSelectOtherOption("selectEntityInstanceStep");
   }

   /**
    * @ControllerHook To perform action on Entity Instance selected
    * If customer extends the application with checks for Record Instance, certain checks can be done
    * on selection if required here
    * @callback Controller~extHookCheckDataListSelected
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookCheckDataListSelected() !== undefined) {
    this.extHookCheckDataListSelected(this);
   }
  },

  checkEditValidated: function() {
   // fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = 0;
   // fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
   // this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
   if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
    this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
    if (sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex() === -1) {
     if (this.vCurrentActionId === "deleteRB") {
      this.oWizard.invalidateStep(this.getView().byId("editStep"));
      // this.oWizard.discardProgress(this.getView().byId("editStep"));
      return;
     } else if (this.vCurrentActionId === "createRB") {
      this.oWizard.invalidateStep(this.getView().byId("editStep"));
      this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
      // this.oWizard.discardProgress(this.getView().byId("editStep"));
      return;
     } else if (this.vCurrentActionId === "changeRB") {
      this.oWizard.invalidateStep(this.getView().byId("selectEntityInstanceStep"));
      this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
      return;
     }
    }

    if (sap.ui.getCore().byId("selectDataListRBG").getSelectedButton() !== undefined) {
     this.vCurrentSelectdDataId = sap.ui.getCore().byId("selectDataListRBG").getSelectedButton().getId();
    }
    if (this.vCurrentSelectdDataId === "") {
     if (this.vCurrentActionId === "deleteRB" || this.vCurrentActionId === "createRB") {
      this.oWizard.invalidateStep(this.getView().byId("editStep"));
     } else if (this.vCurrentActionId === "changeRB") {
      this.oWizard.invalidateStep(this.getView().byId("selectEntityInstanceStep"));
      this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
     }
    } else {
     this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
     if (this.vCurrentActionId === "deleteRB" || this.vCurrentActionId === "createRB") {
      this.oWizard.invalidateStep(this.getView().byId("editStep"));
     } else if (this.vCurrentActionId === "changeRB") {
      //                this.oWizard.discardProgress(this.getView().byId("selectEntityInstanceStep"));
      this.oWizard.validateStep(this.getView().byId("selectEntityInstanceStep"));
      this.oWizard.invalidateStep(this.getView().byId("editStep"));

     }
    }
   } else {
    this.oWizard.invalidateStep(this.getView().byId("editStep"));
   }
  },

  setRadioButtonText: function() {
   var id = ["createRB", "changeRB", "deleteRB"];
   var textCreate = "", textChange = "", textDelete="";
   switch (this.vCurrentEntity) {
    case "communicationRB":
     textCreate = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("Addr_Comm");
     textChange = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("Addr_Comm");
     textDelete = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("Addr_Comm");
     break;
    case "BankRB":
     textCreate = this.i18nBundle.getText("create_new_bank");
     textChange = this.i18nBundle.getText("change_existing_bank");
     textDelete = this.i18nBundle.getText("delete_existing_bank");
     break;
    case "ContactPerRB":
     textCreate = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("contact_person");
     textChange = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("contact_person");
     textDelete = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("contact_person");
     break;
    case "identificationRB":
     textCreate = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("identification");
     textChange = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("identification");
     textDelete = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("identification");
     break;
    case "taxRB":
     textCreate = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("tax_num");
     textChange = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("tax_num");
     textDelete = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("tax_num");
     break;
   }
   sap.ui.getCore().byId("createRB").setText(textCreate);
   sap.ui.getCore().byId("idInvTextCreateRBG").setText(textCreate);
   sap.ui.getCore().byId("changeRB").setText(textChange);
   sap.ui.getCore().byId("idInvTextChangeRBG").setText(textChange);
   sap.ui.getCore().byId("deleteRB").setText(textDelete);
   sap.ui.getCore().byId("idInvTextDeleteRBG").setText(textDelete);

   /**
    * @ControllerHook To Display the Actions for newly added entity
    * If customer extends the application with a new entity, the action page has to be set
    * @callback Controller~extHookSetRadioButtonText
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookSetRadioButtonText() !== undefined) {
    this.extHookSetRadioButtonText(this);
   }
  },
  goToActionStep: function(oEvent) {
   if (this.vCurrentEntity === "OrgRB") {
    //move this step of reading data to the GeneralData.js
    this.vCurrentActionId = "";
    this.aEntity = this.i18nBundle.getText("select_OrgData");
    this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
    this.getView().byId("entityStep").setNextStep(this.getView().byId("requestStep"));
    this.getView().byId("requestStep").setTitle(this.i18nBundle.getText("select_genOrg"));
    this.setActionView("requestStep", "select_genOrg");
    fcg.mdg.editbp.handlers.GeneralData.editGeneralData(this.sItemPath, this.sCategory, this.i18nBundle, this);
    return;
   } else if (this.vCurrentEntity === "PersRB") {
    //move this step of reading data to the GeneralData.js
    this.vCurrentActionId = "";
    this.aEntity = this.i18nBundle.getText("select_PersData");
    this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
    this.getView().byId("entityStep").setNextStep(this.getView().byId("requestStep"));
    this.getView().byId("requestStep").setTitle(this.i18nBundle.getText("select_genPer"));
    this.setActionView("requestStep", "select_genPer");
    fcg.mdg.editbp.handlers.GeneralData.editGeneralData(this.sItemPath, this.sCategory, this.i18nBundle, this);
    return;
   } else if (this.vCurrentEntity === "communicationRB") {
    fcg.mdg.editbp.handlers.Communication.getCPBasicData(this);
    fcg.mdg.editbp.handlers.Communication.getAddressData(this);
   } else if (this.vCurrentEntity === "ContactPerRB") {
    fcg.mdg.editbp.handlers.ContactPerson.getContactPersonData(this);
    return;
   } else if (this.vCurrentEntity === "identificationRB") {
    fcg.mdg.editbp.handlers.Identification.getIdentificationData(this);
    return;
   } else if (this.vCurrentEntity === "taxRB") {
    fcg.mdg.editbp.handlers.TaxNumbers.getTaxNumData(this);
   } else if (this.vCurrentEntity === "BankRB") {
    fcg.mdg.editbp.handlers.BankAccount.getBankAccounts(this);
   }
   this.getView().byId("entityStep").setNextStep(this.getView().byId("actionStep"));
   if (this.oActionLayout === "") {
    this.oActionLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectAction', this);
   }
   this.getView().byId("actionLayout").setVisible(true);
   this.getView().byId("actionLayout").addContent(this.oActionLayout);
   this.setRadioButtonText(this.vCurrentEntity);

   /**
    * @ControllerHook To Perform the Action for newly added entity
    * If customer extends the application with a new entity, the action page has to be set
    * @callback Controller~extHookGoToActionStep
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookGoToActionStep() !== undefined) {
    this.extHookGoToActionStep(this);
   }

  },
  //record selection - each entity will have create, delete. Each person has to handel this
  goToNextActionStep: function(oEvent) {

   if (this.vCurrentEntity === "communicationRB") {
    this.aEntity = this.i18nBundle.getText("Addr_Comm");
    fcg.mdg.editbp.handlers.Communication.handleCommunication(this);
   } else if (this.vCurrentEntity === "BankRB") {
    this.aEntity = this.i18nBundle.getText("bank_acc");
    fcg.mdg.editbp.handlers.BankAccount.handleBankAccounts(this);
   } else if (this.vCurrentEntity === "identificationRB") {
    this.aEntity = this.i18nBundle.getText("identification");
    fcg.mdg.editbp.handlers.Identification.handleIdentification(this);
   } else if (this.vCurrentEntity === "taxRB") {
    this.aEntity = this.i18nBundle.getText("tax_num");
    if (this.vCurrentActionId === "createRB") {
     fcg.mdg.editbp.handlers.TaxNumbers.createTaxNumber(this);
    } else if (this.vCurrentActionId === "changeRB") {
     fcg.mdg.editbp.handlers.TaxNumbers.editTaxNum(this);
    } else if (this.vCurrentActionId === "deleteRB") {
     fcg.mdg.editbp.handlers.TaxNumbers.deleteTaxNum(this);
    }
   } else if (this.vCurrentEntity === "ContactPerRB") {
    fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = 0;
    fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
    this.aEntity = this.i18nBundle.getText("contact_person");
    fcg.mdg.editbp.handlers.ContactPerson.handleContactPerson(this);
   }
   this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
   //Wizard Step labels after action.
   var text = "";
   if (this.vCurrentEntity === "communicationRB") {
    if (this.vCurrentActionId === "createRB") {
     text = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("Addr_Comm");
     this.byId("communicationStep").setTitle(text);
    } else if (this.vCurrentActionId === "changeRB") {
     text = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("Addr_Comm");
     this.byId("communicationStep").setTitle(text);
     text = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("Addr_Comm");
     this.byId("selectEntityInstanceStep").setTitle(text);
    } else if (this.vCurrentActionId === "deleteRB") {
     text = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("Addr_Comm");
     this.byId("communicationStep").setTitle(text);
     this.byId("editStep").setTitle(text);
    }
   }

   if (this.vCurrentEntity === "BankRB") {
    if (this.vCurrentActionId === "createRB") {
     text = this.i18nBundle.getText("create_new_bank");
     this.byId("editStep").setTitle(text);
    } else if (this.vCurrentActionId === "changeRB") {
     text = this.i18nBundle.getText("change_existing_bank");
     this.byId("editStep").setTitle(text);
     text = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("bank_acc");
     this.byId("selectEntityInstanceStep").setTitle(text);
    } else if (this.vCurrentActionId === "deleteRB") {
     text = this.i18nBundle.getText("delete_existing_bank");
     this.byId("editStep").setTitle(text);
    }
   }

   if (this.vCurrentEntity === "identificationRB") {
    if (this.vCurrentActionId === "createRB") {
     text = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("identification");
     this.byId("editStep").setTitle(text);
    } else if (this.vCurrentActionId === "changeRB") {
     text = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("identification");
     this.byId("editStep").setTitle(text);
     text = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("identification");
     this.byId("selectEntityInstanceStep").setTitle(text);
    } else if (this.vCurrentActionId === "deleteRB") {
     text = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("identification");
     this.byId("editStep").setTitle(text);
    }
   }

   if (this.vCurrentEntity === "ContactPerRB") {
    if (this.vCurrentActionId === "createRB") {
     text = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("contact_person");
     this.byId("editStep").setTitle(text);
    } else if (this.vCurrentActionId === "changeRB") {
     text = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("contact_person");
     this.byId("editStep").setTitle(text);
     text = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("contact_person");
     this.byId("selectEntityInstanceStep").setTitle(text);
    } else if (this.vCurrentActionId === "deleteRB") {
     text = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("contact_person");
     this.byId("editStep").setTitle(text);
    }
   }

   if (this.vCurrentEntity === "OrgRB") {
    if (this.vCurrentActionId === "createRB") {
     text = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("organization");
     this.byId("editStep").setTitle(text);
    } else if (this.vCurrentActionId === "changeRB") {
     text = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("organization");
     this.byId("editStep").setTitle(text);
     text = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("organization");
     this.byId("selectEntityInstanceStep").setTitle(text);
    } else if (this.vCurrentActionId === "deleteRB") {
     text = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("organization");
     this.byId("editStep").setTitle(text);
    }
   }

   if (this.vCurrentEntity === "taxRB") {
    if (this.vCurrentActionId === "createRB") {
     text = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("tax_num");
     this.byId("editStep").setTitle(text);
    } else if (this.vCurrentActionId === "changeRB") {
     text = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("tax_num");
     this.byId("editStep").setTitle(text);
     text = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("tax_num");
     this.byId("selectEntityInstanceStep").setTitle(text);
    } else if (this.vCurrentActionId === "deleteRB") {
     text = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("tax_num");
     this.byId("editStep").setTitle(text);
    }
   }

   if (this.vCurrentEntity === "PersRB") {
    if (this.vCurrentActionId === "createRB") {
     text = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("PERSON");
     this.byId("editStep").setTitle(text);
    } else if (this.vCurrentActionId === "changeRB") {
     text = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("PERSON");
     this.byId("editStep").setTitle(text);
     text = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("PERSON");
     this.byId("selectEntityInstanceStep").setTitle(text);
    } else if (this.vCurrentActionId === "deleteRB") {
     text = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("PERSON");
     this.byId("editStep").setTitle(text);
    }
   }

   /**
    * @ControllerHook To Perform the Action for records of newly added entity
    * If customer extends the application with a new entity, the action page has to be set
    * for handling records of the added entity
    * @callback Controller~extHookGoToNextActionStep
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookGoToNextActionStep() !== undefined) {
    this.extHookGoToNextActionStep(this);
   }
  },

  goToSelectDataStep: function(oEvent) {
   var length = this.vCurrentSelectdDataId.length,
    index = this.vCurrentSelectdDataId.substring(length - 1, length),
    result = "";

   if (this.vCurrentEntity === "communicationRB") {
    this.aEntity = this.i18nBundle.getText("Addr_Comm");
    this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
    fcg.mdg.editbp.handlers.Communication.handleSelectItemForComm(this);
   } else if (this.vCurrentEntity === "BankRB") {
    this.aEntity = this.i18nBundle.getText("bank_acc");
    fcg.mdg.editbp.handlers.BankAccount.createChangeBankAccounts(this);
   } else if (this.vCurrentEntity === "ContactPerRB") {
    fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = 0;
    fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
    this.aEntity = this.i18nBundle.getText("contact_person");
    fcg.mdg.editbp.handlers.ContactPerson.handleSelectItemForCP(this);
   } else if (this.vCurrentEntity === "taxRB") {
    this.aEntity = this.i18nBundle.getText("tax_num");
    if (this.vCurrentActionId === "changeRB") {
     fcg.mdg.editbp.handlers.TaxNumbers.editmultiTaxNumber(this);
    }
    return;
   } else if (this.vCurrentEntity === "identificationRB") {
    this.aEntity = this.i18nBundle.getText("identification");
    result = fcg.mdg.editbp.handlers.Identification.getIdentificationResults();
    fcg.mdg.editbp.handlers.Identification.deleteIdentification();
   }

   /**
    * @ControllerHook To Perform the Action for selection of records of newly added entity
    * If customer extends the application with a new entity, the action page has to be set
    * for handling of selection of records of the added entity
    * @callback Controller~extHookGoToSelectDataStep
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookGoToSelectDataStep() !== undefined) {
    this.extHookGoToSelectDataStep(this);
   }
  },

  pressBack: function(oEvent) {
   var that = this;
   var oHistory, sPreviousHash;
   oHistory = History.getInstance();
   sPreviousHash = oHistory.getPreviousHash();
   //"Are you sure you want to cancel your Modifications ?"
   // var message = that.i18nBundle.getText("CANCEL_EDIT");
   var message = this.vDataLoss;
   var dialog = new sap.m.Dialog({
    title: that.i18nBundle.getText("WARNING"),
    type: 'Message',
    state: 'Warning',
    content: [new sap.m.Text({
     text: message
    })],
    beginButton: new sap.m.Button({
     text: that.i18nBundle.getText("YES"),
     press: function() {
      // update submit button state
      that.submitButtonState();

      var layout = that.checkReviewPageLayoutVisible();
      if (layout) {
       that.vCancelFlag = true;

       // reset form data
       that.resetFormData();

       // reset the attachment model - i.e., replace it with the prev model
       that._oNavContainer = that.getView().byId("wizardNavContainer");
       var requestLayoutContent = that._oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent();
       var list = requestLayoutContent[0].getContent()[1].getContent()[0];
       that.attachDataModel.setData(JSON.parse(JSON.stringify(list.getModel().getData())));

       // reset the request reason
       if(that.oRequestReason !== "") {
        var oldReqReason = requestLayoutContent[0].getContent()[0].getContent()[1].getText();
        that.oRequestReason.setValue(oldReqReason);
       }

       that.getView().byId("wizardId").fireEvent("complete");
      } else {
       that.returnToSearchPage();
      }
      dialog.close();
     }
    }),
    endButton: new sap.m.Button({
     text: that.i18nBundle.getText("NO"),
     press: function() {
      dialog.close();
     }
    }),
    afterClose: function() {
     dialog.destroy();
    }
   });

   dialog.open();

  },

  //Cancel button logic
  onCancel: function(oEvent) {
   var that = this;
   var layout = false;
   var message = this.vDataLoss;
   var oHistory, sPreviousHash;
   oHistory = History.getInstance();
   sPreviousHash = oHistory.getPreviousHash();
   var id = oEvent.getSource().getId().split("--");
   id = id[id.length - 1];
   if (id === "wizardCancel") {
    layout = this.checkReviewPageLayoutVisible();
    if(!layout){
     message = that.i18nBundle.getText("NO_SELECT_LOSS");
    }
   }
   if (id === "reviewCancel") {
    if (!that.getView().byId("idSubmit").getEnabled())
     message = that.i18nBundle.getText("NO_SELECT_LOSS");
    else
     message = that.i18nBundle.getText("CANCEL_EDIT");
   }
   //"Are you sure you want to cancel your Modifications ?"
   var dialog = new sap.m.Dialog({
    title: that.i18nBundle.getText("WARNING"),
    type: 'Message',
    state: 'Warning',
    content: [new sap.m.Text({
     text: message
    })],

    beginButton: new sap.m.Button({
     text: that.i18nBundle.getText("YES"),
     press: function() {
      if (layout) {
       that.vCancelFlag = true;
       that.clearAllData();
       that.getView().byId("wizardId").fireEvent("complete");
      } else {
       that.returnToSearchPage();
      }
      dialog.close();
     }
    }),
    endButton: new sap.m.Button({
     text: that.i18nBundle.getText("NO"),
     press: function() {
      dialog.close();
     }
    }),
    afterClose: function() {
     dialog.destroy();
    }
   });

   dialog.open();

  },

  checkReviewPageLayoutVisible: function() {
   var vReviewlength = 0;
   vReviewlength = this._oNavContainer.getPages()[1].getContent().length;

   for (var i = 0; i < vReviewlength; i++) {
    if (this._oNavContainer.getPages()[1].getContent()[i].getVisible()) {
     if (!this.getView().byId("idSubmit").getEnabled()) {
      return false;
     } else {
      return true;
     }
    }
   }
   return false;
  },

  returnToSearchPage: function() {
   var vReviewlength = 0;
   vReviewlength = this._oNavContainer.getPages()[1].getContent().length;
   for (var i = 0; i < vReviewlength; i++) {
    if (this._oNavContainer.getPages()[1].getContent()[i].getContent()[0] !== undefined) {
     this._oNavContainer.getPages()[1].getContent()[i].getContent()[0].removeAllContent();
    }

    if (this._oNavContainer.getPages()[1].getContent()[i].getContent()[1] !== undefined) {
     this._oNavContainer.getPages()[1].getContent()[i].getContent()[1].removeAllContent();
    }

    if (this._oNavContainer.getPages()[1].getContent()[i].getContent()[2] !== undefined) {
     this._oNavContainer.getPages()[1].getContent()[i].getContent()[2].removeAllContent();
    }

   }
   if (sap.ui.getCore().byId("selectDataListRBG") !== undefined)
    sap.ui.getCore().byId("selectDataListRBG").setSelectedIndex(-1);

   this._navToEntityStep(this.getView().byId("entityStep"));
   this.vContEditTax = "";
   this.aEntityValue = [];
   this.getView().byId("requestDetailLayout").setVisible(false);
   this.getView().byId("organizationLayout").setVisible(false);
   this.getView().byId("addrsCommnctnLayout").setVisible(false);
   this.getView().byId("bankLayout").setVisible(false);
   this.getView().byId("identificationLayout").setVisible(false);
   this.getView().byId("taxLayout").setVisible(false);
   this.getView().byId("contactPersonLayout").setVisible(false);
   this._getRouter().navTo("search", {}, true);
  },

  setActionView: function(sEntityStep, sText) {
   var oThis = this;
   var entityStep = this.getView().byId(sEntityStep);

   entityStep.addEventDelegate({
    onAfterRendering: function() {
     var oItems = this.$().find('.sapMWizardStepTitle');
     oItems[0].innerHTML = oThis.i18nBundle.getText(sText);
    }
   }, entityStep);
  },

  onBankCountryChange: function(oEvent) {
   var oBankCountry = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
   var oBankCountryName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY__TXT");
   if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
    this.onChange(oEvent);
   } else {
    if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue() === "") {
     oBankCountry.setValueState("Error");
     oBankCountry.setValueStateText(this.i18nBundle.getText("BlnkCountryMSG"));
     oBankCountryName.setValue();
     sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").setValue();
    } else {
     sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").setValue(sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue()
      .toUpperCase());
     var country = oBankCountry.getValue();
     this.onChange(oEvent);
     var countryNoSpaces = country.replace(/^[ ]+|[ ]+$/g, '');
     var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
     if (oCountryResult.results.length > 0) {
      var vTotal = oCountryResult.results.length - 1;
      for (var i = 0; i < oCountryResult.results.length; i++) {
       if (oCountryResult.results[i].KEY === country) {
        oBankCountry.setValueState("None");
        oBankCountry.setValueStateText("");
        oBankCountryName.setValue(oCountryResult.results[i].TEXT);
        oBankCountryName.fireEvent("change");
        if (oBankCountry.getValueState() === "None" && sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").getValueState() ===
         "None") {
         sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").setValueState("None");
        }
        this._fetchBankName();
        if (fcg.mdg.editbp.handlers.BankAccount.ibanFlag !== "X") {
         fcg.mdg.editbp.handlers.BankAccount._deriveIban(oBankCountry, oEvent, this);
        }
        return;
       } else if (i === vTotal && oCountryResult.results[i].KEY !== country) {
        oBankCountry.setValueState("Error");
        oBankCountry.setValueStateText(this.i18nBundle.getText("CountryMSG", country));
        oBankCountryName.setValue();
       }
      }
     }
    }
   }
  },

  onBankKeyChange: function(oEvent, bAsync) {
   if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
    this.onChange(oEvent);
   } else {
    var oCountry = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
    var countryVal = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue();
    var oBankKey = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
    var oBankName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
    var bankKeyValue = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").getValue();
    var oIBAN = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN");
    if (bankKeyValue.replace(/^[ ]+|[ ]+$/g, '') === "") {
     oBankName.setValue();
     oBankKey.setValue();
     oIBAN.setValue();
     oIBAN.setValueState("None");
     oBankKey.setValueState("None");
     if (oCountry.getValue() === "") {
      oCountry.setValueState("None");
     }
     if (oCountry.getValueState() === "None" && oBankKey.getValueState() === "None") {
      sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").setValueState("None");
     }
     return;
    }
    if (countryVal.replace(/^[ ]+|[ ]+$/g, '') === "" || oCountry.getValueState() === "Error") {
     oBankName.setValue();
     oBankKey.setValueState("Error");
     if (oCountry.getValueState() === "Error" && oCountry.getValue() !== "") {
      oBankKey.setValueStateText(oCountry.getValueStateText());
     } else {
      oBankKey.setValueStateText(this.getView().getModel("i18n").getProperty("BANK_COUNTRY_CHECK"));
      oCountry.setValueState("Error");
      oCountry.setValueStateText(this.getView().getModel("i18n").getProperty("BlnkCountryMSG"));
     }
    } else {
     this._fetchBankName(oEvent, bAsync);
    }
   }
  },

  _fetchBankName: function(oEvent, bAsync) {
   var oCountry = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
   var countryVal = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue();
   var oBankKey = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
   var oBankName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
   var bankKeyVal = oBankKey.getValue();
   var bankKeyNoSpaces = bankKeyVal.replace(/^[ ]+|[ ]+$/g, '');
   var oIBAN = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN");
   var oBankAccount = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT");
   var countryVal = oCountry.getValue();
   // fcg.mdg.editbp.handlers.BankAccount.setEvent(oEvent);
   var oGlobalIns = this;
   // var oEvt =  oEvent;
   // var noIbanDerive = noIbanDerivation;
   if (bankKeyNoSpaces !== "") {
    var query = "/ValueHelpCollection?$filter=" + jQuery.sap.encodeURL(
     "ENTITY eq 'BP_BankAccount' and ATTR_NAME eq 'BANK_KEY' and FILTER eq " + "'COUNTRY=" + countryVal + "'" + "and ATTR_VALUE eq'" +
     bankKeyVal + "'");
    bAsync = bAsync === undefined ? true : bAsync;
    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
    oModel.read(query, null, null, bAsync,
     function(data, oError) {
      if (oBankKey.getValue() !== "") {
       fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "X";
       oBankAccount.setValueState("None");
       oBankAccount.setValueStateText("");
       oBankKey.fireEvent("change");
       fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "";
       // oGlobalIns.onChange(fcg.mdg.editbp.handlers.BankAccount.oSrcEvt);
       var sBankName = data.results[0].TEXT;
       oBankKey.setValueState("None");
       oBankKey.setValueStateText("");
       oBankName.setValue(sBankName);
       oBankName.fireEvent("change");
       if (oCountry.getValueState() === "None" && oBankKey.getValueState() === "None") {
        oBankAccount.setValueState("None");
       }
       if (fcg.mdg.editbp.handlers.BankAccount.ibanFlag !== "X") {
        fcg.mdg.editbp.handlers.BankAccount._deriveIban(oBankKey, oEvent, oGlobalIns);
       } else {
        fcg.mdg.editbp.handlers.BankAccount.ibanFlag = "";
       }
       // if (noIbanDerive === undefined) {
       //  oGlobalIns._deriveIBAN();
       // }
      }
     },
     function(oError) {
      // If this country key does not exist in the backend, show this error as a pop up
      oBankName.setValue();
      oBankKey.setValueState("Error");
      var errorObj = JSON.parse(oError.response.body);
      var errorMsg = errorObj.error.message.value;
      oBankKey.setValueStateText(errorMsg);
      oIBAN.setValueState("None");
      oIBAN.setValue();
      oBankAccount.setValueState("None");
     });
   } else {
    oBankKey.setValue();
    oBankKey.setValueState("None");
   }
   // if (oGlobalIns.ChangeDeferred !== undefined && oGlobalIns.ChangeDeferred.state() !== "resolved") {
   //  oGlobalIns.ChangeDeferred.resolve();
   // }
  },

  onIBANChange: function(oEvt) {
   if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
    this.onChange(oEvt);
   } else {
    var iban = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").getValue();
    sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").setValueState("None");
    if (iban.replace(/^[ ]+|[ ]+$/g, '') !== "") {
     this._deriveBankDetails(iban);
    } else {
     sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").setValue();
     this.onChange(oEvt);
     // this.ChangeDeferred.resolve();
    }
    // for (var i = 0; i < this.aMatchProMandt.length; i++) {
    //  if (this.aMatchProMandt[i] === "IBAN") {
    //   this.checkInvoked = true;
    //   this.checkAndPerformSearch();
    //  }
   }
   //this.checkAndPerformSearch();
  },

  _deriveBankDetails: function(sIban) {
   var oGlobalIns = this;
   var query = "/BP_BankAccountCollection?$filter=" + jQuery.sap.encodeURL("IBAN eq '" + sIban + "'");
   var oIBAN = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN");
   var oBankCountry = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
   var oBankNumber = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
   var oBankAccount = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT");
   var oBankName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
   var oBankCountryName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY__TXT");
   var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
   oModel.read(query, null, null, true,
    function(data, oError) {
     // Set the description as returned by requests
     if (data.results.length > 0) {
      fcg.mdg.editbp.handlers.BankAccount.ibanFlag = "X";
      oBankCountry.setValue(data.results[0].BANK_CTRY);
      oBankCountry.fireEvent("change");
      // oGlobalIns.vBankCountry = data.results[0].BankCountry;
      oBankNumber.setValue(data.results[0].BANK_KEY);
      oBankNumber.fireEvent("change");
      oBankAccount.setValue(data.results[0].BANK_ACCT);
      fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "X";
      oBankAccount.fireEvent("change");
      oIBAN.fireEvent("change");
      oBankCountry.setValueState("None");
      oBankNumber.setValueState("None");
      oBankAccount.setValueState("None");
      fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "";
      // oGlobalIns._fetchBankCountryDescription(true);
     }
    },
    function(oError) {
     // If this country key does not exist in the backend, show this error as a pop up
     if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").getValue() !== "") {
      oIBAN.setValueState("Error");
      var errorObj = JSON.parse(oError.response.body);
      var errorMsg = errorObj.error.message.value;
      oIBAN.setValueStateText(errorMsg);

     }
     // if (oGlobalIns.ChangeDeferred !== undefined && oGlobalIns.ChangeDeferred.state() !== "resolved") {
     //  oGlobalIns.ChangeDeferred.resolve();
     // }
    });
  },
  taxNumberChange: function(oEvent) {
   if (this.vCurrentEntity === "taxRB") {
    if (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB") {
     var oTaxNumber = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
     var oTaxType = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
     var taxNum = oTaxNumber.getValue();
     var taxLength = taxNum.length;

     var taxType = oTaxType.getValue();
     var taxTypeLen = taxType.length;
     if (taxTypeLen === 0) {
      oTaxNumber.setValueState("Error");
      oTaxNumber.setValueStateText(this.i18nBundle.getText("TAX_CAT_CHECK"));
     }
     if (taxLength === 0 && taxTypeLen !== 0 || taxLength === 0 && taxTypeLen === 0 || taxLength !== 0 && taxTypeLen !== 0) {
      oTaxNumber.setValueState("None");
     }
    }
   }
  },

  //Generic onChange method
  onChange: function(oEvent) {
   var oldValuePair = {};
   var matchProEntityName = "";
   //Tax Number Validation.
   if (this.vCurrentEntity === "taxRB") {
    if (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB") {
     var oTaxNumber = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
     var oTaxType = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
     var taxNum = oTaxNumber.getValue();
     var taxLength = taxNum.length;

     var taxType = oTaxType.getValue();
     var taxTypeLen = taxType.length;
     var oTaxNumState = oTaxNumber.getValueState();
     var oTaxTypeState = oTaxType.getValueState();

     if (taxType !== "" && taxNum.trim() !== "" && oTaxNumState !== "Error" && oTaxTypeState !== "Error") {
      this.oWizard.validateStep(this.getView().byId("editStep"));
     } else {
      this.oWizard.invalidateStep(this.getView().byId("editStep"));
     }
    }
   }

   if (this.vCurrentEntity !== "taxRB" && this.vCurrentEntity !== "BankRB" && this.getView().byId("editStep").getValidated() === false) {
    this.getView().byId("wizardId").validateStep(this.getView().byId("editStep"));
   }
   var newvalue = new Object();
   newvalue = {};
   if (oEvent.getSource()._sPickerType !== undefined) {
    newvalue.key = oEvent.getSource().getSelectedItem().getKey();
    newvalue.value = oEvent.getSource().getSelectedItem().getText();
    newvalue.entity = oEvent.getSource().sId.split("-")[1];
   } else {
    var elementID = oEvent.getSource().getId();
    oldValuePair.ID = elementID;
    if (document.getElementById(elementID + "-inner") !== null) {
     oldValuePair.value = document.getElementById(elementID + "-inner").getAttribute("value");
    } else {
     oldValuePair.value = "";
    }
    this.oOldValuePairModel.push(oldValuePair);
    newvalue.value = oEvent.getSource().getValue().trim();
    newvalue.entity = oEvent.getSource().sId.split("-")[1];
    // var elementID = oEvent.getSource().getId();
    // oldValuePair.ID = elementID;
    // oldValuePair.value = document.getElementById(elementID + "-inner").getAttribute("value");
    // this.oOldValuePairModel.push(oldValuePair);
   }
   matchProEntityName = newvalue.entity; //entity names in the MP of Dupl check is different in some cases
   switch (newvalue.entity) { //for each entity key formation will be different
    case 'BP_Address':
     var country = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
     if (country.getValueState() === "None" && country.getValue() !== "") {
      this.oWizard.validateStep(this.getView().byId("communicationStep"));
     } else {
      country.setValueState("Error");
      country.setValueStateText(this.i18nBundle.getText("BlnkCountryMSG"));
      this.oWizard.invalidateStep(this.getView().byId("communicationStep"));
     }
     this.selectedIndex = fcg.mdg.editbp.handlers.Communication.selectedIndex;
     var oBindingInfo = oEvent.getSource().mBindingInfos;
     if (oBindingInfo !== undefined && jQuery.isEmptyObject(oBindingInfo) === false) {
      newvalue.field = oBindingInfo.value.parts[0].path.slice(1);
     }
     if (this.vCurrentActionId === "changeRB") {
      this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + fcg.mdg.editbp.util.DataAccess.getCurrentModel().BP_AddressesRel
       .results[parseInt(this.selectedIndex)].AD_ID + "\')";
     }
     break;
    case 'BP_CommPhone':
    case 'BP_CommMobile':
    case 'BP_CommFax':
    case 'BP_CommURI':
    case 'BP_CommEMail':
     var currentModel = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
     var country = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
     var numDeepEntities = 0;
     if (country.getValueState() === "None" && country.getValue() !== "") {
      this.oWizard.validateStep(this.getView().byId("communicationStep"));
     }
     //for enable/disable Add/Cancel icon
     fcg.mdg.editbp.handlers.Communication.handleCommIconEnableDisable(newvalue.entity, oEvent.getSource().getId());

     newvalue.field = oEvent.getSource().mBindingInfos.value.parts[0].path.slice(1);

     if (this.vCurrentActionId === "changeRB") {
      this.selectedIndex = fcg.mdg.editbp.handlers.Communication.selectedIndex;
      if (currentModel.BP_AddressesRel.results.length === 0) {
       numDeepEntities = 0;
      } else {
       switch (newvalue.entity) {
        case 'BP_CommPhone':
         numDeepEntities = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numPhn;
         break;
        case 'BP_CommMobile':
         numDeepEntities = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numMob;
         break;
        case 'BP_CommFax':
         numDeepEntities = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numFax;
         break;
        case 'BP_CommURI':
         numDeepEntities = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numURI;
         break;
        case 'BP_CommEMail':
         for (var i = 0; i < fcg.mdg.editbp.handlers.Communication.aErrorStateFlag.length; i++) {
          if (fcg.mdg.editbp.handlers.Communication.aErrorStateFlag[i].split(":")[0] === oEvent.getSource().getId()) {
           fcg.mdg.editbp.handlers.Communication.aErrorStateFlag.splice(i, 1);
           i = i - 1;
          }
         }
         numDeepEntities = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numEmail;
         break;
       }
      }
     }
      if (oEvent.getSource().getId().split('-')[3] >= numDeepEntities) {
       newvalue.action = "N";
      }
      if (this.vCurrentActionId === "createRB") {
       newvalue.currentEntityKey = oEvent.getSource().getId().split('-')[3];
      } else if (newvalue.action === 'N' || newvalue.action === 'D') {
       var currentModel = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
       this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + currentModel.BP_AddressesRel.results[parseInt(this.selectedIndex)]
        .AD_ID + "\')";
       newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
       break;
      } else {
       newvalue.currentIndex =  oEvent.getSource().getId().split('-')[3];
      }
      if(this.vCurrentActionId === "changeRB"){
       this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + currentModel.BP_AddressesRel.results[parseInt(this.selectedIndex)]
       .AD_ID +
       "\',COMM_TYPE=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" + this.selectedIndex +
        "/" + newvalue.entity + "Rel/results/" + oEvent.getSource().getId().split('-')[3] + "/COMM_TYPE") +
       "\',CONSNUMBER=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" + this.selectedIndex +
        "/" + newvalue.entity + "Rel/results/" + oEvent.getSource().getId().split('-')[3] + "/CONSNUMBER") + "\')";
      }


     break;
    case 'BP_AddressVersionsPers':
    case 'BP_AddressVersionsOrg':
    case 'BP_AddressPersonVersion':
     var numDeepEntities;
     var tempEntity;
     var currentModel = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
     var country = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
     if (country.getValueState() === "None" && country.getValue() !== "") {
      this.oWizard.validateStep(this.getView().byId("communicationStep"));
     }
     this.selectedIndex = fcg.mdg.editbp.handlers.Communication.selectedIndex;
     if (oEvent.getSource().mBindingInfos.value !== undefined) {
      newvalue.field = oEvent.getSource().mBindingInfos.value.parts[0].path.slice(1);
      if(newvalue.entity === "BP_AddressPersonVersion"){
       newvalue.field = newvalue.field.split("/")[1]; //in order to get only the attribute from the deep entity          
      }
     } else {
      if (oEvent.getSource().getModel().getData().results[0].ATTR_NAME === "TITLE_KEY") {
       if(this.sCategory === "1"){
        oEvent.getSource().getModel().getData().results[0].ATTR_NAME = "TITLE_P";
       }else{
        oEvent.getSource().getModel().getData().results[0].ATTR_NAME = "TITLE";
       }
      }
      newvalue.field = oEvent.getSource().getModel().getData().results[0].ATTR_NAME
     }
     if (currentModel.BP_AddressesRel.results.length === 0) {
      numDeepEntities = 0;
     } else {
      numDeepEntities = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numIAV;
     }
     if (oEvent.getSource().getId().split('-')[3] >= numDeepEntities) {
      newvalue.action = "N";
     }
     if (this.vCurrentActionId === "createRB") {
      newvalue.currentEntityKey = oEvent.getSource().getId().split('-')[3];
     } else if (newvalue.action === 'N' || newvalue.action === 'D') {
      var currentModel = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
      this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + currentModel.BP_AddressesRel.results[parseInt(this.selectedIndex)]
       .AD_ID + "\')";
      newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
      break;
     }
     if (this.vCurrentActionId === "changeRB" && newvalue.action != "N") {
      if(newvalue.entity === "BP_AddressPersonVersion"){
       tempEntity = newvalue.entity;
       newvalue.entity = "BP_AddressVersionsPers";
      }
      this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + currentModel.BP_AddressesRel.results[parseInt(this.selectedIndex)]
       .AD_ID +
       "\',ADDR_VERS=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" + this.selectedIndex +
        "/" + newvalue.entity + "Rel/results/" + oEvent.getSource().getId().split('-')[3] + "/ADDR_VERS") + "\')";
      newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
      if(tempEntity === "BP_AddressPersonVersion"){
       newvalue.entity = tempEntity;
       tempEntity === "";
      }
     }
     break;
    case 'BP_Root':
    case 'BP_Organization':
    case 'BP_Person':
     this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ")";
     if (this.vCurrentEntity === "PersRB" || this.vCurrentEntity === "OrgRB") {
      fcg.mdg.editbp.handlers.GeneralData.setChangedArray(oEvent, newvalue, newvalue.entity, this);
      if (sap.ui.getCore().byId("SF-BP_Person-FName") !== undefined) {
       if (sap.ui.getCore().byId("SF-BP_Person-FName").getValue() === "") {
        this.oWizard.invalidateStep(this.getView().byId("requestStep"));
        return;
       } else {
        this.oWizard.validateStep(this.getView().byId("requestStep"));
       }
      } else {
       this.oWizard.validateStep(this.getView().byId("requestStep"));
      }
     } else {
      if (oEvent.getParameters().selectedItem !== undefined || oEvent.getSource()._sPickerType !== undefined) {
       newvalue.field = oEvent.getSource().getModel().getData().results[0].ATTR_NAME;
      } else {
       newvalue.field = oEvent.getSource().mBindingInfos.value.parts[0].path.slice(1);
      }
     }
     break;
    case 'BP_TaxNumber':
     if (oEvent.getParameters().selectedItem !== undefined || oEvent.getSource()._sPickerType !== undefined) {
      newvalue.field = oEvent.getSource().getModel().getData().results[0].ATTR_NAME;
     } else {
      newvalue.field = oEvent.getSource().mBindingInfos.value.parts[0].path.slice(1);
     }
     if (newvalue.field === "TAXNUMBER") {
      var vTaxNum = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
      var taxLength = taxNum.length;
      if (taxLength > 20) {
       newvalue.field = "TAXNUMXL";
      }
     }
     var vCurrentTaxType = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
     this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",TAXTYPE=" + "'" + vCurrentTaxType + "'" + ")";
     break;
    case 'BP_BankAccounts':
     if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue() !== "" &&
      sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").getValue() !== "" &&
      sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").getValue() !== "") {
      this.getView().byId("wizardId").validateStep(this.getView().byId("editStep"));
     } else {
      this.getView().byId("wizardId").invalidateStep(this.getView().byId("editStep"));
     }
     newvalue.field = oEvent.getSource().mBindingInfos.value.binding.sPath.slice(1);
     if (this.vCurrentActionId === "changeRB") {
      var selectedBankDetailID = fcg.mdg.editbp.handlers.BankAccount.oBankRslts.BP_BankAccountsRel.results[fcg.mdg.editbp.handlers.BankAccount
       .vSelectedIndex].BANKDETAILID;
      this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",BANKDETAILID=\'" + selectedBankDetailID + "\'" + ")";
     }
     matchProEntityName = "BP_BankAccount";
     break;
    case 'BP_IdentificationNumbersRel':
     if (oEvent.getParameters().newValue !== undefined) {
      newvalue.field = "IDENTIFICATIONNUMBER";
     }
     if (oEvent.getParameters().selectedItem !== undefined) {
      newvalue.field = "IDENTIFICATIONTYPE";
     }
     matchProEntityName = "BP_IdentificationNumber";
     break;
    case 'BP_RelationPARTNER':
    case 'BP_RelationPartner':
     if (oEvent.getParameters().selectedItem !== undefined || oEvent.getSource()._sPickerType !== undefined) {
      newvalue.field = "TITLE_KEY";
     }
     break;
    case 'BP_ContactPersonWorkplacesRel':
     var vFormattedValidDate;
     var addrIndex;
     var event = oEvent.getSource().getParent().getParent().getParent().getParent();
     if (oEvent.getSource().mBindingInfos.value !== undefined) {
      newvalue.field = oEvent.getSource().mBindingInfos.value.parts[0].path.slice(1);
     } else if (oEvent.getSource().getSelectedItem() !== undefined) {
      newvalue.field = "ADDRESS_NUMBER";
     }
     newvalue.wpKey = event.getId().split('-')[1];
     if (this.vCurrentActionId === "changeRB") {

      // Logic to determine the number of WP addresses present in Contact person excluding the addresses
      // marked for deletion also
      var numOfWPAddresses = 0;
      var count = 0;
      for (var i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length; i++) {
       if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[i].action !== undefined && fcg.mdg.editbp.handlers.ContactPersonChange
        .oWPResults[i].action === "D") {
        // count contains the number of address which have been marked for deletion
        count = count + 1;
       }
      }

      numOfWPAddresses = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length - count;

      //logic to access index of Address present in current form from the data taken from backend
      if (oEvent.getSource().getId().split('-')[3] >= numOfWPAddresses) {
       // fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length) {
       newvalue.action = "N";
      }

      if (newvalue.action === 'N') {
       var vSelectedRecord;
       if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
        vSelectedRecord = 0;
       } else {
        if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
         vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
        }
       }
       newvalue.cpIndex = vSelectedRecord;
       if (this.vTimedependency == "X"){
       vFormattedValidDate = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel
        .VALIDUNTILDATE;
       vFormattedValidDate = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(vFormattedValidDate);
       // Logic for Change contact person mobile , email ,phone and fax entities 
       newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
       newvalue.currentkey = "BP_ContactPersonCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPerson
        .oRelResults.BP_RelationsRel.
       results[vSelectedRecord].BP_RelationContactPersonRel.PARTNER1 +
        "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.
       results[vSelectedRecord].BP_RelationContactPersonRel.PARTNER2 +
        "\',RELATIONSHIPCATEGORY=\'" +
        fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.
       results[vSelectedRecord].BP_RelationContactPersonRel.RELATIONSHIPCATEGORY + "\',VALIDUNTILDATE=datetime\'" +
        escape(vFormattedValidDate) + "\')";
       } else {
       newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
       newvalue.currentkey = "BP_ContactPersonCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPerson
        .oRelResults.BP_RelationsRel.
       results[vSelectedRecord].BP_RelationContactPersonRel.PARTNER1 +
        "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.
       results[vSelectedRecord].BP_RelationContactPersonRel.PARTNER2 +
        "\',RELATIONSHIPCATEGORY=\'" +
        fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.
       results[vSelectedRecord].BP_RelationContactPersonRel.RELATIONSHIPCATEGORY + "\')";
       }
      } else {
       var id = "INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + newvalue.wpKey;
       var addrId = sap.ui.getCore().byId(id).getSelectedKey();
       for (var i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length; i++) {
        if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[i].ADDRESS_NUMBER === addrId) {
         addrIndex = i;
         break;
        }
       }
       newvalue.addrIndex = addrIndex;
       if (this.vTimedependency == "X"){
       vFormattedValidDate = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].VALIDUNTILDATE;
       vFormattedValidDate = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(vFormattedValidDate);
       newvalue.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
        .oWPResults[
         parseInt(addrIndex)].PARTNER1 +
        "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
        "\',RELATIONSHIPCATEGORY=\'" +
        fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
        fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',VALIDUNTILDATE=datetime\'" +
        escape(vFormattedValidDate) + "\')";
       // Logic for Change contact person mobile , email ,phone and fax entities
       } else {
       newvalue.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
        .oWPResults[
         parseInt(addrIndex)].PARTNER1 +
        "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
        "\',RELATIONSHIPCATEGORY=\'" +
        fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
        fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\')";
       }
      }
     }
     break;
    case 'BP_WorkplaceCommPhonesRel':
    case 'BP_WorkplaceCommMobilesRel':
    case 'BP_WorkplaceCommFaxesRel':
    case 'BP_WorkplaceCommEMailsRel':
    case 'BP_WorkplaceIntAddressVersRel':
    case 'BP_WorkplaceIntPersVersionRel':
     var wpIndex, addrIndex, vFormattedValidDate, newAddress, addArray = "";
     var event = oEvent.getSource().getParent().getParent().getParent().getParent();
     newvalue.currentEntityKey = oEvent.getSource().getId().split('-')[3];
     var vWPKey = oEvent.getSource().getId().split('-')[4];
     var vItemId = oEvent.getSource().getId().split('-')[3];
     //logic to access index of Address present in current form from the data taken from backend
     var id = "INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + vWPKey;
     var addrId = sap.ui.getCore().byId(id).getSelectedKey();
     if (this.isAddressVisited === "X" && this.vCurrentActionId === "createRB") {
      addArray = fcg.mdg.editbp.handlers.ContactPerson.oController.oDetailComm.BP_AddressesRel.results;

     } else if (this.vCurrentActionId === "createRB") {
      addArray = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults.BP_AddressesRel.results;

     } else {
      addArray = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults;

     }
     if (this.vCurrentActionId === "createRB") {
      for (var j = 0; j < addArray.length; j++) {
       if (addArray[j].AD_ID === addrId) {
        addrIndex = j;
        break;
       }
      }
     } else {
      for (var j = 0; j < addArray.length; j++) {
       if (addArray[j].ADDRESS_NUMBER === addrId) {
        addrIndex = j;
        break;
       }
      }
     }

     if (addrIndex === undefined) {
      var createAddrModel = fcg.mdg.editbp.handlers.Communication.oCreateModel;
      for (var k = 0; k < createAddrModel.length; k++) {
       if (createAddrModel[k].body.AD_ID === addrId) {
        addrIndex = addArray.length + k;
        break;
       }
      }
     }

     newvalue.addrIndex = addrIndex;

     if (newvalue.entity === "BP_WorkplaceIntPersVersionRel" || newvalue.entity === "BP_WorkplaceIntAddressVersRel") {
      wpIndex = event.getParent().getParent().getParent().getParent().getParent().getId();
      wpIndex = wpIndex.split("-")[1];
      newvalue.wpKey = wpIndex;
     } else {
      newvalue.wpKey = event.getId().split('-')[1];
     }

     if (newvalue.entity === "BP_WorkplaceIntPersVersionRel" && oEvent.getParameters().selectedItem !== undefined) {
      newvalue.field = "TITLE_P";
     } else if (newvalue.entity === "BP_WorkplaceIntAddressVersRel" && oEvent.getSource()._sPickerType !== undefined) {
      newvalue.field = "ADDR_VERS";
     } else {
      newvalue.field = this.getFieldValue(oEvent);
     }

     // Check if the record is being created for a new address
     if ((oEvent.getSource().getId().split('-')[4] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length) && this.vCurrentActionId ===
      "changeRB") {
      newAddress = "N";
      newvalue.action = "N";
      newvalue.addrIndex = newvalue.wpKey;
      var vSelectedRecord;
      if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
       vSelectedRecord = 0;
      } else {
       if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
        vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
       }
      }
      newvalue.cpIndex = vSelectedRecord;
      // newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
     }
     if (this.vCurrentActionId === "changeRB" && newAddress !== "N") {
      // Update the action field for different entities
      switch (newvalue.entity) {
       case 'BP_WorkplaceCommPhonesRel':
        if (oEvent.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommPhonesRel
         .results.length) {
         newvalue.action = "N";
        }
        break;
       case 'BP_WorkplaceCommMobilesRel':
        if (oEvent.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommMobilesRel
         .results.length) {
         newvalue.action = "N";
        }
        break;
       case 'BP_WorkplaceCommFaxesRel':
        if (oEvent.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommFaxesRel
         .results.length) {
         newvalue.action = "N";
        }
        break;
       case 'BP_WorkplaceCommEMailsRel':
        if (oEvent.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommEMailsRel
         .results.length) {
         newvalue.action = "N";
        }
        break;
       case 'BP_WorkplaceIntAddressVersRel':
       case 'BP_WorkplaceIntPersVersionRel':
        // addrIndex = oEvent.getSource().getId().split('-')[1];
        if (oEvent.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceIntAddressVersRel
         .results.length) {
         newvalue.action = "N";
        }
        break;
      }
      vFormattedValidDate = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].VALIDUNTILDATE;
      vFormattedValidDate = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(vFormattedValidDate);
      if (newvalue.entity === 'BP_WorkplaceCommPhonesRel' || newvalue.entity === 'BP_WorkplaceCommMobilesRel' || newvalue.entity ===
       'BP_WorkplaceCommFaxesRel' ||
       newvalue.entity === 'BP_WorkplaceCommEMailsRel') {
       if (newvalue.action === 'N' || newvalue.action === 'D') {
        // Logic for Change contact person mobile , email ,phone and fax entities 
        newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
        if (this.vTimedependency == "X"){
        newvalue.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
         .oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',VALIDUNTILDATE=datetime\'" +
         escape(vFormattedValidDate) + "\')";
        } else {
        newvalue.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
         .oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\')";
        }
       } else {
        var vQueryEntity;
        if (newvalue.entity === 'BP_WorkplaceCommFaxesRel') {
         vQueryEntity = newvalue.entity.substring(0, newvalue.entity.length - 5) + "Collection";
        } else {
         vQueryEntity = newvalue.entity.substring(0, newvalue.entity.length - 4) + "Collection";
        }
        if (this.vTimedependency == "X"){
        newvalue.currentkey = vQueryEntity + "(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
         .oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',COMM_TYPE=\'" +
         fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
          newvalue.entity + "/results/" + vItemId + "/COMM_TYPE") + "\',CONSNUMBER=\'" +
         fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
          newvalue.entity + "/results/" + vItemId + "/CONSNUMBER") + "\',VALIDUNTILDATE=datetime\'" + escape(vFormattedValidDate) +
         "\')";
        // Logic for Change contact person mobile , email ,phone and fax entities 
        } else {
        newvalue.currentkey = vQueryEntity + "(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
         .oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',COMM_TYPE=\'" +
         fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
          newvalue.entity + "/results/" + vItemId + "/COMM_TYPE") + "\',CONSNUMBER=\'" +
         fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
          newvalue.entity + "/results/" + vItemId + "/CONSNUMBER") + "\')";
        }
       }

      } else if (newvalue.entity === 'BP_WorkplaceIntAddressVersRel') {
       if (newvalue.action === 'N' || newvalue.action === 'D') {
        // Logic for Change contact person mobile , email ,phone and fax entities 
        newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
        if (this.vTimedependency == "X"){
        newvalue.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
         .oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',VALIDUNTILDATE=datetime\'" +
         escape(vFormattedValidDate) + "\')";
        } else {
        newvalue.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
         .oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\')";
        }
       } else {
        if (this.vTimedependency == "X"){
        newvalue.currentkey = "BP_WorkplaceIntAddressVersCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers
         .ContactPersonChange.oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',ADDR_VERS=\'" +
         fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
          newvalue.entity + "/results/" + vItemId + "/ADDR_VERS") + "\',VALIDUNTILDATE=datetime\'" +
         escape(vFormattedValidDate) + "\')";
        // Logic for Change contact person mobile , email ,phone and fax entities
        } else {
        newvalue.currentkey = "BP_WorkplaceIntAddressVersCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers
         .ContactPersonChange.oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',ADDR_VERS=\'" +
         fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
          newvalue.entity + "/results/" + vItemId + "/ADDR_VERS") + "\')";
        }
       }
      } else if (newvalue.entity === 'BP_WorkplaceIntPersVersionRel') {
       var oPARTNER2 = {};
       var index;
       if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
        var length = fcg.mdg.editbp.handlers.ContactPerson.oController.vCurrentSelectdDataId.length;
        index = fcg.mdg.editbp.handlers.ContactPerson.oController.vCurrentSelectdDataId.substring(length - 1, length);
       } else {
        index = 0;
       }
       // get the Contact person index which was selected
       var bpguid = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[index].BP_GUID2;
       bpguid = bpguid.replace(/-/g, '');
       //Choose the record of appropriate PARTNER 2

       for (i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.ocpAddressRslts.length; i++) {
        if (fcg.mdg.editbp.handlers.ContactPersonChange.ocpAddressRslts[i].PARTNER === fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
          parseInt(addrIndex)].PARTNER2) {
         oPARTNER2 = fcg.mdg.editbp.handlers.ContactPersonChange.ocpAddressRslts[i];
         break;
        }

       }

       if (newvalue.action === 'N') {
        // Logic for Change contact person mobile , email ,phone and fax entities 
        newvalue.createdIndex = oEvent.getSource().getId().split('-')[3];
        if (this.vTimedependency == "X"){
        newvalue.currentkey = "(BP_GUID=binary'" + bpguid + "',PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',VALIDUNTILDATE=datetime\'" +
         escape(vFormattedValidDate) + "\')";
        } else {
        newvalue.currentkey = "(BP_GUID=binary'" + bpguid + "',PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
          parseInt(addrIndex)].PARTNER1 +
         "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
         "\',RELATIONSHIPCATEGORY=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\')";
        }

       } else {
        //Here the 0th entry of results is choosen as BP_AddressesRel of PARTNER 2 will always have one entry which is of standard address
        newvalue.currentkey = "BP_PersonVersionCollection(BP_GUID=binary'" + bpguid + "',AD_ID=\'" +
         oPARTNER2.BP_AddressesRel.results[0].AD_ID + "\',ADDR_VERS=\'" +
         fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
          "BP_WorkplaceIntAddressVersRel/results/" + vItemId + "/ADDR_VERS") + "\')";
        // Logic for Change contact person mobile , email ,phone and fax entities 
       }
      }

     }
     break;
   }

   var oMatchPro = fcg.mdg.editbp.util.DataAccess.aMatchProMandt;
   var oDupEntryDone = 0;
   var oDupCheckEntry = {};
   for (var i = 0; i < oMatchPro.length; i++) {
    if (oMatchPro[i].entity === matchProEntityName && oMatchPro[i].attr === newvalue.field) {
     oDupCheckEntry.entity = matchProEntityName;
     oDupCheckEntry.attribute = newvalue.field;
     oDupCheckEntry.value = newvalue.value;
     if (this.vCurrentActionId === "createRB") {
      oDupCheckEntry.createdIndex = this.getNewRecordIndex(newvalue.entity);
     }
     if (this.vCurrentActionId === "changeRB" || matchProEntityName === "BP_Organization" || matchProEntityName === "BP_Person") {
      oDupCheckEntry.entityKey = this.currentEntityKey.substr(1).slice(0, -1).split("=").join("-").split("\'").join("").replace(
       "binary", "");
     }
     for (var j = 0; j < this.oDupCheckData.length; j++) {
      if (oDupCheckEntry.entity === this.oDupCheckData[j].entity && oDupCheckEntry.attribute === this.oDupCheckData[j].attribute) {
       if ((this.vCurrentActionId === "changeRB" && oDupCheckEntry.entityKey === this.oDupCheckData[j].entityKey) ||
        (this.vCurrentActionId === "createRB" && oDupCheckEntry.createdIndex === this.oDupCheckData[j].createdIndex)) {
        this.oDupCheckData[j].value = oDupCheckEntry.value;
        oDupEntryDone = 1;
        oDupCheckEntry = {};
        break;
       }
      }
     }

     if (oDupEntryDone === 0) {
      this.oDupCheckData.push(oDupCheckEntry);
     } else {
      oDupEntryDone === 0;
     }
     oDupCheckEntry = {};
    }
   }

   if (this.vCurrentActionId === "createRB") {
    for (var j = 0; j < this.createdArray.length; j++) {
     if (this.createdArray[j].field == newvalue.field && this.createdArray[j].entity == newvalue.entity && this.createdArray[j].currentEntityKey ==
      newvalue.currentEntityKey && this.createdArray[j].wpKey == newvalue.wpKey) {
      if (oEvent.getSource()._sPickerType !== undefined) {
       this.createdArray[j].key = newvalue.key;
       this.createdArray[j].value = newvalue.value;
      } else {
       this.createdArray[j].value = newvalue.value;
      }
      return;
     }
    }
    this.createdArray.push(newvalue);
   } else if (this.vCurrentActionId === "changeRB") {
    if (this.vCurrentEntity === "communicationRB") {
     newvalue.entityKey = this.currentEntityKey;
    }
    for (var i = 0; i < this.changedArray.length; i++) {
     if (this.changedArray[i].field == newvalue.field && this.changedArray[i].entity == newvalue.entity && this.changedArray[i].createdIndex ==
      newvalue.createdIndex && newvalue.createdIndex !== undefined) {
      if (oEvent.getParameters().selectedItem !== undefined) {
       this.changedArray[i].key = newvalue.key;
       this.changedArray[i].value = newvalue.value;
      } else {
       this.changedArray[i].value = newvalue.value;
      }
      return;
     }
    }
    this.changedArray.push(newvalue);
   }

   /**
    * @ControllerHook To Perform the Checks for handling change event
    * If the customer adds 
    * @callback Controller~extWizardOnChange
    * @param {object} this Controller Instance
    * @param {object} change event instance
    * @param {object} match profile for duplicate check
    * @return { }
    */
   if (this.extWizardOnChange() !== undefined) {
    this.extWizardOnChange(this, oEvent, oMatchPro);
   }
  },

  onBankAccountChange: function(oControlEvent) {
   if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
    this.onChange(oControlEvent);
    // fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "";
   } else {
    var oGlobalIns = this;
    oGlobalIns.onChange(oControlEvent);
    fcg.mdg.editbp.handlers.BankAccount._deriveIban("SF-BP_BankAccounts-Txt_BANK_ACCT", oControlEvent, oGlobalIns);
   }
  },

  setDuplCheckModel: function() {
   var tempDuplModel = (JSON.parse(JSON.stringify(this.oDupCheckData)));;
   var oDupCheckEntry = [];
   this.oDupCheckFinalData = [];
   for (var i = 0; i < tempDuplModel.length;) {
    this.oDupCheckFinalData.push(tempDuplModel[i]);
    for (var j = i + 1; j < tempDuplModel.length;) {
     if (tempDuplModel[i].entity === tempDuplModel[j].entity &&
      ((tempDuplModel[j].entityKey === tempDuplModel[j].entityKey && tempDuplModel[j].entityKey !== undefined) ||
       tempDuplModel[i].createdIndex === tempDuplModel[j].createdIndex && tempDuplModel[j].createdIndex !== undefined)) {

      this.oDupCheckFinalData.push(tempDuplModel[j]);
      tempDuplModel.splice(j, 1);
     } else {
      j++;
     }
    }
    tempDuplModel.splice(i, 1);
   }

  },
  checkDuplicates: function() {
   var filterQuery = "";
   this.setDuplCheckModel();
   for (var i = 0; i < this.oDupCheckFinalData.length;) {
    filterQuery = filterQuery + "(EntityType eq \'" + this.oDupCheckFinalData[i].entity + "\'" +
     " and Attribute eq \'" + this.oDupCheckFinalData[i].attribute + "\'" +
     " and CharacteristicValue eq \'" + this.oDupCheckFinalData[i].value + "\'";
    if (this.oDupCheckFinalData[i].createdIndex === undefined) {
     filterQuery = filterQuery + " and KeyValue eq \'" + this.oDupCheckFinalData[i].entityKey + "\')";
    } else {
     filterQuery = filterQuery + " and KeyValue eq \'" + "\' and ParentKeys eq \'BP_GUID-" + this.sItemPath.replace("binary", "").replace(
      "\'", "") + ")";
    }
    i++;
    if (i < this.oDupCheckFinalData.length) {
     filterQuery = filterQuery + " and ";
    } else {
     filterQuery = filterQuery + " or ";
     break;
    }

    // }
   }
   filterQuery = filterQuery + "(KeyValue eq " + this.sItemPath.replace("binary", "") + ")";

   var path = "DuplicateCollection?$filter=" + jQuery.sap.encodeURL(filterQuery);
   if (this.vMaxDupRec !== undefined) {
    var maxRecFilter = "&$top=" + this.vMaxDupRec;
    path = path + maxRecFilter;
   }
   var oBatchModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
   var mheaders = {};
   oBatchModel.getHeaders(mheaders);
   mheaders.SEARCH_MODE = "DB"
   oBatchModel.setHeaders(mheaders);
   var aBatchOperation = [];
   var oBatchOperation1 = oBatchModel.createBatchOperation(path, "GET");
   aBatchOperation.push(oBatchOperation1);
   oBatchModel.clearBatch();
   oBatchModel.addBatchReadOperations(aBatchOperation);
   aBatchOperation = [];
   var that = this;
   oBatchModel.submitBatch(function(odata, response) {
    that.oDuplicatesResult = odata.__batchResponses;
   }, null, false);
   oBatchModel.clearBatch();
  },

  onWizardComplete: function() {
   //set the Review page title
   this.getView().byId("reviewtitle").setText(this.i18nBundle.getText("REVIEW", this.customerHeaderMsg));

   //clear this variable which is used for keeping count in change contact person
   fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
   var that = this;
   //used in cancel scenario when review page has data
   if (this.vCancelFlag) {
    this.vCancelFlag = false;
    this._oNavContainer.to(this.getView().byId("idSummary"));
    return;
   }
   //checking the validation for PARTNER Id request is completed or not
   if (fcg.mdg.editbp.handlers.ContactPerson.vCpIdFlag) {
    fcg.mdg.editbp.handlers.ContactPerson.vCpIdFlag = false;
    fcg.mdg.editbp.handlers.ContactPerson.oPARTNERModel = "";
   } else {
    if (fcg.mdg.editbp.handlers.ContactPerson.oPARTNERModel !== undefined) {
     if (fcg.mdg.editbp.handlers.ContactPerson.oPARTNERModel !== "") {
      fcg.mdg.editbp.handlers.ContactPerson.oPARTNERModel.attachRequestCompleted(fcg.mdg.editbp.handlers.ContactPerson.handleRequestCompleted());
      return;
     }
    }
   }
   //UI validations
   this.submitButtonState(); //to enable and disable the 
   this.oOldValuePairModel = [];
   this.getView().byId("idSubmit").setEnabled(true);
   var checkStatus = true;
   if (this.vCurrentEntity === "identificationRB" && this.vCurrentActionId === "createRB") {
    checkStatus = fcg.mdg.editbp.handlers.Identification.performUIValidations(this);
   }
   if (this.vCurrentEntity === "ContactPerRB" && (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB")) {
    checkStatus = fcg.mdg.editbp.handlers.ContactPerson.performUIValidations(this);
   }
   if (this.vCurrentEntity === "PersRB" && this.vCurrentActionId === "") {
    checkStatus = fcg.mdg.editbp.handlers.GeneralData.performUIValidations(this);
   }
   if (this.vCurrentEntity === "OrgRB" && this.vCurrentActionId === "") {
    checkStatus = fcg.mdg.editbp.handlers.GeneralData.performOrgUIValidations(this);
   }
   if (this.vCurrentEntity === "communicationRB" && (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB")) {
    checkStatus = fcg.mdg.editbp.handlers.Communication.performUIValidations(this);
   }
   if (fcg.mdg.editbp.handlers.Attachment.oUpload === true) {
    var errorDetails = this.i18nBundle.getText("ATTACH_UPLOAD")
    this.showErrorDialog(errorDetails);
    return;
   }
   if (checkStatus === false) {
    return;
   }

   //checking the validation for Region request is completed or not
   if (fcg.mdg.editbp.handlers.Communication.vRegionFlag) {
    fcg.mdg.editbp.handlers.Communication.vRegionFlag = false;
    fcg.mdg.editbp.handlers.Communication.oRegionModel = "";
   } else {
    if (fcg.mdg.editbp.handlers.Communication.oRegionModel !== undefined) {
     if (fcg.mdg.editbp.handlers.Communication.oRegionModel !== "") {
      fcg.mdg.editbp.handlers.Communication.oRegionModel.attachRequestCompleted(fcg.mdg.editbp.handlers.Communication.handleRequestCompleted());
      return;
     }
    }
   }
   //to check for duplicates                                                            
   this.oDuplicatesResult = "";
   if (this.oDupCheckData.length !== 0) {
    this.checkDuplicates();
   }
   var queryModel = {};

   switch (this.vCurrentEntity) {
    case "communicationRB":
     for (var i = 0; i < fcg.mdg.editbp.handlers.Communication.aErrorStateFlag.length; i++) {
      if (fcg.mdg.editbp.handlers.Communication.aErrorStateFlag[i].split(":")[1]) {
       return;
      }
     }
     fcg.mdg.editbp.handlers.Communication.createCommunicationDataModel(this);

     fcg.mdg.editbp.handlers.Communication.oEditIAVModel = "";
     break;
    case "taxRB":
     if (this.vCurrentActionId === "createRB") {
      this.createTax();
     } else if (this.vCurrentActionId === "changeRB") {
      this.changeTax();
     } else if (this.vCurrentActionId === "deleteRB") {
      this.deleteTax();
     }
     break;
    case "BankRB":
     if (this.vCurrentActionId != "deleteRB" && sap.ui.getCore().byId("BankForm") !== undefined) {
      //this.onBankKeyChange(null, false); // do validations and set error messages to text inputs,..

      if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue() === "" || sap.ui.getCore().byId(
        "SF-BP_BankAccounts-Txt_BANK_KEY").getValue() === "" || sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").getValue() ===
       "") {
       if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue() === "") {
        sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").setValueState("Error");
        sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").setValueStateText(this.i18nBundle.getText("BlnkCountryMSG"));
       }
       if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").getValue() === "") {
        sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").setValueState("Error");
        sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").setValueStateText(this.i18nBundle.getText("BlnkBankMSG"));
       }
       if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").getValue() === "") {
        sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").setValueState("Error");
        sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").setValueStateText(this.i18nBundle.getText("BlnkAccntMSG"));
       }
       return;
      }
      if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValueState() === "Error" || sap.ui.getCore().byId(
        "SF-BP_BankAccounts-Txt_BANK_KEY").getValueState() === "Error" || sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").getValueState() ===
       "Error" || sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").getValueState() === "Error") {
       return;
      }
     }
     fcg.mdg.editbp.handlers.BankAccount.createBankAccountsDataModel(this);
     break;
    case "identificationRB":
     fcg.mdg.editbp.handlers.Identification.createIdentificationDataModel(this);
     break;
    case "OrgRB":
    case "PersRB":
     fcg.mdg.editbp.handlers.GeneralData.createGenDataModel(this);
     break;
    case "ContactPerRB":
     fcg.mdg.editbp.handlers.ContactPerson.createCPDataModel(this, this.vCustomerID);
     fcg.mdg.editbp.handlers.ContactPerson.wpArray = [];
     fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = 0;
     fcg.mdg.editbp.handlers.ContactPerson.oIavFormId = 0;
     fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds = [];
     fcg.mdg.editbp.handlers.ContactPerson.vgIsLocked = "";
     break;
    default:
   }
   this.clearAllData();

   if (this.vCurrentActionId === "changeRB" && this.vCurrentEntity === "Communincation") {
    var currentChanges = (JSON.parse(JSON.stringify(this.changedArray)));
    var changesetPrepare = (JSON.parse(JSON.stringify(this.changedArray)));;
    var updatedData;
    var vTaxTypeNum;
    for (var i = 0; i < currentChanges.length;) {
     updatedData = "{";
     queryModel.header = currentChanges[i].entityKey;
     queryModel.entity = currentChanges[i].entity;
     if (currentChanges[i].key !== undefined) {
      updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].key + "\",";
     } else {
      var vTaxNum = "";
      if (this.vCurrentEntity === "taxRB") {
       var vTaxTyp = queryModel.header.split(",")[1];
       vTaxTypeNum = vTaxTyp.substring(2, 3);
       if (currentChanges[i].field == "5") {
        updatedData = updatedData + "\"" + "TAXNUMXL" + "\":\"" + currentChanges[i].value + "\",";
       } else {
        if (currentChanges[i].value.length > 20) {
         if (vTaxTypeNum !== "0") {
          vTaxNum = currentChanges[i].value.substring(0, 20);
          updatedData = updatedData + "\"" + "TAXNUMBER" + "\":\"" + vTaxNum + "\",";
         } else {
          updatedData = updatedData + "\"" + "TAXNUMXL" + "\":\"" + currentChanges[i].value + "\",";
         }
        } else {
         updatedData = updatedData + "\"" + "TAXNUMBER" + "\":\"" + currentChanges[i].value + "\",";
        }
       }
      } else {
       updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].value + "\",";
      }
     }
     for (var j = i + 1; j < currentChanges.length;) {
      if (currentChanges[i].entity === currentChanges[j].entity & currentChanges[i].entityKey === currentChanges[j].entityKey) {
       if (currentChanges[i].key !== undefined) {
        updatedData = updatedData + "\"" + currentChanges[j].field + "\":\"" + currentChanges[j].value + "\",";
       } else {
        var keyFieldOther = currentChanges[j].field + "__TXT";
        updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].key + "\"," + "\"" + keyFieldOther +
         "\":\"" + currentChanges[i].value + "\",";
       }
       currentChanges.splice(j, 1);
      } else {
       j++;
      }
     }
     currentChanges.splice(i, 1);
     updatedData = updatedData.substring(0, updatedData.length - 1) + "}";
     queryModel.body = JSON.parse(updatedData);
     this.finalQueryModel.push(queryModel);
     queryModel = {};
    }
    var newChangeSet = {};
    var changeSet = [];
    for (var k = 0; k < changesetPrepare.length; k++) {
     newChangeSet.Entity = changesetPrepare[k].entity;
     if (changesetPrepare[k].key !== undefined) {
      newChangeSet.Attribute = changesetPrepare[k].field + "__TXT";
     } else {
      newChangeSet.Attribute = changesetPrepare[k].field;
     }

     newChangeSet.EntityAction = "U";
     newChangeSet.NewValue = changesetPrepare[k].value;
     changeSet.push(newChangeSet);
     newChangeSet = {};

     if (changesetPrepare[k].key !== undefined) {
      var keyField = changesetPrepare[k].field;
      newChangeSet.Entity = changesetPrepare[k].entity;
      newChangeSet.Attribute = keyField;
      newChangeSet.EntityAction = "U";
      newChangeSet.NewValue = changesetPrepare[k].key;
      changeSet.push(newChangeSet);
      newChangeSet = {};
     }
    }
    if (this.oCommunicationLayout !== "") {
     this.oCommunicationLayout.destroy();
    }
    if (this.vCurrentEntity === "taxRB") {
     var taxdesc = this.changedData.TAXTYPE__TXT;
     var taxkey = this.changedData.TAXTYPE;
     var vCat = fcg.mdg.editbp.util.Formatter.getKeyDesc(taxkey, taxdesc);
     if (this.changedData.TAXNUMBER !== '' && this.changedData.TAXNUMBER !== undefined) {
      this.changedData.TAXNUMXL = this.changedData.ChangeSets[0].NewValue;
     }
     if (this.changedData.TAXNUMXL === '') {
      for (var n = 0; n < changesetPrepare.length; n++) {
       if (changesetPrepare[n].field === "TAXNUMXL") {
        this.changedData.TAXNUMXL = changesetPrepare[n].value;
       }
      }
     }
    }
   }
   //this will be for craete of address
   if (this.vCurrentEntity === "communicationRB") {
    if (this.vCurrentActionId === "createRB") {
     this.changedData = fcg.mdg.editbp.handlers.Communication.addresscrtModel;
    } else if (this.vCurrentActionId === "deleteRB") {
     // this.changedData = this.addressDeletedModel;
     this.changedData = fcg.mdg.editbp.handlers.Communication.addressdelModel;
    } else if (this.vCurrentActionId === "changeRB") {
     this.changedData = fcg.mdg.editbp.handlers.Communication.addresschnModel;
    }
   }
   var oModel = new sap.ui.model.json.JSONModel();
   oModel.setData(this.changedData);

   this.summaryofRequest();
   if (this.vCurrentEntity === "communicationRB") {
    this.getView().byId("addrsCommnctnLayout").setVisible(true);
    var layout = "";
    this.CommDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispAddress", this);
    if (this.reEdit !== "X") {
     if (this.vCurrentActionId === "createRB") {
      layout = this._oNavContainer.getPages()[1].getContent()[2].getContent()[0];
      layout.addContent(this.CommDisplayFragment);
     } else if (this.vCurrentActionId === "changeRB") {
      layout = this._oNavContainer.getPages()[1].getContent()[2].getContent()[1];
      var index = "";
      if (sap.ui.getCore().byId("selectDataListRBG") === undefined) {
       index = 0;
      } else {
       index = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
      }
      var vAdText = "";
      if (fcg.mdg.editbp.handlers.Communication.addresschnModel.COUNTRY === "US") {
       vAdText = fcg.mdg.editbp.handlers.Communication.addresschnModel.HOUSE_NO + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel
        .STREET + " / " + fcg.mdg.editbp.handlers.Communication.addresschnModel.CITY + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel
        .REGION + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel.POSTL_COD1;
      } else {
       vAdText = fcg.mdg.editbp.handlers.Communication.addresschnModel.STREET + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel
        .HOUSE_NO + " / " + fcg.mdg.editbp.handlers.Communication.addresschnModel.POSTL_COD1 + " " + fcg.mdg.editbp.handlers.Communication
        .addresschnModel.CITY;
      }

      fcg.mdg.editbp.handlers.Communication.addresschnModel.AD_ID__TXT = vAdText;
      var addressModel = fcg.mdg.editbp.handlers.Communication.addresschnModel;
      var vedit = addressModel.EDIT;
      var vindex = addressModel.INDEX - 1;
      var vSrecord = addressModel.SelectIndex;
      if (vedit === "X") {
       // layout.getContent()[vindex];
       layout.insertContent(this.CommDisplayFragment, vindex);
       var tempLayout = layout.removeContent(layout.getContent()[vindex + 1]);
       tempLayout.destroy();
      } else {
       layout.addContent(this.CommDisplayFragment);
       addressModel["EDIT"] = "X";
      }
      this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.Communication.addresschnModel.AD_ID);
     } else if (this.vCurrentActionId === "deleteRB") {
      layout = this._oNavContainer.getPages()[1].getContent()[2].getContent()[2];
      this.CommDisplayFragment.getToolbar().getContent()[3].setVisible(true);
      layout.addContent(this.CommDisplayFragment);
     }

     layout.setVisible(true);
     fcg.mdg.editbp.handlers.Communication.setCommlayout(layout);
    } else {
     var vReEditFragmnt = this.reEditSource.getParent().getParent().getParent();
     var vReEditLayout = vReEditFragmnt.getParent();
     vReEditLayout.getContent()[vReEditLayout.indexOfContent(vReEditFragmnt)].destroy();
     this.CommDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispAddress", this);
     vReEditLayout.insertContent(this.CommDisplayFragment, vReEditLayout.indexOfContent(
      vReEditFragmnt));
     if (this.vCurrentActionId === "createRB") {
      this.changedData = fcg.mdg.editbp.handlers.Communication.oReEditCrtModel;
      layout = this.getView().byId("addrsCommnCreateLayout");
      layout.getContent()[fcg.mdg.editbp.handlers.Communication.vReEditIndex];
     } else if (this.vCurrentActionId === "changeRB") {
      this.changedData = fcg.mdg.editbp.handlers.Communication.oReEditChngModel;
      layout = this.getView().byId("addrsCommnChangeLayout");
      layout.getContent()[fcg.mdg.editbp.handlers.Communication.vReEditIndex];
     }
     fcg.mdg.editbp.handlers.Communication.setCommlayout(layout);
    }
    if (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB" || this.vCurrentActionId === "deleteRB") {
     var linebreak = new sap.ui.layout.GridData({
      linebreak: true
     });
     var vCommtitleFlagPh = false;
     var vCommtitleFlagMo = false;
     var vCommtitleFlagFx = false;
     var vCommtitleFlagEm = false;
     var vCommtitleFlagUr = false;
     var vIAVitleFlagOrg = false;
     var vIAVtitleFlagPers = false;
     var dataItemPhn = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommPhoneRel);
     if (dataItemPhn !== undefined && dataItemPhn.length > 0) {
      for (i in dataItemPhn){
        if(dataItemPhn[i].TELEPHONE !== undefined && dataItemPhn[i].TELEPHONE !== ""){
          vCommtitleFlagPh = true;
          break;
        }
      }
      // vCommtitleFlagPh = fcg.mdg.editbp.handlers.Communication.getCommFieldvalue(dataItemPhn[0].TELEPHONE);
      dataItemPhn = fcg.mdg.editbp.handlers.Communication.setCommDefaultCountry(dataItemPhn, oModel);
      fcg.mdg.editbp.handlers.Communication.displayCommunication(this, dataItemPhn,
       "{parts:[{path:'/COUNTRY'},{path:'/TELEPHONE'},{path:'/EXTENSION'}, {path:'/ChangeData/TELEPHONE'}, {path:'/ChangeData/EXTENSION'}],formatter:'fcg.mdg.editbp.util.Formatter.extensionWithNumber'}",
       this.i18nBundle.getText("Telephone"), "{path:'/TELEPHONE',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}",
       vCommtitleFlagPh);
     }
     var dataItemMob = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommMobileRel);
     if (dataItemMob !== undefined && dataItemMob.length > 0) {
      for (i in dataItemMob){
        if(dataItemMob[i].TELEPHONE !== undefined && dataItemMob[i].TELEPHONE !== ""){
          vCommtitleFlagMo = true;
          break;
        }
      }
      // vCommtitleFlagMo = fcg.mdg.editbp.handlers.Communication.getCommFieldvalue(dataItemMob[0].TELEPHONE);
      dataItemMob = fcg.mdg.editbp.handlers.Communication.setCommDefaultCountry(dataItemMob, oModel);
      fcg.mdg.editbp.handlers.Communication.displayCommunication(this, dataItemMob,
       "{parts: [{path:'/COUNTRY'},{path: '/TELEPHONE'}, {path:'/ChangeData/TELEPHONE'}], formatter: 'fcg.mdg.editbp.util.Formatter.mobNumber'}",
       this.i18nBundle.getText("Mobile"), "{path:'/TELEPHONE',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}",
       vCommtitleFlagMo);
     }
     var dataItemFax = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommFaxRel);
     if (dataItemFax !== undefined && dataItemFax.length > 0) {
      for (i in dataItemFax){
        if(dataItemFax[i].FAX !== undefined && dataItemFax[i].FAX !== ""){
          vCommtitleFlagFx = true;
          break;
        }
      }
      // vCommtitleFlagFx = fcg.mdg.editbp.handlers.Communication.getCommFieldvalue(dataItemFax[0].FAX);
      dataItemFax = fcg.mdg.editbp.handlers.Communication.setCommDefaultCountry(dataItemFax, oModel);
      fcg.mdg.editbp.handlers.Communication.displayCommunication(this, dataItemFax,
       "{parts:[{path:'/COUNTRY'},{path:'/FAX'},{path:'/EXTENSION'},{path:'/ChangeData/FAX'},{path:'/ChangeData/EXTENSION'}],formatter:'fcg.mdg.editbp.util.Formatter.extensionWithNumber'}",
       this.i18nBundle.getText("Fax"), "{path:'/FAX',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}",
       vCommtitleFlagFx);
     }
     var dataItemEmail = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommEMailRel);
     if (dataItemEmail !== undefined && dataItemEmail.length > 0) {
      for (i in dataItemEmail){
        if(dataItemEmail[i].E_MAIL !== undefined && dataItemEmail[i].E_MAIL !== ""){
          vCommtitleFlagEm = true;
          break;
        }
      }
      // vCommtitleFlagEm = fcg.mdg.editbp.handlers.Communication.getCommFieldvalue(dataItemEmail[0].E_MAIL);
      fcg.mdg.editbp.handlers.Communication.displayCommunication(this, dataItemEmail,
       "{parts: [{path: '/E_MAIL'}, {path:'/ChangeData/E_MAIL'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}", this.i18nBundle
       .getText("Email Address"), "{path:'/E_MAIL',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}",
       vCommtitleFlagEm);
     }
     var dataItemURI = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommURIRel);
     if (dataItemURI !== undefined && dataItemURI.length > 0) {
      for (i in dataItemURI){
        if(dataItemURI[i].URI !== undefined && dataItemURI[i].URI !== ""){
          vCommtitleFlagUr = true;
          break;
        }
      }
      // vCommtitleFlagUr = fcg.mdg.editbp.handlers.Communication.getCommFieldvalue(dataItemURI[0].URI);
      fcg.mdg.editbp.handlers.Communication.displayCommunication(this, dataItemURI,
       "{parts: [{path: '/URI'}, {path:'/ChangeData/URI'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}", this.i18nBundle
       .getText("WEB"), "{path:'/URI',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}",
       vCommtitleFlagUr);
     }
     var dataItemIavOrg = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_AddressVersionsOrgRel);
     if (dataItemIavOrg !== undefined && dataItemIavOrg.length > 0) {
      vIAVitleFlagOrg = true;
      fcg.mdg.editbp.handlers.Communication.displayIAV(dataItemIavOrg, this);
     }
     var dataItemIavPers = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_AddressVersionsPersRel);
     if (dataItemIavPers !== undefined && dataItemIavPers.length > 0) {
      vIAVtitleFlagPers = true;
      fcg.mdg.editbp.handlers.Communication.displayIAV(dataItemIavPers, this);
     }
     if (!vCommtitleFlagPh && !vCommtitleFlagMo && !vCommtitleFlagFx && !vCommtitleFlagEm && !vCommtitleFlagUr) {
      fcg.mdg.editbp.handlers.Communication.setDispAddressTitle(this, this.i18nBundle.getText("Communication"));
     }
     if (!vIAVitleFlagOrg && !vIAVtitleFlagPers) {
      fcg.mdg.editbp.handlers.Communication.setDispAddressTitle(this, this.i18nBundle.getText("IAV"));
     }
     this.CommDisplayFragment.setModel(oModel);
     // oModel.refresh();
     // this.CommDisplayFragment.rerender();
     // oModel.refresh();

     var that = this;
     function afterNavFn() {
      that._oNavContainer.detachAfterNavigate(afterNavFn);
      for(var i in that.CommDisplayFragment.getParent().getContent()) {
       that.CommDisplayFragment.getParent().getContent()[i].getModel().refresh();
       that.CommDisplayFragment.getParent().getContent()[i].rerender();
       that.CommDisplayFragment.getParent().getContent()[i].getModel().refresh();
      }

     };

     that._oNavContainer.attachAfterNavigate(afterNavFn);

    }
    fcg.mdg.editbp.handlers.Communication.setDispAddressTitle(this, "address");

   } else if (this.vCurrentEntity === "BankRB") {
    if (fcg.mdg.editbp.handlers.BankAccount.getBankModel() !== undefined && this.reEdit !== "X") {
     var oBankDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DisplayBank", this);
     this._oNavContainer.getPages()[1].getContent()[3].setVisible(true);
     if (this.vCurrentActionId === "createRB") {
      this._oNavContainer.getPages()[1].getContent()[3].getContent()[0].setVisible(true);
      this._oNavContainer.getPages()[1].getContent()[3].getContent()[0].addContent(oBankDisplayFragment);
      oBankDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
      oBankDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
     } else if (this.vCurrentActionId === "changeRB") {
      var vedit = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().EDIT;
      var vindex = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().INDEX;
      var vSrecord = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().SelectIndex;
      this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].setVisible(true);
      if (vedit === "X") {
       var vBank = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().BANKDETAILID;
       var vFrgIndx = fcg.mdg.editbp.handlers.BankAccount.aChangedBanks.indexOf(vBank);
       oBankDisplayFragment = this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].getContent()[vFrgIndx];
       // oBankDisplayFragment = this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].getContent()[vindex];
      } else {
       this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].addContent(oBankDisplayFragment);
       oBankDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
       oBankDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
       fcg.mdg.editbp.handlers.BankAccount.oBankRslts.BP_BankAccountsRel.results[vSrecord]["EDIT"] = "X";
      }
      this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().BANKDETAILID);
     } else if (this.vCurrentActionId === "deleteRB") {
      oBankDisplayFragment.getToolbar().getContent()[3].setVisible(false);
      this._oNavContainer.getPages()[1].getContent()[3].getContent()[2].setVisible(true);
      this._oNavContainer.getPages()[1].getContent()[3].getContent()[2].addContent(oBankDisplayFragment);
      oBankDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
      oBankDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
     }
     oBankDisplayFragment.setModel(fcg.mdg.editbp.handlers.BankAccount.getBankModel(), "Bank");
    } else {
     if (this.vCurrentActionId === "createRB") {
      var oReEdtMdl = fcg.mdg.editbp.handlers.BankAccount.oReEditModel;
      this._oNavContainer.getPages()[1].getContent()[3].getContent()[0].getContent()[fcg.mdg.editbp.handlers.BankAccount.vReEditIndex]
       .setModel(oReEdtMdl, "Bank");
     } else if (this.vCurrentActionId === "changeRB") {
      var oReEdtChMdl = fcg.mdg.editbp.handlers.BankAccount.oReEditChngModel;
      this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].getContent()[fcg.mdg.editbp.handlers.BankAccount.vReEditIndex]
       .setModel(oReEdtChMdl, "Bank");
     }
    }
   } else if (this.vCurrentEntity === "identificationRB") {
    if (fcg.mdg.editbp.handlers.Identification.getIDModel() !== undefined && this.reEdit !== "X") {
     var oIDDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispIdentification", this);
     this._oNavContainer.getPages()[1].getContent()[4].setVisible(true);
     if (this.vCurrentActionId === "createRB") {
      this._oNavContainer.getPages()[1].getContent()[4].getContent()[0].setVisible(true);
      this._oNavContainer.getPages()[1].getContent()[4].getContent()[0].addContent(oIDDisplayFragment);
      oIDDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
      oIDDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
      oIDDisplayFragment.setModel(fcg.mdg.editbp.handlers.Identification.getIDModel(), "ID");
     } else if (this.vCurrentActionId === "deleteRB") {
      this._oNavContainer.getPages()[1].getContent()[4].getContent()[1].setVisible(true);
      this._oNavContainer.getPages()[1].getContent()[4].getContent()[1].addContent(oIDDisplayFragment);
      oIDDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
      oIDDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
      oIDDisplayFragment.setModel(fcg.mdg.editbp.handlers.Identification.getDeletedIDModel(), "ID");
     }
    } else {
     var oReEdtMdl = fcg.mdg.editbp.handlers.Identification.oReEditModel;;
     this._oNavContainer.getPages()[1].getContent()[4].getContent()[0].getContent()[fcg.mdg.editbp.handlers.Identification.vReEditIndex]
      .setModel(oReEdtMdl, "ID");
    }
   } else if (this.vCurrentEntity === "ContactPerRB") {
    if (fcg.mdg.editbp.handlers.ContactPerson.getCPModel() !== undefined && this.reEdit !== "X") {
     var cpData = fcg.mdg.editbp.handlers.ContactPerson.getCPModel();
     var cpDispData = fcg.mdg.editbp.handlers.ContactPerson.getDispCPModel();
     var layout;
     var cpwpData = cpData.BP_RelationContactPersonRel;
     this._oNavContainer.getPages()[1].getContent()[6].setVisible(true);

     if (this.vCurrentActionId === "createRB") {
      var oCPDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispContactPerson", this);
      this._oNavContainer.getPages()[1].getContent()[6].getContent()[0].setVisible(true);
      this._oNavContainer.getPages()[1].getContent()[6].getContent()[0].addContent(oCPDisplayFragment);
      oCPDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
      oCPDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
      layout = this.getView().byId("cpCreateLayout");

      var cpModel = new sap.ui.model.json.JSONModel();
      cpModel.setData(cpDispData);
      oCPDisplayFragment.setModel(cpModel, "person");

      fcg.mdg.editbp.handlers.ContactPerson.destroyAddressTittle(cpDispData, layout, this);
      fcg.mdg.editbp.handlers.ContactPerson.displayWPAddress(cpwpData.BP_ContactPersonWorkplacesRel, layout, this);
      fcg.mdg.editbp.handlers.ContactPerson.displayCpIAV(cpwpData.BP_ContactPersonWorkplacesRel, layout, this);
     } else if (this.vCurrentActionId === "changeRB") {
      var vedit = fcg.mdg.editbp.handlers.ContactPersonChange.ocpChangeModel.EDIT;
      var vSrecord = fcg.mdg.editbp.handlers.ContactPersonChange.ocpChangeModel.SelectIndex;
      var oCPDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DisplayChangeCP", this);
      this._oNavContainer.getPages()[1].getContent()[6].getContent()[1].setVisible(true);
      // this._oNavContainer.getPages()[1].getContent()[6].getContent()[1].addContent(oCPDisplayFragment);
      oCPDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
      oCPDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
      layout = this.getView().byId("cpChangeLayout");
      if (vedit !== "X") {
       layout.addContent(oCPDisplayFragment);
       layout = layout.getContent()[layout.getContent().length - 1];
       fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSrecord]["EDIT"] = "X";
      } else {
       var vReEditIndx = fcg.mdg.editbp.handlers.ContactPersonChange.aChangedCP.indexOf(cpData.PARTNER2);
       layout.insertContent(oCPDisplayFragment, vReEditIndx);
       layout.removeContent(layout.getContent()[vReEditIndx + 1]);
       layout = layout.getContent()[vReEditIndx];
       //layout = layout.getContent(fcg.mdg.editbp.handlers.ContactPersonChange.aChangedCP.indexOf(cpData.PARTNER2));
      }

      var cpModel = new sap.ui.model.json.JSONModel();
      cpModel.setData(cpDispData);
      oCPDisplayFragment.setModel(cpModel, "ChPerson");

      fcg.mdg.editbp.handlers.ContactPerson.displayWPAddress(cpwpData.BP_ContactPersonWorkplacesRel.results, layout, this);
      fcg.mdg.editbp.handlers.ContactPerson.displayCpIAV(cpwpData.BP_ContactPersonWorkplacesRel.results, layout, this);
      this.setEntityValue(this.vCurrentEntity, cpData.PARTNER2);

     } else if (this.vCurrentActionId === "deleteRB") {
      var oCPDisDelFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispDeleteContactPerson", this);
      this._oNavContainer.getPages()[1].getContent()[6].getContent()[2].setVisible(true);
      this._oNavContainer.getPages()[1].getContent()[6].getContent()[2].addContent(oCPDisDelFragment);
      oCPDisDelFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
      oCPDisDelFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
      layout = this.getView().byId("cpDeleteLayout");

      var cpModel = new sap.ui.model.json.JSONModel();
      cpModel.setData(cpData);
      oCPDisDelFragment.setModel(cpModel, "person");

      fcg.mdg.editbp.handlers.ContactPerson.displayWPAddress(cpwpData.BP_ContactPersonWorkplacesRel.results, layout, this);
      fcg.mdg.editbp.handlers.ContactPerson.displayCpIAV(cpwpData.BP_ContactPersonWorkplacesRel.results, layout, this);
     }
    } else {
     var oReEdtMdl = fcg.mdg.editbp.handlers.ContactPerson.oReEditModel;;
     this._oNavContainer.getPages()[1].getContent()[6].getContent()[0].getContent()[fcg.mdg.editbp.handlers.ContactPerson.vReEditIndex]
      .setModel(oReEdtMdl, "CP");
    }
   } else if (this.vCurrentEntity === "OrgRB") {
    var oOrgDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispGeneralOrg", this);
    this._oNavContainer.getPages()[1].getContent()[1].setVisible(true);
    var layout = this._oNavContainer.getPages()[1].getContent()[1].getContent()[0];
    layout.setVisible(true);
    layout.removeAllContent();
    layout.addContent(oOrgDisplayFragment);
    oOrgDisplayFragment.setModel(fcg.mdg.editbp.handlers.GeneralData.getGenDataModel(), "Gen");
    // this.displayPageTitle(fcg.mdg.editbp.handlers.GeneralData.getGenDataModel());
    fcg.mdg.editbp.handlers.GeneralData.setDispFragTitle(this, layout);
    this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.GeneralData.getGenDataModel().getData().PARTNER);
   } else if (this.vCurrentEntity === "PersRB") {
    var oPersDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispGeneralPerson", this);
    this._oNavContainer.getPages()[1].getContent()[1].setVisible(true);
    var layout = this._oNavContainer.getPages()[1].getContent()[1].getContent()[0];
    layout.setVisible(true);
    layout.removeAllContent();
    layout.addContent(oPersDisplayFragment);
    oPersDisplayFragment.setModel(fcg.mdg.editbp.handlers.GeneralData.getGenDataModel(), "Gen");
    // this.displayPageTitle(fcg.mdg.editbp.handlers.GeneralData.getGenDataModel());
    fcg.mdg.editbp.handlers.GeneralData.setDispFragTitle(this, layout);
    this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.GeneralData.getGenDataModel().getData().PARTNER);
   }
   this._oNavContainer.to(this.getView().byId("idSummary"));
   if (this.vCurrentActionId === "changeRB") {
    this.setBoldingBP();
   }

   /**
    * @ControllerHook To Perform the Action on Reviewing the changes
    * If customer extends the application with a new entity, the Review Changes has to be set
    * for the newly added entity
    * @callback Controller~extHookOnWizardComplete
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookOnWizardComplete() !== undefined) {
    this.extHookOnWizardComplete(this);
   }

  },

  setEntityValue: function(vCurrentEntity, vId) {
   var vFlag = false;
   for (var i = 0; i < this.aEntityValue.length; i++) {
    if (this.aEntityValue[i].split("-")[0] === vCurrentEntity && this.aEntityValue[i].split("-")[1] === vId) {
     // this.aEntityValue.push(vCurrentEntity + "-" + vId);
     vFlag = true;
    }
   }
   if (!vFlag)
    this.aEntityValue.push(vCurrentEntity + "-" + vId);
   else
    vFlag = false;
  },

  setBoldingBP: function() {
   var sf;
   if (this.changedData.ChangeSets !== undefined) {
    for (var i = 0; i < this.changedData.ChangeSets.length; i++) {
     sf = "SF-" + this.changedData.ChangeSets[i].Entity + "-" + this.changedData.ChangeSets[i].Attribute.split("/");
     if (sap.ui.getCore().byId(sf) !== undefined)
      sap.ui.getCore().byId(sf).addStyleClass("text_bold");
    }
   }
  },

  onExit: function() {

  },
  getRouter: function() {
   var that = this;
   return sap.ui.core.UIComponent.getRouterFor(that);
  },
  createTax: function() {
   var oTaxNumber = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
   var oTaxType = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
   var taxNum = oTaxNumber.getValue();
   var taxType = oTaxType.getValue();
   this.clearAllData(); //tax is using another model and hence clearing this model to check the validations

   if (taxNum === "" || taxType === "") {

    if (taxNum === "") {
     oTaxNumber.setValueState("Error");
    }
    if (taxType === "") {
     oTaxType.setValueState("Error");

    }
    return;
   }
   var res = fcg.mdg.editbp.handlers.TaxNumbers.createTNModel(this.vTaxCat, this);
   var TnModel = new sap.ui.model.json.JSONModel();
   TnModel.setData(res);

   if (this.reEdit === "") {

    var oTaxDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
    this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
    this._oNavContainer.getPages()[1].getContent()[5].getContent()[0].setVisible(true);
    this._oNavContainer.getPages()[1].getContent()[5].getContent()[0].addContent(oTaxDisplayFragment);
    oTaxDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
    oTaxDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");

    oTaxDisplayFragment.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oTaxModel, "Tax");
    this._oNavContainer.to(this.getView().byId("idSummary"));
    this.summaryofRequest(); //request details called exclusively for tax as it is not returning back

   } else if (this.reEdit === "X") {

    this._oNavContainer.getPages()[1].getContent()[5].getContent()[0].getContent()[this.vTaxEntityIndex]
     .setModel(fcg.mdg.editbp.handlers.TaxNumbers.oTaxModel, "Tax");
    this._oNavContainer.to(this.getView().byId("idSummary"));
    this.summaryofRequest(); //request details called exclusively for tax as it is not returning back
    // this.vTaxReEdit = "";
    this.vTaxEntityIndex = "";

   }

   this.vContEditTax = "";
   return;
  },
  changeTax: function() {
   var oTaxNumber = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
   var oTaxType = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
   var taxNum = oTaxNumber.getValue();
   var taxType = oTaxType.getValue();
   if (taxNum === "" || taxType === "") {

    if (taxNum === "") {
     oTaxNumber.setValueState("Error");
    }

    if (taxType === "") {
     oTaxType.setValueState("Error");

    }
    return;
   }

   if (this.vContEditTax === "") {

    if (this.reEdit === "") {

     fcg.mdg.editbp.handlers.TaxNumbers.changeModel(this);
     var oTaxDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
     this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
     this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].setVisible(true);
     this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].addContent(oTaxDisplayFragment);
     oTaxDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
     oTaxDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");

     oTaxDisplayFragment.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel, "Tax");
     this._oNavContainer.to(this.getView().byId("idSummary"));
     this.summaryofRequest(); //request details called exclusively for tax as it is not returning back

    }

    if (this.reEdit === "X") {
     fcg.mdg.editbp.handlers.TaxNumbers.changeModel(this);
     this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[this.vTaxEntityIndex]
      .setModel(fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel, "Tax");
     this._oNavContainer.to(this.getView().byId("idSummary"));
     this.summaryofRequest(); //request details called exclusively for tax as it is not returning back

     // this.vTaxReEdit = "";
     this.vTaxEntityIndex = "";

    }
   } else if (this.vContEditTax === "X") {

    var vReviewIndex = "";

    fcg.mdg.editbp.handlers.TaxNumbers.changeModel(this);
    vReviewIndex = fcg.mdg.editbp.handlers.TaxNumbers.vRIndex;

    if (vReviewIndex !== "") {

     this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[vReviewIndex]
      .setModel(fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel, "Tax");
     this._oNavContainer.to(this.getView().byId("idSummary"));
     this.summaryofRequest(); //request details called exclusively for tax as it is not returning back
    } else {
     var oTaxDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
     this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
     this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].setVisible(true);
     this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].addContent(oTaxDisplayFragment);
     oTaxDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
     oTaxDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");

     oTaxDisplayFragment.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel, "Tax");
     this._oNavContainer.to(this.getView().byId("idSummary"));
     this.summaryofRequest(); //request details called exclusively for tax as it is not returning back

    }

   }
   this.vContEditTax = "";
   this.vTaxEntityIndex = "";
   this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel.getData().TAXTYPE);
   return;
  },
  deleteTax: function() {
   fcg.mdg.editbp.handlers.TaxNumbers.deleteModel(this);
   var oTaxDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
   this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
   this._oNavContainer.getPages()[1].getContent()[5].getContent()[2].setVisible(true);
   this._oNavContainer.getPages()[1].getContent()[5].getContent()[2].addContent(oTaxDisplayFragment);
   oTaxDisplayFragment.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
   oTaxDisplayFragment.getToolbar().getContent()[1].addStyleClass("text_bold");
   // oTaxDisplayFragment.getToolbar().getContent()[3].destroy();

   oTaxDisplayFragment.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oDltTaxModel, "Tax");
   this._oNavContainer.to(this.getView().byId("idSummary"));
   this.summaryofRequest(); //request details called exclusively for tax as it is not returning back
   this.vContEditTax = "";
   this.vTaxEntityIndex = "";
   return;
  },
  undoEntityData: function(oEvent) {
   this.reEditSource = oEvent.getSource();
   var oActionLayout = this.reEditSource.getParent().getParent().getParent().getParent();
   var oEntityLayout = this.reEditSource.getParent().getParent().getParent().getParent().getParent();
   var vActionIndex = oEntityLayout.indexOfContent(oActionLayout);
   var vEntityLayout = this.reEditSource.getParent().getParent().getParent();
   var vEntityIndex = oActionLayout.indexOfContent(vEntityLayout);
   var msg;
   switch (this.getView().byId("idSummary").indexOfContent(oEntityLayout)) {
    case 0:
    case 1:
     msg = fcg.mdg.editbp.handlers.GeneralData.undoGenDataChanges(vActionIndex, vEntityIndex);
     break;
    case 2:
     msg = fcg.mdg.editbp.handlers.Communication.undoAddressChanges(vActionIndex, vEntityIndex);
     break;
    case 3:
     msg = fcg.mdg.editbp.handlers.BankAccount.undoBankChanges(this.reEditSource, vActionIndex, vEntityIndex, vEntityLayout, this);
     // return;
     break;
    case 4:
     msg = fcg.mdg.editbp.handlers.Identification.undoIdentificationChanges(vActionIndex, vEntityIndex);
     break;
    case 5:
     msg = fcg.mdg.editbp.handlers.TaxNumbers.undoTaxNumberChanges(vActionIndex, vEntityIndex);
     break;

    case 6:
     msg = fcg.mdg.editbp.handlers.ContactPersonChange.undoContactPersonChanges(vActionIndex, vEntityIndex);
     break;
   }
   if(msg === "ERROR") {
    return;
   }
   vEntityLayout.destroy();
   MessageToast.show(this.i18nBundle.getText("REVERT_CHNG_MSG"));
   this.clearAllData();
   this.submitButtonState();

   // Check if duplicate check has to be triggered after the revert or not
   this.oDuplicatesResult = "";
   if (this.oDupCheckData.length !== 0) {
    this.checkDuplicates();
   } else {
    //call the function to display or hide the Duplicate message
    this.displayDuplicateMessage(this.oDuplicatesResult, this._oNavContainer);
   }

   /**
    * @ControllerHook To Perform the Action on Undoing the changes
    * If customer extends the application with a new entity, the Undo Changes has to be set
    * for the newly added entity
    * @callback Controller~extHookUndoEntityData
    * @param {object} this Controller Instance
    * @param {object} event instance
    * @return { }
    */
   if (this.extHookUndoEntityData() !== undefined) {
    this.extHookUndoEntityData(this, oEvent);
   }

  },

  //function to display or hide the duplicate strip
  displayDuplicateMessage: function(oDuplicatesResult, oNavContainer) {
   if (oDuplicatesResult !== "") { //fields related to MP is changed
    oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].setVisible(true);
    if (oDuplicatesResult[0].data === undefined) {
     if (oDuplicatesResult[0].response.body !== undefined) {
      var errorMsg = JSON.parse(oDuplicatesResult[0].response.body).error.message.value;
      oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].setText(this.i18nBundle.getText(
       "Duplicate Check - Error Occured : ") + errorMsg);
     } else {
      oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].setText(this.i18nBundle.getText(
       "Duplicate Check - Error Occured"));
     }
     sap.ui.getCore().byId("idDuplCheckMsg").setVisible(true);
     oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].mAggregations.link.setVisible(
      false);
     return;
    }
    if (oDuplicatesResult[0].data.results.length > 0) { //duplicates found
     sap.ui.getCore().byId("idDuplCheckMsg").setVisible(true);
     oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].setText(this.i18nBundle.getText(
      "DUP_CHK_MSG", this.vPARTNERID));
     oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].mAggregations.link.setText(this
      .i18nBundle.getText("VIEW_DUP_MSG"));
     oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].mAggregations.link.setVisible(
      true);
    } else if (oDuplicatesResult[0].data.results.length === 0) { //duplicates not found
     sap.ui.getCore().byId("idDuplCheckMsg").setVisible(false);
     //oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent()[0].setVisible(false);
    }
   } else if (this.vCurrentActionId !== "deleteRB") { //duplicate check not trigerred
    sap.ui.getCore().byId("idDuplCheckMsg").setVisible(false);

   } else {
    sap.ui.getCore().byId("idDuplCheckMsg").setVisible(false);
   }
  },

  navBackToEditEntityData: function(oEvt) {
   // this.getView().byId("wizardId").invalidateStep(this.getView().byId("editStep"));
   this.clearAllData();
   this.reEdit = "X";
   this.reEditSource = oEvt.getSource();
   var oActionLayout = this.reEditSource.getParent().getParent().getParent().getParent();
   var oEntityLayout = this.reEditSource.getParent().getParent().getParent().getParent().getParent();
   var vActionIndex = oEntityLayout.indexOfContent(oActionLayout);
   var vEntityLayout = this.reEditSource.getParent().getParent().getParent();
   var vEntityIndex = oActionLayout.indexOfContent(vEntityLayout);
   if (vActionIndex === 0) {
    this.vCurrentActionId = "createRB";
   } else if (vActionIndex === 1) {
    this.vCurrentActionId = "changeRB";
   }
   switch (this.getView().byId("idSummary").indexOfContent(oEntityLayout)) {
    case 0:
     break;
    case 1:
     if (this.sCategory === "2") {
      this.vCurrentEntity = "OrgRB";
     } else if (this.sCategory === "1") {
      this.vCurrentEntity = "PersRB";
     }
     //this.setGeneralActionText(this.sCategory); 
     this._navBackToStep(this.getView().byId("requestStep"));
     this.oWizard.invalidateStep(this.getView().byId("requestStep"));
     break;
    case 2:
     this.vCurrentEntity = "communicationRB";
     // this._navBackToStep(this.getView().byId("editStep"));
     this._navBackToStep(this.getView().byId("communicationStep"));
     this.oWizard.invalidateStep(this.getView().byId("communicationStep"));
     break;
    case 3:
     this.vCurrentEntity = "BankRB";
     this._navBackToStep(this.getView().byId("editStep"));
     this.oWizard.invalidateStep(this.getView().byId("editStep"));
     break;
    case 4:
     this.vCurrentEntity = "identificationRB";
     this._navBackToStep(this.getView().byId("editStep"));
     this.oWizard.invalidateStep(this.getView().byId("editStep"));
     break;
    case 5:
     this.vCurrentEntity = "taxRB";
     this.vTaxEntityIndex = vEntityIndex;
     this._navBackToStep(this.getView().byId("editStep"));
     this.oWizard.invalidateStep(this.getView().byId("editStep"));
     break;
    case 6:

     break;
   }
  },

  _navBackToStep: function(step) {
   var that = this;

   function fnAfterNavigate() {
    //that.oWizard.validateStep(step);
    that.oWizard.goToStep(step);
    if (that.oCommunicationLayout !== "") {
     that.oCommunicationLayout.destroyContent();
    }
    if (that.vCurrentEntity === "OrgRB" || that.vCurrentEntity === "PersRB") {
     fcg.mdg.editbp.handlers.GeneralData.editGeneralData(this.sItemPath, that.sCategory, that.i18nBundle, that);
    } else if (that.vCurrentEntity === "taxRB") {

     fcg.mdg.editbp.handlers.TaxNumbers.handleTaxNumber(that);
    } else if (that.vCurrentEntity === "BankRB") {
     fcg.mdg.editbp.handlers.BankAccount.handleBankAccounts(that);
    } else if (that.vCurrentEntity === "identificationRB") {
     fcg.mdg.editbp.handlers.Identification.handleIdentification(that);
    } else if (that.vCurrentEntity === "communicationRB") {
     fcg.mdg.editbp.handlers.Communication.handleCommunication(that);
    } else if (that.vCurrentEntity === "ContactPerRB") {
     fcg.mdg.editbp.handlers.ContactPerson.handleContactPerson(that);
    }
    that._oNavContainer.detachAfterNavigate(fnAfterNavigate);
   }
   this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
   this._oNavContainer.to(this._oWizardContentPage);
  },

  onBankCountryVH: function(oControlEvent) {
   var oGlobalIns = this;
   fcg.mdg.editbp.handlers.BankAccount._countryVH("SF-BP_BankAccounts-Txt_BANK_CTRY", oControlEvent, oGlobalIns);
  },
  onBankKeyVH: function(oControlEvent) {
   var oGlobalIns = this;
   fcg.mdg.editbp.handlers.BankAccount._BankKeyVH("SF-BP_BankAccounts-Txt_BANK_KEY", oControlEvent, oGlobalIns);
  },

  //Tax Value Help
  onTaxCategoryVH: function(oControlEvent) {
   var oGlobalIns = this;
   fcg.mdg.editbp.handlers.TaxNumbers._TaxTypeVH("SF-BP_TaxNumber-TaxNumCat", oControlEvent, oGlobalIns);
  },

  //Tax number on Change.

  onChangeTaxType: function(oEvent) {
   if (fcg.mdg.editbp.handlers.TaxNumbers.valueHelpFlag === "X") {
    this.onChange(oEvent);
   } else {
    sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setValue(sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue()
     .toUpperCase());
    var oTaxType = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
    var taxType = oTaxType.getValue();
    var oTaxNumber = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
    var taxNum = oTaxNumber.getValue();
    // this.onChange(oEvent);   //need to implement dhanwin for handling change senerios.
    var taxTypeNoSpaces = taxType.replace(/^[ ]+|[ ]+$/g, '');
    var otaxTypeDesc = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm");
    var oTaxNumState = oTaxNumber.getValueState();
    var oTaxTypeState = oTaxType.getValueState();
    var oTaxResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[8].data;
    if (oTaxResult.results.length > 0) {
     var vTotal = oTaxResult.results.length - 1;
     for (var i = 0; i < oTaxResult.results.length; i++) {
      if (oTaxResult.results[i].KEY === taxType) {
       oTaxType.setValueState("None");
       oTaxType.setValueStateText("");
       otaxTypeDesc.setValue(oTaxResult.results[i].TEXT);
       oTaxNumber.setValueState("None");
       // otaxTypeDesc.fireEvent("change");

       if (taxType !== "" && taxNum !== "" && oTaxNumState !== "Error" && oTaxTypeState !== "Error") {
        this.oWizard.validateStep(this.getView().byId("editStep"));
       } else {
        this.oWizard.invalidateStep(this.getView().byId("editStep"));
       }

       return;
      } else if (i === vTotal && oTaxResult.results[i].KEY !== taxType) {

       if (taxType !== "") {

        oTaxType.setValueState("Error");
        oTaxType.setValueStateText(this.i18nBundle.getText("Tax_Type_MSG", taxType));
        otaxTypeDesc.setValue("");
        this.oWizard.invalidateStep(this.getView().byId("editStep"));
       }
      }
     }
    }
   }
  },
  // on Tax Type Live Change

  taxCatChange: function(oEvent) {

   var oTaxNumber = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
   var oTaxType = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
   var otaxTypeDesc = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm");
   var taxType = oTaxType.getValue();
   var taxNum = oTaxNumber.getValue();
   var taxLength = taxNum.length;

   if (taxType !== "") {
    oTaxNumber.setValueState("None");
    oTaxType.setValueState("None");
   }

   if (taxType === "") {
    otaxTypeDesc.setValue("");
   }
  },

  submitButtonState: function() {
   if (fcg.mdg.editbp.handlers.BankAccount.BankQueryModel.length > 0 || fcg.mdg.editbp.handlers.BankAccount.BankChngQueryModel.length >
    0 ||
    fcg.mdg.editbp.handlers.BankAccount.BankDltQueryModel.length > 0 || fcg.mdg.editbp.handlers.TaxNumbers.taxCreateModel.length > 0 ||
    fcg.mdg.editbp.handlers.TaxNumbers.TaxChngQueryModel.length > 0 || fcg.mdg.editbp.handlers.TaxNumbers.TaxDltQueryModel.length > 0 ||
    fcg.mdg.editbp.handlers.Communication.oCreateModel.length > 0 || fcg.mdg.editbp.handlers.Communication.oDeleteModel.length > 0 ||
    fcg.mdg.editbp.handlers.Communication.oChangeModel.length > 0 || fcg.mdg.editbp.handlers.Identification.oIDQueryModel.length > 0 ||
    fcg.mdg.editbp.handlers.Identification.oIDDeleteQueryModel.length > 0 || fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel.length >
    0 || fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteQueryModel.length > 0 || fcg.mdg.editbp.handlers.ContactPersonChange.aChangedCP
    .length > 0 || fcg.mdg.editbp.handlers.GeneralData.GenDataQueryModel
    .length > 0) {
    this.getView().byId("idSubmit").setEnabled(true);
   } else {
    this.getView().byId("idSubmit").setEnabled(false);
   }

   /**
    * @ControllerHook To Perform the Enable and Disable the Submit button
    * If customer extends the application with a new entity, the enabling 
    * and disabling of Submit button has to be handled
    * @callback Controller~extHookSubmitButtonState
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookSubmitButtonState() !== undefined) {
    this.extHookSubmitButtonState(this);
   }

  },
  buildCPWPQuery: function(oController, batchChanges, oModel, oCpData, CpCount, vIavFlag) {
   var oWpData = oCpData[CpCount].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
   for (var WpCount = 0; WpCount < oWpData.length; WpCount++) {
    vIavFlag = undefined;
    var vAction = undefined;
    if (oWpData[WpCount].action === "U") {
     vAction = "MERGE";
    } else if (oWpData[WpCount].action === "N") {
     vAction = "POST";
    } else if (oWpData[WpCount].action === "D") {
     vAction = "DELETE";
    }

    if (oWpData[WpCount].action !== undefined) {
     if (oWpData[WpCount].action === "U") {
      delete oWpData[WpCount].ChangeData.__deferred;
      vIavFlag = "X"; //// if nothing other than IAV is changed
      batchChanges.push(oModel.createBatchOperation(oWpData[WpCount].header, vAction, oWpData[WpCount].ChangeData));
     } else if (oWpData[WpCount].action === "N") {
      delete oWpData[WpCount].ChangeData.__deferred;
      // vIavFlag = "X";
      // batchChanges.push(oModel.createBatchOperation(oWpData[WpCount].header, vAction, oWpData[WpCount].ChangeData));
      oController.postDeepWorkplaceAddrs(oController, batchChanges, oModel, oCpData, CpCount, oWpData, WpCount);
     } else if (oWpData[WpCount].action === "D") {
      batchChanges.push(oModel.createBatchOperation(oWpData[WpCount].header, vAction));
     }
    }
    if (oWpData[WpCount].action !== "N" && oWpData[WpCount].action !== "D") {
     oController.buildWpEntityQuery(oController, batchChanges, oModel, oCpData, CpCount, oWpData, WpCount, vIavFlag);
    }
   }
  },

  postDeepWorkplaceAddrs: function(oController, batchChanges, oModel, oCpData, CpCount, oWpData, WpCount) {
   var vTelAction, vMobAction, vFaxAction, vMailAction, vIavAction;

   var vValidDateFormat = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(oWpData[WpCount].VALIDUNTILDATE);
   delete oWpData[WpCount].ChangeData.__deferred;
   var sWPDeepQuery = oWpData[WpCount].header + "/BP_ContactPersonWorkplacesRel"
   var vPayload = [];
   var vChildPayload = [];
   vPayload = oWpData[WpCount].ChangeData;
   vPayload["VALIDUNTILDATE"] = "9999-12-31T00:00:00";

   if (oWpData[WpCount].BP_WorkplaceCommPhonesRel !== undefined) {
    var oTelData = oWpData[WpCount].BP_WorkplaceCommPhonesRel.results;
    for (var TCount = 0; TCount < oTelData.length; TCount++) {
     delete oTelData[TCount].ChangeData.__deferred;
     oTelData[TCount].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
     vChildPayload.push(oTelData[TCount].ChangeData);
     if (TCount === oTelData.length - 1) {
      vPayload["BP_WorkplaceCommPhonesRel"] = vChildPayload;
      vChildPayload = [];
     }
    }
   }
   if (oWpData[WpCount].BP_WorkplaceCommMobilesRel !== undefined) {
    var oMobData = oWpData[WpCount].BP_WorkplaceCommMobilesRel.results;
    for (var MCount = 0; MCount < oMobData.length; MCount++) {
     delete oMobData[MCount].ChangeData.__deferred;
     oMobData[MCount].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
     vChildPayload.push(oMobData[MCount].ChangeData);
     if (MCount === oMobData.length - 1) {
      vPayload["BP_WorkplaceCommMobilesRel"] = vChildPayload;
      vChildPayload = [];
     }
    }
   }
   if (oWpData[WpCount].BP_WorkplaceCommFaxesRel !== undefined) {
    var oFaxData = oWpData[WpCount].BP_WorkplaceCommFaxesRel.results;
    for (var FCount = 0; FCount < oFaxData.length; FCount++) {
     delete oFaxData[FCount].ChangeData.__deferred;
     oFaxData[FCount].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
     vChildPayload.push(oFaxData[FCount].ChangeData);
     if (FCount === oFaxData.length - 1) {
      vPayload["BP_WorkplaceCommFaxesRel"] = vChildPayload;
      vChildPayload = [];
     }
    }
   }
   if (oWpData[WpCount].BP_WorkplaceCommEMailsRel !== undefined) {
    var oEmailData = oWpData[WpCount].BP_WorkplaceCommEMailsRel.results;
    for (var ECount = 0; ECount < oEmailData.length; ECount++) {
     delete oEmailData[ECount].ChangeData.__deferred;
     oEmailData[ECount].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
     vChildPayload.push(oEmailData[ECount].ChangeData);
     if (ECount === oEmailData.length - 1) {
      vPayload["BP_WorkplaceCommEMailsRel"] = vChildPayload;
      vChildPayload = [];
     }
    }
   }
   if (oWpData[WpCount].BP_WorkplaceIntAddressVersRel !== undefined) {
    var oIavData = oWpData[WpCount].BP_WorkplaceIntAddressVersRel.results;
    for (var IAVCount = 0; IAVCount < oIavData.length; IAVCount++) {
     var vIntPersAction = undefined;
     delete oIavData[IAVCount].ChangeData.__deferred;
     oIavData[IAVCount].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
     if (oIavData[IAVCount].BP_WorkplaceIntPersVersionRel !== undefined && Object.getOwnPropertyNames(oIavData[IAVCount].BP_WorkplaceIntPersVersionRel
       .ChangeData).length !== 0) {
      oIavData[IAVCount].ChangeData["BP_WorkplaceIntPersVersionRel"] = oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.ChangeData;
     }
     vChildPayload.push(oIavData[IAVCount].ChangeData);
     if (IAVCount === oIavData.length - 1) {
      vPayload["BP_WorkplaceIntAddressVersRel"] = vChildPayload;
      vChildPayload = [];
     }
    }
   }
   batchChanges.push(oModel.createBatchOperation(sWPDeepQuery, "POST", vPayload));

   var stdAddress = fcg.mdg.editbp.handlers.ContactPersonChange.stdChangeAddress;
   var perIAV = "",
    wpIav, isExistIav = "";

   if (stdAddress !== "" && stdAddress.length > 0) {
    perIAV = stdAddress[0].BP_AddressVersionsPersRel.results;
    wpIav = vPayload.BP_WorkplaceIntAddressVersRel;
    if (perIAV !== undefined) {
     for (var b = 0; b < perIAV.length; b++) {
      if (wpIav !== undefined) {
       for (var c = 0; c < wpIav.length; c++) {
        if (perIAV[b].ADDR_VERS === wpIav[c].ADDR_VERS) {
         var vIAVQuery = "BP_PersonVersionCollection(BP_GUID=X'" + fcg.mdg.editbp.handlers.ContactPersonChange.vChgBpguid2 +
          "',ADDR_VERS='" + wpIav[c].ADDR_VERS + "',AD_ID='" + stdAddress[0].AD_ID + "')"
         batchChanges.push(oModel.createBatchOperation(vIAVQuery, "MERGE", wpIav[c].BP_WorkplaceIntPersVersionRel));
         delete(wpIav[c].BP_WorkplaceIntPersVersionRel);
        }
       }
      }
     }
    }
   }

  },

  buildWpEntityQuery: function(oController, batchChanges, oModel, oCpData, CpCount, oWpData, WpCount, vIavFlag) {
   var vTelAction, vMobAction, vFaxAction, vMailAction, vIavAction;
   var oTelData = oWpData[WpCount].BP_WorkplaceCommPhonesRel.results;
   var oMobData = oWpData[WpCount].BP_WorkplaceCommMobilesRel.results;
   var oFaxData = oWpData[WpCount].BP_WorkplaceCommFaxesRel.results;
   var oEmailData = oWpData[WpCount].BP_WorkplaceCommEMailsRel.results;
   var oIavData = oWpData[WpCount].BP_WorkplaceIntAddressVersRel.results;
   var vValidDateFormat = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(oWpData[WpCount].VALIDUNTILDATE);
   for (var TCount = 0; TCount < oTelData.length; TCount++) {
    vTelAction = undefined;
    if (oTelData[TCount].action === "U") {
     vTelAction = "MERGE";
    } else if (oTelData[TCount].action === "N") {
     vTelAction = "POST";
     oTelData[TCount].header = oTelData[TCount].header + "/BP_WorkplaceCommPhonesRel";
     oTelData[TCount].ChangeData["VALIDUNTILDATE"] = vValidDateFormat;
     // oTelData[TCount].ChangeData["VALIDTODATE"] = oTelData[TCount].VALIDTODATE
    } else if (oTelData[TCount].action === "D") {
     vTelAction = "DELETE";
    }
    if (oTelData[TCount].action !== undefined) {
     if (oTelData[TCount].action === "D") {
      batchChanges.push(oModel.createBatchOperation("BP_WorkplaceCommPhoneCollection" + oTelData[TCount].header, vTelAction));
     } else {
      delete oTelData[TCount].ChangeData.__deferred;
      vIavFlag = "X";
      batchChanges.push(oModel.createBatchOperation(oTelData[TCount].header, vTelAction, oTelData[TCount].ChangeData));
     }
    }
   }

   for (var MCount = 0; MCount < oMobData.length; MCount++) {
    vMobAction = undefined;
    if (oMobData[MCount].action === "U") {
     vMobAction = "MERGE";
    } else if (oMobData[MCount].action === "N") {
     vMobAction = "POST";
     oMobData[MCount].header = oMobData[MCount].header + "/BP_WorkplaceCommMobilesRel";
     oMobData[MCount].ChangeData["VALIDUNTILDATE"] = vValidDateFormat;
    } else if (oMobData[MCount].action === "D") {
     vMobAction = "DELETE";
    }
    if (oMobData[MCount].action !== undefined) {
     if (oMobData[MCount].action === "D") {
      batchChanges.push(oModel.createBatchOperation("BP_WorkplaceCommMobileCollection" + oMobData[MCount].header, vMobAction));
     } else {
      delete oMobData[MCount].ChangeData.__deferred;
      vIavFlag = "X";
      batchChanges.push(oModel.createBatchOperation(oMobData[MCount].header, vMobAction, oMobData[MCount].ChangeData));
     }
    }

   }

   for (var FCount = 0; FCount < oFaxData.length; FCount++) {
    vFaxAction = undefined;
    if (oFaxData[FCount].action === "U") {
     vFaxAction = "MERGE";
    } else if (oFaxData[FCount].action === "N") {
     vFaxAction = "POST";
     oFaxData[FCount].header = oFaxData[FCount].header + "/BP_WorkplaceCommFaxesRel";
     oFaxData[FCount].ChangeData["VALIDUNTILDATE"] = vValidDateFormat;
    } else if (oFaxData[FCount].action === "D") {
     vFaxAction = "DELETE";
    }
    if (oFaxData[FCount].action !== undefined) {
     if (oFaxData[FCount].action === "D") {
      batchChanges.push(oModel.createBatchOperation("BP_WorkplaceCommFaxCollection" + oFaxData[FCount].header, vFaxAction));
     } else {
      delete oFaxData[FCount].ChangeData.__deferred;
      vIavFlag = "X";
      batchChanges.push(oModel.createBatchOperation(oFaxData[FCount].header, vFaxAction, oFaxData[FCount].ChangeData));
     }
    }
   }

   for (var ECount = 0; ECount < oEmailData.length; ECount++) {
    vMailAction = undefined;
    if (oEmailData[ECount].action === "U") {
     vMailAction = "MERGE";
    } else if (oEmailData[ECount].action === "N") {
     vMailAction = "POST";
     oEmailData[ECount].header = oEmailData[ECount].header + "/BP_WorkplaceCommEMailsRel";
     oEmailData[ECount].ChangeData["VALIDUNTILDATE"] = vValidDateFormat;
    } else if (oEmailData[ECount].action === "D") {
     vMailAction = "DELETE";
    }
    if (oEmailData[ECount].action !== undefined) {
     if (oEmailData[ECount].action === "D") {
      batchChanges.push(oModel.createBatchOperation("BP_WorkplaceCommEMailCollection" + oEmailData[ECount].header, vMailAction));
     } else {
      delete oEmailData[ECount].ChangeData.__deferred;
      vIavFlag = "X";
      batchChanges.push(oModel.createBatchOperation(oEmailData[ECount].header, vMailAction, oEmailData[ECount].ChangeData));
     }
    }
   }
   //// IAV Address version
   for (var IAVCount = 0; IAVCount < oIavData.length; IAVCount++) {
    vIavAction = undefined;
    var vIntPersAction = undefined;
    if (oIavData[IAVCount].action === "U") {
     vIavAction = "MERGE";
    } else if (oIavData[IAVCount].action === "N") {
     vIavAction = "POST";
    } else if (oIavData[IAVCount].action === "D") {
     vIavAction = "DELETE";
    }
    if (oIavData[IAVCount].action !== undefined) {
     // if (vIavAction !== "POST" && vIavAction !== "DELETE") {
     if (vIavAction === "MERGE") {
      delete oIavData[IAVCount].ChangeData.__deferred;
      vIavFlag = "X";
      batchChanges.push(oModel.createBatchOperation(oIavData[IAVCount].header, vIavAction, oIavData[IAVCount].ChangeData));
     } else if (vIavAction === "DELETE") {
      batchChanges.push(oModel.createBatchOperation("BP_WorkplaceIntAddressVersCollection" + oIavData[IAVCount].header, vIavAction));
     }
    }
    // If existing workplace and new IAV then build post deep
    if (vIavAction === "POST") {
     delete oIavData[IAVCount].ChangeData.__deferred;
     delete oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.ChangeData.__deferred;
     var sIavDeepQuery = oIavData[IAVCount].header + "/BP_WorkplaceIntAddressVersRel"
     var oDeepPayloadIav = oIavData[IAVCount].ChangeData;
     oDeepPayloadIav["VALIDUNTILDATE"] = vValidDateFormat;
     oDeepPayloadIav["BP_WorkplaceIntPersVersionRel"] = oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.ChangeData;
     batchChanges.push(oModel.createBatchOperation(sIavDeepQuery, vIavAction, oDeepPayloadIav));

     var stdAddress = fcg.mdg.editbp.handlers.ContactPersonChange.stdChangeAddress;
     var perIAV = "",
      wpIav, isExistIav = "";

     if (stdAddress !== "" && stdAddress.length > 0) {
      perIAV = stdAddress[0].BP_AddressVersionsPersRel.results;
      wpIav = oDeepPayloadIav;
      if (perIAV !== undefined) {
       for (var b = 0; b < perIAV.length; b++) {
        if (perIAV[b].ADDR_VERS === oDeepPayloadIav.ADDR_VERS) {
         var vIAVQuery = "BP_PersonVersionCollection(BP_GUID=X'" + fcg.mdg.editbp.handlers.ContactPersonChange.vChgBpguid2 +
          "',ADDR_VERS='" + oDeepPayloadIav.ADDR_VERS + "',AD_ID='" + stdAddress[0].AD_ID + "')"
         batchChanges.push(oModel.createBatchOperation(vIAVQuery, "MERGE", oDeepPayloadIav.BP_WorkplaceIntPersVersionRel));
         delete(oDeepPayloadIav.BP_WorkplaceIntPersVersionRel);
        }
       }
      }
     }
    } else if (vIavAction === undefined) {
     //// IAV Person Version
     if (oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.action === "U") {
      vIntPersAction = "MERGE";
     } else if (oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.action === "N") {
      vIntPersAction = "POST";
     } else if (oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.action === "D") {
      vIntPersAction = "DELETE";
     }
     if (vIntPersAction === "MERGE" && vIavFlag === "X") {
      delete oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.ChangeData.__deferred;
      batchChanges.push(oModel.createBatchOperation(oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.header, vIntPersAction, oIavData[
        IAVCount]
       .BP_WorkplaceIntPersVersionRel.ChangeData));
     } else if (vIntPersAction === "MERGE" && vIavFlag === undefined) {
      var oPayload = {};
      oPayload["FUNCTION"] = oIavData[IAVCount].FUNCTION;
      var vIavDummyKey = "BP_WorkplaceIntAddressVersCollection(BP_GUID=" + oController.sItemPath + ",PARTNER1=\'" + oIavData[IAVCount]
       .PARTNER1 +
       "\',PARTNER2=\'" + oIavData[IAVCount].PARTNER2 +
       "\',RELATIONSHIPCATEGORY=\'" +
       oIavData[IAVCount].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
       oIavData[IAVCount].ADDRESS_NUMBER + "\',ADDR_VERS=\'" +
       oIavData[IAVCount].ADDR_VERS + "\',VALIDUNTILDATE=datetime\'" +
       escape(vValidDateFormat) + "\')";
      batchChanges.push(oModel.createBatchOperation(vIavDummyKey, vIntPersAction, oPayload));
      delete oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.ChangeData.__deferred;
      batchChanges.push(oModel.createBatchOperation(oIavData[IAVCount].BP_WorkplaceIntPersVersionRel.header, vIntPersAction, oIavData[
       IAVCount].BP_WorkplaceIntPersVersionRel.ChangeData));
     }
    }
   }

  },

  onSubmit: function() {
   var oGlobalInstance = this;
   if(this.showPopup === "Y" || this.showPopup === "y") {
    sap.m.MessageBox.show(
     oGlobalInstance.getView().getModel("i18n").getProperty("CONFIRMATION_MSG"), {
      icon: sap.m.MessageBox.Icon.WARNING,
      actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
      title: "Warning",
      onClose: function(oAction) {
       if(oAction === "CANCEL") {
        return;
       }
       else {
        oGlobalInstance._onSubmit();
       }
      }
     }
    );
   }
   else {     //the submission should happen by default, if the parameter is not set
    this._onSubmit();
   }
  },

  _onSubmit: function() {
   var that = this;
   that._busyDialog.setBusyIndicatorDelay(0);
   that._busyDialog.open();
   var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
   var mheaders = {};
   mheaders.USMD_CREQ_TYPE = this.crType;
   oModel.setHeaders(mheaders);
   oModel.setUseBatch(true);
   var batchChanges = [];
   // batch operation for Bank Accounts Changed
   if (fcg.mdg.editbp.handlers.BankAccount.BankChngQueryModel.length > 0) {
    var vBnkChCount, vBankChQuery;
    var vBankChData = fcg.mdg.editbp.handlers.BankAccount.BankChngQueryModel;
    for (vBnkChCount = 0; vBnkChCount < vBankChData.length; vBnkChCount++) {
     vBankChQuery = vBankChData[vBnkChCount].header;
     batchChanges.push(oModel.createBatchOperation(vBankChQuery, "MERGE", vBankChData[vBnkChCount].body.ChangeData));
    }
   }
   // batch operation for Bank Accounts Deleted
   if (fcg.mdg.editbp.handlers.BankAccount.BankDltQueryModel.length > 0) {
    var vBnkDltCount, vBankDltQuery;
    var vBankDltData = fcg.mdg.editbp.handlers.BankAccount.BankDltQueryModel;
    for (vBnkDltCount = 0; vBnkDltCount < vBankDltData.length; vBnkDltCount++) {
     vBankDltQuery = vBankDltData[vBnkDltCount].header;
     batchChanges.push(oModel.createBatchOperation(vBankDltQuery, "DELETE"));
    }
   }
   // batch operation for Bank Accounts Create
   if (fcg.mdg.editbp.handlers.BankAccount.BankQueryModel.length > 0) {
    var vBnkCount, vBankQuery;
    var vBankData = fcg.mdg.editbp.handlers.BankAccount.BankQueryModel;
    for (vBnkCount = 0; vBnkCount < vBankData.length; vBnkCount++) {
     vBankQuery = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + vBankData[vBnkCount].entity + "Rel";
     batchChanges.push(oModel.createBatchOperation(vBankQuery, "POST", vBankData[vBnkCount].body));
    }
   }
   //batch operation for delete tax Numbers.
   if (fcg.mdg.editbp.handlers.TaxNumbers.TaxDltQueryModel.length > 0) {
    var vTaxDltCount, vTaxDltQuery;
    var vTaxDltData = fcg.mdg.editbp.handlers.TaxNumbers.TaxDltQueryModel;
    for (vTaxDltCount = 0; vTaxDltCount < vTaxDltData.length; vTaxDltCount++) {
     vTaxDltQuery = vTaxDltData[vTaxDltCount].header;
     batchChanges.push(oModel.createBatchOperation(vTaxDltQuery, "DELETE"));
    }
   }
   //batch operation for create tax Numbers.
   if (fcg.mdg.editbp.handlers.TaxNumbers.taxCreateModel.length > 0) {
    var vTaxCount, vTaxQuery;
    var vTaxData = fcg.mdg.editbp.handlers.TaxNumbers.taxCreateModel;
    for (vTaxCount = 0; vTaxCount < vTaxData.length; vTaxCount++) {
     vTaxQuery = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + vTaxData[vTaxCount].entity + "Rel";
     batchChanges.push(oModel.createBatchOperation(vTaxQuery, "POST", vTaxData[vTaxCount].body));
    }
   }

   // batch operation for Tax numbers Changed
   if (fcg.mdg.editbp.handlers.TaxNumbers.TaxChngQueryModel.length > 0) {
    var vTaxChCount, vTaxChQuery;
    var vTaxChData = fcg.mdg.editbp.handlers.TaxNumbers.TaxChngQueryModel;
    for (vTaxChCount = 0; vTaxChCount < vTaxChData.length; vTaxChCount++) {
     vTaxChQuery = vTaxChData[vTaxChCount].header;
     batchChanges.push(oModel.createBatchOperation(vTaxChQuery, "MERGE", vTaxChData[vTaxChCount].body));
    }
   }

   //bath operation for Contact Person Delete
   if (fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteQueryModel.length > 0) {
    var vDelCPCount, vDelCPQuery;
    var vDelCPData = fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteQueryModel;
    for (vDelCPCount = 0; vDelCPCount < vDelCPData.length; vDelCPCount++) {
     vDelCPQuery = vDelCPData[vDelCPCount].header;
     batchChanges.push(oModel.createBatchOperation(vDelCPQuery, "DELETE"));
    }
   }

   if (fcg.mdg.editbp.handlers.Communication.oCreateModel.length > 0) {
    var vNewComCount, vNewComQuery;
    var vNewComData = fcg.mdg.editbp.handlers.Communication.oCreateModel;
    var finalQueryModel = fcg.mdg.editbp.handlers.Communication.submitCreateQuery(vNewComData);
    for (vNewComCount = 0; vNewComCount < finalQueryModel.length; vNewComCount++) {
     vNewComQuery = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/BP_AddressesRel";
     batchChanges.push(oModel.createBatchOperation(vNewComQuery, "POST", finalQueryModel[vNewComCount].body));
    }
   }

   // Contact person change
   if (fcg.mdg.editbp.handlers.ContactPersonChange.cpQueryModel.length > 0) {
    var vIavFlag = undefined;
    var oCpData = fcg.mdg.editbp.handlers.ContactPersonChange.cpQueryModel;
    for (var CpCount = 0; CpCount < oCpData.length; CpCount++) {
     that.buildCPWPQuery(that, batchChanges, oModel, oCpData, CpCount, vIavFlag);
    }
   }

   //bath operation for Communication Delete
   if (fcg.mdg.editbp.handlers.Communication.oDeleteModel.length > 0) {
    var vDelComCount, vDelComQuery;
    var vDelComData = fcg.mdg.editbp.handlers.Communication.oDeleteModel;
    for (vDelComCount = 0; vDelComCount < vDelComData.length; vDelComCount++) {
     vDelComQuery = vDelComData[vDelComCount].header;
     batchChanges.push(oModel.createBatchOperation(vDelComQuery, "DELETE"));
    }
   }

   if (fcg.mdg.editbp.handlers.Communication.oChangeModel.length > 0) {
    var vNewComCount, vNewComQuery;
    var vNewComData = fcg.mdg.editbp.handlers.Communication.oChangeModel;
    var finalQueryModel = fcg.mdg.editbp.handlers.Communication.submitChangeQuery(vNewComData);
    for (vNewComCount = 0; vNewComCount < finalQueryModel.length; vNewComCount++) {
     if (finalQueryModel[vNewComCount].body === "N") {
      vNewComQuery = "BP_AddressCollection" + finalQueryModel[vNewComCount].header + "/" + finalQueryModel[vNewComCount].entity +
       "Rel";
      //vNewComQuery = "BP_AddressCollection(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + this.oDetailComm.BP_AddressesRel.results[0].AD_ID +
      // "\')/" + finalQueryModel[vNewComCount].entity + "Rel";
      batchChanges.push(oModel.createBatchOperation(vNewComQuery, "POST", finalQueryModel[vNewComCount].changes));
     } else if (finalQueryModel[vNewComCount].body === "D") {
      vNewComQuery = finalQueryModel[vNewComCount].entity + "Collection" + finalQueryModel[vNewComCount].header;
      //vNewComQuery = "BP_AddressCollection(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + this.oDetailComm.BP_AddressesRel.results[0].AD_ID +
      "\')/" + finalQueryModel[vNewComCount].entity + "Rel";
      batchChanges.push(oModel.createBatchOperation(vNewComQuery, "DELETE"));
     } else {
      if (finalQueryModel[vNewComCount].changes.length !== 0)
      // vNewComQuery = "BP_AddressCollection(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + this.oDetailComm.BP_AddressesRel.results[0].AD_ID + "\')";
       vNewComQuery = vNewComData[vNewComCount].entity + "Collection" + vNewComData[vNewComCount].header;
      batchChanges.push(oModel.createBatchOperation(vNewComQuery, "MERGE", finalQueryModel[vNewComCount].changes));
     }
    }
   }

   // in Communication, if one address is present and standard address is deleted make it std.
   if (this.oDetailComm.BP_AddressesRel !== undefined) {
    var vSetStdFlag = "";
    //check if multiple address are present and std address is deleted
    if (this.oDetailComm.BP_AddressesRel.results.length > 1) {
     for (i = 0; i < this.oDetailComm.BP_AddressesRel.results.length; i++) {
      if (this.oDetailComm.BP_AddressesRel.results[i].AD_ID === fcg.mdg.editbp.handlers.Communication.vStdAddress) {
       vSetStdFlag = "X";
       break;
      }

     }
    }

    if ((this.oDetailComm.BP_AddressesRel.results.length > 1 && vSetStdFlag !== "X") || (this.oDetailComm.BP_AddressesRel.results.length === 1 &&
      (fcg.mdg.editbp.handlers.Communication.vStdAddress === undefined || fcg.mdg.editbp.handlers.Communication.vStdAddress !== this.oDetailComm
       .BP_AddressesRel.results[0].AD_ID))) {
     var dataStdAddress = {
      STANDARDADDRESS: "X"
     };
     var vNewComQuery = "BP_AddressCollection(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + this.oDetailComm.BP_AddressesRel.results[0].AD_ID +
      "\')";
     batchChanges.push(oModel.createBatchOperation(vNewComQuery, "MERGE", dataStdAddress));

     //Also add the standard address usage relation
     var dataStdAddrUsage = {
      ADDRESSTYPE: "XXDEFAULT"
     };

     var vNewAddrUsageQuery = "BP_AddressCollection(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + this.oDetailComm.BP_AddressesRel.results[
       0].AD_ID +
      "\')/BP_UsagesOfAddressRel";

     batchChanges.push(oModel.createBatchOperation(vNewAddrUsageQuery, "POST", dataStdAddrUsage));
    }
   }

   // batch operation for Contact Person cretae
   if (fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel.length > 0) {
    var vCPCount, vCPQuery;
    var vCPData = fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel;

    var stdAddress = fcg.mdg.editbp.handlers.ContactPerson.standardAddress;
    var perIAV = "",
     wpIav, isExistIav = "";

    for (vCPCount = 0; vCPCount < vCPData.length; vCPCount++) {
     vCPQuery = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + vCPData[vCPCount].entity + "sRel";
     batchChanges.push(oModel.createBatchOperation(vCPQuery, "POST", vCPData[vCPCount].body));
     if (stdAddress !== "" && stdAddress.length > 0) {
      perIAV = stdAddress[0].BP_AddressVersionsPersRel.results;
      var wpRel = vCPData[vCPCount].body.BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel;
      if (wpRel !== undefined && wpRel.length > 0) {
       for (var a = 0; a < wpRel.length; a++) {
        wpIav = wpRel[a].BP_WorkplaceIntAddressVersRel;
        if (perIAV !== undefined) {
         for (var b = 0; b < perIAV.length; b++) {
          if (wpIav !== undefined) {
           for (var c = 0; c < wpIav.length; c++) {
            if (perIAV[b].ADDR_VERS === wpIav[c].ADDR_VERS) {
             isExistIav = "X";
             var guid2 = fcg.mdg.editbp.handlers.ContactPerson.vBPguid2;
             var vIAVQuery = "BP_PersonVersionCollection(BP_GUID=X'" + guid2 + "',ADDR_VERS='" + wpIav[c].ADDR_VERS + "',AD_ID='" +
              stdAddress[0].AD_ID + "')"
             batchChanges.push(oModel.createBatchOperation(vIAVQuery, "MERGE", wpIav[c].BP_WorkplaceIntPersVersionRel));
             delete(wpIav[c].BP_WorkplaceIntPersVersionRel);
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }

   // batch operation for Identification Number delete
   if (fcg.mdg.editbp.handlers.Identification.oIDDeleteQueryModel.length > 0) {

    var vIDDltCount, vIDDltQuery;
    var vIDDltData = fcg.mdg.editbp.handlers.Identification.oIDDeleteQueryModel;
    for (vIDDltCount = 0; vIDDltCount < vIDDltData.length; vIDDltCount++) {
     vIDDltQuery = vIDDltData[vIDDltCount].header;
     batchChanges.push(oModel.createBatchOperation(vIDDltQuery, "DELETE"));
    }

   }
   // batch operation for Identification Number cretae
   if (fcg.mdg.editbp.handlers.Identification.oIDQueryModel.length > 0) {
    var vIdCount, vIDQuery;
    var vIDData = fcg.mdg.editbp.handlers.Identification.oIDQueryModel;
    for (vIdCount = 0; vIdCount < vIDData.length; vIdCount++) {
     vIDQuery = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + vIDData[vIdCount].entity;
     batchChanges.push(oModel.createBatchOperation(vIDQuery, "POST", vIDData[vIdCount].body));
    }
   }

   // batch operation for GeneralData Change
   if (fcg.mdg.editbp.handlers.GeneralData.GenDataQueryModel.length > 0) {
    var genEnt = [];
    var GenDataQueryModel = fcg.mdg.editbp.handlers.GeneralData.createSubmitQuery(fcg.mdg.editbp.handlers.GeneralData.GenDataQueryModel);
    for (var i = 0; i < GenDataQueryModel.length; i++) {
     genEnt[i] = GenDataQueryModel[i].entity + "Collection" + GenDataQueryModel[i].header;
     batchChanges.push(oModel.createBatchOperation(genEnt[i], "MERGE", GenDataQueryModel[i].body));
    }
   }

   if (this.oAttach.length !== 0) {
    for (var j = 0; j < this.oAttach.length; j++) {
     batchChanges.push(oModel.createBatchOperation("/AttachmentMasterCollection", "POST", this.oAttach[j]));
    }
   }
   if (this.vRequestReason !== "") {
    var vRequestReasonData = {
     Text: this.vRequestReason
    };
    batchChanges.push(oModel.createBatchOperation("/NoteCollection", "POST", vRequestReasonData));
   }

   /**
    * @ControllerHook To Perform the Submit
    * If customer extends the application with a new entity, the Submit has to be handled
    * for the newly added entity
    * @callback Controller~extHookOnSubmit
    * @param {object} this Controller Instance
    * @param {object} batchChanges model to which the new change has to be pushed
    * @param {object} oDataModel Instance
    * @return { }
    */
   if (this.extHookOnSubmit() !== undefined) {
    var extBatchChanges = this.extHookOnSubmit(this, batchChanges, oModel);
    if (extBatchChanges != undefined) {
     batchChanges = extBatchChanges;
    }
   }

   oModel.addBatchChangeOperations(batchChanges);
   //submit changes and refresh the table and display message  
   oModel.submitBatch(function(data, oResponse, aErrorResponses) {
    that._busyDialog.close();
    var status = that._checkForSaveSuccessful(data, oResponse, aErrorResponses);
    var successMsg = "";
    if (status === false) {
     oModel.refresh();
     var batchResponse = data.__batchResponses;
     if (batchResponse && batchResponse instanceof Array && batchResponse.length) {
      var changeResponse = batchResponse[0].__changeResponses;
      if (changeResponse && changeResponse instanceof Array && changeResponse.length) {
       if (changeResponse[0].headers && changeResponse[0].headers.cr_id) {
        var cr_id = changeResponse[0].headers.cr_id;
        successMsg = cr_id.replace(/^[0]+/g, "");
       }
      }
     }
     var msg = that.i18nBundle.getText("SUBMIT_SUCCESS", successMsg);
     sap.m.MessageBox.success(msg, {
      icon: sap.m.MessageBox.Icon.SUCCESS,
      actions: [sap.m.MessageBox.Action.OK],
      onClose: jQuery.proxy(function(oAction) {
       if (oAction === "OK") {
        var vReviewlength = 0;
        vReviewlength = that._oNavContainer.getPages()[1].getContent().length;
        for (var i = 0; i < vReviewlength; i++) {
         if (that._oNavContainer.getPages()[1].getContent()[i].getContent()[0] !== undefined) {
          that._oNavContainer.getPages()[1].getContent()[i].getContent()[0].removeAllContent();
         }

         if (that._oNavContainer.getPages()[1].getContent()[i].getContent()[1] !== undefined) {
          that._oNavContainer.getPages()[1].getContent()[i].getContent()[1].removeAllContent();
         }

         if (that._oNavContainer.getPages()[1].getContent()[i].getContent()[2] !== undefined) {
          that._oNavContainer.getPages()[1].getContent()[i].getContent()[2].removeAllContent();
         }

        }
        fcg.mdg.editbp.util.DataAccess.setFromWizardFlag(1);
        that.returnToSearchPage();
        var oFltrBar = sap.ui.getCore().byId("searchFilterBar");
        oFltrBar.fireEvent("search");
       }
      }, this)
     });

    }

   }, function(aErrorResponses) {
    that._busyDialog.close();
    var errName = "";
    if (aErrorResponses.response && aErrorResponses.response.body) {
     if (JSON.parse(aErrorResponses.response.body).error.message.value) {
      errName = JSON.parse(aErrorResponses.response.body).error.message.value;
      errName = errName.split(": ")[1];
     }
    }
    that.showErrorDialog(errName);

   });
  },

  _handleReviewToSearch: function(istepnum) {
   var that = this;

   function fnAfterNavigate() {
    that.oWizard.goToStep(that.oWizard.getSteps()[0]);
    that._oNavContainer.detachAfterNavigate(fnAfterNavigate);
   }

   this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
   this._oNavContainer.backToPage(this._oWizardContentPage.getId());
  },

  initializeAttachments: function() {
   //if upload enabled, must set xsrf token
   //and the base64 encodingUrl service for IE9 support!
   fcg.mdg.editbp.handlers.Attachment.oController = this;
   var oGlobalInstance = this;
   oGlobalInstance.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "json");
   oGlobalInstance.oFileUpload = this.requestFrag.getContent()[1].getContent()[0];
   var data = {
    dataitems: []
   };
   oGlobalInstance.attachDataModel = new sap.ui.model.json.JSONModel(data);
   oGlobalInstance.oFileUpload.setModel(oGlobalInstance.attachDataModel, "json");
  },

  getXsrfToken: function() {
   var oLocalIns = this;
   var sToken = oLocalIns.getOwnerComponent().getModel().getHeaders()['x-csrf-token'];
   if (!sToken) {
    oLocalIns.getOwnerComponent().getModel().refreshSecurityToken(
     function(e, o) {
      sToken = o.headers['x-csrf-token'];
     },
     function() {

      sap.m.MessageBox.error({
       icon: sap.m.MessageBox.Icon.ERROR,
       title: this.i18nBundle.getText("TOKENMSG"),
       details: '',
      });

     }, false);
   }
   return sToken;
  },

  navToSelectEntity: function() {
   this.vDataLoss = this.i18nBundle.getText("NO_SELECT_LOSS");
   this.reEdit = "";
   this.clearAllData();
   this._navToEntityStep(this.getView().byId("entityStep"));
   this.vContEditTax = "X";
  },

  _navToEntityStep: function(step) {
   var that = this;

   function fnAfterNavigate() {
    that._oNavContainer.detachAfterNavigate(fnAfterNavigate);
   }

   this._oNavContainer.to(this._oWizardContentPage);
   this.oWizard.discardProgress(step);
   this.oWizard.goToStep(step);
   if (sap.ui.getCore().byId("entityRBG") !== undefined) {
    sap.ui.getCore().byId("entityRBG").setSelectedIndex(-1);
    that.oWizard.invalidateStep(this.getView().byId("entityStep"));
   }
   if (sap.ui.getCore().byId("selectDataListRBG") !== undefined)
    sap.ui.getCore().byId("selectDataListRBG").setSelectedIndex(-1);

   if (this.oCommunicationListRBG !== "") {
    try {
     this.oCommunicationListRBG.destroy();
     this.oCommunicationListRBG = "";
    } catch (err) {}
   }
  },

  setGeneralActionText: function(sCategory) {
   if (sCategory === "2") {
    sap.ui.getCore().byId("OrgRB").setVisible(true);
    sap.ui.getCore().byId("PersRB").setVisible(false);
    sap.ui.getCore().byId("ContactPerRB").setVisible(true);
   } else {
    sap.ui.getCore().byId("PersRB").setVisible(true);
    sap.ui.getCore().byId("OrgRB").setVisible(false);
    sap.ui.getCore().byId("ContactPerRB").setVisible(false);
   }
  },

  SetAllModelEmpty: function() {
   this.oAttach = []; //used for storing guid of attachment
   this.attachDataModel = ""; //used for storing data of attachment
   this.changedData = ""; //used for storing changed data 
   this.finalQueryModel = []; //used for storing final query for submit
   this.sumAdd = []; //used for storing fragment at review
   this.requestFrag = ""; //used for storing attachment fragment
   this.clearAllData();
   this.finalChangedArray = [];
   this.changeSet = [];
  },

  onReasonChange: function(oEvent) {
   this.vRequestReason = oEvent.getSource().getValue();
   if (this.vRequestReason.replace(/^[ ]+|[ ]+$/g, '') === "")
    oEvent.getSource().setValue("");
   this.setVisibleReviewButton();
  },

  onAttachmentChange: function() {
   this.setVisibleReviewButton();
  },

  entityPresentInReview: function(vEntity, vResult) {
   var status = false;
   for (var i = 0; i < this.aEntityValue.length; i++) {
    if (this.aEntityValue[i].split("-")[0] === vEntity && this.aEntityValue[i].split("-")[1] === vResult) {
     status = true;
    }
   }
   if (status) {
    status = false;
    return true;
   } else {
    return false;
   }
  },

  setVisibleReviewButton: function() {
   var status;
   var addressIndex = "";
   if (sap.ui.getCore().byId("selectDataListRBG") === undefined) {
    addressIndex = 0;
   } else {
    addressIndex = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
   }

   if (this.vCurrentEntity === "OrgRB" || this.vCurrentEntity === "PersRB") {
    this.vCurrentActionId = "changeRB";
   }
   if (this.vCurrentActionId === "changeRB") {
    switch (this.vCurrentEntity) {
     case "OrgRB":
     case "PersRB":
      status = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().PARTNER);
      if (status)
       this.oWizard.validateStep(this.getView().byId("requestStep"));
      break;
     case "communicationRB":
      status = this.entityPresentInReview(this.vCurrentEntity, this.oDetailComm.BP_AddressesRel.results[addressIndex].AD_ID);
      if (status)
       this.oWizard.validateStep(this.getView().byId("communicationStep"));
      break;
     case "BankRB":
      status = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.BankAccount.oBankRslts.BP_BankAccountsRel.results[
       addressIndex].BANKDETAILID);
      if (status)
       this.oWizard.validateStep(this.getView().byId("editStep"));
      break;
     case "ContactPerRB":
      status = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.ContactPerson.getCPModel().PARTNER2);
      if (status)
       this.oWizard.validateStep(this.getView().byId("editStep"));
      break;
     case "taxRB":
      status = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.TaxNumbers.oTaxResults.BP_TaxNumbersRel.results[
       addressIndex].TAXTYPE);
      if (status)
       this.oWizard.validateStep(this.getView().byId("editStep"));
      break;
    }
   }

   /**
    * @ControllerHook To Set the Review Button Visiblity
    * If customer extends the application with a new entity, the Review Button property has to be set
    * for the newly added entity
    * @callback Controller~extHookSetVisibleReviewButton
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookSetVisibleReviewButton() !== undefined) {
    this.extHookSetVisibleReviewButton(this);
   }
  },

  getFileUploadData: function(vlayout) {
   var requestFrag = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.RequestDetail', this);
   if (this.getView().byId(vlayout).addContent !== undefined) {
    this.getView().byId(vlayout).addContent(requestFrag);
   }
   if (this.getView().byId(vlayout).addItem !== undefined) {
    this.getView().byId(vlayout).addItem(requestFrag);
   }
   this.oFileUpload = requestFrag.getContent()[1].getContent()[0];
   this.oFileUpload._oList.setShowNoData(false);
   this.oFileUpload.setModel(this.attachDataModel, "json");
   this.oFileUpload.getBinding("items").refresh(true);
   this.oFileUpload.rerender();
   this.oRequestReason = requestFrag.getContent()[0].getContent()[2];
   this.oRequestReason.setValue(this.vRequestReason);
  },

  summaryofRequest: function() {
   if (this.oRequestDisplayFragment === "") {
    this.oRequestDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.DisplayRequestDetail", this);
   }
   this._oNavContainer.getPages()[1].getContent()[0].setVisible(true);
   this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].setVisible(true);
   if (this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent().length === 0) {
    this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].addContent(this.oRequestDisplayFragment);
   }
   var requestLayoutContent = this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent();
   var requestReason = requestLayoutContent[0].getContent()[0].getContent()[1].setText(this.vRequestReason);
   if (this.vRequestReason === "") {
    requestLayoutContent[0].getContent()[0].setVisible(false);
   } else {
    requestLayoutContent[0].getContent()[0].setVisible(true);
   }
   if (this.oAttach.length !== 0) {
    requestLayoutContent[0].getContent()[1].setVisible(true);
    requestLayoutContent[0].getContent()[1].getContent()[0].setVisible(true);
    var list = requestLayoutContent[0].getContent()[1].getContent()[0];
    list.setModel(new sap.ui.model.json.JSONModel());
    list.getModel().setData(JSON.parse(JSON.stringify(this.attachDataModel.getData())));
   } else {
    requestLayoutContent[0].getContent()[1].setVisible(false);
   }
   if (this.oAttach.length === 0 && this.vRequestReason === "") {
    requestLayoutContent[0].getContent()[0].getToolbar().setVisible(false);
   } else {
    requestLayoutContent[0].getContent()[0].getToolbar().setVisible(true);
   }

   // call function to display or hide the Duplicate message strip
   this.displayDuplicateMessage(this.oDuplicatesResult, this._oNavContainer);

   /**
    * @ControllerHook To Handle newly added field for request details
    * If customer extends the application with a new field in request details,
    * it can be handled here
    * @callback Controller~extHookSummaryofRequest
    * @param {object} this Controller Instance
    * @return { }
    */
   if (this.extHookSummaryofRequest() !== undefined) {
    this.extHookSummaryofRequest(this);
   }

  },

  setFinOdataError: function(vError, vErrorMsg, vCode) {
   this.sFinOdataError = vError;
   this.sFinOdataErrorMessage = vErrorMsg;
   this.vCRCode = vCode;
  },

  displayPageTitle: function(oModel) {
   this.getView().byId("reviewtitle").setText("");
   var titleText = this.i18nBundle.getText("REVIEW") + " : " + oModel.getData().DESCRIPTION +
    "(" + oModel.getData()
    .PARTNER + ")";
   this.getView().byId("reviewtitle").setText(titleText);
  },

  countryCPVH: function(country) {

   var oGlobalInstance = this;
   var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
   if (sap.ui.getCore().byId("CountryDialog") !== undefined) {
    sap.ui.getCore().byId("CountryDialog").destroy();
    this.oCountryValueHelp = "";
   }

   var oCountryDialog = new sap.m.SelectDialog({
    id: "CountryDialog",
    title: this.getView().getModel("i18n").getProperty("COUNTRIES"), //"Countries",
    noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...", //"Loading...",
    items: {
     path: "/CountryValues",
     template: new sap.m.StandardListItem({
      title: "{TEXT}",
      description: "{KEY}"
     })
    },
    confirm: function(oEvent) {
     //Set Country Value
     country.setValueState("None");
     country.setValueStateText("");
     country.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
     country.fireEvent("change");
     //Should differenciate between Bank Country Name and Address Country Name - Pending

    },
    search: function(oEvent) {
     var sValue = oEvent.getParameter("value").toUpperCase();
     sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
     var oItems = oCountryDialog.getItems();
     for (var i = 0; i < oItems.length; i++) {
      if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
       var sCtyName = oItems[i].getBindingContext().getProperty("KEY");
       var sCtyKey = oItems[i].getBindingContext().getProperty("TEXT");
       if (sCtyName.toUpperCase().indexOf(sValue) === -1 && sCtyKey.toUpperCase().indexOf(sValue) === -1) {
        oItems[i].setVisible(false);
       } else {
        oItems[i].setVisible(true);
       }
      } else {
       oItems[i].setVisible(true);
      }
     }
    },
    liveChange: function(oEvent) { //Search function on input help
     var sValue = oEvent.getParameter("value").toUpperCase();
     // to remove preceding and trialing spaces
     sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
     var oItems = oCountryDialog.getItems();
     for (var i = 0; i < oItems.length; i++) {
      if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
       var oCountryKey = oItems[i].getBindingContext().getProperty("KEY");
       var oCountryName = oItems[i].getBindingContext().getProperty("TEXT");
       if (oCountryKey.toUpperCase().indexOf(sValue) === -1 &&
        oCountryName.toUpperCase().indexOf(sValue) === -1) {
        oItems[i].setVisible(false);
       } else {
        oItems[i].setVisible(true);
       }
      } else {
       oItems[i].setVisible(true);
      }
     }
    }
   });

   if (oCountryResult.results.length > 0) {
    oCountryDialog.open();
    var oItemTemplate = new sap.m.StandardListItem({
     title: "{TEXT}",
     description: "{KEY}",
     active: true
    });
    var oInputHelpModel = new sap.ui.model.json.JSONModel();
    oInputHelpModel.setData(oCountryResult);
    oCountryDialog.setModel(oInputHelpModel);
    oCountryDialog.setGrowingThreshold(oCountryResult.results.length);
    oCountryDialog.bindAggregation("items", "/results", oItemTemplate);

   } else {
    oCountryDialog.setNoDataText(wizardController.i18nBundle.getText("NO_DATA"));
   }
   oCountryDialog.open();

  },

  getFieldValue: function(oEvent) {
   if (oEvent.getParameters().selectedItem !== undefined) {
    return oEvent.getSource().getModel().getData().results[0].ATTR_NAME;
   } else {
    return oEvent.getSource().mBindingInfos.value.parts[0].path.slice(1);
   }
  },

  isNull: function(value) {
   return typeof value === "undefined" || value === 'unknown' || value === null || value === 'null' || value === '' || parseInt(value) ===
    0;
  },
  _checkForSaveSuccessful: function(oData, oResponse, aErrorResponses) {
   var failed = false;
   var errName;
   var message = "ERROR_ON_SAVE";
   if (aErrorResponses && aErrorResponses instanceof Array && aErrorResponses.length) {
    failed = true;
    if (aErrorResponses[0].response && aErrorResponses[0].response.body) {
     if (JSON.parse(aErrorResponses[0].response.body).error.message.value) {
      errName = JSON.parse(aErrorResponses[0].response.body).error.message.value;
     } else
      errName = "";
    }
    this.showErrorDialog(errName);
   }
   return failed;
  },
  showErrorDialog: function(errorDetails) {
   if (errorDetails && errorDetails.trim()) {
    var errorObject = {};
    errorObject.details = errorDetails;
    sap.m.MessageBox.error(errorObject.details);
   } else {
    var failure = this.i18nBundle.getText("ERROR_ON_SAVE")
    sap.m.MessageBox.error(failure);
   }
  },

  getNewRecordIndex: function(entity) {
   switch (entity) {
    case "BP_Address":
     return fcg.mdg.editbp.handlers.Communication.oCreateModel.length + 1;
    case "BP_TaxNumber":
     return fcg.mdg.editbp.handlers.TaxNumbers.taxCreateModel.length + 1;
    case "BP_BankAccounts":
     return fcg.mdg.editbp.handlers.BankAccount.BankQueryModel.length + 1;
    case "BP_IdentificationNumbersRel":
     return fcg.mdg.editbp.handlers.Identification.oIDQueryModel.length + 1;
    case "BP_RelationPARTNER":
     return fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel.length + 1;
    default:
     return -1;
   }
   /**
    * @ControllerHook To get the newly created index of the record of the entity
    * If customer extends the application with a new entity, 
    * the created record index has to be set
    * @callback Controller~extHookGetNewRecordIndex
    * @param {object} this Controller Instance
    * @param {object} entity name
    * @return { }
    */
   if (this.extHookGetNewRecordIndex() !== undefined) {
    this.extHookGetNewRecordIndex(this, entity);
   }

  },

  extHookCheckEntitySelected: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookCheckEntitySelected
  },

  extHookCheckActionSelected: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookCheckActionSelected
  },

  extHookCheckDataListSelected: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookCheckDataListSelected
  },

  extHookSetRadioButtonText: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookSetRadioButtonText
  },

  extHookGoToActionStep: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookGoToActionStep
  },

  extHookGoToNextActionStep: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookGoToNextActionStep
  },

  extHookGoToSelectDataStep: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookGoToSelectDataStep
  },
  extWizardOnChange: function(oControllerInstance, oEvent, oMatchPro) {
   //Dummy Implementation for Hook Method - extWizardOnChange
  },
  extHookOnWizardComplete: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookOnWizardComplete
  },
  extHookUndoEntityData: function(oControllerInstance, oEvent) {
   //Dummy Implementation for Hook Method - extHookUndoEntityData                                
  },
  extHookSubmitButtonState: function(oControlerInstance) {
   //Dummy Implementation for Hook Method - extHookSubmitButtonState                                          
  },
  extHookOnSubmit: function(oControllerInstance, oBatchChanges, oModel) {
   //Dummy Implementation for Hook Method - extHookSubmitButtonState                                          
  },
  extHookSetVisibleReviewButton: function(oControlerInstance) {
   //Dummy Implementation for Hook Method - extHookSetVisibleReviewButton                
  },
  extHookGetNewRecordIndex: function(oControllerInstance, entity) {
   //Dummy Implementation for Hook Method - extHookSetVisibleReviewButton                
  },
  extHookSummaryofRequest: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookSummaryofRequest        
  },
  extHookClearHandlerVariables: function(oControllerInstance) {
   //Dummy Implementation for Hook Method - extHookClearHandlerVariables        
  },
  bpHookModifyRelQueryCall: function(sQuery1, oControllerInstance) {
   /**
    * @ControllerHook To modify the Asynchronus query all tab data and modify the response
    * Customer can modify the data as per his requirements before tapping on other tabs than General
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyRelQueryCall
    * @param {object} result Query
    * @param {object} handler instance
    * @return {object} result Modified query
    */
   if (this.extHookbpHookModifyRelQueryCall) {
    var extModifiedData = this.extHookbpHookModifyRelQueryCall(sQuery1, oControllerInstance);
    return extModifiedData;
   }
  },
  bpHookReadAddressData: function(oHandler, sQuery, oResponse) {
   /**
    * @ControllerHook To modify the query for getting address data
    * Customer can modify the data as per his requirements before loading the layouts and binding the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookReadAddressData
    * @param {object} handler instance
    * @param {object} result Query
    * @param {object} result Response
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookReadAddressData) {
    var extModifiedData = this.extHookbpHookReadAddressData(oHandler, sQuery, oResponse);
    return extModifiedData;
   }
  },

  bpHookModifygetContactPersonData: function(sQuery1, oResponse) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifygetContactPersonData
    * @param {object} result Query
    * @param {object} result Response
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifygetContactPersonData) {
    var extModifiedData = this.extHookbpHookModifygetContactPersonData(sQuery1, oResponse);
    return extModifiedData;
   }
  },

  bpHookModifygetAddressData: function(sQuery1, oResponse) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifygetAddressData
    * @param {object} result Query
    * @param {object} result Response
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifygetAddressData) {
    var extModifiedData = this.extHookbpHookModifygetAddressData(sQuery1, oResponse);
    return extModifiedData;
   }
  },

  bpHookModifyCreateContactPerson: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyCreateContactPerson
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifyCreateContactPerson) {
    var extModifiedData = this.extHookbpHookModifyCreateContactPerson(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifyLoadWPToolBar: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyLoadWPToolBar
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifyLoadWPToolBar) {
    var extModifiedData = this.extHookbpHookModifyLoadWPToolBar(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifyCPCreateModel: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyCPCreateModel
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifyCPCreateModel) {
    var extModifiedData = this.extHookbpHookModifyCPCreateModel(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifyCPDeleteModel: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyCPDeleteModel
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifyCPDeleteModel) {
    var extModifiedData = this.extHookbpHookModifyCPDeleteModel(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifyCPChangeModel: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyCPChangeModel
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifyCPChangeModel) {
    var extModifiedData = this.extHookbpHookModifyCPChangeModel(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifygetIdentificationData: function(sQuery1, oResponse) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifygetIdentificationData
    * @param {object} result Query
    * @param {object} result Response
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifygetIdentificationData) {
    var extModifiedData = this.extHookbpHookModifygetIdentificationData(sQuery1, oResponse);
    return extModifiedData;
   }
  },

  bpHookModifycreateIdentification: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifycreateIdentification
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifycreateIdentification) {
    var extModifiedData = this.extHookbpHookModifycreateIdentification(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifyIDDeleteModel: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyIDDeleteModel
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifyIDDeleteModel) {
    var extModifiedData = this.extHookbpHookModifyIDDeleteModel(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifyIDCreateModel: function(oControllerInstance) {
   /**
    * @ControllerHook To modify the query for general data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyIDCreateModel
    * @param {object} handler instance
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookModifyIDCreateModel) {
    var extModifiedData = this.extHookbpHookModifyIDCreateModel(oControllerInstance);
    return extModifiedData;
   }
  },

  bpHookModifyBankAccounts: function(sQuery1, oResponse, oBankInstance) {
   /**
    * @ControllerHook To modify the query for Bank data change scenario and modify the response
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankAccounts
    * @param {object} result Query
    * @param {object} result Response
    * @param {object} handler instance
    * @return {object}  Modified Data
    */
   if (this.extHookbpHookModifyBankAccounts) {
    var extModifiedData = this.extHookbpHookModifyBankAccounts(sQuery1, oResponse, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBanklayout: function(oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Create bank layout and modify
    * Customer can modify the data as per his requirements before loading the layouts and bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBanklayout
    * @param {object} Bank layout data
    * @param {object} handler instance
    * @return {object}  Modified Data
    */
   if (this.extHookbpHookModifyBanklayout) {
    var extModifiedData = this.extHookbpHookModifyBanklayout(oController, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBankCreateModel: function(oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Bank bank create model and modify the model
    * Customer can modify the data as per his requirements before  bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankCreateModel
    * @param {object} Bank layout data
    * @param {object} handler instance
    * @return {object}  Modified Data
    */
   if (this.extHookbpHookModifyBankCreateModel) {
    var extModifiedData = this.extHookbpHookModifyBankCreateModel(oController, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBankChangeModel: function(oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Bank bank change model and modify the model
    * Customer can modify the data as per his requirements before  bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankChangeModel
    * @param {object} Bank layout data
    * @param {object} handler instance
    * @return {object}  Modified Data
    */
   if (this.extHookbpHookModifyBankChangeModel) {
    var extModifiedData = this.extHookbpHookModifyBankChangeModel(oController, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBankDeleteModel: function(oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Bank bank Delete model and modify the model
    * Customer can modify the data as per his requirements before  bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankDeleteModel
    * @param {object} Bank layout data
    * @param {object} handler instance
    * @return {object}  Modified Data
    */
   if (this.extHookbpHookModifyBankDeleteModel) {
    var extModifiedData = this.extHookbpHookModifyBankDeleteModel(oController, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBankUndoChanges: function(sQuery, oModel, oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Bank bank Delete model and modify the model
    * Customer can modify the data as per his requirements before  bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankUndoChanges
    * @param {object} Query
    * @param {object} Model data
    * @param {object} Controller data
    * @param {object} handler instance
    * @return {object}  Bank Data
    */
   if (this.extHookbpHookModifyBankUndoChanges) {
    var extModifiedData = this.extHookbpHookModifyBankUndoChanges(sQuery, oModel, oController, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBankCountryValueHelp: function(sProperty, oCountryDialog, oControlEvent, oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Bank bank Delete model and modify the model
    * Customer can modify the data as per his requirements before  bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankCountryValueHelp
    * @param {object} property
    * @param {object} dialog
    * @param {object} event
    * @param {object} Controller data
    * @param {object} handler instance
    * @return {object}  Bank Data
    */
   if (this.extHookbpHookModifyBankCountryValueHelp) {
    var extModifiedData = this.extHookbpHookModifyBankCountryValueHelp(sProperty, oCountryDialog, oControlEvent, oController,
     oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBankKeyValueHelp: function(sProperty, oControlEvent, oSelectDialog, oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Bank bank Delete model and modify the model
    * Customer can modify the data as per his requirements before  bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankKeyValueHelp
    * @param {object} property
    * @param {object} event
    * @param {object} dialog
    * @param {object} Controller data
    * @param {object} handler instance
    * @return {object}  Bank Data
    */
   if (this.extHookbpHookModifyBankKeyValueHelp) {
    var extModifiedData = this.extHookbpHookModifyBankKeyValueHelp(sProperty, oControlEvent, oSelectDialog, oController, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookModifyBankDeriveIban: function(sProperty, oControlEvent, query, oController, oBankInstance) {
   /**
    * @ControllerHook To modify the Bank bank Delete model and modify the model
    * Customer can modify the data as per his requirements before  bindging the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookModifyBankDeriveIban
    * @param {object} property
    * @param {object} event
    * @param {object} query
    * @param {object} Controller data
    * @param {object} handler instance
    * @return {object}  Bank Data
    */
   if (this.extHookbpHookModifyBankDeriveIban) {
    var extModifiedData = this.extHookbpHookModifyBankDeriveIban(sProperty, oControlEvent, query, oController, oBankInstance);
    return extModifiedData;
   }
  },
  bpHookOnChangeOfAddress: function(oHandler, oWController) {
   /**
    * @ControllerHook To modify the model for display,query during change of Address
    * Customer can modify the data as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookOnChangeOfAddress
    * @param {object} handler instance
    * @param {object} controller instance
    */
   if (this.extHookbpHookOnChangeOfAddress) {
    this.extHookbpHookOnChangeOfAddress(oHandler, oWController);
   }
  },
  bpHookOnCreateOfAddress: function(oHandler, oWController) {
   /**
    * @ControllerHook To modify the model for display,query during create of Address
    * Customer can modify the data as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookOnCreateOfAddress
    * @param {object} handler instance
    * @param {object} controller instance
    * @return { }
    */
   if (this.extHookbpHookOnCreateOfAddress) {
    this.extHookbpHookOnCreateOfAddress(oHandler, oWController);
   }
  },
  bpHookCreateAddressDescrText: function(oHandler, oAddress) {
   /**
    * @ControllerHook To modify the model for display of the address description
    * Customer can modify the data as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookCreateAddressDescrText
    * @param {object} handler instance
    * @param {object} address model
    * @return {object} result Modified Address
    */
   if (this.extHookbpHookCreateAddressDescrText) {
    var extModifiedAdddress = this.extHookbpHookCreateAddressDescrText(oHandler, oAddress);
    return extModifiedAdddress;
   }
  },
  bpHookReadGenData: function(oHandler, vQuery, oDetailGeneralData) {
   /**
    * @ControllerHook To query the model for General Data
    * Customer can modify the data as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookReadGenData
    * @param {object} handler instance
    * @param {object} query for the model
    * @param {object} data model
    * @return {object} result General Data
    */
   if (this.extHookbpHookReadGenData) {
    var extModifiedAdddress = this.extHookbpHookReadGenData(oHandler, vQuery, oDetailGeneralData);
    return extModifiedGenData;
   }
  },
  bpHookGeneralVH: function(oHandler) {
   /**
    * @ControllerHook To query the value help for General Data
    * Customer can modify the value help as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookGeneralVH
    * @param {object} handler instance
    * @return {object} result General Data Value Help
    */
   if (this.extHookbpHookGeneralVH) {
    var extModifiedVH = this.extHookbpHookGeneralVH(oHandler);
    return extModifiedVH;
   }
  },
  bpHookGenCreateSubmitQuery: function(oGenDataQueryModel) {
   /**
    * @ControllerHook To form the query model for the general data
    * Customer can modify the value help as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookGenCreateSubmitQuery
    * @param {object} handler instance
    * @return {object} result General Data
    */
   if (this.extHookbpHookGenCreateSubmitQuery) {
    var extModifiedModel = this.extHookbpHookGenCreateSubmitQuery(oGenDataQueryModel);
    return extModifiedModel;
   }
  },
  bpHookSetDeepEntityCount: function(oHandler, oResult, index) {
   /**
    * @ControllerHook To form the count for the deep entity of the selected address
    * Customer can modify the value help as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookSetDeepEntityCount
    * @param {object} handler instance
    * @param {object} result model of address
    * @param {number} index of the selected address
    * @param{object} index of the address
    */
   if (this.extHookbpHookSetDeepEntityCount) {
    this.extHookbpHookSetDeepEntityCount(oHandler, oResult, index);
   }
  },
  bpHookSetSelectRecordLayout: function(oHandler, result, strResults) {
   /**
    * @ControllerHook To form the layout to select the address to be changed
    * Customer can modify the value help as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookSetSelectRecordLayout
    * @param {object} handler instance
    * @param {object} result model of address
    * @param {object} string/descriptions of the address
    * @return {object} result set for descriptions
    */
   if (this.extHookbpHookSetSelectRecordLayout) {
    var extModifiedResult = this.extHookbpHookSetSelectRecordLayout(oHandler, result, strResults);
    return extModifiedResult;
   }
  },
  bpHookAddressModelHandling: function(oHandler, address, sAction) {
   /**
    * @ControllerHook To handle the address model for change
    * Customer can modify the value help as per his requirements 
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddressModelHandling
    * @param {object} handler instance
    * @param {object} result model of address
    * @param {variable} Action ID
    * @return {object} result set for address
    */
   if (this.extHookbpHookAddressModelHandling) {
    var extModifiedResult = this.extHookbpHookAddressModelHandling(oHandler, address, sAction);
    return extModifiedResult;
   }
  },

  bpHookReadTaxData: function(oHandler, sQuery, oResponse) {
   /**
    * @ControllerHook To modify the query for getting tax data
    * Customer can modify the data as per his requirements before loading the layouts and binding the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookReadTaxData
    * @param {object} handler instance
    * @param {object} result Query
    * @param {object} result Response
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookReadTaxData) {
    var extModifiedData = this.extHookbpHookReadTaxData(oHandler, sQuery, oResponse);
    return extModifiedData;
   }
  },
  bpHookCreateTaxData: function(oHandler, oModel) {
   /**
    * @ControllerHook To modify the model for creating tax data
    * Customer can modify the data as per his requirements before loading the layouts and binding the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookCreateTaxData
    * @param {object} handler instance
    * @param {object} model
    * @return {object} result Modified Data
    */
   if (this.extHookbpHookCreateTaxData) {
    var extModifiedData = this.extHookbpHookCreateTaxData(oHandler, oModel);
    return extModifiedData;
   }
  },
  bpHookChangeTaxData: function(oHandler, oQueryModel, oDataModel) {
   /**
    * @ControllerHook To modify the model for changing tax data
    * Customer can modify the data as per his requirements before loading the layouts and binding the data
    * The modified model will have two properties - oQueryModel and oDataModel
    * @callback fcg.mdg.editbp.controller~extHookbpHookChangeTaxData
    * @param {object} handler instance
    * @param {object} query model for submitting changes
    * @param {object} odata model for display
    * @return {object} result Modified Data with 2 properties to store queryModel and oDataModel
    */
   if (this.extHookbpHookChangeTaxData) {
    var extModifiedData = this.extHookbpHookChangeTaxData(oHandler, oQueryModel, oDataModel);
    return extModifiedData;
   }
  },
  bpHookDeleteTaxData: function(oHandler, oModel) {
   /**
    * @ControllerHook To modify the model for deleting tax data
    * Customer can modify the data as per his requirements before loading the layouts and binding the data
    * @callback fcg.mdg.editbp.controller~extHookbpHookDeleteTaxData
    * @param {object} handler instance
    * @param {object} model
    * @return {object} result Modified Data 
    */
   if (this.extHookbpHookDeleteTaxData) {
    var extModifiedData = this.extHookbpHookDeleteTaxData(oHandler, oModel);
    return extModifiedData;
   }
  },
  bpHookAddressSubmitChangeQuery: function(oHandler, queryChngModel) {
   /**
    * @ControllerHook To modify the model for forming the query for change address
    * Customer can modify the data as per his requirements and should manipulate the query model
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddressSubmitChangeQuery
    * @param {object} handler instance
    * @param {object} query model which has to be changed
    * @return {object} result Modified Data 
    */
   if (this.extHookbpHookAddressSubmitChangeQuery) {
    var extModifiedData = this.extHookbpHookAddressSubmitChangeQuery(oHandler, queryChngModel);
    return extModifiedData;
   }
  },

  bpHookAddressSubmitCreateQuery: function(oHandler, queryCrtModel) {
   /**
    * @ControllerHook To modify the model for forming the query for create address
    * Customer can modify the data as per his requirements and should manipulate the query model
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddressSubmitCreateeQuery
    * @param {object} handler instance
    * @param {object} query model which has to be changed
    * @return {object} result Modified Data 
    */
   if (this.extHookbpHookAddressSubmitCreateeQuery) {
    var extModifiedData = this.extHookbpHookAddressSubmitCreateeQuery(oHandler, queryCrtModel);
    return extModifiedData;
   }
  },

  bpHookReadCommunicationData: function(oHandler, vQuery) {
   /**
    * @ControllerHook To modify the model for forming the query for reading the communication and other deep entities
    * Customer can modify the data as per his requirements and should manipulate the query model
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookReadCommunicationData
    * @param {object} handler instance
    * @param {object} query model which has to be changed
    * @return {object} result Modified Data 
    */
   if (this.extHookbpHookReadCommunicationData) {
    var extModifiedData = this.extHookbpHookReadCommunicationData(oHandler, queryCrtModel);
    return extModifiedData;
   }
  },

  bpHookDisplayIAV: function(oHanlder, oWController, oModelData) {
   /**
    * @ControllerHook To modify the display of additional field on IAV in address
    * Customer can modify the data as per his requirements and should manipulate the query model
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookDisplayIAV
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} model data
    */
   if (this.extHookbpHookDisplayIAV) {
    this.extHookbpHookDisplayIAV(oHanlder, oWController, oModelData);
   }
  },

  bpHooksetDispAddressTitle: function(oHandler, oWController, displayCommForm) {
   /**
    * @ControllerHook To modify the display of address header in review page
    * Customer can modify the data as per his requirements and should manipulate header text
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHooksetDispAddressTitle
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} model data
    */
   if (this.extHookbpHooksetDispAddressTitle) {
    this.extHookbpHooksetDispAddressTitle(oHandler, oWController, displayCommForm);
   }
  },

  bpHookAddNewTelAddress: function(oHandler, oWController, hBox) {
   /**
    * @ControllerHook To add a field against the Telephone field in Communication part of the address
    * Customer can add the field as per his requirements
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewTelAddress
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} hbox container data to which the element has to be addded
    */
   if (this.extHookbpHookAddNewTelAddress) {
    this.extHookbpHookAddNewTelAddress(oHandler, oWController, hBox);
   }
  },

  bpHookAddNewMobAddress: function(oHandler, oWController, hBox) {
   /**
    * @ControllerHook To add a field against the Mobile field in Communication part of the address
    * Customer can modify the data as per his requirements and should manipulate header text
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewMobAddress
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} hbox container data to which the element has to be added
    */
   if (this.extHookbpHookAddNewMobAddress) {
    this.extHookbpHookAddNewMobAddress(oHandler, oWController, hBox);
   }
  },

  bpHookAddNewFaxAddress: function(oHandler, oWController, hBox) {
   /**
    * @ControllerHook To add a field against the Fax field in Communication part of the address
    * Customer can modify the data as per his requirements and should manipulate header text
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewFaxAddress
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} hbox container data to which the element has to be added
    */
   if (this.extHookbpHookAddNewFaxAddress) {
    this.extHookbpHookAddNewFaxAddress(oHandler, oWController, hBox);
   }
  },
  bpHookAddNewEmailAddress: function(oHandler, oWController, hBox) {
   /**
    * @ControllerHook To add a field against the Email field in Communication part of the address
    * Customer can modify the data as per his requirements and should manipulate header text
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewEmailAddress
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} hbox container data to which the element has to be added
    */
   if (this.extHookbpHookAddNewEmailAddress) {
    this.extHookbpHookAddNewEmailAddress(oHandler, oWController, hBox);
   }
  },
  bpHookAddNewURIAddress: function(oHandler, oWController, hBox) {
   /**
    * @ControllerHook To add a field against the Mobile field in Communication part of the address
    * Customer can modify the data as per his requirements and should manipulate header text
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewURIAddress
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} hbox container data to which the element has to be added
    */
   if (this.extHookbpHookAddNewURIAddress) {
    this.extHookbpHookAddNewURIAddress(oHandler, oWController, hBox);
   }
  },
  bpHookAddNewIAVAddress: function(oHandler, oWController, oNewForm) {
   /**
    * @ControllerHook To add a field against the IAV field in IAV part of the address
    * Customer can modify the data as per his requirements and should manipulate header text
    * to prepare the approproriate query
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewIAVAddress
    * @param {object} handler instance
    * @param {object} controller instance
    * @param {object} form container to which the field has to be added
    */
   if (this.extHookbpHookAddNewIAVAddress) {
    this.extHookbpHookAddNewIAVAddress(oHandler, oWController, oNewForm);
   }
  },
  bpHookDisplayWPAddress: function(oModelData, cpLayout, wizardController, handlerInstance, formElementIndex) {
   /**
    * @ControllerHook To add a field to display the workplace address for contact person
    * Customer can modify the data as per his requirements and should manipulate display fields
    * THIS IS NOT VALID - USE bpHookDisplayWPAddressCP 
    * @callback fcg.mdg.editbp.controller~extHookbpHookDisplayWPAddress
    * @param {object} model data
    * @param {object} contact person layout
    * @param {object} wizard instance
    * @param {object} handler instance
    * @param {object} element index for Contact Person
    */
   if (this.extHookbpHookDisplayWPAddress) {
    this.extHookbpHookDisplayWPAddress(oModelData, cpLayout, wizardController, handlerInstance, formElementIndex);
   }
  },
  bpHookDisplayWPAddressCP: function(oModelData, cpLayout, wizardController, handlerInstance, formElementIndex, i) {
   /**
    * @ControllerHook To add a field to display the workplace address for contact person
    * Customer can modify the data as per his requirements and should manipulate display fields
    * @callback fcg.mdg.editbp.controller~extHookbpHookDisplayWPAddressCP
    * @param {object} model data
    * @param {object} contact person layout
    * @param {object} wizard instance
    * @param {object} handler instance
    * @param {object} element index for Contact Person
    * @param {object} current index for model
    */
   if (this.extHookbpHookDisplayWPAddressCP) {
    this.extHookbpHookDisplayWPAddressCP(oModelData, cpLayout, wizardController, handlerInstance, formElementIndex, i);
   }
  },
  bpHookAddNewWPAddress: function(handlerInstance, formId) {
   /**
    * @ControllerHook To add a field to edit the workplace address for contact person
    * Customer can modify the data as per his requirements and should manipulate edit fields
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewWPAddress
    * @param {object} handler instance
    * @param {object} form index for Contact Person
    */
   if (this.extHookbpHookAddNewWPAddress) {
    this.extHookbpHookAddNewWPAddress(handlerInstance, formId);
   }
  },
  bpHookSetEnabledWPFields: function(handlerInstance, wpId) {
   /**
    * @ControllerHook To manipulate a field to edit the workplace address for contact person
    * Customer can modify the data as per his requirements and should manipulate edit fields
    * THIS IS NOT VALID - USE bpHookAddNewWPAddressCP 
    * @callback fcg.mdg.editbp.controller~extHookbpHookSetEnabledWPFields
    * @param {object} handler instance
    * @param {object} index for the Workplace address
    */
   if (this.extHookbpHookSetEnabledWPFields) {
    this.extHookbpHookSetEnabledWPFields(handlerInstance, wpId);
   }
  },
  bpHookAddNewWPAddressCP: function(handlerInstance, formId, oNewForm) {
   /**
    * @ControllerHook To add a field to edit the workplace address for contact person
    * Customer can modify the data as per his requirements and should manipulate edit fields
    * @callback fcg.mdg.editbp.controller~extHookbpHookAddNewWPAddressCP
    * @param {object} handler instance
    * @param {object} form index for Contact Person
    * @param {object} form instance
    */
   if (this.extHookbpHookAddNewWPAddressCP) {
    this.extHookbpHookAddNewWPAddressCP(handlerInstance, formId, oNewForm);
   }
  },
  bpHookDisplayCommunicationAddress: function(wizardController, oModel, vtxt, vlbl, vText, handlerInstance, formElementIndex,
   displayCommForm, i) {
   /**
    * @ControllerHook To manipulate a comminication field to review in address
    * Customer can modify the data as per his requirements and should manipulate review fields
    * @callback fcg.mdg.editbp.controller~extHookbpHookDisplayCommunicationAddress
    * @param {object} controller instance
    * @param {object} model data
    * @param {object} text to be displayed
    * @param {object} label to be binded
    * @param {object} visibility flag
    * @param {object} handler instance
    * @param {object} element index in the form
    * @param {object} form instance
    * @param {object} index
    */
   if (this.extHookbpHookDisplayCommunicationAddress) {
    this.extHookbpHookDisplayCommunicationAddress(wizardController, oModel, vtxt, vlbl, vText, handlerInstance, formElementIndex,
     displayCommForm, i);
   }
  }

 });
});