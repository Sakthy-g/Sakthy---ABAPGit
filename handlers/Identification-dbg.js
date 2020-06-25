/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.Identification");
fcg.mdg.editbp.handlers.Identification = {
 oController: "",
 oResult: "",
 oIdentificationLayout: "",
 oIdModel: "",
 oIDQueryModel: [],
 oIDDeleteQueryModel: [],
 oIDDeleteModel: [],
 vIDCreated: 0,
 vReEditIndex: "",
 oReEditModel: "",

 clearGlobalVariables: function() {
  this.oResult = "";
  this.oIdModel = "";
  this.oIDQueryModel = [];
  this.oIDDeleteQueryModel = [];
  this.oIDDeleteModel = [];
  this.vIDCreated = 0;
  this.vReEditIndex = "";
  this.oReEditModel = "";

 },
 getIdentificationData: function(wController) {
  if (this.oResult === "" || this.oResult === undefined) {
   this.oController = wController;
   var path = "/BP_RootCollection(BP_GUID=" + wController.sItemPath + ")?$expand=";
   var vQuery = path + "BP_IdentificationNumbersRel";
   var result = fcg.mdg.editbp.util.DataAccess.readData(vQuery, wController);
   this.setIdentificationResults(result);

   // Controller Hook method call
   var oExtIdentificationResponse = this.oController.bpHookModifygetIdentificationData(vQuery, this);
   if (oExtIdentificationResponse !== undefined) {
    result = oExtIdentificationResponse;
   }
  }
  this.setActionLayout(this.oResult);
 },

 setIdentificationResults: function(result) {
  this.oResult = result;
 },

 getIdentificationResults: function() {
  return this.oResult;
 },

 setActionLayout: function(result) {
  this.oController.getView().byId("entityStep").setNextStep(this.oController.getView().byId("actionStep"));
  if (this.oController.oActionLayout === "") {
   this.oController.oActionLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.SelectAction", this.oController);
  }
  if (sap.ui.getCore().byId("actionRBG") !== undefined) {
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(-1);
  }
  this.oController.getView().byId("actionLayout").setVisible(true);
  this.oController.getView().byId("actionLayout").addContent(this.oController.oActionLayout);
  this.oController.setRadioButtonText();
  sap.ui.getCore().byId("changeRB").setVisible(false);
  if (result.BP_IdentificationNumbersRel.results.length === 0) {
   sap.ui.getCore().byId("deleteRB").setEnabled(false);
  } else {
   sap.ui.getCore().byId("deleteRB").setEnabled(true);
  }
  this.oController.setActionView("actionStep", "select_action");
 },

 handleIdentification: function(wController) {
  this.oController = wController;
  if (wController.vCurrentActionId === "createRB") {
   this.createIdentification();
  } else if (wController.vCurrentActionId === "deleteRB") {
   var result = this.getIdentificationResults();
   this.handleDeleteIdentification(result);
  }
 },

 handleDeleteIdentification: function(result) {
  if (result.BP_IdentificationNumbersRel.results.length >= 1) {
   this.setSelectEntityLayout(result);
   return;
  }
 },

 setSelectEntityLayout: function(result) {
  var oModel = new sap.ui.model.json.JSONModel();
  var strResults = {
   dataitems: []
  };
  this.oController.getView().byId("actionStep").setNextStep(this.oController.getView().byId("editStep"));
  if (this.oController.oCommunicationListRBG === "") {
   this.oController.oCommunicationListRBG = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.SelectEntityInstance", this.oController);
  }
  if (this.oController.getView().byId("editLayout").getContent().length > 0) {
   this.oController.getView().byId("editLayout").removeAllContent();
  }
  this.oController.getView().byId("editLayout").setVisible(true);
  this.oController.getView().byId("editLayout").addContent(this.oController.oCommunicationListRBG);

  for (var i = 0; i < result.BP_IdentificationNumbersRel.results.length; i++) {
   var identDetail = result.BP_IdentificationNumbersRel.results[i];
   var oDataItems = {
    "RBText": identDetail.IDENTIFICATIONTYPE__TXT + " (" + identDetail.IDENTIFICATIONNUMBER + ")"
   };
   strResults.dataitems.push(oDataItems);
  }

  var cpListRBG = sap.ui.getCore().byId("selectDataListRBG");
  oModel.setData(strResults);
  cpListRBG.setModel(oModel);
  cpListRBG.setSelectedIndex(-1);
 },

 createIdentification: function() {
  this.vReEditIndex = "";
  var vsetIdModel;
  var idType = "";
  this.oController.getView().byId("actionStep").setNextStep(this.oController.getView().byId("editStep"));
  if (this.oIdentificationLayout === "") {
   this.oIdentificationLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditIdentification", this);
  } else {
   this.oIdentificationLayout.destroy();
   this.oIdentificationLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditIdentification", this);
  }

  //Controller hook
  var oExtIdentificationLayout = this.oController.bpHookModifycreateIdentification(this);
  if (oExtIdentificationLayout !== undefined) {
   this.oIdentificationLayout = oExtIdentificationLayout;
  }
  this.oController.getView().byId("editLayout").setVisible(true);
  this.oController.getView().byId("editLayout").removeAllContent();
  //adding Reason for request fragment
  this.oController.getFileUploadData("editLayout");
  this.oController.getView().byId("editLayout").addContent(this.oIdentificationLayout);
  vsetIdModel = this.oIDQueryModel;
  if (this.oController.reEdit === "X") {
   var vReEditFragmnt = this.oController.reEditSource.getParent().getParent().getParent();
   var vReEditLayout = vReEditFragmnt.getParent();
   this.vReEditIndex = vReEditLayout.indexOfContent(vReEditFragmnt);
   var oModel = new sap.ui.model.json.JSONModel();
   oModel.setData(vsetIdModel[this.vReEditIndex].body);
   this.oIdentificationLayout.setModel(oModel);
   idType = vsetIdModel[this.vReEditIndex].body.IDENTIFICATIONTYPE;
  }
  this.loadDropDown(idType);
 },

 loadDropDown: function(idTypeVal) {
  var oResults = fcg.mdg.editbp.util.DataAccess.getValueHelpData();
  var sDefaultText = this.oController.i18nBundle.getText("NONE");
  sDefaultText = "(" + sDefaultText + ")";

  var oIDTypeModel = new sap.ui.model.json.JSONModel();
  if (this.oController.sCategory === "1") {
   oIDTypeModel.setData(oResults[7].data);
  } else if (this.oController.sCategory === "2") {
   oIDTypeModel.setData(oResults[9].data);
  }
  var idTypeTemp = new sap.ui.core.Item({
   key: "{KEY}",
   text: "{TEXT}"
  });
  var idType = sap.ui.getCore().byId("SF-BP_IdentificationNumbersRel-IDTYPE");
  idType.setModel(oIDTypeModel);
  idType.bindItems("/results", idTypeTemp);
  var emptyValue = new sap.ui.core.Item({
   key: "",
   text: sDefaultText
  });
  idType.addItem(emptyValue);
  if (idTypeVal !== undefined) {
   idType.setSelectedKey(idTypeVal);
   return;
  }
  idType.setSelectedKey();
 },

 onIdentificationTypeChange: function(oEvent) {
  var idenType = sap.ui.getCore().byId("SF-BP_IdentificationNumbersRel-IDTYPE");
  var idNum = sap.ui.getCore().byId("SF-BP_IdentificationNumbersRel-IDNUMBER");
  var wController = fcg.mdg.editbp.handlers.Identification.oController;
  if (idenType.getSelectedKey() !== "") {
   idNum.setValueState("None");
   idNum.setValueStateText("");
  }
  if (idenType.getSelectedKey() === "" && idNum.getValue() !== "") {
   idNum.setValueState("Error");
   idNum.setValueStateText(wController.i18nBundle.getText("ID_TYPE_CHECK"));
  }

  wController.onChange(oEvent);

  if (idenType.getSelectedKey() !== "" && idNum.getValue() !== "") {
   wController.getView().byId("wizardId").validateStep(wController.getView().byId("editStep"));
  } else {
   wController.getView().byId("wizardId").invalidateStep(wController.getView().byId("editStep"));
  }
 },
 onIDNumberChange: function(oEvent) {
  var wController = fcg.mdg.editbp.handlers.Identification.oController;
  var idenType = sap.ui.getCore().byId("SF-BP_IdentificationNumbersRel-IDTYPE");
  var idNum = sap.ui.getCore().byId("SF-BP_IdentificationNumbersRel-IDNUMBER");
  var idNumber = idNum.getValue();
  if (idNumber.replace(/^[ ]+|[ ]+$/g, '') === "")
   idNum.setValue();

  if (idenType.getSelectedKey() === "" && idNum.getValue() !== "") {
   idNum.setValueState("Error");
   idNum.setValueStateText(wController.i18nBundle.getText("ID_TYPE_CHECK"));
  }
  if (idNum.getValue() === "") {
   idNum.setValueState("None");
   idNum.setValueStateText();
  }

  wController.onChange(oEvent);

  if (idenType.getSelectedKey() !== "" && idNumber !== "") {
   wController.getView().byId("wizardId").validateStep(wController.getView().byId("editStep"));
  } else {
   wController.getView().byId("wizardId").invalidateStep(wController.getView().byId("editStep"));
  }
 },

 createIdentificationDataModel: function(oWizController) {
  if (oWizController.vCurrentActionId === "createRB") {
   this.createModel(oWizController);
  } else if (oWizController.vCurrentActionId === "deleteRB") {
   this.deleteModel(oWizController);
  }
 },

 deleteModel: function(oController) {
  var vDeletedIdentification = {};
  if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
   var vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  }
  this.oResult.BP_IdentificationNumbersRel.results[vSelectedRecord]["SelectIndex"] = vSelectedRecord;
  vDeletedIdentification.body = this.oResult.BP_IdentificationNumbersRel.results[vSelectedRecord];
  vDeletedIdentification.header = "BP_IdentificationNumberCollection(BP_GUID=" + oController.sItemPath + ",IDENTIFICATIONTYPE='" +
   vDeletedIdentification.body.IDENTIFICATIONTYPE + "',IDENTIFICATIONNUMBER='" +
   vDeletedIdentification.body.IDENTIFICATIONNUMBER + "')";

  this.oResult.BP_IdentificationNumbersRel.results.splice(vSelectedRecord, 1);

  this.oIDDeleteQueryModel.push(vDeletedIdentification);
  var vLoadModel = vDeletedIdentification.body;
  vLoadModel.ChangeData = {};
  this.oIDDeleteModel = new sap.ui.model.json.JSONModel();
  this.oIDDeleteModel.setData(vLoadModel);

  //Controller hook
  var oExtIDDeleteModel = this.oController.bpHookModifyIDDeleteModel(this);
  if (oExtIDDeleteModel !== undefined) {
   this.oIDDeleteModel = oExtIDDeleteModel;
  }
 },

 createModel: function(oController) {

  var currentChanges = (JSON.parse(JSON.stringify(oController.createdArray)));
  var updatedData;
  var queryModel = {};
  if (oController.reEdit === "") {
   for (var i = 0; i < currentChanges.length;) {
    updatedData = "{";
    queryModel.index = this.vIDCreated + 1;
    queryModel.entity = currentChanges[i].entity;

    if (currentChanges[i].key !== undefined) {
     updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].key + "\",";
     updatedData = updatedData + "\"" + currentChanges[i].field + "__TXT" + "\":\"" + currentChanges[i].value + "\",";
    } else {
     updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].value + "\",";
    }

    // updatedData = updatedData + "\"" + currentChanges[i].field + "\":\"" + currentChanges[i].value + "\",";
    for (var j = i + 1; j < currentChanges.length;) {
     if (currentChanges[i].entity === currentChanges[j].entity) {
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
    this.oIDQueryModel.push(queryModel);
    // queryModel = {};
    this.oIdModel = new sap.ui.model.json.JSONModel();
    this.oIdModel.setData(queryModel.body);

    //Controller hook
    var oExtIdModel = this.oController.bpHookModifyIDCreateModel(this);
    if (oExtIdModel !== undefined) {
     this.oIdModel = oExtIdModel;
    }
   }
  } else {
   for (var r = 0; r < currentChanges.length; r++) {
    this.oIDQueryModel[this.vReEditIndex].body[currentChanges[r].field] = currentChanges[r].value;
   }
   this.oReEditModel = new sap.ui.model.json.JSONModel();
   this.oReEditModel.setData(this.oIDQueryModel[this.vReEditIndex].body);
  }
 },

 getIDModel: function() {
  return this.oIdModel;
 },

 getDeletedIDModel: function() {
  return this.oIDDeleteModel;
 },

 getPayload: function() {
  var data = this.oIdModel.getData();
  var payload = {};
  payload.IDENTIFICATIONTYPE = data.IDENTIFICATIONTYPE;
  payload.IDENTIFICATIONNUMBER = data.IDENTIFICATIONNUMBER;
 },

 performUIValidations: function(wController) {
  var idenType = sap.ui.getCore().byId("SF-BP_IdentificationNumbersRel-IDTYPE");
  var idNum = sap.ui.getCore().byId("SF-BP_IdentificationNumbersRel-IDNUMBER");

  //Mandatory Field Check
  if (idenType.getSelectedKey() === "" && idNum.getValue() !== "") {
   this.showPopUp(wController, wController.i18nBundle.getText("ID_TYPE_CHECK"));
   return false;
  }
  if (idenType.getSelectedKey() !== "" && idNum.getValue() === "") {
   this.showPopUp(wController, wController.i18nBundle.getText("ID_VALUE_CHECK"));
   return false;
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
 },

 undoIdentificationChanges: function(vActionIndex, vEntityIndex) {
  if (vActionIndex === 0) {
   for(var i=0;i<this.oController.oDupCheckData.length;){
    if(this.oController.oDupCheckData[i].createdIndex === this.oIDQueryModel[vEntityIndex].index && 
       this.oController.oDupCheckData[i].entity === "BP_IdentificationNumber"){
         this.oController.oDupCheckData.splice(i,1);
       }
     else{
      i++;
     }
   }
   this.oIDQueryModel.splice(vEntityIndex, 1);
  } else if (vActionIndex === 1) {
   this.oResult.BP_IdentificationNumbersRel.results.push(this.oIDDeleteQueryModel[vEntityIndex].body);
   this.oIDDeleteQueryModel.splice(vEntityIndex, 1);
  }
 }

};