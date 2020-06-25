/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.util.DataAccess");
fcg.mdg.editbp.util.DataAccess = {
 oChangedModel: "",
 oCurrentModel: "",
 oQueryModel: "",
 owizardController: "",
 oCPResults: "",
 oTNResults: "",
 aData: [],
 i18nModel: "",
 oValueHelpResult: "",
 aMatchProMandt: [],
 fromWizard: 0,
 selectedRecord: null,
 valueHelp: function(oController) {
  var oResult = "";
  var commonUrlPart = "/ValueHelpCollection?$filter=";
  var oBatchModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
  var aBatchOperation = [];

  var vATValuesURL = commonUrlPart + jQuery.sap.encodeURL("ENTITY eq 'BP_Person' and ATTR_NAME eq 'TITLE_ACA1'");
  var oBatchOperation1 = oBatchModel.createBatchOperation(vATValuesURL, "GET");
  aBatchOperation.push(oBatchOperation1);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vMSValues = commonUrlPart + jQuery.sap.encodeURL("ENTITY eq 'BP_Person' and ATTR_NAME eq 'MARITALSTATUS'");
  var oBatchOperation2 = oBatchModel.createBatchOperation(vMSValues, "GET");
  aBatchOperation.push(oBatchOperation2);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vCorrLangValues = commonUrlPart + jQuery.sap.encodeURL(
   "ENTITY eq 'BP_Person' and FILTER eq 'CORRESPONDLANGUAGEISO=' and ATTR_NAME eq 'CORRESPONDLANGUAGE'");
  var oBatchOperation3 = oBatchModel.createBatchOperation(vCorrLangValues, "GET");
  aBatchOperation.push(oBatchOperation3);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vPersTitleValues = commonUrlPart + jQuery.sap.encodeURL(
   "ENTITY eq 'BP_Root' and FILTER eq 'CATEGORY=1' and ATTR_NAME eq 'TITLE_KEY'");
  var oBatchOperation4 = oBatchModel.createBatchOperation(vPersTitleValues, "GET");
  aBatchOperation.push(oBatchOperation4);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vOrgTitleValues = commonUrlPart + jQuery.sap.encodeURL(
   "ENTITY eq 'BP_Root' and FILTER eq 'CATEGORY=2' and ATTR_NAME eq 'TITLE_KEY'");
  var oBatchOperation5 = oBatchModel.createBatchOperation(vOrgTitleValues, "GET");
  aBatchOperation.push(oBatchOperation5);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vCountryValues = commonUrlPart + jQuery.sap.encodeURL("ENTITY eq 'BP_Address' and ATTR_NAME eq 'COUNTRY'");
  var oBatchOperation6 = oBatchModel.createBatchOperation(vCountryValues, "GET");
  aBatchOperation.push(oBatchOperation6);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vAddrVersValues = commonUrlPart + jQuery.sap.encodeURL("ENTITY eq 'BP_WorkplaceIntAddressVers' and ATTR_NAME eq 'ADDR_VERS'");
  var oBatchOperation7 = oBatchModel.createBatchOperation(vAddrVersValues, "GET");
  aBatchOperation.push(oBatchOperation7);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vPerIdentificationValues = commonUrlPart + jQuery.sap.encodeURL(
   "ENTITY eq 'BP_IdentificationNumber' and ATTR_NAME eq 'IDENTIFICATIONTYPE' and FILTER eq 'BU_TYPE=1'");
  var oBatchOperation8 = oBatchModel.createBatchOperation(vPerIdentificationValues, "GET");
  aBatchOperation.push(oBatchOperation8);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vTaxTypeValues = commonUrlPart + jQuery.sap.encodeURL("ENTITY eq 'BP_TaxNumber' and ATTR_NAME eq 'TAXTYPE'");
  var oBatchOperation9 = oBatchModel.createBatchOperation(vTaxTypeValues, "GET");
  aBatchOperation.push(oBatchOperation9);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  var vOrgIdentificationValues = commonUrlPart + jQuery.sap.encodeURL(
   "ENTITY eq 'BP_IdentificationNumber' and ATTR_NAME eq 'IDENTIFICATIONTYPE' and FILTER eq 'BU_TYPE=2'");
  var oBatchOperation10 = oBatchModel.createBatchOperation(vOrgIdentificationValues, "GET");
  aBatchOperation.push(oBatchOperation10);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);

  aBatchOperation = [];
  oBatchModel.submitBatch(function(odata, response) {
   oResult = odata.__batchResponses;
  }, null, false);
  oBatchModel.clearBatch();
  this.oValueHelpResult = oResult;
  return oResult;
 },
 setFromWizardFlag: function(fromWizard){
     this.fromWizard=fromWizard;
    },
    setSelectedRecord: function(rowId){
     this.selectedRecord=rowId;
    },
 getValueHelpData: function() {
  if (this.oValueHelpResult !== "") {
   return this.oValueHelpResult;
  } else {
   this.valueHelp();
  }
 },
 readData: function(query, oController) {
  var oResult = null;
  var oDataModel = new sap.ui.model.odata.ODataModel(oController.getView().getModel().sServiceUrl, false);
  oDataModel.read(
   query,
   null,
   null,
   false,
   function(response) {
    oResult = response;
   });
  return oResult;
 },

 readDataAsynchronous: function(query, oController, fCallback) {
  var oResult = null;
  var oDataModel = new sap.ui.model.odata.ODataModel(oController.getView().getModel().sServiceUrl, false);
  oDataModel.read(
   query,
   null,
   null,
   true,
   function(response) {
    fCallback(response);
   }, function(oError) {
    fCallback();
   });
  return oResult;
 },

 checkCurrentModel: function() {
  if (this.oCurrentModel === "") {
   return false;
  } else {
   return true;
  }
 },

 setCurrentModel: function(oModel) {
  this.oCurrentModel = oModel;
 },

 getCurrentModel: function() {
  return this.oCurrentModel;
 },

 getAddressData: function(oCustomerModel, vPath, s1Controller) {
  this.oS3Controller = s1Controller;
  var vCompletePath = vPath; //The URL till $expand=; 
  var vBasePath = 'BP_AddressesRel/';
  vCompletePath = vCompletePath + vBasePath;
  return vCompletePath;
 },
 getDataFromPath: function(obj, path) {
  var parts = path.split("/");
  if (parts.length === 1) {
   return obj[parts[0]];
  }
  return this.getDataFromPath(obj[parts[0]], parts.slice(1).join("/"));
 },

 changedEntries: function(oChangedModel, oQueryModel) {
  this.oChangedModel = oChangedModel;
  this.oQueryModel = oQueryModel;
 },

 setTNResults: function(result) {
  this.oTNResults = result;
 },

 getTNResults: function() {
  return this.oTNResults;
 },

 addBatchOperation: function(oModel, vPath, aBatchOperation) {
  var oBatchOperation = oModel.createBatchOperation(vPath, "GET");
  aBatchOperation.push(oBatchOperation);
  oModel.clearBatch();
  oModel.addBatchReadOperations(aBatchOperation);
 },

 performSubmitBatch: function(oModel, oS3Controller) {
  var oLocalIns = this;
  var vError = false;
  var i = "";
  this.aData = [];
  oModel
   .submitBatch(
    function(odata, response) {
     var errorMessage = "";
     var vCode = "";
     for (i = 0; i < response.data.__batchResponses.length; i++) {
      var sData = response.data.__batchResponses[i];
      oLocalIns.aData.push(sData);
      if (sData.response !== undefined) {
       for (i = 0; i < jQuery
        .parseJSON(sData.response.body).error.innererror.errordetails.length; i++) {
        if (errorMessage !== "") {
         errorMessage = errorMessage + "\n";
        }
        errorMessage = errorMessage + jQuery.parseJSON(sData.response.body).error.innererror.errordetails[i].message;
        vCode = vCode + jQuery.parseJSON(sData.response.body).error.innererror.errordetails[i].code;
        vError = true;
       }
      }
     }
     if (oS3Controller !== undefined) {
      oS3Controller.setFinOdataError(vError,
       errorMessage, vCode); // call the setter function
      // to set these values
     }
    }, null, false);
 },

 getBatchData: function() {
  return this.aData;
 },

 seti18nModel: function(i18n) {
  this.i18nModel = i18n;
 },

 readMatchProfileFields: function(oModel) {
  var oEntities = oModel.getServiceMetadata().dataServices.schema[0].entityType;
  // There are several entities for this model. Loop at all entities of the model
  for (var i = 0; i < oEntities.length; i++) {
   if (oEntities[i].property !== undefined) {

    // Loop at attributes of each entity
    for (var j = 0; j < oEntities[i].property.length; j++) {
     if (oEntities[i].property[j].extensions !== undefined) {
      // Each attribute contains several default properties along with additional annotations
      // Loop at properties of each model
      for (var k = 0; k < oEntities[i].property[j].extensions.length; k++) {
       // If match profile attribute annotation is set for this attribute, add this to
       // Match Profile Array along with its entity name. Entity name is required for Search/Duplicate check
       if (oEntities[i].property[j].extensions[k].name === "IS_MATCH_PROFILE_ATTR" && oEntities[i].property[j].extensions[k].value ===
        "X") {
        var matchProField = {
         attr: oEntities[i].property[j].name,
         entity: oEntities[i].name
        };
        this.aMatchProMandt.push(matchProField);
       }
       // If match profile attribute mandatory annotation is set, add this to following array.
       // Search/Duplicate Check would be triggered if at least one mandatory field is present for the configured match profile
       if (oEntities[i].property[j].extensions[k].name === "IS_MATCH_PROFILE_MAND" && oEntities[i].property[j].extensions[k].value ===
        "X") {
        for (var l = 0; l < oEntities[i].property[j].extensions.length; l++) {
         if (oEntities[i].property[j].extensions[l].name === "label") {
          this.mandatoryFieldsStr = this.mandatoryFieldsStr + oEntities[i].property[j].extensions[l].value + ",";
          break;
         }
        }
        this.aMatchProMandt.push(oEntities[i].property[j].name);
       }
      }
     }
    }
   }
  }
  // If there are no match profile fields, hide the icon tab filter for duplicate check

 },

 setCtrlInstance: function(controller) {
  this.owizardController = controller;
 },

 //getting the Time dependancy Switch value for ContactPersonIAV 
 getTimeDependecy: function(oModel) {
  var oEntities = oModel.getServiceMetadata().dataServices.schema[0].entityType;
  var timeDependency = "",
   extensions = "";

  for (var j = 0; j < oEntities.length; j++) {
   if (oEntities[j].name === "BP_Root") {
    extensions = oEntities[j].extensions;
    break;
   }
  }

  if (extensions === "") {
   return timeDependency;
  }

  for (var i = 0; i < extensions.length; i++) {
   if (extensions[i].name === "IsTdRelSwitchActive") {
    timeDependency = extensions[i].value;
    return timeDependency;
   }
  }
  return timeDependency;
 }
};