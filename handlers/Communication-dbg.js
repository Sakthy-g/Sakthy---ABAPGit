/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.Communication");
fcg.mdg.editbp.handlers.Communication = {
 oController: "",
 oCurrentDataModel: "",
 oCurrentDelDataModel: "",
 oCreateModel: [],
 oDeleteModel: [],
 oChangeModel: [],
 query: "",
 createdArray: "",
 finalQueryModel: [],
 finalChnQueryModel: [],
 addressModel: "",
 vIdCounterTel: 0,
 vNewTelField: "",
 vIdCounterFax: 0,
 vNewFaxField: "",
 vIdCounterMob: 0,
 vNewMobField: "",
 vIdCounterEmail: 0,
 vNewEmailField: "",
 vIdCounterURI: 0,
 vNewURIField: "",
 oIavFormId: 0,
 oIavNewForm: "",
 oEditIAVModel: "",
 oAddressCreate: "",
 oAddressContactCreate: "",
 oAddressIAVOrgCreate: "",
 vOldCountry: "",
 vCountry: "",
 CurrLayout: "",
 vReEditIndex: "",
 oReEditCrtModel: "",
 oReEditChngModel: "",
 selectedAddVersion: [],
 queryChnModel: [],
 queryCrtModel: [],
 addresscrtModel: "",
 addresschnModel: "",
 addressdelModel: "",
 aReEditData: [],
 aRemoveFields: [],
 vStdAddress: "",
 vCommChanged: 1,
 numPhn: 0,
 numMob: 0,
 numFax: 0,
 numEmail: 0,
 numURI: 0,
 numIAV: 0,
 selectedIndex: 0,
 aChangedAddress: [],
 aDelAddressId: [],
 oValueHelpAddressVersion: {},
 vIavFlag: false,
 oRegionModel: "",
 vRegionFlag: false,
 vRegionTextFlag: false,
 vLangu: "",
 vAD_ID: 0,
 oDataModel: "",
 oCountDeepEntities : [],
 // vDelRequestComplFlag: false,
 aErrorStateFlag: [],

 // for clearing all global variables used in Address
 clearGlobalVariables: function(oController) {
  if (this.oAddressCreate !== undefined && this.oAddressCreate !== "") {
   // this.oAddressCreate.destroy();
   try {
    this.oAddressCreate.destroy();
   } catch (err) {}
  }
  if (this.oAddressContactCreate !== undefined && this.oAddressContactCreate !== "") {
   // this.oAddressContactCreate.destroy();
   try {
    this.oAddressContactCreate.destroy();
   } catch (err) {}
  }
  if (this.oAddressIAVOrgCreate !== undefined && this.oAddressIAVOrgCreate !== "") {
   // this.oAddressIAVOrgCreate.destroy();
   try {
    this.oAddressIAVOrgCreate.destroy();
   } catch (err) {}
  }
  this.oAddressCreate = "";
  this.oAddressContactCreate = "";
  this.oAddressIAVOrgCreate = "";
  this.oCurrentDataModel = "";
  this.oCurrentDelDataModel = "";
  this.oRegionModel = "";
  this.addressModel = "";
  this.vLangu = "";
  this.oCreateModel = [];
  this.oChangeModel = [];
  this.oDeleteModel = [];
  this.queryChnModel = [];
  this.selectedAddVersion = [];
  this.queryCrtModel = [];
  this.aChangedAddress = [];
  this.aChangedAddress = [];
  this.finalChnQueryModel = [];
  this.vOldCountry = "";
  this.vCountry = "";
  this.CurrLayout = "";
  this.oValueHelpAddressVersion = {};
  this.vIavFlag = false;
  this.vRegionFlag = false;
  this.vRegionTextFlag = false;
  oController.oDetailComm = "";
  this.vAD_ID = 0;
  oController.isAddressVisited = "";
  this.oDataModel = "";
  // this.vDelRequestComplFlag = false;
  this.aErrorStateFlag = [];
  this.aDelAddressId = [];
  this.oCountDeepEntities = [];
 },

 //for handling the fragment related to create/change/delete scenarios and binding model
 handleCommunication: function(oController) {
  this.oController = oController;
  this.vReEditIndex = "";
  this.vOldCountry = "";
  this.selectedIndex = 0;
  this.aErrorStateFlag = [];
  var oReEditCommModel;
  fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion = {};
  if (oController.getView().byId("communicationLayout").getItems().length > 0) {
   oController.getView().byId("communicationLayout").destroyItems();
  }
  if (oController.reEdit !== "X") {
   if (oController.vCurrentActionId === "createRB") {
    this.createCommunicationData(oController);
   } else if (oController.vCurrentActionId === "changeRB") {
    this.editCommunication(this.oController.oDetailComm);
   } else if (oController.vCurrentActionId === "deleteRB") {
    this.editCommunication(this.oController.oDetailComm);
   }
  } else if (oController.reEdit === "X") {
   oController.oWizard.invalidateStep(oController.getView().byId("communicationStep"));
   var vReEditFragmnt = oController.reEditSource.getParent().getParent().getParent();
   var vReEditLayout = vReEditFragmnt.getParent();
   this.vReEditIndex = vReEditLayout.indexOfContent(vReEditFragmnt);
   var oAddressModel = new sap.ui.model.json.JSONModel();
   if (this.oController.vCurrentActionId === "createRB") {
    oReEditCommModel = this.oCreateModel[this.vReEditIndex].body;
   } else if (this.oController.vCurrentActionId === "changeRB") {
    oReEditCommModel = this.queryChnModel[this.vReEditIndex].body;
   }
   oAddressModel.setData(oReEditCommModel);
   this.loadCommlayout(oController, oReEditCommModel);
   if (oController.sCategory === "1") {
    sap.ui.getCore().byId("INP-BP_Address-LANGU").setVisible(false);
    sap.ui.getCore().byId("INP-BP_Address-LANGU__TXT").setVisible(false);
    sap.ui.getCore().byId("INP-BP_Address-PO_BOX").setVisible(false);
    sap.ui.getCore().byId("INP-BP_Address-POSTL_COD3").setVisible(false);
   }
   this.oAddressCreate.setModel(oAddressModel);
   this.createCommIAVFields(oReEditCommModel);
  }

 },

 countDeepEntities : function(response,index){
   var numDeepEntities = {};
   var i;
    //to count the deep entities 
    for (i = 0; i < response.BP_AddressesRel.results.length; i++) {
     if(index === i){
     if (response.BP_AddressesRel.results[i].BP_CommPhoneRel.results !== undefined) {
      numDeepEntities.numPhn = response.BP_AddressesRel.results[i].BP_CommPhoneRel
       .results.length;
     } else {
      numDeepEntities.numPhn = 0;
     }

     if (response.BP_AddressesRel.results[i].BP_CommMobileRel.results !== undefined) {
      numDeepEntities.numMob = response.BP_AddressesRel.results[i].BP_CommMobileRel
       .results.length;
     } else {
      numDeepEntities.numMob = 0;
     }
     if (response.BP_AddressesRel.results[i].BP_CommFaxRel.results !== undefined) {
      numDeepEntities.numFax = response.BP_AddressesRel.results[i].BP_CommFaxRel.results
       .length;
     } else {
      numDeepEntities.numFax = 0;
     }

     if (response.BP_AddressesRel.results[i].BP_CommEMailRel.results !== undefined) {
      numDeepEntities.numEmail = response.BP_AddressesRel.results[i].BP_CommEMailRel
       .results.length;
     } else {
      numDeepEntities.numEmail = 0;
     }
     if (response.BP_AddressesRel.results[i].BP_CommURIRel.results !== undefined) {
      numDeepEntities.numURI = response.BP_AddressesRel.results[i].BP_CommURIRel.results
       .length;
     } else {
      numDeepEntities.numURI = 0;
     }

     if (this.oController.sCategory === "1") {
      if (response.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results !== undefined) {
       numDeepEntities.numIAV = response.BP_AddressesRel.results[i].BP_AddressVersionsPersRel
        .results.length;
      } else {
       numDeepEntities.numIAV = 0;
      }
     } else {
      if (response.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results !== undefined) {
       numDeepEntities.numIAV = response.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel
        .results.length;
      } else {
       numDeepEntities.numIAV = 0;
      }
     }
     this.oCountDeepEntities.splice(i,1);
     this.oCountDeepEntities.splice(index,0,numDeepEntities);
     }
     numDeepEntities = {};

    }
 },

 //when revert change link is press then this method is called
 undoAddressChanges: function(vActionIndex, vEntityIndex) {
  var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
  var index = "";
  var oResults = "";
  var i, j;
  var vAD_ID;
  var vQuery = path +
   "BP_AddressesRel,BP_AddressesRel/BP_CommPhoneRel,BP_AddressesRel/BP_CommMobileRel,BP_AddressesRel/BP_CommFaxRel,BP_AddressesRel/BP_CommEMailRel,BP_AddressesRel/BP_CommURIRel,";
  //this.oController.oDupCheckData;
  if (this.oController.sCategory === "1") {
   vQuery = vQuery + "BP_AddressesRel/BP_AddressVersionsPersRel/BP_AddressPersonVersionRel";
  } else {
   vQuery = vQuery + "BP_AddressesRel/BP_AddressVersionsOrgRel";
  }
  if (vActionIndex === 0) { //created record should be removed

   // get list of all addresses used by CP
   var aAddresses = this.getAddressesUsedByCP();
   // check if the address to be deleted is already being used, if yes then throw an error
   if(aAddresses.indexOf(this.oCreateModel[vEntityIndex].body.AD_ID) !== -1) {
    this.showPopUp(this.oController, this.oController.i18nBundle.getText("ERROR_ADDR_REVERT"));
    return "ERROR";
   }
   for (i = 0; i < this.oController.oDupCheckData.length;) {
    if (this.oController.oDupCheckData[i].createdIndex === this.oCreateModel[vEntityIndex].index &&
     this.oController.oDupCheckData[i].entity === "BP_Address") {
     this.oController.oDupCheckData.splice(i, 1);
    } else {
     i++;
    }
   }
   this.oCreateModel.splice(vEntityIndex, 1);
  } else if (vActionIndex === 1) { //changed record should be removed
   for(i=0; i<this.oController.oDupCheckData.length;){
    if (this.oController.oDupCheckData[i].entityKey.split("-")[2] === this.queryChnModel[vEntityIndex].body.AD_ID &&
     this.oController.oDupCheckData[i].entity === "BP_Address") {
     this.oController.oDupCheckData.splice(i, 1);
    } else {
     i++;
    }
   }
   for (i = 0; i < this.oController.oDetailComm.BP_AddressesRel.results.length; i++) {
    if (this.oController.oDetailComm.BP_AddressesRel.results[i].AD_ID === this.queryChnModel[vEntityIndex].body.AD_ID) {
     oResults = fcg.mdg.editbp.util.DataAccess.readData(vQuery, this.oController);
     this.countDeepEntities(oResults,i);
     this.oController.oDetailComm.BP_AddressesRel.results[i] = oResults.BP_AddressesRel.results[i];
    }
   }
   if (this.oChangeModel.length !== 0) {
    for (i = 0; i < this.oChangeModel.length;) {
     if (this.oChangeModel[i].AD_ID === this.queryChnModel[vEntityIndex].body.AD_ID) {
      this.oChangeModel.splice(i, 1);
     } else {
      i++;
     }
    }
   }
   for(i=0; i<this.aChangedAddress.length; i++){
    if(this.aChangedAddress[i] === this.queryChnModel[vEntityIndex].body.AD_ID){
     this.aChangedAddress.splice(i,1);
     break;
    }
   }
   vAD_ID = this.queryChnModel[vEntityIndex].body.AD_ID;
   this.queryChnModel.splice(vEntityIndex,1);

  } else if (vActionIndex === 2) { //deleted record should be removed
   index = this.aDelAddressId.indexOf(this.oDeleteModel[vEntityIndex].body.AD_ID);
   vAD_ID = this.oDeleteModel[vEntityIndex].body.AD_ID;
   this.oDeleteModel.splice(vEntityIndex, 1);
   oResults = fcg.mdg.editbp.util.DataAccess.readData(vQuery, this.oController);
   this.countDeepEntities(oResults,i);
   this.oController.oDetailComm.BP_AddressesRel.results.push(oResults.BP_AddressesRel.results[index]);
  }

  if(vActionIndex === 1 || vActionIndex === 2){ //in case of change and delete revert the entry in the Entityvalue array which sets the review changes button
   for(i=0;i<this.oController.aEntityValue.length;i++){
    if("communicationRB-" + vAD_ID === this.oController.aEntityValue[i]){
     this.oController.aEntityValue.splice(i,1);
     break;
    }
   }   
  }

  // Controller Hook method call
  var oExtResults = this.oController.bpHookReadAddressData(this, vQuery, oResults);
  if (oExtResults !== undefined) {
   oResults = oExtResults;
  }
 },

 //for getting index of which address is selected.
 handleSelectItemForComm: function(wController) {
  this.oController = wController;
  fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion = {};
  if (this.oController.vCurrentActionId === "changeRB") {
   var addressIndex = "";
   if (sap.ui.getCore().byId("selectDataListRBG") === undefined) {
    addressIndex = 0;
   } else {
    addressIndex = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
   }
   this.selectedIndex = addressIndex;
   this.getAddressDetailsPage(this.oController.oDetailComm, addressIndex);
  } else if (wController.vCurrentActionId === "deleteRB") {
   this.getAddressDetailsPage(this.oController.oDetailComm, addressIndex);
  }
 },

 //load the fragment for edit data for address, communication and IAV
 loadCommlayout: function(oController, oResult) {
  if (this.oAddressCreate === "") {
   this.checkAddressCountry(oResult, oController);
  } else {
   try {
    this.oAddressCreate.destroy();
   } catch (err) {}
   this.checkAddressCountry(oResult, oController);
  }
  if (this.oAddressContactCreate === "") {
   this.oAddressContactCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressContactEdit', oController);
  } else {
   try {
    this.oAddressContactCreate.destroy();
   } catch (err) {}
   this.oAddressContactCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressContactEdit', oController);

  }
  if (this.oAddressIAVOrgCreate === "") {
   this.oAddressIAVOrgCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditIAVAddressOrg', oController);
  } else {
   try {
    this.oAddressIAVOrgCreate.destroy();
   } catch (err) {}
   this.oAddressIAVOrgCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditIAVAddressOrg', oController);
  }
  oController.getView().byId("communicationLayout").destroyItems();
  oController.getFileUploadData("communicationLayout");
  oController.getView().byId("communicationLayout").addItem(this.oAddressCreate);
  oController.getView().byId("communicationLayout").addItem(this.oAddressContactCreate);
  oController.getView().byId("communicationLayout").addItem(this.oAddressIAVOrgCreate);
 },

 //to check the country present in address section is US or other, based on value different fragment is loaded
 checkAddressCountry: function(oResult, oController) {
  if (oResult === undefined || oResult.COUNTRY !== "US") {
   this.oAddressCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressEdit', oController);
  } else {
   if (oResult.COUNTRY === "US")
    this.oAddressCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressEditUS', oController);
  }
 },

 //used to create different models used to store data which which will be used to display data in review page and on submit.
 createCommunicationDataModel: function(oWizController) {
  fcg.mdg.editbp.handlers.Communication.oEditIAVModel = "";
  if (oWizController.vCurrentActionId === "createRB") {
   fcg.mdg.editbp.handlers.Communication.onCreate(oWizController);
  } else if (oWizController.vCurrentActionId === "changeRB") {
   fcg.mdg.editbp.handlers.Communication.onChange(oWizController);
  } else if (oWizController.vCurrentActionId === "deleteRB") {
   fcg.mdg.editbp.handlers.Communication.onDelete(oWizController);
  }
 },

 //used in case of create of address for loading the fragment and disable communication icons (add, cancel)
 createCommunicationData: function(oController) {
  oController.getView().byId("actionStep").setNextStep(oController.getView().byId("communicationStep"));
  this.oController = oController;
  this.createdArray = [];
  this.finalQueryModel = [];
  this.loadCommlayout(oController);
  fcg.mdg.editbp.handlers.Communication.handleDisableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
  fcg.mdg.editbp.handlers.Communication.handleDisableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
  fcg.mdg.editbp.handlers.Communication.handleDisableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
  fcg.mdg.editbp.handlers.Communication.handleDisableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
  fcg.mdg.editbp.handlers.Communication.handleDisableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
  if (oController.sCategory === "1") {
   sap.ui.getCore().byId("INP-BP_Address-LANGU").setVisible(false);
   sap.ui.getCore().byId("INP-BP_Address-LANGU__TXT").setVisible(false);
   sap.ui.getCore().byId("INP-BP_Address-PO_BOX").setVisible(false);
   sap.ui.getCore().byId("INP-BP_Address-POSTL_COD3").setVisible(false);
  }

 },

 //used to create model for change of address.
 onChange: function() { //should be refined
  var addressIndex = "";
  var finalChnEntry = 0;
  if (sap.ui.getCore().byId("selectDataListRBG") === undefined) {
   addressIndex = 0;
  } else {
   addressIndex = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  }
  var currentChanges = (JSON.parse(JSON.stringify(this.oController.changedArray)));
  var updatedData;
  var queryModel = {};
  for (var i = 0; i < currentChanges.length;) {
   if (currentChanges[i].action === "N" || currentChanges[i].action === "D") {
    queryModel.action = currentChanges[i].action;
   } else {
    queryModel.action = "U";
   }
   updatedData = "{";
   queryModel.header = currentChanges[i].entityKey;
   queryModel.entity = currentChanges[i].entity;
   if (currentChanges[i].createdIndex !== undefined) {
    queryModel.currentEntityKey = currentChanges[i].createdIndex;
   }
   if(currentChanges[i].currentIndex !== undefined){
    queryModel.currentEntityKey = currentChanges[i].currentIndex;
   }
   if(queryModel.action !== "D") {
    if (currentChanges[i].key !== undefined) {
     updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].key + "\",";
     updatedData = updatedData + "\"" + currentChanges[i].field + "__TXT" + "\":\"" + currentChanges[i].value + "\",";
    } else {
     updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].value + "\",";
    }
    for (var j = i + 1; j < currentChanges.length;) {
     if (currentChanges[i].entity === currentChanges[j].entity && 
      ((currentChanges[i].createdIndex === currentChanges[j].createdIndex && currentChanges[i].createdIndex !== undefined) || 
      (currentChanges[i].currentIndex === currentChanges[j].currentIndex && currentChanges[i].currentIndex !== undefined)) &&
      currentChanges[i].action === currentChanges[j].action) {
      if (currentChanges[j].key !== undefined) {
       updatedData = updatedData + "\"" + currentChanges[j].field + "\":\"" + currentChanges[j].key + "\",";
       updatedData = updatedData + "\"" + currentChanges[j].field + "__TXT" + "\":\"" + currentChanges[j].value + "\",";
      } else {
       updatedData = updatedData + "\"" + currentChanges[j].field + "\":\"" + currentChanges[j].value + "\",";
      }
      currentChanges.splice(j, 1);
     } else {
      j++;
     }
    }
    updatedData = updatedData.substring(0, updatedData.length - 1);
   }
    updatedData = updatedData + "}";
   currentChanges.splice(i, 1);
   queryModel.body = JSON.parse(updatedData);
   this.finalQueryModel.push(queryModel);
   for (var q = 0; q < this.finalChnQueryModel.length; q++) {
    if (this.finalChnQueryModel[q].action === queryModel.action &&
     this.finalChnQueryModel[q].currentEntityKey === queryModel.currentEntityKey &&
     this.finalChnQueryModel[q].entity === queryModel.entity &&
     this.finalChnQueryModel[q].header === queryModel.header) {
     for (j = 0; j < Object.keys(queryModel.body).length; j++) {
      for (var k = 0; k < Object.keys(this.finalChnQueryModel[q].body).length; k++) {
       if (Object.keys(this.finalChnQueryModel[q].body)[k] === Object.keys(queryModel.body)[j] && Object.keys(this.finalChnQueryModel[q].body) !== "undefined") {
        this.finalChnQueryModel[q].body[Object.keys(this.finalChnQueryModel[i].body)[k]] = queryModel.body[Object.keys(queryModel.body)[j]];
        this.finalChnQueryModel[q].body[Object.keys(this.finalChnQueryModel[q].body)[k]] = queryModel.body[Object.keys(
         queryModel.body)[j]];
         finalChnEntry = 1;
       }
      }
     }
     //finalChnEntry = 1;
    }
   }
   if (finalChnEntry === 0) {
    this.finalChnQueryModel.push(queryModel);
   } else {
    finalChnEntry = 0;
   }
   queryModel = {};
  }

  //this is to create separate models for newly created deep entities in change scenario
  this.setDeepEntityInChangedModel();
  var oChangeModelEntry = {};
  var address;

  if (this.oController.reEdit !== "X") {
   address = this.currentModel.getData();
   if (this.oController.changedArray.length !== 0 || this.aRemoveFields.length !== 0) {
    oChangeModelEntry.body = this.currentModel.getData();
    oChangeModelEntry.entity = "BP_Addresses";
    if (this.oController.changedArray.length !== 0)
     oChangeModelEntry.changes = this.finalQueryModel;
    if (address["EDIT"] !== "X") {
     oChangeModelEntry.index = this.vCommChanged++;
     oChangeModelEntry.SRecord = addressIndex;
     address["INDEX"] = oChangeModelEntry.index;
     this.queryChnModel.push(oChangeModelEntry);
     this.aChangedAddress.push(address.AD_ID);
    } else {
     this.queryChnModel[address.INDEX] = oChangeModelEntry;
    }
    address = this.addressModelHandling(address, this.oController.vCurrentActionId);
    this.addresschnModel = address;
    this.aRemoveFields = [];
   }
  }
  if (this.oController.reEdit === "X") {
   address = this.queryChnModel[this.vReEditIndex].body;
   this.oReEditChngModel = this.addressModelHandling(address, this.oController.vCurrentActionId);
   this.aRemoveFields = [];
  }

  // Controller Hook method call
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookOnChangeOfAddress(this, oWController);

 },

 // used in change of address model creation which will be used when submitting the changed address.
 setDeepEntityInChangedModel: function() {
  var oChangeModelEntry = {};
  var oChangeEntryDone = 0;
  var i;
  for (i = 0; i < this.finalChnQueryModel.length; i++) {
   if (this.finalChnQueryModel[i].action === "D") {
    oChangeModelEntry.body = "D";
    oChangeModelEntry.entity = this.finalChnQueryModel[i].entity;
    oChangeModelEntry.changes = this.finalChnQueryModel[i].body;
    oChangeModelEntry.header = this.finalChnQueryModel[i].header;
    oChangeModelEntry.AD_ID = this.finalChnQueryModel[i].header.split("'")[3];
    oChangeModelEntry.key = this.finalChnQueryModel[i].currentEntityKey;
    //this.oChangeModel.push(oChangeModelEntry);
    //oChangeModelEntry = {};
   } else if (this.finalChnQueryModel[i].action === "N") {
    oChangeModelEntry.body = "N";
    oChangeModelEntry.entity = this.finalChnQueryModel[i].entity;
    oChangeModelEntry.changes = this.finalChnQueryModel[i].body;
    oChangeModelEntry.header = this.finalChnQueryModel[i].header;
    oChangeModelEntry.AD_ID = this.finalChnQueryModel[i].header.split("'")[3];
    oChangeModelEntry.key = this.finalChnQueryModel[i].currentEntityKey;
    //this.oChangeModel.push(oChangeModelEntry);
    // oChangeModelEntry = {};
   } else if (this.finalChnQueryModel[i].action === "U") {
    oChangeModelEntry.body = "U";
    oChangeModelEntry.entity = this.finalChnQueryModel[i].entity;
    oChangeModelEntry.changes = this.finalChnQueryModel[i].body;
    oChangeModelEntry.AD_ID = this.finalChnQueryModel[i].header.split("'")[3];
    oChangeModelEntry.header = this.finalChnQueryModel[i].header;
    oChangeModelEntry.key = this.finalChnQueryModel[i].currentEntityKey;

   }
   for (var j = 0; j < this.oChangeModel.length; j++) {
    if (this.finalChnQueryModel[i].action === this.oChangeModel[j].body &&
     this.oChangeModel[j].entity === this.finalChnQueryModel[i].entity &&
     this.oChangeModel[j].header === this.finalChnQueryModel[i].header &&
     this.oChangeModel[j].key === this.finalChnQueryModel[i].currentEntityKey &&
     this.oChangeModel[j].AD_ID === this.finalChnQueryModel[i].header.split("'")[3] &&
     this.oChangeModel[j].changes === this.finalChnQueryModel[i].body) {
     //this.oChangeModel[j].changes = this.finalChnQueryModel[i].body;
     oChangeEntryDone = 1;
     oChangeModelEntry = {};
    }
   }

   if (oChangeEntryDone === 0) {
    this.oChangeModel.push(oChangeModelEntry);
   } else {
    oChangeEntryDone = 0;
   }
   oChangeModelEntry = {};
  }

 },
 onChange_Create: function(oEvent) {
  fcg.mdg.editbp.handlers.Communication.oController.onChange(oEvent);
 },

 //used for creating of model in case of delete of address
 onDelete: function(oController) {
  var i, j;
  var vDeletedAddress = {};
  var vSelectedRecord = "";
  if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
   vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  } else {
   vSelectedRecord = 0;
  }

  vDeletedAddress.body = this.oCurrentDelDataModel.BP_AddressesRel.results[vSelectedRecord];
  vDeletedAddress.header = "BP_AddressCollection(BP_GUID=" + oController.sItemPath + ",AD_ID='" + vDeletedAddress.body.AD_ID + "')";
  if (this.aChangedAddress.length > 0) {
   if (this.aChangedAddress.indexOf(vDeletedAddress.body.AD_ID) > -1) {
    var vChangedIndex = this.aChangedAddress.indexOf(vDeletedAddress.body.AD_ID);
    this.aChangedAddress.splice(vChangedIndex, 1);
    if (this.oChangeModel.length !== 0) {
     for (i = 0; i < this.oChangeModel.length;) {
      if (this.oChangeModel[i].AD_ID === this.queryChnModel[vChangedIndex].body.AD_ID) {
       this.oChangeModel.splice(i, 1);
      } else {
       i++;
      }
     }
    }
    if(this.finalChnQueryModel.length !== 0){
     for (i = 0; i < this.finalChnQueryModel.length;) {
      if (this.finalChnQueryModel[i].header.split("'")[3] === this.queryChnModel[vChangedIndex].body.AD_ID) {
       this.finalChnQueryModel.splice(i, 1);
      } else {
       i++;
      }
     }
    }
    this.queryChnModel.splice(vChangedIndex, 1);
    oController.getView().byId("addrsCommnChangeLayout").getContent()[vChangedIndex].destroy();
    this.oCurrentDelDataModel.BP_AddressesRel.results[vSelectedRecord]["DELETED"] = "X";
    var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
    var vQuery = path +
     "BP_AddressesRel,BP_AddressesRel/BP_CommPhoneRel,BP_AddressesRel/BP_CommMobileRel,BP_AddressesRel/BP_CommFaxRel,BP_AddressesRel/BP_CommEMailRel,";

    if (this.oController.sCategory === "1") {
     vQuery = vQuery + "BP_AddressesRel/BP_AddressVersionsPersRel/BP_AddressPersonVersionRel";
    } else {
     vQuery = vQuery + "BP_AddressesRel/BP_AddressVersionsOrgRel";
    }
    var oResults = fcg.mdg.editbp.util.DataAccess.readData(vQuery, oController);

    //controller hook method
    var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
    var oExtResults = oWController.bpHookReadAddressData(this, vQuery, oResults);
    if (oExtResults !== undefined) {
     oResults = oExtResults;
    }

    this.oCurrentDelDataModel.BP_AddressesRel.results[vSelectedRecord] = oResults.BP_AddressesRel.results[vSelectedRecord];
    vDeletedAddress.body = this.oCurrentDelDataModel.BP_AddressesRel.results[vSelectedRecord];
   } else {
    this.oCurrentDelDataModel.BP_AddressesRel.results[vSelectedRecord]["DELETED"] = "X";
   }
  } else {
   this.oCurrentDelDataModel.BP_AddressesRel.results[vSelectedRecord]["DELETED"] = "X";
  }

  this.oDeleteModel.push(vDeletedAddress);
  var vLoadModel = vDeletedAddress.body;
  this.addressdelModel = vLoadModel;

  //for checking which Address is deleted
  for (i = 0; i < this.oDeleteModel.length; i++) {
   // Remove the deleted address from the Model
   for (j = 0; j < this.oController.oDetailComm.BP_AddressesRel.results.length; j++) {
    if (this.oDeleteModel[i].body.AD_ID === this.oController.oDetailComm.BP_AddressesRel.results[j].AD_ID) {
     this.oController.oDetailComm.BP_AddressesRel.results.splice(j, 1);
     break;
    }
   }
  }

 },

 //used in create of model in case of creation of address
 onCreate: function() {
  var currentChanges = (JSON.parse(JSON.stringify(this.oController.createdArray)));
  var updatedData;
  var queryModel = {};
  var i, j;
  for (i = 0; i < currentChanges.length;) {
   updatedData = "{";
   queryModel.index = this.oCreateModel.length + 1;
   queryModel.entity = currentChanges[i].entity;
   if (currentChanges[i].currentEntityKey !== undefined) {
    queryModel.currentEntityKey = currentChanges[i].currentEntityKey;
   }
   if (currentChanges[i].key !== undefined) {
    updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].key + "\",";
    updatedData = updatedData + "\"" + currentChanges[i].field + "__TXT" + "\":\"" + currentChanges[i].value + "\",";
   } else {
    updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].value + "\",";
   }
   for (j = i + 1; j < currentChanges.length;) {
    if (currentChanges[i].entity === currentChanges[j].entity && currentChanges[i].currentEntityKey === currentChanges[j].currentEntityKey) {
     if (currentChanges[j].key !== undefined) {
      updatedData = updatedData + "\"" + currentChanges[j].field + "\":\"" + currentChanges[j].key + "\",";
      updatedData = updatedData + "\"" + currentChanges[j].field + "__TXT" + "\":\"" + currentChanges[j].value + "\",";
     } else {
      updatedData = updatedData + "\"" + currentChanges[j].field + "\":\"" + currentChanges[j].value + "\",";
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
  if (this.oController.reEdit !== "X") {
   var address = {};

   for (i = 0; i < this.finalQueryModel.length; i++) {
    if (this.finalQueryModel[i].entity === "BP_Address") {
     address = this.finalQueryModel[i].body;
     this.finalQueryModel.splice(i, 1);
     break;
    }
   }
   if(this.oController.sCategory === "1"){
    this.handlePersonIAV();
   }
   address = this.addressModelHandling(address, this.oController.vCurrentActionId);
   this.createAddressDescrText(address);
   var oCreateModelEntry = {};
   if (this.oController.createdArray.length !== 0) { //can be removed since invalidate step is there
    oCreateModelEntry.index = this.oCreateModel.length + 1;
    oCreateModelEntry.body = address;
    oCreateModelEntry.entity = "BP_Addresses";
    this.oCreateModel.push(oCreateModelEntry);
    this.addresscrtModel = address;
    this.aRemoveFields = [];
   }
  }
  if (this.oController.reEdit === "X") {
   address = this.oCreateModel[this.vReEditIndex].body;
   this.createAddressDescrText(address);
   this.oReEditCrtModel = this.addressModelHandling(address, this.oController.vCurrentActionId);
   this.aRemoveFields = [];
  }
  // Controller Hook method call
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookOnCreateOfAddress(this, oWController);
 },

 handlePersonIAV: function(){
  var i;

 },

 //used for creation/deletion/edit of model for create/change Address
 addressModelHandling: function(address, sAction) {
  var i, j, k, q;
  if (address !== undefined) {
   for (i = 0; i < this.finalQueryModel.length; i++) {
    //to update the Address Entity
    if (this.finalQueryModel[i].entity === "BP_Address") {
     for (k = 0; k < Object.keys(this.finalQueryModel[i].body).length; k++) {
      address[Object.keys(this.finalQueryModel[i].body)[k]] = this.finalQueryModel[i].body[Object.keys(this.finalQueryModel[i].body)[k]];
      if (sAction === "changeRB")
       address.ChangeData[Object.keys(this.finalQueryModel[i].body)[k]] = this.finalQueryModel[i].body[Object.keys(this.finalQueryModel[i]
        .body)[k]];
     }
     this.finalQueryModel.splice(i, 1);
     i = i - 1;
    }
    // to update the SubEntity when it exsist in Address Entity
    else if (address.hasOwnProperty(this.finalQueryModel[i].entity + "Rel") || (this.finalQueryModel[i].entity === "BP_AddressPersonVersion")) {
     var oSubEntityArray;
     if(this.finalQueryModel[i].entity === "BP_AddressPersonVersion"){
      if(address.BP_AddressVersionsPersRel.results[this.finalQueryModel[i].currentEntityKey].BP_AddressPersonVersionRel === undefined){
       address.BP_AddressVersionsPersRel.results[this.finalQueryModel[i].currentEntityKey].BP_AddressPersonVersionRel = {};
      }
      oSubEntityArray = address.BP_AddressVersionsPersRel.results[this.finalQueryModel[i].currentEntityKey].BP_AddressPersonVersionRel;
     }else{
      oSubEntityArray = address[this.finalQueryModel[i].entity + "Rel"].results;
     }

     var len = "";
     if (oSubEntityArray.length === 0) {
      len = 0;
     } else {
      if(this.finalQueryModel[i].entity === "BP_AddressPersonVersion"){
       len = address.BP_AddressVersionsPersRel.results.length - 1;
       if(Object.keys(oSubEntityArray).length === 0){
        len = -1;
       }
       // if(this.finalQueryModel[i].action === "N"){
       //  len = -1; // this entity has to be appended as a deep entity and if its "N" then tht means the parent entity is also new
       // }
      }else{
       len = oSubEntityArray.length - 1;
      }
     }

     if (this.finalQueryModel[i].currentEntityKey > len) {
      var chageObj = {};
      if(this.finalQueryModel[i].entity === "BP_AddressPersonVersion"){
       oSubEntityArray = this.finalQueryModel[i].body ;
      }else{
       oSubEntityArray.push(this.finalQueryModel[i].body);
      }
      if (sAction === "changeRB" || this.finalQueryModel[i].entity === "BP_AddressPersonVersion") {
       var oLastSubEntityArray = {};
       if(this.finalQueryModel[i].entity === "BP_AddressPersonVersion"){
        oLastSubEntityArray = oSubEntityArray;
       }else{
        oLastSubEntityArray = oSubEntityArray[oSubEntityArray.length - 1];
       }

       for (q = 0; q < Object.keys(oLastSubEntityArray).length; q++) {
        chageObj[Object.keys(this.finalQueryModel[i].body)[q]] = this.finalQueryModel[i].body[Object.keys(this.finalQueryModel[i].body)[q]];
       }
       oLastSubEntityArray.ChangeData = chageObj;
       if(this.finalQueryModel[i].entity === "BP_AddressPersonVersion"){
        if(len === -1){
         delete oLastSubEntityArray.ChangeData;
        }
        address.BP_AddressVersionsPersRel.results[this.finalQueryModel[i].currentEntityKey].BP_AddressPersonVersionRel = oLastSubEntityArray;
       }
      }
      this.finalQueryModel.splice(i, 1);
      i = i - 1;
     } else {
      var subEntityIndex = this.finalQueryModel[i].currentEntityKey;
      if(this.finalQueryModel[i].entity === "BP_AddressPersonVersion"){
       for (k = 0; k < Object.keys(oSubEntityArray).length ; k++) {
        //if BP_AddressVersionsOrgRel or BP_AddressVersionsPersRel contains Title as None set it as "".
        if (Object.keys(oSubEntityArray)[k] === "TITLE_P__TXT" && oSubEntityArray[Object.keys(oSubEntityArray)[k]] === "None") {
         oSubEntityArray[Object.keys(oSubEntityArray)[k]] = "";
        } else {
         oSubEntityArray[Object.keys(this.finalQueryModel[i].body)[k]] = this.finalQueryModel[i].body[Object.keys(this.finalQueryModel[
          i].body)[k]];
        }
        if (sAction === "changeRB")
         oSubEntityArray.ChangeData[Object.keys(this.finalQueryModel[i].body)[k]] = this.finalQueryModel[i].body[Object.keys(
          this.finalQueryModel[i].body)[
          k]];
       }

       this.finalQueryModel.splice(i, 1);
       i = i - 1;
      }
      else if (oSubEntityArray[subEntityIndex] === undefined) {
       if(this.finalQueryModel[i].entity === "BP_AddressPersonVersion"){
        delete address.BP_AddressVersionsPersRel.results[this.finalQueryModel[i].currentEntityKey].BP_AddressPersonVersionRel;
       }else{
        delete address[this.finalQueryModel[i].entity + "Rel"];
       }
       this.createCommModel(address, this.finalQueryModel[i].entity + "Rel", sAction);
       this.finalQueryModel.splice(i, 1);
       i = i - 1;
      } else {
       for (k = 0; k < Object.keys(oSubEntityArray[subEntityIndex]).length; k++) {
        //if BP_AddressVersionsOrgRel or BP_AddressVersionsPersRel contains Title as None set it as "".
        if (Object.keys(oSubEntityArray[subEntityIndex])[k] === "TITLE__TXT" || Object.keys(oSubEntityArray[subEntityIndex])[k] === "TITLE_P__TXT"
        && oSubEntityArray[subEntityIndex][Object.keys(oSubEntityArray[subEntityIndex])[k]] === "None") {
         oSubEntityArray[subEntityIndex][Object.keys(oSubEntityArray[subEntityIndex])[k]] = "";
        } else {
         oSubEntityArray[subEntityIndex][Object.keys(this.finalQueryModel[i].body)[k]] = this.finalQueryModel[i].body[Object.keys(this.finalQueryModel[
          i].body)[k]];
        }
        if (sAction === "changeRB")
         oSubEntityArray[subEntityIndex].ChangeData[Object.keys(this.finalQueryModel[i].body)[k]] = this.finalQueryModel[i].body[Object.keys(
          this.finalQueryModel[i].body)[
          k]];
       }

       this.finalQueryModel.splice(i, 1);
       i = i - 1;
      }
     }
     // to create the SubEntity when it doesnt exsist in Address Entity
    } else if (!address.hasOwnProperty(this.finalQueryModel[i].entity + "Rel") && this.finalQueryModel[i].entity + "Rel" !==
     "BP_Address") {
     this.createCommModel(address, this.finalQueryModel[i].entity + "Rel", sAction);
     this.finalQueryModel.splice(i, 1);
     i = i - 1;
    }
   }

   //for deleting the data from the model which was deleted from UI & IAV which is set to None
   if (this.aRemoveFields.length !== 0) {
    for (j = 0; j < this.aRemoveFields.length; j++) {
     var index = this.aRemoveFields[j].split("-")[1];
     if (this.aRemoveFields[j].split("-")[0] === "BP_CommPhoneRel" && this.aRemoveFields[j].split("-")[2] === sAction) {
      address.BP_CommPhoneRel.results[index] = [];
     } else if (this.aRemoveFields[j].split("-")[0] === "BP_CommMobileRel" && this.aRemoveFields[j].split("-")[2] === sAction) {
      address.BP_CommMobileRel.results[index] = [];
     } else if (this.aRemoveFields[j].split("-")[0] === "BP_CommFaxRel" && this.aRemoveFields[j].split("-")[2] === sAction) {
      address.BP_CommFaxRel.results[index] = [];
     } else if (this.aRemoveFields[j].split("-")[0] === "BP_CommEMailRel" && this.aRemoveFields[j].split("-")[2] === sAction) {
      address.BP_CommEMailRel.results[index] = [];
     } else if (this.aRemoveFields[j].split("-")[0] === "BP_CommURIRel" && this.aRemoveFields[j].split("-")[2] === sAction) {
      address.BP_CommURIRel.results[index] = [];
     } else if (this.aRemoveFields[j].split("-")[0] === "BP_AddressVersionsOrgRel" && this.aRemoveFields[j].split("-")[2] === sAction) {
      address.BP_AddressVersionsOrgRel.results[index] = [];
     } else if (this.aRemoveFields[j].split("-")[0] === "BP_AddressVersionsPersRel" && this.aRemoveFields[j].split("-")[2] === sAction) {
      address.BP_AddressVersionsPersRel.results[index] = [];
     }
    }
   }

   //Controller hook
   var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
   var oExtAddress = oWController.bpHookAddressModelHandling(this, address, sAction);
   if (oExtAddress !== undefined) {
    address = oExtAddress;
   }

   return address;
  }
 },

 //used when new address is created and we create the AD_ID and AD_ID_text attribute which will be used in contact person.
 createAddressDescrText: function(address) {
  var addressId = "0000000000";
  var houseNum = "";
  var street = "";
  var city = "";
  var region = "";
  var postalcode = "";

  this.vAD_ID += 1;

  // convert to string
  var newAD_ID = this.vAD_ID + "";

  // prefix zeros
  var AD_ID_LEN = newAD_ID.length;
  for(var i = 0; i < 6 - AD_ID_LEN; ++i) {
   newAD_ID = "0" + newAD_ID;
  }

  // use the new address ID
  addressId = "TEMP" + newAD_ID;
  address["AD_ID"] = addressId.slice(-10);

  if (address.HOUSE_NO !== undefined) {
   houseNum = address.HOUSE_NO + " ";
  }
  if (address.STREET !== undefined) {
   street = address.STREET + " ";
  }
  if (address.CITY !== undefined) {
   city = address.CITY + " ";
  }
  if (address.REGION !== undefined) {
   region = address.REGION + " ";
  }
  if (address.POSTL_COD1 !== undefined) {
   postalcode = address.POSTL_COD1;
  }

  if (address.COUNTRY === "US") {
   if (address.HOUSE_NO === undefined && address.STREET === undefined) {
    address["AD_ID__TXT"] = postalcode + city;
   } else if (address.CITY === undefined && address.POSTL_COD1 === undefined) {
    address["AD_ID__TXT"] = street + houseNum;
   } else if (address.HOUSE_NO === undefined && address.STREET === undefined && address.CITY === undefined && address.POSTL_COD1 ===
    undefined) {
    address["AD_ID__TXT"] = "";
   } else {
    address["AD_ID__TXT"] = street + houseNum + "/ " + postalcode + city;
   }
  } else {
   if (address.HOUSE_NO === undefined && address.STREET === undefined) {
    address["AD_ID__TXT"] = city + region + postalcode;
   } else if (address.REGION === undefined && address.POSTL_COD1 === undefined) {
    address["AD_ID__TXT"] = houseNum + street;
   } else if (address.HOUSE_NO === undefined && address.STREET === undefined && address.REGION === undefined && address.POSTL_COD1 ===
    undefined) {
    address["AD_ID__TXT"] = "";
   } else {
    address["AD_ID__TXT"] = houseNum + street + "/ " + city + region + postalcode;
   }
  }
  // Controller Hook method call
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  var oExtAddress = oWController.bpHookCreateAddressDescrText(this, address);
  if (oExtAddress !== undefined) {
   address["AD_ID__TXT"] = oExtAddress["AD_ID__TXT"];
  }
 },

 //used in method addressModelHandling, it create the complete Entity for address if it does not exist before eg adding new phone in address.
 createCommModel: function(address, sEntity, sAction) {
  var resultObj = {};
  var result = [];
  var i, q;
  for (i = 0; i < this.finalQueryModel.length; i++) {
   if (this.finalQueryModel[i].entity + "Rel" === sEntity) {
    result.push(this.finalQueryModel[i].body);
    if (sAction === "changeRB") {
     var chageObj = {};
     for (q = 0; q < Object.keys(this.finalQueryModel[i].body).length; q++) {
      chageObj[Object.keys(this.finalQueryModel[i].body)[q]] = this.finalQueryModel[i].body[Object.keys(this.finalQueryModel[i].body)[q]];
     }
     result[result.length - 1].ChangeData = chageObj;
    }
    break;
   }
  }
  resultObj.results = result;
  if(sEntity === "BP_AddressPersonVersion"){
   address.BP_AddressVersionsPersRel.results[this.finalQueryModel[i].currentEntityKey].BP_AddressPersonVersionRel = result;
  }else{
  address[sEntity] = resultObj;
  }
 },

 //used to call syn. call for address from backend.
 getAddressData: function(oController) {
  this.oController = oController;
  if (this.oController.oDetailComm === "") {
   this.getAddressCommIAVData(oController);
   var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
   var addressQuery = path + "BP_AddressesRel,BP_AddressUsagesRel";
   this.oController.oDetailComm = fcg.mdg.editbp.util.DataAccess.readData(addressQuery, oController);

   //controller hook method
   var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
   var oExtResults = oWController.bpHookReadAddressData(this, addressQuery, this.oController.oDetailComm);
   if (oExtResults !== undefined) {
    this.oController.oDetailComm = oExtResults;
   }
  }
  if (fcg.mdg.editbp.util.DataAccess.checkCurrentModel()) {
   fcg.mdg.editbp.util.DataAccess.getCurrentModel().BP_AddressesRel = this.oController.oDetailComm.BP_AddressesRel;
  } else {
   fcg.mdg.editbp.util.DataAccess.setCurrentModel(this.oController.oDetailComm);
  }
  this.setActionLayout(this.oController.oDetailComm);
 },

 //used to call Asyn. call for address from backend.
 getAddressCommIAVData: function(oController) {
  var that = this;
  var vBoolean;
  this.oController = oController;
  this.oController.isAddressVisited = "X";
  var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";

  var vQuery = path +
   "BP_AddressUsagesRel,BP_AddressesRel,BP_AddressesRel/BP_CommPhoneRel,BP_AddressesRel/BP_CommMobileRel,BP_AddressesRel/BP_CommFaxRel,BP_AddressesRel/BP_CommEMailRel,BP_AddressesRel/BP_CommURIRel";
  if (this.oController.sCategory === "1") {
   vQuery = vQuery + ",BP_AddressesRel/BP_AddressVersionsPersRel/BP_AddressPersonVersionRel";
  } else {
   vQuery = vQuery + ",BP_AddressesRel/BP_AddressVersionsOrgRel";
  }
  vBoolean = true;

  //controller hook method
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  var oExtQuery = oWController.bpHookReadCommunicationData(this, vQuery);
  if (oExtQuery !== undefined) {
   vQuery = oExtQuery;
  }
  this.oDataModel = new sap.ui.model.odata.ODataModel(oController.getView().getModel().sServiceUrl, true);
  this.oDataModel.read(
   vQuery,
   null,
   null,
   vBoolean,
   function(response) {
    that.oController.oDetailComm = response;
    for (var i = 0; i < that.oController.oDetailComm.BP_AddressesRel.results.length; i++) {
     that.aDelAddressId.push(that.oController.oDetailComm.BP_AddressesRel.results[i].AD_ID);
    }
    var numDeepEntities = {};
    //to set the standard address

    for (i = 0; i < response.BP_AddressUsagesRel.results.length; i++) {
     if (response.BP_AddressUsagesRel.results[i].ADDRESSTYPE === "XXDEFAULT") {
      // Global variable to store the id of Standard address which will be used during query formation to determine std address if std address is deleted
      that.vStdAddress = response.BP_AddressUsagesRel.results[i].AD_ID;
      break;
     }
    }

    //to count the deep entities 
    for (i = 0; i < response.BP_AddressesRel.results.length; i++) {
     if (response.BP_AddressesRel.results[i].BP_CommPhoneRel.results !== undefined) {
      numDeepEntities.numPhn = response.BP_AddressesRel.results[i].BP_CommPhoneRel
       .results.length;
     } else {
      numDeepEntities.numPhn = 0;
     }

     if (response.BP_AddressesRel.results[i].BP_CommMobileRel.results !== undefined) {
      numDeepEntities.numMob = response.BP_AddressesRel.results[i].BP_CommMobileRel
       .results.length;
     } else {
      numDeepEntities.numMob = 0;
     }
     if (response.BP_AddressesRel.results[i].BP_CommFaxRel.results !== undefined) {
      numDeepEntities.numFax = response.BP_AddressesRel.results[i].BP_CommFaxRel.results
       .length;
     } else {
      numDeepEntities.numFax = 0;
     }

     if (response.BP_AddressesRel.results[i].BP_CommEMailRel.results !== undefined) {
      numDeepEntities.numEmail = response.BP_AddressesRel.results[i].BP_CommEMailRel
       .results.length;
     } else {
      numDeepEntities.numEmail = 0;
     }
     if (response.BP_AddressesRel.results[i].BP_CommURIRel.results !== undefined) {
      numDeepEntities.numURI = response.BP_AddressesRel.results[i].BP_CommURIRel.results
       .length;
     } else {
      numDeepEntities.numURI = 0;
     }

     if (that.oController.sCategory === "1") {
      if (response.BP_AddressesRel.results[i].BP_AddressVersionsPersRel.results !== undefined) {
       numDeepEntities.numIAV = response.BP_AddressesRel.results[i].BP_AddressVersionsPersRel
        .results.length;
      } else {
       numDeepEntities.numIAV = 0;
      }
     } else {
      if (response.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel.results !== undefined) {
       numDeepEntities.numIAV = response.BP_AddressesRel.results[i].BP_AddressVersionsOrgRel
        .results.length;
      } else {
       numDeepEntities.numIAV = 0;
      }
     }
     that.oCountDeepEntities.push(numDeepEntities);
     numDeepEntities = {};

    }
    fcg.mdg.editbp.util.DataAccess.setCurrentModel(that.oController.oDetailComm);

   });

 },

 //used to call asyn. call for basic CP details from backend, if not already present in fcg.mdg.editbp.handlers.ContactPerson.oRelResults
 getCPBasicData: function(oController) {
  this.oController = oController;
  if((fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel === undefined || fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results !== undefined || fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length > 0) && this.oController.oCPBasicData === undefined) {
   var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
   var CPQuery = path + "BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel";
   fcg.mdg.editbp.util.DataAccess.readDataAsynchronous(CPQuery, oController, function(response) {
    this.oCPBasicData = response;
   }.bind(this));
  }
 },

 //used for enabling/disabling of create/change/delete radio button after seleting the Address Entity
 setActionLayout: function(result) {
  this.oController.getView().byId("entityStep").setNextStep(this.oController.getView().byId("actionStep"));
  if (this.oController.oActionLayout === "") {
   this.oController.oActionLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectAction', this.oController);
  }
  this.oController.getView().byId("actionLayout").setVisible(true);
  this.oController.getView().byId("actionLayout").addContent(this.oController.oActionLayout);
  this.oController.setRadioButtonText();
  sap.ui.getCore().byId("changeRB").setVisible(true);
  if (result.BP_AddressesRel.results.length === 0) {
   sap.ui.getCore().byId("changeRB").setEnabled(false);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(-1);
   sap.ui.getCore().byId("deleteRB").setEnabled(false);
  } else {
   sap.ui.getCore().byId("changeRB").setEnabled(true);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(1);
   sap.ui.getCore().byId("deleteRB").setEnabled(true);
  }
 },

 //used in methid handleSelectItemForComm, used to load fragment for change of Address and bind the fields.
 getAddressDetailsPage: function(result, index) {
  this.getCommData(result, index);
  this.oController.getView().byId("selectEntityInstanceStep").setNextStep(this.oController.getView().byId("communicationStep"));
  this.loadCommlayout(this.oController, result.BP_AddressesRel.results[index]);
  var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
  this.oCurrentDataModel = result;
  oModel.setData(result.BP_AddressesRel.results[index]);
  this.oAddressCreate.setModel(oModel);
  this.currentModel = oModel;
  this.createCommIAVFields(this.currentModel.getData());
 },

 getCommData: function(oResult, index) {
  var addressIndex = "";
  if (sap.ui.getCore().byId("selectDataListRBG") === undefined) {
   addressIndex = 0;
  } else {
   addressIndex = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  }
  this.selectedIndex = addressIndex;

  //Controller Hook
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookSetDeepEntityCount(this, oResult, index);
 },

 //used from method handleCommunication, which is used to find number of address present and create communication fields and bind it.
 editCommunication: function(commResult) {
  if (commResult.BP_AddressesRel.results.length > 1) {
   this.setSelectEntityLayout(commResult);
   return;
  }
  var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
  this.oCurrentDataModel = commResult;
  if (commResult.BP_AddressesRel.results.length !== 0) {
   if (commResult.BP_AddressesRel.results.length === 1) {
    this.getCommData(commResult, 0);
    this.selectedIndex = 0;
    if (this.oController.vCurrentActionId === "changeRB") {
     this.oController.getView().byId("actionStep").setNextStep(this.oController.getView().byId("communicationStep"));
     this.loadCommlayout(this.oController, commResult.BP_AddressesRel.results[0]);
     oModel.setData(commResult.BP_AddressesRel.results[0]);
     this.oAddressCreate.setModel(oModel);
     this.currentModel = oModel;
     this.createCommIAVFields(this.currentModel.getData());
    } else {
     this.setSelectEntityLayout(commResult);
    }
   }
  }
 },

 //used in case of multiple address is present, and load the radio button fragment which have the addresses desc.
 setSelectEntityLayout: function(result) {
  var oModel = new sap.ui.model.json.JSONModel();
  var strResults = {
   dataitems: []
  };
  var i;
  var oDataItems;
  var stdAddressID, stdAddressFlag, vAddressAttribute, i;
  if (this.oController.vCurrentActionId === "deleteRB") {
   this.oController.getView().byId("actionStep").setNextStep(this.oController.getView().byId("editStep"));
   if (result.BP_AddressesRel.results.length > 1) {
    for (i = 0; i < result.BP_AddressUsagesRel.results.length; i++) {
     if (result.BP_AddressUsagesRel.results[i].ADDRESSTYPE === "XXDEFAULT") {
      stdAddressID = result.BP_AddressUsagesRel.results[i].AD_ID;
      // Global variable to store the id of Standard address which will be used during query formation to determine std address if std address is deleted
     // this.vStdAddress = stdAddressID;
      break;
     }
    }
   }
   this.oCurrentDelDataModel = result;
  } else {
   this.oController.getView().byId("actionStep").setNextStep(this.oController.getView().byId("selectEntityInstanceStep"));
  }
  if (this.oController.oCommunicationListRBG === "") {
   this.oController.oCommunicationListRBG = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntityInstance', this.oController);
  }

  if (this.oController.vCurrentActionId === "deleteRB") {
   this.oController.getView().byId("editLayout").setVisible(true);
   if (this.oController.getView().byId("editLayout").getContent().length > 0) {
    this.oController.getView().byId("editLayout").removeAllContent();
   }
   this.oController.getView().byId("editLayout").addContent(this.oController.oCommunicationListRBG);
  } else {
   this.oController.getView().byId("selectEntityInstanceLayout").setVisible(true);
   this.oController.getView().byId("selectEntityInstanceLayout").addContent(this.oController.oCommunicationListRBG);
  }

  // check if address is already in use by contact person, if yes then disable the radio button for delete
  // first check if the CP data has already been loaded, if yes then use that model, change model and create model
  var aAddressList = [];
  if (this.oController.vCurrentActionId === "deleteRB") {
   aAddressList = this.getAddressesUsedByCP();
  }
  for (i = 0; i < result.BP_AddressesRel.results.length; i++) {
   vAddressAttribute = result.BP_AddressesRel.results[i];
   if (this.oController.vCurrentActionId === "deleteRB") {
    if(aAddressList.indexOf(result.BP_AddressesRel.results[i].AD_ID) !== -1) {
     stdAddressFlag = false;
    } else {
     // also disable if address is standard address
     if (result.BP_AddressesRel.results.length === 1) {
       stdAddressFlag = true;
     } else {
      if (stdAddressID === result.BP_AddressesRel.results[i].AD_ID) {
       stdAddressFlag = false;
      } else {
       stdAddressFlag = true;
      }
     }
    }
    oDataItems = {
     "RBText": fcg.mdg.editbp.util.Formatter.createRecordsToProcessForAddress(vAddressAttribute),
     "AD_ID" : result.BP_AddressesRel.results[i].AD_ID,
     "enableFlag": stdAddressFlag // diabled if standard address
    };
   } else {
    oDataItems = {
     "RBText": fcg.mdg.editbp.util.Formatter.createRecordsToProcessForAddress(vAddressAttribute)
    };
   }

   strResults.dataitems.push(oDataItems);
  }


  //Controller Hook
  var extStrResults = this.oController.bpHookSetSelectRecordLayout(this, result, strResults);
  if (extStrResults !== undefined) {
   strResults = extStrResults;
  }

  var addressListRBG = sap.ui.getCore().byId("selectDataListRBG");
  if(this.oController.vCurrentActionId === "deleteRB"){
   sap.ui.getCore().byId("idInvTextEntityRBG").setText(this.oController.i18nBundle.getText("selet_comm_del"));
  }else{
   sap.ui.getCore().byId("idInvTextEntityRBG").setText(this.oController.i18nBundle.getText("selet_comm"));
  }
  oModel.setData(strResults);
  addressListRBG.setModel(oModel);
  addressListRBG.setSelectedIndex(-1);
 },

 getAddressesUsedByCP: function() {
  var aAddressList = [];
  if(fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel !== undefined && fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results !== undefined) {
   // combine three models to make a comprehensive list of addresses used by all CP

   // change model
   var aChangedCP = fcg.mdg.editbp.handlers.ContactPersonChange.cpQueryModel;
   // Keep track of changed CPs, coz you shouldnt consider while looping through loaded model
   var aChangedCPIDs = [];
   for(var p = 0; p < aChangedCP.length; ++p) {
    var aCPAddresses = aChangedCP[p].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
    aChangedCPIDs.push(aChangedCP[p].BP_RelationContactPersonRel.PARTNER2);
    for(var j = 0; j < aCPAddresses.length; ++j) {
     if(aCPAddresses[j].action !== "D") {
      // check if already exists in aAddressList, if not then add it
      var index = aAddressList.indexOf(aCPAddresses[j].ADDRESS_NUMBER);
      if(index === -1) {
       aAddressList.push(aCPAddresses[j].ADDRESS_NUMBER);
       continue;
      }
     }
    }
   }
   // loaded model
   var aLoadedCP = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results;
   for(var p = 0; p < aLoadedCP.length; ++p) {
    var aCPAddresses = aLoadedCP[p].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
    // check if the cp is changed, if yes then we have already dealt with it, so we need not process it now
    if(aChangedCPIDs.indexOf(aLoadedCP[p].BP_RelationContactPersonRel.PARTNER2) !== -1) {
     continue;
    }
    for(var j = 0; j < aCPAddresses.length; ++j) {
     // check if already exists in aAddressList, if not then add it
     var index = aAddressList.indexOf(aCPAddresses[j].ADDRESS_NUMBER);
     if(index === -1) {
      aAddressList.push(aCPAddresses[j].ADDRESS_NUMBER);
      continue;
     }
    }
   }
   // create model
   var aCreateCP = fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel;
   for(var p = 0; p < aCreateCP.length; ++p) {
    var aCPAddresses = aCreateCP[p].body.BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel;
    for(var j = 0; j < aCPAddresses.length; ++j) {
     // check if already exists in aAddressList, if not then add it
     var index = aAddressList.indexOf(aCPAddresses[j].ADDRESS_NUMBER);
     if(index === -1) {
      aAddressList.push(aCPAddresses[j].ADDRESS_NUMBER);
      continue;
     }
    }
   }
  } else {
   // use the model got from the backend call
   var aLoadedCP = this.oCPBasicData.BP_RelationsRel.results;
   // [0].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
   for(var p = 0; p < aLoadedCP.length; ++p) {
    var aCPAddresses = aLoadedCP[p].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
    for(var j = 0; j < aCPAddresses.length; ++j) {
     // check if already exists in aAddressList, if not then add it
     var index = aAddressList.indexOf(aCPAddresses[j].ADDRESS_NUMBER);
     if(index === -1) {
      aAddressList.push(aCPAddresses[j].ADDRESS_NUMBER);
      continue;
     }
    }
   }
  }
  return aAddressList;
 },

 // used for find is data present in model in communication and IAV in model, if yes then create the fields.
 createCommIAVFields: function(commResult) {
  this.vIdCounterTel = 0;
  this.vIdCounterMob = 0;
  this.vIdCounterFax = 0;
  this.vIdCounterEmail = 0;
  this.vIdCounterURI = 0;
  this.oIavFormId = 0;
  if (this.oController.reEdit !== "X" && this.oController.vCurrentActionId !== "changeRB") {
   var vCountry = sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue();
   if (sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").getValue() === "") {
    sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").setValue(vCountry);
   }
   if (sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").getValue() === "") {
    sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").setValue(vCountry);
   }
   if (sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").getValue() === "") {
    sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").setValue(vCountry);
   }
  }
  if (commResult.BP_CommPhoneRel !== undefined) {
   if (commResult.BP_CommPhoneRel.results !== undefined) {
    if (commResult.BP_CommPhoneRel.results.length !== 0) {
     var phnModel = new sap.ui.model.json.JSONModel();
     phnModel.setData(commResult.BP_CommPhoneRel.results[0]);
     this.oAddressContactCreate.setModel(phnModel, "tel");
     this.setEditCommModel(commResult.BP_CommPhoneRel.results, "tel");
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
    } else {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
    }
   } else {
    commResult.BP_CommPhoneRel.results = [];
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
   }
  } else {
   fcg.mdg.editbp.handlers.Communication.handleDisableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
  }
  if (commResult.BP_CommMobileRel !== undefined) {
   if (commResult.BP_CommMobileRel.results !== undefined) {
    if (commResult.BP_CommMobileRel.results.length !== 0) {
     var mobModel = new sap.ui.model.json.JSONModel();
     mobModel.setData(commResult.BP_CommMobileRel.results[0]);
     this.oAddressContactCreate.setModel(mobModel, "mob");
     this.setEditCommModel(commResult.BP_CommMobileRel.results, "mob");
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
    } else {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
    }
   } else {
    commResult.BP_CommMobileRel.results = [];
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
   }
  } else {
   fcg.mdg.editbp.handlers.Communication.handleDisableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
  }
  if (commResult.BP_CommFaxRel !== undefined) {
   if (commResult.BP_CommFaxRel.results !== undefined) {
    if (commResult.BP_CommFaxRel.results.length !== 0) {
     var faxModel = new sap.ui.model.json.JSONModel();
     faxModel.setData(commResult.BP_CommFaxRel.results[0]);
     this.oAddressContactCreate.setModel(faxModel, "fax");
     this.setEditCommModel(commResult.BP_CommFaxRel.results, "fax");
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
    } else {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
    }
   } else {
    commResult.BP_CommFaxRel.results = [];
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
   }
  } else {
   fcg.mdg.editbp.handlers.Communication.handleDisableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
  }
  if (commResult.BP_CommEMailRel !== undefined) {
   if (commResult.BP_CommEMailRel.results !== undefined) {
    if (commResult.BP_CommEMailRel.results.length !== 0) {
     var emailModel = new sap.ui.model.json.JSONModel();
     emailModel.setData(commResult.BP_CommEMailRel.results[0]);
     this.oAddressContactCreate.setModel(emailModel, "email");
     this.setEditCommModel(commResult.BP_CommEMailRel.results, "email");
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
    } else {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
    }
   } else {
    commResult.BP_CommEMailRel.results = [];
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
   }
  } else {
   fcg.mdg.editbp.handlers.Communication.handleDisableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
  }
  if (commResult.BP_CommURIRel !== undefined) {
   if (commResult.BP_CommURIRel.results !== undefined) {
    if (commResult.BP_CommURIRel.results.length !== 0) {
     var uriModel = new sap.ui.model.json.JSONModel();
     uriModel.setData(commResult.BP_CommURIRel.results[0]);
     this.oAddressContactCreate.setModel(uriModel, "uri");
     this.setEditCommModel(commResult.BP_CommURIRel.results, "uri");
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
    } else {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
    }
   } else {
    commResult.BP_CommURIRel.results = [];
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
   }
  } else {
   fcg.mdg.editbp.handlers.Communication.handleDisableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
  }
  if (commResult.BP_AddressVersionsOrgRel !== undefined)
   if (commResult.BP_AddressVersionsOrgRel.results !== undefined) {
    if (commResult.BP_AddressVersionsOrgRel.results.length !== 0) {
     this.setEditCommModel(commResult.BP_AddressVersionsOrgRel.results, "iav");
    }
   } else {
    commResult.BP_AddressVersionsOrgRel.results = [];
   }
  if (commResult.BP_AddressVersionsPersRel !== undefined)
   if (commResult.BP_AddressVersionsPersRel.results !== undefined) {
    if (commResult.BP_AddressVersionsPersRel.results.length !== 0) {
     this.setEditCommModel(commResult.BP_AddressVersionsPersRel.results, "iav");
    }
   } else {
    commResult.BP_AddressVersionsPersRel.results = [];
   }
 },

 setCurrentModel: function(model) {
  this.oCurrentDataModel = model;
 },

 getCurrentModel: function() {
  return this.oCurrentDataModel;
 },

 //add the dynamic phone fields and bind it.
 addNewTel: function() {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var elements = [];
  var formElementIndex = "";
  var oForm = sap.ui.getCore().byId("SFAddressContactEdit--Form");
  var formContainer = oForm.getFormContainers()[0];
  formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").getParent());
  var getIdPart = fcg.mdg.editbp.handlers.Communication.vIdCounterTel + 1;
  fcg.mdg.editbp.handlers.Communication.vIdCounterTel = getIdPart;
  var telCountry = new sap.m.Input({
   id: "INP-BP_CommPhone-COUNTRY-" + getIdPart,
   value: "{/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_COUNTRY_KEY"),
   valueHelpRequest: fcg.mdg.editbp.handlers.Communication.onCommCountryVH,
   change: fcg.mdg.editbp.handlers.Communication.onCommCountryKeyChange,
   showValueHelp: true,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });
  var telNumber = new sap.m.Input({
   id: "INP-BP_CommPhone-TELEPHONE-" + getIdPart,
   value: "{path:'/TELEPHONE',formatter:'fcg.mdg.editbp.util.Formatter.formatCommNumber'}",
   maxLength: 30,
   type: "Number",
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_TN"),
   change: fcg.mdg.editbp.handlers.Communication.onTelChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   })
  });
  var telExt = new sap.m.Input({
   id: "INP-BP_CommPhone-EXTENSION-" + getIdPart,
   value: "{path:'/EXTENSION',formatter:'fcg.mdg.editbp.util.Formatter.formatCommNumber'}",
   maxLength: 10,
   type: "Number",
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_EXTENSION"),
   change: fcg.mdg.editbp.handlers.Communication.onTelChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });

  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  hBox.addStyleClass("sapUiSmallMargin");
  var telAdd = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.addNewTel,
   tooltip: "Add"
  });
  telAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(telAdd);
  var telRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.removeFormElementTel,
   tooltip: "Cancel"
  });
  hBox.addItem(telRemove);

  //controller hook 
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookAddNewTelAddress(this, oWController, hBox);

  elements.push(telCountry, telNumber, telExt, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.Communication.vNewTelField = newtelFormElement;
  if (sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue() !== "") {
   telCountry.setValue(sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue());
   // telCountry.fireEvent("change");
  }
 },

 //add the dynamic Fax fields and bind it.
 addNewFax: function() {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var elements = [];
  var formElementIndex = "";
  var oForm = sap.ui.getCore().byId("SFAddressContactEdit--Form");
  var formContainer = oForm.getFormContainers()[0];
  formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommEMail-E_MAIL-0").getParent());
  var getIdPart = fcg.mdg.editbp.handlers.Communication.vIdCounterFax + 1;
  fcg.mdg.editbp.handlers.Communication.vIdCounterFax = getIdPart;
  var faxCountry = new sap.m.Input({
   id: "INP-BP_CommFax-COUNTRY-" + getIdPart,
   value: "{/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_COUNTRY_KEY"),
   showValueHelp: true,
   valueHelpRequest: fcg.mdg.editbp.handlers.Communication.onCommCountryVH,
   change: fcg.mdg.editbp.handlers.Communication.onCommCountryKeyChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });
  var faxNumber = new sap.m.Input({
   id: "INP-BP_CommFax-TELEPHONE-" + getIdPart,
   value: "{path:'/FAX',formatter:'fcg.mdg.editbp.util.Formatter.formatCommNumber'}",
   maxLength: 30,
   type: "Number",
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_FAX_NO"),
   change: fcg.mdg.editbp.handlers.Communication.onFaxChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   })
  });
  var faxExt = new sap.m.Input({
   id: "INP-BP_CommFax-EXTENSION-" + getIdPart,
   value: "{path:'/EXTENSION',formatter:'fcg.mdg.editbp.util.Formatter.formatCommNumber'}",
   maxLength: 10,
   type: "Number",
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_EXTENSION"),
   change: fcg.mdg.editbp.handlers.Communication.onFaxChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });

  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  hBox.addStyleClass("sapUiSmallMargin");
  var faxAdd = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.addNewFax,
   tooltip: "Add"
  });
  faxAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(faxAdd);
  var faxRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.removeFormElementFax,
   tooltip: "Cancel"
  });
  hBox.addItem(faxRemove);
  //controller hook 
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookAddNewFaxAddress(this, oWController, hBox);

  elements.push(faxCountry, faxNumber, faxExt, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.Communication.vNewFaxField = newtelFormElement;

  if (sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue() !== "") {
   faxCountry.setValue(sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue());
   // faxCountry.fireEvent("change");
  }
 },

 //add the dynamic mobile fields and bind it.
 addNewMob: function() {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var elements = [];
  var formElementIndex = "";
  var oForm = sap.ui.getCore().byId("SFAddressContactEdit--Form");
  var formContainer = oForm.getFormContainers()[0];
  formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").getParent());
  var getIdPart = fcg.mdg.editbp.handlers.Communication.vIdCounterMob + 1;
  fcg.mdg.editbp.handlers.Communication.vIdCounterMob = getIdPart;
  var mobCountry = new sap.m.Input({
   id: "INP-BP_CommMobile-COUNTRY-" + getIdPart,
   value: "{/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_COUNTRY_KEY"),
   change: fcg.mdg.editbp.handlers.Communication.onCommCountryKeyChange,
   valueHelpRequest: fcg.mdg.editbp.handlers.Communication.onCommCountryVH,
   showValueHelp: true,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });

  var mobNumber = new sap.m.Input({
   id: "INP-BP_CommMobile-TELEPHONE-" + getIdPart,
   value: "{path:'/TELEPHONE',formatter:'fcg.mdg.editbp.util.Formatter.formatCommNumber'}",
   maxLength: 30,
   type: "Number",
   placeholder: wizardController.i18nBundle.getText("PLACEHOLDER_MOBNO"),
   change: fcg.mdg.editbp.handlers.Communication.onMobChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L3 M3 S3"
   })
  });
  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  hBox.addStyleClass("sapUiSmallMargin");
  var mobAdd = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.addNewMob,
   tooltip: "Add"
  });
  mobAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(mobAdd);
  var mobRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.removeFormElementMob,
   tooltip: "Cancel"
  });
  hBox.addItem(mobRemove);

  //controller hook 
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookAddNewMobAddress(this, oWController, hBox);

  elements.push(mobCountry, mobNumber, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.Communication.vNewMobField = newtelFormElement;
  if (sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue() !== "") {
   mobCountry.setValue(sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue());
   // mobCountry.fireEvent("change");
  }
 },

 //add the dynamic Email fields and bind it.
 addNewEmail: function() {
  var elements = [];
  var formElementIndex = "";
  var oForm = sap.ui.getCore().byId("SFAddressContactEdit--Form");
  var formContainer = oForm.getFormContainers()[0];
  formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommURI-URI-0").getParent());
  var getIdPart = fcg.mdg.editbp.handlers.Communication.vIdCounterEmail + 1;
  fcg.mdg.editbp.handlers.Communication.vIdCounterEmail = getIdPart;
  var email = new sap.m.Input({
   id: "INP-BP_CommEMail-E_MAIL-" + getIdPart,
   value: "{/E_MAIL}",
   type: "Email",
   maxLength: 241,
   change: fcg.mdg.editbp.handlers.Communication.onEmailChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L5 M5 S5",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });
  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  hBox.addStyleClass("sapUiSmallMargin");
  var emailAdd = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.addNewEmail,
   tooltip: "Add"
  });
  emailAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(emailAdd);
  var emailRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.removeFormElementEmail,
   tooltip: "Cancel"
  });
  hBox.addItem(emailRemove);

  //controller hook 
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookAddNewEmailAddress(this, oWController, hBox);

  elements.push(email, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.Communication.vNewEmailField = newtelFormElement;
 },

 //add the dynamic uri fields and bind it.
 addNewURI: function() {
  var elements = [];
  var formElementIndex = "";
  var oForm = sap.ui.getCore().byId("SFAddressContactEdit--Form");
  var formContainer = oForm.getFormContainers()[0];
  formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommURI-URI-0").getParent());
  formElementIndex = formElementIndex + 1;
  var getIdPart = fcg.mdg.editbp.handlers.Communication.vIdCounterURI + 1;
  fcg.mdg.editbp.handlers.Communication.vIdCounterURI = getIdPart;
  var uri = new sap.m.Input({
   id: "INP-BP_CommURI-URI-" + getIdPart,
   value: "{/URI}",
   type: "Url",
   maxLength: 132,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create,
   layoutData: new sap.ui.layout.GridData({
    span: "L5 M5 S5",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });
  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  hBox.addStyleClass("sapUiSmallMargin");
  var uriAdd = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.addNewURI,
   tooltip: "Add"
  });
  uriAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(uriAdd);
  var uriRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.removeFormElementUri,
   tooltip: "Cancel"
  });
  hBox.addItem(uriRemove);

  //controller hook 
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookAddNewURIAddress(this, oWController, hBox);

  elements.push(uri, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.Communication.vNewURIField = newtelFormElement;
 },

 //used when we press the add icon from IAV toolbar, in this case oEditIAVModel will be empty and will effect the address version and title in IAV
 addNewIAVGrp: function() {
  fcg.mdg.editbp.handlers.Communication.oEditIAVModel = "";
  fcg.mdg.editbp.handlers.Communication.addNewIAV();
 },

 addNewIAV: function() {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var sDefault_Text = wizardController.i18nBundle.getText("NONE");
  var IdEntityPart = "INP-BP_AddressVersionsOrg";
  var IdEntityPartDeep;
  var formIndex = wizardController.getView().byId("communicationLayout").getItems().length - 1;
  var formId = fcg.mdg.editbp.handlers.Communication.oIavFormId;

  if (wizardController.sCategory === "1") {
   IdEntityPart = "INP-BP_AddressVersionsPers";
   IdEntityPartDeep = "INP-BP_AddressPersonVersion";
  }
  fcg.mdg.editbp.handlers.Communication.oIavFormId = formId + 1;
  var oNewForm = new sap.ui.layout.form.SimpleForm({
   id: "SFAddressIAVOrgEdit-" + formId,
   maxContainerCols: 1,
   minWidth: 1024,
   layout: "ResponsiveGridLayout",
   labelSpanL: 3,
   labelSpanM: 3,
   emptySpanL: 4,
   emptySpanS: 4,
   emptySpanM: 4,
   labelSpanS: 3,
   editable: true,
   "class": "paddingFixSF"
  });
  fcg.mdg.editbp.handlers.Communication.addIavToolBar(oNewForm, wizardController); //creating iav toolbar dynamically parameter as form, formContainer & formElement
  var fieldAddrversionlbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("ADDRESSVERSION")
  });
  oNewForm.addContent(fieldAddrversionlbl);
  var fieldAddrversion = new sap.m.Select({
   id: IdEntityPart + "-ADDR_VERS-" + formId,
   change: fcg.mdg.editbp.handlers.Communication.onAddressChange,
  });
  //for value help of Address Version
  var sDefaultText = wizardController.i18nBundle.getText("NONE");
  var oTVModel = new sap.ui.model.json.JSONModel();
  if (fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results === undefined) {
   fcg.mdg.editbp.handlers.Communication.setIavArray(fcg.mdg.editbp.util.DataAccess.getValueHelpData()[6].data.results);
  }
  oTVModel.setData(fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion);
  var fieldAddrversionValuesTemp = new sap.ui.core.Item({
   key: "{KEY}",
   text: "{TEXT}"
  });
  fieldAddrversion.setModel(oTVModel);
  fieldAddrversion.bindItems("/results", fieldAddrversionValuesTemp);
  var emptyValue = new sap.ui.core.Item({
   key: "",
   text: sDefaultText
  });
  fieldAddrversion.addItem(emptyValue);

  //in case of change of address when there is IAV data present in model then oEditIAVModel will have value, else its empty.
  if (fcg.mdg.editbp.handlers.Communication.oEditIAVModel !== "") {
   fieldAddrversion.setSelectedKey(fcg.mdg.editbp.handlers.Communication.oEditIAVModel.getData().ADDR_VERS);
   fieldAddrversion.setEnabled(false);
   fcg.mdg.editbp.handlers.Communication.selectedAddVersion[formId] = fcg.mdg.editbp.handlers.Communication.oEditIAVModel.getData().ADDR_VERS;
  } else {
   fieldAddrversion.setSelectedKey("");
   fcg.mdg.editbp.handlers.Communication.selectedAddVersion[formId] = "";
  }
  oNewForm.addContent(fieldAddrversion);

  var fieldTitleName1lbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("TN1")
  });
  var fieldTitle;
  if (wizardController.sCategory === "1") {
   fieldTitle = new sap.m.Select({
   id: IdEntityPartDeep + "-TITLE_P-" + formId,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }else{
   fieldTitle = new sap.m.Select({
   id: IdEntityPart + "-TITLE-" + formId,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }

  fcg.mdg.editbp.handlers.Communication.setvHelpTitle(wizardController.sCategory, fieldTitleName1lbl, fieldTitle);
  if (fcg.mdg.editbp.handlers.Communication.oEditIAVModel !== "") {
   if (fcg.mdg.editbp.handlers.Communication.oEditIAVModel.getData().TITLE_KEY !== undefined)
    fieldTitle.setSelectedKey(fcg.mdg.editbp.handlers.Communication.oEditIAVModel.getData().TITLE_KEY);
   else
    if (wizardController.sCategory === "1") {
     // fieldTitle.setSelectedKey(fcg.mdg.editbp.handlers.Communication.oEditIAVModel.getData().TITLE_P);
     fieldTitle.setSelectedKey(fcg.mdg.editbp.handlers.Communication.oEditIAVModel.getData().BP_AddressPersonVersionRel.TITLE_P);
    }else{
     fieldTitle.setSelectedKey(fcg.mdg.editbp.handlers.Communication.oEditIAVModel.getData().TITLE);
    }

  } else {
   fieldTitle.setSelectedKey("");
  }
  oNewForm.addContent(fieldTitleName1lbl);
  oNewForm.addContent(fieldTitle);

  var fieldName1;
  if (wizardController.sCategory === "1") {
   fieldName1 = new sap.m.Input({
   id: IdEntityPartDeep + "-FIRSTNAME-" + formId,
   value: "{/BP_AddressPersonVersionRel/FIRSTNAME}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  } else{
   fieldName1 = new sap.m.Input({
   id: IdEntityPart + "-NAME-" + formId,
   value: "{/NAME}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }

  oNewForm.addContent(fieldName1);

  var fieldTitleName2lbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("Name2")
  });
  if (wizardController.sCategory === "1") {
   fieldTitleName2lbl.setText(wizardController.i18nBundle.getText("LN"));
  }
  oNewForm.addContent(fieldTitleName2lbl);
  var fieldName2;
  if (wizardController.sCategory === "1") {
   fieldName2 = new sap.m.Input({
   id: IdEntityPartDeep + "-LASTNAME-" + formId,
   value: "{/BP_AddressPersonVersionRel/LASTNAME}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  } else{
   fieldName2 = new sap.m.Input({
   id: IdEntityPart + "-NAME2-" + formId,
   value: "{/NAME_2}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }
  oNewForm.addContent(fieldName2);

  var fieldSearchTerm1lbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("ST1")
  });
  oNewForm.addContent(fieldSearchTerm1lbl);
  var fieldSearchTerm1;
  if (wizardController.sCategory === "1") {
   fieldSearchTerm1 = new sap.m.Input({
   id: IdEntityPartDeep + "-SORT1_P-" + formId,
   value: "{/BP_AddressPersonVersionRel/SORT1_P}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }else{
   fieldSearchTerm1 = new sap.m.Input({
   id: IdEntityPart + "-SORT1-" + formId,
   value: "{/SORT1}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }

  oNewForm.addContent(fieldSearchTerm1);

  var fieldSearchTerm2lbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("ST2")
  });
  oNewForm.addContent(fieldSearchTerm2lbl);
  var fieldSearchTerm2;
  if (wizardController.sCategory === "1") {
   fieldSearchTerm2 = new sap.m.Input({
   id: IdEntityPartDeep + "-SORT2_P-" + formId,
   value: "{/BP_AddressPersonVersionRel/SORT2_P}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }else{
   fieldSearchTerm2 = new sap.m.Input({
   id: IdEntityPart + "-SORT2-" + formId,
   value: "{/SORT2}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  }

  oNewForm.addContent(fieldSearchTerm2);

  var fieldStreetHnolbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("STHN")
  });
  oNewForm.addContent(fieldStreetHnolbl);

  var fieldStreet = new sap.m.Input({
   id: IdEntityPart + "-STREET-" + formId,
   value: "{/STREET}",
   maxLength: 60,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  oNewForm.addContent(fieldStreet);

  var fieldHNo = new sap.m.Input({
   id: IdEntityPart + "-HOUSE_NO-" + formId,
   value: "{/HOUSE_NO}",
   maxLength: 10,
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  oNewForm.addContent(fieldHNo);

  var fieldCitylbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("CITY")
  });
  oNewForm.addContent(fieldCitylbl);

  var fieldCity = new sap.m.Input({
   id: IdEntityPart + "-CITY-" + formId,
   value: "{/CITY}",
   maxLength: 30,
   type: "Email",
   change: fcg.mdg.editbp.handlers.Communication.onChange_Create
  });
  oNewForm.addContent(fieldCity);

  //controller hook
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  oWController.bpHookAddNewIAVAddress(this, oWController, oNewForm);

  wizardController.getView().byId("communicationLayout").insertItem(oNewForm, formIndex);
  fcg.mdg.editbp.handlers.Communication.oIavNewForm = oNewForm;

  if (fieldAddrversion.getSelectedKey() === "") {
   var iavFields = fcg.mdg.editbp.handlers.Communication.getIavFields(IdEntityPart, fieldAddrversion.getId().split("-")[3]);
   fcg.mdg.editbp.handlers.Communication.setEnableForFields(iavFields, false);
  }

  if (fcg.mdg.editbp.handlers.Communication.oEditIAVModel === "") {
   fcg.mdg.editbp.handlers.Communication.handleDisableIcon("toolCommIAVAdd", fcg.mdg.editbp.handlers.Communication.addNewIAVGrp);
  }
 },

 //used when we press phone cancel icon to delete the phone field
 removeFormElementTel: function(oEvent) {
  var formElement = oEvent.getSource().getParent().getParent();
  var iconId = oEvent.getSource().getId();
  var id = formElement.getFields()[1].getId().split("-")[1] + "Rel" + "-" + formElement.getFields()[1].getId().split("-")[3] + "-" + fcg.mdg
   .editbp.handlers.Communication.oController.vCurrentActionId;
  fcg.mdg.editbp.handlers.Communication.aRemoveFields.push(id);
  fcg.mdg.editbp.handlers.Communication.removeFormElement(formElement, iconId, fcg.mdg.editbp.handlers.Communication.oController.i18nBundle
   .getText("TEL"));
 },

 //used when we press mobile cancel icon to delete the mobile field
 removeFormElementMob: function(oEvent) {
  var formElement = oEvent.getSource().getParent().getParent();
  var iconId = oEvent.getSource().getId();
  var id = formElement.getFields()[1].getId().split("-")[1] + "Rel" + "-" + formElement.getFields()[1].getId().split("-")[3] + "-" + fcg.mdg
   .editbp.handlers.Communication.oController.vCurrentActionId;
  fcg.mdg.editbp.handlers.Communication.aRemoveFields.push(id);
  fcg.mdg.editbp.handlers.Communication.removeFormElement(formElement, iconId, fcg.mdg.editbp.handlers.Communication.oController.i18nBundle
   .getText("MOB"));
 },

 //used when we press fax cancel icon to delete the fax field
 removeFormElementFax: function(oEvent) {
  var formElement = oEvent.getSource().getParent().getParent();
  var iconId = oEvent.getSource().getId();
  var id = formElement.getFields()[1].getId().split("-")[1] + "Rel" + "-" + formElement.getFields()[1].getId().split("-")[3] + "-" + fcg.mdg
   .editbp.handlers.Communication.oController.vCurrentActionId;
  fcg.mdg.editbp.handlers.Communication.aRemoveFields.push(id);
  fcg.mdg.editbp.handlers.Communication.removeFormElement(formElement, iconId, fcg.mdg.editbp.handlers.Communication.oController.i18nBundle
   .getText("FAX"));
 },

 //used when we press email cancel icon to delete the email field
 removeFormElementEmail: function(oEvent) {
  var formElement = oEvent.getSource().getParent().getParent();
  var iconId = oEvent.getSource().getId();
  var id = formElement.getFields()[0].getId().split("-")[1] + "Rel" + "-" + formElement.getFields()[0].getId().split("-")[3] + "-" + fcg.mdg
   .editbp.handlers.Communication.oController.vCurrentActionId;
  fcg.mdg.editbp.handlers.Communication.aRemoveFields.push(id);
  fcg.mdg.editbp.handlers.Communication.removeFormElement(formElement, iconId, fcg.mdg.editbp.handlers.Communication.oController.i18nBundle
   .getText("EMAIL"));
 },

 //used when we press uri cancel icon to delete the uri field
 removeFormElementUri: function(oEvent) {
  var formElement = oEvent.getSource().getParent().getParent();
  var iconId = oEvent.getSource().getId();
  var id = formElement.getFields()[0].getId().split("-")[1] + "Rel" + "-" + formElement.getFields()[0].getId().split("-")[3] + "-" + fcg.mdg
   .editbp.handlers.Communication.oController.vCurrentActionId;
  fcg.mdg.editbp.handlers.Communication.aRemoveFields.push(id);
  fcg.mdg.editbp.handlers.Communication.removeFormElement(formElement, iconId, fcg.mdg.editbp.handlers.Communication.oController.i18nBundle
   .getText("WEB"));
 },

 //used to remove the communication data from the model. 
 removeFormElement: function(formElement, iconId, sEntity) {
  var oForm = sap.ui.getCore().byId("SFAddressContactEdit--Form");
  var formContainer = oForm.getFormContainers()[0];
  var field = "";
  var vFieldShiftFlag = "";
  var telFormElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").getParent());
  var mobFormElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").getParent());
  var faxFormElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").getParent());
  var emailFormElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommEMail-E_MAIL-0").getParent());
  var uriFormElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId("INP-BP_CommURI-URI-0").getParent());
  var i;

  if (vFieldShiftFlag) {
   var elementIndex = formContainer.getFormElements().indexOf(formElement);
   var nextElement = formContainer.getFormElements()[elementIndex + 1];
   formElement.setVisible(false);
   var oLabel = new sap.m.Label({
    text: sEntity
   });
   nextElement.setLabel(oLabel);
   var oLayout = nextElement.getFields()[0].getLayoutData();
   oLayout.setLinebreak(false);
   oLayout.setIndent("L0 M0 S0");
  }
  fcg.mdg.editbp.handlers.Communication.getCommFieldCount(telFormElementIndex, mobFormElementIndex, faxFormElementIndex,
   emailFormElementIndex, uriFormElementIndex, formContainer);

  var country = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
  if (country.getValueState() === "None" && country.getValue() !== "") {
   fcg.mdg.editbp.handlers.Communication.oController.oWizard.validateStep(fcg.mdg.editbp.handlers.Communication.oController.getView().byId(
    "communicationStep"));
  }
  var deletedEntry = {};
  var currentModel = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
  var numDeepEntities = 0;
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  switch (formElement.getFields()[1].getId().split("-")[1]) {
   case 'BP_CommPhone':
    //  deep entity which is already existing in the model
    if(oWController.vCurrentActionId === "changeRB"){
     numDeepEntities = this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numPhn;
    }
    if (formElement.getFields()[1].getId().split("-")[3] < numDeepEntities) {
     deletedEntry.action = "D";
     this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numPhn--;
    }
    break;
   case 'BP_CommMobile':
    if(oWController.vCurrentActionId === "changeRB"){
     numDeepEntities = numDeepEntities = this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numMob;
    }
    if (formElement.getFields()[1].getId().split("-")[3] < numDeepEntities) {
     deletedEntry.action = "D";
     this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numMob--;
    }
    break;
   case 'BP_CommFax':
    if(oWController.vCurrentActionId === "changeRB"){
     numDeepEntities = numDeepEntities = this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numFax;
    }
    if (formElement.getFields()[1].getId().split("-")[3] < numDeepEntities) {
     deletedEntry.action = "D";
     this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numFax--;
    }
    break;
   case 'BP_CommURI':
    if(oWController.vCurrentActionId === "changeRB"){
     numDeepEntities = numDeepEntities = this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numURI;
    }
    if (formElement.getFields()[1].getId().split("-")[3] < numDeepEntities) {
     deletedEntry.action = "D";
     this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numURI--;
    }
    break;
   case 'BP_CommEMail':
    if(oWController.vCurrentActionId === "changeRB"){
     numDeepEntities = numDeepEntities = this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numEmail;
    }
    if (formElement.getFields()[0].getId().split("-")[3] < numDeepEntities) {
     deletedEntry.action = "D";
     this.oCountDeepEntities[parseInt(this.selectedIndex,10)].numEmail--;
    }
    break;
   // case 'BP_AddressVersionsPers':
   //  numDeepEntities = fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" + this.selectedIndex +
   //   "/" + "BP_AddressVersionsPersRel/numIAV");
   //  if (formElement.getFields()[0].getId().split("-")[3] < numDeepEntities) {
   //   deletedEntry.action = "D";
   //  }
   //  break;
   // case 'BP_AddressVersionsOrg':
   //  numDeepEntities = fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" + this.selectedIndex +
   //   "/" + "BP_AddressVersionsOrgRel/numIAV");
   //  if (formElement.getFields()[0].getId().split("-")[3] < numDeepEntities) {
   //   deletedEntry.action = "D";
   //  }
   //  break;
   default:
  }

  if (deletedEntry.action !== "D") {
   for (i = 0; i < oWController.changedArray.length; i++) {
    if (oWController.changedArray[i].action === "N" &&
     oWController.changedArray[i].entity === formElement.getFields()[1].getId().split("-")[1] &&
     oWController.changedArray[i].createdIndex === formElement.getFields()[1].getId().split("-")[3]) {
     oWController.changedArray.splice(i, 1);
    }
   }
  } else {
   deletedEntry.entity = formElement.getFields()[1].getId().split("-")[1];
   deletedEntry.createdIndex = formElement.getFields()[1].getId().split("-")[3];
   deletedEntry.entityKey = "(BP_GUID=" + oWController.sItemPath +
    ",AD_ID=\'" + currentModel.BP_AddressesRel.results[parseInt(this.selectedIndex, 10)].AD_ID +
    "\',COMM_TYPE=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" +
     this.selectedIndex + "/" + deletedEntry.entity + "Rel/results/" + formElement.getFields()[1].getId().split("-")[3] +
     "/COMM_TYPE") + "\',CONSNUMBER=\'" +
    fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" + this.selectedIndex +
     "/" + deletedEntry.entity + "Rel/results/" + formElement.getFields()[1].getId().split("-")[3] + "/CONSNUMBER") + "\')";
   oWController.changedArray.push(deletedEntry);
  }

  if (iconId === "telCancel" || iconId === "faxCancel" || iconId === "mobCancel" || iconId === "emailCancel" || iconId === "uriCancel") {
   for (i = 0; i < (formElement.getFields().length - 1); i++) {
    field = formElement.getFields()[i];
    if (field.getValue() !== "") {
     field.setValue("");
    }
   }
   vFieldShiftFlag = fcg.mdg.editbp.handlers.Communication.getCommFieldCount(telFormElementIndex, mobFormElementIndex,
    faxFormElementIndex,
    emailFormElementIndex, uriFormElementIndex, formContainer, sEntity);
  } else {
   formElement.destroyFields();
   formContainer.removeFormElement(formElement.getId());
  }

 },

 //used for enabling/disabling of cancel icon of communication field like phone/fax.. and finding the index for creation of new communication fields.
 getCommFieldCount: function(telFormElementIndex, mobFormElementIndex, faxFormElementIndex, emailFormElementIndex, uriFormElementIndex,
  formContainer, sEntity) {
  if ((telFormElementIndex + 1) === mobFormElementIndex) {
   fcg.mdg.editbp.handlers.Communication.vNewTelField = "";
   if (sEntity === fcg.mdg.editbp.handlers.Communication.oController.i18nBundle.getText("TEL"))
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
  } else {
   fcg.mdg.editbp.handlers.Communication.handleEnableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
   return true;
  }
  if ((mobFormElementIndex + 1) === faxFormElementIndex) {
   fcg.mdg.editbp.handlers.Communication.vNewMobField = "";
   if (sEntity === fcg.mdg.editbp.handlers.Communication.oController.i18nBundle.getText("MOB"))
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
  } else {
   fcg.mdg.editbp.handlers.Communication.handleEnableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
   return true;
  }
  if ((faxFormElementIndex + 1) === emailFormElementIndex) {
   fcg.mdg.editbp.handlers.Communication.vNewFaxField = "";
   if (sEntity === fcg.mdg.editbp.handlers.Communication.oController.i18nBundle.getText("FAX"))
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
  } else {
   fcg.mdg.editbp.handlers.Communication.handleEnableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
   return true;
  }
  if ((emailFormElementIndex + 1) === uriFormElementIndex) {
   fcg.mdg.editbp.handlers.Communication.vNewEmailField = "";
   if (sEntity === fcg.mdg.editbp.handlers.Communication.oController.i18nBundle.getText("EMAIL"))
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
  } else {
   fcg.mdg.editbp.handlers.Communication.handleEnableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
   return true;
  }
  if ((uriFormElementIndex + 1) === formContainer.getFormElements().length) {
   fcg.mdg.editbp.handlers.Communication.vNewURIField = "";
   if (sEntity === fcg.mdg.editbp.handlers.Communication.oController.i18nBundle.getText("WEB"))
    fcg.mdg.editbp.handlers.Communication.handleDisableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
  } else {
   fcg.mdg.editbp.handlers.Communication.handleEnableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
   return true;
  }
 },

 //to disable the icon
 handleDisableIcon: function(id, sMethod) {
  if (id === "toolCommIAVAdd") {
   sap.ui.getCore().byId("toolCommIAVAdd").setVisible(false);
   sap.ui.getCore().byId("toolCommIAVAddDisable").addStyleClass("sapGreyCell");
   sap.ui.getCore().byId("toolCommIAVAddDisable").setVisible(true);
  }

  if (sap.ui.getCore().byId(id).hasListeners("press") === true) {
   sap.ui.getCore().byId(id).detachPress(sMethod);
  }
  sap.ui.getCore().byId(id).addStyleClass("sapGreyCell");
 },

 //to enabling of the icon
 handleEnableIcon: function(id, sMethod) {
  if (id === "toolCommIAVAdd") {
   sap.ui.getCore().byId("toolCommIAVAddDisable").setVisible(false);
   sap.ui.getCore().byId("toolCommIAVAdd").setVisible(true);
  }

  if (sap.ui.getCore().byId(id).hasListeners("press") === false) {
   sap.ui.getCore().byId(id).attachPress(sMethod);
  }
  sap.ui.getCore().byId(id).removeStyleClass("sapGreyCell");
 },

 // used for removing the IAV form from the fragment in edit data page and for handling of the Address version list 
 removeIavForm: function(oEvent) {
  var iavEntity = "";
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  var numDeepEntities;
  var currentModel = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
  if (oWController.sCategory === "1") {
   iavEntity = "BP_AddressVersionsPers";
  } else if (oWController.sCategory === "2") {
   iavEntity = "BP_AddressVersionsOrg";
  }
  if(oWController.vCurrentActionId === "changeRB"){
  // this.selectedIndex = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  this.selectedIndex = fcg.mdg.editbp.handlers.Communication.selectedIndex ;
   numDeepEntities = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex,10)].numIAV;
  }else{
   numDeepEntities = 0;
  }
  var oFormId = oEvent.getSource().getParent().getParent().getParent().getParent().getId().split("--")[0];
  var layout = fcg.mdg.editbp.handlers.Communication.oController.getView().byId("communicationLayout");
  var iconId = oEvent.getSource().getId();
  var country = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
  if (iconId === "toolCommIAVCancel") {
   return;
  } else {
   for (var i = 2; i < (layout.getItems().length - 1); i++) {
    if (layout.getItems()[i].getId() === oFormId) {
     var key = layout.getItems()[i].getContent()[3].getSelectedKey();
     if (key !== "") {
      for (var j = 0; j < fcg.mdg.editbp.util.DataAccess.getValueHelpData()[6].data.results.length; j++) {
       if (fcg.mdg.editbp.util.DataAccess.getValueHelpData()[6].data.results[j].KEY === key) {
        var oAddressVers = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[6].data.results[j];
        fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results.splice(j, 0, oAddressVers);

        var addressVersKey = fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results;
        addressVersKey.sort(function(a, b) {
         return (a.TEXT > b.TEXT) ? 1 : ((b.TEXT > a.TEXT) ? -1 : 0);
        });
        break;
       }
      }
     } else {
      fcg.mdg.editbp.handlers.Communication.handleEnableIcon("toolCommIAVAdd", fcg.mdg.editbp.handlers.Communication.addNewIAVGrp);
     }

     var id = layout.getItems()[i].getContent()[3].getId().split("-")[1] + "Rel" + "-" + layout.getItems()[i].getContent()[3].getId().split(
      "-")[
      3] + "-" + fcg.mdg.editbp.handlers.Communication.oController.vCurrentActionId;
     fcg.mdg.editbp.handlers.Communication.aRemoveFields.push(id);

     //adding query for the deleted IAV
     var deletedEntry = {};
     if (oFormId.split("-")[1] < numDeepEntities) {
      deletedEntry.action = "D";
      fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex,10)].numIAV--;
     }
     if (deletedEntry.action !== "D") {
      // if(oWController.vCurrentActionId === "changeRB"){
      for (i = 0; i < oWController.changedArray.length;) {
       if (oWController.changedArray[i].action === "N" &&
        oWController.changedArray[i].entity === iavEntity &&
        oWController.changedArray[i].createdIndex === oFormId.split("-")[1]) {
        oWController.changedArray.splice(i, 1);
       }
       else{
        i++;
       }
      }
      }


      else {
      deletedEntry.entity = iavEntity;
      deletedEntry.createdIndex = oFormId.split("-")[1];
      deletedEntry.entityKey = "(BP_GUID=" + oWController.sItemPath +
       ",AD_ID=\'" + currentModel.BP_AddressesRel.results[parseInt(this.selectedIndex, 10)].AD_ID +
       "',ADDR_VERS=\'" +
       fcg.mdg.editbp.util.DataAccess.getDataFromPath(currentModel, "BP_AddressesRel/results/" + this.selectedIndex +
        "/" + iavEntity + "Rel/results/" + oFormId.split("-")[1] + "/ADDR_VERS") + "\')";
      oWController.changedArray.push(deletedEntry);
     }

     // layout.removeItem(layout.getItems()[i]);
     sap.ui.getCore().byId(oFormId).destroy();
     break;
    }

   }
  }

  if (country.getValueState() === "None" && country.getValue() !== "") {
   fcg.mdg.editbp.handlers.Communication.oController.oWizard.validateStep(fcg.mdg.editbp.handlers.Communication.oController.getView().byId(
    "communicationStep"));
  }
 },

 //used for adding the IAVtoolbar in the IAVForm in edit page
 addIavToolBar: function(oForm, wizardController) {
  var title = new sap.m.Title({
   text: wizardController.i18nBundle.getText("ADDIAV"),
   level: "H4",
   titleStyle: "H4",
   layoutData: new sap.ui.layout.GridData({
    span: "L4 M4 S6"
   })
  });
  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  var iavAdd = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   tooltip: "Add"
  });
  iavAdd.addStyleClass("sapGreyCell");
  iavAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(iavAdd);
  var iavRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.Communication.removeIavForm,
   tooltip: "Cancel"
  });
  hBox.addItem(iavRemove);
  oForm.addContent(title);
  oForm.addContent(hBox);
 },

 //to create the Communication fields in the review page
 displayCommunication: function(wizardController, oModel, vtxt, vlbl, vText,vLblVisibilityFlag) {
  var vNewCommField = "";
  var formElementIndex = 0;
  var displayCommForm = fcg.mdg.editbp.handlers.Communication.getCurrentDispCommForm(wizardController);
  for (var i = 0; i < oModel.length; i++) {
   var jsonModel = new sap.ui.model.json.JSONModel();
   jsonModel.setData(oModel[i]);
   if (vNewCommField === "" || vNewCommField === undefined) {
    var titleIndex = displayCommForm.getContent().length - 1;
    vNewCommField = displayCommForm.getContent()[titleIndex];
   }
   formElementIndex = displayCommForm.getContent().indexOf(vNewCommField);
   if (i === 0) {
    var oLabel = new sap.m.Label({
     text: vlbl,
     visible : vLblVisibilityFlag
    });
    displayCommForm.insertContent(oLabel, formElementIndex);
    oLabel.setModel(jsonModel);
    vNewCommField = oLabel;
    formElementIndex = displayCommForm.getContent().indexOf(vNewCommField);
    formElementIndex = formElementIndex + 1;
    var field0 = new sap.m.Text({
     text: vtxt,
     visible: vText
    });
    displayCommForm.insertContent(field0, formElementIndex);
    field0.setModel(jsonModel);
    vNewCommField = field0;
   } else {
    formElementIndex = formElementIndex + 1;
    var field = new sap.m.Text({
     text: vtxt,
     layoutData: new sap.ui.layout.GridData({
      span: "L12 M12 S12",
      linebreakL: true,
      linebreakM: true,
      linebreakS: true
     })
    });
    displayCommForm.insertContent(field, formElementIndex);
    field.setModel(jsonModel);
    vNewCommField = field;
   }

   //extension hook
   formElementIndex = displayCommForm.getContent().indexOf(vNewCommField);
   wizardController.bpHookDisplayCommunicationAddress(wizardController, oModel, vtxt, vlbl, vText, this, formElementIndex, displayCommForm,i);

  }
 },

 hideIAVOrg: function() {
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-ADDR_VERS").setVisible(false);
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-TITLE").setVisible(false);
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-NAME2").setVisible(false);
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-SORT1").setVisible(false);
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-SORT2").setVisible(false);
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-STREET").setVisible(false);
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-HOUSE_NO").setVisible(false);
  sap.ui.getCore().byId("TXT-BP_AddressVersion_Organization-CITY").setVisible(false);

 },

 //display the IAV Fields in the review page
 displayIAV: function(oModelData, wizardController) {
  var vNewIavField = "";
  var formElementIndex = 0;
  // var model = new sap.ui.model.json.JSONModel();
  var getCurrentForm = fcg.mdg.editbp.handlers.Communication.getCurrentDispCommForm(wizardController);
  for (var i = 0; i < oModelData.length; i++) {
   var model = new sap.ui.model.json.JSONModel();
   // if (wizardController.sCategory === "1") {
   model.setData(oModelData[i]);
   // } else{
   // model.setData(oModelData[i]);
   // }
   if (vNewIavField === "" || vNewIavField === undefined) {
    var titleIndex = getCurrentForm.getContent().length - 1;
    vNewIavField = getCurrentForm.getContent()[titleIndex];
   } else {
    formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   }
   formElementIndex = formElementIndex + 1;
   if (i !== 0) {
    var lblEmpty = new sap.m.Label({
     text: ""
    });
    getCurrentForm.insertContent(lblEmpty, formElementIndex);
    vNewIavField = lblEmpty;

    formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
    formElementIndex = formElementIndex + 1;
    var lblTitle = new sap.m.Title({
     text: wizardController.i18nBundle.getText("IAV")
    });
    getCurrentForm.insertContent(lblTitle, formElementIndex);
    vNewIavField = lblTitle;
   }

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblAddrVers = new sap.m.Label({
    text: wizardController.i18nBundle.getText("ADDRESSVERSION")
   });
   getCurrentForm.insertContent(lblAddrVers, formElementIndex);
   vNewIavField = lblAddrVers;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldAddrVers = new sap.m.Text({
    text: "{parts:[{path:'iav>/ADDR_VERS__TXT'},{path:'iav>/ChangeData/ADDR_VERS__TXT'}],formatter:'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/ADDR_VERS__TXT',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   getCurrentForm.insertContent(fieldAddrVers, formElementIndex);
   fieldAddrVers.setModel(model, "iav");
   vNewIavField = fieldAddrVers;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblTitle1 = new sap.m.Label({
    text: wizardController.i18nBundle.getText("TITLE")
   });
   getCurrentForm.insertContent(lblTitle1, formElementIndex);
   vNewIavField = lblTitle1;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldTitle;
   if (wizardController.sCategory === "1") {
    fieldTitle = new sap.m.Text({
    text: "{parts:[{path:'iav>/BP_AddressPersonVersionRel/TITLE_P__TXT'}, {path:'iav>/BP_AddressPersonVersionRel/ChangeData/TITLE_P__TXT'}],formatter:'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/BP_AddressPersonVersionRel/TITLE_P__TXT',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   } else{
    fieldTitle = new sap.m.Text({
    text: "{parts:[{path:'iav>/TITLE__TXT'}, {path:'iav>/ChangeData/TITLE__TXT'}],formatter:'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/TITLE__TXT',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   }

   getCurrentForm.insertContent(fieldTitle, formElementIndex);
   fieldTitle.setModel(model, "iav");
   vNewIavField = fieldTitle;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblName1 = new sap.m.Label({
    text: wizardController.i18nBundle.getText("Name1")
   });

   if (wizardController.sCategory === "1") {
    lblName1.setText(wizardController.i18nBundle.getText("F_Name"));
   }
   getCurrentForm.insertContent(lblName1, formElementIndex);
   vNewIavField = lblName1;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldName1;
   if (wizardController.sCategory === "1") {
    fieldName1 = new sap.m.Text({
     text: "{parts:[{path:'iav>/BP_AddressPersonVersionRel/FIRSTNAME'},{path:'iav>/BP_AddressPersonVersionRel/ChangeData/FIRSTNAME'}],formatter:'fcg.mdg.editbp.util.Formatter.getBoldText'}",
     visible: "{path:'iav>/BP_AddressPersonVersionRel/FIRSTNAME',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
    });
   }else{
    fieldName1 = new sap.m.Text({
     text: "{parts:[{path:'iav>/NAME'},{path:'iav>/ChangeData/NAME'}],formatter:'fcg.mdg.editbp.util.Formatter.getBoldText'}",
     visible: "{path:'iav>/NAME',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
    });
   }

   getCurrentForm.insertContent(fieldName1, formElementIndex);
   fieldName1.setModel(model, "iav");
   vNewIavField = fieldName1;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblName2 = new sap.m.Label({
    text: wizardController.i18nBundle.getText("Name2")
   });
   if (wizardController.sCategory === "1") {
    lblName2.setText(wizardController.i18nBundle.getText("L_Name"));
   }
   getCurrentForm.insertContent(lblName2, formElementIndex);
   vNewIavField = lblName2;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldName2;
   if (wizardController.sCategory === "1") {
    fieldName2 = new sap.m.Text({
     text: "{parts: [{path: 'iav>/BP_AddressPersonVersionRel/LASTNAME'}, {path:'iav>/BP_AddressPersonVersionRel/ChangeData/LASTNAME'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
     visible: "{path:'iav>/BP_AddressPersonVersionRel/LASTNAME',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
    });

   }else{
    fieldName2 = new sap.m.Text({
    text: "{parts: [{path: 'iav>/NAME_2'}, {path:'iav>/ChangeData/NAME_2'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/NAME_2',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   }

   getCurrentForm.insertContent(fieldName2, formElementIndex);
   fieldName2.setModel(model, "iav");
   vNewIavField = fieldName2;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblSearchTerm1 = new sap.m.Label({
    text: wizardController.i18nBundle.getText("ST1")
   });
   getCurrentForm.insertContent(lblSearchTerm1, formElementIndex);
   vNewIavField = lblSearchTerm1;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldSearchTerm1;
   if (wizardController.sCategory === "1") {
    fieldSearchTerm1 = new sap.m.Text({
    text: "{parts: [{path: 'iav>/BP_AddressPersonVersionRel/SORT1_P'}, {path:'iav>/BP_AddressPersonVersionRel/ChangeData/SORT1_P'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/BP_AddressPersonVersionRel/SORT1_P',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   }else{
    fieldSearchTerm1 = new sap.m.Text({
    text: "{parts: [{path: 'iav>/SORT1'}, {path:'iav>/ChangeData/SORT1'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/SORT1',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   }

   getCurrentForm.insertContent(fieldSearchTerm1, formElementIndex);
   fieldSearchTerm1.setModel(model, "iav");
   vNewIavField = fieldSearchTerm1;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblSearchTerm2 = new sap.m.Label({
    text: wizardController.i18nBundle.getText("ST2")
   });
   getCurrentForm.insertContent(lblSearchTerm2, formElementIndex);
   vNewIavField = lblSearchTerm2;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldSearchTerm2;
   if (wizardController.sCategory === "1") {
    fieldSearchTerm2 = new sap.m.Text({
    text: "{parts: [{path: 'iav>/BP_AddressPersonVersionRel/SORT2_P'}, {path:'iav>/BP_AddressPersonVersionRel/ChangeData/SORT2_P'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/BP_AddressPersonVersionRel/SORT2_P',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   }else{
    fieldSearchTerm2 = new sap.m.Text({
    text: "{parts: [{path: 'iav>/SORT2'}, {path:'iav>/ChangeData/SORT2'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/SORT2',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   }

   getCurrentForm.insertContent(fieldSearchTerm2, formElementIndex);
   fieldSearchTerm2.setModel(model, "iav");
   vNewIavField = fieldSearchTerm2;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblIAVStreet = new sap.m.Label({
    text: wizardController.i18nBundle.getText("Street")
   });
   getCurrentForm.insertContent(lblIAVStreet, formElementIndex);
   vNewIavField = lblIAVStreet;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldIAVStreet = new sap.m.Text({
    text: "{parts: [{path: 'iav>/STREET'}, {path:'iav>/ChangeData/STREET'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/STREET',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   getCurrentForm.insertContent(fieldIAVStreet, formElementIndex);
   fieldIAVStreet.setModel(model, "iav");
   vNewIavField = fieldIAVStreet;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblIAVHouse = new sap.m.Label({
    text: wizardController.i18nBundle.getText("House Number")
   });
   getCurrentForm.insertContent(lblIAVHouse, formElementIndex);
   vNewIavField = lblIAVHouse;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldIAVHouse = new sap.m.Text({
    text: "{parts: [{path: 'iav>/HOUSE_NO'}, {path:'iav>/ChangeData/HOUSE_NO'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/HOUSE_NO',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   getCurrentForm.insertContent(fieldIAVHouse, formElementIndex);
   fieldIAVHouse.setModel(model, "iav");
   vNewIavField = fieldIAVHouse;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var lblIAVCity = new sap.m.Label({
    text: wizardController.i18nBundle.getText("CITY")
   });
   getCurrentForm.insertContent(lblIAVCity, formElementIndex);
   vNewIavField = lblIAVCity;

   formElementIndex = getCurrentForm.getContent().indexOf(vNewIavField);
   formElementIndex = formElementIndex + 1;
   var fieldIAVCity = new sap.m.Text({
    text: "{parts: [{path: 'iav>/CITY'}, {path:'iav>/ChangeData/CITY'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}",
    visible: "{path:'iav>/CITY',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}"
   });
   getCurrentForm.insertContent(fieldIAVCity, formElementIndex);
   fieldIAVCity.setModel(model, "iav");
   vNewIavField = fieldIAVCity;

   //controller hook
   var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
   oWController.bpHookDisplayIAV(this, oWController, oModelData);

  }

 },

 //used for getting the Title list used in IAV based on category
 setvHelpTitle: function(sCategory, vlblField, oField) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oResults = fcg.mdg.editbp.util.DataAccess.getValueHelpData();
  var sDefault_Text = wizardController.i18nBundle.getText("NONE");
  var oTVModel, titleValuesTemp, i, emptyTitle;
  if (sCategory === "1") {
   vlblField.setText(wizardController.i18nBundle.getText("N1"));
   for (i = 3; i < oResults.length; i++) {
    switch (i) {
     case 3:
      oTVModel = new sap.ui.model.json.JSONModel();
      oTVModel.setData(oResults[i].data);
      titleValuesTemp = new sap.ui.core.Item({
       key: "{KEY}",
       text: "{TEXT}"
      });
      oField.setModel(oTVModel);
      oField.bindItems("/results", titleValuesTemp);
      emptyTitle = new sap.ui.core.Item({
       key: "",
       text: sDefault_Text
      });
      oField.addItem(emptyTitle);
      break;
    }
   }

  } else {
   for (i = 4; i < oResults.length; i++) {
    switch (i) {
     case 4:
      oTVModel = new sap.ui.model.json.JSONModel();
      oTVModel.setData(oResults[i].data);
      titleValuesTemp = new sap.ui.core.Item({
       key: "{KEY}",
       text: "{TEXT}"
      });
      oField.setModel(oTVModel);
      oField.bindItems("/results", titleValuesTemp);
      emptyTitle = new sap.ui.core.Item({
       key: "",
       text: sDefault_Text
      });
      oField.addItem(emptyTitle);
      oField.setSelectedKey("");
      break;
    };
   }
  }
 },

 // used to get the current layout where respection communication form is present in review page
 getCurrentDispCommForm: function(wizardController) {
  if (wizardController.reEdit !== "X") {
   var commmLayoutContent = this.CurrLayout.getContent();
   var getCurrentForm = commmLayoutContent[commmLayoutContent.length - 1];
   return getCurrentForm;
  } else {
   return this.CurrLayout.getContent()[this.vReEditIndex];
  }
 },

 //setting the current layout of review page to variable to be used in method getCurrentDispCommForm
 setCommlayout: function(oLayout) {
  this.CurrLayout = oLayout;
 },

 // used to removint the communication/ IAV title when no communication/IAV data is present also setting the title for address Layout
 setDispAddressTitle: function(wizardController, sTxt) {
  var displayCommForm = fcg.mdg.editbp.handlers.Communication.getCurrentDispCommForm(wizardController);
  if (sTxt === wizardController.i18nBundle.getText("IAV")) {
   displayCommForm.getContent()[displayCommForm.getContent().length - 1].destroy();
  }
  if (sTxt === wizardController.i18nBundle.getText("Communication")) {
   for (var i = 0; i < displayCommForm.getContent().length; i++) {
    if (displayCommForm.getContent()[i].getText() === "Communication") {
     displayCommForm.getContent()[i].destroy();
    }
   }
  } else if (sTxt === "address") {
   var fieldTitle = displayCommForm.getToolbar().getContent()[0];
   var action = displayCommForm.getToolbar().getContent()[1];
   var street = "";
   var hno = "";
   if (wizardController.changedData.STREET !== undefined) {
    street = wizardController.changedData.STREET;
   }
   if (wizardController.changedData.HOUSE_NO !== undefined) {
    hno = wizardController.changedData.HOUSE_NO;
   }

   if (wizardController.vCurrentActionId === "createRB") {
    action.setText(" (" + wizardController.i18nBundle.getText("NEW") + ")").addStyleClass("text_bold");
    fieldTitle.setText(wizardController.i18nBundle.getText("Addr_Comm") + " : " + street + " " + hno);
   } else if (wizardController.vCurrentActionId === "changeRB") {
    action.setText(" (" + wizardController.i18nBundle.getText("CHANGE") + ")").addStyleClass("text_bold");
    fieldTitle.setText(wizardController.i18nBundle.getText("Addr_Comm") + " : " + street + " " + hno);
   } else if (wizardController.vCurrentActionId === "deleteRB") {
    action.setText(" (" + wizardController.i18nBundle.getText("DELETED") + ")").addStyleClass("text_bold");
    fieldTitle.setText(wizardController.i18nBundle.getText("Addr_Comm") + " : " + street + " " + hno);
   }

  }

  //controller hook
  wizardController.bpHooksetDispAddressTitle(this, wizardController, displayCommForm);
 },

 //create the field for IAV and communication based on the data in the model
 setEditCommModel: function(oModelData, sText) {
  var i, k;
  if (sText === "iav") {
   for (i = 0; i < oModelData.length; i++) {
    this.oEditIAVModel = new sap.ui.model.json.JSONModel();
     if(this.oController.sCategory === "1"){
     this.oEditIAVModel.setData(oModelData[i]);
     }else{
      this.oEditIAVModel.setData(oModelData[i]);
     }
    this.addNewIAV();

    this.oIavNewForm.setModel(this.oEditIAVModel);
    for (k = 0; k < fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results.length; k++) {
     if (fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results[k].KEY === fcg.mdg.editbp.handlers.Communication.selectedAddVersion[
       i]) {
      fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results.splice(k, 1);
      k = k - 1;
     }
    }
   }
  } else {
   for (i = 1; i < oModelData.length; i++) {
    var oEditCommModel = new sap.ui.model.json.JSONModel();
    oEditCommModel.setData(oModelData[i]);
    if (sText === "tel") {
     this.addNewTel();
     this.vNewTelField.setModel(oEditCommModel);
    } else if (sText === "mob") {
     this.addNewMob();
     this.vNewMobField.setModel(oEditCommModel);
    } else if (sText === "fax") {
     this.addNewFax();
     this.vNewFaxField.setModel(oEditCommModel);
    } else if (sText === "email") {
     this.addNewEmail();
     this.vNewEmailField.setModel(oEditCommModel);
    } else if (sText === "uri") {
     this.addNewURI();
     this.vNewURIField.setModel(oEditCommModel);
    }
   }
  }
 },

 onTelChange: function(oEvent) {
  var idPart = oEvent.getSource().getId().split("-")[3];
  var telCountryId = "INP-BP_CommPhone-COUNTRY-" + idPart;
  sap.ui.getCore().byId(telCountryId).fireEvent("change");
  fcg.mdg.editbp.handlers.Communication.onChange_Create(oEvent);
 },

 onMobChange: function(oEvent) {
  var idPart = oEvent.getSource().getId().split("-")[3];
  var mobCountryId = "INP-BP_CommMobile-COUNTRY-" + idPart;
  sap.ui.getCore().byId(mobCountryId).fireEvent("change");
  fcg.mdg.editbp.handlers.Communication.onChange_Create(oEvent);
 },

 onFaxChange: function(oEvent) {
  var idPart = oEvent.getSource().getId().split("-")[3];
  var faxCountryId = "INP-BP_CommFax-COUNTRY-" + idPart;
  sap.ui.getCore().byId(faxCountryId).fireEvent("change");
  fcg.mdg.editbp.handlers.Communication.onChange_Create(oEvent);
 },

 onCountryVH: function(oControlEvent) {
  var oGlobalInstance = this;
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
  var country = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
  // If this method is called while clicking on Address COUNTRY KEY
  var countryName = sap.ui.getCore().byId("INP-BP_Address-COUNTRY__TXT");
  var region = sap.ui.getCore().byId("INP-BP_Address-REGION");
  var regionName = sap.ui.getCore().byId("INP-BP_Address-REGION__TXT");
  var telCountry = sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0");
  var mobCountry = sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0");
  var faxCountry = sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0");

  if (sap.ui.getCore().byId("CountryDialog") !== undefined) {
   sap.ui.getCore().byId("CountryDialog").destroy();
   this.oCountryValueHelp = "";
  }

  var oCountryDialog = new sap.m.SelectDialog({
   id: "CountryDialog",
   title: wizardController.i18nBundle.getText("COUNTRIES"), // "Countries",
   noDataText: wizardController.i18nBundle.getText("LOAD") + "...", // "Loading...",
   items: {
    path: "/CountryValues",
    template: new sap.m.StandardListItem({
     title: "{TEXT}",
     description: "{KEY}"
    })
   },
   confirm: function(oEvent) {
    // Set Country Value
    country.setValueState("None");
    country.setValueStateText("");
    country.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    countryName.setValue(oEvent.getParameters().selectedItem.getProperty("title"));
    oGlobalInstance.vCountry = country.getValue();
    if (fcg.mdg.editbp.handlers.Communication.vOldCountry !== country.getValue() && oControlEvent.getSource().getId() === country.getId()) {
     fcg.mdg.editbp.handlers.Communication.reloadFragment();
     fcg.mdg.editbp.handlers.Communication.validatePostalCode();
     fcg.mdg.editbp.handlers.Communication.validateRegion();
    }
    fcg.mdg.editbp.handlers.Communication.vOldCountry = country.getValue();
    if (countryName !== undefined) {
     // Set country Name on selecting a value from F4 list
     countryName.setValue(oEvent.getParameters().selectedItem.getProperty("title"));
     // As selecting a value does not trigger 'Change' event, handle resetting and defaulting status that are supposed to be done in this event
     if (region !== undefined) {
      region.setValueState("None");
      region.setValueStateText("");
      // On every country value change, it should reset the Communication country values
      telCountry.setValue(country.getValue());
      mobCountry.setValue(country.getValue());
      faxCountry.setValue(country.getValue());
     }
     country.fireEvent("change");
    }
   },
   search: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
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
   liveChange: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
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
   oCountryDialog.setNoDataText(wizardController.i18nBundle.getText("NO_DATA"));
  }
  oCountryDialog.open();
 },

 onCountryKeyChange: function(oControlEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
  var oCountry = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
  oCountry.setValue(oCountry.getValue().toUpperCase());
  var country = oCountry.getValue();
  var oCountryName = sap.ui.getCore().byId("INP-BP_Address-COUNTRY__TXT");
  var oRegion = sap.ui.getCore().byId("INP-BP_Address-REGION");
  var oRegionName = sap.ui.getCore().byId("INP-BP_Address-REGION__TXT");
  var vLastCountryName = fcg.mdg.editbp.handlers.Communication.vOldCountry;
  var countryNoSpaces = country.replace(/^[ ]+|[ ]+$/g, "");
  this.vCountry = countryNoSpaces;
  if (countryNoSpaces !== "") {
   // -------------- Existence Check -------------------------------
   var countryExists = false;
   for (var i = 0; i < oCountryResult.results.length; i++) {
    if (oCountryResult.results[i].KEY === countryNoSpaces) {
     if (oCountry.getValue() !== "") {
      oCountryName.setValue(oCountryResult.results[i].TEXT);
      oCountry.setValueState("None");
      fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
      oCountryName.fireEvent("change");
     }
     // On every country value change, it should reset the Communication country values
     if (sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").getValue() === vLastCountryName) {
      sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").setValue(oCountry.getValue());
     }
     if (sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").getValue() === vLastCountryName) {
      sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").setValue(oCountry.getValue());
     }
     if (sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").getValue() === vLastCountryName) {
      sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").setValue(oCountry.getValue());
     }
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);

     fcg.mdg.editbp.handlers.Communication.reloadFragment();
     fcg.mdg.editbp.handlers.Communication.validateRegion();
     fcg.mdg.editbp.handlers.Communication.validatePostalCode();
     countryExists = true;
     break;
    }
   }
   if (countryExists === false) {
    //If Country is not found, raise an error
    oCountryName.setValue();
    oCountry.setValueState("Error");
    sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").setValue();
    sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").setValue();
    sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").setValue();
    if (oRegion.getValue() !== "") {
     oRegion.setValueState("Error");
     oRegion.setValueStateText(oCountry.getValueStateText());
    }
    oRegionName.setValue();

    var errorMsg = wizardController.i18nBundle.getText("CountryMSG", oCountry.getValue());
    oCountry.setValueStateText(errorMsg);
   }

  } else {
   oCountry.setValue();
   // oCountry.setValueState("None");
   oCountryName.setValue();
   if (oRegion.getValue() !== "") {
    oRegionName.setValue();
    oRegion.setValueState("Error");
    oRegion.setValueStateText("");
   }
   if (sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").getValue() === vLastCountryName) {
    sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").setValue("");
   }
   if (sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").getValue() === vLastCountryName) {
    sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").setValue("");
   }
   if (sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").getValue() === vLastCountryName) {
    sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").setValue("");
   }

   fcg.mdg.editbp.handlers.Communication.reloadFragment();
   fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
   oCountryName.fireEvent("change");
  }
  fcg.mdg.editbp.handlers.Communication.vOldCountry = sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue();
 },

 //handles the change of communication country when the valuehelp button is pressed
 onCommCountryVH: function(oControlEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
  var country = oControlEvent.getSource();
  // If this method is called while clicking on Address COUNTRY KEY
  if (sap.ui.getCore().byId("CountryDialog") !== undefined) {
   sap.ui.getCore().byId("CountryDialog").destroy();
   this.oCountryValueHelp = "";
  }

  var oCountryDialog = new sap.m.SelectDialog({
   id: "CountryDialog",
   title: wizardController.i18nBundle.getText("COUNTRIES"), // "Countries",
   noDataText: wizardController.i18nBundle.getText("LOAD") + "...", // "Loading...",
   items: {
    path: "/CountryValues",
    template: new sap.m.StandardListItem({
     title: "{TEXT}",
     description: "{KEY}"
    })
   },
   confirm: function(oEvent) {
    // Set Country Value
    country.setValueState("None");
    country.setValueStateText("");
    country.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    country.fireEvent("change");
   },
   search: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
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
   liveChange: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
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
   oCountryDialog.setNoDataText(wizardController.i18nBundle.getText("NO_DATA"));
  }
  oCountryDialog.open();
 },

 //handles the change of communication country when the value is changed
 onCommCountryKeyChange: function(oControlEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
  var oCountry = oControlEvent.getSource();
  oCountry.setValue(oCountry.getValue().toUpperCase());
  var country = oCountry.getValue();
  var countryNoSpaces = country.replace(/^[ ]+|[ ]+$/g, "");
  if (countryNoSpaces !== "") {
   // -------------- Existence Check -------------------------------
   var countryExists = false;
   for (var i = 0; i < oCountryResult.results.length; i++) {
    if (oCountryResult.results[i].KEY === countryNoSpaces) {
     if (oCountry.getValue() !== "") {
      oCountry.setValueState("None");
      fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
     }
     countryExists = true;
     break;
    }
   }
   if (countryExists === false) {
    //If Country is not found, raise an error
    oCountry.setValueState("Error");
    var errorMsg = wizardController.i18nBundle.getText("CountryMSG", oCountry.getValue());
    oCountry.setValueStateText(errorMsg);
   }
  } else {
   oCountry.setValue();
   oCountry.setValueState("None");
   oCountry.setValueStateText("");
   fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
  }
 },

 onValueHelpTextChange: function(oControlEvent) {
  oControlEvent.getSource().setValue(oControlEvent.getSource().getValue().toUpperCase());
  var countryDesc = oControlEvent.getSource().getValue();
  if (countryDesc.replace(/^[ ]+|[ ]+$/g, "") === "") {
   oControlEvent.getSource().setValue("");
  }
  fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
 },

 onPostalCodeChange: function(oControlEvent) {
  var postalCode = oControlEvent.getSource().getValue();
  if (postalCode.replace(/^[ ]+|[ ]+$/g, '') === "")
   oControlEvent.getSource().setValue("");
  fcg.mdg.editbp.handlers.Communication.validatePostalCode();
  fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
 },

 validatePostalCode: function() {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var country = sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue();
  var oPostalCode = sap.ui.getCore().byId("INP-BP_Address-POSTL_COD1");
  var pCode = oPostalCode.getValue();
  if (country !== "" && pCode !== "") {
   var sQuery = "/ValueHelpCollection?$filter=";
   sQuery = sQuery + jQuery.sap.encodeURL("ENTITY eq 'BP_Address' and FILTER eq 'COUNTRY=" + country + "/POSTL_COD1=" + pCode +
    "' and ATTR_NAME eq 'POSTL_COD1'");

   var oModel = new sap.ui.model.odata.ODataModel(wizardController.getView().getModel().sServiceUrl, true);
   oModel.read(sQuery, null, null, false,
    function(data, oError) {
     oPostalCode.setValueState("None");
    },
    function(oError) {
     // If there is any error on Postal Code validation, replicate this error on UI
     oPostalCode.setValueState("Error");
     var errorObj = JSON.parse(oError.response.body);
     var errorMsg = errorObj.error.message.value;
     oPostalCode.setValueStateText(errorMsg);
    });
  }
 },

 validateRegion: function(oControlEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oCountry = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
  var countryVal = oCountry.getValue();
  var oRegionName = sap.ui.getCore().byId("INP-BP_Address-REGION__TXT");
  var oRegion = sap.ui.getCore().byId("INP-BP_Address-REGION");
  var regionVal = oRegion.getValue();
  var regionNoSpaces = regionVal.replace(/^[ ]+|[ ]+$/g, "");
  if (regionNoSpaces !== "") {
   // -------------- Existence Check  -------------------------------
   var sQuery = "/ValueHelpCollection?$filter=";
   sQuery = sQuery + jQuery.sap.encodeURL("ENTITY eq 'BP_Person' and FILTER eq 'COUNTRY=" + countryVal +
    "' and ATTR_NAME eq 'REGION' and ATTR_VALUE eq '" + regionNoSpaces + "'");
   fcg.mdg.editbp.handlers.Communication.oRegionModel = new sap.ui.model.odata.ODataModel(wizardController.getView().getModel().sServiceUrl,
    true);
   fcg.mdg.editbp.handlers.Communication.oRegionModel.read(sQuery, null, null, true,
    function(data, oError) {
     // Set the description as returned by requests
     fcg.mdg.editbp.handlers.Communication.vRegionFlag = true;
     if (oRegion.getValue() !== "") {
      var desc = data.results[0].TEXT;
      oRegion.setValueState("None");
      oRegionName.setValue(desc);
      if (oControlEvent !== undefined) {
       oRegionName.fireEvent("change");
      }
      if (fcg.mdg.editbp.handlers.Communication.vRegionTextFlag) {
       fcg.mdg.editbp.handlers.Communication.vRegionTextFlag = false;
       wizardController.getView().byId("wizardId").fireEvent("complete");
      }
     }
    },
    function(oError) {
     // If this country key does not exist in the backend, show this error as a pop up
     fcg.mdg.editbp.handlers.Communication.vRegionFlag = false;
     oRegionName.setValue();
     oRegion.setValueState("Error");
     var errorObj = JSON.parse(oError.response.body);
     var errorMsg = errorObj.error.message.value;
     oRegion.setValueStateText(errorMsg);
     if (fcg.mdg.editbp.handlers.Communication.vRegionTextFlag) {
      fcg.mdg.editbp.handlers.Communication.vRegionTextFlag = false;
     }
    });
  } else {
   oRegionName.setValue();
   oRegion.setValueState("None");
  }

  if (oControlEvent !== undefined) {
   fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
  }
 },

 //used when the Asyn call for region is not completed. called from on wizardcomplete method
 handleRequestCompleted: function() {
  fcg.mdg.editbp.handlers.Communication.vRegionTextFlag = true;
 },

 //usd when the region field valuehelp is press
 onRegionVH: function(oControlEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var region = sap.ui.getCore().byId("INP-BP_Address-REGION");
  var oCountry = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
  var countryVal = oCountry.getValue();
  var regionText = sap.ui.getCore().byId("INP-BP_Address-REGION__TXT");
  if (countryVal === "") {
   // If country is not entered, Raise an error
   region.setValueState("Error");
   region.setValueStateText(wizardController.i18nBundle.getText("REGION_CHECK"));
   oCountry.setValueState("Error");
   oCountry.setValueStateText(wizardController.i18nBundle.getText("DEP_MSG"));
   return;
  }
  if (oCountry.getValueState() === "Error") {
   regionText.setValue("");
   region.setValueState("Error");
   region.setValueStateText(oCountry.getValueStateText());
   return;

  }
  var aFilters = [];
  var oFilter = new sap.ui.model.Filter('COUNTRY', 'EQ', countryVal);
  aFilters.push(oFilter);

  if (sap.ui.getCore().byId("RegionDialog") !== undefined) {
   sap.ui.getCore().byId("RegionDialog").destroy();
  }

  var oSelectDialog = new sap.m.SelectDialog({
   id: "RegionDialog",
   title: wizardController.i18nBundle.getText("REGIONS"),
   noDataText: wizardController.i18nBundle.getText("LOAD") + "...",
   confirm: function(oEvent) {
    region.setValueState("None");
    region.setValueStateText("");
    region.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    regionText.setValue(oEvent.getParameters().selectedItem.getProperty("title"));
    region.fireEvent("change");
   },
   search: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
    var oItems = oSelectDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { // Get all the rows of the table and compare the string one by one across all columns
      var sRegionName = oItems[i].getBindingContext().getProperty("KEY");
      var sRegionKey = oItems[i].getBindingContext().getProperty("TEXT");
      if (sRegionName.toUpperCase().indexOf(sValue) === -1 && sRegionKey.toUpperCase().indexOf(sValue) === -1) {
       oItems[i].setVisible(false);
      } else {
       oItems[i].setVisible(true);
      }
     } else {
      oItems[i].setVisible(true);
     }
    }

   },
   liveChange: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
    var oItems = oSelectDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) {
      var sRegionName = oItems[i].getBindingContext().getProperty("KEY");
      var sRegionKey = oItems[i].getBindingContext().getProperty("TEXT");
      if (sRegionName.toUpperCase().indexOf(sValue) === -1 && sRegionKey.toUpperCase().indexOf(sValue) === -1) {
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
  var sQuery = "/ValueHelpCollection?$filter=";
  sQuery = sQuery + jQuery.sap.encodeURL("ENTITY eq 'BP_Person' and FILTER eq 'COUNTRY=" + countryVal + "' and ATTR_NAME eq 'REGION'");
  var oModel = new sap.ui.model.odata.ODataModel(wizardController.getView().getModel().sServiceUrl, true);
  oModel.read(sQuery, null, null, true,
   function(result, oError) {
    if (result.results.length > 0) {
     var oItemTemplate = new sap.m.StandardListItem({
      title: "{TEXT}",
      description: "{KEY}",
      active: true
     });
     var oInputHelpModel = new sap.ui.model.json.JSONModel();
     oInputHelpModel.setData(result);
     oSelectDialog.setModel(oInputHelpModel);
     oSelectDialog.setGrowingThreshold(result.results.length);
     oSelectDialog.bindAggregation("items", "/results", oItemTemplate);
    } else {
     oSelectDialog.setNoDataText(wizardController.i18nBundle.getText("NO_DATA"));
    }

   });
  oSelectDialog.open();
 },

 //usd when the region field is changed
 onRegionChange: function(oControlEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  sap.ui.getCore().byId("INP-BP_Address-REGION").setValue(sap.ui.getCore().byId("INP-BP_Address-REGION").getValue().toUpperCase());
  var oCountry = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
  var countryVal = oCountry.getValue().toUpperCase();
  var oRegion = sap.ui.getCore().byId("INP-BP_Address-REGION");
  var oRegionName = sap.ui.getCore().byId("INP-BP_Address-REGION__TXT");
  var regionVal = oRegion.getValue();
  var regionNoSpaces = regionVal.replace(/^[ ]+|[ ]+$/g, "");

  if (countryVal.replace(/^[ ]+|[ ]+$/g, "") === "" || oCountry.getValueState() === "Error") {
   if (regionNoSpaces === "") {
    oRegion.setValue(regionNoSpaces);
    oRegionName.setValue(regionNoSpaces);
    return;
   }
   oRegionName.setValue();
   oRegion.setValueState("Error");
   if (oCountry.getValueState() === "Error" && oCountry.getValue() !== "") {
    oRegion.setValueStateText(oCountry.getValueStateText());
   } else {
    oRegion.setValueStateText(wizardController.i18nBundle.getText("REGION_CHECK"));
    oCountry.setValueState("Error");
    oCountry.setValueStateText(wizardController.i18nBundle.getText("DEP_MSG"));
   }
  } else {
   fcg.mdg.editbp.handlers.Communication.validateRegion(oControlEvent);
  }
 },

 //usd when the IAV Address version field is changed
 onAddressChange: function(oEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var addressVersField = oEvent.getSource();
  var addressVersValue = addressVersField.getSelectedKey();
  var partId = addressVersField.getId().split("-")[3];
  var IdEntityPart = "INP-BP_AddressVersionsOrg";
  if (wizardController.sCategory === "1") {
   IdEntityPart = "INP-BP_AddressVersionsPers";
  }
  var fields = fcg.mdg.editbp.handlers.Communication.getIavFields(IdEntityPart, partId);

  if (oEvent.getSource().getSelectedKey() === "") {

  } else {
   fcg.mdg.editbp.handlers.Communication.setEnableForFields(fields, true);
   addressVersField.setSelectedKey(addressVersValue);
   fcg.mdg.editbp.handlers.Communication.selectedAddVersion[partId] = addressVersValue;
   fcg.mdg.editbp.handlers.Communication.onChange_Create(oEvent);
   var id = IdEntityPart.split("-")[1] + "Rel" + "-" + partId + "-" + fcg.mdg.editbp.handlers.Communication.oController.vCurrentActionId;
   for (var i = 0; i < fcg.mdg.editbp.handlers.Communication.aRemoveFields.length; i++) {
    if (fcg.mdg.editbp.handlers.Communication.aRemoveFields[i] === id) {
     fcg.mdg.editbp.handlers.Communication.aRemoveFields.splice(i, 1);
     i = i - 1;
    }
   }
   var addversIndex = oEvent.getSource().getSelectedIndex();
   fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results.splice(addversIndex, 1);
   fcg.mdg.editbp.handlers.Communication.handleEnableIcon("toolCommIAVAdd", fcg.mdg.editbp.handlers.Communication.addNewIAVGrp);
   sap.ui.getCore().byId(addressVersField.getId()).setEnabled(false);
   return;
  }
  fcg.mdg.editbp.handlers.Communication.onChange_Create(oEvent);
 },

 //usd when the language field is changed
 onCorsLangChange: function(oControlEvent) {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oLanguageResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[2].data;
  var oFragmentId = oControlEvent.getSource().getId().split("-");
  oFragmentId = oFragmentId[0];
  sap.ui.getCore().byId("INP-BP_Address-LANGU").setValue(sap.ui.getCore().byId("INP-BP_Address-LANGU").getValue()
   .toUpperCase());

  var oCorsLang = sap.ui.getCore().byId("INP-BP_Address-LANGU");
  var corsLang = oCorsLang.getValue();
  var corsLangNoSpaces = corsLang.replace(/^[ ]+|[ ]+$/g, "");
  corsLangNoSpaces = corsLangNoSpaces.toUpperCase();
  var oCorsLangName = sap.ui.getCore().byId("INP-BP_Address-LANGU__TXT");

  if (corsLangNoSpaces !== "") {
   //-------------- Existence Check -------------------------------
   var langExists = false;
   for (var i = 0; i < oLanguageResult.results.length; i++) {
    if (oLanguageResult.results[i].KEY === corsLangNoSpaces) {
     if (oCorsLang.getValue() !== "") {
      fcg.mdg.editbp.handlers.Communication.vLangu = oLanguageResult.results[i].ATTR_VALUE;
      oCorsLangName.setValue(oLanguageResult.results[i].TEXT);
      fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
      oCorsLangName.fireEvent("change");
     }
     langExists = true;
     oCorsLang.setValueState("None");
     break;
    }
   }
   if (langExists === false) {
    //If correspondence language is not found, raise an error
    fcg.mdg.editbp.handlers.Communication.vLangu = "";
    oCorsLangName.setValue();
    oCorsLang.setValueState("Error");
    var sFieldName = "";
    if (wizardController.bpCategory === "1") {
     sFieldName = wizardController.i18nBundle.getText("CLANG");
    }
    if (wizardController.bpCategory === "2") {
     sFieldName = wizardController.i18nBundle.getText("LANGUAGE");
    }
    var errorMsg = wizardController.i18nBundle.getText("LANG_ERROR", oCorsLang.getValue());
    oCorsLang.setValueStateText(errorMsg);
   }
  } else {
   fcg.mdg.editbp.handlers.Communication.vLangu = "";
   oCorsLang.setValue();
   oCorsLang.setValueState("None");
   oCorsLangName.setValue();
   fcg.mdg.editbp.handlers.Communication.onChange_Create(oControlEvent);
   oCorsLangName.fireEvent("change");
  }

 },

 //usd when the language field valuehelp is pressed
 onCLangVH: function(oControlEvent) {
  var oGlobalInstance = this;
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var oLanguageResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[2].data;
  if (sap.ui.getCore().byId("CorrespodingLangDialog") !== undefined) {
   sap.ui.getCore().byId("CorrespodingLangDialog").destroy();
  }

  var oSelectDialog = new sap.m.SelectDialog({
   id: "CorrespodingLangDialog",
   title: wizardController.i18nBundle.getText("LANG"),
   noDataText: wizardController.i18nBundle.getText("LOAD") + "...",
   confirm: function(oEvent) {
    sap.ui.getCore().byId("INP-BP_Address-LANGU").setValueState("None");
    sap.ui.getCore().byId("INP-BP_Address-LANGU__TXT").setValueStateText("");
    sap.ui.getCore().byId("INP-BP_Address-LANGU").setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    sap.ui.getCore().byId("INP-BP_Address-LANGU__TXT").setValue(oEvent.getParameters().selectedItem.getProperty("title"));
    sap.ui.getCore().byId("INP-BP_Address-LANGU").fireEvent("change");
   },
   search: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
    var oItems = oSelectDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
      var sLangKey = oItems[i].getBindingContext().getProperty("KEY");
      var sLangDesc = oItems[i].getBindingContext().getProperty("TEXT");
      fcg.mdg.editbp.handlers.Communication.vLangu = oItems[i].getBindingContext().getProperty("ATTR_VALUE");
      if (sLangKey.toUpperCase().indexOf(sValue) === -1 && sLangDesc.toUpperCase().indexOf(sValue) === -1) {
       oItems[i].setVisible(false);
      } else {
       oItems[i].setVisible(true);
      }
     } else {
      oItems[i].setVisible(true);
     }
    }
   },
   liveChange: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
    var oItems = oSelectDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
      var sLangKey = oItems[i].getBindingContext().getProperty("KEY");
      var sLangDesc = oItems[i].getBindingContext().getProperty("TEXT");
      fcg.mdg.editbp.handlers.Communication.vLangu = oItems[i].getBindingContext().getProperty("ATTR_VALUE");
      if (sLangKey.toUpperCase().indexOf(sValue) === -1 && sLangDesc.toUpperCase().indexOf(sValue) === -1) {
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

  if (oLanguageResult !== null && oLanguageResult.results.length > 0) {
   var oItemTemplate = new sap.m.StandardListItem({
    title: "{TEXT}",
    description: "{KEY}",
    active: true
   });
   var oInputHelpModel = new sap.ui.model.json.JSONModel();
   oInputHelpModel.setData(oLanguageResult);
   oSelectDialog.setModel(oInputHelpModel);
   oSelectDialog.setGrowingThreshold(oLanguageResult.results.length);
   oSelectDialog.bindAggregation("items", "/results", oItemTemplate);
  } else {
   oSelectDialog.setNoDataText(oGlobalInstance.i18nBundle.getText("NO_DATA"));
  }
  oSelectDialog.open();
 },

 //used in IAV to enable of fields
 setEnableForFields: function(fields, status) {
  for (var i = 0; i < fields.length; i++) {
   sap.ui.getCore().byId(fields[i]).setEnabled(status);
  }
 },

 //use to empty the fields in case the address verion of IAV is set to None
 setEmptyForFields: function(fields, value, partId) {
  for (var i = 0; i < fields.length; i++) {
   if (fields === "INP-BP_AddressVersionsOrg-TITLE-" + partId) {
    fields.setSelectedKey("");
   }
   sap.ui.getCore().byId(fields[i]).setValue(value);
  }
 },

 //used to set the visiblility of fields
 setVisiblityForFields: function(fields, status) {
  for (var i = 0; i < fields.length; i++) {
   if (sap.ui.getCore().byId(fields[i]) !== undefined)
    sap.ui.getCore().byId(fields[i]).setVisible(status);
  }
 },

 //used to get the IAV fields present in IAV Form.
 getIavFields: function(sIdEntityPart, sIdpart) {
  var iavFields;
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  var sIdEntityDeepEntity;

  if(oWController.sCategory === "1"){
   sIdEntityDeepEntity = "INP-BP_AddressPersonVersion";
   iavFields = [sIdEntityDeepEntity + "-TITLE_P-" + sIdpart, sIdEntityDeepEntity + "-FIRSTNAME-" + sIdpart,
   sIdEntityDeepEntity + "-LASTNAME-" + sIdpart, sIdEntityDeepEntity + "-SORT1_P-" + sIdpart, sIdEntityDeepEntity + "-SORT2_P-" +
   sIdpart, sIdEntityPart + "-STREET-" + sIdpart, sIdEntityPart + "-HOUSE_NO-" + sIdpart,
   sIdEntityPart + "-CITY-" + sIdpart
   ];
  } else{
   iavFields = [sIdEntityPart + "-TITLE-" + sIdpart, sIdEntityPart + "-NAME-" + sIdpart,
    sIdEntityPart + "-NAME2-" + sIdpart, sIdEntityPart + "-SORT1-" + sIdpart, sIdEntityPart + "-SORT2-" +
    sIdpart, sIdEntityPart + "-STREET-" + sIdpart, sIdEntityPart + "-HOUSE_NO-" + sIdpart,
    sIdEntityPart + "-CITY-" + sIdpart
   ];
  }
  return iavFields;
 },

 //used to check model and to delete empty result.
 checkModelData: function(oData) {
  if (oData === undefined) {
   return;
  }
  if (oData.results !== undefined && oData.results.length !== 0) {
   for (var i = 0; i < oData.results.length; i++) {
    if (oData.results[i].length === 0) {
     oData.results.splice(i, 1);
     i = i - 1;
    }
   }
   return oData.results;
  }
 },

 //used to store the data into object in case of reload fragment when country is changed
 handleReloadFragFields: function(aFields, aValues, sFlag) {
  var i;
  if (sFlag) {
   for (i = 0; i < aFields.length; i++) {
    if (sap.ui.getCore().byId(aFields[i]) !== undefined)
     sap.ui.getCore().byId(aFields[i]).setValue(aValues[Object.keys(aValues)[i]]);
   }
  } else {
   for (i = 0; i < aFields.length; i++) {
    if (sap.ui.getCore().byId(aFields[i]) !== undefined) {
     aValues[Object.keys(aValues)[i]] = sap.ui.getCore().byId(aFields[i]).getValue();
    }
   }
  }
 },

 //used to laod fragment based on country, when country is US different fragment has to be loaded.
 reloadFragment: function() {
  var wizardController = fcg.mdg.editbp.handlers.Communication.oController;
  var fieldsOrg = ["INP-BP_Address-HOUSE_NO", "INP-BP_Address-STREET", "INP-BP_Address-CITY", "INP-BP_Address-POSTL_COD1",
   "INP-BP_Address-REGION", "INP-BP_Address-REGION__TXT", "INP-BP_Address-COUNTRY", "INP-BP_Address-COUNTRY__TXT",
   "INP-BP_Address-LANGU", "INP-BP_Address-LANGU__TXT", "INP-BP_Address-PO_BOX", "INP-BP_Address-POSTL_COD3"
  ];
  var fieldsPers = ["INP-BP_Address-HOUSE_NO", "INP-BP_Address-STREET", "INP-BP_Address-CITY", "INP-BP_Address-POSTL_COD1",
   "INP-BP_Address-REGION", "INP-BP_Address-REGION__TXT", "INP-BP_Address-COUNTRY", "INP-BP_Address-COUNTRY__TXT"
  ];
  var fieldPersNotVisible = ["INP-BP_Address-LANGU", "INP-BP_Address-LANGU__TXT", "INP-BP_Address-PO_BOX", "INP-BP_Address-POSTL_COD3"];
  var addressFieldData = {
   HouseNumber: "",
   Street: "",
   City: "",
   PostalCode: "",
   Region: "",
   RegionName: "",
   CountryKey: "",
   CountryName: "",
   LanguageKeyIso: "",
   CorsLangText: "",
   POBox: "",
   CompanyPostalCode: "",
   District: ""
  };

  if (wizardController.sCategory === "2") {
   this.handleReloadFragFields(fieldsOrg, addressFieldData, false);

   if (sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue() === "US") {
    this.oAddressCreate.destroy();
    this.oAddressCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressEditUS', wizardController);
    wizardController.getView().byId("communicationLayout").insertItem(this.oAddressCreate, 1);

    this.handleReloadFragFields(fieldsOrg, addressFieldData, true);
    this.setVisiblityForFields(fieldPersNotVisible, true);
    sap.ui.getCore().byId("INP-BP_Address-DISTRICT").setValue(addressFieldData.District);
   } else {
    this.oAddressCreate.destroy();
    this.oAddressCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressEdit', wizardController);
    wizardController.getView().byId("communicationLayout").insertItem(this.oAddressCreate, 1);
    this.handleReloadFragFields(fieldsOrg, addressFieldData, true);
    this.setVisiblityForFields(fieldPersNotVisible, true);
   }

  } else {
   this.handleReloadFragFields(fieldsPers, addressFieldData, false);

   if (sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValue() === "US") {
    this.oAddressCreate.destroy();
    this.oAddressCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressEditUS', wizardController);
    wizardController.getView().byId("communicationLayout").insertItem(this.oAddressCreate, 1);

    this.handleReloadFragFields(fieldsPers, addressFieldData, true);
    this.setVisiblityForFields(fieldPersNotVisible, false);
    sap.ui.getCore().byId("INP-BP_Address-DISTRICT").setValue(addressFieldData.District);
   } else {
    this.oAddressCreate.destroy();
    this.oAddressCreate = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.AddressEdit', wizardController);
    wizardController.getView().byId("communicationLayout").insertItem(this.oAddressCreate, 1);

    this.handleReloadFragFields(fieldsPers, addressFieldData, true);
    this.setVisiblityForFields(fieldPersNotVisible, false);
   }
  }

 },

 // used to edit the query where some attribute has to removed/added which is sent for submit in create of address
 submitCreateQuery: function(queryCrtModel) {
  var i, k;
  for (var j = 0; j < queryCrtModel.length; j++) {
   var address = queryCrtModel[j].body;
   for (i = 0; i < Object.keys(address).length; i++) {
    if (Object.keys(address)[i] === "BP_CommPhoneRel") {
     address.BP_CommPhoneRel = address.BP_CommPhoneRel.results;
     for (k = 0; k < address.BP_CommPhoneRel.length; k++) {
      if (k === 0) {
       address.BP_CommPhoneRel[k]["R_3_USER"] = "1";
       address.BP_CommPhoneRel[k]["STD_NO"] = "X";
      }
     }
    } else if (Object.keys(address)[i] === "BP_CommMobileRel") {
     address.BP_CommMobileRel = address.BP_CommMobileRel.results;
     for (k = 0; k < address.BP_CommMobileRel.length; k++) {
      if (k === 0) {
       address.BP_CommMobileRel[k]["R_3_USER"] = "3";
       address.BP_CommMobileRel[k]["STD_NO"] = "X";
      } else {
       address.BP_CommMobileRel[k]["R_3_USER"] = "2";
      }
     }
    } else if (Object.keys(address)[i] === "BP_CommFaxRel") {
     address.BP_CommFaxRel = address.BP_CommFaxRel.results;
     for (k = 0; k < address.BP_CommFaxRel.length; k++) {
      if (k === 0) {
       address.BP_CommFaxRel[k]["STD_NO"] = "X";
      }
     }
    } else if (Object.keys(address)[i] === "BP_CommEMailRel") {
     address.BP_CommEMailRel = address.BP_CommEMailRel.results;
     for (k = 0; k < address.BP_CommEMailRel.length; k++) {
      if (k === 0) {
       address.BP_CommEMailRel[k]["STD_NO"] = "X";
      }
     }
    } else if (Object.keys(address)[i] === "BP_CommURIRel") {
     address.BP_CommURIRel = address.BP_CommURIRel.results;
     for (k = 0; k < address.BP_CommURIRel.length; k++) {
      if (k === 0) {
       address.BP_CommURIRel[k]["STD_NO"] = "X";
      }
      address.BP_CommURIRel[k]["URI_TYPE"] = "HPG";
     }
    } else if (Object.keys(address)[i] === "BP_AddressVersionsOrgRel") {
     address.BP_AddressVersionsOrgRel = this.removeValueHelpText("BP_AddressVersionsOrgRel", address.BP_AddressVersionsOrgRel.results);
    } else if (Object.keys(address)[i] === "BP_AddressVersionsPersRel") {
     address.BP_AddressVersionsPersRel = this.removeValueHelpText("BP_AddressVersionsPersRel", address.BP_AddressVersionsPersRel.results);
    }
    if (Object.keys(address)[i] === "LANGUISO") {
     address["LANGU"] = fcg.mdg.editbp.handlers.Communication.vLangu;
     delete address.LANGUISO;
     fcg.mdg.editbp.handlers.Communication.vLangu = "";
    }
    //checking if all address is deleted the make first address as default
   }
   if (this.oController.oDetailComm.BP_AddressesRel !== undefined) {
    if (this.oController.oDetailComm.BP_AddressesRel.results.length === 0 && j === 0) {
     address["STANDARDADDRESS"] = "X";
     address["BP_UsagesOfAddressRel"] = [];
     address["BP_UsagesOfAddressRel"].push({"ADDRESSTYPE" : "XXDEFAULT"});
    }
   }
  }

  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  var oExtResults = oWController.bpHookAddressSubmitCreateQuery(this, queryCrtModel);
  if (oExtResults !== undefined) {
   queryCrtModel = oExtResults;
  }

  return queryCrtModel;
 },

 // used to edit the query where some attribute has to removed/added which is sent for submit in change of address
 submitChangeQuery: function(queryChngModel) {
  var j;
  for (j = 0; j < queryChngModel.length; j++) {
   var entity = queryChngModel[j].changes;
   delete entity.ChangeData;
   if(queryChngModel[j].entity === "BP_Address"){
    var i;
    for(i=0;i<Object.keys(queryChngModel[j].changes).length;i++){
     if(Object.keys(queryChngModel[j].changes)[i] === "LANGUISO"){
      entity["LANGU"] = fcg.mdg.editbp.handlers.Communication.vLangu;
      break;
     }
    }
   }
   // if (queryChngModel[j].entity === "BP_CommMobile") {
   //  if(queryChngModel[j].key === 0 && queryChngModel[j].body === "N"){
   //   entity["R_3_USER"] = "1";
   //   entity["STD_NO"] = "X";
   //  }
   // }
   // if(queryChngModel[j].entity === "BP_CommPhone") {
   //  if(queryChngModel[j].key === 0 && queryChngModel[j].body === "N"){
   //   entity["R_3_USER"] = "1";
   //   entity["STD_NO"] = "X";
   //  }
   // }
   // if (queryChngModel[j].entity === "BP_CommURI" && queryChngModel[j].body === "N") {
   //  if(queryChngModel[j].key === 0 && queryChngModel[j].body === "N"){
   //   entity["R_3_USER"] = "1";
   //   entity["STD_NO"] = "X";
   //  }
   //  entity["URI_TYPE"] = "HPG";
   // }
   if ((queryChngModel[j].entity === "BP_CommMobile" || queryChngModel[j].entity === "BP_CommPhone" || 
   queryChngModel[j].entity === "BP_CommEMail" || queryChngModel[j].entity === "BP_CommURI" || queryChngModel[j].entity === "BP_CommFax" )
   && (queryChngModel[j].body === "N")) {
     if(queryChngModel[j].key === "0"){
      switch(queryChngModel[j].entity){
       case "BP_CommMobile":
        entity["R_3_USER"] = "3";
        break;
       case "BP_CommPhone":
        entity["R_3_USER"] = "1";
        break;
       case "BP_CommURI":
        entity["URI_TYPE"] = "HPG";
        break;
      }
      entity["STD_NO"] = "X";
    }
   }

   if (queryChngModel[j].entity === "BP_AddressVersionsOrg") {
    delete entity.TITLE__TXT;
    delete entity.ADDR_VERS__TXT;
   }
   if (queryChngModel[j].entity === "BP_AddressVersionsPers") {
    if (queryChngModel[j].body === 'D' || queryChngModel[j].body === 'U') {
     queryChngModel[j].entity = "BP_AddressVersion_Person";
    }
   }
   if (queryChngModel[j].entity === "BP_AddressVersionsOrg") {
    if (queryChngModel[j].body === 'U' || queryChngModel[j].body === 'D') {
     queryChngModel[j].entity = "BP_AddressVersion_Organization";
    }
   }
   if (queryChngModel[j].entity === "BP_AddressPersonVersion") {
    if (queryChngModel[j].body === 'D' || queryChngModel[j].body === 'U') {
     queryChngModel[j].entity = "BP_PersonVersion";
    }
    else{
     queryChngModel.splice(j,1);
     j--;
    }
   }
  }

  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();
  var oExtResults = oWController.bpHookAddressSubmitChangeQuery(this, queryChngModel);
  if (oExtResults !== undefined) {
   queryChngModel = oExtResults;
  }

  return queryChngModel;
 },

 // used in method submitCreateQuery which is used to submit the query for create of address
 removeValueHelpText: function(sEntity, oResults) {
  var i;
  if (sEntity === "BP_AddressVersionsOrgRel") {
   for (i = 0; i < oResults.length; i++) {
    delete oResults[i].TITLE__TXT;
    delete oResults[i].ADDR_VERS__TXT;
   }
   return oResults;
  }
  if (sEntity === "BP_AddressVersionsPersRel") {
   for (i = 0; i < oResults.length; i++) {
    for (var l = 0; l < Object.keys(oResults[i]).length; l++) {
     if (Object.keys(oResults[i])[l] === "TITLE") {
      oResults[i]["TITLE_P"] = oResults[i][Object.keys(oResults[i])[l]];
     }
     if (Object.keys(oResults[i])[l] === "NAME") {
      oResults[i]["FIRSTNAME"] = oResults[i][Object.keys(oResults[i])[l]];
     }
     if (Object.keys(oResults[i])[l] === "NAME_2") {
      oResults[i]["LASTNAME"] = oResults[i][Object.keys(oResults[i])[l]];
     }
    }
    delete oResults[i].TITLE_P;
    delete oResults[i].TITLE_P__TXT;
    delete oResults[i].ADDR_VERS__TXT;
    delete oResults[i].NAME;
    delete oResults[i].NAME_2;
   }
   return oResults;
  }
 },

 //to check communication is present or not used to set flag which will show/hide communication title
 getCommFieldvalue: function(value) {
  if (value !== undefined && value !== "") {
   return true;
  } else
   return false;
 },

 //when particular data is deleted from field and then added, the we have to remove it from the array aRemoveFields (which will remove data from model)
 checkDataExsistinRemoveArrary: function(vEntity, index) {
  for (var i = 0; i < this.aRemoveFields.length; i++) {
   if (this.aRemoveFields[i].split("-")[0] === vEntity + "Rel" && this.aRemoveFields[i].split("-")[1] === index && this.aRemoveFields[i].split(
     "-")[2] === this.oController.vCurrentActionId) {
    this.aRemoveFields.splice(i, 1);
    i = i - 1;
   }
  }
 },

 // called from onchange method in wizard.controller which will help in disabling/enabling of communiction section
 handleCommIconEnableDisable: function(vEntity, vId) {
  switch (vEntity) {
   case 'BP_CommPhone':
    if (sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").getValue() === "" && sap.ui.getCore().byId("INP-BP_CommPhone-TELEPHONE-0").getValue() ===
     "" && sap.ui.getCore().byId("INP-BP_CommPhone-EXTENSION-0").getValue() === "") {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
    } else if (sap.ui.getCore().byId("INP-BP_CommPhone-COUNTRY-0").getValue() !== "" || sap.ui.getCore().byId(
      "INP-BP_CommPhone-TELEPHONE-0")
     .getValue() !==
     "" || sap.ui.getCore().byId("INP-BP_CommPhone-EXTENSION-0").getValue() !== "") {
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("telCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementTel);
     if (this.aRemoveFields.length !== 0)
      this.checkDataExsistinRemoveArrary(vEntity, vId.split('-')[3]);
    }
    break;
   case 'BP_CommMobile':
    if (sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").getValue() === "" && sap.ui.getCore().byId("INP-BP_CommMobile-TELEPHONE-0").getValue() ===
     "") {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
    } else if (sap.ui.getCore().byId("INP-BP_CommMobile-COUNTRY-0").getValue() !== "" || sap.ui.getCore().byId(
      "INP-BP_CommMobile-TELEPHONE-0").getValue() !== "") {
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("mobCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementMob);
     if (this.aRemoveFields.length !== 0)
      this.checkDataExsistinRemoveArrary(vEntity, vId.split('-')[3]);
    }
    break;
   case 'BP_CommFax':
    if (sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").getValue() === "" && sap.ui.getCore().byId("INP-BP_CommFax-FAX-0").getValue() ===
     "" && sap.ui.getCore().byId("INP-BP_CommFax-EXTENSION-0").getValue() === "") {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
    } else if (sap.ui.getCore().byId("INP-BP_CommFax-COUNTRY-0").getValue() !== "" || sap.ui.getCore().byId("INP-BP_CommFax-FAX-0").getValue() !==
     "" || sap.ui.getCore().byId("INP-BP_CommFax-EXTENSION-0").getValue() !== "") {
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("faxCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementFax);
     if (this.aRemoveFields.length !== 0)
      this.checkDataExsistinRemoveArrary(vEntity, vId.split('-')[3]);
    }
    break;
   case 'BP_CommURI':
    if (sap.ui.getCore().byId("INP-BP_CommURI-URI-0").getValue() === "") {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
    } else if (sap.ui.getCore().byId("INP-BP_CommURI-URI-0").getValue() !== "") {
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("uriCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementUri);
     if (this.aRemoveFields.length !== 0)
      this.checkDataExsistinRemoveArrary(vEntity, vId.split('-')[3]);
    }
    break;
   case 'BP_CommEMail':
    if (sap.ui.getCore().byId("INP-BP_CommEMail-E_MAIL-0").getValue() === "") {
     fcg.mdg.editbp.handlers.Communication.handleDisableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
    } else if (sap.ui.getCore().byId("INP-BP_CommEMail-E_MAIL-0").getValue() !== "") {
     fcg.mdg.editbp.handlers.Communication.handleEnableIcon("emailCancel", fcg.mdg.editbp.handlers.Communication.removeFormElementEmail);
     if (this.aRemoveFields.length !== 0)
      this.checkDataExsistinRemoveArrary(vEntity, vId.split('-')[3]);
    }
    break;
  }
 },

 getWizardInstance: function() {
  return this.oController;
 },

 //to add the default country when we delete the country from communication field.
 setCommDefaultCountry: function(result, oModel) {
  for (var i = 0; i < result.length; i++) {
   if (result[i].COUNTRY === "") {
    if (result[i].TELEPHONE !== undefined) {
     if (result[i].TELEPHONE !== "")
      result[i].COUNTRY = oModel.getData().COUNTRY;
    }
    if (result[i].FAX !== undefined) {
     if (result[i].FAX !== "")
      result[i].COUNTRY = oModel.getData().COUNTRY;
    }
   }
  }
  return result;
 },

 //used when email field in communication section get changed
 onEmailChange: function(oEvent) {
  var emailId = oEvent.getParameters().id;
  emailId = sap.ui.getCore().byId(emailId);
  var oWController = fcg.mdg.editbp.handlers.Communication.getWizardInstance();

  var email = emailId.getValue();
  if (email.replace(/^[ ]+|[ ]+$/g, '') === "") {
   emailId.setValue("");
  }

  if (emailId.getValue() !== "") {
   var vEmail = fcg.mdg.editbp.util.Formatter.checkEmail(email);
   if (vEmail === false) {
    emailId.setValueState("Error");
    fcg.mdg.editbp.handlers.Communication.aErrorStateFlag.push(oEvent.getSource().getId() + ":" + true);
    emailId.setValueStateText(oWController.i18nBundle.getText("EMAIL_CHECK"));
   } else {
    emailId.setValueState("None");
    emailId.setValueStateText();
    oWController.onChange(oEvent);
   }
  } else {
   emailId.setValueState("None");
   emailId.setValueStateText();
   oWController.onChange(oEvent);
  }
 },

 //setting the IAV array which is used in addnewIav method for getting the address version list.
 setIavArray: function(oResults) {
  var results = [];
  for (var i = 0; i < oResults.length; i++) {
   results.push(oResults[i]);
  }
  fcg.mdg.editbp.handlers.Communication.oValueHelpAddressVersion.results = results;
 },

 //Validations
 performUIValidations: function(wController) {
  if (sap.ui.getCore().byId("INP-BP_Address-POSTL_COD1") !== undefined) {
   if (sap.ui.getCore().byId("INP-BP_Address-POSTL_COD1").getValueState() !== "None") {
    this.showPopUp(wController, sap.ui.getCore().byId("INP-BP_Address-POSTL_COD1").getValueStateText());
    return false;
   }
  }
  if (sap.ui.getCore().byId("INP-BP_Address-COUNTRY") !== undefined) {
   if (sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValueState() !== "None") {
    this.showPopUp(wController, sap.ui.getCore().byId("INP-BP_Address-COUNTRY").getValueStateText());
    return false;
   }
  }
  if (sap.ui.getCore().byId("INP-BP_Address-REGION") !== undefined) {
   if (sap.ui.getCore().byId("INP-BP_Address-REGION").getValueState() !== "None") {
    this.showPopUp(wController, sap.ui.getCore().byId("INP-BP_Address-REGION").getValueStateText());
    return false;
   }
  }
 },

 showPopUp: function(wController, txt) {
  var dialog = new sap.m.Dialog({
   title: wController.i18nBundle.getText("ERROR"),
   type: "Message",
   state: wController.i18nBundle.getText("ERROR"),
   content: [new sap.m.Text({
    text: txt
   })],
   beginButton: new sap.m.Button({
    text: wController.i18nBundle.getText("OK"),
    press: function() {
     dialog.close();
    }
   }),
   afterClose: function() {
    dialog.destroy();
   }
  });
  dialog.open();
 }
};