/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.BankAccount");
jQuery.sap.require("fcg.mdg.editbp.util.DataAccess");

fcg.mdg.editbp.handlers.BankAccount = {
 oBankAccontLayout: "",
 BankQueryModel: [],
 oBankModel: "",
 vBankCreated: 0,
 i18nModel: "",
 vReEditIndex: "",
 oReEditModel: "",
 oReEditChngModel: "",
 oBankRslts: "",
 BankChngQueryModel: [],
 oWizrdCntrlr: "",
 vBankChanged: 0,
 aCreatedBankId: [],
 aDeletedBankId: [],
 bankKeySearchResult: "",
 oBankValueItemTemp: "",
 oBankKeySearchResult: "",
 oChngBankModel: "",
 oDltBankModel: "",
 BankDltQueryModel: [],
 aChangedBanks: [],
 valueHelpFlag: "",
 oBankAccounts: [],
 vSelectedIndex: "",
 ibanFlag: "",

 clearGlobalVariables: function() {
  if (this.oBankAccontLayout !== undefined && this.oBankAccontLayout !== "") {
   try {
    this.oBankAccontLayout.destroy();
   } catch (err) {}
  }
  this.oBankAccontLayout = "";
  this.BankQueryModel = [];
  this.oBankModel = "";
  this.oBankRslts = "";
  this.BankChngQueryModel = [];
  this.aCreatedBankId = [];
  this.aDeletedBankId = [];
  this.bankKeySearchResult = "";
  this.oBankValueItemTemp = "";
  this.oBankKeySearchResult = "";
  this.oChngBankModel = "";
  this.oDltBankModel = "";
  this.BankDltQueryModel = [];
  this.aChangedBanks = [];
  this.valueHelpFlag = "";
  this.oBankAccounts = [];
  this.ibanFlag = "";
 },

 getBankAccounts: function(oWizController) {
  this.oWizrdCntrlr = oWizController;
  if (this.oBankRslts === "" || this.oBankRslts === undefined) {
   this.aCreatedBankId = [];
   this.aDeletedBankId = [];
   var path = "/BP_RootCollection(BP_GUID=" + oWizController.sItemPath + ")?$expand=";
   var vQuery = path + "BP_BankAccountsRel";
   var vResult = fcg.mdg.editbp.util.DataAccess.readData(vQuery,
    oWizController);
   for (var i = 0; i < vResult.BP_BankAccountsRel.results.length; i++) {
    var vRecord = vResult.BP_BankAccountsRel.results[i].BANKDETAILID;
    this.oBankAccounts.push(vRecord);
   }
   this.oBankRslts = vResult;
  }
  // Controller Hook method call
  var oExtBankresponse = oWizController.bpHookModifyBankAccounts(vQuery,
   vResult, this);
  if (oExtBankresponse !== undefined) {
   this.oBankRslts = oExtBankresponse;
  }
  this.setActionLayout(this.oBankRslts, oWizController);
 },

 setActionLayout: function(oResult, oWController) {
  oWController.getView().byId("entityStep").setNextStep(
   oWController.getView().byId("actionStep"));
  if (oWController.oActionLayout === "") {
   oWController.oActionLayout = sap.ui.xmlfragment(
    'fcg.mdg.editbp.frag.generic.SelectAction', oWController);
  }
  oWController.getView().byId("actionLayout").setVisible(true);
  oWController.getView().byId("actionLayout").addContent(
   oWController.oActionLayout);
  // for (var i = 0; i < oWController.oActionLayout.getButtons().length; i++) {
  //  oWController.oActionLayout.getButtons()[i].setVisible(true);
  // }
  oWController.setRadioButtonText();
  if (oResult.BP_BankAccountsRel.results.length === 0) {
   sap.ui.getCore().byId("deleteRB").setEnabled(false);
   sap.ui.getCore().byId("changeRB").setEnabled(false);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(-1);
  } else {
   sap.ui.getCore().byId("deleteRB").setEnabled(true);
   sap.ui.getCore().byId("changeRB").setEnabled(true);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(1);
  }
  if (this.BankDltQueryModel.length === this.oBankAccounts.length) {
   sap.ui.getCore().byId("deleteRB").setEnabled(false);
   sap.ui.getCore().byId("changeRB").setEnabled(false);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(-1);
  }
 },

 handleBankAccounts: function(oWController) {
  if (oWController.vCurrentActionId === "createRB") {
   this.createChangeBankAccounts(oWController);
  } else if (oWController.vCurrentActionId === "changeRB") {
   if (oWController.reEdit === "") {
    if (this.oBankRslts.BP_BankAccountsRel.results.length > 1) {
     this.setSelectBankRecord(oWController, this.oBankRslts);
    } else if (this.oBankRslts.BP_BankAccountsRel.results.length === 1) {
     this.createChangeBankAccounts(oWController);
    }
   } else {
    this.createChangeBankAccounts(oWController);
   }
  } else if (oWController.vCurrentActionId === "deleteRB") {
   if (this.oBankRslts.BP_BankAccountsRel.results.length >= 1) {
    this.setSelectBankRecord(oWController, this.oBankRslts);
   }
  }
 },

 setSelectBankRecord: function(oController, oResults) {
  var oModel = new sap.ui.model.json.JSONModel();
  var strResults = {
   dataitems: []
  };
  if (oController.vCurrentActionId === "deleteRB") {
   oController.getView().byId("actionStep").setNextStep(
    oController.getView().byId("editStep"));
  } else {
   oController.getView().byId("actionStep").setNextStep(
    oController.getView().byId("selectEntityInstanceStep"));
  }
  if (oController.oCommunicationListRBG === "") {
   oController.oCommunicationListRBG = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntityInstance', oController);
  }
  if (oController.vCurrentActionId === "deleteRB") {
   oController.getView().byId("editLayout").setVisible(true);
   if (oController.getView().byId("editLayout").getContent().length > 0) {
    oController.getView().byId("editLayout").removeAllContent();
   }
   oController.getView().byId("editLayout").addContent(
    oController.oCommunicationListRBG);
  } else {
   oController.getView().byId("selectEntityInstanceLayout")
    .setVisible(true);
   oController.getView().byId("selectEntityInstanceLayout")
    .addContent(oController.oCommunicationListRBG);
  }

  for (var i = 0; i < oResults.BP_BankAccountsRel.results.length; i++) {
   var vBankAttribute = oResults.BP_BankAccountsRel.results[i];
   var oDataItems = {
    "RBText": fcg.mdg.editbp.util.Formatter.createRecordsToProcess(this.i18nModel, vBankAttribute)
   };
   strResults.dataitems.push(oDataItems);
  }

  var oBankListRBG = sap.ui.getCore().byId("selectDataListRBG");
  oModel.setData(strResults);
  oBankListRBG.setModel(oModel);
  oBankListRBG.setSelectedIndex(-1);
 },

 createChangeBankAccounts: function(oWizController) {
  this.vReEditIndex = "";
  var vsetbankModel;
  if (oWizController.vCurrentActionId === "createRB") {
   oWizController.getView().byId("actionStep").setNextStep(oWizController.getView().byId("editStep"));
   this.loadBanklayout(oWizController);
   vsetbankModel = this.BankQueryModel;
  } else if (oWizController.vCurrentActionId === "changeRB") {
   vsetbankModel = this.BankChngQueryModel;

   if (oWizController.reEdit !== "X") {
    var oChngRcrdModel = new sap.ui.model.json.JSONModel();
    if (this.oBankRslts.BP_BankAccountsRel.results.length > 1) {
     oWizController.getView().byId("selectEntityInstanceStep")
      .setNextStep(
       oWizController.getView().byId("editStep"));
     this.loadBanklayout(oWizController);
     var vSelectedRecord = sap.ui.getCore().byId(
      "selectDataListRBG").getSelectedIndex();
    } else if (this.oBankRslts.BP_BankAccountsRel.results.length === 1) {
     oWizController.getView().byId("actionStep").setNextStep(
      oWizController.getView().byId("editStep"));
     this.loadBanklayout(oWizController);
     vSelectedRecord = 0;
    }
    var vSelectedBankData = this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord];
    this.vSelectedIndex = vSelectedRecord;
    oChngRcrdModel.setData(vSelectedBankData);
    this.oBankAccontLayout.setModel(oChngRcrdModel);
   }
  }
  if (oWizController.reEdit === "X") {
   var vReEditFragmnt = oWizController.reEditSource.getParent().getParent().getParent();
   var vReEditLayout = vReEditFragmnt.getParent();
   this.vReEditIndex = vReEditLayout.indexOfContent(vReEditFragmnt);
   var oModel = new sap.ui.model.json.JSONModel();
   oModel.setData(vsetbankModel[this.vReEditIndex].body);
   this.oBankAccontLayout.setModel(oModel);
  }

 },

 loadBanklayout: function(oController) {
  if (this.oBankAccontLayout === "") {
   this.oBankAccontLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditBank', oController);
  } else {
   this.oBankAccontLayout.destroy();
   this.oBankAccontLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditBank', oController);
  }
  // Controller hook
  var oExtBanklayout = oController.bpHookModifyBanklayout(oController,
   this);
  if (oExtBanklayout !== undefined) {
   this.oBankAccontLayout = oExtBanklayout;
  }
  oController.getView().byId("editLayout").removeAllContent();
  oController.getFileUploadData("editLayout");
  oController.getView().byId("editLayout").addContent(this.oBankAccontLayout);
 },

 createBankAccountsDataModel: function(oWizController) {
  if (oWizController.vCurrentActionId === "createRB") {
   this.createModel(oWizController);
  } else if (oWizController.vCurrentActionId === "changeRB") {
   this.changeModel(oWizController);
  } else if (oWizController.vCurrentActionId === "deleteRB") {
   this.deleteModel(oWizController);
  }
 },

 createModel: function(oController) {
  var currentChanges = (JSON.parse(JSON
   .stringify(oController.createdArray)));
  var updatedData;
  var queryModel = {};
  if (oController.reEdit === "") {
   for (var i = 0; i < currentChanges.length;) {
    updatedData = "{";
    queryModel.index = this.vBankCreated + 1;
    queryModel.entity = currentChanges[i].entity;
    updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].value + "\",";
    for (var j = i + 1; j < currentChanges.length;) {
     if (currentChanges[i].entity === currentChanges[j].entity) {
      updatedData = updatedData + "\"" + currentChanges[j].field + "\":\"" + currentChanges[j].value + "\",";
      currentChanges.splice(j, 1);
     } else {
      j++;
     }
    }
    currentChanges.splice(i, 1);
    updatedData = updatedData.substring(0, updatedData.length - 1) + "}";
    queryModel.body = JSON.parse(updatedData);
    this.createBankDetailId(queryModel);
    this.aCreatedBankId.push(queryModel.body.BANKDETAILID);
    this.BankQueryModel.push(queryModel);
    // queryModel = {};
    this.oBankModel = new sap.ui.model.json.JSONModel();
    this.oBankModel.setData(queryModel.body);
   }
  } else {
   for (var r = 0; r < currentChanges.length; r++) {
    this.BankQueryModel[this.vReEditIndex].body[currentChanges[r].field] = currentChanges[r].value;
   }
   this.oReEditModel = new sap.ui.model.json.JSONModel();
   this.oReEditModel
    .setData(this.BankQueryModel[this.vReEditIndex].body);
  }
  // Controller hook
  var oExtBankCreateModel = oController.bpHookModifyBankCreateModel(
   oController, this);
  if (oExtBankCreateModel !== undefined) {
   this.BankQueryModel = oExtBankCreateModel;
  }
 },

 createBankDetailId: function(oQueryMdl) {
  var vCount = 0,
   vNewBankDtlId, vBankDtlId;
  for (var c = 0; c <= vCount; c++) {
   vCount = vCount + 1;
   vNewBankDtlId = ("000000000" + vCount).slice(-4);
   if (this.oBankAccounts.indexOf(vNewBankDtlId) === -1) {
    if (vNewBankDtlId !== vBankDtlId) {
     if (this.aCreatedBankId.indexOf(vNewBankDtlId) > -1) {
      continue;
     } else if (this.aCreatedBankId.indexOf(vNewBankDtlId) === -1) {
      oQueryMdl.body["BANKDETAILID"] = vNewBankDtlId;
      return;
     }
    }
   }
  }
 },

 changeModel: function(oController) {
  var currentChanges = (JSON.parse(JSON
   .stringify(oController.changedArray)));
  var updatedData, vSelectedRecord;
  var vBank, vChIndx;
  var queryModel = {};
  if (oController.reEdit === "") {
   for (var i = 0; i < currentChanges.length;) {
    if (this.oBankRslts.BP_BankAccountsRel.results.length === 1) {
     vSelectedRecord = 0;
    } else {
     if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
      vSelectedRecord = sap.ui.getCore().byId(
       "selectDataListRBG").getSelectedIndex();
     }
    }
    this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord][currentChanges[i].field] = currentChanges[i].value;
    this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord]["SelectIndex"] = vSelectedRecord;
    updatedData = "{";
    var vBankDetailidFormat = escape(this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord].BANKDETAILID);
    queryModel.header = "BP_BankAccountCollection(BP_GUID=" + oController.sItemPath + ",BANKDETAILID='" + vBankDetailidFormat + "')";
    queryModel.entity = currentChanges[i].entity;
    updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].value + "\",";
    for (var j = i + 1; j < currentChanges.length;) {
     this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord][currentChanges[j].field] = currentChanges[j].value;
     if (currentChanges[i].entity === currentChanges[j].entity) {
      updatedData = updatedData + "\"" + currentChanges[j].field + "\":\"" + currentChanges[j].value + "\",";
      currentChanges.splice(j, 1);
     } else {
      j++;
     }
    }
    currentChanges.splice(i, 1);
    updatedData = updatedData.substring(0, updatedData.length - 1) + "}";
    this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord].ChangeData = JSON.parse(updatedData);
    queryModel.body = this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord];
    if (this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord].EDIT !== "X") {
     queryModel.index = this.aChangedBanks.length - 1;
     this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord]["INDEX"] = queryModel.index;
     this.BankChngQueryModel.push(queryModel);
     this.aChangedBanks.push(queryModel.body.BANKDETAILID);
    } else {
     vBank = this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord].BANKDETAILID;
     vChIndx = this.aChangedBanks.indexOf(vBank);
     this.BankChngQueryModel[vChIndx] = queryModel;
    }
    this.oChngBankModel = new sap.ui.model.json.JSONModel();
    this.oChngBankModel.setData(this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord]);
   }
  } else {
   var vMdlIndx;
   vBank = this.BankChngQueryModel[this.vReEditIndex].body.BANKDETAILID;
   for (var ch = 0; ch < this.oBankRslts.BP_BankAccountsRel.results.length; ch++) {
    if (vBank === this.oBankRslts.BP_BankAccountsRel.results[ch].BANKDETAILID) {
     vMdlIndx = ch;
    }
   }
   for (var r = 0; r < currentChanges.length; r++) {
    this.BankChngQueryModel[this.vReEditIndex].body[currentChanges[r].field] = currentChanges[r].value;
    this.BankChngQueryModel[this.vReEditIndex].body.ChangeData[currentChanges[r].field] = currentChanges[r].value;
    this.oBankRslts.BP_BankAccountsRel.results[vMdlIndx][currentChanges[r].field] = currentChanges[r].value;
    this.oBankRslts.BP_BankAccountsRel.results[vMdlIndx].ChangeData[currentChanges[r].field] = currentChanges[r].value;
   }
   this.oReEditChngModel = new sap.ui.model.json.JSONModel();
   this.oReEditChngModel
    .setData(this.BankChngQueryModel[this.vReEditIndex].body);
  }
  // Controller hook
  var oExtBankChangeModel = oController.bpHookModifyBankChangeModel(
   oController, this);
  if (oExtBankChangeModel !== undefined) {
   this.oBankRslts = oExtBankChangeModel;
  }
 },

 deleteModel: function(oController) {
  var vDeletedBank = {};
  if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
   var vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG")
    .getSelectedIndex();
  }
  this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord]["SelectIndex"] = vSelectedRecord;

  var path = "/BP_RootCollection(BP_GUID=" + oController.sItemPath + ")?$expand=";
  var vQuery = path + "BP_BankAccountsRel";
  var vResult = fcg.mdg.editbp.util.DataAccess.readData(vQuery,
   oController);
  for (var i = 0; i < vResult.BP_BankAccountsRel.results.length; i++) {
   if (this.oBankRslts.BP_BankAccountsRel.results[vSelectedRecord].BANKDETAILID === vResult.BP_BankAccountsRel.results[i].BANKDETAILID) {
    var vRecord = i;
   }
  }
  vDeletedBank.body = vResult.BP_BankAccountsRel.results[vRecord];
  var vBankDetailidFormat = escape(vDeletedBank.body.BANKDETAILID);
  vDeletedBank.header = "BP_BankAccountCollection(BP_GUID=" + oController.sItemPath + ",BANKDETAILID='" + vBankDetailidFormat +
   "')";
  if (this.aChangedBanks.length > 0) {
   if (this.aChangedBanks.indexOf(vDeletedBank.body.BANKDETAILID) > -1) {
    var vChangedIndex = this.aChangedBanks
     .indexOf(vDeletedBank.body.BANKDETAILID);
    this.aChangedBanks.splice(vChangedIndex, 1);
    this.BankChngQueryModel.splice(vChangedIndex, 1);
    oController.getView().byId("bankChangeLayout").getContent()[vChangedIndex].destroy();
    this.oBankRslts.BP_BankAccountsRel.results.splice(vSelectedRecord, 1);
   } else {
    this.oBankRslts.BP_BankAccountsRel.results.splice(vSelectedRecord, 1);
   }
  } else {
   this.oBankRslts.BP_BankAccountsRel.results.splice(vSelectedRecord, 1);
  }

  this.BankDltQueryModel.push(vDeletedBank);
  var vLoadModel = vDeletedBank.body;
  vLoadModel.ChangeData = {};
  this.oDltBankModel = new sap.ui.model.json.JSONModel();
  this.oDltBankModel.setData(vLoadModel);
  // Controller hook
  var oExtBankDeleteModel = oController.bpHookModifyBankDeleteModel(oController, this);
  if (oExtBankDeleteModel !== undefined) {
   this.oBankRslts = oExtBankDeleteModel;
  }
 },

 undoBankChanges: function(oUndoSource, vActionIndex, vEntityIndex, oEntityLayout, oWizController) {
  var vBank, vIndex;
  var oLocalIns = this;
  var vbankAccountIndex;
  var desc = oUndoSource.getParent().getContent()[0].getText();
  var path = "/BP_RootCollection(BP_GUID=" + oWizController.sItemPath + ")?$expand=";
  var vQuery = path + "BP_BankAccountsRel";
  var oModel = new sap.ui.model.odata.ODataModel(
   "/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
  // Controller hook
  var oExtBankUndoChanges = oWizController.bpHookModifyBankUndoChanges(
   vQuery, oModel, oWizController, this);
  if (oExtBankUndoChanges !== undefined) {
   vQuery = oExtBankUndoChanges;
  }
  if (vActionIndex === 0) {
   for(var i=0;i<oWizController.oDupCheckData.length;){
    if(oWizController.oDupCheckData[i].createdIndex === this.BankQueryModel[vEntityIndex].index && 
       oWizController.oDupCheckData[i].entity === "BP_BankAccount"){
         oWizController.oDupCheckData.splice(i,1);
       }
     else{
      i++;
     }
   }
   this.aCreatedBankId.splice(vEntityIndex, 1);
   this.BankQueryModel.splice(vEntityIndex, 1);
  } else if (vActionIndex === 1) {
   vBank = this.BankChngQueryModel[vEntityIndex].body.BANKDETAILID;
   //in case of change and delete revert the entry in the Entityvalue array which sets the review changes button
            for (i = 0; i < oWizController.aEntityValue.length; i++) {
                if ("BankRB-" + vBank === oWizController.aEntityValue[i]) {
                    oWizController.aEntityValue.splice(i, 1);
                    break;
                }
            }
   this.aChangedBanks.splice(vEntityIndex, 1);
   vIndex = this.oBankAccounts.indexOf(vBank);
   for (var i = 0; i < this.oBankRslts.BP_BankAccountsRel.results.length; i++) {
    if (vBank === this.oBankRslts.BP_BankAccountsRel.results[i].BANKDETAILID) {
     // this.oBankRslts.BP_BankAccountsRel.results.splice(i,1);
     var vchngdBankIndx = i;
    }
   }
   this.BankChngQueryModel.splice(vEntityIndex, 1);
   oWizController.aEntityValue.splice(vEntityIndex, 1);
   oModel.read(vQuery, null, null, true,
    function(result, oError) {
     if (result.BP_BankAccountsRel.results.length > 0) {
      oLocalIns.oBankRslts.BP_BankAccountsRel.results[vchngdBankIndx] = result.BP_BankAccountsRel.results[vIndex];
     }
    });

  } else if (vActionIndex === 2) {
   vBank = this.BankDltQueryModel[vEntityIndex].body.BANKDETAILID;
   //in case of change and delete revert the entry in the Entityvalue array which sets the review changes button
            for (i = 0; i < oWizController.aEntityValue.length; i++) {
                if ("BankRB-" + vBank === oWizController.aEntityValue[i]) {
                    oWizController.aEntityValue.splice(i, 1);
                    break;
                }
            }
   vIndex = this.oBankAccounts.indexOf(vBank);
   this.BankDltQueryModel.splice(vEntityIndex, 1);
   oModel.read(vQuery, null, null, true, function(result, oError) {
    if (result.BP_BankAccountsRel.results.length > 0) {
     oLocalIns.oBankRslts.BP_BankAccountsRel.results.push(result.BP_BankAccountsRel.results[vIndex]);
    }
   });
  }
 },

 getBankModel: function() {
  if (this.oWizrdCntrlr.vCurrentActionId === "createRB") {
   return this.oBankModel;
  } else if (this.oWizrdCntrlr.vCurrentActionId === "changeRB") {
   return this.oChngBankModel;
  } else if (this.oWizrdCntrlr.vCurrentActionId === "deleteRB") {
   return this.oDltBankModel;
  }
 },
 seti18nModel: function(i18n) {
  this.i18nModel = i18n;
 },

 _countryVH: function(sProperty, oControlEvent, oController) {
  var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
  var oGlobalInstance = oController;
  var oLocalIns = this;
  var vProperty = sProperty;
  var country = sap.ui.getCore().byId(sProperty);
  var oBankAccount = sap.ui.getCore().byId(
   "SF-BP_BankAccounts-Txt_BANK_ACCT");
  if (sProperty === "SF-BP_BankAccounts-Txt_BANK_CTRY") {
   // If this method is triggered while clicking on Bank Country Key
   var countryName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY__TXT");
   var oBankKey = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
   var oBankName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
  }

  if (sap.ui.getCore().byId("CountryDialog") !== undefined) {
   sap.ui.getCore().byId("CountryDialog").destroy();
   this.oCountryValueHelp = "";
  }
  var oCountryDialog = new sap.m.SelectDialog({
   id: "CountryDialog",
   title: this.i18nModel.getText("COUNTRIES"), // "Countries",
   noDataText: this.i18nModel.getText("LOAD") + "...", // "Loading...",
   items: {
    path: "/CountryValues",
    template: new sap.m.StandardListItem({
     title: "{TEXT}",
     description: "{KEY}"
    })
   },
   confirm: function(oEvent) {
    oLocalIns.valueHelpFlag = "X";
    // Set Country Value
    country.setValueState("None");
    country.setValueStateText("");
    oBankAccount.setValueState("None");
    oBankAccount.setValueStateText("");
    country.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    country.fireEvent("change");
    oLocalIns.valueHelpFlag = "";

    // Should differenciate between Bank Country Name and Address Country Name - Pending
    if (countryName !== undefined) {
     // Set country Name on selecting a value from F4 list
     countryName.setValue(oEvent.getParameters().selectedItem.getProperty("title"));
     countryName.fireEvent("change");
     if (oBankKey !== undefined) {
      oBankKey.setValueState("None");
      oBankKey.setValueStateText("");
      oGlobalInstance._fetchBankName();
     }
     oLocalIns._deriveIban(sProperty, oControlEvent, oController);
    }
   },
   search: function(oEvent) {

    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
    var oItems = oCountryDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { // Get all the rows of the table and compare the string one by one across all columns
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
   liveChange: function(oEvent) { // Search function on input help
    var sValue = oEvent.getParameter("value").toUpperCase();
    // to remove preceding and trialing spaces
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
    var oItems = oCountryDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { // Get all the rows of the table and compare the string one by one across all columns
      var oCountryKey = oItems[i].getBindingContext().getProperty("KEY");
      var oCountryName = oItems[i].getBindingContext().getProperty("TEXT");
      if (oCountryKey.toUpperCase().indexOf(sValue) === -1 && oCountryName.toUpperCase().indexOf(sValue) === -1) {
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
   oCountryDialog.setNoDataText(oGlobalInstance.getView().getModel("i18n").getProperty("NO_DATA"));
  }
  var oExtBankCountryValueHelp = oController.bpHookModifyBankCountryValueHelp(sProperty, oCountryDialog, oControlEvent, oController, this);
  if (oExtBankCountryValueHelp !== undefined) {
   oCountryDialog = oExtBankCountryValueHelp;
  }
  oCountryDialog.open();
 },

 _BankKeyVH: function(sProperty, oControlEvent, oController) {
  var countryVal = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue();
  var oBankCountry = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
  var oBankKey = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
  var oBankName = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
  var oBankAccount = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT");
  if (countryVal === "") {
   // If country is not entered, Raise an error
   oBankKey.setValueState("Error");
   oBankKey.setValueStateText(this.i18nModel.getText("BANK_COUNTRY_CHECK"));
   oBankCountry.setValueState("Error");
   oBankCountry.setValueStateText(this.i18nModel.getText("BlnkCountryMSG"));
   return;
  }
  if (oBankCountry.getValueState() === "Error") {
   oBankKey.setValueState("Error");
   oBankKey.setValueStateText(oBankCountry.getValueStateText());
   return;
  }
  if (countryVal !== "") {
   var oGlobalInstance = this;
   var bankNum = oBankKey;
   var bankName = oBankName;

   if (sap.ui.getCore().byId("BankKeyDialog") !== undefined) {
    sap.ui.getCore().byId("BankKeyDialog").destroy();
    this.bankKeySearchResult = "";
   }

   var oSelectDialog = new sap.m.SelectDialog({
    id: "BankKeyDialog",
    title: this.i18nModel.getText("BANK_KEYS"),
    noDataText: this.i18nModel.getText("LOAD") + "...",
    confirm: function(oEvent) {
     oGlobalInstance.valueHelpFlag = "X";
     oBankAccount.setValueState("None");
     oBankAccount.setValueStateText("");
     bankNum.setValueState("None");
     bankNum.setValueStateText("");
     bankNum.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
     var str = '(' + oGlobalInstance.i18nModel.getText("NoDesc") + ')';
     if (str === oEvent.getParameters().selectedItem.getProperty("title")) {
      bankName.setValue();
     } else {
      bankName.setValue(oEvent.getParameters().selectedItem.getProperty("title"));
     }
     bankNum.fireEvent("change");
     oGlobalInstance.valueHelpFlag = "";
     bankName.fireEvent("change");
     oGlobalInstance._deriveIban(sProperty, oControlEvent, oController);
    },
    search: function(oEvent) {
     var sValue = oEvent.getParameter("value")
      .toUpperCase();
     sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
     if (oGlobalInstance.oBankKeySearchResult) {
      var oInputHelpModel = new sap.ui.model.json.JSONModel();
      oInputHelpModel.setData(oGlobalInstance.oBankKeySearchResult);
      oSelectDialog.setModel(oInputHelpModel);
      if (sValue.length == 0) {
       oSelectDialog.setGrowingThreshold(15);
      } else {
       oSelectDialog.setGrowingThreshold(oGlobalInstance.oBankKeySearchResult.results.length);
      }
      oSelectDialog.bindAggregation("items", "/results", oGlobalInstance.oBankValueItemTemp);
     }
     var oItems = oSelectDialog.getItems();
     for (var i = 0; i < oItems.length; i++) {
      if (sValue.length > 0) { // Get all the rows of the table and compare the string one by one across all columns
       var sBankName = oItems[i].getBindingContext().getProperty("TEXT");
       var sBankNum = oItems[i].getBindingContext().getProperty("KEY");
       if (sBankName.toUpperCase().indexOf(sValue) === -1 && sBankNum.toUpperCase().indexOf(sValue) === -1) {
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

   if (!oGlobalInstance.bankKeySearchResult) {
    var sQuery = "/ValueHelpCollection?$filter=" + jQuery.sap.encodeURL(
     "ENTITY eq 'BP_BankAccount' and ATTR_NAME eq 'BANK_KEY' and FILTER eq " + "'COUNTRY=" + countryVal + "'");

    var that = this;
    // var oResult = "";
    var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);

    oModel.read(sQuery, null, null, true,
     function(result, oError) {
      if (result.results.length > 0) {
       var oItemTemplate = new sap.m.StandardListItem({
        title: {
         parts: [{
          path: 'TEXT'
         }, {
          path: 'KEY'
         }],
         formatter: that.checkDesc
        },
        description: "{KEY}",
        active: true
       });
       var oInputHelpModel = new sap.ui.model.json.JSONModel();
       oInputHelpModel.setData(result);
       oSelectDialog.setModel(oInputHelpModel);
       oSelectDialog.setGrowingThreshold(15); // result.results.length);
       oSelectDialog.bindAggregation("items",
        "/results", oItemTemplate);
       oGlobalInstance.oBankValueItemTemp = oItemTemplate;
       oGlobalInstance.oBankKeySearchResult = result;
      } else {
       oSelectDialog
        .setNoDataText(oGlobalInstance.i18nModel
         .getText("NO_DATA"));
      }
     },
     function(oErr) {
      oSelectDialog
       .setNoDataText(oGlobalInstance.i18nModel
        .getText("NO_DATA"));
     });
   } else {}
   // controller hook
   var oExtBankKeyValueHelp = oController
    .bpHookModifyBankKeyValueHelp(sProperty, oControlEvent,
     oSelectDialog, oController, this);
   if (oExtBankKeyValueHelp !== undefined) {
    oSelectDialog = oExtBankKeyValueHelp;
   }
   oSelectDialog.open();
  }
 },

 checkDesc: function(sDesc, sValue) {
  if ((sDesc === "" || sDesc === null || sDesc === undefined) && (sValue === "" || sValue === null || sValue === undefined))
   return " ";

  else if ((sDesc === "" || sDesc === null || sDesc === undefined) && (sValue !== "" || sValue !== null || sValue !== undefined)) {
   var str = '(' + fcg.mdg.editbp.handlers.BankAccount.i18nModel.getText("NoDesc") + ')';
   return str;
  } else
   return sDesc;
 },

 _deriveIban: function(sProperty, oControlEvent, oController) {
  var globalInst = this;
  var oBankAccount = sap.ui.getCore().byId(
   "SF-BP_BankAccounts-Txt_BANK_ACCT");
  var bankAccount = sap.ui.getCore().byId(
   "SF-BP_BankAccounts-Txt_BANK_ACCT").getValue();
  var oIBAN = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN");
  var oGlobalIns = this;
  if (bankAccount.replace(/^[ ]+|[ ]+$/g, '') === "") {
   sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT")
    .setValue();
   oIBAN.setValue();
   oIBAN.setValueState("None");
  }
  // oController.onChange("oControlEvent");
  if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY")
   .getValue() !== "" && sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY")
   .getValue() !== "" && sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT")
   .getValue() !== "") {
   if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY")
    .getValueState() === "None" && sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY")
    .getValueState() === "None") {
    var sBankCountry = sap.ui.getCore().byId(
     "SF-BP_BankAccounts-Txt_BANK_CTRY").getValue();
    var sBankNum = sap.ui.getCore().byId(
     "SF-BP_BankAccounts-Txt_BANK_KEY").getValue();
    var sBankAccount = sap.ui.getCore().byId(
     "SF-BP_BankAccounts-Txt_BANK_ACCT").getValue();

    var query = "/BP_BankAccountCollection?$filter=" + jQuery.sap.encodeURL("BANK_CTRY eq '" + sBankCountry + "' and BANK_KEY eq '" +
     sBankNum + "' and BANK_ACCT eq '" + sBankAccount + "'");
    // controller hook
    var oExtBankDeriveIban = oController
     .bpHookModifyBankDeriveIban(sProperty, oControlEvent,
      query, oController, this);
    if (oExtBankDeriveIban !== undefined) {
     query = oExtBankDeriveIban;
    }
    var oIBAN = sap.ui.getCore()
     .byId("SF-BP_BankAccounts-Txt_IBAN");
    var oModel = new sap.ui.model.odata.ODataModel(
     "/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
    oModel
     .read(query, null, null, true,
      function(data, oError) {
       // Set the description as returned by requests
       if (data.results.length > 0) {
        oGlobalIns.valueHelpFlag = "X";
        oBankAccount.setValueState("None");
        oBankAccount.setValueStateText("");
        var sIban = data.results[0].IBAN;
        oIBAN.setValueState("None");
        oIBAN.setValue(sIban);
        oIBAN.fireEvent("change");
        oGlobalIns.valueHelpFlag = "";
        if (oIBAN.getValue() !== "") {
         oIBAN.setValueState("Warning");
         oIBAN.setValueStateText(oGlobalIns.i18nModel.getText("IBAN_WARNING"));
        }
       } else if (data.results.length === 0 || oIBAN.getValue() === "") {
        oIBAN.setValueState("Warning");
        oIBAN.setValueStateText(oGlobalIns.i18nModel.getText("IBAN_NO_GEN"));
       }

      },
      function(oError) {
       // If this country key does not exist in the backend, show this error as a pop up
       if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue() !== "" && sap.ui.getCore().byId(
         "SF-BP_BankAccounts-Txt_BANK_KEY").getValue() !== "" && sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").getValue() !==
        "") {
        var errorObj = JSON.parse(oError.response.body);
        var errorMsg = errorObj.error.message.value;
        oIBAN.setValue();
        oIBAN.setValueState("Error");
        oIBAN.setValueStateText(errorMsg);
        oBankAccount.setValueState("Error");
        oBankAccount.setValueStateText(errorMsg);
       }
      });
   }
  }
 }
};