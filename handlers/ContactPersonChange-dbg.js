/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.ContactPersonChange");

fcg.mdg.editbp.handlers.ContactPersonChange = {
 oController: "",
 oCPDeleteQueryModel: [],
 oCPDeleteModel: [],
 // oWPPhoneModel: [],
 oWPModel: "",
 numPhone: "",
 oWPResults: [],
 ocpRslts: [],
 ocpChangeModel: "",
 oCPData: "",
 aChangedCP: [],
 cpQueryModel: [],
 ocpAddressRslts: [],
 stdChangeAddress: "",
 vChgBpguid2: "",

 editContactPerson: function(results, oController) {
  this.oController = oController;
  if (oController.vCurrentActionId === "deleteRB" && results.BP_RelationsRel.results.length > 0) {
   this.setSelectEntityLayout(results);
   return;
  }

  if (oController.vCurrentActionId === "changeRB" && results.BP_RelationsRel.results.length > 1) {
   this.setSelectEntityLayout(results);
   return;
  } else if (oController.vCurrentActionId === "changeRB" && results.BP_RelationsRel.results.length === 1) {
   oController.getView().byId("actionStep").setNextStep(oController.getView().byId("editStep"));
   this.editContactPersonPage(0, oController);
  }
 },

 setSelectEntityLayout: function(result) {
  var oModel = new sap.ui.model.json.JSONModel();
  var strResults = {
   dataitems: []
  };

  if (this.oController.oCommunicationListRBG === "") {
   this.oController.oCommunicationListRBG = sap.ui.xmlfragment(
    "fcg.mdg.editbp.frag.generic.SelectEntityInstance",
    this.oController);
  } else {
   this.oController.oCommunicationListRBG.destroy();
   this.oController.oCommunicationListRBG = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.SelectEntityInstance", this.oController);
  }

  if (this.oController.vCurrentActionId === "deleteRB") {
   this.oController.getView().byId("actionStep").setNextStep(
    this.oController.getView().byId("editStep"));
   if (this.oController.getView().byId("editLayout").getContent().length > 0) {
    this.oController.getView().byId("editLayout").removeAllContent();
   }
   this.oController.getView().byId("editLayout").setVisible(true);
   this.oController.getView().byId("editLayout").addContent(this.oController.oCommunicationListRBG);
  } else {
   this.oController.getView().byId("actionStep").setNextStep(this.oController.getView().byId("selectEntityInstanceStep"));
   this.oController.getView().byId("selectEntityInstanceLayout").setVisible(true);
   this.oController.getView().byId("selectEntityInstanceLayout").addContent(this.oController.oCommunicationListRBG);
  }

  for (var i = 0; i < result.BP_RelationsRel.results.length; i++) {
   var relDetail = result.BP_RelationsRel.results[i];
   var partnerCode = isNaN(parseInt(relDetail.PARTNER2, 10)) ? relDetail.PARTNER2 : parseInt(relDetail.PARTNER2, 10);
   var oDataItems = {
    "RBText": relDetail.PARTNER2__TXT + "(" + partnerCode + ")"
   };
   strResults.dataitems.push(oDataItems);
  }

  var cpListRBG = sap.ui.getCore().byId("selectDataListRBG");
  oModel.setData(strResults);
  cpListRBG.setModel(oModel);
  cpListRBG.setSelectedIndex(-1);
 },

 editContactPersonPage: function(index, wController) {
  var cpResults, cpAddressResults, vDeletedFlg;
  this.oController = wController;
  var formControlData = "";
  var oModel = new sap.ui.model.json.JSONModel();

  fcg.mdg.editbp.handlers.ContactPerson.setWPAddressArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);
  fcg.mdg.editbp.handlers.ContactPerson.setWPIavArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);

  var relData = fcg.mdg.editbp.handlers.ContactPerson.getRelResults();
  if (this.ocpRslts.length > 0) {
   var apersnRel = [];
   for (var cp = 0; cp < this.ocpRslts.length; cp++) {
    apersnRel.push(fcg.mdg.editbp.util.Formatter.removeLeadingZeroes(this.ocpRslts[cp].PARTNER));
   }
   if (apersnRel.indexOf(relData.BP_RelationsRel.results[index].PARTNER2) === -1) {
    this.getContactPersonAddressData(relData, index);
    cpResults = this.getContactPersonData(relData, index);
   } else {
    cpResults = this.ocpRslts[apersnRel.indexOf(relData.BP_RelationsRel.results[index].PARTNER2)];
   }
  } else {
   this.getContactPersonAddressData(relData, index);
   cpResults = this.getContactPersonData(relData, index);
  }
  var oRelResults = fcg.mdg.editbp.handlers.ContactPerson.oRelResults;
  if (oRelResults.BP_RelationsRel.results.length > 1) {
   wController.getView().byId("selectEntityInstanceStep").setNextStep(wController.getView().byId("editStep"));
  }
  if (this.oController.getView().byId("editLayout").getContent().length > 0) {
   for (var content = 0; content < this.oController.getView().byId("editLayout").getContent().length; content++) {
    this.oController.getView().byId("editLayout").getContent()[content].destroy();
    content--;
   }
  }
  if (fcg.mdg.editbp.handlers.ContactPerson.oContactPersonLayout === "") {
   fcg.mdg.editbp.handlers.ContactPerson.oContactPersonLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditContactPerson", fcg.mdg.editbp
    .handlers.ContactPerson);
  } else {
   fcg.mdg.editbp.handlers.ContactPerson.oContactPersonLayout.destroy();
   fcg.mdg.editbp.handlers.ContactPerson.oContactPersonLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditContactPerson", fcg.mdg.editbp
    .handlers.ContactPerson);
  }
  wController.getView().byId("editLayout").setVisible(true);
  wController.getView().byId("editLayout").removeAllContent();
  wController.getFileUploadData("editLayout");
  wController.getView().byId("editLayout").addContent(fcg.mdg.editbp.handlers.ContactPerson.oContactPersonLayout);
  formControlData = sap.ui.getCore().byId("SimpleCPForm");
  fcg.mdg.editbp.handlers.ContactPerson.getValueHelp();
  oModel.setData(cpResults.BP_PersonRel);
  formControlData.setModel(oModel, "PERSON");
  sap.ui.getCore().byId("SF-BP_Relation-partnerId").setValue(fcg.mdg.editbp.util.Formatter.removeLeadingZeroes(cpResults.PARTNER));
  sap.ui.getCore().byId("SF-BP_RelationPartner-title").setSelectedKey(cpResults.TITLE_KEY);
  sap.ui.getCore().byId("SF-BP_Person-AcadTitle").setSelectedKey(cpResults.BP_PersonRel.TITLE_ACA1);
  sap.ui.getCore().byId("SF-BP_Person-Gender").setSelectedKey(cpResults.BP_PersonRel.SEX);
  this.disableContactPersnDtls();
  //var addResult = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults;
  var oWPRslts = oRelResults.BP_RelationsRel.results[index].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
  this.oWPResults = oWPRslts;
  if (this.oWPResults.length > 0) {
   for (var i = 0; i < oWPRslts.length; i++) {
    if (oWPRslts[i].action !== "D") {
     vDeletedFlg = "X";
     this.oWPModel = new sap.ui.model.json.JSONModel();
     this.oWPModel.setData(oWPRslts[i]);

     if (oWPRslts.length > 0) {
      if (fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout === "") {
       fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditWPAddress", fcg.mdg.editbp
        .handlers.ContactPerson);
      } else {
       try {
        fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout.destroy();
       } catch (err) {}
       fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditWPAddress", fcg.mdg.editbp
        .handlers.ContactPerson);
      }
      this.oController.getView().byId("editLayout").addContent(fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout);
      sap.ui.getCore().byId("toolWPAdd").attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
      fcg.mdg.editbp.handlers.ContactPersonCreate.addNewWPAddress();
      fcg.mdg.editbp.handlers.ContactPerson.oWpNewForm.setModel(this.oWPModel, "WP");

      // Logic to bind the existing mobile numbers
      if (oWPRslts[i].BP_WorkplaceCommMobilesRel !== undefined) {
       for (var j = 0; j < oWPRslts[i].BP_WorkplaceCommMobilesRel.results.length; j++) {
        if (oWPRslts[i].BP_WorkplaceCommMobilesRel.results[j].action !== "D") {
         var oWPMobileModel = new sap.ui.model.json.JSONModel();
         oWPMobileModel.setData(oWPRslts[i].BP_WorkplaceCommMobilesRel.results[j]);
         if (j === 0) {
          fcg.mdg.editbp.handlers.ContactPerson.oWpNewForm.setModel(oWPMobileModel, "mob");
          var mobName = "mobCPCancel-" + (fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1);
         } else {
          fcg.mdg.editbp.handlers.ContactPersonCreate.addNewMob();
          fcg.mdg.editbp.handlers.ContactPerson.vNewMobField.setModel(oWPMobileModel);
         }
        }
       }
      }

      // Logic to bind the existing telephone numbers
      if (oWPRslts[i].BP_WorkplaceCommPhonesRel !== undefined) {
       for (var k = 0; k < oWPRslts[i].BP_WorkplaceCommPhonesRel.results.length; k++) {
        if (oWPRslts[i].BP_WorkplaceCommPhonesRel.results[k] !== "D") {
         var oWPTelephoneModel = new sap.ui.model.json.JSONModel();
         oWPTelephoneModel.setData(oWPRslts[i].BP_WorkplaceCommPhonesRel.results[k]);
         if (k === 0) {
          fcg.mdg.editbp.handlers.ContactPerson.oWpNewForm.setModel(oWPTelephoneModel, "tel");
          var phoneName = "telCPCancel-" + (fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1);
         } else {
          fcg.mdg.editbp.handlers.ContactPersonCreate.addNewTel();
          fcg.mdg.editbp.handlers.ContactPerson.vNewTelField.setModel(oWPTelephoneModel, "tel1");
         }
        }
       }
      }

      // Logic to bind the existing Fax numbers
      if (oWPRslts[i].BP_WorkplaceCommFaxesRel !== undefined) {
       for (var l = 0; l < oWPRslts[i].BP_WorkplaceCommFaxesRel.results.length; l++) {
        if (oWPRslts[i].BP_WorkplaceCommFaxesRel.results[l] !== "D") {
         var oWPFaxModel = new sap.ui.model.json.JSONModel();
         oWPFaxModel.setData(oWPRslts[i].BP_WorkplaceCommFaxesRel.results[l]);
         if (l === 0) {
          fcg.mdg.editbp.handlers.ContactPerson.oWpNewForm.setModel(oWPFaxModel, "fax");
          var faxName = "faxCPCancel-" + (fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1);
         } else {
          fcg.mdg.editbp.handlers.ContactPersonCreate.addNewFax();
          fcg.mdg.editbp.handlers.ContactPerson.vNewFaxField.setModel(oWPFaxModel);
         }
        }
       }
      }

      // Logic to bind the existing email
      if (oWPRslts[i].BP_WorkplaceCommEMailsRel !== undefined) {
       for (var m = 0; m < oWPRslts[i].BP_WorkplaceCommEMailsRel.results.length; m++) {
        if (oWPRslts[i].BP_WorkplaceCommEMailsRel.results[m] !== "D") {
         var oWPEmailModel = new sap.ui.model.json.JSONModel();
         oWPEmailModel.setData(oWPRslts[i].BP_WorkplaceCommEMailsRel.results[m]);
         if (m === 0) {
          fcg.mdg.editbp.handlers.ContactPerson.oWpNewForm.setModel(oWPEmailModel, "email");
          var emailName = "emailCPCancel-" + (fcg.mdg.editbp.handlers.ContactPerson.oWpFormId - 1);
          if (sap.ui.getCore().byId(emailName).hasListeners("press") === false) {
           sap.ui.getCore().byId(emailName).attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.removeFormElement);
           sap.ui.getCore().byId(emailName).removeStyleClass("sapGreyCell");
          }
         } else {
          // fcg.mdg.editbp.handlers.ContactPersonCreate.addPlusIcons("Tel");
          fcg.mdg.editbp.handlers.ContactPersonCreate.addNewEmail();
          fcg.mdg.editbp.handlers.ContactPerson.vNewEmailField.setModel(oWPEmailModel);
         }
        }
       }
      }

     }
    } else {
     //Increment the value of the WorkPlace address form Id (WPFormId) as the current WP is deleted in current session
     //Incrementing the value will give the correct id to the newly added Workplace address
     fcg.mdg.editbp.handlers.ContactPerson.oWpFormId = fcg.mdg.editbp.handlers.ContactPerson.oWpFormId + 1;

    }
   }
   if (vDeletedFlg !== "X") {
    this.loadWpLayout();
   }
  } else {
   // check if there is atleast one address present which can be added as a Workplace address
   var addressResutls = fcg.mdg.editbp.handlers.ContactPerson.getWPAddressArray();
   if (addressResutls.results.length > 0) {
    this.loadWpLayout();
   }
  }
 },

 loadWpLayout: function() {
  if (fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout === "") {
   fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditWPAddress", fcg.mdg.editbp.handlers
    .ContactPerson);
  } else {
   try {
    fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout.destroy();
   } catch (err) {}
   fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditWPAddress", fcg.mdg.editbp.handlers
    .ContactPerson);
  }
  this.oController.getView().byId("editLayout").addContent(fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout);
  sap.ui.getCore().byId("toolWPAdd").attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
 },
 disableContactPersnDtls: function() {
  sap.ui.getCore().byId("SF-BP_Relation-partnerId").setEnabled(false);
  sap.ui.getCore().byId("SF-BP_RelationPartner-title").setEnabled(false);
  sap.ui.getCore().byId("SF-BP_Person-AcadTitle").setEnabled(false);
  sap.ui.getCore().byId("SF-BP_Person-Gender").setEnabled(false);
  sap.ui.getCore().byId("SF-BP_Person-FirstName").setEnabled(false);
  sap.ui.getCore().byId("SF-BP_Person-LastName").setEnabled(false);
  sap.ui.getCore().byId("SF-BP_Person-LanguageKey").setEnabled(false);
 },

 setCPResults: function(result) {
  this.oCPResults = result;
 },

 getCPResults: function() {
  return this.oCPResults;
 },

 getContactPersonData: function(result, index) {
  var bpguid = result.BP_RelationsRel.results[index].BP_GUID2;
  bpguid = bpguid.replace(/-/g, '');
  bpguid = bpguid.toUpperCase();
  var path = "/BP_RootCollection(BP_GUID=binary'" + bpguid + "')?$expand=";
  var vPerQuery = path + "BP_PersonRel";
  var perResult = fcg.mdg.editbp.util.DataAccess.readData(vPerQuery,
   this.oController);
  this.ocpRslts.push(perResult);
  return perResult;
 },

 getContactPersonAddressData: function(result, index) {
  var that = this;
  var bpguid = result.BP_RelationsRel.results[index].BP_GUID2;
  bpguid = bpguid.replace(/-/g, '');
  bpguid = bpguid.toUpperCase();
  this.vChgBpguid2 = bpguid;
  var path = "/BP_RootCollection(BP_GUID=binary'" + bpguid + "')?$expand=";
  var vPerQuery = path + "BP_AddressesRel,BP_AddressesRel/BP_AddressVersionsPersRel/BP_AddressPersonVersionRel,BP_AddressUsagesRel";

  var oDataModel = new sap.ui.model.odata.ODataModel(this.oController.getView().getModel().sServiceUrl, true);
  oDataModel.read(
   vPerQuery,
   null,
   null,
   true,
   function(response) {
    var oResult = response;
    for (var i = 0; i < oResult.BP_AddressUsagesRel.results.length; i++) {
     if (oResult.BP_AddressUsagesRel.results[i].ADDRESSTYPE === "XXDEFAULT") {
      for (var j = 0; j < oResult.BP_AddressesRel.results.length; j++) {
       if (oResult.BP_AddressesRel.results[j].AD_ID !== oResult.BP_AddressUsagesRel.results[i].AD_ID) {
        oResult.BP_AddressesRel.results.splice(j, 1);
       }
      }
     }
    }

    that.stdChangeAddress = oResult.BP_AddressesRel.results;
    that.ocpAddressRslts.push(oResult);
    return oResult;

   });

 },

 changeModel: function(oController) {
  var vSelectedRecord;
  var oRelResults = fcg.mdg.editbp.handlers.ContactPerson.oRelResults;
  var oCPPersonRslt = this.ocpRslts;
  if (oRelResults.BP_RelationsRel.results.length === 1) {
   vSelectedRecord = 0;
  } else {
   if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
    vSelectedRecord = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
   }
  }
  for (var oP = 0; oP < oCPPersonRslt.length; oP++) {
   var vpartner = fcg.mdg.editbp.util.Formatter.removeLeadingZeroes(oCPPersonRslt[oP].PARTNER);
   if (vpartner === oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER2) {
    var vCpIndex = oP;
   }
  }
  oRelResults.BP_RelationsRel.results[vSelectedRecord].SelectIndex = vSelectedRecord;
  var currentChanges = (JSON.parse(JSON
   .stringify(oController.changedArray)));
  for (var i = 0; i < currentChanges.length; i++) {
   var vChkAction;
   switch (currentChanges[i].entity) {
    case "BP_RelationPartner":
     oCPPersonRslt[vCpIndex][currentChanges[i].field] = currentChanges[i].value;
     oCPPersonRslt[vCpIndex].ChangeData[currentChanges[i].field] = currentChanges[i].value;
     break;
    case "BP_Person":
     oCPPersonRslt[vCpIndex].BP_PersonRel[currentChanges[i].field] = currentChanges[i].value;
     oCPPersonRslt[vCpIndex].BP_PersonRel.ChangeData[currentChanges[i].field] = currentChanges[i].value;
     break;
    case "BP_ContactPersonWorkplacesRel":
     //Check if the current changes have newly added WP address and entry is not present in the Model for this new WP address
     // the condition of checking 
     if (currentChanges[i].action === "N" && (oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].wpKey] === undefined || oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel
       .BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].wpKey].action === 'D' || oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel
       .BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].wpKey].createdIndex !== currentChanges[i].createdIndex)) {
      var oNewWP = {};
      var changedata = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results
       .push(oNewWP);
      var prevIdWP = currentChanges[i].currentEntityKey;
      var weKeyWP = currentChanges[i].wpKey;
      currentChanges[i].currentEntityKey = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
       .results.length - 1;
      for (var j = i + 1; j < currentChanges.length; j++) {
       if (currentChanges[j].currentEntityKey === prevIdWP && currentChanges[j].wpKey === weKeyWP && currentChanges[j].cpIndex ===
        currentChanges[i].cpIndex) {
        currentChanges[j].addrIndex = currentChanges[i].currentEntityKey;
        currentChanges[j].wpKey = currentChanges[i].currentEntityKey;
       }
      }
      currentChanges[i].wpKey = currentChanges[i].currentEntityKey;
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].wpKey]["ChangeData"] = changedata;

      if (oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results.length <=
       1) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey]["STANDARDADDRESS"] = "X";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey].ChangeData["STANDARDADDRESS"] = "X";
      }
     }

     if (currentChanges[i].value !== undefined) {
      if (currentChanges[i].field === "ADDRESS_NUMBER") {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey][currentChanges[i].field] = currentChanges[i].key;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey]["ADDRESS_NUMBER__TXT"] = currentChanges[i].value;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey].ChangeData[currentChanges[i].field] = currentChanges[i].key;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey].ChangeData["ADDRESS_NUMBER__TXT"] = currentChanges[i].value;
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey][currentChanges[i].field] = currentChanges[i].value;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey].ChangeData[currentChanges[i].field] = currentChanges[i].value;
      }
     }
     //There can be a scenario where you have a Contact Person with 2 WP address and 3 addresses in main BP
     //The steps are:you delete WP address->review page->continue editing->add two WP address to same Contact Person
     //Since on workplace address was deleted in 1st iteration the count of the key currentChanges[i].wpKey will be as '1' and '2' respectively
     // This last address will overwrite the firstly added address , Hence createdIndex parameter is needed to differentiate
     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].wpKey]["createdIndex"] = currentChanges[i].createdIndex;

     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].wpKey]["header"] = currentChanges[i].currentkey;
     vChkAction = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].wpKey].action;
     if (vChkAction === undefined || vChkAction !== "N") {
      if (currentChanges[i].action === undefined) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey]["action"] = "U";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].wpKey]["action"] = currentChanges[i].action;
      }
     }
     break;
    case "BP_WorkplaceIntAddressVersRel":
     var oNewIAV = {};
     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel === undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex]["BP_WorkplaceIntAddressVersRel"] = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel["results"] = [];
     }

     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey] === undefined) {
      var oNewIAV = {};
      var changedata = {};
      var oPerson = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results.push(oNewIAV);
      var prevIdIAV = currentChanges[i].currentEntityKey;
      var weKeyIAV = currentChanges[i].wpKey;
      currentChanges[i].currentEntityKey = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results.length - 1;
      if (currentChanges[i].currentEntityKey < 0) {
       currentChanges[i].currentEntityKey = 0;
      }
      for (var j = i + 1; j < currentChanges.length; j++) {
       if ((currentChanges[j].entity === "BP_WorkplaceIntAddressVersRel" || currentChanges[j].entity === "BP_WorkplaceIntPersVersionRel") &&
        currentChanges[j].currentEntityKey === prevIdIAV && currentChanges[j].wpKey === weKeyIAV) {
        currentChanges[j].currentEntityKey = currentChanges[i].currentEntityKey;
       }
      }

      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey]["ChangeData"] = changedata;
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey][
       "BP_WorkplaceIntPersVersionRel"
      ] = oPerson;
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel[
       "ChangeData"] = {};
     }

     if (currentChanges[i].value !== undefined) {
      if (currentChanges[i].field === "ADDR_VERS") {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey][currentChanges[i].field] =
        currentChanges[i].key;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey][currentChanges[i].field +
        "__TXT"
       ] = currentChanges[i].value;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].ChangeData[currentChanges[
        i].field] = currentChanges[i].key;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].ChangeData[currentChanges[
        i].field + "__TXT"] = currentChanges[i].value;
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey][currentChanges[i].field] =
        currentChanges[i].value;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].ChangeData[currentChanges[
        i].field] = currentChanges[i].value;
      }
     }

     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey]["header"] = currentChanges[
      i].currentkey;
     vChkAction = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].action;
     if (vChkAction === undefined || vChkAction !== "N") {
      if (currentChanges[i].action === undefined) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey]["action"] = "U";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey]["action"] =
        currentChanges[i].action;
      }
     }
     break;

    case "BP_WorkplaceIntPersVersionRel":
     if (oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].wpKey].action === "N") {
      currentChanges[i].addrIndex = currentChanges[i].wpKey;
     }

     if (currentChanges[i].value !== undefined) {
      if (currentChanges[i].field === "TITLE_P") {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel[
        currentChanges[i].field] = currentChanges[i].key;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel[
        currentChanges[i].field + "__TXT"] = currentChanges[i].value;

       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel
        .ChangeData[currentChanges[i].field] = currentChanges[i].key;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel
        .ChangeData[currentChanges[i].field + "__TXT"] = currentChanges[i].value;
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel[
        currentChanges[i].field] = currentChanges[i].value;
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel
        .ChangeData[currentChanges[i].field] = currentChanges[i].value;
      }
     }

     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel[
      "header"] = currentChanges[i].currentkey;
     vChkAction = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel
      .action;
     if (vChkAction === undefined || vChkAction !== "N") {
      if (currentChanges[i].action === undefined) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel[
        "action"] = "U";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceIntAddressVersRel.results[currentChanges[i].currentEntityKey].BP_WorkplaceIntPersVersionRel[
        "action"] = currentChanges[i].action;
      }
     }
     break;
    case "BP_WorkplaceCommPhonesRel":
     var oNewTel = {};
     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel === undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex]["BP_WorkplaceCommPhonesRel"] = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel["results"] = [];

     }
     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey] === undefined) {
      var oNewTel = {};
      var changedata = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results.push(oNewTel);
      var prevIdPhone = currentChanges[i].currentEntityKey;
      var weKeyPhone = currentChanges[i].wpKey;
      currentChanges[i].currentEntityKey = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results.length - 1;
      if (currentChanges[i].currentEntityKey < 0) {
       currentChanges[i].currentEntityKey = 0;
      }
      for (var j = i + 1; j < currentChanges.length; j++) {
       if (currentChanges[j].entity === "BP_WorkplaceCommPhonesRel" && currentChanges[j].currentEntityKey === prevIdPhone &&
        currentChanges[j].wpKey === weKeyPhone) {
        currentChanges[j].currentEntityKey = currentChanges[i].currentEntityKey;
       }
      }

      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey]["ChangeData"] = changedata;

      // if length is less than 1
      if (oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results.length <= 1) {

       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey]["R_3_USER"] = "1";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey].ChangeData["R_3_USER"] = "1";

       // Set the standard flag
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey]["STD_NO"] = "X";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey].ChangeData["STD_NO"] = "X";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey]["R_3_USER"] = "";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey].ChangeData["R_3_USER"] = "";
      }
     }

     if (currentChanges[i].value !== undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey][currentChanges[i].field] =
       currentChanges[i].value;
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey].ChangeData[currentChanges[i].field] =
       currentChanges[i].value;
     }

     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey]["header"] = currentChanges[i].currentkey;
     vChkAction = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey].action;
     if (vChkAction === undefined || vChkAction !== "N") {
      if (currentChanges[i].action === undefined) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey]["action"] = "U";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceCommPhonesRel.results[currentChanges[i].currentEntityKey]["action"] = currentChanges[i]
        .action;
      }
     }
     break;
    case "BP_WorkplaceCommMobilesRel":

     var oNewMob = {};
     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel === undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex]["BP_WorkplaceCommMobilesRel"] = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel["results"] = [];
     }

     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey] === undefined) {
      var oNewMob = {};
      var changedataMob = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results.push(oNewMob);
      var prevIdMob = currentChanges[i].currentEntityKey;
      var weKeyMob = currentChanges[i].wpKey;
      currentChanges[i].currentEntityKey = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results.length - 1;
      if (currentChanges[i].currentEntityKey < 0) {
       currentChanges[i].currentEntityKey = 0;
      }
      for (var j = i + 1; j < currentChanges.length; j++) {
       if (currentChanges[j].entity === "BP_WorkplaceCommMobilesRel" && currentChanges[j].currentEntityKey === prevIdMob &&
        currentChanges[j].wpKey === weKeyMob) {
        currentChanges[j].currentEntityKey = currentChanges[i].currentEntityKey;
       }
      }

      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey]["ChangeData"] = changedataMob;

      // if the length is less than 0
      if (oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results.length <= 1) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey]["R_3_USER"] = "3";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey].ChangeData["R_3_USER"] = "3";

       // Set the standard flag
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey]["STD_NO"] = "X";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey].ChangeData["STD_NO"] = "X";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey]["R_3_USER"] = "2";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey].ChangeData["R_3_USER"] = "2";
      }
     }

     if (currentChanges[i].value !== undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey][currentChanges[i].field] =
       currentChanges[i].value;
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey].ChangeData[currentChanges[i].field] =
       currentChanges[i].value;
     }

     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey]["header"] = currentChanges[i].currentkey;
     vChkAction = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey].action;
     if (vChkAction === undefined || vChkAction !== "N") {
      if (currentChanges[i].action === undefined) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey]["action"] = "U";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceCommMobilesRel.results[currentChanges[i].currentEntityKey]["action"] = currentChanges[i]
        .action;
      }
     }
     break;
    case "BP_WorkplaceCommFaxesRel":
     var oNewFax = {};
     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel === undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex]["BP_WorkplaceCommFaxesRel"] = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel["results"] = [];
     }

     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey] === undefined) {
      var oNewFax = {};
      var changedataFax = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results.push(oNewFax);
      var prevIdFax = currentChanges[i].currentEntityKey;
      var weKeyFax = currentChanges[i].wpKey;
      currentChanges[i].currentEntityKey = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results.length - 1;
      if (currentChanges[i].currentEntityKey < 0) {
       currentChanges[i].currentEntityKey = 0;
      }
      for (var j = i + 1; j < currentChanges.length; j++) {
       if (currentChanges[j].entity === "BP_WorkplaceCommFaxesRel" && currentChanges[j].currentEntityKey === prevIdFax && currentChanges[
         j].wpKey === weKeyFax) {
        currentChanges[j].currentEntityKey = currentChanges[i].currentEntityKey;
       }
      }

      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey]["ChangeData"] = changedataFax;

      // if the current record is the 1st record being created
      if (oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results.length <= 1) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey]["STD_NO"] = "X";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey].ChangeData["STD_NO"] = "X";
      }
     }

     if (currentChanges[i].value !== undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey][currentChanges[i].field] =
       currentChanges[i].value;
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey].ChangeData[currentChanges[i].field] =
       currentChanges[i].value;
     }

     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey]["header"] = currentChanges[i].currentkey;
     vChkAction = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey].action;
     if (vChkAction === undefined || vChkAction !== "N") {
      if (currentChanges[i].action === undefined) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey]["action"] = "U";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommFaxesRel.results[currentChanges[i].currentEntityKey]["action"] = currentChanges[i].action;
      }
     }
     break;
    case "BP_WorkplaceCommEMailsRel":

     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel === undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex]["BP_WorkplaceCommEMailsRel"] = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
       currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel["results"] = [];
     }
     if (currentChanges[i].action === "N" && oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
      .results[currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey] === undefined) {
      var oNewEmail = {};
      var changedataEmail = {};
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results
       .push(oNewEmail);
      var prevIdEmail = currentChanges[i].currentEntityKey;
      var weKeyEmail = currentChanges[i].wpKey;
      currentChanges[i].currentEntityKey = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel
       .results[currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results.length - 1;
      if (currentChanges[i].currentEntityKey < 0) {
       currentChanges[i].currentEntityKey = 0;
      }
      for (var j = i + 1; j < currentChanges.length; j++) {
       if (currentChanges[j].entity === "BP_WorkplaceCommEMailsRel" && currentChanges[j].currentEntityKey === prevIdEmail &&
        currentChanges[j].wpKey === weKeyEmail) {
        currentChanges[j].currentEntityKey = currentChanges[i].currentEntityKey;
       }
      }
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey]["ChangeData"] =
       changedataEmail;

      // if the current record is the 1st record being created
      if (oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results.length <= 1) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey]["STD_NO"] = "X";
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey].ChangeData["STD_NO"] = "X";
      }

     }

     if (currentChanges[i].value !== undefined) {
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey][currentChanges[i].field] =
       currentChanges[i].value;
      oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey].ChangeData[currentChanges[i].field] =
       currentChanges[i].value;
     }

     oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey]["header"] = currentChanges[i].currentkey;
     vChkAction = oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
      currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey].action;
     if (vChkAction === undefined || vChkAction !== "N") {
      if (currentChanges[i].action === undefined) {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
        currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey]["action"] = "U";
      } else {
       oRelResults.BP_RelationsRel.results[vSelectedRecord].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results[
         currentChanges[i].addrIndex].BP_WorkplaceCommEMailsRel.results[currentChanges[i].currentEntityKey]["action"] = currentChanges[i]
        .action;
      }
     }
     break;

    default:
   }
  }
  if (oRelResults.BP_RelationsRel.results[vSelectedRecord].EDIT !== "X") {
   this.aChangedCP.push(oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER2);
  }
  this.ocpChangeModel = oRelResults.BP_RelationsRel.results[vSelectedRecord];

  if (oController.isAddressVisited === "X") {
   var addArray = fcg.mdg.editbp.handlers.ContactPerson.oController.oDetailComm.BP_AddressesRel.results;
   var changeCpWPModelArr = this.ocpChangeModel.BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
   for (var a = 0; a < addArray.length; a++) {
    for (var b = 0; b < changeCpWPModelArr.length; b++) {
     if (changeCpWPModelArr[b].ADDRESS_NUMBER === addArray[a].AD_ID) {
      changeCpWPModelArr[b].ADDRESS_NUMBER__TXT = addArray[a].AD_ID__TXT;
     }
    }
   }
  }

  this.oCPData = oCPPersonRslt[vCpIndex];

  if (oRelResults.BP_RelationsRel.results[vSelectedRecord].EDIT !== "X") {
   this.cpQueryModel.push(this.ocpChangeModel);
  } else {
   var vEditIndex = this.aChangedCP.indexOf(oRelResults.BP_RelationsRel.results[vSelectedRecord].PARTNER2);
   this.cpQueryModel[vEditIndex] = this.ocpChangeModel;
  }

  // Controller hook
  var oExtcpQueryModel = this.oController.bpHookModifyCPChangeModel(this);
  if (oExtcpQueryModel !== undefined) {
   this.cpQueryModel = oExtcpQueryModel;
  }

 },

 undoContactPersonChanges: function(vActionIndex, vEntityIndex) {
  var vChangedCP, vIndex;
  if (vActionIndex === 0) {
   fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel.splice(vEntityIndex, 1);
  } else if (vActionIndex === 1) {
   var oDataModel = new sap.ui.model.odata.ODataModel(this.oController.getView().getModel().sServiceUrl, false);
   var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
   var vRelQuery = path +
    "BP_RelationsRel,BP_RelationsRel/BP_RelationContactPersonRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommEMailsRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommPhonesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommMobilesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommFaxesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceIntAddressVersRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceIntAddressVersRel/BP_WorkplaceIntPersVersionRel";

   this.aChangedCP.splice(vEntityIndex, 1);
   vChangedCP = fcg.mdg.editbp.handlers.ContactPersonChange.cpQueryModel[vEntityIndex].PARTNER2;
   vIndex = fcg.mdg.editbp.handlers.ContactPerson.aInitilCP.indexOf(vChangedCP);
   for (var i = 0; i < fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length; i++) {
    if (vChangedCP === fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[i].PARTNER2) {
     var vchngdCpIndx = i;
    }
   }
   //in case of change and delete revert the entry in the Entityvalue array which sets the review changes button
   for (i = 0; i < this.oController.aEntityValue.length; i++) {
    if ("ContactPerRB-" + vChangedCP === this.oController.aEntityValue[i]) {
     this.oController.aEntityValue.splice(i, 1);
     break;
    }
   }

   this.cpQueryModel.splice(vEntityIndex, 1);
   this.oController.aEntityValue.splice(vEntityIndex, 1);
   oDataModel
    .read(
     vRelQuery,
     null,
     null,
     true,
     function(result, oError) {
      if (result.BP_RelationsRel.results.length > 0) {
       fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[vchngdCpIndx] = result.BP_RelationsRel.results[vIndex];
      }
     });
  } else if (vActionIndex === 2) {
   // check if the CP uses address which are not already deleted
   // get list of addresses - read from server, newly created addresses and deleted addresses
   var aAddresses = [];
   var aBPAddrDel = fcg.mdg.editbp.handlers.Communication.oDeleteModel;
   var currAddr = this.oCPDeleteQueryModel[vEntityIndex].body.BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
   // list of deleted addresses
   for(var i = 0; i < aBPAddrDel.length; ++i) {
    aAddresses.push(aBPAddrDel[i].body.AD_ID);
   }
   // check if address is already deleted
   for(var i = 0; i < currAddr.length; ++i) {
    if(aAddresses.indexOf(currAddr[i].ADDRESS_NUMBER) !== -1) {
     this.showPopUp(this.oController, this.oController.getView().getModel("i18n").getResourceBundle().getText("ERROR_CP_REVERT"));
     return "ERROR";
    }
   }

   aAddresses = [];
   // make a comprehensive list of created and loaded list of addresses from backend
   var aBPAddrResults = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults.BP_AddressesRel.results;
   for(var i = 0; i < aBPAddrResults.length; ++i) {
    if(aAddresses.indexOf(aBPAddrResults[i].AD_ID) === -1)
     aAddresses.push(aBPAddrResults[i].AD_ID);
   }

   var aBPAddrCreate = fcg.mdg.editbp.handlers.Communication.oCreateModel;
   for(var i = 0; i < aBPAddrCreate.length; ++i) {
    if(aAddresses.indexOf(aBPAddrCreate[i].body.AD_ID) === -1)
     aAddresses.push(aBPAddrCreate[i].body.AD_ID);
   }

   for(var i = 0; i < currAddr.length; ++i) {
    if(aAddresses.indexOf(currAddr[i].ADDRESS_NUMBER) === -1) {
     this.showPopUp(this.oController, this.oController.getView().getModel("i18n").getResourceBundle().getText("ERROR_CP_REVERT"));
     return "ERROR";
    }
   }
   //in case of change and delete revert the entry in the Entityvalue array which sets the review changes button
            for (i = 0; i < this.oController.aEntityValue.length; i++) {
                if ("ContactPerRB-" + this.oCPDeleteQueryModel[vEntityIndex].body.PARTNER2 === this.oController.aEntityValue[i]) {
                                this.oController.aEntityValue.splice(i, 1);
                                break;
                }
            }
   fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.push(this.oCPDeleteQueryModel[vEntityIndex].body);
   this.oCPDeleteQueryModel.splice(vEntityIndex, 1);
  }
 },

 // **************** Delete CP****************
 deleteModel: function(oController) {
  this.oController = oController;
  var vDeletedCPData = {};
  var vSelectedIndex = "";
  if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
   vSelectedIndex = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
  }

  var relData = fcg.mdg.editbp.handlers.ContactPerson.getRelResults();
  var perRes = this.getContactPersonData(relData, vSelectedIndex);

  var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
  var vRelQuery = path +
   "BP_RelationsRel,BP_RelationsRel/BP_RelationContactPersonRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommEMailsRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommPhonesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommMobilesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommFaxesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceIntAddressVersRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceIntAddressVersRel/BP_WorkplaceIntPersVersionRel";
  var result = fcg.mdg.editbp.util.DataAccess.readData(vRelQuery, this.oController); // result has the original records from the server

  var vBpRelation = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel;

  // find out the index of the cp in the server response array
  var vServerCPIndex = -1;
  for (var i = 0; i < result.BP_RelationsRel.results.length; ++i) {
   if (result.BP_RelationsRel.results[i].PARTNER2 === vBpRelation.results[vSelectedIndex].PARTNER2) {
    vServerCPIndex = i;
    break;
   }
  }

  // replace the original cp from the server to the correct position in the local array i.e., vBpRelation
  vBpRelation.results[vSelectedIndex] = result.BP_RelationsRel.results[vServerCPIndex];

  vBpRelation.results[vSelectedIndex].SelectIndex = vSelectedIndex;
  vBpRelation.results[vSelectedIndex].PersonRel = perRes.BP_PersonRel;
  vDeletedCPData.body = vBpRelation.results[vSelectedIndex];
  fcg.mdg.editbp.handlers.ContactPerson.cpDesc = fcg.mdg.editbp.util.Formatter.descriptionAndCode(vDeletedCPData.body.PARTNER2__TXT,
   vDeletedCPData.body.PARTNER2);
  var partner2 = fcg.mdg.editbp.handlers.ContactPerson.pad(vDeletedCPData.body.PARTNER2, 10);

  if (this.oController.vTimedependency === "X") {
   var date = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(vDeletedCPData.body.VALIDUNTILDATE);
   date = escape(date);
   vDeletedCPData.header = "BP_RelationCollection(BP_GUID=" + oController.sItemPath + ",PARTNER1='" + vDeletedCPData.body.PARTNER1 +
    "',PARTNER2='" + partner2 + "',RELATIONSHIPCATEGORY='" + vDeletedCPData.body.RELATIONSHIPCATEGORY + "',VALIDUNTILDATE=datetime'" +
    date + "')";
  } else {
   vDeletedCPData.header = "BP_RelationCollection(BP_GUID=" + oController.sItemPath + ",PARTNER1='" + vDeletedCPData.body.PARTNER1 +
    "',PARTNER2='" + partner2 + "',RELATIONSHIPCATEGORY='" + vDeletedCPData.body.RELATIONSHIPCATEGORY + "')";
  }
  vBpRelation.results.splice(vSelectedIndex, 1);

  this.oCPDeleteQueryModel.push(vDeletedCPData);
  var vLoadModel = vDeletedCPData.body;

  vLoadModel.ChangeData = {};
  this.oCPDeleteModel = vLoadModel;
  if (this.aChangedCP.length > 0) {
   if (this.aChangedCP.indexOf(vDeletedCPData.body.PARTNER2) > -1) {
    var vChangedIndex = this.aChangedCP.indexOf(vDeletedCPData.body.PARTNER2);
    this.aChangedCP.splice(vChangedIndex, 1);
    this.cpQueryModel.splice(vChangedIndex, 1);
    oController.getView().byId("cpChangeLayout").getContent()[vChangedIndex].destroy();
   }
  }

  // Controller hook
  var oExtCPDeleteModel = this.oController
   .bpHookModifyCPDeleteModel(this);
  if (oExtCPDeleteModel !== undefined) {
   this.oCPDeleteModel = oExtCPDeleteModel;
  }
 },

 isNull: function(value) {
  return typeof value === "undefined" || value === "unknown" || value === null || value === "null" || value === "" || parseInt(value, 10) ===
   0;
 },

 showPopUp: function(wController, txt) {
  var dialog = new sap.m.Dialog({
   title: wController.getView().getModel("i18n").getResourceBundle().getText("ERROR"),
   type: "Message",
   state: wController.getView().getModel("i18n").getResourceBundle().getText("ERROR"),
   content: [new sap.m.Text({
    text: txt
   })],
   beginButton: new sap.m.Button({
    text: wController.getView().getModel("i18n").getResourceBundle().getText("OK"),
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