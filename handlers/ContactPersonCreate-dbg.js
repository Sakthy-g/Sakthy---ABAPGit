/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.ContactPersonCreate");

fcg.mdg.editbp.handlers.ContactPersonCreate = {
 countryError: false,
 oWPIavModel: "",
 oExistingIav: "",
 vIsWPASelected: "",
 aWpIds: [],

 addWPAddress: function() {
  fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel = "";
  fcg.mdg.editbp.handlers.ContactPersonCreate.addNewWPAddress();
 },

 addNewWPAddress: function() {
  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var formIndex = wizardController.getView().byId("editLayout").getContent().length - 1;
  var formId = fcg.mdg.editbp.handlers.ContactPerson.oWpFormId;
  var telId = 0;
  var mobId = 0;
  var faxId = 0;
  var emailId = 0;
  var sDefaultText = wizardController.i18nBundle.getText("NONE");

  //new logic to add counter for telephone , mobile , fax and email
  var oCounters = {};

  //check if action is create or change 
  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "createRB") {
   oCounters.cpId = "T1";
  } else if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {
   var vSelectedRecord;
   if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
    vSelectedRecord = 0;
   } else {
    if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
     vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
    }
   }

   oCounters.cpId = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER1;
  }
  oCounters.formId = formId;
  oCounters.telId = telId;
  oCounters.mobId = mobId;
  oCounters.faxId = faxId;
  oCounters.emailId = emailId;

  fcg.mdg.editbp.handlers.ContactPerson.aAllCounters.push(oCounters);

  fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = formId + 1;
  var adRes = fcg.mdg.editbp.handlers.ContactPerson.getWPAddressArray();
  var adrlen = adRes.results.length;

  var preWPA = sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + (formId - 1));
  if (preWPA !== undefined && preWPA.getSelectedKey() === "") {
   return;
  }
  if (adrlen < 1) {
   return;
  }

  var oNewForm = new sap.ui.layout.form.SimpleForm({
   id: "SFWpAddressEdit-" + formId,
   maxContainerCols: 1,
   minWidth: 1024,
   layout: "ResponsiveGridLayout",
   labelSpanL: 3,
   labelSpanM: 3,
   emptySpanL: 4,
   emptySpanS: 0,
   emptySpanM: 4,
   labelSpanS: 12,
   editable: true,
   "class": "paddingFixSF"
  });

  fcg.mdg.editbp.handlers.ContactPersonCreate.addWPToolBar(oNewForm, wizardController, adrlen); //creating iav toolbar dynamically parameter as form, formContainer & formElement
  var lblAddress = new sap.m.Label({
   text: wizardController.i18nBundle.getText("Address")
  });
  oNewForm.addContent(lblAddress);
  var fieldAddress = new sap.m.Select({
   id: "INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + formId,
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onAddressChange
  });
  //for value help of Address Version
  var oADModel = new sap.ui.model.json.JSONModel();
  oADModel.setData(adRes);
  var fieldAddrversionValuesTemp = new sap.ui.core.Item({
   key: "{AD_ID}",
   text: "{AD_ID__TXT}"
  });
  fieldAddress.setModel(oADModel);
  fieldAddress.bindItems("/results", fieldAddrversionValuesTemp);
  if (adrlen > 1) {
   var emptyAddress = new sap.ui.core.Item({
    key: "",
    text: sDefaultText
   });
   fieldAddress.addItem(emptyAddress);
   fieldAddress.setSelectedKey();
  } else {
   fieldAddress.setSelectedItem(fieldAddress.getItems()[0]);
  }
  oNewForm.addContent(fieldAddress);

  var lblDepartment = new sap.m.Label({
   text: wizardController.i18nBundle.getText("DEPARTMENT")
  });
  oNewForm.addContent(lblDepartment);

  var inpDepartment = new sap.m.Input({
   id: "INP-BP_ContactPersonWorkplacesRel-Department-" + formId,
   value: "{WP>/DEPARTMENT}",
   maxLength: 40,
   change: fcg.mdg.editbp.handlers.ContactPerson.onChange_Create,
   enabled: false
  });
  oNewForm.addContent(inpDepartment);

  var lblFunction = new sap.m.Label({
   text: wizardController.i18nBundle.getText("FUNCTION")
  });
  oNewForm.addContent(lblFunction);

  var inpFunction = new sap.m.Input({
   id: "INP-BP_ContactPersonWorkplacesRel-Function-" + formId,
   value: "{WP>/FUNCTION}",
   maxLength: 40,
   change: fcg.mdg.editbp.handlers.ContactPerson.onChange_Create,
   enabled: false
  });
  oNewForm.addContent(inpFunction);

  var lblTel = new sap.m.Label({
   text: wizardController.i18nBundle.getText("TEL")
  });
  oNewForm.addContent(lblTel);

  var telCountry = new sap.m.Input({
   id: "INP-BP_WorkplaceCommPhonesRel-COUNTRY-" + telId + "-" + formId,
   value: "{tel>/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("CCITY"),
   valueHelpRequest: fcg.mdg.editbp.handlers.ContactPerson.onCPTelCountrykey,
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onTelCountryKeyChange,
   showValueHelp: true,
   enabled: false,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   })
  });
  oNewForm.addContent(telCountry);
  var telNumber = new sap.m.Input({
   id: "INP-BP_WorkplaceCommPhonesRel-TELEPHONE-" + telId + "-" + formId,
   value: "{tel>/TELEPHONE}",
   maxLength: 30,
   placeholder: wizardController.i18nBundle.getText("Number"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onTelephoneChange,
   enabled: false,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   })
  });
  oNewForm.addContent(telNumber);
  var telExt = new sap.m.Input({
   id: "INP-BP_WorkplaceCommPhonesRel-EXTENSION-" + telId + "-" + formId,
   value: "{tel>/EXTENSION}",
   maxLength: 10,
   placeholder: wizardController.i18nBundle.getText("Extension"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onExtensionChange,
   enabled: false,
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  oNewForm.addContent(telExt);
  var hBoxTel = fcg.mdg.editbp.handlers.ContactPersonCreate.addPlusIcons("Tel", formId);
  var removeTel = new sap.ui.core.Icon({
   id: "telCPCancel-" + formId,
   decorative: false,
   src: "sap-icon://sys-cancel",
   tooltip: "Cancel"
  });
  hBoxTel.addItem(removeTel);
  oNewForm.addContent(hBoxTel);
  // sap.ui.getCore().byId("telCPCancel-" + formId).detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  sap.ui.getCore().byId("telCPCancel-" + formId).addStyleClass("sapGreyCell");

  var lblMob = new sap.m.Label({
   text: wizardController.i18nBundle.getText("MOB")
  });
  oNewForm.addContent(lblMob);

  var mobCountry = new sap.m.Input({
   id: "INP-BP_WorkplaceCommMobilesRel-COUNTRY-" + mobId + "-" + formId,
   value: "{mob>/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("CCITY"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onMobCountryKeyChange,
   valueHelpRequest: fcg.mdg.editbp.handlers.ContactPerson.onCPMobCountrykey,
   showValueHelp: true,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   }),
   enabled: false
  });
  oNewForm.addContent(mobCountry);
  var mobNumber = new sap.m.Input({
   id: "INP-BP_WorkplaceCommMobilesRel-TELEPHONE-" + mobId + "-" + formId,
   value: "{mob>/TELEPHONE}",
   maxLength: 30,
   placeholder: wizardController.i18nBundle.getText("Number"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onMobChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L3 M3 S3"
   }),
   enabled: false
  });
  oNewForm.addContent(mobNumber);
  var hBoxMob = fcg.mdg.editbp.handlers.ContactPersonCreate.addPlusIcons("Mob", formId);
  var removeMob = new sap.ui.core.Icon({
   id: "mobCPCancel-" + formId,
   decorative: false,
   src: "sap-icon://sys-cancel",
   tooltip: "Cancel"
  });
  hBoxMob.addItem(removeMob);
  oNewForm.addContent(hBoxMob);
  //disable the Cancel button when the form is loaded
  // sap.ui.getCore().byId("mobCPCancel-" + formId).detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  sap.ui.getCore().byId("mobCPCancel-" + formId).addStyleClass("sapGreyCell");

  var lblFax = new sap.m.Label({
   text: wizardController.i18nBundle.getText("FAX")
  });
  oNewForm.addContent(lblFax);

  var faxCountry = new sap.m.Input({
   id: "INP-BP_WorkplaceCommFaxesRel-COUNTRY-" + faxId + "-" + formId,
   value: "{fax>/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("CCITY"),
   showValueHelp: true,
   valueHelpRequest: fcg.mdg.editbp.handlers.ContactPerson.onCPFaxCountrykey,
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onFaxCountryKeyChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   }),
   enabled: false
  });
  oNewForm.addContent(faxCountry);
  var faxNumber = new sap.m.Input({
   id: "INP-BP_WorkplaceCommFaxesRel-FAX-" + faxId + "-" + formId,
   value: "{fax>/FAX}",
   maxLength: 30,
   placeholder: wizardController.i18nBundle.getText("Number"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onFaxChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   }),
   enabled: false
  });
  oNewForm.addContent(faxNumber);
  var faxExt = new sap.m.Input({
   id: "INP-BP_WorkplaceCommFaxesRel-EXTENSION-" + faxId + "-" + formId,
   value: "{fax>/EXTENSION}",
   maxLength: 10,
   placeholder: wizardController.i18nBundle.getText("Extension"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onFaxExtensionChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   }),
   enabled: false
  });
  oNewForm.addContent(faxExt);
  var hBoxFax = fcg.mdg.editbp.handlers.ContactPersonCreate.addPlusIcons("Fax", formId);
  var removeFax = new sap.ui.core.Icon({
   id: "faxCPCancel-" + formId,
   decorative: false,
   src: "sap-icon://sys-cancel",
   tooltip: "Cancel"
  });
  hBoxFax.addItem(removeFax);
  oNewForm.addContent(hBoxFax);
  //disable the Cancel button when the form is loaded
  // sap.ui.getCore().byId("faxCPCancel-" + formId).detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  sap.ui.getCore().byId("faxCPCancel-" + formId).addStyleClass("sapGreyCell");

  var lblEmail = new sap.m.Label({
   text: wizardController.i18nBundle.getText("E_MAIL")
  });
  oNewForm.addContent(lblEmail);

  var inpEmail = new sap.m.Input({
   id: "INP-BP_WorkplaceCommEMailsRel-E_MAIL-" + emailId + "-" + formId,
   value: "{email>/E_MAIL}",
   maxLength: 241,
   type: "Email",
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onEMailChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L5 M5 S5"
   }),
   enabled: false
  });
  oNewForm.addContent(inpEmail);

  var hBoxEmail = fcg.mdg.editbp.handlers.ContactPersonCreate.addPlusIcons("Email", formId);
  var removeEmail = new sap.ui.core.Icon({
   id: "emailCPCancel-" + formId,
   // decorative: false,
   src: "sap-icon://sys-cancel",
   tooltip: "Cancel"
  });
  hBoxEmail.addItem(removeEmail);
  oNewForm.addContent(hBoxEmail);

  // extension hook
  wizardController.bpHookAddNewWPAddressCP(this, formId, oNewForm);

  //disable the Cancel button when the form is loaded
  // sap.ui.getCore().byId("emailCPCancel-" + formId).detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  sap.ui.getCore().byId("emailCPCancel-" + formId).addStyleClass("sapGreyCell");

  wizardController.getView().byId("editLayout").insertContent(oNewForm, formIndex);
  fcg.mdg.editbp.handlers.ContactPerson.oWpNewForm = oNewForm;
  fcg.mdg.editbp.handlers.ContactPerson.aWpNewForm.push(oNewForm); // Put the 

  if (adrlen === 1) {
   //sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + formId).setSelectedKey(fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().ADDRESS_NUMBER);
   sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + formId).fireEvent('change');
   sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + formId).setEnabled(false);
  }
  if (sap.ui.getCore().byId("toolWPAdd").hasListeners("press") === true) {
   sap.ui.getCore().byId("toolWPAdd").detachEvent("press");
   sap.ui.getCore().byId("toolWPAdd").detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
   sap.ui.getCore().byId("toolWPAdd").addStyleClass("sapGreyCell");
  }
  if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel !== "") {
   for (var r = 0; r < fcg.mdg.editbp.handlers.ContactPerson.oWpAddressResults.results.length; r++) {
    if (fcg.mdg.editbp.handlers.ContactPerson.oWpAddressResults.results[r].AD_ID === fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel
     .getData().ADDRESS_NUMBER) {
     fieldAddress.setSelectedKey(fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().ADDRESS_NUMBER);
     fieldAddress.fireEvent("change");
    }
   }
  }

 },

 addIcons: function(str) {
  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  hBox.addStyleClass("sapUiSmallMargin");
  var addIcon = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   press: function(oEvent) {
    if (str === ("Email"))
     return fcg.mdg.editbp.handlers.ContactPersonCreate.addNewEmail(oEvent);
    else if (str === "Tel")
     return fcg.mdg.editbp.handlers.ContactPersonCreate.addNewTel(oEvent);
    else if (str === "Fax")
     return fcg.mdg.editbp.handlers.ContactPersonCreate.addNewFax(oEvent);
    else if (str === "Mob")
     return fcg.mdg.editbp.handlers.ContactPersonCreate.addNewMob(oEvent);
   },
   tooltip: "Add"
  });
  addIcon.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(addIcon);
  var removeIcon = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement,
   tooltip: "Cancel"
  });
  hBox.addItem(removeIcon);
  return hBox;
 },

 addPlusIcons: function(str, wpId) {
  var idString = "";
  if (str === "Tel") {
   idString = "telCPAdd-" + wpId;
  } else if (str === "Mob") {
   idString = "mobCPAdd-" + wpId;
  } else if (str === "Fax") {
   idString = "faxCPAdd-" + wpId;
  } else if (str === "Email") {
   idString = "emailCPAdd-" + wpId;
  }

  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });
  hBox.addStyleClass("sapUiSmallMargin");
  var addIcon = new sap.ui.core.Icon({
   id: idString,
   decorative: false,
   src: "sap-icon://sys-add",
   tooltip: "Add"
  });
  addIcon.addStyleClass("sapGreyCell");
  addIcon.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(addIcon);
  return hBox;
 },

 addWPToolBar: function(oForm, wizardController, adrLen) {
  var title = new sap.m.Title({
   text: wizardController.i18nBundle.getText("ADD_WP_ADD"),
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
  var wpAdd = new sap.ui.core.Icon({
   src: "sap-icon://sys-add",
   decorative: false,
   tooltip: "Add"
  });

  wpAdd.addStyleClass("sapGreyCell");
  wpAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(wpAdd);
  var wpRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   press: fcg.mdg.editbp.handlers.ContactPersonCreate.removeWPForm,
   tooltip: "Cancel"
  });
  hBox.addItem(wpRemove);
  oForm.addContent(title);
  oForm.addContent(hBox);
 },

 removeWPForm: function(oEvent) {
  var oFormId = oEvent.getSource().getParent().getParent().getParent().getParent().getParent();
  var layout = fcg.mdg.editbp.handlers.ContactPerson.oController.getView().byId("editLayout");
  fcg.mdg.editbp.handlers.ContactPerson.oController.oWizard.validateStep(fcg.mdg.editbp.handlers.ContactPerson.oController.getView().byId(
   "editStep"));

  var formIndex = oFormId.getId().split("-")[1];
  var AddId = sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + formIndex);
  var iavIndex = fcg.mdg.editbp.handlers.ContactPersonCreate.getIAVIndex(oEvent);
  var arrayIndex = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(AddId.getSelectedKey());
  fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.splice(arrayIndex);
  if (AddId.getSelectedKey() !== undefined && AddId.getSelectedKey() !== "") {
   var obj = {};
   obj.AD_ID = AddId.getSelectedKey();
   obj.AD_ID__TXT = AddId.getSelectedItem().getText();
   fcg.mdg.editbp.handlers.ContactPerson.oWpAddressResults.results.push(obj);
  }

  var container = sap.ui.getCore().byId(oFormId.getId() + "--Form");
  var formContainer = container.getFormContainers()[0];
  var formElem = formContainer.getFormElements();

  for (var k = 7; k < formElem.length; k++) {
   var vbox = formElem[k].getFields()[0];
   if (vbox.getId().indexOf("__vbox") !== -1) {
    var vBoxItem = vbox.getItems()[0];
    var iavField = vBoxItem.getContent()[3];
    if (iavField.getSelectedKey() !== undefined && iavField.getSelectedKey() !== "") {
     var iavObj = {};
     iavObj.ADDR_VERS = iavField.getSelectedKey();
     iavObj.ADDR_VERS__TXT = iavField.getSelectedItem().getText();
     fcg.mdg.editbp.handlers.ContactPerson.oWpIavResults.results[iavIndex].IAV.push(iavObj);
    }
   }
  }

  for (var i = 2; i < (layout.getContent().length - 1); i++) {
   if (layout.getContent()[i] === oFormId) {
    layout.removeContent(layout.getContent()[i]);
    break;
   }
  }

  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {
   var vSelectedRecord;
   if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
    vSelectedRecord = 0;
   } else {
    if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
     vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
    }
   }

   var deletedEntry = {};
   var oWizController = fcg.mdg.editbp.handlers.ContactPerson.oController;
   for (var k = 0; k < fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.length; k++) {
    if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[k].wpKey === formIndex) {
     fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.splice(k, 1);
     k = k - 1;
    }

   }

   if (formIndex < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length) {
    if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[formIndex].action === "N") {
     fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.splice(formIndex, 1);
    } else {
     deletedEntry.entity = "BP_ContactPersonWorkplacesRel";
     deletedEntry.currentEntityKey = formIndex;
     deletedEntry.wpKey = formIndex;
     deletedEntry.action = "D";
     var vValidDateformat = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel
      .VALIDUNTILDATE;
     vValidDateformat = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(vValidDateformat);
     deletedEntry.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + oWizController.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers
      .ContactPerson
      .oRelResults.BP_RelationsRel.
     results[vSelectedRecord].BP_RelationContactPersonRel.PARTNER1 +
      "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.
     results[vSelectedRecord].BP_RelationContactPersonRel.PARTNER2 +
      "\',RELATIONSHIPCATEGORY=\'" +
      fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.
     results[vSelectedRecord].BP_RelationContactPersonRel.RELATIONSHIPCATEGORY +
      "\',ADDRESS_NUMBER=\'" +
      fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.
     results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[formIndex].ADDRESS_NUMBER +
      "\',VALIDUNTILDATE=datetime\'" + escape(vValidDateformat) + "\')";

     fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.push(deletedEntry);
    }
   }

  }

  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var createdArray = wizardController.createdArray;
  for (var j = 0; j < createdArray.length; j++) {
   if (createdArray[j].wpKey === formIndex) {
    createdArray.splice(j, 1);
    j--;
   }
  }
  oFormId.destroy();

  if (sap.ui.getCore().byId("toolWPAdd").hasListeners("press") === false) {
   sap.ui.getCore().byId("toolWPAdd").attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
   sap.ui.getCore().byId("toolWPAdd").removeStyleClass("sapGreyCell");
  }

 },

 addNewTel: function(oEvent) {
  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var elements = [];
  var formContainer = "";
  var formElementIndex = "";
  var formId = "";
  var getIdPart = fcg.mdg.editbp.handlers.ContactPerson.vIdCounterTel + 1;
  if (oEvent === undefined) {
   formId = fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1;
   var prevBoxID = getIdPart - 1;
   var formName = "SFWpAddressEdit-" + formId + "--Form";
   var telName = "INP-BP_WorkplaceCommPhonesRel-TELEPHONE-" + "0-" + formId;

   var oForm = sap.ui.getCore().byId(formName);
   formContainer = oForm.getFormContainers()[0];
   formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId(telName).getParent()) + 1;
  } else {
   formId = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getId();
   formId = formId.split("-")[1];
   formContainer = oEvent.getSource().getParent().getParent().getParent();
   formElementIndex = formContainer.getFormElements().indexOf(oEvent.getSource().getParent().getParent()) + 1;
  }

  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {

   var vSelectedRecord;
   if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
    vSelectedRecord = 0;
   } else {
    if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
     vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
    }
   }

   var vPartner1 = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER1;
   var aCounter = [];
   aCounter = fcg.mdg.editbp.handlers.ContactPerson.aAllCounters;
   for (var i = 0; i < aCounter.length; i++) {
    if (aCounter[i].formId === parseInt(formId) &&
     aCounter[i].cpId === vPartner1) {
     aCounter[i].telId = aCounter[i].telId + 1;
     getIdPart = aCounter[i].telId;
     break;
    }
   }
   fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = aCounter;
  }

  fcg.mdg.editbp.handlers.ContactPerson.vIdCounterTel = getIdPart;
  var telCountry = new sap.m.Input({
   id: "INP-BP_WorkplaceCommPhonesRel-COUNTRY-" + getIdPart + "-" + formId,
   value: "{tel1>/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("CCITY"),
   valueHelpRequest: fcg.mdg.editbp.handlers.ContactPerson.onCPTelCountrykey,
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onTelCountryKeyChange,
   showValueHelp: true,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });
  var telNumber = new sap.m.Input({
   id: "INP-BP_WorkplaceCommPhonesRel-TELEPHONE-" + getIdPart + "-" + formId,
   value: "{tel1>/TELEPHONE}",
   maxLength: 30,
   placeholder: wizardController.i18nBundle.getText("Number"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onTelephoneChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   })
  });
  var telExt = new sap.m.Input({
   id: "INP-BP_WorkplaceCommPhonesRel-EXTENSION-" + getIdPart + "-" + formId,
   value: "{tel1>/EXTENSION}",
   maxLength: 10,
   placeholder: wizardController.i18nBundle.getText("Extension"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onExtensionChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });

  var hBox = fcg.mdg.editbp.handlers.ContactPersonCreate.addIcons("Tel");
  elements.push(telCountry, telNumber, telExt, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.ContactPerson.vNewTelField = newtelFormElement;
  var fieldArray = ["INP-BP_WorkplaceCommPhonesRel-COUNTRY-" + getIdPart + "-" + formId];
  fcg.mdg.editbp.handlers.ContactPersonCreate.setCountryKeyFields(formId, fieldArray, wizardController);
 },

 addNewMob: function(oEvent) {
  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var elements = [];
  var formContainer = "";
  var formElementIndex = "";

  var formId = "";
  var getIdPart = fcg.mdg.editbp.handlers.ContactPerson.vIdCounterMob + 1;
  if (oEvent === undefined) {
   formId = fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1;
   var prevBoxID = getIdPart - 1;
   var formName = "SFWpAddressEdit-" + formId + "--Form";
   var mobName = "INP-BP_WorkplaceCommMobilesRel-TELEPHONE-" + "0-" + formId;

   var oForm = sap.ui.getCore().byId(formName);
   formContainer = oForm.getFormContainers()[0];
   formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId(mobName).getParent()) + 1;
  } else {
   formId = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getId();
   formId = formId.split("-")[1];
   formContainer = oEvent.getSource().getParent().getParent().getParent();
   formElementIndex = formContainer.getFormElements().indexOf(oEvent.getSource().getParent().getParent()) + 1;
  }

  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {

   var vSelectedRecord;
   if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
    vSelectedRecord = 0;
   } else {
    if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
     vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
    }
   }

   var vPartner1 = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER1;
   var aCounter = [];
   aCounter = fcg.mdg.editbp.handlers.ContactPerson.aAllCounters;
   for (var i = 0; i < aCounter.length; i++) {
    if (aCounter[i].formId === parseInt(formId) &&
     aCounter[i].cpId === vPartner1) {
     aCounter[i].mobId = aCounter[i].mobId + 1;
     getIdPart = aCounter[i].mobId;
     break;
    }
   }
   fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = aCounter;
  }

  fcg.mdg.editbp.handlers.ContactPerson.vIdCounterMob = getIdPart;
  var mobCountry = new sap.m.Input({
   id: "INP-BP_WorkplaceCommMobilesRel-COUNTRY-" + getIdPart + "-" + formId,
   value: "{/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("CCITY"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onMobCountryKeyChange,
   valueHelpRequest: fcg.mdg.editbp.handlers.ContactPerson.onCPMobCountrykey,
   showValueHelp: true,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });
  var mobNumber = new sap.m.Input({
   id: "INP-BP_WorkplaceCommMobilesRel-TELEPHONE-" + getIdPart + "-" + formId,
   value: "{/TELEPHONE}",
   maxLength: 30,
   placeholder: wizardController.i18nBundle.getText("Number"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onMobChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L3 M3 S3"
   })
  });
  var hBox = fcg.mdg.editbp.handlers.ContactPersonCreate.addIcons("Mob");
  elements.push(mobCountry, mobNumber, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.ContactPerson.vNewMobField = newtelFormElement;
  var fieldArray = ["INP-BP_WorkplaceCommMobilesRel-COUNTRY-" + getIdPart + "-" + formId];
  fcg.mdg.editbp.handlers.ContactPersonCreate.setCountryKeyFields(formId, fieldArray, wizardController);
 },

 addNewFax: function(oEvent) {
  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var elements = [];
  var formContainer = "";
  var formElementIndex = "";

  var formId = "";
  var getIdPart = fcg.mdg.editbp.handlers.ContactPerson.vIdCounterFax + 1;
  if (oEvent === undefined) {
   formId = fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1;
   var prevBoxID = getIdPart - 1;
   var formName = "SFWpAddressEdit-" + formId + "--Form";
   var faxName = "INP-BP_WorkplaceCommFaxesRel-FAX-" + "0-" + formId;

   var oForm = sap.ui.getCore().byId(formName);
   formContainer = oForm.getFormContainers()[0];
   formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId(faxName).getParent()) + 1;
  } else {
   formId = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getId();
   formId = formId.split("-")[1];
   formContainer = oEvent.getSource().getParent().getParent().getParent();
   formElementIndex = formContainer.getFormElements().indexOf(oEvent.getSource().getParent().getParent()) + 1;
  }

  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {

   var vSelectedRecord;
   if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
    vSelectedRecord = 0;
   } else {
    if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
     vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
    }
   }

   var vPartner1 = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER1;
   var aCounter = [];
   aCounter = fcg.mdg.editbp.handlers.ContactPerson.aAllCounters;
   for (var i = 0; i < aCounter.length; i++) {
    if (aCounter[i].formId === parseInt(formId) &&
     aCounter[i].cpId === vPartner1) {
     aCounter[i].faxId = aCounter[i].faxId + 1;
     getIdPart = aCounter[i].faxId;
     break;
    }
   }
   fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = aCounter;
  }

  fcg.mdg.editbp.handlers.ContactPerson.vIdCounterFax = getIdPart;
  var faxCountry = new sap.m.Input({
   id: "INP-BP_WorkplaceCommFaxesRel-COUNTRY-" + getIdPart + "-" + formId,
   value: "{/COUNTRY}",
   maxLength: 3,
   placeholder: wizardController.i18nBundle.getText("CCITY"),
   showValueHelp: true,
   valueHelpRequest: fcg.mdg.editbp.handlers.ContactPerson.onCPFaxCountrykey,
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onFaxCountryKeyChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });
  var faxNumber = new sap.m.Input({
   id: "INP-BP_WorkplaceCommFaxesRel-FAX-" + getIdPart + "-" + formId,
   value: "{/FAX}",
   maxLength: 30,
   placeholder: wizardController.i18nBundle.getText("Number"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onFaxChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L2 M2 S2"
   })
  });
  var faxExt = new sap.m.Input({
   id: "INP-BP_WorkplaceCommFaxesRel-EXTENSION-" + getIdPart + "-" + formId,
   value: "{/EXTENSION}",
   maxLength: 10,
   placeholder: wizardController.i18nBundle.getText("Extension"),
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onFaxExtensionChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1"
   })
  });

  var hBox = fcg.mdg.editbp.handlers.ContactPersonCreate.addIcons("Fax");
  elements.push(faxCountry, faxNumber, faxExt, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.ContactPerson.vNewFaxField = newtelFormElement;
  var fieldArray = ["INP-BP_WorkplaceCommFaxesRel-COUNTRY-" + getIdPart + "-" + formId];
  fcg.mdg.editbp.handlers.ContactPersonCreate.setCountryKeyFields(formId, fieldArray, wizardController);
 },

 addNewEmail: function(oEvent) {
  var elements = [];
  var formContainer = "";
  var formElementIndex = "";

  var formId = "";
  var getIdPart = fcg.mdg.editbp.handlers.ContactPerson.vIdCounterEmail + 1;

  if (oEvent === undefined) {
   formId = fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1;
   var prevBoxID = getIdPart - 1;
   var formName = "SFWpAddressEdit-" + formId + "--Form";
   var emailName = "INP-BP_WorkplaceCommEMailsRel-E_MAIL-" + "0-" + formId;

   var oForm = sap.ui.getCore().byId(formName);
   formContainer = oForm.getFormContainers()[0];
   formElementIndex = formContainer.getFormElements().indexOf(sap.ui.getCore().byId(emailName).getParent()) + 1;
  } else {
   formId = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getId();
   formId = formId.split("-")[1];
   formContainer = oEvent.getSource().getParent().getParent().getParent();
   formElementIndex = formContainer.getFormElements().indexOf(oEvent.getSource().getParent().getParent()) + 1;
  }

  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {

   var vSelectedRecord;
   if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
    vSelectedRecord = 0;
   } else {
    if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
     vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
    }
   }

   var vPartner1 = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER1;
   var aCounter = [];
   aCounter = fcg.mdg.editbp.handlers.ContactPerson.aAllCounters;
   for (var i = 0; i < aCounter.length; i++) {
    if (aCounter[i].formId === parseInt(formId) &&
     aCounter[i].cpId === vPartner1) {
     aCounter[i].emailId = aCounter[i].emailId + 1;
     getIdPart = aCounter[i].emailId;
     break;
    }
   }
   fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = aCounter;
  }

  fcg.mdg.editbp.handlers.ContactPerson.vIdCounterEmail = getIdPart;
  var email = new sap.m.Input({
   id: "INP-BP_WorkplaceCommEMailsRel-E_MAIL-" + getIdPart + "-" + formId,
   value: "{/E_MAIL}",
   type: "Email",
   maxLength: 241,
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onEMailChange,
   layoutData: new sap.ui.layout.GridData({
    span: "L5 M5 S5",
    indent: "L3 M3 S3",
    linebreak: true
   })
  });

  var hBox = fcg.mdg.editbp.handlers.ContactPersonCreate.addIcons("Email");
  elements.push(email, hBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.ContactPerson.vNewEmailField = newtelFormElement;
 },

 removeFormElement: function(oEvent) {
  var oWizController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var addrIndex;
  var deletedEntry = {};
  var formContainer = oEvent.getSource().getParent().getParent().getParent();
  var formElement = oEvent.getSource().getParent().getParent();
  var iconId = oEvent.getSource().getId();

  var vWPKey = formElement.getFields()[0].getId().split("-")[4];
  var vItemId = formElement.getFields()[0].getId().split("-")[3];
  fcg.mdg.editbp.handlers.ContactPerson.oController.oWizard.validateStep(fcg.mdg.editbp.handlers.ContactPerson.oController.getView().byId(
   "editStep"));
  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {
   deletedEntry.entity = formElement.getFields()[0].getId().split("-")[1];
   var id = "INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + vWPKey;
   var addrId = sap.ui.getCore().byId(id).getSelectedKey();
   for (var m = 0; m < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length; m++) {
    if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[m].ADDRESS_NUMBER === addrId) {
     addrIndex = m;
     break;
    }
   }
   deletedEntry.addrIndex = addrIndex;
   if (deletedEntry.entity === 'BP_WorkplaceCommPhonesRel' || deletedEntry.entity === 'BP_WorkplaceCommMobilesRel' || deletedEntry.entity ===
    'BP_WorkplaceCommFaxesRel' || deletedEntry.entity === 'BP_WorkplaceCommEMailsRel') {
    if (addrIndex !== undefined) {
     switch (formElement.getFields()[0].getId().split("-")[1]) {
      case 'BP_WorkplaceCommPhonesRel':
       if (formElement.getFields()[0].getId().split("-")[3] < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommPhonesRel
        .results.length) {
        //check if the element you are deleting is added in the current session if yes remove from the model too
        if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommPhonesRel.results[vItemId].action ===
         undefined) {
         deletedEntry.action = "D";
        } else if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommPhonesRel.results[vItemId].action ===
         "N") {
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommPhonesRel.results.splice(vItemId, 1);
        }
       }
       break;
      case 'BP_WorkplaceCommMobilesRel':
       if (formElement.getFields()[0].getId().split("-")[3] < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommMobilesRel
        .results.length) {
        if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommMobilesRel.results[vItemId].action ===
         undefined) {
         deletedEntry.action = "D";
        } else if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommMobilesRel.results[vItemId].action ===
         "N") {
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommMobilesRel.results.splice(vItemId, 1);
        }
       }
       break;
      case 'BP_WorkplaceCommFaxesRel':
       if (formElement.getFields()[0].getId().split("-")[3] < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommFaxesRel
        .results.length) {
        if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommFaxesRel.results[vItemId].action ===
         undefined) {
         deletedEntry.action = "D";
        } else if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommFaxesRel.results[vItemId].action ===
         "N") {
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommFaxesRel.results.splice(vItemId, 1);
        }
       }
       break;
      case 'BP_WorkplaceCommEMailsRel':
       if (formElement.getFields()[0].getId().split("-")[3] < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommEMailsRel
        .results.length) {
        if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommEMailsRel.results[vItemId].action ===
         undefined) {
         deletedEntry.action = "D";
        } else if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommEMailsRel.results[vItemId].action ===
         "N") {
         fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceCommEMailsRel.results.splice(vItemId, 1);
        }
       }
       break;
     }
    }

    for (var i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.length; i++) {
     // if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].action === "N") {

     for (var j = 0; j < formElement.getFields().length; j++) {
      if (
       fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].entity === formElement.getFields()[j].getId().split("-")[
        1] &&
       (fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].createdIndex === formElement.getFields()[j].getId().split(
        "-")[3] || fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].currentEntityKey === formElement.getFields()[
        j].getId().split(
        "-")[3]) &&
       fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].wpKey === formElement.getFields()[j].getId().split("-")[
        4] &&
       fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].field === formElement.getFields()[j].getId().split("-")[2]
      ) {
       fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.splice(i, 1);
       i = i - 1;
       break;
      }
     }
     // }

    }

    if (deletedEntry.action === "D") {
     deletedEntry.createdIndex = formElement.getFields()[0].getId().split("-")[3];
     deletedEntry.currentEntityKey = formElement.getFields()[0].getId().split("-")[3];
     deletedEntry.wpKey = formElement.getFields()[0].getId().split("-")[4];
     var vValidDateformat = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[(addrIndex)].VALIDUNTILDATE;
     vValidDateformat = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(vValidDateformat);
     deletedEntry.currentkey = "(BP_GUID=" + oWizController.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
       (
        addrIndex)].PARTNER1 +
      "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[(addrIndex)].PARTNER2 + "\',RELATIONSHIPCATEGORY=\'" +
      fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
      fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[(addrIndex)].ADDRESS_NUMBER + "\',COMM_TYPE=\'" +
      fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[(addrIndex)], deletedEntry.entity +
       "/results/" + vItemId + "/COMM_TYPE") + "\',CONSNUMBER=\'" +
      fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[(addrIndex)], deletedEntry.entity +
       "/results/" + vItemId + "/CONSNUMBER") + "\',VALIDUNTILDATE=datetime\'" + escape(vValidDateformat) + "\')";

     fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.push(deletedEntry);
    }

   }

  }

  if (iconId.indexOf("telCPCancel") !== -1 || iconId.indexOf("faxCPCancel") !== -1 || iconId.indexOf("mobCPCancel") !== -1 || iconId.indexOf(
    "emailCPCancel") !== -1) {
   for (var k = 0; k < (formElement.getFields().length - 1); k++) {
    var field = formElement.getFields()[k];
    if (field.getValue() !== "") {
     field.setValueState("None");
     field.setValue("");
    }
   }
   //iconId.setNoTabStop(false);
  } else {
   formElement.destroyFields();
   formContainer.removeFormElement(formElement.getId());
  }
  //Logic to enable disable the Cancel button of the first record in a WP of Email/Phone/Mobile/fax
  if (oEvent.getSource().getId().split("-")[0] === "telCPCancel" || oEvent.getSource().getId().split("-")[0] === "faxCPCancel" || oEvent.getSource()
   .getId().split("-")[0] === "mobCPCancel" ||
   oEvent.getSource().getId().split("-")[0] === "emailCPCancel") {
   var id = formElement.getFields()[0].getId();
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(id, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
 },

 onTelCountryKeyChange: function(oEvent) {
  var oTelCountry = oEvent.getParameters().id;
  var idTel = oTelCountry;
  oTelCountry = sap.ui.getCore().byId(oTelCountry);
  var country = oTelCountry.getValue().toUpperCase();
  oTelCountry.setValue(country);
  fcg.mdg.editbp.handlers.ContactPersonCreate.CountryKey(oEvent, oTelCountry);
  //check if it is the first record
  if (idTel.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idTel, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
 },

 disableEnableIcon: function(id, sMethod) {
  var entity = id.split('-')[1];
  var idName;
  switch (entity) {
   case "BP_WorkplaceCommPhonesRel":
    idName = "telCPCancel-" + (id.split('-')[4]);
    if (sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-COUNTRY-0-" + (id.split('-')[4])).getValue() === "" &&
     sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-TELEPHONE-0-" + (id.split('-')[4])).getValue() === "" &&
     sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-EXTENSION-0-" + (id.split('-')[4])).getValue() === "") {
     if (sap.ui.getCore().byId(idName).hasListeners("press") === true) {
      sap.ui.getCore().byId(idName).detachEvent("press");
      sap.ui.getCore().byId(idName).detachPress(sMethod);
      sap.ui.getCore().byId(idName).addStyleClass("sapGreyCell");

     }

    } else {
     // sap.ui.getCore().byId(idName).
     if (sap.ui.getCore().byId(idName).hasListeners("press") === false) {
      sap.ui.getCore().byId(idName).attachPress(sMethod);
      sap.ui.getCore().byId(idName).removeStyleClass("sapGreyCell");
     }

    }
    break;
   case "BP_WorkplaceCommMobilesRel":
    idName = "mobCPCancel-" + (id.split('-')[4]);
    if (sap.ui.getCore().byId("INP-BP_WorkplaceCommMobilesRel-COUNTRY-0-" + (id.split('-')[4])).getValue() === "" &&
     sap.ui.getCore().byId("INP-BP_WorkplaceCommMobilesRel-TELEPHONE-0-" + (id.split('-')[4])).getValue() === "") {
     if (sap.ui.getCore().byId(idName).hasListeners("press") === true) {
      sap.ui.getCore().byId(idName).detachEvent("press");
      sap.ui.getCore().byId(idName).detachPress(sMethod);
      sap.ui.getCore().byId(idName).addStyleClass("sapGreyCell");
     }
    } else {
     if (sap.ui.getCore().byId(idName).hasListeners("press") === false) {
      sap.ui.getCore().byId(idName).attachPress(sMethod);
      sap.ui.getCore().byId(idName).removeStyleClass("sapGreyCell");
     }
    }
    break;
   case "BP_WorkplaceCommFaxesRel":
    idName = "faxCPCancel-" + (id.split('-')[4]);
    if (sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-COUNTRY-0-" + (id.split('-')[4])).getValue() === "" &&
     sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-FAX-0-" + (id.split('-')[4])).getValue() === "" &&
     sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-EXTENSION-0-" + (id.split('-')[4])).getValue() === "") {
     if (sap.ui.getCore().byId(idName).hasListeners("press") === true) {
      sap.ui.getCore().byId(idName).detachEvent("press");
      sap.ui.getCore().byId(idName).detachPress(sMethod);
      sap.ui.getCore().byId(idName).addStyleClass("sapGreyCell");
     }
    } else {
     if (sap.ui.getCore().byId(idName).hasListeners("press") === false) {
      sap.ui.getCore().byId(idName).attachPress(sMethod);
      sap.ui.getCore().byId(idName).removeStyleClass("sapGreyCell");
     }
    }
    break;

   case "BP_WorkplaceCommEMailsRel":
    idName = "emailCPCancel-" + (id.split('-')[4]);
    if (sap.ui.getCore().byId("INP-BP_WorkplaceCommEMailsRel-E_MAIL-0-" + (id.split('-')[4])).getValue() === "") {
     if (sap.ui.getCore().byId(idName).hasListeners("press") === true) {
      sap.ui.getCore().byId(idName).detachEvent("press");
      sap.ui.getCore().byId(idName).detachPress(sMethod);
      sap.ui.getCore().byId(idName).addStyleClass("sapGreyCell");
     }
    } else {
     if (sap.ui.getCore().byId(idName).hasListeners("press") === false) {
      sap.ui.getCore().byId(idName).attachPress(sMethod);
      sap.ui.getCore().byId(idName).removeStyleClass("sapGreyCell");
     }
    }
    break;
  }

 },

 onMobCountryKeyChange: function(oEvent) {
  var oMobCountry = oEvent.getParameters().id;
  var idMob = oMobCountry;
  oMobCountry = sap.ui.getCore().byId(oMobCountry);
  var country = oMobCountry.getValue().toUpperCase();
  oMobCountry.setValue(country);
  fcg.mdg.editbp.handlers.ContactPersonCreate.CountryKey(oEvent, oMobCountry);
  //Check if the mobile is the first mobile
  if (idMob.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idMob, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
 },

 onFaxCountryKeyChange: function(oEvent) {
  var oFaxCountry = oEvent.getParameters().id;
  var idFax = oFaxCountry;
  oFaxCountry = sap.ui.getCore().byId(oFaxCountry);
  var country = oFaxCountry.getValue().toUpperCase();
  oFaxCountry.setValue(country);
  fcg.mdg.editbp.handlers.ContactPersonCreate.CountryKey(oEvent, oFaxCountry);
  if (idFax.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idFax, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
 },

 CountryKey: function(oEvent, fieldId) {
  this.ChangeDeferred = jQuery.Deferred();
  fieldId.attachEventOnce("change", function() {

  }, this);
  var that = this;
  var country = fieldId.getValue();
  var countryNoSpaces = country.replace(/^[ ]+|[ ]+$/g, '');
  var oController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = oController.i18nBundle;
  var oCountryResult = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;

  var id = oEvent.getParameters().id;
  var itemId = id.split("-")[3];
  var wpId = id.split("-")[4];
  var telephone = "",
   extension = "";

  if (id.indexOf("INP-BP_WorkplaceCommPhonesRel") !== -1) {
   telephone = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-TELEPHONE-" + itemId + "-" + wpId).getValue();
   extension = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-EXTENSION-" + itemId + "-" + wpId).getValue();
  } else if (id.indexOf("INP-BP_WorkplaceCommFaxesRel") !== -1) {
   telephone = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-FAX-" + itemId + "-" + wpId).getValue();
   extension = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-EXTENSION-" + itemId + "-" + wpId).getValue();
  } else {
   telephone = sap.ui.getCore().byId("INP-BP_WorkplaceCommMobilesRel-TELEPHONE-" + itemId + "-" + wpId).getValue();
  }

  if (countryNoSpaces !== "") {
   //-------------- Existence Check -------------------------------
   var langExists = false;
   for (var i = 0; i < oCountryResult.results.length; i++) {
    if (oCountryResult.results[i].KEY === countryNoSpaces) {
     if (country !== "") {
      fieldId.setValueState("None");
      fieldId.setValueStateText("");
      if (telephone !== "" || extension !== "") {
       fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
      }
     }
     langExists = true;
     break;
    }
   }
   if (langExists === false) {
    //If correspondence language is not found, raise an error
    this.countryError = true;
    fieldId.setValueState("Error");
    var errorMsg = i18.getText("PLACEHOLDER_COUNTRY_KEY") + " " + fieldId.getValue() + " " + i18.getText("NO_EXISTENCE");
    fieldId.setValueStateText(errorMsg);
   }
  } else {
   var telId = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-TELEPHONE-" + itemId + "-" + wpId);
   var telExt = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-EXTENSION-" + itemId + "-" + wpId);
   var mobId = sap.ui.getCore().byId("INP-BP_WorkplaceCommMobilesRel-TELEPHONE-" + itemId + "-" + wpId);
   var faxId = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-FAX-" + itemId + "-" + wpId);
   var faxExt = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-EXTENSION-" + itemId + "-" + wpId);

   if (fieldId.getId().indexOf("INP-BP_WorkplaceCommPhonesRel-COUNTRY") > -1 && (telId.getValue() !== "" || telExt.getValue() !== "")) {
    fieldId.setValueState("Error");
    fieldId.setValueStateText(i18.getText("COUNTRY_CHECK"));
   } else if (fieldId.getId().indexOf("INP-BP_WorkplaceCommMobilesRel-COUNTRY") > -1 && mobId.getValue() !== "") {
    fieldId.setValueState("Error");
    fieldId.setValueStateText(i18.getText("COUNTRY_CHECK"));
   } else if (fieldId.getId().indexOf("INP-BP_WorkplaceCommFaxesRel-COUNTRY") > -1 && (faxId.getValue() !== "" || faxExt.getValue() !==
     "")) {
    fieldId.setValueState("Error");
    fieldId.setValueStateText(i18.getText("COUNTRY_CHECK"));
   } else {
    fieldId.setValue(countryNoSpaces);
    fieldId.setValueStateText("");
    fieldId.setValueState("None");
   }
   that.ChangeDeferred.resolve();
  }
  // fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onTelephoneChange: function(oEvent) {
  var oController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = oController.i18nBundle;
  var telId = oEvent.getParameters().id;
  var idTel = telId;
  var countryKey = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-COUNTRY-" + telId.split('-')[3] + "-" + telId.split('-')[4]);
  var extension = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-EXTENSION-" + telId.split('-')[3] + "-" + telId.split('-')[4]);
  telId = sap.ui.getCore().byId(telId);

  var tele = telId.getValue();
  var str = tele.replace(/^[ ]+|[ ]+$/g, '');
  telId.setValue(str);
  telId.setValueState("None");

  var checkTele = fcg.mdg.editbp.handlers.ContactPersonCreate._checkNumber(str);
  if (checkTele === false) {
   telId.setValueState("Error");
   return;
  }
  var exlen = extension.getValue().trim();
  var length = str.length + exlen.length;

  if (length > 24) {
   telId.setValueState("Error");
   telId.setValueStateText(i18.getText("NUM_LENGTH"));
  }
  if (str !== "" || exlen !== "") {
   if (countryKey.getValue() === "") {
    countryKey.setValueState("Error");
    countryKey.setValueStateText(i18.getText("COUNTRY_CHECK"));

   } else {
    if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
     countryKey.setValueState("None");
     countryKey.setValueStateText("");
    }
   }
  } else {
   if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
    countryKey.setValueState("None");
    countryKey.setValueStateText("");
   }
  }
  //check if the Telephone is the first telephone
  if (idTel.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idTel, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
  countryKey.fireEvent("change");
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onExtensionChange: function(oEvent) {
  var oController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = oController.i18nBundle;
  var telExtId = oEvent.getParameters().id;
  var idTel = telExtId;
  var countryKey = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-COUNTRY-" + telExtId.split('-')[3] + "-" + telExtId.split('-')[4]);
  var telephoneId = sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-TELEPHONE-" + telExtId.split('-')[3] + "-" + telExtId.split('-')[
   4]);
  telExtId = sap.ui.getCore().byId(telExtId);

  var extension = telExtId.getValue().trim();
  var str = extension.replace(/^[ ]+|[ ]+$/g, '');
  telExtId.setValue(str);
  telExtId.setValueState("None");

  var checkExt = fcg.mdg.editbp.handlers.ContactPersonCreate._checkNumber(str);
  if (checkExt === false) {
   telExtId.setValueState("Error");
   return;
  }
  var telen = telephoneId.getValue();
  var length = telen.length + str.length;

  if (length > 24) {
   telExtId.setValueState("Error");
   telExtId.setValueStateText(i18.getText("NUM_LENGTH"));
  }
  if (telen !== "" || str !== "") {
   if (countryKey.getValue() === "") {
    countryKey.setValueState("Error");
    countryKey.setValueStateText(i18.getText("COUNTRY_CHECK"));

   } else {
    if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
     countryKey.setValueState("None");
     countryKey.setValueStateText("");
    }
   }
  } else {
   if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
    countryKey.setValueState("None");
    countryKey.setValueStateText("");
   }
  }
  //logic to disable / enable the cancel button
  if (idTel.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idTel, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onFaxChange: function(oEvent) {
  var oController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = oController.i18nBundle;
  var faxId = oEvent.getParameters().id;
  var idFax = faxId;
  var countryKey = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-COUNTRY-" + faxId.split('-')[3] + "-" + faxId.split('-')[4]);
  var extension = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-EXTENSION-" + faxId.split('-')[3] + "-" + faxId.split('-')[4]);
  faxId = sap.ui.getCore().byId(faxId);

  var fax = faxId.getValue().trim();
  var str = fax.replace(/^[ ]+|[ ]+$/g, '');
  faxId.setValue(str);
  faxId.setValueState("None");

  var checkFax = fcg.mdg.editbp.handlers.ContactPersonCreate._checkNumber(str);
  if (checkFax === false) {
   faxId.setValueState("Error");
   return;
  }
  var exlen = extension.getValue();
  var length = str.length + exlen.length;

  if (length > 24) {
   faxId.setValueState("Error");
   faxId.setValueStateText(i18.getText("FAX_NUM_LENGTH"));
  }
  if (str !== "" || exlen !== "") {
   if (countryKey.getValue() === "") {
    countryKey.setValueState("Error");
    countryKey.setValueStateText(i18.getText("COUNTRY_CHECK"));

   } else {
    if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
     countryKey.setValueState("None");
     countryKey.setValueStateText("");
    }
   }
  } else {
   if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
    countryKey.setValueState("None");
    countryKey.setValueStateText("");
   }
  }
  if (idFax.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idFax, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
  countryKey.fireEvent("change");
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onFaxExtensionChange: function(oEvent) {
  var oController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = oController.i18nBundle;
  var faxExtId = oEvent.getParameters().id;
  var idFax = faxExtId;
  var countryKey = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-COUNTRY-" + faxExtId.split('-')[3] + "-" + faxExtId.split('-')[4]);
  var faxId = sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-FAX-" + faxExtId.split('-')[3] + "-" + faxExtId.split('-')[4]);
  faxExtId = sap.ui.getCore().byId(faxExtId);

  var extension = faxExtId.getValue().trim();
  var str = extension.replace(/^[ ]+|[ ]+$/g, '');
  faxExtId.setValue(str);
  faxExtId.setValueState("None");

  var checkExt = fcg.mdg.editbp.handlers.ContactPersonCreate._checkNumber(str);
  if (checkExt === false) {
   faxExtId.setValueState("Error");
   return;
  }
  var faxLen = faxId.getValue();
  var length = faxLen.length + str.length;

  if (length > 24) {
   faxExtId.setValueState("Error");
   faxExtId.setValueStateText(i18.getText("FAX_NUM_LENGTH"));
   return;
  }
  if (faxLen !== "" || str !== "") {
   if (countryKey.getValue() === "") {
    countryKey.setValueState("Error");
    countryKey.setValueStateText(i18.getText("COUNTRY_CHECK"));

   } else {
    if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
     countryKey.setValueState("None");
     countryKey.setValueStateText("");
    }
   }
  } else {
   if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
    countryKey.setValueState("None");
    countryKey.setValueStateText("");
   }
  }
  if (idFax.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idFax, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onMobChange: function(oEvent) {
  var oController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = oController.i18nBundle;
  var mobId = oEvent.getParameters().id;
  var idMob = mobId;
  var countryKey = sap.ui.getCore().byId("INP-BP_WorkplaceCommMobilesRel-COUNTRY-" + mobId.split('-')[3] + "-" + mobId.split('-')[4]);
  mobId = sap.ui.getCore().byId(mobId);

  var mobNum = mobId.getValue().trim();
  var str = mobNum.replace(/^[ ]+|[ ]+$/g, '');
  mobId.setValue(str);
  mobId.setValueState("None");

  var checkMob = fcg.mdg.editbp.handlers.ContactPersonCreate._checkNumber(str);
  if (checkMob === false || str.length > 24) {
   mobId.setValueState("Error");
   return;
  }

  if (mobNum !== "") {
   if (countryKey.getValue() === "") {
    countryKey.setValueState("Error");
    countryKey.setValueStateText(i18.getText("COUNTRY_CHECK"));

   } else {
    if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
     countryKey.setValueState("None");
     countryKey.setValueStateText("");
    }
   }
  } else {
   if (i18.getText("COUNTRY_CHECK") === countryKey.getValueStateText()) {
    countryKey.setValueState("None");
    countryKey.setValueStateText("");
   }
  }
  if (idMob.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idMob, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
  countryKey.fireEvent("change");
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onEMailChange: function(oEvent) {
  var oController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = oController.i18nBundle;
  var emailId = oEvent.getParameters().id;
  var idEmail = emailId;
  emailId = sap.ui.getCore().byId(emailId);

  var email = emailId.getValue();
  if (email.replace(/^[ ]+|[ ]+$/g, '') === "") {
   emailId.setValue("");
  }

  if (emailId.getValue() !== "") {
   var vEmail = fcg.mdg.editbp.handlers.ContactPersonCreate._checkEmail(email);
   if (vEmail === false) {
    emailId.setValueState("Error");
    emailId.setValueStateText(i18.getText("EMAIL_CHECK"));
   } else {
    emailId.setValueState("None");
    emailId.setValueStateText();
   }
  } else {
   emailId.setValueState("None");
   emailId.setValueStateText();
  }
  if (idEmail.split("-")[3] === "0") {
   fcg.mdg.editbp.handlers.ContactPersonCreate.disableEnableIcon(idEmail, fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 _checkEmail: function(sEmail) {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(sEmail)) {
   return false;
  }
 },
 _checkNumber: function(sNumber) {
  var filter = /[^a-zA-Z0-9#\*\(\)\-,\s\/+]/;
  if (filter.test(sNumber)) {
   return false;
  }
 },

 //***************IAV in CP ******************//
 addNewIAV: function(oEvent) {
  var oLocalIns = fcg.mdg.editbp.handlers.ContactPersonCreate;
  if (oLocalIns.oExistingIav === "") {
   oLocalIns.oWPIavModel = "";
  }

  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var elements = [];
  var formContainer = "";
  var formElementIndex = "";
  var wpFormIndex = "";
  var formId = fcg.mdg.editbp.handlers.ContactPerson.oIavFormId;
  if (oEvent !== undefined) {
   formContainer = oEvent.getSource().getParent().getParent().getParent();
   formElementIndex = formContainer.getFormElements().indexOf(oEvent.getSource().getParent().getParent());
   wpFormIndex = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getId();
   wpFormIndex = wpFormIndex.split("-")[1];
  } else {
   wpFormIndex = fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1;
   var formName = "SFWpAddressEdit-" + wpFormIndex + "--Form";
   // var iavName = "SFIAVPersonForCPEdit-" + formId + "-" + wpFormIndex;
   var oForm = sap.ui.getCore().byId(formName);
   formContainer = oForm.getFormContainers()[0];
   formElementIndex = formElementIndex = formContainer.getFormElements().length;
  }

  var preIav = sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS-" + (formId - 1) + "-" + wpFormIndex);
  if (preIav !== undefined && preIav.getSelectedKey() === "") {
   return;
  }
  var iavIndex = fcg.mdg.editbp.handlers.ContactPersonCreate.getIAVIndex(oEvent);
  if (fcg.mdg.editbp.handlers.ContactPerson.oWpIavResults.results[iavIndex].IAV.length < 1) {
   return;
  }

  fcg.mdg.editbp.handlers.ContactPerson.oIavFormId = formId + 1;
  var oNewForm = new sap.ui.layout.form.SimpleForm({
   id: "SFIAVPersonForCPEdit-" + formId + "-" + wpFormIndex,
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

  fcg.mdg.editbp.handlers.ContactPersonCreate.addIavToolBar(oNewForm, wizardController); //creating iav toolbar dynamically parameter as form, formContainer & formElement
  var fieldAddrversionlbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("ADDRESSVERSION")
  });
  oNewForm.addContent(fieldAddrversionlbl);
  var fieldAddrversion = new sap.m.Select({
   id: "INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS-" + formId + "-" + wpFormIndex,
   change: fcg.mdg.editbp.handlers.ContactPersonCreate.onIavAddressChange
  });
  //for value help of Address Version
  var sDefaultText = wizardController.i18nBundle.getText("NONE");
  var oTVModel = new sap.ui.model.json.JSONModel();

  var iav = fcg.mdg.editbp.handlers.ContactPerson.getWPIavArray();
  oTVModel.setData(iav.results[iavIndex]);

  var fieldAddrversionValuesTemp = new sap.ui.core.Item({
   key: "{ADDR_VERS}",
   text: "{ADDR_VERS__TXT}"
  });
  fieldAddrversion.setModel(oTVModel);
  fieldAddrversion.bindItems("/IAV", fieldAddrversionValuesTemp);

  if (iav.results[iavIndex].IAV.length > 1) {
   var emptyValue = new sap.ui.core.Item({
    key: "",
    text: sDefaultText
   });
   fieldAddrversion.addItem(emptyValue);
   fieldAddrversion.setSelectedKey();
  } else {
   fieldAddrversion.setSelectedItem(fieldAddrversion.getItems()[0]);
  }
  oNewForm.addContent(fieldAddrversion);

  var fieldTitleName1lbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("N1")
  });
  var fieldTitle = new sap.m.Select({
   id: "INP-BP_WorkplaceIntPersVersionRel-TITLE-" + formId + "-" + wpFormIndex,
   change: fcg.mdg.editbp.handlers.ContactPerson.onChange_Create,
   enabled: false
  });
  fcg.mdg.editbp.handlers.ContactPersonCreate.setvHelpTitle(fieldTitleName1lbl, fieldTitle);
  oNewForm.addContent(fieldTitleName1lbl);
  oNewForm.addContent(fieldTitle);

  var fieldName1 = new sap.m.Input({
   id: "INP-BP_WorkplaceIntPersVersionRel-FIRSTNAME-" + formId + "-" + wpFormIndex,
   value: "{WpIavPers>/FIRSTNAME}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.ContactPerson.onChange_Create,
   enabled: false
  });
  oNewForm.addContent(fieldName1);

  var fieldTitleName2lbl = new sap.m.Label({
   text: wizardController.i18nBundle.getText("L_Name")
  });
  oNewForm.addContent(fieldTitleName2lbl);

  var fieldName2 = new sap.m.Input({
   id: "INP-BP_WorkplaceIntPersVersionRel-LASTNAME-" + formId + "-" + wpFormIndex,
   value: "{WpIavPers>/LASTNAME}",
   maxLength: 30,
   change: fcg.mdg.editbp.handlers.ContactPerson.onChange_Create,
   enabled: false
  });
  oNewForm.addContent(fieldName2);

  var lblDepartment = new sap.m.Label({
   text: wizardController.i18nBundle.getText("DEPARTMENT")
  });
  oNewForm.addContent(lblDepartment);

  var inpDepartment = new sap.m.Input({
   id: "INP-BP_WorkplaceIntAddressVersRel-Department-" + formId + "-" + wpFormIndex,
   value: "{wpIav>/DEPARTMENT}",
   maxLength: 40,
   change: fcg.mdg.editbp.handlers.ContactPerson.onChange_Create,
   enabled: false
  });
  oNewForm.addContent(inpDepartment);

  var lblFunction = new sap.m.Label({
   text: wizardController.i18nBundle.getText("FUNCTION")
  });
  oNewForm.addContent(lblFunction);

  var inpFunction = new sap.m.Input({
   id: "INP-BP_WorkplaceIntAddressVersRel-Function-" + formId + "-" + wpFormIndex,
   value: "{wpIav>/FUNCTION}",
   maxLength: 40,
   change: fcg.mdg.editbp.handlers.ContactPerson.onChange_Create,
   enabled: false
  });
  oNewForm.addContent(inpFunction);
  var emptyVBox = new sap.m.VBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L12 M12 S12",
    linebreak: true
   })
  });
  emptyVBox.addItem(oNewForm);

  elements.push(emptyVBox);
  var newtelFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  formContainer.insertFormElement(newtelFormElement, formElementIndex);
  fcg.mdg.editbp.handlers.ContactPerson.oIavNewForm = oNewForm;

  if (iav.results[iavIndex].IAV.length === 1) {
   sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS-" + formId + "-" + wpFormIndex).fireEvent('change');
   sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS-" + formId + "-" + wpFormIndex).setEnabled(false);
  }
  if (sap.ui.getCore().byId("toolWPIavAdd-" + wpFormIndex).hasListeners("press") === true) {
   sap.ui.getCore().byId("toolWPIavAdd-" + wpFormIndex).detachEvent("press");
   sap.ui.getCore().byId("toolWPIavAdd-" + wpFormIndex).detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addNewIAV);
   sap.ui.getCore().byId("toolWPIavAdd-" + wpFormIndex).addStyleClass("sapGreyCell");
  }
  if (oLocalIns.oExistingIav === "X") {
   var oPersIavMdl = new sap.ui.model.json.JSONModel();
   oPersIavMdl.setData(oLocalIns.oWPIavModel.getData().BP_WorkplaceIntPersVersionRel);
   // for(var r = 0; r < fcg.mdg.editbp.handlers.ContactPerson.oWpAddressResults.results.length; r++) {
   //  if(fcg.mdg.editbp.handlers.ContactPerson.oWpAddressResults.results[r].AD_ID === fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().ADDRESS_NUMBER) {
   sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS-" + formId + "-" + wpFormIndex).setSelectedKey(oLocalIns.oWPIavModel
    .getData().ADDR_VERS);
   sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS-" + formId + "-" + wpFormIndex).fireEvent("change");
   sap.ui.getCore().byId("SFIAVPersonForCPEdit-" + formId + "-" + wpFormIndex).setModel(oLocalIns.oWPIavModel, "wpIav");
   sap.ui.getCore().byId("SFIAVPersonForCPEdit-" + formId + "-" + wpFormIndex).setModel(oPersIavMdl, "WpIavPers");
   sap.ui.getCore().byId("INP-BP_WorkplaceIntPersVersionRel-TITLE-" + formId + "-" + wpFormIndex).setSelectedKey(oLocalIns.oWPIavModel.getData()
    .BP_WorkplaceIntPersVersionRel
    .TITLE_P);
   oLocalIns.oExistingIav = "";
   //  }
   // }
  }
 },

 removeIavForm: function(oEvent) {
  var oWizController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var oFormId = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getId();
  var vboxId = sap.ui.getCore().byId(oFormId).getParent();
  var wpFormId = vboxId.getParent().getParent().getParent().getParent().getId();
  var wpIndex = wpFormId.split("-")[1];
  wpFormId = sap.ui.getCore().byId(wpFormId + "--Form");
  var formIndex = oFormId.split("-")[1];
  var AddVersId = sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS-" + formIndex + "-" + wpIndex);
  var iavIndex = fcg.mdg.editbp.handlers.ContactPersonCreate.getIAVIndex(oEvent);

  fcg.mdg.editbp.handlers.ContactPerson.oController.oWizard.validateStep(fcg.mdg.editbp.handlers.ContactPerson.oController.getView().byId(
   "editStep"));
  if (AddVersId.getSelectedKey() !== undefined && AddVersId.getSelectedKey() !== "") {
   var obj = {};
   obj.ADDR_VERS = AddVersId.getSelectedKey();
   obj.ADDR_VERS__TXT = AddVersId.getSelectedItem().getText();
   fcg.mdg.editbp.handlers.ContactPerson.oWpIavResults.results[iavIndex].IAV.push(obj);
  }

  if (fcg.mdg.editbp.handlers.ContactPerson.oController.vCurrentActionId === "createRB") {
   var createdArray = fcg.mdg.editbp.handlers.ContactPerson.oController.createdArray;
   for (var j = 0; j < createdArray.length; j++) {
    if (createdArray[j].wpKey === wpIndex && createdArray[j].currentEntityKey === formIndex && (createdArray[j].entity ===
      "BP_WorkplaceIntPersVersionRel" || createdArray[j].entity === "BP_WorkplaceIntAddressVersRel")) {
     createdArray.splice(j, 1);
     j--;
    }
   }
  }

  // logic to delete the IAV in Change mode
  if (fcg.mdg.editbp.handlers.ContactPersonChange.oController.vCurrentActionId === "changeRB") {
   var deletedEntry = {};

   for (var i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.length; i++) {
    if (
     // fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].action === "N" &&
     fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].wpKey === wpIndex &&
     fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].currentEntityKey === formIndex &&
     (fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].entity === "BP_WorkplaceIntAddressVersRel" ||
      fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray[i].entity === "BP_WorkplaceIntPersVersionRel")) {
     fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.splice(i, 1);
     i = i - 1;
    }

   }
   var addrIndex;
   var id = "INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + wpIndex;
   var addrId = sap.ui.getCore().byId(id).getSelectedKey();
   for (var l = 0; l < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length; l++) {
    if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[l].ADDRESS_NUMBER === addrId) {
     addrIndex = l;
     break;
    }
   }
   deletedEntry.addrIndex = addrIndex;
   if (addrIndex !== undefined) {
    if (formIndex < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceIntAddressVersRel.results.length) {
     if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceIntAddressVersRel.results[formIndex].action ===
      "N") {
      fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[addrIndex].BP_WorkplaceIntAddressVersRel.results.splice(formIndex, 1);
     } else {
      deletedEntry.entity = "BP_WorkplaceIntAddressVersRel";
      deletedEntry.currentEntityKey = formIndex;
      deletedEntry.wpKey = wpIndex;
      deletedEntry.action = "D";
      var vValidDateformat = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].VALIDUNTILDATE;
      vValidDateformat = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(vValidDateformat);
      deletedEntry.currentkey = "(BP_GUID=" + oWizController.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
        parseInt(addrIndex)].PARTNER1 +
       "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].PARTNER2 +
       "\',RELATIONSHIPCATEGORY=\'" +
       fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" +
       fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)].ADDRESS_NUMBER + "\',ADDR_VERS=\'" +
       fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(addrIndex)],
        deletedEntry.entity + "/results/" + formIndex + "/ADDR_VERS") + "\',VALIDUNTILDATE=datetime\'" +
       escape(vValidDateformat) + "\')";

      fcg.mdg.editbp.handlers.ContactPersonChange.oController.changedArray.push(deletedEntry);
     }
    }
   }

  }

  var FormContainer = wpFormId.getFormContainers()[0];
  var removeIndex = FormContainer.getFormElements().indexOf(vboxId.getParent());
  FormContainer.getFormElements()[removeIndex].destroyFields();
  FormContainer.removeFormElement(FormContainer.getFormElements()[removeIndex]);
  if (sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).hasListeners("press") === false) {
   sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addNewIAV);
   sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).removeStyleClass("sapGreyCell");
  }
 },

 addIavToolBar: function(oForm, wizardController) {
  var title = new sap.m.Title({
   text: wizardController.i18nBundle.getText("ADDIAV"),
   level: "H4",
   titleStyle: "H4",
   layoutData: new sap.ui.layout.GridData({
    span: "L4 M4 S6",
    linebreak: true
   })
  });
  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1",
    indent: "L0 M3 S3",
    emptySpanL: 0

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
   press: fcg.mdg.editbp.handlers.ContactPersonCreate.removeIavForm,
   tooltip: "Cancel"
  });
  hBox.addItem(iavRemove);
  oForm.addContent(title);
  oForm.addContent(hBox);
 },

 setvHelpTitle: function(vlblField, oField) {
  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var oResults = fcg.mdg.editbp.util.DataAccess.getValueHelpData();
  var sDefaultText = wizardController.i18nBundle.getText("NONE");
  var emptyTitle = new sap.ui.core.Item({
   key: "",
   text: sDefaultText
  });
  var oTVModel = new sap.ui.model.json.JSONModel();
  oTVModel.setData(oResults[3].data);
  var titleValuesTemp = new sap.ui.core.Item({
   key: "{KEY}",
   text: "{TEXT}"
  });
  oField.setModel(oTVModel);
  oField.bindItems("/results", titleValuesTemp);
  oField.addItem(emptyTitle);
  oField.setSelectedKey("");
 },

 setEnabledWPFields: function(wpId) {
  sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Department-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Function-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-COUNTRY-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-TELEPHONE-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommPhonesRel-EXTENSION-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommMobilesRel-COUNTRY-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommMobilesRel-TELEPHONE-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-COUNTRY-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-FAX-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommFaxesRel-EXTENSION-0-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceCommEMailsRel-E_MAIL-0-" + wpId).setEnabled(true);

  var addIconArray = ["telCPAdd-" + wpId, "mobCPAdd-" + wpId, "faxCPAdd-" + wpId, "emailCPAdd-" + wpId];
  var removeIconArray = ["telCPCancel-" + wpId, "mobCPCancel-" + wpId, "faxCPCancel-" + wpId, "emailCPCancel-" + wpId];
  var addIconMethod = [fcg.mdg.editbp.handlers.ContactPersonCreate.addNewTel, fcg.mdg.editbp.handlers.ContactPersonCreate.addNewMob, fcg.mdg
   .editbp.handlers.ContactPersonCreate.addNewFax, fcg.mdg.editbp.handlers.ContactPersonCreate.addNewEmail
  ];
  for (var i = 0; i < addIconArray.length; i++) {
   if (sap.ui.getCore().byId(addIconArray[i]).hasListeners("press") === false) {
    sap.ui.getCore().byId(addIconArray[i]).attachPress(addIconMethod[i]);
    sap.ui.getCore().byId(addIconArray[i]).removeStyleClass("sapGreyCell");
   }

   if (i === 3) {
    break;
   }

   if (sap.ui.getCore().byId(removeIconArray[i]).hasListeners("press") === false) {
    sap.ui.getCore().byId(removeIconArray[i]).attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
    sap.ui.getCore().byId(removeIconArray[i]).removeStyleClass("sapGreyCell");
   }
  }

  //extension hook
  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  wizardController.bpHookSetEnabledWPFields(this, wpId);
 },

 setCountryKeyFields: function(wpId, fieldArray, wizardController) {
  var addArray = [];
  var country = "";
  if (wizardController.isAddressVisited === "X" && wizardController.vCurrentActionId === "createRB") {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oController.oDetailComm.BP_AddressesRel.results;
  } else {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults.BP_AddressesRel.results;
  }
  var adId = sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + wpId).getSelectedKey();
  for (var j = 0; j < addArray.length; j++) {
   if (addArray[j].AD_ID === adId) {
    country = addArray[j].COUNTRY;
    break;
   }
  }

  if (country === "") {
   var createAddrModel = fcg.mdg.editbp.handlers.Communication.oCreateModel;
   for (var k = 0; k < createAddrModel.length; k++) {
    if (createAddrModel[k].body.AD_ID === adId) {
     country = createAddrModel[k].body.COUNTRY;
     break;
    }
   }
  }

  for (var i = 0; i < fieldArray.length; i++) {
   sap.ui.getCore().byId(fieldArray[i]).setValue(country);
  }
 },

 onAddressChange: function(oEvent) {
  var iavIndex = "";
  var id = oEvent.getParameters().id;
  var wpAddArr = fcg.mdg.editbp.handlers.ContactPerson.oWpAddressResults;
  var selKey = sap.ui.getCore().byId(id).getSelectedKey();
  var wpController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var form = oEvent.getSource().getParent().getParent().getParent().getParent().getId();
  var formId = form.split("-")[1];

  var fieldArray = ["INP-BP_WorkplaceCommPhonesRel-COUNTRY-0-" + formId, "INP-BP_WorkplaceCommMobilesRel-COUNTRY-0-" + formId,
   "INP-BP_WorkplaceCommFaxesRel-COUNTRY-0-" + formId
  ];

  fcg.mdg.editbp.handlers.ContactPersonCreate.setEnabledWPFields(formId);
  fcg.mdg.editbp.handlers.ContactPersonCreate.setCountryKeyFields(formId, fieldArray, wpController);

  form = sap.ui.getCore().byId(form);
  fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.push(selKey);
  for (var i = 0; i < wpAddArr.results.length; i++) {
   if (wpAddArr.results[i].AD_ID === selKey) {
    wpAddArr.results.splice(i, 1);
   }
  }
  fcg.mdg.editbp.handlers.ContactPerson.oWpAddressResults = wpAddArr;
  if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel === "") {
   wpController.onChange(oEvent);
  } else {
   var oRelRslts = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results;
   var aAdrnr = [];
   // var vPartner2 = fcg.mdg.editbp.util.Formatter.addLea
   for (var k = 0; k < oRelRslts.length; k++) {
    if (sap.ui.getCore().byId("SF-BP_Relation-partnerId").getValue() === oRelRslts[k].PARTNER2) {
     for (var w = 0; w < oRelRslts[k].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results.length; w++) {
      aAdrnr.push(oRelRslts[k].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[w].ADDRESS_NUMBER);
     }
     if (aAdrnr.indexOf(selKey) === -1) {
      wpController.onChange(oEvent);
     }
    }
   }
  }
  sap.ui.getCore().byId(id).setEnabled(false);
  if (wpAddArr.results.length >= 1 && selKey !== "") {
   if (sap.ui.getCore().byId("toolWPAdd").hasListeners("press") === false) {
    sap.ui.getCore().byId("toolWPAdd").attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
    sap.ui.getCore().byId("toolWPAdd").removeStyleClass("sapGreyCell");
   }
  } else {
   if (sap.ui.getCore().byId("toolWPAdd").hasListeners("press") === true) {
    sap.ui.getCore().byId("toolWPAdd").detachEvent("press");
    sap.ui.getCore().byId("toolWPAdd").detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
    sap.ui.getCore().byId("toolWPAdd").addStyleClass("sapGreyCell");
   }
  }

  var adRes = fcg.mdg.editbp.handlers.ContactPerson.oWpIavResults.results;
  for (var j = 0; j < adRes.length; j++) {
   if (adRes[j].AD_ID === selKey) {
    iavIndex = j;
    break;
   }
  }

  var iavDataRes = fcg.mdg.editbp.handlers.ContactPerson.oWpIavResults.results[iavIndex].IAV;

  if (selKey !== "" && iavDataRes !== undefined && iavDataRes.length !== 0) {
   fcg.mdg.editbp.handlers.ContactPersonCreate.addStaticIavToolBar(form, wpController);
   if (sap.ui.getCore().byId("toolWPIavAdd-" + formId).hasListeners("press") === false) {
    sap.ui.getCore().byId("toolWPIavAdd-" + formId).attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addNewIAV);
    sap.ui.getCore().byId("toolWPIavAdd-" + formId).removeStyleClass("sapGreyCell");
   }
   if (wpController.vCurrentActionId === "changeRB") {
    var oLocalIns = fcg.mdg.editbp.handlers.ContactPersonCreate;
    if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel !== "") {
     if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().BP_WorkplaceIntAddressVersRel !== undefined) {
      for (var iav = 0; iav < fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().BP_WorkplaceIntAddressVersRel.results.length; iav++) {
       if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().BP_WorkplaceIntAddressVersRel.results[iav].action !== "D") {
        oLocalIns.oWPIavModel = new sap.ui.model.json.JSONModel();
        oLocalIns.oWPIavModel.setData(fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().BP_WorkplaceIntAddressVersRel.results[
         iav]);
        oLocalIns.oExistingIav = "X";
        sap.ui.getCore().byId("toolWPIavAdd-" + formId).fireEvent("press");
       }
      }
     }
    }
   }
  }
 },

 addIAV: function() {
  fcg.mdg.editbp.handlers.ContactPersonCreate.oWPIavModel = "";
  fcg.mdg.editbp.handlers.ContactPersonCreate.addNewIAV();
 },

 addStaticIavToolBar: function(oForm, wizardController) {
  var formIndex = oForm.getId().split("-")[1];
  var title = new sap.m.Title({
   text: wizardController.i18nBundle.getText("ADDIAV"),
   level: "H4",
   titleStyle: "H4",
   layoutData: new sap.ui.layout.GridData({
    span: "L4 M4 S6",
    linebreak: true
   })
  });
  var hBox = new sap.m.HBox({
   layoutData: new sap.ui.layout.GridData({
    span: "L1 M1 S1",
    indent: "L0 M3 S3",
    emptySpanL: 0

   })
  });
  var iavAdd = new sap.ui.core.Icon({
   id: "toolWPIavAdd-" + formIndex,
   decorative: false,
   src: "sap-icon://sys-add",
   tooltip: "Add"
  });
  iavAdd.addStyleClass("sapUiSmallMarginEnd");
  hBox.addItem(iavAdd);
  var iavRemove = new sap.ui.core.Icon({
   src: "sap-icon://sys-cancel",
   decorative: false,
   tooltip: "Cancel"
  });
  iavRemove.addStyleClass("sapGreyCell");
  hBox.addItem(iavRemove);

  var oFormCont = sap.ui.getCore().byId(oForm.getId() + "--Form").getFormContainers()[0];
  var elements = [];
  elements.push(title, hBox);
  var newFormElement = new sap.ui.layout.form.FormElement({
   fields: elements
  });
  oFormCont.insertFormElement(newFormElement, oFormCont.getFormElements().length);
  // iavAdd.fireEvent("press");
 },

 setEnabledIAVFields: function(itemId, wpId, iavKey, wpController) {
  var stdAddress = "";
  if (wpController.vCurrentActionId === "createRB") {
   stdAddress = fcg.mdg.editbp.handlers.ContactPerson.standardAddress;
  } else {
   stdAddress = fcg.mdg.editbp.handlers.ContactPersonChange.stdChangeAddress;
  }
  var perIAVDetail = "";

  if (stdAddress !== "" && stdAddress.length > 0) {
   var perIAV = stdAddress[0].BP_AddressVersionsPersRel.results;
   for (var i = 0; i < perIAV.length; i++) {
    if (perIAV[i].ADDR_VERS === iavKey) {
     perIAVDetail = perIAV[i].BP_AddressPersonVersionRel;
    }
   }
  }

  if (perIAVDetail !== "") {
   sap.ui.getCore().byId("INP-BP_WorkplaceIntPersVersionRel-TITLE-" + itemId + "-" + wpId).setSelectedKey(perIAVDetail.TITLE_P);
   sap.ui.getCore().byId("INP-BP_WorkplaceIntPersVersionRel-FIRSTNAME-" + itemId + "-" + wpId).setValue(perIAVDetail.FIRSTNAME);
   sap.ui.getCore().byId("INP-BP_WorkplaceIntPersVersionRel-LASTNAME-" + itemId + "-" + wpId).setValue(perIAVDetail.LASTNAME);
  }

  if (fcg.mdg.editbp.handlers.ContactPerson.vgIsLocked !== true) {
   sap.ui.getCore().byId("INP-BP_WorkplaceIntPersVersionRel-TITLE-" + itemId + "-" + wpId).setEnabled(true);
   sap.ui.getCore().byId("INP-BP_WorkplaceIntPersVersionRel-FIRSTNAME-" + itemId + "-" + wpId).setEnabled(true);
   sap.ui.getCore().byId("INP-BP_WorkplaceIntPersVersionRel-LASTNAME-" + itemId + "-" + wpId).setEnabled(true);
  }
  sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-Department-" + itemId + "-" + wpId).setEnabled(true);
  sap.ui.getCore().byId("INP-BP_WorkplaceIntAddressVersRel-Function-" + itemId + "-" + wpId).setEnabled(true);
 },

 onIavAddressChange: function(oEvent) {
  var id = oEvent.getParameters().id;
  var wpIavArr = fcg.mdg.editbp.handlers.ContactPerson.oWpIavResults;
  var selKey = sap.ui.getCore().byId(id).getSelectedKey();
  var wpController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var form = oEvent.getSource().getParent().getParent().getParent().getParent().getId();
  form = sap.ui.getCore().byId(form);
  var wpIndex = form.getParent().getParent().getParent().getParent().getParent().getId();
  wpIndex = wpIndex.split("-")[1];
  var iavIndex = fcg.mdg.editbp.handlers.ContactPersonCreate.getIAVIndexForIAVForm(oEvent);

  fcg.mdg.editbp.handlers.ContactPersonCreate.setEnabledIAVFields(id.split("-")[3], id.split("-")[4], selKey, wpController);

  for (var i = 0; i < wpIavArr.results[iavIndex].IAV.length; i++) {
   if (wpIavArr.results[iavIndex].IAV[i].ADDR_VERS === selKey) {
    wpIavArr.results[iavIndex].IAV.splice(i, 1);
   }
  }
  fcg.mdg.editbp.handlers.ContactPerson.oWpIavResults = wpIavArr;
  var oLocalIns = fcg.mdg.editbp.handlers.ContactPersonCreate;
  if (oLocalIns.oExistingIav === "") {
   wpController.onChange(oEvent);
  } else {
   var oRelRslts = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results;
   var aAdrnr = [];
   // var vPartner2 = fcg.mdg.editbp.util.Formatter.addLea
   for (var k = 0; k < oRelRslts.length; k++) {
    if (sap.ui.getCore().byId("SF-BP_Relation-partnerId").getValue() === oRelRslts[k].PARTNER2) {
     for (var w = 0; w < fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().BP_WorkplaceIntAddressVersRel.results.length; w++) {
      aAdrnr.push(fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel.getData().BP_WorkplaceIntAddressVersRel.results[w].ADDR_VERS);
     }
     if (aAdrnr.indexOf(selKey) === -1) {
      wpController.onChange(oEvent);
     }
    }
   }
  }

  // wpController.onChange(oEvent);
  sap.ui.getCore().byId(id).setEnabled(false);

  if (wpIavArr.results[iavIndex].IAV.length >= 1 && selKey !== "") {
   if (sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).hasListeners("press") === false) {
    sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addNewIAV);
    sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).removeStyleClass("sapGreyCell");
   }
  } else {
   if (sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).hasListeners("press") === true) {
    sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).detachEvent("press");
    sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).detachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addNewIAV);
    sap.ui.getCore().byId("toolWPIavAdd-" + wpIndex).addStyleClass("sapGreyCell");
   }
  }
 },

 getIAVIndex: function(evt) {
  var iavIndex = "",
   addVersion, addArray = "";
  var formContainer = evt.getSource().getParent().getParent().getParent();
  var elements = formContainer.getFormElements()[1];
  var field = elements.getFields();
  var id = field[0].getId();
  if (id.indexOf("INP-BP_WorkplaceIntAddressVersRel-ADDR_VERS") !== -1) {
   var wpIndex = id.split("-")[4];
   addVersion = sap.ui.getCore().byId("INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + wpIndex);
   addVersion = addVersion.getSelectedKey();
  } else {
   addVersion = field[0].getSelectedKey();
  }

  if (fcg.mdg.editbp.handlers.ContactPerson.oController.isAddressVisited === "X") {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oController.oDetailComm.BP_AddressesRel.results;
  } else {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults.BP_AddressesRel.results;
  }

  for (var j = 0; j < addArray.length; j++) {
   if (addArray[j].AD_ID === addVersion) {
    iavIndex = j;
    return iavIndex;
   }
  }

  if (iavIndex === "") {
   var createAddrModel = fcg.mdg.editbp.handlers.Communication.oCreateModel;
   for (var k = 0; k < createAddrModel.length; k++) {
    if (createAddrModel[k].body.AD_ID === addVersion) {
     iavIndex = addArray.length + k;
     return iavIndex;
    }
   }
  }
 },

 getIAVIndexForIAVForm: function(evt) {
  var iavIndex = "",
   addArray = "";
  var formContainer = evt.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getParent();
  var elements = formContainer.getFormElements()[1];
  var field = elements.getFields();
  var addVersion = field[0].getSelectedKey();

  if (fcg.mdg.editbp.handlers.ContactPerson.oController.isAddressVisited === "X") {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oController.oDetailComm.BP_AddressesRel.results;
  } else {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults.BP_AddressesRel.results;
  }

  for (var j = 0; j < addArray.length; j++) {
   if (addArray[j].AD_ID === addVersion) {
    iavIndex = j;
    return iavIndex;
   }
  }

  if (iavIndex === "") {
   var createAddrModel = fcg.mdg.editbp.handlers.Communication.oCreateModel;
   for (var k = 0; k < createAddrModel.length; k++) {
    if (createAddrModel[k].body.AD_ID === addVersion) {
     iavIndex = addArray.length + k;
     return iavIndex;
    }
   }
  }
 },

 deleteWorkplaceAddress: function() {
  var layout = fcg.mdg.editbp.handlers.ContactPerson.oController.getView().byId("editLayout");
  for (var i = 2; i < layout.getContent().length - 1; i++) {
   layout.removeContent(layout.getContent()[i]);
   i--;
  }
  fcg.mdg.editbp.handlers.ContactPerson.setWPAddressArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);
  fcg.mdg.editbp.handlers.ContactPerson.setWPIavArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);

  var wizardController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var createdArray = wizardController.createdArray;
  for (var j = 0; j < createdArray.length; j++) {
   if (createdArray[j].hasOwnProperty("wpKey")) {
    createdArray.splice(j, 1);
    j--;
   }
  }

  if (sap.ui.getCore().byId("toolWPAdd").hasListeners("press") === false) {
   sap.ui.getCore().byId("toolWPAdd").attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
   sap.ui.getCore().byId("toolWPAdd").removeStyleClass("sapGreyCell");
  }
 }
};