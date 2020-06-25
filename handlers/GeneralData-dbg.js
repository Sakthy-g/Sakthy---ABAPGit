/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable */
jQuery.sap.declare("fcg.mdg.editbp.handlers.GeneralData");
jQuery.sap.require("fcg.mdg.editbp.handlers.Attachment");

fcg.mdg.editbp.handlers.GeneralData = {
 oGenDataFrag: "",
 oGenDataModel: "",
 GenDataQueryModel: [],
 ocurrentDataModel: "",
 changedArray: [],
 oController: "",
 vLangKey: "",
 resultsRoot: {},
 resultsOrg: {},
 resultsPers: {},

 clearGlobalVariables: function(oController) {
  if (this.oGenDataFrag !== undefined && this.oGenDataFrag !== "") {
   // this.oGenDataFrag.destroy();
   try {
    this.oGenDataFrag.destroy();
   } catch (err) {}
  }
  oController.oGenData = "";
  this.oGenDataFrag = "";
  this.oGenDataModel = "";
  this.GenDataQueryModel = [];
  this.ocurrentDataModel = "";
  this.changedArray = [];
  this.changedArray = [];
  this.vLangKey = "";
  this.resultsRoot = {};
  this.resultsOrg = {};
  this.resultsPers = {};
  oController.oGenData = "";
  // oController.sSearchTerm = "";
 },

 editGeneralData: function(sItemPath, sCategory, i18nBundle, oController) {
  this.oController = oController;
  var vQuery = "";
  var path = "/BP_RootCollection(BP_GUID=" + sItemPath + ")?$expand=";
  if (sCategory === "1") {
   vQuery = path + "BP_PersonRel";

  } else {
   vQuery = path + "BP_OrganizationRel";
  }
  var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it
  if (fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel === "") {
   var oDetailGeneralData = fcg.mdg.editbp.util.DataAccess.readData(vQuery, oController);

   //controller hook
   var oExtResults = oController.bpHookReadGenData(this, vQuery, oDetailGeneralData);
   if (oExtResults !== undefined) {
    oDetailGeneralData = oExtResults;
   }

   if (oDetailGeneralData.BP_OrganizationRel.BP_GUID !== undefined) {
    if (this.oGenDataFrag === "") {
     this.oGenDataFrag = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralOrg", oController);
    } else {
     this.oGenDataFrag.destroy();
     this.oGenDataFrag = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralOrg", oController);
    }
   } else if (oDetailGeneralData.BP_PersonRel.BP_GUID !== undefined) {
    if (this.oGenDataFrag === "") {
     this.oGenDataFrag = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralPerson", oController);
    } else {
     this.oGenDataFrag.destroy();
     this.oGenDataFrag = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralPerson", oController);
    }
   }
   oController.getView().byId("requestLayout").setVisible(true);
   oController.getView().byId("requestLayout").removeAllContent();
   oController.getFileUploadData("requestLayout");
   oController.getView().byId("requestLayout").addContent(this.oGenDataFrag);
   oController.getView().byId("requestLayout").setVSpacing(0);
   oModel.setData(oDetailGeneralData);
   fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel = "";
   fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel = oModel;
   fcg.mdg.editbp.handlers.GeneralData.getValueHelp(i18nBundle, sCategory, oModel, oController);
  }
  this.oGenDataFrag.setModel(fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel);
  if (sCategory === "1")
   this.setDobFormat(sap.ui.getCore().byId("SF-BP_Person-DOB"));
 },

 getValueHelp: function(i18nBundle, sCategory, oModel, oController) {
  // for getting the values helps
  var oResults = fcg.mdg.editbp.util.DataAccess.getValueHelpData();

  var oExtResults = oController.bpHookGeneralVH(this);
  if (oExtResults !== undefined) {
   oResults = oExtResults;
  }

  var sDefaultText = i18nBundle.getText("NONE");
  if (sCategory === "1") {
   var oGenModel = new sap.ui.model.json.JSONModel();
   var genItem = {
    results: [{
     KEY: "",
     TEXT: sDefaultText,
     ATTR_NAME: "SEX"
    }, {
     KEY: "1",
     TEXT: i18nBundle.getText("FEMALE"),
     ATTR_NAME: "SEX"
    }, {
     KEY: "2",
     TEXT: i18nBundle.getText("MALE"),
     ATTR_NAME: "SEX"
    }]
   };
   oGenModel.setData(genItem);
   var gender = new sap.ui.core.Item({
    key: "{KEY}",
    text: "{TEXT}"
   });
   var oGender = sap.ui.getCore().byId("SF-BP_Person-sex");
   oGender.setModel(oGenModel);
   oGender.bindItems("/results", gender);
   oGender.setSelectedKey(oModel.getData().BP_PersonRel.SEX);
   for (var i = 0; i < oResults.length; i++) {
    switch (i) {
     case 0:
      var oATModel = new sap.ui.model.json.JSONModel();
      oATModel.setData(oResults[i].data);
      var acTitleTemp = new sap.ui.core.Item({
       key: "{KEY}",
       text: "{TEXT}"
      });
      var AcdTitle = sap.ui.getCore().byId("SF-BP_Person-Title_aca1");
      AcdTitle.setModel(oATModel);
      AcdTitle.bindItems("/results", acTitleTemp);
      var emptyAcdTitle = new sap.ui.core.Item({
       key: "",
       text: sDefaultText
      });
      AcdTitle.addItem(emptyAcdTitle);
      AcdTitle.setSelectedKey(oModel.getData().BP_PersonRel.TITLE_ACA1);
      break;
     case 1:
      var oMSModel = new sap.ui.model.json.JSONModel();
      oMSModel.setData(oResults[i].data);
      var marStatusTemp = new sap.ui.core.Item({
       key: "{KEY}",
       text: "{TEXT}"
      });
      var marStatus = sap.ui.getCore().byId("SF-BP_Person-Maritalstatus");
      marStatus.setModel(oMSModel);
      marStatus.bindItems("/results", marStatusTemp);
      var emptymarStatus = new sap.ui.core.Item({
       key: "",
       text: sDefaultText
      });
      marStatus.addItem(emptymarStatus);
      marStatus.setSelectedKey(oModel.getData().BP_PersonRel.MARITALSTATUS);
      break;
     case 2:
      oController.aCorrLangValues = oResults[i].data;
      break;
     case 3:
      var oTVModel = new sap.ui.model.json.JSONModel();
      oTVModel.setData(oResults[i].data);
      var titleValuesTemp = new sap.ui.core.Item({
       key: "{KEY}",
       text: "{TEXT}"
      });
      var Title = sap.ui.getCore().byId("SF-BP_Root-titlePers");
      Title.setModel(oTVModel);
      Title.bindItems("/results", titleValuesTemp);
      var emptyTitle = new sap.ui.core.Item({
       key: "",
       text: sDefaultText
      });
      Title.addItem(emptyTitle);
      Title.setSelectedKey(oModel.getData().TITLE_KEY);
      break;
    }
   }

  } else {
   for (var j = 4; j < oResults.length; j++) {
    switch (j) {
     case 4:
      var oTitleOrgModel = new sap.ui.model.json.JSONModel();
      oTitleOrgModel.setData(oResults[j].data);
      var titleOrgValuesTemp = new sap.ui.core.Item({
       key: "{KEY}",
       text: "{TEXT}"
      });
      var TitleOrg = sap.ui.getCore().byId("SF-BP_Root-titleOrg");
      TitleOrg.setModel(oTitleOrgModel);
      TitleOrg.bindItems("/results", titleOrgValuesTemp);
      var emptyTitle = new sap.ui.core.Item({
       key: "",
       text: sDefaultText
      });
      TitleOrg.addItem(emptyTitle);
      TitleOrg.setSelectedKey(oModel.getData().TITLE_KEY);
      break;
    }
   }
  }
 },

 onName1Change: function(oEvent) {
  var name1 = oEvent.getSource().getValue();
  if (name1.replace(/^[ ]+|[ ]+$/g, "") === "") {
   oEvent.getSource().setValue("");
   oEvent.getSource().setValueState("Error");
  } else {
   oEvent.getSource().setValueState("None");
  }
  this.onChange(oEvent);
 },

 onName2Change: function(oEvent) {
  var name2 = oEvent.getSource().getValue();
  if (name2.replace(/^[ ]+|[ ]+$/g, "") === "") {
   oEvent.getSource().setValue("");
  }
  this.onChange(oEvent);
 },

 onDobChange: function(oEvent) {
  var date = oEvent.getSource();
  var dateValue = date.getDateValue();
  var value = date.getValue();
  var spaceDate = value.replace(/^[ ]+|[ ]+$/g, "");
  if (spaceDate === "") {
   date.setValueState("None");
   date.setValue(spaceDate);
   return;
  }
  var oFormatDateValue = sap.ui.core.format.DateFormat.getDateInstance({
   pattern: "dd.MM.yyyy"
  });
  var vDateValue = oFormatDateValue.format(new Date(dateValue));

  var locale = new sap.ui.core.Locale(fcg.mdg.editbp.handlers.GeneralData.oController.getOwnerComponent().getModel("i18n").getResourceBundle()
   .sLocale);
  var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance(locale);
  var format = "";
  if (vDateValue === value) {
   format = oDateFormat.format(new Date(dateValue));
   value = dateValue;
  } else {
   format = oDateFormat.format(new Date(value));
  }

  if (format.indexOf("Na") > -1 || format === "") {
   date.setValueState("Error");
   date.setPlaceholder(oDateFormat.oFormatOptions.pattern);
  } else {
   date.setDateValue(new Date(value));
   date.setValueState("None");
   date.setValue(format);
  }

  // To check whether the entered date is less than the
  // today's date
  var currDate = new Date();
  var currDateValue = Number(currDate.getFullYear() + ("0" + (currDate.getMonth() + 1)).slice(-2) + ("0" + currDate.getDate()).slice(-2));
  var enterDate = new Date(value);
  var enterDateValue = Number(enterDate.getFullYear() + ("0" + (enterDate.getMonth() + 1)).slice(-2) + ("0" + enterDate.getDate()).slice(-
   2));

  if (enterDateValue > currDateValue) {
   date.setValueState("Error");
   //this.vInvalidDate = "X";
  } else {
   //this.vInvalidDate = ""
   this.onChange(oEvent);
  }
 },

 setDobFormat: function(oField) {
  if (oField.getValue() !== "") {
   var dateValue = oField.getDateValue();
   // var oFormatDateValue = sap.ui.core.format.DateFormat.getDateInstance({
   //            pattern: "dd.MM.yyyy"
   // });
   // var vDateValue = oFormatDateValue.format(new Date(dateValue));
   var locale = new sap.ui.core.Locale(fcg.mdg.editbp.handlers.GeneralData.oController.getOwnerComponent().getModel("i18n").getResourceBundle()
    .sLocale);
   var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance(locale);
   var value = oDateFormat.format(new Date(dateValue));
   oField.setValue(value);
  }
 },

 onST1Change: function(oControlEvent) {
  oControlEvent.getSource().setValue(oControlEvent.getSource().getValue().toUpperCase());
  var searchTerm1 = oControlEvent.getSource().getValue();
  if (searchTerm1.replace(/^[ ]+|[ ]+$/g, "") === "") {
   oControlEvent.getSource().setValue("");
  }
  this.onChange(oControlEvent);
 },

 onST2Change: function(oControlEvent) {
  oControlEvent.getSource().setValue(oControlEvent.getSource().getValue().toUpperCase());
  var searchTerm2 = oControlEvent.getSource().getValue();
  if (searchTerm2.replace(/^[ ]+|[ ]+$/g, "") === "") {
   oControlEvent.getSource().setValue("");
  }
  this.onChange(oControlEvent);
 },

 onTitleChange: function(oControlEvent) {
  var value = oControlEvent.getSource().getSelectedItem().getText();
  if (oControlEvent.getSource().getId() === "SF-BP_Root-titlePers" && value !== "None") {
   var oGender = sap.ui.getCore().byId("SF-BP_Person-sex");
   if (oControlEvent.getSource().getSelectedItem().getKey() === "0001") {
    if (oGender.getSelectedKey() !== "1") {
     oGender.setSelectedKey("1");
     oGender.fireEvent("change");
    }
   } else {
    if (oGender.getSelectedKey() !== "2") {
     oGender.setSelectedKey("2");
     oGender.fireEvent("change");
    }
   }
  }
  this.onChange(oControlEvent);
 },

 onGenderChange: function(oControlEvent) {
  var value = oControlEvent.getSource().getSelectedItem().getText();
  if (oControlEvent.getSource().getId() === "SF-BP_Person-sex" && value !== "None") {
   var oTitle = sap.ui.getCore().byId("SF-BP_Root-titlePers");
   if (oControlEvent.getSource().getSelectedItem().getKey() === "1") {
    if (oTitle.getSelectedKey() !== "0001") {
     oTitle.setSelectedKey("0001");
     oTitle.fireEvent("change");
    }
   } else {
    if (oTitle.getSelectedKey() !== "0002") {
     oTitle.setSelectedKey("0002");
     oTitle.fireEvent("change");
    }
   }
  }
  this.onChange(oControlEvent);
 },

 onCorsLangChange: function(oControlEvent) {
  var oFragmentId = oControlEvent.getSource().getId().split("-");
  oFragmentId = oFragmentId[0];
  sap.ui.getCore().byId("SF-BP_Person-CLANGKey").setValue(sap.ui.getCore().byId("SF-BP_Person-CLANGKey").getValue()
   .toUpperCase());

  var oCorsLang = sap.ui.getCore().byId("SF-BP_Person-CLANGKey");
  var corsLang = oCorsLang.getValue();
  var corsLangNoSpaces = corsLang.replace(/^[ ]+|[ ]+$/g, "");
  corsLangNoSpaces = corsLangNoSpaces.toUpperCase();
  var oCorsLangName = sap.ui.getCore().byId("SF-BP_Person-CLANGText");

  if (corsLangNoSpaces !== "") {
   //-------------- Existence Check -------------------------------
   var langExists = false;
   for (var i = 0; i < this.aCorrLangValues.results.length; i++) {
    if (this.aCorrLangValues.results[i].KEY === corsLangNoSpaces) {
     fcg.mdg.editbp.handlers.GeneralData.vLangKey = this.aCorrLangValues.results[i].ATTR_VALUE;
     if (oCorsLang.getValue() !== "") {
      oCorsLangName.setValue(this.aCorrLangValues.results[i].TEXT);
     }
     langExists = true;
     this.onChange(oControlEvent);
     oCorsLangName.fireEvent("change");
     break;
    }
   }
   if (langExists === false) {
    //If correspondence language is not found, raise an error
    oCorsLangName.setValue();
    oCorsLang.setValueState("Error");
    var sFieldName = "";
    if (this.bpCategory === "1") {
     sFieldName = this.i18nBundle.getText("CLANG");
    }
    if (this.bpCategory === "2") {
     sFieldName = this.i18nBundle.getText("LANGUAGE");
    }
    var errorMsg = sFieldName + " " + oCorsLang.getValue() + " " + this.i18nBundle.getText("NO_EXISTENCE");
    oCorsLang.setValueStateText(errorMsg);
   }
  } else {
   oCorsLang.setValue();
   oCorsLangName.setValue();
   this.onChange(oControlEvent);
   oCorsLangName.fireEvent("change");
  }

 },

 onCLangVH: function(oControlEvent) {
  var oGlobalInstance = this;

  if (sap.ui.getCore().byId("CorrespodingLangDialog") !== undefined) {
   sap.ui.getCore().byId("CorrespodingLangDialog").destroy();
  }

  var oSelectDialog = new sap.m.SelectDialog({
   id: "CorrespodingLangDialog",
   title: this.i18nBundle.getText("LANG"),
   noDataText: this.i18nBundle.getText("LOAD") + "...",
   confirm: function(oEvent) {
    sap.ui.getCore().byId("SF-BP_Person-CLANGKey").setValueState("None");
    sap.ui.getCore().byId("SF-BP_Person-CLANGText").setValueStateText("");
    sap.ui.getCore().byId("SF-BP_Person-CLANGKey").setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    sap.ui.getCore().byId("SF-BP_Person-CLANGText").setValue(oEvent.getParameters().selectedItem.getProperty("title"));
    // oGlobalInstance.onChange(oControlEvent);
    sap.ui.getCore().byId("SF-BP_Person-CLANGKey").fireEvent("change");
    sap.ui.getCore().byId("SF-BP_Person-CLANGText").fireEvent("change");
   },
   search: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, "");
    var oItems = oSelectDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
      var sLangKey = oItems[i].getBindingContext().getProperty("TEXT");
      var sLangDesc = oItems[i].getBindingContext().getProperty("KEY");
      //     if ( sValue !== sLangKey.toUpperCase() && sValue !== sLangDesc.toUpperCase() )
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
      var sLangKey = oItems[i].getBindingContext().getProperty("TEXT");
      var sLangDesc = oItems[i].getBindingContext().getProperty("KEY");
      //     if ( sValue !== sLangKey.toUpperCase() && sValue !== sLangDesc.toUpperCase() )
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

  if (this.aCorrLangValues !== null && this.aCorrLangValues.results.length > 0) {
   var oItemTemplate = new sap.m.StandardListItem({
    title: "{TEXT}",
    description: "{KEY}",
    active: true
   });
   var oInputHelpModel = new sap.ui.model.json.JSONModel();
   oInputHelpModel.setData(this.aCorrLangValues);
   oSelectDialog.setModel(oInputHelpModel);
   oSelectDialog.setGrowingThreshold(this.aCorrLangValues.results.length);
   oSelectDialog.bindAggregation("items", "/results", oItemTemplate);
  } else {
   oSelectDialog.setNoDataText(oGlobalInstance.i18nBundle.getText("NO_DATA"));
  }
  oSelectDialog.open();
 },

 setWizardTitle: function(oController, oModel) {
  var wizardPageTitle = oController.getView().byId("wizardContentPage").getTitle();
  var titleText = wizardPageTitle + " : " + oModel.getData().DESCRIPTION + "(" + oModel.getData()
   .PARTNER + ")";
  oController.getView().byId("wizardContentPage").setTitle(titleText);
 },

 createGenDataModel: function(oController) {
  var changesetPrepare = (JSON.parse(JSON.stringify(fcg.mdg.editbp.handlers.GeneralData.changedArray)));
  var newChangeSet = {};
  var ChangeData = [];
  var mAttribute = "";
  // var resultsRoot = {};
  // var resultsOrg = {};
  // var resultsPers = {};
  var vHeader = "";
  //changeset preparation 
  for (var k = 0; k < changesetPrepare.length; k++) {
   newChangeSet.Entity = changesetPrepare[k].entity;
   if (changesetPrepare[k].key !== undefined) {
    newChangeSet.Attribute = changesetPrepare[k].field + "__TXT";
   } else {
    newChangeSet.Attribute = changesetPrepare[k].field;
   }
   newChangeSet.EntityAction = "U";
   newChangeSet.NewValue = changesetPrepare[k].value;
   newChangeSet.header = changesetPrepare[k].entityKey;
   ChangeData.push(newChangeSet);
   newChangeSet = {};
   if (changesetPrepare[k].key !== undefined) {
    var keyField = changesetPrepare[k].field;
    newChangeSet.Entity = changesetPrepare[k].entity;
    newChangeSet.Attribute = keyField;
    newChangeSet.EntityAction = "U";
    newChangeSet.NewValue = changesetPrepare[k].key;
    newChangeSet.header = changesetPrepare[k].entityKey;
    ChangeData.push(newChangeSet);
    newChangeSet = {};
   }
  }
  for (var i = 0; i < ChangeData.length; i++) {
   if (ChangeData[i].Attribute !== undefined && ChangeData[i].Entity === "BP_Root") {
    var mAttribute = "/" + ChangeData[i].Attribute;
    if (mAttribute === "/TITLE_KEY__TXT" && ChangeData[i].NewValue === "None") {
     ChangeData[i].NewValue = "";
    }
    fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty(mAttribute, ChangeData[i].NewValue);
    this.resultsRoot[ChangeData[i].Attribute] = ChangeData[i].NewValue;
    vHeader = ChangeData[i].header;
   }
   if (ChangeData[i].Attribute !== undefined) {
    if (ChangeData[i].Entity === "BP_Organization") {
     var mAttribute = "/" + ChangeData[i].Entity + "Rel/" + ChangeData[i].Attribute;
     fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty(mAttribute, ChangeData[i].NewValue);
     this.resultsOrg[ChangeData[i].Attribute] = ChangeData[i].NewValue;
     vHeader = ChangeData[i].header;
    } else if (ChangeData[i].Entity === "BP_Person") {
     var mAttribute = "/" + ChangeData[i].Entity + "Rel/" + ChangeData[i].Attribute;
     if (mAttribute === "/BP_PersonRel/SEX__TXT" || mAttribute === "/BP_PersonRel/TITLE_ACA1__TXT" || mAttribute ===
      "/BP_PersonRel/MARITALSTATUS__TXT") {
      if (ChangeData[i].NewValue === "None") {
       ChangeData[i].NewValue = "";
      }
     }
     if (mAttribute === "/BP_PersonRel/CORRESPONDLANGUAGEISO") {
      fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty("/BP_PersonRel/CORRESPONDLANGUAGE", fcg.mdg.editbp.handlers.GeneralData
       .vLangKey);
      this.resultsPers["CORRESPONDLANGUAGE"] = fcg.mdg.editbp.handlers.GeneralData.vLangKey;
     }
     fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty("/BP_PersonRel/BIRTHDATE", sap.ui.getCore().byId(
      "SF-BP_Person-DOB").getValue());
     fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty(mAttribute, ChangeData[i].NewValue);
     this.resultsPers[ChangeData[i].Attribute] = ChangeData[i].NewValue;
     vHeader = ChangeData[i].header;
    }
   }
  }

  fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().ChangeData = this.resultsRoot;
  fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().BP_OrganizationRel.ChangeData = this.resultsOrg;
  fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().BP_PersonRel.ChangeData = this.resultsPers;
  // oController.sSearchTerm = fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().SEARCHTERM1;
  if (oController.reEdit !== "X") {
   this.createSummaryData(this.resultsRoot, this.resultsPers, this.resultsOrg, vHeader);
  } else {
   this.GenDataQueryModel = [];
   this.createSummaryData(this.resultsRoot, this.resultsPers, this.resultsOrg, vHeader);
  }

 },

 createSummaryData: function(resultsRoot, resultsPers, resultsOrg, vHeader) {
  var queryModel = {};
  if (Object.getOwnPropertyNames(resultsRoot).length !== 0) {
   queryModel.header = vHeader;
   queryModel.entity = "BP_Root";
   queryModel.body = resultsRoot;
   this.GenDataQueryModel.push(queryModel);
   queryModel = {};
  }
  if (Object.getOwnPropertyNames(resultsPers).length !== 0) {
   queryModel.header = vHeader;
   queryModel.entity = "BP_Person";
   queryModel.body = resultsPers;
   this.GenDataQueryModel.push(queryModel);
   queryModel = {};
  } else if (Object.getOwnPropertyNames(resultsOrg).length !== 0) {
   queryModel.header = vHeader;
   queryModel.entity = "BP_Organization";
   queryModel.body = resultsOrg;
   this.GenDataQueryModel.push(queryModel);
   queryModel = {};
  }
 },

 getGenDataModel: function() {
  // create a new model
  var tempModel = new sap.ui.model.json.JSONModel();

  // make a copy of the data
  var tempData = JSON.parse(JSON.stringify(fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData()));
  tempModel.setData(tempData);

  return tempModel;
 },

 setChangedArray: function(oEvent, newvalue, entity, oController) {
  if (oEvent.getSource().mBindingInfos.value !== undefined) {
   if (entity === "BP_Root") {
    newvalue.field = (oEvent.getSource().mBindingInfos.value.binding.sPath).split("/")[1];
   } else {
    newvalue.field = (oEvent.getSource().mBindingInfos.value.binding.sPath).split("/")[2];
   }
  } else {
   newvalue.field = oEvent.getSource().getModel().getData().results[0].ATTR_NAME;
  }
  oController.currentEntityKey = "(BP_GUID=" + oController.sItemPath + ")";

  newvalue.entityKey = oController.currentEntityKey;
  for (var i = 0; i < fcg.mdg.editbp.handlers.GeneralData.changedArray.length; i++) {
   if (fcg.mdg.editbp.handlers.GeneralData.changedArray[i].field == newvalue.field) {
    if (oEvent.getParameters().selectedItem !== undefined) {
     fcg.mdg.editbp.handlers.GeneralData.changedArray[i].key = newvalue.key;
     fcg.mdg.editbp.handlers.GeneralData.changedArray[i].value = newvalue.value;
    } else {
     fcg.mdg.editbp.handlers.GeneralData.changedArray[i].value = newvalue.value;
    }
    return;
   }
  }
  fcg.mdg.editbp.handlers.GeneralData.changedArray.push(newvalue);
 },

 changeDobFormat: function(value) {
  var oFormatDateValue = sap.ui.core.format.DateFormat.getDateInstance({
   pattern: "dd.MM.yyyy"
  });
  var vDateValue = oFormatDateValue.format(new Date(value));
  var locale = new sap.ui.core.Locale(fcg.mdg.editbp.handlers.GeneralData.oController.getOwnerComponent().getModel("i18n").getResourceBundle()
   .sLocale);
  var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance(locale);
  return oDateFormat.format(new Date(vDateValue));
 },

 setDispFragTitle: function(oController, layout) {
  var oForm = layout.getContent()[0];
  var field = oForm.getToolbar().getContent()[1];
  field.setText(" (" + oController.i18nBundle.getText("CHANGE") + ")").addStyleClass("text_bold");
 },

 undoGenDataChanges: function(vActionIndex, vEntityIndex) {
  //Remove the changed record from Duplicate check source Array
  for (i = 0; i < this.oController.oDupCheckData.length;) {
   if (this.oController.oDupCheckData[i].entity === "BP_Organization" ||
    this.oController.oDupCheckData[i].entity === "BP_Person") {
    this.oController.oDupCheckData.splice(i, 1);
   } else {
    i++;
   }
  }


  //in case of change and delete revert the entry in the Entityvalue array which sets the review changes button

  for (i = 0; i < this.oController.aEntityValue.length; i++) {
   if ("OrgRB" === this.oController.aEntityValue[i].split("-")[0] 
      || "PersRB" === this.oController.aEntityValue[i].split("-")[0] ) {
    this.oController.aEntityValue.splice(i, 1);
    break;
   }
  }


  this.GenDataQueryModel = [];
  fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel = "";
  this.oController.oGenData = "";
  fcg.mdg.editbp.handlers.GeneralData.changedArray = [];
  this.oController.aEntityValue.splice(vEntityIndex, 1);
 },

 createSubmitQuery: function(oGenDataQueryModel) {
  for (var i = 0; i < oGenDataQueryModel.length; i++) {
   if (oGenDataQueryModel[i].entity === "BP_Person") {
    for (var l = 0; l < Object.keys(oGenDataQueryModel[i].body).length; l++) {
     if (Object.keys(oGenDataQueryModel[i].body)[l] === "BIRTHDATE") {
      var value = oGenDataQueryModel[i].body[Object.keys(oGenDataQueryModel[i].body)[l]];
      value = new Date(value);
      oGenDataQueryModel[i].body["BIRTHDATE"] = value;
     }
     if (Object.keys(oGenDataQueryModel[i].body)[l] === "CORRESPONDLANGUAGE__TXT") {
      delete oGenDataQueryModel[i].body.CORRESPONDLANGUAGE__TXT;
     }
    }
   }
  }

  var oExtResults = this.oController.bpHookGenCreateSubmitQuery(oGenDataQueryModel);
  if (oExtResults !== undefined) {
   oGenDataQueryModel = oExtResults;
  }

  return oGenDataQueryModel;
 },

 performOrgUIValidations: function(oController) {
  var errorMsg = "";
  var title = sap.ui.getCore().byId("SF-BP_Organization-name1");
  if (title.getValueState() === "Error") {
   errorMsg = oController.i18nBundle.getText("ERROR_CHECK");
   this.showPopUp(oController, errorMsg);
   return false;
  }
  return true;
 },

 performUIValidations: function(oController) {
  var errorMsg = "";
  var title = sap.ui.getCore().byId("SF-BP_Person-FName");
  if (title.getValueStateText() === "Error") {
   errorMsg = oController.i18nBundle.getText("ERROR_TITLE");
   this.showPopUp(oController, errorMsg);
   return false;
  }
  var personFname = sap.ui.getCore().byId("SF-BP_Person-FName");
  if (personFname.getValueState() === "Error") {
   errorMsg = oController.i18nBundle.getText("ERROR_FNAME");
   this.showPopUp(oController, errorMsg);
   return false;
  }

  var personLname = sap.ui.getCore().byId("SF-BP_Person-LName");
  if (personLname.getValueState() === "Error") {
   errorMsg = oController.i18nBundle.getText("ERROR_LNAME");
   this.showPopUp(oController, errorMsg);
   return false;
  }

  var corsLang = sap.ui.getCore().byId("SF-BP_Person-CLANGKey");
  if (corsLang.getValueState() === "Error") {
   errorMsg = oController.i18nBundle.getText("ERROR_CLANG");
   this.showPopUp(oController, errorMsg);
   return false;
  }

  var corsLangText = sap.ui.getCore().byId("SF-BP_Person-CLANGText");
  if (corsLang.getValueState() === "Error") {
   errorMsg = oController.i18nBundle.getText("ERROR_CLANGTEXT");
   this.showPopUp(oController, errorMsg);
   return false;
  }

  var date = sap.ui.getCore().byId("SF-BP_Person-DOB");
  if (date.getValueState() === "Error") {
   errorMsg = oController.i18nBundle.getText("ERROR_DOB");
   this.showPopUp(oController, errorMsg);
   return false;
  }
 },

 showPopUp: function(oController, txt) {
  var dialog = new sap.m.Dialog({
   title: oController.i18nBundle.getText("ERROR"),
   type: "Message",
   state: oController.i18nBundle.getText("ERROR"),
   content: [new sap.m.Text({
    text: txt
   })],
   beginButton: new sap.m.Button({
    text: oController.i18nBundle.getText("OK"),
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