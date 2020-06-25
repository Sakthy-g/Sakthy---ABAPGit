/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.TaxNumbers");

fcg.mdg.editbp.handlers.TaxNumbers = {
 oController: "",
 changedArray: [],
 taxnummodel: "",
 oTaxNumberLayout: "",
 valueHelpFlag: "",
 i18nModel: "",
 taxCreateModel: [],
 oTaxModel: "",
 oTaxResults: "",
 TaxDltQueryModel: [],
 oDltTaxModel: "",
 oChangeTaxModel: "",
 TaxChngQueryModel: [],
 oTaxChangeArray: [], // change Array
 oTaxDelArray: [], // Delete Array
 vRIndex: "",
 vDelResetFlag: "",
 vvDelTaxNum: "",

 clearGlobalVariables: function(wController) {
  this.valueHelpFlag = "";
  this.changedArray = [];
  this.taxnummodel = "";
  this.taxCreateModel = [];
  this.oTaxModel = "";
  this.oTaxResults = "";
  this.TaxDltQueryModel = [];
  this.oDltTaxModel = "";
  this.oChangeTaxModel = "";
  this.TaxChngQueryModel = [];
  this.oTaxChangeArray = [];
  this.oTaxDelArray = [];
  this.vRIndex = "";
  this.vDelResetFlag = "";
  this.vvDelTaxNum = "";

 },

 getTaxNumData: function(wController) {
  this.oController = wController;
  var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
  var vQuery = path + "BP_TaxNumbersRel";
  var result = fcg.mdg.editbp.util.DataAccess.readData(vQuery, wController);
  fcg.mdg.editbp.util.DataAccess.setTNResults(result);
  if (wController.vContEditTax === "" || this.oTaxResults === "") { //IF continue editting is selected then we should use old data.
   this.oTaxResults = "";
   this.oTaxChangeArray.length = 0;
   this.oTaxDelArray.length = 0;
   this.oTaxResults = result;
   var vChngTax = "";
   var vDelTax = "";
   for (var i = 0; i < this.oTaxResults.BP_TaxNumbersRel.results.length; i++) {
    vChngTax = {};
    vChngTax.RINDEX = null;
    vChngTax.index = i;
    vChngTax.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
    vChngTax.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
    vChngTax.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
    vChngTax.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;

    vDelTax = {};
    vDelTax.RINDEX = null;
    vDelTax.index = i;
    vDelTax.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
    vDelTax.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
    vDelTax.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
    vDelTax.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;

    this.oTaxChangeArray.push(vChngTax);
    this.oTaxDelArray.push(vDelTax);

   }
  }
  this.setActionLayout(this.oTaxResults);

  if (this.oTaxChangeArray.length === 0) {
   sap.ui.getCore().byId("changeRB").setEnabled(false);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(-1);
  }

  if (this.oTaxDelArray.length === 0) {
   sap.ui.getCore().byId("deleteRB").setEnabled(false);
  }
  // Controller Hook method call
  var oExtResults = this.oController.bpHookReadTaxData(this, vQuery, result);
  if (oExtResults !== undefined) {
   result = oExtResults;
  }

 },

 setActionLayout: function(result) {
  this.oController.getView().byId("entityStep").setNextStep(this.oController.getView().byId("actionStep"));
  if (this.oController.oActionLayout === "") {
   this.oController.oActionLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectAction', this.oController);
  }
  this.oController.getView().byId("actionLayout").setVisible(true);
  this.oController.getView().byId("actionLayout").addContent(this.oController.oActionLayout);
  sap.ui.getCore().byId("changeRB").setVisible(true);
  this.oController.setRadioButtonText();
  if (result.BP_TaxNumbersRel.results.length === 0) {
   sap.ui.getCore().byId("changeRB").setEnabled(false);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(-1);
   sap.ui.getCore().byId("deleteRB").setEnabled(false);
  } else {
   sap.ui.getCore().byId("changeRB").setEnabled(true);
   sap.ui.getCore().byId("actionRBG").setSelectedIndex(1);
   sap.ui.getCore().byId("deleteRB").setEnabled(true);
  }
  this.oController.setActionView("actionStep", "select_action");
 },

 createTaxNumber: function(oController) {

  oController.getView().byId("actionStep").setNextStep(oController.getView().byId("editStep"));
  if (oController.oCommunicationLayout !== "" && oController.oCommunicationLayout !== undefined) {
   try {
    oController.oCommunicationLayout.destroy();
   } catch (err) {}
   oController.oCommunicationLayout = "";
  }
  if (oController.oCommunicationListRBG !== "" && oController.oCommunicationListRBG !== undefined) {
   try {
    oController.oCommunicationListRBG.destroy();
   } catch (err) {}
   oController.oCommunicationListRBG = "";
  }
  if (oController.oCommunicationLayout === "") {
   oController.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', oController);
  }

  oController.getView().byId("editLayout").removeAllContent();
  //Adding Reason for Request Fragment
  oController.getFileUploadData("editLayout");
  oController.getView().byId("editLayout").addContent(oController.oCommunicationLayout);
  if (oController.reEdit === "X") {
   sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setValue(this.taxCreateModel[oController.vTaxEntityIndex].body["TAXTYPE"]);
   sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").setValue(this.taxCreateModel[oController.vTaxEntityIndex].TAXTYPE__TXT);
   if (this.taxCreateModel[oController.vTaxEntityIndex].body["TAXNUMXL"] !== undefined) {
    sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(this.taxCreateModel[oController.vTaxEntityIndex].body["TAXNUMXL"]);
   } else {
    sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(this.taxCreateModel[oController.vTaxEntityIndex].body["TAXNUMBER"]);
   }
  }
 },

 createTNModel: function(taxcat, wController) {
  var model = new Object();
  model.TAXTYPE = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
  model.TAXTYPE__TXT = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
  var taxNum = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
  var taxNumLen = taxNum.length;
  if (taxNumLen <= 20) {
   model.TAXNUMBER = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
  } else {
   model.TAXNUMXL = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
  }
  //create Tax models
  var queryModel = {};
  queryModel.entity = "BP_TaxNumbers";
  queryModel.TAXTYPE__TXT = model.TAXTYPE__TXT;
  queryModel.body = {};
  queryModel.body["TAXTYPE"] = model.TAXTYPE;
  if (taxNumLen <= 20) {
   queryModel.body["TAXNUMBER"] = model.TAXNUMBER;
  } else if (taxNumLen > 20) {
   queryModel.body["TAXNUMXL"] = model.TAXNUMXL;
  }
  if (wController.reEdit === "X") {
   this.taxCreateModel.splice(wController.vTaxEntityIndex, 1, queryModel);
  } else {
   this.taxCreateModel.push(queryModel);
  }

  var oDataModel = {};
  oDataModel.entity = "BP_TaxNumbers";
  oDataModel.body = {};
  oDataModel.body["TAXTYPE"] = model.TAXTYPE;
  if (taxNumLen <= 20) {
   oDataModel.body["TAXNUMBER"] = model.TAXNUMBER;
  } else {
   oDataModel.body["TAXNUMBER"] = model.TAXNUMXL;
  }
  oDataModel.body["TAXDESC"] = model.TAXTYPE__TXT;

  this.oTaxModel = new sap.ui.model.json.JSONModel();
  this.oTaxModel.setData(oDataModel.body);

  // Controller Hook method call
  var oExtResults = wController.bpHookCreateTaxData(this, model);
  if (oExtResults !== undefined) {
   model = oExtResults;
  }
  this.taxnummodel = model;
  return model;
 },

 editTaxNum: function(oController) {
  var formControlData = "";
  var vtaxnum = "";
  var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it

  this.oController = oController;
  //single senerio
  if (oController.oCommunicationLayout !== "" && oController.oCommunicationLayout !== undefined) {
   try {
    oController.oCommunicationLayout.destroy();
   } catch (err) {}
   oController.oCommunicationLayout = "";
  }

  if (oController.oCommunicationLayout === "") {
   oController.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', oController);
  }

  //Multiple senerio
  if (oController.oCommunicationListRBG !== "" && oController.oCommunicationListRBG !== undefined) {
   try {
    oController.oCommunicationListRBG.destroy();
   } catch (err) {}
   oController.oCommunicationListRBG = "";
  }

  if (oController.oCommunicationListRBG === "") {
   oController.oCommunicationListRBG = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntityInstance', oController);
  }

  if (this.oTaxChangeArray.length === 1) {
   oController.getView().byId("actionStep").setNextStep(oController.getView().byId("editStep"));
   oController.getView().byId("editLayout").setVisible(true);
   oController.getView().byId("editLayout").removeAllContent();
   //Adding Reason for Request Fragment
   oController.getFileUploadData("editLayout");
   oController.getView().byId("editLayout").addContent(oController.oCommunicationLayout);
   formControlData = sap.ui.getCore().byId("editTaxForm");
   oModel.setData(this.oTaxChangeArray[0]);
   formControlData.setModel(oModel);
   oController.currentDataModel = oModel;
   if (oController.vContEditTax === "") {

    if (this.oTaxChangeArray[0].TAXNUMBER !== "") {
     vtaxnum = this.oTaxChangeArray[0].TAXNUMBER;
    } else {
     vtaxnum = this.oTaxChangeArray[0].TAXNUMXL;
    }

   } else if (oController.vContEditTax === "X") {

    if (this.oTaxChangeArray[0].TAXNUMBER !== "") {
     vtaxnum = this.oTaxChangeArray[0].TAXNUMBER;
    } else {
     vtaxnum = this.oTaxChangeArray[0].TAXNUMXL;
    }

   }
   sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(vtaxnum);
   sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setShowValueHelp(false);
   sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setEnabled(false);
   oController.currentDataModel = oModel;

   // tax number selected index should be set to zero in case of change tax number has only one record
   var oTaxListRBG = sap.ui.getCore().byId("selectDataListRBG");
   oTaxListRBG.setSelectedIndex(0);
  } else {
   var strResults = {
    dataitems: []
   };
   oController.getView().byId("actionStep").setNextStep(oController.getView().byId("selectEntityInstanceStep"));
   oController.getView().byId("selectEntityInstanceLayout").setVisible(true);
   oController.getView().byId("selectEntityInstanceLayout").addContent(oController.oCommunicationListRBG);
   for (var i = 0; i < this.oTaxChangeArray.length; i++) {
    var vTaxAttribute = this.oTaxChangeArray[i];
    var oDataItems = {
     "RBText": fcg.mdg.editbp.util.Formatter.createTaxRecordsToProcess(vTaxAttribute)
    };
    strResults.dataitems.push(oDataItems);
   }

   var oTaxList_RBG = sap.ui.getCore().byId("selectDataListRBG");
   oModel.setData(strResults);
   oTaxList_RBG.setModel(oModel);
   oTaxList_RBG.setSelectedIndex(-1);
  }
 },

 editmultiTaxNumber: function(oController) {
  var vtaxnum = "";
  if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
   var vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  }
  this.oController = oController;
  var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it

  if (oController.oCommunicationLayout !== "" && oController.oCommunicationLayout !== undefined) {
   try {
    oController.oCommunicationLayout.destroy();
   } catch (err) {}
   oController.oCommunicationLayout = "";
  }

  if (oController.oCommunicationLayout === "") {
   oController.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', oController);
  }

  oController.getView().byId("selectEntityInstanceStep").setNextStep(oController.getView().byId("editStep"));
  oController.getView().byId("editLayout").setVisible(true);
  oController.getView().byId("editLayout").removeAllContent();
  //Adding Reason for Request Fragment
  oController.getFileUploadData("editLayout");
  oController.getView().byId("editLayout").addContent(oController.oCommunicationLayout);
  var formControlData = sap.ui.getCore().byId("editTaxForm");
  oModel.setData(this.oTaxChangeArray[vSelectedRecord]);
  formControlData.setModel(oModel);
  oController.currentDataModel = oModel;
  if (this.oTaxChangeArray[vSelectedRecord].TAXNUMBER !== "") {
   vtaxnum = this.oTaxChangeArray[vSelectedRecord].TAXNUMBER;
  } else {
   vtaxnum = this.oTaxChangeArray[vSelectedRecord].TAXNUMXL;
  }
  sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(vtaxnum);
  sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setShowValueHelp(false);
  sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setEnabled(false);
  oController.currentDataModel = oModel;
 },

 singleTaxRecordChangeModel: function(oController) {
  var taxNum = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
  var taxNumLen = taxNum.length;
  var queryModel = {};
  queryModel.header = "BP_TaxNumberCollection(BP_GUID=" + oController.sItemPath + ",TAXTYPE='" + this.oTaxChangeArray[0].TAXTYPE + "')";
  queryModel.index = this.oTaxChangeArray[0].index;
  queryModel.body = {};
  if (taxNumLen <= 20) {
   queryModel.body["TAXNUMBER"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
   queryModel.body["TAXNUMXL"] = "";
  } else if (taxNumLen > 20) {
   queryModel.body["TAXNUMXL"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
   queryModel.body["TAXNUMBER"] = "";
  }

  var oDataModel = {};
  oDataModel.entity = "BP_TaxNumbers";
  oDataModel.body = {};
  oDataModel.body["TAXTYPE"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
  if (taxNumLen <= 20) {
   oDataModel.body["TAXNUMBER"] = queryModel.body["TAXNUMBER"];
  } else if (taxNumLen > 20) {
   oDataModel.body["TAXNUMBER"] = queryModel.body["TAXNUMXL"];
  }
  oDataModel.body["changeData"] = {};
  oDataModel.body.changeData["TAXNUMBER"] = queryModel.body["TAXNUMBER"];
  oDataModel.body["TAXDESC"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
  this.oChangeTaxModel = new sap.ui.model.json.JSONModel();
  this.oChangeTaxModel.setData(oDataModel.body);
  if (taxNumLen <= 20) {
   this.oTaxChangeArray[0].TAXNUMBER = queryModel.body["TAXNUMBER"];
   this.oTaxChangeArray[0].TAXNUMXL = "";
  } else if (taxNumLen > 20) {
   this.oTaxChangeArray[0].TAXNUMXL = queryModel.body["TAXNUMXL"];
   this.oTaxChangeArray[0].TAXNUMBER = "";
  }

  var reviewLen = "";
  reviewLen = oController._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent().length;

  if (oController.vContEditTax === "") {
   if (this.oTaxChangeArray[0].RINDEX === null) {
    this.oTaxChangeArray[0].RINDEX = reviewLen;
   } else {
    reviewLen = this.oTaxChangeArray[0].RINDEX;
   }
   if (oController.reEdit === "X") {
    if (taxNumLen <= 20) {
     this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMBER"] = queryModel.body["TAXNUMBER"];
     this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMXL"] = "";
    } else if (taxNumLen > 20) {
     this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMBER"] = "";
     this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMXL"] = queryModel.body["TAXNUMXL"];
    }

   } else {
    this.TaxChngQueryModel.push(queryModel);
   }
   this.oChangeTaxModel.setData(oDataModel.body);
  } else if (oController.vContEditTax === "X") {
   this.vRIndex = "";
   if (this.oTaxChangeArray[0].RINDEX !== null && this.oTaxChangeArray[0].RINDEX !== "" && this.oTaxChangeArray[0].RINDEX !== undefined) {
    if (oController._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[this.oTaxChangeArray[0].RINDEX] !==
     undefined) {
     this.vRIndex = this.oTaxChangeArray[0].RINDEX;
     this.TaxChngQueryModel.splice(0, 1);
    }
   } else {
    this.oTaxChangeArray[0].RINDEX = reviewLen;
   }
   // Controller Hook method call
   var oExtResults = oController.bpHookChangeTaxData(this, queryModel, oDataModel);
   if (oExtResults !== undefined) {
    queryModel = oExtResults.queryModel;
    oDataModel = oExtResults.oDataModel;
   }

   this.TaxChngQueryModel.push(queryModel);
   this.oChangeTaxModel.setData(oDataModel.body);

  }
 },
 multiTaxRecordChangeModel: function(oController) {
  if (oController.reEdit === "") {
   this.handleChangeModelNoReEdit(oController);
  } else if (oController.reEdit === "X") {
   this.handleChangeModelReEdit(oController);
  }
 },
 handleChangeModelNoReEdit: function(oController) {
  var taxNumLen = 0;
  var reviewPageLen = "";
  if (sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum") !== undefined) {
   var taxNum = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
   taxNumLen = taxNum.length;
  }
  if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
   var vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  }
  reviewPageLen = oController._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent().length;
  this.oTaxChangeArray[vSelectedRecord].TAXNUMBER = (taxNumLen <= 20) ? sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue() : "";
  this.oTaxChangeArray[vSelectedRecord].TAXNUMXL = (taxNumLen <= 20) ? "" : sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
  if (this.oTaxChangeArray[vSelectedRecord].RINDEX === null) {
   this.oTaxChangeArray[vSelectedRecord].RINDEX = reviewPageLen;
  } else {
   reviewPageLen = this.oTaxChangeArray[vSelectedRecord].RINDEX;
  }
  var queryModel = {};
  queryModel.header = "BP_TaxNumberCollection(BP_GUID=" + oController.sItemPath + ",TAXTYPE='" + this.oTaxChangeArray[vSelectedRecord].TAXTYPE +
   "')";
  queryModel.index = this.oTaxChangeArray[vSelectedRecord].index;
  queryModel.body = {};
  queryModel.body["TAXNUMBER"] = (taxNumLen <= 20) ? sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue() : "";
  queryModel.body["TAXNUMXL"] = (taxNumLen <= 20) ? "" : sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
  var oDataModel = {};
  oDataModel.body = {};
  oDataModel.body["TAXTYPE"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
  oDataModel.body["TAXNUMBER"] = (taxNumLen <= 20) ? queryModel.body["TAXNUMBER"] : queryModel.body["TAXNUMXL"];
  oDataModel.body["changeData"] = {};
  oDataModel.body.changeData["TAXNUMBER"] = (taxNumLen <= 20) ? queryModel.body["TAXNUMBER"] : queryModel.body["TAXNUMXL"];
  oDataModel.body["TAXDESC"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
  this.oChangeTaxModel = new sap.ui.model.json.JSONModel();
  // Controller Hook method call
  var oExtResults = oController.bpHookChangeTaxData(this, queryModel, oDataModel);
  if (oExtResults !== undefined) {
   queryModel = oExtResults.queryModel;
   oDataModel = oExtResults.oDataModel;
  }

  this.oChangeTaxModel.setData(oDataModel.body);
  if (oController.vContEditTax === "X") {
   this.vRIndex = "";
   if (oController._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[reviewPageLen] !== undefined) {
    this.vRIndex = this.oTaxChangeArray[vSelectedRecord].RINDEX;
   }
  }
  if (this.vRIndex === "") {
   this.TaxChngQueryModel.push(queryModel);
  } else {
   this.TaxChngQueryModel[this.vRIndex].body["TAXNUMBER"] = (taxNumLen <= 20) ? queryModel.body["TAXNUMBER"] : "";
   this.TaxChngQueryModel[this.vRIndex].body["TAXNUMXL"] = (taxNumLen <= 20) ? "" : queryModel.body["TAXNUMXL"];
  }
 },
 handleChangeModelReEdit: function(oController) {
  var vIndex = "";
  var taxNumLen = 0;
  if (sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum") !== undefined) {
   var taxNum = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
   taxNumLen = taxNum.length;
  }
  for (var i = 0; i < this.oTaxChangeArray.length; i++) {
   if (this.oTaxChangeArray[i].RINDEX === oController.vTaxEntityIndex) {
    vIndex = i;
    if (taxNumLen <= 20) {
     this.oTaxChangeArray[i].TAXNUMBER = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
     this.oTaxChangeArray[i].TAXNUMXL = "";
    } else if (taxNumLen > 20) {
     this.oTaxChangeArray[i].TAXNUMXL = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
     this.oTaxChangeArray[i].TAXNUMBER = "";
    }

   }
  }

  var queryModel = {};
  queryModel.header = "BP_TaxNumberCollection(BP_GUID=" + oController.sItemPath + ",TAXTYPE='" + this.oTaxChangeArray[vIndex].TAXTYPE +
   "')";
  queryModel.body = {};
  if (taxNumLen <= 20) {
   queryModel.body["TAXNUMBER"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
   queryModel.body["TAXNUMXL"] = "";
  } else if (taxNumLen > 20) {
   queryModel.body["TAXNUMBER"] = "";
   queryModel.body["TAXNUMXL"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
  }
  var oDataModel = {};
  oDataModel.body = {};
  oDataModel.body["TAXTYPE"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
  if (taxNumLen <= 20) {
   oDataModel.body["TAXNUMBER"] = queryModel.body["TAXNUMBER"];
  } else if (taxNumLen > 20) {
   oDataModel.body["TAXNUMBER"] = queryModel.body["TAXNUMXL"];
  }
  oDataModel.body["TAXDESC"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
  this.oChangeTaxModel = new sap.ui.model.json.JSONModel();
  this.oChangeTaxModel.setData(oDataModel.body);
  if (taxNumLen <= 20) {
   this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMBER"] = queryModel.body["TAXNUMBER"];
   this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMXL"] = "";
  } else if (taxNumLen > 20) {
   this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMXL"] = queryModel.body["TAXNUMXL"];
   this.TaxChngQueryModel[oController.vTaxEntityIndex].body["TAXNUMBER"] = "";
  }
 },
 changeModel: function(oController) {
  //single record case
  if (this.oTaxChangeArray.length === 1) {
   this.singleTaxRecordChangeModel(oController);
  } else {
   //Multiple records
   this.multiTaxRecordChangeModel(oController);
  }

 },

 deleteTaxNum: function(oWcontroller) {
  if (this.oTaxDelArray.length === 0) {
   oWcontroller.oWizard.discardProgress(oWcontroller.oWizard.getSteps()[0]);
   oWcontroller._oNavContainer.to(oWcontroller._oWizardContentPage);
  }
  if (this.oTaxDelArray.length > 0) {
   this.setSelectTaxRecord(oWcontroller);
  }
 },

 setSelectTaxRecord: function(oController) {
  var oModel = new sap.ui.model.json.JSONModel();
  var strResults = {
   dataitems: []
  };
  if (oController.vCurrentActionId === "deleteRB") {
   oController.getView().byId("actionStep").setNextStep(oController.getView().byId("editStep"));
  }

  if (oController.oCommunicationListRBG !== "" && oController.oCommunicationListRBG !== undefined) {
   try {
    oController.oCommunicationListRBG.destroy();
   } catch (err) {}
   oController.oCommunicationListRBG = "";
  }

  if (oController.oCommunicationListRBG === "") {
   oController.oCommunicationListRBG = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntityInstance', oController);
  }
  if (oController.vCurrentActionId === "deleteRB") {
   oController.getView().byId("editLayout").setVisible(true);
   if (oController.getView().byId("editLayout").getContent().length > 0) {
    oController.getView().byId("editLayout").removeAllContent();
   }
   oController.getView().byId("editLayout").addContent(oController.oCommunicationListRBG);
  }
  for (var i = 0; i < this.oTaxDelArray.length; i++) {
   var vTaxAttribute = this.oTaxDelArray[i];
   var oDataItems = {
    "RBText": fcg.mdg.editbp.util.Formatter.createTaxRecordsToProcess(vTaxAttribute)
   };
   strResults.dataitems.push(oDataItems);
  }

  var oTaxListRBG = sap.ui.getCore().byId("selectDataListRBG");
  oModel.setData(strResults);
  oTaxListRBG.setModel(oModel);
  oTaxListRBG.setSelectedIndex(-1);
 },

 deleteModel: function(oController) {
  var vDeletedTax = {};
  if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
   var vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  }
  vDeletedTax.body = this.oTaxDelArray[vSelectedRecord];

  if (this.oTaxDelArray[vSelectedRecord].TAXNUMBER === "") {
   vDeletedTax.body.TAXNUMBER = this.oTaxDelArray[vSelectedRecord].TAXNUMXL;
  } else if (this.oTaxDelArray[vSelectedRecord].TAXNUMXL === "") {
   vDeletedTax.body.TAXNUMBER = this.oTaxDelArray[vSelectedRecord].TAXNUMBER;
  }

  vDeletedTax.header = "BP_TaxNumberCollection(BP_GUID=" + oController.sItemPath + ",TAXTYPE='" + vDeletedTax.body.TAXTYPE + "')";
  vDeletedTax.index = this.oTaxDelArray[vSelectedRecord].index;
  for (var i = 0; i < this.oTaxChangeArray.length; i++) {
   if (this.oTaxChangeArray[i].index === vDeletedTax.index) {
    var vDelIndex = this.oTaxChangeArray[vSelectedRecord].RINDEX;
    if (oController._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[vDelIndex] !== undefined) {
     oController._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[vDelIndex].getToolbar().destroy();
     oController._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[vDelIndex].removeAllContent();
    }
    this.oTaxChangeArray.splice(i, 1);
   }
  }

  this.oTaxDelArray.splice(vSelectedRecord, 1);
  this.TaxDltQueryModel.push(vDeletedTax);
  vDeletedTax.body.TAXDESC = vDeletedTax.body.TAXTYPE__TXT;
  // Controller Hook method call
  var oExtResults = oController.bpHookDeleteTaxData(this, vDeletedTax);
  if (oExtResults !== undefined) {
   vDeletedTax = oExtResults;
  }

  var vLoadModel = vDeletedTax.body;
  this.oDltTaxModel = new sap.ui.model.json.JSONModel();
  this.oDltTaxModel.setData(vLoadModel);
 },

 undoTaxNumberChanges: function(vActionIndex, vEntityIndex) {
  var vIndex = "";
  var i, j;
  if (vActionIndex === 0) { //Create
   for (i = 0; i < this.oController.oDupCheckData.length;) {
    if (this.oController.oDupCheckData[i].createdIndex === this.taxCreateModel[vEntityIndex].index &&
     this.oController.oDupCheckData[i].entity === "BP_TaxNumber") {
     this.oController.oDupCheckData.splice(i, 1);
    } else {
     i++;
    }
   }
   this.taxCreateModel.splice(vEntityIndex, 1);
  } else if (vActionIndex === 1) { //Change
   var vTaxType;
   if (this.oTaxChangeArray.length === 1) {
    vIndex = this.oTaxChangeArray[0].index;
    for (j = 0; j < this.oTaxResults.BP_TaxNumbersRel.results.length; j++) {
     if (vIndex === j) {
      this.oTaxChangeArray[0].RINDEX = null;
      this.oTaxChangeArray[0].TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMBER;
      this.oTaxChangeArray[0].TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMXL;
      vTaxType = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXTYPE;
     }

    }
    this.TaxChngQueryModel.splice(vEntityIndex, 1);
    //to delete the setEntityValue
    fcg.mdg.editbp.handlers.TaxNumbers.removeTaxEntry(vTaxType); 

   } else if (this.oTaxResults.BP_TaxNumbersRel.results.length > 1) {
    vIndex = this.TaxChngQueryModel[vEntityIndex].index;
    for (j = 0; j < this.oTaxResults.BP_TaxNumbersRel.results.length; j++) {
     var reviewIndex = 0;
     for (i = 0; i < this.oTaxChangeArray.length; i++) {

      if (this.oTaxChangeArray[i].index === j && vIndex === j) {
       this.oTaxChangeArray[i].RINDEX = null;
       this.oTaxChangeArray[i].TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMBER;
       this.oTaxChangeArray[i].TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMXL;
       vTaxType = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXTYPE;
      } else if (this.oTaxChangeArray[i].index !== vIndex) {
       this.oTaxChangeArray[i].RINDEX = reviewIndex++;
      }
     }
    }
    this.TaxChngQueryModel.splice(vEntityIndex, 1);
    //to delete the setEntityValue
    fcg.mdg.editbp.handlers.TaxNumbers.removeTaxEntry(vTaxType);

   }

   for (i = 0; i < this.oController.oDupCheckData.length;) {
    if (this.oController.oDupCheckData[0].entityKey.split("-")[2] === vTaxType &&
     this.oController.oDupCheckData[i].entity === "BP_TaxNumber") {
     this.oController.oDupCheckData.splice(i, 1);
    } else {
     i++;
    }
   }
  } else if (vActionIndex === 2) { //Delete
   var vDelIndex = this.TaxDltQueryModel[vEntityIndex].index;
   var vChngTax = "";
   var vDelTax = "";
   for (i = 0; i < this.oTaxResults.BP_TaxNumbersRel.results.length; i++) {
    if (vDelIndex === i) {
     vChngTax = {};
     vChngTax.RINDEX = null;
     vChngTax.index = i;
     vChngTax.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
     vChngTax.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
     vChngTax.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
     vChngTax.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;

     vDelTax = {};
     vDelTax.RINDEX = null;
     vDelTax.index = i;
     vDelTax.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
     vDelTax.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
     vDelTax.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
     vDelTax.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;

     this.oTaxChangeArray.splice(i, 0, vChngTax);
     this.oTaxDelArray.splice(i, 0, vDelTax);

    }
   }
   this.TaxDltQueryModel.splice(vEntityIndex, 1);
   this.TaxChngQueryModel.splice(vEntityIndex, 1);
  }

 },

removeTaxEntry: function(taxtyp) {
 //in case of change tax number is reverted then the entry in the Entityvalue array which sets the review changes button should be spliced
    for(var i=0;i<this.oController.aEntityValue.length;i++){
     if("taxRB-" + taxtyp === this.oController.aEntityValue[i]){
       this.oController.aEntityValue.splice(i,1);
       break;
         }
         }   
      },

 //Re-Edit for tax Numbers.
 handleTaxNumber: function(oWController) {

  if (oWController.vCurrentActionId === "createRB") {
   this.createTaxNumber(oWController);
  } else if (oWController.vCurrentActionId === "changeRB") {

   if (this.oTaxChangeArray.length > 1) {
    this.editTaxNumRedit(oWController);
   } else if (this.oTaxChangeArray.length === 1) {
    this.editTaxNum(oWController);
   }
  }
 },

 editTaxNumRedit: function(oController) {
  var formControlData = "";
  var vtaxnum = "";
  var oModel = new sap.ui.model.json.JSONModel(); //Create a model and set the result data in it

  this.oController = oController;
  //single senerio
  if (oController.oCommunicationLayout !== "" && oController.oCommunicationLayout !== undefined) {
   try {
    oController.oCommunicationLayout.destroy();
   } catch (err) {}
   oController.oCommunicationLayout = "";
  }

  if (oController.oCommunicationLayout === "") {
   oController.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', oController);
  }

  oController.getView().byId("actionStep").setNextStep(oController.getView().byId("editStep"));
  oController.getView().byId("editLayout").setVisible(true);
  oController.getView().byId("editLayout").removeAllContent();
  //Adding Reason for Request Fragment
  oController.getFileUploadData("editLayout");
  oController.getView().byId("editLayout").addContent(oController.oCommunicationLayout);

  var vIndex = "";
  for (var i = 0; i < this.oTaxChangeArray.length; i++) {

   if (this.oTaxChangeArray[i].RINDEX === oController.vTaxEntityIndex) {
    vIndex = i;

    if (this.oTaxChangeArray[i].TAXNUMBER !== "") {
     vtaxnum = this.oTaxChangeArray[i].TAXNUMBER;
    } else {
     vtaxnum = this.oTaxChangeArray[i].TAXNUMXL;
    }

   }
  }

  formControlData = sap.ui.getCore().byId("editTaxForm");
  oModel.setData(this.oTaxChangeArray[vIndex]);
  formControlData.setModel(oModel);
  oController.currentDataModel = oModel;

  sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(vtaxnum);
  sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setShowValueHelp(false);
  sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setEnabled(false);
  oController.currentDataModel = oModel;
 },

 _TaxTypeVH: function(sProperty, oControlEvent, oController) {
  var oTaxTypeResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[8].data;
  var oGlobalInstance = oController;
  var oLocalIns = this;
  var taxType = sap.ui.getCore().byId(sProperty);
  var oTaxNumber = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
  if (sProperty === "SF-BP_TaxNumber-TaxNumCat") {
   var taxTypeDesc = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm");
  }
  if (sap.ui.getCore().byId("taxTypeDialog") !== undefined) {
   sap.ui.getCore().byId("taxTypeDialog").destroy();
   this.otaxTypeHelp = "";
  }
  var oTaxDialog = new sap.m.SelectDialog({
   id: "taxTypeDialog",
   title: this.i18nModel.getText("Tax_category"),
   noDataText: this.i18nModel.getText("LOAD") + "...", //"Loading...",
   items: {
    // path: "/TaxValues",
    template: new sap.m.StandardListItem({
     title: "{TEXT}",
     description: "{KEY}"
    })
   },
   confirm: function(oEvent) {
    oLocalIns.valueHelpFlag = "X";
    //Set tax type
    taxType.setValueState("None");
    taxType.setValueStateText("");
    if (oEvent.getParameters().selectedItem !== null || oEvent.getParameters().selectedItem !== "") {
     taxType.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    }
    oTaxNumber.setValueState("None");
    oTaxNumber.setValueStateText("");
    taxType.fireEvent("change");
    oLocalIns.valueHelpFlag = "";
    if (taxTypeDesc !== undefined) {
     // Set tax type on selecting a value from F4 list
     taxTypeDesc.setValue(oEvent.getParameters().selectedItem.getProperty("title"));
     // taxTypeDesc.fireEvent("change");
    }
   },
   search: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
    var oItems = oTaxDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
      var sTaxKey = oItems[i].getBindingContext().getProperty("KEY");
      var sTaxDes = oItems[i].getBindingContext().getProperty("TEXT");
      if (sTaxKey.toUpperCase().indexOf(sValue) === -1 && sTaxDes.toUpperCase().indexOf(sValue) === -1) {
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
    var oItems = oTaxDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
      var oTaxKey = oItems[i].getBindingContext().getProperty("KEY");
      var oTaxDesc = oItems[i].getBindingContext().getProperty("TEXT");
      if (oTaxKey.toUpperCase().indexOf(sValue) === -1 &&
       oTaxDesc.toUpperCase().indexOf(sValue) === -1) {
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

  if (oTaxTypeResult.results.length > 0) {
   var oItemTemplate = new sap.m.StandardListItem({
    title: "{TEXT}",
    description: "{KEY}",
    active: true
   });
   var oInputHelpModel = new sap.ui.model.json.JSONModel();
   oInputHelpModel.setData(oTaxTypeResult);
   oTaxDialog.setModel(oInputHelpModel);
   oTaxDialog.setGrowingThreshold(oTaxTypeResult.results.length);
   oTaxDialog.bindAggregation("items", "/results", oItemTemplate);
  } else {
   oTaxDialog.setNoDataText(oGlobalInstance.getView().getModel("i18n").getProperty("NO_DATA"));
  }

  oTaxDialog.open();
 },

 setSelectRecordView: function() {
  var oThis = this;
  var selectDataStep = this.oController.getView().byId("selectEntityInstanceStep");

  selectDataStep.addEventDelegate({
   onAfterRendering: function() {
    var oItems = this.$().find('.sapMWizardStepTitle');
    //    oItems[0].innerHTML = oThis.oController.i18nBundle.getText("select_TN");
   }
  }, selectDataStep);
 },

 setTaxChangedArray: function(array) {
  return this.changedArray;
 },

 getTaxChangedArray: function(array) {
  return this.changedArray;
 },

 seti18nModel: function(i18n) {
  this.i18nModel = i18n;
 }
};