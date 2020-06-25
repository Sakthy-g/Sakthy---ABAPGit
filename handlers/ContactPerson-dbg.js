/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.ContactPerson");
jQuery.sap.require("fcg.mdg.editbp.handlers.ContactPersonCreate");
jQuery.sap.require("fcg.mdg.editbp.handlers.ContactPersonChange");

fcg.mdg.editbp.handlers.ContactPerson = {
 oController: "",
 oResult: "",
 oRelResults: "",
 oBPAddrResults: "",
 oCPResults: "",
 vReEditIndex: "",
 oReEditModel: "",
 oContactPersonLayout: "",
 oWorkPlaceLayout: "",
 aCPQueryModel: [],
 oCPModel: "",
 oDispCPModel: "",
 vCPCreated: 0,
 vCustomerID: "",
 oWpFormId: 0,
 oWpNewForm: "",
 aWpNewForm: [], // array to hold objects of all the workplace addresses created 
 vIdCounterTel: 0,
 aAllCounters: [],
 vNewTelField: "",
 vIdCounterFax: 0,
 vNewFaxField: "",
 vIdCounterMob: 0,
 vNewMobField: "",
 vIdCounterEmail: 0,
 vNewEmailField: "",
 wpArray: [],
 oIavFormId: 0,
 oIavNewForm: "",
 selectedAddVersion: [],
 oEditIAVModel: "",
 oWpAddressResults: {},
 oWpIavResults: {},
 oDialogCP: "",
 lnameFlag: "",
 fnameFlag: "",
 cpDesc: "",
 oPartnerModel: "",
 aInitilCP: [],
 vgIsLocked: "",
 standardAddress: "",
 vBPguid2: "",

 clearGlobalVariables: function(oController) {
  if (this.oContactPersonLayout !== undefined && this.oContactPersonLayout !== "") {
   // this.oContactPersonLayout.destroy();
   try {
    this.oContactPersonLayout.destroy();
   } catch (err) {}
  }
  if (this.oWorkPlaceLayout !== undefined && this.oWorkPlaceLayout !== "") {
   // this.oWorkPlaceLayout.destroy();
   try {
    this.oWorkPlaceLayout.destroy();
   } catch (err) {}
  }

  if (oController.getView().byId("editLayout").getContent().length > 0) {
   for (var content = 0; content < oController.getView().byId("editLayout").getContent().length; content++) {
    try {
     oController.getView().byId("editLayout").getContent()[content].destroy();
    } catch (err) {}
   }
  }

  this.oContactPersonLayout = "";
  this.oWorkPlaceLayout = "";
  this.oController = "";
  this.oResult = "";
  this.oRelResults = "";
  this.oBPAddrResults = "";
  this.oCPResults = "";
  this.vReEditIndex = "";
  this.oReEditModel = "";
  this.aCPQueryModel = [];
  this.oCPModel = "";
  this.oDispCPModel = "";
  this.vCPCreate = 0;
  this.vCustomerID = "";
  this.oWpFormId = 0;
  this.aWpFormId = []; // clear the array to hold the objects of workplace address
  this.oWpNewForm = "";
  this.vIdCounterTel = 0;
  this.vNewTelField = "";
  this.vIdCounterFax = 0;
  this.vNewFaxField = "";
  this.vIdCounterMob = 0;
  this.vNewMobField = "";
  this.vIdCounterEmail = 0;
  this.vNewEmailField = "";
  this.wpArray = [];
  this.oIavFormId = 0;
  this.oIavNewForm = "";
  this.selectedAddVersion = [];
  this.oEditIAVModel = "";
  this.oWpAddressResults = {};
  this.oWpIavResults = {};
  this.lnameFlag = "";
  this.fnameFlag = "";
  this.cpDesc = "";
  this.oPartnerModel = "";
  this.aAllCounters = [];
  this.vgIsLocked = "";
  this.standardAddress = "";
  this.vBPguid2 = "";
  fcg.mdg.editbp.handlers.ContactPersonCreate.countryError = false;
  fcg.mdg.editbp.handlers.ContactPersonCreate.vIavIndex = "";
  fcg.mdg.editbp.handlers.ContactPersonChange.oController = "";
  fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteQueryModel = [];
  fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteModel = [];
  fcg.mdg.editbp.handlers.ContactPersonChange.oWPModel = "";
  fcg.mdg.editbp.handlers.ContactPersonChange.numPhone = "";
  fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults = [];
  fcg.mdg.editbp.handlers.ContactPersonChange.ocpRslts = [];
  fcg.mdg.editbp.handlers.ContactPersonChange.ocpChangeModel = "";
  fcg.mdg.editbp.handlers.ContactPersonChange.oCPData = "";
  fcg.mdg.editbp.handlers.ContactPersonChange.aChangedCP = [];
  fcg.mdg.editbp.handlers.ContactPersonChange.cpQueryModel = [];
  fcg.mdg.editbp.handlers.ContactPersonChange.ocpAddressRslts = [];
  fcg.mdg.editbp.handlers.ContactPersonCreate.countryError = false;
  fcg.mdg.editbp.handlers.ContactPersonCreate.oWPIavModel = "";
  fcg.mdg.editbp.handlers.ContactPersonCreate.oExistingIav = "";
  fcg.mdg.editbp.handlers.ContactPersonCreate.vIsWPASelected = "";
  fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds = [];
 },

 getContactPersonData: function(wController) {
  //Delete the created forms for Workplace address
  for(var l=0;l < this.aWpNewForm.length ; l++){
   try {
    if(this.aWpNewForm[l] !== undefined && this.aWpNewForm[l] !== ""){
     this.aWpNewForm[l].destroy();
    }

   } catch (err) {}
  }

  if (this.oWpNewForm !== undefined && this.oWpNewForm !== "") {
   try {
    this.oWpNewForm.destroy();
   } catch (err) {}
  }
  this.oController = wController;



  if (this.isNull(this.oRelResults)) {
   var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
   var vRelQuery = path + "BP_RelationsRel";
   this.getRelationShipData();
   this.getAddressData();
   var result = fcg.mdg.editbp.util.DataAccess.readData(vRelQuery, wController);
   var aRelationrel = [];
   for (var i = 0; i < result.BP_RelationsRel.results.length; i++) {
    if (result.BP_RelationsRel.results[i].RELATIONSHIPCATEGORY === "BUR001") {
     aRelationrel.push(result.BP_RelationsRel.results[i]);
     this.aInitilCP.push(result.BP_RelationsRel.results[i].PARTNER2);
    }
   }
   result.BP_RelationsRel.results = [];
   result.BP_RelationsRel.results = aRelationrel;
   this.setRelResults(result);

   // Controller Hook method call
   var oExtRelResponse = this.oController.bpHookModifygetContactPersonData(vRelQuery, wController);
   if (oExtRelResponse !== undefined) {
    result = oExtRelResponse;
   }
  } else {
   this.setWPAddressArray(this.oBPAddrResults);
   this.setWPIavArray(this.oBPAddrResults);
  }
  this.setActionLayout(this.oRelResults);
 },

 getRelationShipData: function() {
  // var vBoolean;
  var globalInst = this;
  var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
  var query = path +
   "BP_RelationsRel,BP_RelationsRel/BP_RelationContactPersonRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommEMailsRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommPhonesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommMobilesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceCommFaxesRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceIntAddressVersRel,BP_RelationsRel/BP_RelationContactPersonRel/BP_ContactPersonWorkplacesRel/BP_WorkplaceIntAddressVersRel/BP_WorkplaceIntPersVersionRel";
  var oDataModel = new sap.ui.model.odata.ODataModel(this.oController.getView().getModel().sServiceUrl, true);

  // Controller hook method call      
  var oExtQuery = this.oController.bpHookModifyRelQueryCall(query, this);
  if (oExtQuery !== undefined) {
   query = oExtQuery;
  }

  oDataModel.read(
   query,
   null,
   null,
   true,
   function(response) {
    var aRelationrel = [];
    for (var i = 0; i < response.BP_RelationsRel.results.length; i++) {
     if (response.BP_RelationsRel.results[i].RELATIONSHIPCATEGORY === "BUR001") {
      aRelationrel.push(response.BP_RelationsRel.results[i]);
     }
    }
    response.BP_RelationsRel.results = [];
    response.BP_RelationsRel.results = aRelationrel;
    globalInst.oRelResults = response;
   });
 },

 getAddressData: function() {
  var globalInst = this;
  var path = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
  var addressQuery = path + "BP_AddressesRel/BP_AddressVersionsOrgRel";
  var oDataModel = new sap.ui.model.odata.ODataModel(this.oController.getView().getModel().sServiceUrl, true);
  oDataModel.read(
   addressQuery,
   null,
   null,
   true,
   function(response) {
    globalInst.oBPAddrResults = response;
    globalInst.setWPAddressArray(response);
    globalInst.setWPIavArray(response);
    // globalInst.createContactPerson();

    // Controller Hook method call
    var oExtAddrResponse = globalInst.oController.bpHookModifygetAddressData(addressQuery, globalInst);
    if (oExtAddrResponse !== undefined) {
     globalInst.oBPAddrResults = oExtAddrResponse;
    }
   });
 },

 setActionLayout: function(result) {
  this.oController.getView().byId("entityStep").setNextStep(this.oController.getView().byId("actionStep"));
  if (this.oController.oActionLayout === "") {
   this.oController.oActionLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.SelectAction", this.oController);
  }
  this.oController.getView().byId("actionLayout").setVisible(true);
  this.oController.getView().byId("actionLayout").addContent(this.oController.oActionLayout);
  sap.ui.getCore().byId("changeRB").setVisible(true);
  this.oController.setRadioButtonText();
  if (result.BP_RelationsRel.results.length === 0) {
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

 handleContactPerson: function(wController) {
  this.vReEditIndex = "";
  this.oController = wController;
  var cpResults = this.getRelResults();
  // if (this.oBPAddrResults === "") {
  //  this.getAddressData();
  // } else 
  if (this.oBPAddrResults !== "") {
   this.setWPAddressArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);
   this.setWPIavArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);
  }
  if (wController.vCurrentActionId === "createRB") {
   this.createContactPerson();
  } else if (wController.vCurrentActionId === "changeRB" || wController.vCurrentActionId === "deleteRB") {
   fcg.mdg.editbp.handlers.ContactPersonChange.editContactPerson(cpResults, wController);
  }
 },

 handleSelectItemForCP: function(wController) {
  this.oController = wController;

  if (this.oBPAddrResults !== "") {
   this.setWPAddressArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);
   this.setWPIavArray(fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults);
  }

  if (this.oController.vCurrentActionId === "changeRB") {
   var length = this.oController.vCurrentSelectdDataId.length;
   var index = this.oController.vCurrentSelectdDataId.substring(length - 1, length);
   fcg.mdg.editbp.handlers.ContactPersonChange.editContactPersonPage(index, wController);
  }
 },

 createContactPerson: function() {
  this.oController.getView().byId("actionStep").setNextStep(this.oController.getView().byId("editStep"));
  if (this.oController.getView().byId("editLayout").getContent().length > 0) {
   for (var content = 0; content < this.oController.getView().byId("editLayout").getContent().length; content++) {
    this.oController.getView().byId("editLayout").getContent()[content].destroy();
    content--;
   }
   // this.oController.getView().byId("editLayout").addContent(fcg.mdg.editbp.handlers.ContactPerson.oWorkPlaceLayout)
  }
  if (this.oContactPersonLayout === "") {
   this.oContactPersonLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditContactPerson", this);
  } else {
   this.oContactPersonLayout.destroy();
   this.oContactPersonLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditContactPerson", this);
  }

  //Controller hook
  var oExtContactPersonLayout = this.oController.bpHookModifyCreateContactPerson(this);
  if (oExtContactPersonLayout !== undefined) {
   this.oContactPersonLayout = oExtContactPersonLayout;
  }

  this.oController.getView().byId("editLayout").setVisible(true);
  this.oController.getView().byId("editLayout").removeAllContent();
  //adding Reason for request fragment
  this.oController.getFileUploadData("editLayout");
  this.oController.getView().byId("editLayout").addContent(this.oContactPersonLayout);
  this.getValueHelp();

  if (this.oController.isAddressVisited === "X") {
   if (this.oController.oDetailComm.BP_AddressesRel.results.length > 0 || fcg.mdg.editbp.handlers.Communication.oCreateModel.length > 0) {
    this.loadWPToolBar();
   }
  } else if (this.oBPAddrResults.BP_AddressesRel.results.length > 0) {
   this.loadWPToolBar();
  }
 },

 loadWPToolBar: function() {
  if (this.oWorkPlaceLayout === "") {
   this.oWorkPlaceLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditWPAddress", this);
  } else {
   try {
    this.oWorkPlaceLayout.destroy();
   } catch (err) {}
   this.oWorkPlaceLayout = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditWPAddress", this);
  }

  //Controller hook
  var oExtWorkPlaceLayout = this.oController.bpHookModifyLoadWPToolBar(this);
  if (oExtWorkPlaceLayout !== undefined) {
   this.oWorkPlaceLayout = oExtWorkPlaceLayout;
  }

  this.oController.getView().byId("editLayout").addContent(this.oWorkPlaceLayout);
  sap.ui.getCore().byId("toolWPAdd").attachPress(fcg.mdg.editbp.handlers.ContactPersonCreate.addWPAddress);
 },

 // cp wpaddress
 getCurrentDispCpForm: function(wizardController, wpcpLayout) {
  if (wizardController.reEdit !== "X") {
   var cpLayoutContent = wpcpLayout.getContent();
   var getCurrentForm = cpLayoutContent[cpLayoutContent.length - 1];
   return getCurrentForm;
  } else {
   return wpcpLayout.getContent()[this.vReEditIndex];
  }
 },

 destroyAddressTittle: function(oModelData, cpLayout, wizardController) {
  var displayFlag = false;
  var pesonData = oModelData.BP_RelationPartnerRel.BP_PersonRel;
  if (oModelData.PARTNER2 !== undefined && oModelData.PARTNER2 !== "") {
   displayFlag = true;
  }
  if (oModelData.BP_RelationPartnerRel.TITLE_KEY !== undefined && oModelData.BP_RelationPartnerRel.TITLE_KEY !== "") {
   displayFlag = true;
  }
  if (!this.isNull(pesonData)) {
   if ((pesonData.FIRSTNAME !== undefined && pesonData.FIRSTNAME !== "") || (pesonData.LASTNAME !== undefined && pesonData.LASTNAME !==
     "") || (pesonData.TITLE_ACA1 !== undefined && pesonData.TITLE_ACA1 !== "") || (pesonData.SEX !== undefined && pesonData.SEX !==
     "") || (pesonData.CORRESPONDLANGUAGE !== undefined && pesonData.CORRESPONDLANGUAGE !== "")) {
    displayFlag = true;
   }
  }
  if (displayFlag === false) {
   var vLen = cpLayout.getContent().length - 1;
   var layout = cpLayout.getContent()[vLen].getContent();
   for (var i = 0; i < layout.length - 2; i++) {
    layout[i].destroy();
   }
  }
 },

 // cp Iav display
 displayCpIAV: function(oModelData, cpLayout, wizardController) {
  var des;
  var vLocalins = wizardController;
  var lblEmpty;
  var vIavTitleDestroy = "";
  var vNewCPIAVField = "";
  var formElementIndex = 0;
  var getCurrentForm;
  if (wizardController.vCurrentActionId === "changeRB") {
   getCurrentForm = cpLayout;
  } else {
   getCurrentForm = fcg.mdg.editbp.handlers.ContactPerson.getCurrentDispCpForm(wizardController, cpLayout);
  }
  if (!this.isNull(oModelData) && oModelData.length > 0) {
   for (var i = 0; i < oModelData.length; i++) {
    var intAddVersion = undefined;
    if (oModelData[i].action !== "D") {
     if (wizardController.vCurrentActionId === "createRB") {
      intAddVersion = oModelData[i].BP_WorkplaceIntAddressVersRel;
     } else if (wizardController.vCurrentActionId === "deleteRB") {
      intAddVersion = oModelData[i].BP_WorkplaceIntAddressVersRel.results;
     } else if (wizardController.vCurrentActionId === "changeRB") {
      if (oModelData[i].BP_WorkplaceIntAddressVersRel !== undefined) {
       intAddVersion = oModelData[i].BP_WorkplaceIntAddressVersRel.results;
      }
     }
     if (!this.isNull(intAddVersion) && intAddVersion.length > 0) {
      var lblTitle;

      for (var j = 0; j < intAddVersion.length; j++) {
       if (intAddVersion[j].action !== "D") {
        if (vNewCPIAVField === "" || vNewCPIAVField === undefined) {
         var titleIndex = getCurrentForm.getContent().length - 1;
         vNewCPIAVField = getCurrentForm.getContent()[titleIndex];
         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
        } else {
         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
        }

        // IAV title
        formElementIndex = formElementIndex + 1;
        if (i !== 0) {
         lblEmpty = new sap.m.Label({
          text: ""
         });
         getCurrentForm.insertContent(lblEmpty, formElementIndex);
         vNewCPIAVField = lblEmpty;

         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         if (vIavTitleDestroy === "X") {
          lblTitle = new sap.ui.core.Title({
           text: wizardController.i18nBundle.getText("IAV")
          });
          getCurrentForm.insertContent(lblTitle, formElementIndex);
          vIavTitleDestroy = "";
         } else {
          lblTitle = new sap.m.Title({
           text: wizardController.i18nBundle.getText("IAV")
          });
          getCurrentForm.insertContent(lblTitle, formElementIndex);
         }
         vNewCPIAVField = lblTitle;
        }
        if (i === 0 && j > 0) {
         lblEmpty = new sap.m.Label({
          text: ""
         });
         getCurrentForm.insertContent(lblEmpty, formElementIndex);
         vNewCPIAVField = lblEmpty;

         if (vIavTitleDestroy === "X") {
          lblTitle = new sap.ui.core.Title({
           text: wizardController.i18nBundle.getText("IAV")
          });
          getCurrentForm.insertContent(lblTitle, formElementIndex);
          vIavTitleDestroy = "";
         } else {
          lblEmpty = new sap.m.Label({
           text: ""
          });
          getCurrentForm.insertContent(lblEmpty, formElementIndex);
          vNewCPIAVField = lblEmpty;
          formElementIndex = formElementIndex + 1;
          lblTitle = new sap.m.Title({
           text: wizardController.i18nBundle.getText("IAV")
          });
          getCurrentForm.insertContent(lblTitle, formElementIndex);
         }
         vNewCPIAVField = lblTitle;
        }
        if (i === 0 && j === 0) {
         if (vIavTitleDestroy === "X") {
          lblTitle = new sap.ui.core.Title({
           text: wizardController.i18nBundle.getText("IAV")
          });
          getCurrentForm.insertContent(lblTitle, formElementIndex);
          vIavTitleDestroy = "";
          vNewCPIAVField = lblTitle;
         } else {
          if (j !== 0) {
           lblTitle = new sap.m.Title({
            text: wizardController.i18nBundle.getText("IAV")
           });
           getCurrentForm.insertContent(lblTitle, formElementIndex);
           vNewCPIAVField = lblTitle;
          }
         }

        }

        //wp iav lable and text for Work place Address
        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
        formElementIndex = formElementIndex + 1;
        var lblWPAddress = new sap.m.Label({
         text: wizardController.i18nBundle.getText("WP_ADD")
        });
        getCurrentForm.insertContent(lblWPAddress, formElementIndex);
        vNewCPIAVField = lblWPAddress;

        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
        formElementIndex = formElementIndex + 1;

        var fieldWPAddress = new sap.m.Text({
         // text: oModelData[i].ADDRESS_NUMBER__TXT
         text: {
          path: oModelData[i].ADDRESS_NUMBER__TXT,
          formatter: function() {
           if (vLocalins.vCurrentActionId === "changeRB") {
            var vValue = oModelData[i].ADDRESS_NUMBER__TXT;
            var vChngValue = oModelData[i].ChangeData.ADDRESS_NUMBER__TXT;
            return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
           } else {
            return oModelData[i].ADDRESS_NUMBER__TXT;
           }
          }
         }
        });
        getCurrentForm.insertContent(fieldWPAddress, formElementIndex);
        vNewCPIAVField = fieldWPAddress;

        //wp iav lable and text for Address version
        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
        formElementIndex = formElementIndex + 1;
        var lblAddversion = new sap.m.Label({
         text: wizardController.i18nBundle.getText("ADDRESSVERSION")
        });
        getCurrentForm.insertContent(lblAddversion, formElementIndex);
        vNewCPIAVField = lblAddversion;

        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
        formElementIndex = formElementIndex + 1;
        var fieldAddVersion;
        if (vLocalins.vCurrentActionId === "changeRB") {
         fieldAddVersion = new sap.m.Text({
          text: {
           path: intAddVersion[j].ADDR_VERS__TXT,
           formatter: function() {
            if (vLocalins.vCurrentActionId === "changeRB") {
             var vValue = intAddVersion[j].ADDR_VERS__TXT;
             var vChngValue = intAddVersion[j].ChangeData.ADDR_VERS__TXT;
             return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
            } else {
             return intAddVersion[j].ADDR_VERS__TXT;
            }
           }
          },
          layoutData: new sap.ui.layout.GridData({
           span: "L12 M12 S12",
           linebreakL: true,
           linebreakM: true,
           linebreakS: true
          })
         });
        } else {
         fieldAddVersion = new sap.m.Text({
          text: intAddVersion[j].BP_WorkplaceIntPersVersionRel.ADDR_VERS__TXT,
          layoutData: new sap.ui.layout.GridData({
           span: "L12 M12 S12",
           linebreakL: true,
           linebreakM: true,
           linebreakS: true
          })
         });
        }
        getCurrentForm.insertContent(fieldAddVersion, formElementIndex);
        vNewCPIAVField = fieldAddVersion;

        //wp iav lable and text for Title
        if (!this.isNull(intAddVersion[j].BP_WorkplaceIntPersVersionRel.TITLE_P)) {
         if (intAddVersion[j].BP_WorkplaceIntPersVersionRel.TITLE_P !== "") {
          formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
          formElementIndex = formElementIndex + 1;
          var lblTit = new sap.m.Label({
           text: wizardController.i18nBundle.getText("TITLE")
          });
          getCurrentForm.insertContent(lblTit, formElementIndex);
          vNewCPIAVField = lblTit;

          formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
          formElementIndex = formElementIndex + 1;
          var fieldTit = new sap.m.Text({
           // text: intAddVersion[j].BP_WorkplaceIntPersVersionRel.TITLE_P__TXT,
           text: {
            path: intAddVersion[j].BP_WorkplaceIntPersVersionRel.TITLE_P__TXT,
            formatter: function() {
             if (vLocalins.vCurrentActionId === "changeRB") {
              var vValue = intAddVersion[j].BP_WorkplaceIntPersVersionRel.TITLE_P__TXT;
              var vChngValue = intAddVersion[j].BP_WorkplaceIntPersVersionRel.ChangeData.TITLE_P__TXT;
              return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
             } else {
              return intAddVersion[j].BP_WorkplaceIntPersVersionRel.TITLE_P__TXT;
             }
            }
           },
           layoutData: new sap.ui.layout.GridData({
            span: "L12 M12 S12",
            linebreakL: true,
            linebreakM: true,
            linebreakS: true
           })
          });
          getCurrentForm.insertContent(fieldTit, formElementIndex);
          vNewCPIAVField = fieldTit;
         }
        }

        //wp iav lable and text for firstname
        if (!this.isNull(intAddVersion[j].BP_WorkplaceIntPersVersionRel.FIRSTNAME)) {
         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var lblFname = new sap.m.Label({
          text: wizardController.i18nBundle.getText("F_Name")
         });
         getCurrentForm.insertContent(lblFname, formElementIndex);
         vNewCPIAVField = lblFname;

         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var fieldFname = new sap.m.Text({
          // text: intAddVersion[j].BP_WorkplaceIntPersVersionRel.FIRSTNAME,
          text: {
           path: intAddVersion[j].BP_WorkplaceIntPersVersionRel.FIRSTNAME,
           formatter: function() {
            if (vLocalins.vCurrentActionId === "changeRB") {
             var vValue = intAddVersion[j].BP_WorkplaceIntPersVersionRel.FIRSTNAME;
             var vChngValue = intAddVersion[j].BP_WorkplaceIntPersVersionRel.ChangeData.FIRSTNAME;
             return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
            } else {
             return intAddVersion[j].BP_WorkplaceIntPersVersionRel.FIRSTNAME;
            }
           }
          },
          layoutData: new sap.ui.layout.GridData({
           span: "L12 M12 S12",
           linebreakL: true,
           linebreakM: true,
           linebreakS: true
          })
         });
         getCurrentForm.insertContent(fieldFname, formElementIndex);
         vNewCPIAVField = fieldFname;
        }

        //wp iav lable and text for Lastname
        if (!this.isNull(intAddVersion[j].BP_WorkplaceIntPersVersionRel.LASTNAME)) {
         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var lblTLname = new sap.m.Label({
          text: wizardController.i18nBundle.getText("LN")
         });
         getCurrentForm.insertContent(lblTLname, formElementIndex);
         vNewCPIAVField = lblTLname;

         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var fieldLname = new sap.m.Text({
          // text: intAddVersion[j].BP_WorkplaceIntPersVersionRel.LASTNAME,
          text: {
           path: intAddVersion[j].BP_WorkplaceIntPersVersionRel.LASTNAME,
           formatter: function() {
            if (vLocalins.vCurrentActionId === "changeRB") {
             var vValue = intAddVersion[j].BP_WorkplaceIntPersVersionRel.LASTNAME;
             var vChngValue = intAddVersion[j].BP_WorkplaceIntPersVersionRel.ChangeData.LASTNAME;
             return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
            } else {
             return intAddVersion[j].BP_WorkplaceIntPersVersionRel.LASTNAME;
            }
           }
          },
          layoutData: new sap.ui.layout.GridData({
           span: "L12 M12 S12",
           linebreakL: true,
           linebreakM: true,
           linebreakS: true
          })
         });
         getCurrentForm.insertContent(fieldLname, formElementIndex);
         vNewCPIAVField = fieldLname;
        }

        //wp iav lable and text for DEPARTMENT
        if (!this.isNull(intAddVersion[j].DEPARTMENT)) {
         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var lblDept = new sap.m.Label({
          text: wizardController.i18nBundle.getText("DEPARTMENT")
         });
         getCurrentForm.insertContent(lblDept, formElementIndex);
         vNewCPIAVField = lblDept;

         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var fieldDept = new sap.m.Text({
          // text: intAddVersion[j].DEPARTMENT,
          text: {
           path: intAddVersion[j].DEPARTMENT,
           formatter: function() {
            if (vLocalins.vCurrentActionId === "changeRB") {
             var vValue = intAddVersion[j].DEPARTMENT;
             var vChngValue = intAddVersion[j].ChangeData.DEPARTMENT;
             return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
            } else {
             return intAddVersion[j].DEPARTMENT;
            }
           }
          },
          layoutData: new sap.ui.layout.GridData({
           span: "L12 M12 S12",
           linebreakL: true,
           linebreakM: true,
           linebreakS: true
          })
         });
         getCurrentForm.insertContent(fieldDept, formElementIndex);
         vNewCPIAVField = fieldDept;
        }

        //wp iav lable and text for FUNCTION
        if (!this.isNull(intAddVersion[j].FUNCTION)) {
         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var lblFunct = new sap.m.Label({
          text: wizardController.i18nBundle.getText("FUNCTION")
         });
         getCurrentForm.insertContent(lblFunct, formElementIndex);
         vNewCPIAVField = lblFunct;

         formElementIndex = getCurrentForm.getContent().indexOf(vNewCPIAVField);
         formElementIndex = formElementIndex + 1;
         var fieldFunct = new sap.m.Text({
          // text: intAddVersion[j].FUNCTION,
          text: {
           path: intAddVersion[j].FUNCTION,
           formatter: function() {
            if (vLocalins.vCurrentActionId === "changeRB") {
             var vValue = intAddVersion[j].FUNCTION;
             var vChngValue = intAddVersion[j].ChangeData.FUNCTION;
             return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
            } else {
             return intAddVersion[j].FUNCTION;
            }
           }
          },
          layoutData: new sap.ui.layout.GridData({
           span: "L12 M12 S12",
           linebreakL: true,
           linebreakM: true,
           linebreakS: true
          })
         });
         getCurrentForm.insertContent(fieldFunct, formElementIndex);
         vNewCPIAVField = fieldFunct;
        }
       } else if (i === 0 && j === 0 && intAddVersion[j].action === "D") {
        if (vIavTitleDestroy === "") {
         des = getCurrentForm.getContent().length - 1;
         getCurrentForm.getContent()[des].destroy();
         vIavTitleDestroy = "X";
        }
        // getCurrentForm.getContent()[des].setVisible(false);
       }

      }
     } else {
      if (vIavTitleDestroy === "") {
       des = getCurrentForm.getContent().length - 1;
       getCurrentForm.getContent()[des].destroy();
       vIavTitleDestroy = "X";
      }
      // getCurrentForm.getContent()[des].setVisible(false);
     }
    } else if (i === 0 && oModelData[i].action === "D") {
     if (vIavTitleDestroy === "") {
      des = getCurrentForm.getContent().length - 1;
      getCurrentForm.getContent()[des].destroy();
      vIavTitleDestroy = "X";
     }
     // getCurrentForm.getContent()[des].setVisible(false);
    }
   }
  } else {
   if (vIavTitleDestroy === "") {
    des = getCurrentForm.getContent().length - 1;
    getCurrentForm.getContent()[des].destroy();
    vIavTitleDestroy = "X";
   }
   // getCurrentForm.getContent()[des].setVisible(false);
  }
 },

 displayWPAddress: function(oModelData, cpLayout, wizardController) {
  var getCurrentForm;
  var vLocalins = wizardController;
  var vNewCPField = "";
  var formElementIndex = 0;
  if (wizardController.vCurrentActionId === "changeRB") {
   getCurrentForm = cpLayout;
  } else {
   getCurrentForm = fcg.mdg.editbp.handlers.ContactPerson.getCurrentDispCpForm(wizardController, cpLayout);
  }
  if (!this.isNull(oModelData) && oModelData.length > 0) {
   // for(var del = 0; del < oModelData.length; del++) {
   //  if(oModelData[del].action !== "D") {
   //   this.vDeletedWp = del;
   //  } else {
   //   this.vDeletedWp = del;
   //   return;
   //  }
   //  return;
   // }
   for (var i = 0; i < oModelData.length; i++) {
    var vNodeleted = "";
    if (oModelData[i].action !== "D") {
     vNodeleted = "X";
     var model = new sap.ui.model.json.JSONModel();
     model.setData(oModelData[i]);
     if (vNewCPField === "" || vNewCPField === undefined) {
      var titleIndex = getCurrentForm.getContent().length - 2;
      vNewCPField = getCurrentForm.getContent()[titleIndex];
     } else {
      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
     }

     // wpaddress title
     formElementIndex = formElementIndex + 1;
     if (i !== 0 && oModelData[i - 1].action !== "D") {
      // for() {
      var lblEmpty = new sap.m.Label({
       text: ""
      });
      getCurrentForm.insertContent(lblEmpty, formElementIndex);
      vNewCPField = lblEmpty;

      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var lblTitle = new sap.m.Title({
       text: wizardController.i18nBundle.getText("WP_ADD")
      });
      getCurrentForm.insertContent(lblTitle, formElementIndex);
      vNewCPField = lblTitle;
      // }
     }

     //wpaddress lable and text for Address
     formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
     formElementIndex = formElementIndex + 1;
     var lblAddr = new sap.m.Label({
      text: wizardController.i18nBundle.getText("Address")
     });
     getCurrentForm.insertContent(lblAddr, formElementIndex);
     vNewCPField = lblAddr;

     formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
     formElementIndex = formElementIndex + 1;
     var fieldAddr = new sap.m.Text({
      // text: oModelData[i].ADDRESS_NUMBER__TXT
      text: {
       path: oModelData[i].ADDRESS_NUMBER__TXT,
       formatter: function() {
        if (vLocalins.vCurrentActionId === "changeRB") {
         var vValue = oModelData[i].ADDRESS_NUMBER__TXT;
         var vChngValue = oModelData[i].ChangeData.ADDRESS_NUMBER__TXT;
         return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
        } else {
         return oModelData[i].ADDRESS_NUMBER__TXT;
        }
       }
      }
     });
     getCurrentForm.insertContent(fieldAddr, formElementIndex);
     vNewCPField = fieldAddr;

     if (!this.isNull(oModelData[i].DEPARTMENT)) {
      //wpaddress lable and text for Department
      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var lblDept = new sap.m.Label({
       text: wizardController.i18nBundle.getText("DEPARTMENT")
      });
      getCurrentForm.insertContent(lblDept, formElementIndex);
      vNewCPField = lblDept;

      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var fieldDept = new sap.m.Text({
       // text: oModelData[i].DEPARTMENT
       text: {
        path: oModelData[i].DEPARTMENT,
        formatter: function() {
         if (vLocalins.vCurrentActionId === "changeRB") {
          var vValue = oModelData[i].DEPARTMENT;
          var vChngValue = oModelData[i].ChangeData.DEPARTMENT;
          return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
         } else {
          return oModelData[i].DEPARTMENT;
         }
        }
       }

      });
      getCurrentForm.insertContent(fieldDept, formElementIndex);
      vNewCPField = fieldDept;
     }

     if (!this.isNull(oModelData[i].FUNCTION)) {
      //wpaddress lable and text for Function
      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var lblFunct = new sap.m.Label({
       text: wizardController.i18nBundle.getText("FUNCTION")
      });
      getCurrentForm.insertContent(lblFunct, formElementIndex);
      vNewCPField = lblFunct;

      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var fieldFunct = new sap.m.Text({
       // text: oModelData[i].FUNCTION
       text: {
        path: oModelData[i].FUNCTION,
        formatter: function() {
         if (vLocalins.vCurrentActionId === "changeRB") {
          var vValue = oModelData[i].FUNCTION;
          var vChngValue = oModelData[i].ChangeData.FUNCTION;
          return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
         } else {
          return oModelData[i].FUNCTION;
         }
        }
       }
      });
      getCurrentForm.insertContent(fieldFunct, formElementIndex);
      vNewCPField = fieldFunct;
     }

     if (!this.isNull(oModelData[i].BP_WorkplaceCommPhonesRel)) {
      var wpTelData;
      //wpaddress lable and text for TELEPHONE
      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var lblTel = new sap.m.Label({
       text: wizardController.i18nBundle.getText("TEL")
      });
      getCurrentForm.insertContent(lblTel, formElementIndex);
      vNewCPField = lblTel;
      if (wizardController.vCurrentActionId === "changeRB" || wizardController.vCurrentActionId === "deleteRB") {
       wpTelData = oModelData[i].BP_WorkplaceCommPhonesRel.results;
      } else {
       wpTelData = oModelData[i].BP_WorkplaceCommPhonesRel;
      }

      for (var j = 0; j < wpTelData.length; j++) {
       if (wpTelData[j].action !== "D" && (wpTelData[j].TELEPHONE !== "" || wpTelData[j].EXTENSION !== "") && (wpTelData[j].TELEPHONE !==
         undefined || wpTelData[j].EXTENSION !== undefined)) {
        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
        formElementIndex = formElementIndex + 1;
        var vTelNo = fcg.mdg.editbp.util.Formatter.extensionWithNumber(wpTelData[j].COUNTRY, wpTelData[j].TELEPHONE, wpTelData[j].EXTENSION);
        var fieldTel = new sap.m.Text({
         // text: fcg.mdg.editbp.util.Formatter.extensionWithNumber(wpTelData[j].COUNTRY, wpTelData[j].TELEPHONE,
         //  wpTelData[j].EXTENSION),
         text: {
          path: vTelNo,
          formatter: function() {
           if (vLocalins.vCurrentActionId === "changeRB") {
            var vValue = vTelNo;
            if (wpTelData[j].ChangeData.COUNTRY !== undefined || wpTelData[j].ChangeData.TELEPHONE !== undefined || wpTelData[j].ChangeData
             .EXTENSION !== undefined) {
             var vChngValue = vValue;
            }
            // var vChngValue = fcg.mdg.editbp.util.Formatter.extensionWithNumber(wpTelData[j].ChangeData.COUNTRY, wpTelData[j].ChangeData.TELEPHONE,wpTelData[j].ChangeData.EXTENSION);
            return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
           } else {
            return vTelNo;
           }
          }
         },
         layoutData: new sap.ui.layout.GridData({
          span: "L12 M12 S12",
          linebreakL: true,
          linebreakM: true,
          linebreakS: true
         })
        });
        getCurrentForm.insertContent(fieldTel, formElementIndex);
        vNewCPField = fieldTel;
       }
      }
     }

     if (!this.isNull(oModelData[i].BP_WorkplaceCommMobilesRel)) {
      var wpMobileData;
      //wpaddress lable and text for Mobile
      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var lblMob = new sap.m.Label({
       text: wizardController.i18nBundle.getText("MOB")
      });
      getCurrentForm.insertContent(lblMob, formElementIndex);
      vNewCPField = lblMob;
      if (wizardController.vCurrentActionId === "changeRB" || wizardController.vCurrentActionId === "deleteRB") {
       wpMobileData = oModelData[i].BP_WorkplaceCommMobilesRel.results;
      } else {
       wpMobileData = oModelData[i].BP_WorkplaceCommMobilesRel;
      }

      for (j = 0; j < wpMobileData.length; j++) {
       if (wpMobileData[j].action !== "D" && wpMobileData[j].TELEPHONE !== "" && wpMobileData[j].TELEPHONE !== undefined) {
        var vMobNo = fcg.mdg.editbp.util.Formatter.mobNumber(wpMobileData[j].COUNTRY, wpMobileData[j].TELEPHONE);
        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
        formElementIndex = formElementIndex + 1;
        var fieldMob = new sap.m.Text({
         // text: fcg.mdg.editbp.util.Formatter.mobNumber(wpMobileData[j].COUNTRY, wpMobileData[j].TELEPHONE),
         text: {
          path: vMobNo,
          formatter: function() {
           if (vLocalins.vCurrentActionId === "changeRB") {
            var vValue = vMobNo;
            if (wpMobileData[j].ChangeData.COUNTRY !== undefined || wpMobileData[j].ChangeData.TELEPHONE !== undefined) {
             var vChngValue = vValue;
            }
            // var vChngValue = fcg.mdg.editbp.util.Formatter.extensionWithNumber(wpTelData[j].ChangeData.COUNTRY, wpTelData[j].ChangeData.TELEPHONE,wpTelData[j].ChangeData.EXTENSION);
            return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
           } else {
            return vMobNo;
           }
          }
         },
         layoutData: new sap.ui.layout.GridData({
          span: "L12 M12 S12",
          linebreakL: true,
          linebreakM: true,
          linebreakS: true
         })
        });
        getCurrentForm.insertContent(fieldMob, formElementIndex);
        vNewCPField = fieldMob;
       }
      }
     }

     if (!this.isNull(oModelData[i].BP_WorkplaceCommFaxesRel)) {
      var wpFaxData;
      //wpaddress lable and text for Fax
      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var lblFax = new sap.m.Label({
       text: wizardController.i18nBundle.getText("FAX")
      });
      getCurrentForm.insertContent(lblFax, formElementIndex);
      vNewCPField = lblFax;
      if (wizardController.vCurrentActionId === "changeRB" || wizardController.vCurrentActionId === "deleteRB") {
       wpFaxData = oModelData[i].BP_WorkplaceCommFaxesRel.results;
      } else {
       wpFaxData = oModelData[i].BP_WorkplaceCommFaxesRel;
      }

      for (j = 0; j < wpFaxData.length; j++) {
       if (wpFaxData[j].action !== "D" && (wpFaxData[j].FAX !== "" || wpFaxData[j].EXTENSION !== "") && (wpFaxData[j].FAX !== undefined ||
         wpFaxData[j].EXTENSION !== undefined)) {
        var vFaxNo = fcg.mdg.editbp.util.Formatter.extensionWithNumber(wpFaxData[j].COUNTRY, wpFaxData[j].FAX, wpFaxData[j].EXTENSION);
        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
        formElementIndex = formElementIndex + 1;
        var fieldFax = new sap.m.Text({
         // text: fcg.mdg.editbp.util.Formatter.extensionWithNumber(wpFaxData[j].COUNTRY, wpFaxData[j].FAX, wpFaxData[j].EXTENSION),
         text: {
          path: vFaxNo,
          formatter: function() {
           if (vLocalins.vCurrentActionId === "changeRB") {
            var vValue = vFaxNo;
            if (wpFaxData[j].ChangeData.COUNTRY !== undefined || wpFaxData[j].ChangeData.FAX !== undefined || wpFaxData[j].ChangeData
             .EXTENSION !== undefined) {
             var vChngValue = vValue;
            }
            // var vChngValue = fcg.mdg.editbp.util.Formatter.extensionWithNumber(wpTelData[j].ChangeData.COUNTRY, wpTelData[j].ChangeData.TELEPHONE,wpTelData[j].ChangeData.EXTENSION);
            return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
           } else {
            return vFaxNo;
           }
          }
         },
         layoutData: new sap.ui.layout.GridData({
          span: "L12 M12 S12",
          linebreakL: true,
          linebreakM: true,
          linebreakS: true
         })
        });
        getCurrentForm.insertContent(fieldFax, formElementIndex);
        // fieldFax.setLayoutData(new sap.ui.layout.GridData({linebreak: true}));
        vNewCPField = fieldFax;
       }
      }
     }

     if (!this.isNull(oModelData[i].BP_WorkplaceCommEMailsRel)) {
      var wpEmailData;
      //wpaddress lable and text for EMAIL
      formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
      formElementIndex = formElementIndex + 1;
      var lblEmail = new sap.m.Label({
       text: wizardController.i18nBundle.getText("E_MAIL")
      });
      getCurrentForm.insertContent(lblEmail, formElementIndex);
      vNewCPField = lblEmail;
      if (wizardController.vCurrentActionId === "changeRB" || wizardController.vCurrentActionId === "deleteRB") {
       wpEmailData = oModelData[i].BP_WorkplaceCommEMailsRel.results;
      } else {
       wpEmailData = oModelData[i].BP_WorkplaceCommEMailsRel;
      }

      for (j = 0; j < wpEmailData.length; j++) {
       if (wpEmailData[j].action !== "D" && wpEmailData[j].E_MAIL !== "" && wpEmailData[j].E_MAIL !== undefined) {
        formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
        formElementIndex = formElementIndex + 1;
        var fieldEmail = new sap.m.Text({
         // text: wpEmailData[j].E_MAIL,
         text: {
          path: wpEmailData[j].E_MAIL,
          formatter: function() {
           if (vLocalins.vCurrentActionId === "changeRB") {
            var vValue = wpEmailData[j].E_MAIL;
            var vChngValue = wpEmailData[j].ChangeData.E_MAIL;
            return fcg.mdg.editbp.util.Formatter.boldCPChanges(vValue, vChngValue, this);
           } else {
            return wpEmailData[j].E_MAIL;
           }
          }
         },
         layoutData: new sap.ui.layout.GridData({
          span: "L12 M12 S12",
          linebreakL: true,
          linebreakM: true,
          linebreakS: true
         })
        });
        getCurrentForm.insertContent(fieldEmail, formElementIndex);
        vNewCPField = fieldEmail;
       }
      }
     }

     //extension hook
     formElementIndex = getCurrentForm.getContent().indexOf(vNewCPField);
     wizardController.bpHookDisplayWPAddressCP(oModelData, cpLayout, wizardController, this, formElementIndex, i);
    }
   }
   if (vNodeleted !== "X") {
    var vIavTtl = getCurrentForm.getContent()[getCurrentForm.getContent().length - 1];
    var vWPTtl = getCurrentForm.getContent()[getCurrentForm.getContent().length - 2];
    vIavTtl.destroy();
    vWPTtl.destroy();
   }

  } else {
   var des = getCurrentForm.getContent().length - 2;
   getCurrentForm.getContent()[des].destroy();
  }
 },

 getValueHelp: function() {
  // for getting the values helps
  var oResults = fcg.mdg.editbp.util.DataAccess.getValueHelpData();
  var vDefaultText = this.oController.i18nBundle.getText("NONE");
  var oGenModel = new sap.ui.model.json.JSONModel();
  var genItem = {
   results: [{
    KEY: "1",
    TEXT: this.oController.i18nBundle.getText("FEMALE"),
    ATTR_NAME: "SEX"
   }, {
    KEY: "2",
    TEXT: this.oController.i18nBundle.getText("MALE"),
    ATTR_NAME: "SEX"
   }, {
    KEY: "",
    TEXT: vDefaultText,
    ATTR_NAME: "SEX"
   }]
  };
  oGenModel.setData(genItem);
  var gender = new sap.ui.core.Item({
   key: "{KEY}",
   text: "{TEXT}"
  });
  var oGender = sap.ui.getCore().byId("SF-BP_Person-Gender");
  oGender.setModel(oGenModel);
  oGender.bindItems("/results", gender);
  oGender.setSelectedKey();
  for (var i = 0; i < oResults.length; i++) {
   switch (i) {
    case 0:
     var oATModel = new sap.ui.model.json.JSONModel();
     oATModel.setData(oResults[i].data);
     var acTitleTemp = new sap.ui.core.Item({
      key: "{KEY}",
      text: "{TEXT}"
     });
     var AcdTitle = sap.ui.getCore().byId("SF-BP_Person-AcadTitle");
     AcdTitle.setModel(oATModel);
     AcdTitle.bindItems("/results", acTitleTemp);
     var emptyAcdTitle = new sap.ui.core.Item({
      key: "",
      text: vDefaultText
     });
     AcdTitle.addItem(emptyAcdTitle);
     AcdTitle.setSelectedKey();
     break;
    case 2:
     this.oController.aCorrLangValues = oResults[i].data;
     break;
    case 3:
     var oTVModel = new sap.ui.model.json.JSONModel();
     oTVModel.setData(oResults[i].data);
     var titleValuesTemp = new sap.ui.core.Item({
      key: "{KEY}",
      text: "{TEXT}"
     });
     var Title = sap.ui.getCore().byId("SF-BP_RelationPartner-title");
     Title.setModel(oTVModel);
     Title.bindItems("/results", titleValuesTemp);
     var emptyTitle = new sap.ui.core.Item({
      key: "",
      text: vDefaultText
     });
     Title.addItem(emptyTitle);
     Title.setSelectedKey();
     break;
   }
  }

 },

 createCPDataModel: function(oWizController, partner1) {
  this.oController = oWizController;
  this.vCustomerID = partner1;
  if (oWizController.vCurrentActionId === "createRB") {
   this.createModel();
  } else if (oWizController.vCurrentActionId === "changeRB") {
   fcg.mdg.editbp.handlers.ContactPersonChange.changeModel(oWizController);
  } else if (oWizController.vCurrentActionId === "deleteRB") {
   fcg.mdg.editbp.handlers.ContactPersonChange.deleteModel(oWizController);
  }
 },

 prepareCreatedArray: function() {
  var crArray = this.oController.createdArray;
  var objCat = {};
  objCat.value = "BUR001";
  objCat.entity = "BP_Relation";
  objCat.field = "RELATIONSHIPCATEGORY";
  crArray.push(objCat);

  var objPartner1 = {};

  var cusId = isNaN(parseInt(this.vCustomerID, 10)) ? this.vCustomerID : this.pad(this.vCustomerID, 10);
  objPartner1.value = cusId;
  objPartner1.entity = "BP_Relation";
  objPartner1.field = "PARTNER1";
  crArray.push(objPartner1);

  if (this.oController.vTimedependency === "X") {
   var dateFrom = {};
   dateFrom.value = this.getCurrentDate();
   dateFrom.entity = "BP_Relation";
   dateFrom.field = "VALIDFROMDATE";
   crArray.push(dateFrom);

   var dateTo = {};
   dateTo.value = "9999-12-31T00:00:00";
   dateTo.entity = "BP_Relation";
   dateTo.field = "VALIDUNTILDATE";
   crArray.push(dateTo);
  }

  var category = {};
  category.value = "1";
  category.entity = "BP_RelationPartner";
  category.field = "CATEGORY";
  crArray.push(category);

  return crArray;
 },

 createModel: function() {
  var createdArray = this.prepareCreatedArray();
  var currentChanges = (JSON.parse(JSON.stringify(createdArray)));
  var queryModel = {};

  var bpRelData = "";
  var dispBpData = "";
  var bpPerData = "";
  var bpPartData = "";

  var relFlag = false;
  var partFlag = false;
  var persFlag = false;

  if (fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.length > 0) {
   this.createAddressArr(currentChanges);
  }

  if (this.oController.reEdit === "") {
   for (var i = 0; i < currentChanges.length; i++) {
    queryModel.entity = "BP_Relation";
    if (currentChanges[i].entity === "BP_Relation") {
     bpRelData = this.prepareEntityData(bpRelData, relFlag, currentChanges[i]);
     relFlag = true;
    }

    if (currentChanges[i].entity === "BP_RelationPartner") {
     bpPartData = this.prepareEntityData(bpPartData, partFlag, currentChanges[i]);
     partFlag = true;
    }

    if (currentChanges[i].entity === "BP_Person") {
     bpPerData = this.prepareEntityData(bpPerData, persFlag, currentChanges[i]);
     persFlag = true;
    }
   }
   bpRelData = bpRelData.substring(0, bpRelData.length - 1) + "}";
   bpPartData = this.isNull(bpPartData) ? "" : bpPartData.substring(0, bpPartData.length - 1) + "}";
   bpPerData = this.isNull(bpPerData) ? "" : bpPerData.substring(0, bpPerData.length - 1) + "}";
   bpRelData = JSON.parse(bpRelData);

   dispBpData = JSON.parse(JSON.stringify(bpRelData));
   if (!this.isNull(bpPartData)) {
    dispBpData.BP_RelationPartnerRel = JSON.parse(bpPartData);
   }
   if (!this.isNull(bpPerData)) {
    dispBpData.BP_RelationPartnerRel.BP_PersonRel = JSON.parse(bpPerData);
   }

   if (!this.isNull(bpRelData.PARTNER2)) {
    bpPartData = "";
    bpPerData = "";
    var vPartner2 = isNaN(parseInt(bpRelData.PARTNER2, 10)) ? bpRelData.PARTNER2 : this.pad(bpRelData.PARTNER2, 10);
    bpRelData.PARTNER2 = vPartner2;
   }

   var cpRelObj = {};
   cpRelObj.RELATIONSHIPCATEGORY = bpRelData.RELATIONSHIPCATEGORY;
   cpRelObj.PARTNER1 = bpRelData.PARTNER1;
   cpRelObj.PARTNER2 = bpRelData.PARTNER2;
   if (this.oController.vTimedependency === "X") {
    cpRelObj.VALIDFROMDATE = bpRelData.VALIDFROMDATE;
    cpRelObj.VALIDUNTILDATE = bpRelData.VALIDUNTILDATE;
   }
   if (this.wpArray.length > 0) {
    cpRelObj.BP_ContactPersonWorkplacesRel = this.wpArray;
   }

   if (!this.isNull(bpPartData)) {
    bpRelData.BP_RelationPartnerRel = JSON.parse(bpPartData);
   }
   if (!this.isNull(bpPerData)) {
    bpRelData.BP_RelationPartnerRel.BP_PersonRel = JSON.parse(bpPerData);
   }
   bpRelData.BP_RelationContactPersonRel = cpRelObj;

   queryModel.body = bpRelData;
   queryModel.cpdata = dispBpData;
   queryModel.partner2 = fcg.mdg.editbp.util.Formatter.removeLeadingZeroes(bpRelData.PARTNER2);
   queryModel.index = this.vCPCreated;
   this.vCPCreated++;
   this.aCPQueryModel.push(queryModel);
   // queryModel = {};
   this.oCPModel = queryModel.body;
   this.oDispCPModel = queryModel.cpdata;

   //Controller hook
   var oExtCPCreateModel = this.oController.bpHookModifyCPCreateModel(this);
   if (oExtCPCreateModel !== undefined) {
    this.aCPQueryModel = oExtCPCreateModel;
   }

  } else {
   for (var r = 0; r < currentChanges.length; r++) {
    this.aCPQueryModel[this.vReEditIndex].body[currentChanges[r].field] = currentChanges[r].value;
   }
   this.oReEditModel = new sap.ui.model.json.JSONModel();
   this.oReEditModel.setData(this.aCPQueryModel[this.vReEditIndex].body);
  }
 },

 createAddressArr: function(currentChanges) {
  var vWPKey = "";
  var aWpAdArray = [];
  var wpAdIdArray = [],
   addArray = [];

  for (var k = 0; k < currentChanges.length; k++) {
   if (currentChanges[k].wpKey !== undefined) {
    aWpAdArray.push(currentChanges[k]);
   }
  }

  aWpAdArray.sort(function(a, b) {
   return parseInt(a.wpKey, 10) - parseInt(b.wpKey, 10);
  });

  for (var i = 0; i < aWpAdArray.length; i++) {
   var wpData = {};
   if (aWpAdArray[i].entity === "BP_ContactPersonWorkplacesRel" && aWpAdArray[i].wpKey !== undefined) {
    if (vWPKey === aWpAdArray[i].wpKey) {
     continue;
    }
    vWPKey = aWpAdArray[i].wpKey;
    for (var j = 0; j < aWpAdArray.length; j++) {
     if (aWpAdArray[j].entity === "BP_ContactPersonWorkplacesRel" && aWpAdArray[i].wpKey === aWpAdArray[j].wpKey) {
      if (aWpAdArray[j].key !== undefined) {
       wpData[aWpAdArray[j].field] = aWpAdArray[j].key;
       wpData[aWpAdArray[j].field + "__TXT"] = aWpAdArray[j].value;
      } else {
       wpData[aWpAdArray[j].field] = aWpAdArray[j].value;
      }
      if (this.oController.vTimedependency === "X") {
       wpData.VALIDUNTILDATE = "9999-12-31T00:00:00";
      }
     }
    }
    this.wpArray.push(wpData);
   }
  }

  if (fcg.mdg.editbp.handlers.ContactPerson.oController.isAddressVisited === "X") {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oController.oDetailComm.BP_AddressesRel.results;
  } else {
   addArray = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults.BP_AddressesRel.results;
  }

  for (var l = 0; l < addArray.length; l++) {
   wpAdIdArray.push(addArray[l].AD_ID);
  }

  var createAddrModel = fcg.mdg.editbp.handlers.Communication.oCreateModel;
  for (var m = 0; m < createAddrModel.length; m++) {
   wpAdIdArray.push(createAddrModel[m].body.AD_ID);
  }

  this.createWPArrForTel(aWpAdArray, wpAdIdArray);
  this.createWPArrForMob(aWpAdArray, wpAdIdArray);
  this.createWPArrForFax(aWpAdArray, wpAdIdArray);
  this.createWPArrForEmail(aWpAdArray, wpAdIdArray);
  this.createWPArrForIAV(aWpAdArray, wpAdIdArray);
 },

 createWPArrForTel: function(createdArray, wpAdIdArray) {
  var telArray = [],
   wpPhoneArr = [];
  var vWPKey = "",
   currentKey = "",
   addrId, index, wpTel;

  for (var k = 0; k < createdArray.length; k++) {
   if (createdArray[k].entity === "BP_WorkplaceCommPhonesRel") {
    wpPhoneArr.push(createdArray[k]);
   }
  }

  if (wpPhoneArr.length === 0) {
   return;
  }

  wpPhoneArr.sort(function(a, b) {
   return parseInt(a.wpKey, 10) - parseInt(b.wpKey, 10) || parseInt(a.currentEntityKey, 10) - parseInt(b.currentEntityKey, 10);
  });

  for (var i = 0; i < wpPhoneArr.length; i++) {
   wpTel = {};
   if (vWPKey === "") {
    vWPKey = wpPhoneArr[i].wpKey;
    addrId = wpPhoneArr[i].addrIndex;
    index = wpAdIdArray[addrId];
    index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);
   }
   if (vWPKey !== wpPhoneArr[i].wpKey) {
    this.wpArray[index].BP_WorkplaceCommPhonesRel = telArray;
    telArray = [];
   }
   if (currentKey === wpPhoneArr[i].currentEntityKey && vWPKey === wpPhoneArr[i].wpKey) {
    continue;
   }

   vWPKey = wpPhoneArr[i].wpKey;
   addrId = wpPhoneArr[i].addrIndex;
   index = wpAdIdArray[addrId];
   index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);

   for (var j = 0; j < wpPhoneArr.length; j++) {
    if (wpPhoneArr[i].currentEntityKey === wpPhoneArr[j].currentEntityKey && wpPhoneArr[i].wpKey === wpPhoneArr[j].wpKey) {
     currentKey = wpPhoneArr[i].currentEntityKey;
     wpTel[wpPhoneArr[j].field] = wpPhoneArr[j].value;
     if (this.oController.vTimedependency === "X") {
      wpTel.VALIDUNTILDATE = "9999-12-31T00:00:00";
     }
     if (wpPhoneArr[j].currentEntityKey === "0") {
      wpTel.R_3_USER = "1";
      wpTel.STD_NO = "X";
     } else {
      wpTel.R_3_USER = "";
     }
    }
   }
   telArray.push(wpTel);
  }

  if (telArray.length > 0) {
   this.wpArray[index].BP_WorkplaceCommPhonesRel = telArray;
  }
 },

 createWPArrForMob: function(createdArray, wpAdIdArray) {
  var mobArray = [],
   wpMobArr = [];
  var vWPKey = "",
   currentKey = "",
   addrId, index, wpMob;

  for (var k = 0; k < createdArray.length; k++) {
   if (createdArray[k].entity === "BP_WorkplaceCommMobilesRel") {
    wpMobArr.push(createdArray[k]);
   }
  }

  if (wpMobArr.length === 0) {
   return;
  }

  wpMobArr.sort(function(a, b) {
   return parseInt(a.wpKey, 10) - parseInt(b.wpKey, 10) || parseInt(a.currentEntityKey, 10) - parseInt(b.currentEntityKey, 10);
  });

  for (var i = 0; i < wpMobArr.length; i++) {
   wpMob = {};
   if (wpMobArr[i].entity === "BP_WorkplaceCommMobilesRel") {
    if (vWPKey === "") {
     vWPKey = wpMobArr[i].wpKey;
     addrId = wpMobArr[i].addrIndex;
     index = wpAdIdArray[addrId];
     index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);
    }
    if (vWPKey !== wpMobArr[i].wpKey) {
     this.wpArray[index].BP_WorkplaceCommMobilesRel = mobArray;
     mobArray = [];
    }

    if (currentKey === wpMobArr[i].currentEntityKey && vWPKey === wpMobArr[i].wpKey) {
     continue;
    }

    vWPKey = wpMobArr[i].wpKey;
    addrId = wpMobArr[i].addrIndex;
    index = wpAdIdArray[addrId];
    index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);

    for (var j = 0; j < wpMobArr.length; j++) {
     if (wpMobArr[i].currentEntityKey === wpMobArr[j].currentEntityKey && wpMobArr[i].wpKey === wpMobArr[j].wpKey) {
      currentKey = wpMobArr[i].currentEntityKey;
      wpMob[wpMobArr[j].field] = wpMobArr[j].value;
      if (this.oController.vTimedependency === "X") {
       wpMob.VALIDUNTILDATE = "9999-12-31T00:00:00";
      }
      if (wpMobArr[j].currentEntityKey === "0") {
       wpMob.R_3_USER = "3";
       wpMob.STD_NO = "X";
      } else {
       wpMob.R_3_USER = "2";
      }
     }
    }
    mobArray.push(wpMob);
   }
  }

  if (mobArray.length > 0) {
   this.wpArray[index].BP_WorkplaceCommMobilesRel = mobArray;
  }
 },

 createWPArrForFax: function(createdArray, wpAdIdArray) {
  var faxArray = [],
   wpFaxArr = [];
  var vWPKey = "",
   currentKey = "",
   addrId, wpFax, index;

  for (var k = 0; k < createdArray.length; k++) {
   if (createdArray[k].entity === "BP_WorkplaceCommFaxesRel") {
    wpFaxArr.push(createdArray[k]);
   }
  }

  if (wpFaxArr.length === 0) {
   return;
  }

  wpFaxArr.sort(function(a, b) {
   return parseInt(a.wpKey, 10) - parseInt(b.wpKey, 10) || parseInt(a.currentEntityKey, 10) - parseInt(b.currentEntityKey, 10);
  });

  for (var i = 0; i < wpFaxArr.length; i++) {
   wpFax = {};
   if (wpFaxArr[i].entity === "BP_WorkplaceCommFaxesRel") {
    if (vWPKey === "") {
     vWPKey = wpFaxArr[i].wpKey;
     addrId = wpFaxArr[i].addrIndex;
     index = wpAdIdArray[addrId];
     index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);
    }

    if (vWPKey !== wpFaxArr[i].wpKey) {
     this.wpArray[index].BP_WorkplaceCommFaxesRel = faxArray;
     faxArray = [];
    }

    if (currentKey === wpFaxArr[i].currentEntityKey && vWPKey === wpFaxArr[i].wpKey) {
     continue;
    }

    vWPKey = wpFaxArr[i].wpKey;
    addrId = wpFaxArr[i].addrIndex;
    index = wpAdIdArray[addrId];
    index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);

    for (var j = 0; j < wpFaxArr.length; j++) {
     if (wpFaxArr[i].currentEntityKey === wpFaxArr[j].currentEntityKey && wpFaxArr[i].wpKey === wpFaxArr[j].wpKey) {
      currentKey = wpFaxArr[i].currentEntityKey;
      wpFax[wpFaxArr[j].field] = wpFaxArr[j].value;
      if (this.oController.vTimedependency === "X") {
       wpFax.VALIDUNTILDATE = "9999-12-31T00:00:00";
      }
      if (wpFaxArr[j].currentEntityKey === "0") {
       wpFax.STD_NO = "X";
      }
     }
    }
    faxArray.push(wpFax);
   }
  }

  if (faxArray.length > 0) {
   this.wpArray[index].BP_WorkplaceCommFaxesRel = faxArray;
  }
 },

 createWPArrForEmail: function(createdArray, wpAdIdArray) {
  var emailArray = [],
   wpEmailArr = [];
  var vWPKey = "",
   currentKey = "",
   addrId, wpEmail, index;

  for (var k = 0; k < createdArray.length; k++) {
   if (createdArray[k].entity === "BP_WorkplaceCommEMailsRel") {
    wpEmailArr.push(createdArray[k]);
   }
  }

  if (wpEmailArr.length === 0) {
   return;
  }

  wpEmailArr.sort(function(a, b) {
   return parseInt(a.wpKey, 10) - parseInt(b.wpKey, 10) || parseInt(a.currentEntityKey, 10) - parseInt(b.currentEntityKey, 10);
  });

  for (var i = 0; i < wpEmailArr.length; i++) {
   wpEmail = {};
   if (wpEmailArr[i].entity === "BP_WorkplaceCommEMailsRel") {
    if (vWPKey === "") {
     vWPKey = wpEmailArr[i].wpKey;
     addrId = wpEmailArr[i].addrIndex;
     index = wpAdIdArray[addrId];
     index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);
    }
    if (vWPKey !== wpEmailArr[i].wpKey) {
     this.wpArray[index].BP_WorkplaceCommEMailsRel = emailArray;
     emailArray = [];
    }

    if (currentKey === wpEmailArr[i].currentEntityKey && vWPKey === wpEmailArr[i].wpKey) {
     continue;
    }

    vWPKey = wpEmailArr[i].wpKey;
    addrId = wpEmailArr[i].addrIndex;
    index = wpAdIdArray[addrId];
    index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);

    for (var j = 0; j < wpEmailArr.length; j++) {
     if (wpEmailArr[i].currentEntityKey === wpEmailArr[j].currentEntityKey && wpEmailArr[j].wpKey === wpEmailArr[i].wpKey) {
      currentKey = wpEmailArr[i].currentEntityKey;
      wpEmail[wpEmailArr[j].field] = wpEmailArr[j].value;
      if (this.oController.vTimedependency === "X") {
       wpEmail.VALIDUNTILDATE = "9999-12-31T00:00:00";
      }
      if (wpEmailArr[j].currentEntityKey === "0") {
       wpEmail.STD_NO = "X";
      }
     }
    }
    emailArray.push(wpEmail);
   }
  }

  if (emailArray.length > 0) {
   this.wpArray[index].BP_WorkplaceCommEMailsRel = emailArray;
  }
 },

 createWPArrForIAV: function(createdArray, wpAdIdArray) {
  var iavArray = [],
   wpIavArr = [];
  var vWPKey = "",
   currentKey = "",
   addrId, wpIAV, iavPer, index;

  for (var k = 0; k < createdArray.length; k++) {
   if (createdArray[k].entity === "BP_WorkplaceIntAddressVersRel" || createdArray[k].entity === "BP_WorkplaceIntPersVersionRel") {
    wpIavArr.push(createdArray[k]);
   }
  }

  if (wpIavArr.length === 0) {
   return;
  }

  wpIavArr.sort(function(a, b) {
   return parseInt(a.wpKey, 10) - parseInt(b.wpKey, 10) || parseInt(a.currentEntityKey, 10) - parseInt(b.currentEntityKey, 10);
  });

  for (var i = 0; i < wpIavArr.length; i++) {
   wpIAV = {};
   iavPer = {};
   if (wpIavArr[i].entity === "BP_WorkplaceIntAddressVersRel") {
    if (vWPKey === "") {
     vWPKey = wpIavArr[i].wpKey;
     addrId = wpIavArr[i].addrIndex;
     index = wpAdIdArray[addrId];
     index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);
    }
    if (vWPKey !== wpIavArr[i].wpKey) {
     this.wpArray[index].BP_WorkplaceIntAddressVersRel = iavArray;
     iavArray = [];
    }

    if (currentKey === wpIavArr[i].currentEntityKey && vWPKey === wpIavArr[i].wpKey) {
     continue;
    }

    vWPKey = wpIavArr[i].wpKey;
    addrId = wpIavArr[i].addrIndex;
    index = wpAdIdArray[addrId];
    index = fcg.mdg.editbp.handlers.ContactPersonCreate.aWpIds.indexOf(index);

    for (var j = 0; j < wpIavArr.length; j++) {
     if (wpIavArr[j].entity === "BP_WorkplaceIntAddressVersRel" && wpIavArr[j].currentEntityKey === wpIavArr[i].currentEntityKey &&
      wpIavArr[j].wpKey === wpIavArr[i].wpKey) {
      currentKey = wpIavArr[i].currentEntityKey;
      if (wpIavArr[j].key !== undefined) {
       wpIAV[wpIavArr[j].field] = wpIavArr[j].key;
       if (wpIavArr[j].field === "ADDR_VERS") {
        iavPer[wpIavArr[j].field + "__TXT"] = wpIavArr[j].value;
       }
      } else {
       wpIAV[wpIavArr[j].field] = wpIavArr[j].value;
      }
      if (this.oController.vTimedependency === "X") {
       wpIAV.VALIDUNTILDATE = "9999-12-31T00:00:00";
      }
      if (wpIavArr[j].currentEntityKey === "0") {
       wpIAV.STANDARDADDRESS = "X";
      }
     }
     if (wpIavArr[j].entity === "BP_WorkplaceIntPersVersionRel" && wpIavArr[i].currentEntityKey === wpIavArr[j].currentEntityKey &&
      wpIavArr[j].wpKey === wpIavArr[i].wpKey) {
      currentKey = wpIavArr[i].currentEntityKey;
      if (wpIavArr[j].key !== undefined) {
       iavPer[wpIavArr[j].field] = wpIavArr[j].key;
       if ((wpIavArr[j].field === "TITLE_P") || (wpIavArr[j].field === "ADDR_VERS")) {
        iavPer[wpIavArr[j].field + "__TXT"] = wpIavArr[j].value;
       }
      } else {
       iavPer[wpIavArr[j].field] = wpIavArr[j].value;
      }
     }
    }
    iavPer.ADDR_VERS = wpIAV.ADDR_VERS;
    wpIAV.BP_WorkplaceIntPersVersionRel = iavPer;
    iavArray.push(wpIAV);
   }
  }

  if (iavArray.length > 0) {
   this.wpArray[index].BP_WorkplaceIntAddressVersRel = iavArray;
  }
 },

 prepareEntityData: function(str, flag, chArray) {
  var objString = str;
  var updatedData = "{";
  if (flag === false) {
   if (chArray.key !== undefined) {
    objString = updatedData + "\"" + chArray.field + "\":\"" + chArray.key + "\",";
    objString = objString + "\"" + chArray.field + "__TXT" + "\":\"" + chArray.value + "\",";
   } else {
    objString = updatedData + "\"" + chArray.field + "\":\"" + chArray.value + "\",";
   }

  } else {
   if (chArray.key !== undefined) {
    objString = objString + "\"" + chArray.field + "\":\"" + chArray.key + "\",";
    objString = objString + "\"" + chArray.field + "__TXT" + "\":\"" + chArray.value + "\",";
   } else {
    objString = objString + "\"" + chArray.field + "\":\"" + chArray.value + "\",";
   }
  }
  return objString;
 },

 pad: function(str, max) {
  var val = str.toString();
  return val.length < max ? this.pad("0" + val, max) : val;
 },

 getCurrentDate: function() {
  var currDate = new Date();
  currDate = currDate.toJSON().toString();
  currDate = currDate.substr(0, 19);
  return currDate;
 },

 getCPModel: function() {
  if (this.oController.vCurrentActionId === "createRB") {
   return this.oCPModel;
  } else if (this.oController.vCurrentActionId === "changeRB") {
   return fcg.mdg.editbp.handlers.ContactPersonChange.ocpChangeModel;
  } else if (this.oController.vCurrentActionId === "deleteRB") {
   return fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteModel;
  }
 },

 getDispCPModel: function() {
  if (this.oController.vCurrentActionId === "changeRB") {
   return fcg.mdg.editbp.handlers.ContactPersonChange.oCPData;
  } else {
   return this.oDispCPModel;
  }
 },

 setRelResults: function(result) {
  this.oRelResults = result;
 },

 getRelResults: function() {
  return this.oRelResults;
 },

 onChange_Create: function(oEvent) {
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onCPTelCountrykey: function(oEvent) {
  var telCountryId = oEvent.getParameters().id;
  telCountryId = sap.ui.getCore().byId(telCountryId);
  fcg.mdg.editbp.handlers.ContactPerson.oController.countryCPVH(telCountryId, oEvent);
 },
 onCPMobCountrykey: function(oEvent) {
  var mobCountryId = oEvent.getParameters().id;
  mobCountryId = sap.ui.getCore().byId(mobCountryId);
  fcg.mdg.editbp.handlers.ContactPerson.oController.countryCPVH(mobCountryId, oEvent);
 },
 onCPFaxCountrykey: function(oEvent) {
  var faxCountryId = oEvent.getParameters().id;
  faxCountryId = sap.ui.getCore().byId(faxCountryId);
  fcg.mdg.editbp.handlers.ContactPerson.oController.countryCPVH(faxCountryId, oEvent);
 },

 onFirstNameChange: function(oEvent) {
  this.ChangeDeferred = jQuery.Deferred();
  var name = sap.ui.getCore().byId("SF-BP_Person-FirstName");
  var partID = sap.ui.getCore().byId("SF-BP_Relation-partnerId");
  name.attachEventOnce("change", function() {

  }, this);
  var firstName = name.getValue();
  if (firstName.replace(/^[ ]+|[ ]+$/g, '') === "") {
   name.setValue("");
  }
  var vText = partID.getValueStateText();
  if (vText === this.oController.i18nBundle.getText("ERROR_PARTNER_CHECK") || partID.getValueState() === "Warning") {
   partID.setValueState("None");
   partID.setValueStateText("");
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onLastNameChange: function(oEvent) {
  this.ChangeDeferred = jQuery.Deferred();
  var name = sap.ui.getCore().byId("SF-BP_Person-LastName");
  var partID = sap.ui.getCore().byId("SF-BP_Relation-partnerId");

  partID.attachEventOnce("change", function() {

  }, this);
  var lastName = name.getValue();
  if (lastName.replace(/^[ ]+|[ ]+$/g, '') === "") {
   name.setValue("");
  }
  var vText = partID.getValueStateText();
  if (vText === this.oController.i18nBundle.getText("ERROR_PARTNER_CHECK") || partID.getValueState() === "Warning") {
   partID.setValueState("None");
   partID.setValueStateText("");
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onTitleChange: function(oEvent) {
  var title = sap.ui.getCore().byId("SF-BP_RelationPartner-title");
  var gender = sap.ui.getCore().byId("SF-BP_Person-Gender");
  if (title.getSelectedKey() === "0001" && gender.getSelectedKey() !== "1") {
   gender.setSelectedKey("1");
   gender.fireEvent("change");
  }
  if (title.getSelectedKey() === "0002" && gender.getSelectedKey() !== "2") {
   gender.setSelectedKey("2");
   gender.fireEvent("change");
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onGenderChange: function(oEvent) {
  var title = sap.ui.getCore().byId("SF-BP_RelationPartner-title");
  var gender = sap.ui.getCore().byId("SF-BP_Person-Gender");
  if (gender.getSelectedKey() === "1" && title.getSelectedKey() !== "0001") {
   title.setSelectedKey("0001");
   title.fireEvent("change");
  }
  if (gender.getSelectedKey() === "2" && title.getSelectedKey() !== "0002") {
   title.setSelectedKey("0002");
   title.fireEvent("change");
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onChange: function(oEvent) {
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onCorsLangChange: function(oEvent) {
  var oCorsLang = sap.ui.getCore().byId("SF-BP_Person-LanguageKey");
  oCorsLang.setValue(oCorsLang.getValue().toUpperCase());
  var corsLang = oCorsLang.getValue();
  var corsLangNoSpaces = corsLang.replace(/^[ ]+|[ ]+$/g, '');
  corsLangNoSpaces = corsLangNoSpaces.toUpperCase();
  var oCorsLangName = sap.ui.getCore().byId("SF-BP_Person-LanguageDesc");
  var aCorrLangValues = this.oController.aCorrLangValues;

  if (corsLangNoSpaces !== "") {
   //-------------- Existence Check -------------------------------
   var langExists = false;
   for (var i = 0; i < aCorrLangValues.results.length; i++) {
    if (aCorrLangValues.results[i].KEY === corsLangNoSpaces) {
     if (oCorsLang.getValue() !== "") {
      oCorsLangName.setValue(aCorrLangValues.results[i].TEXT);
      oCorsLang.setValueState("None");
      oCorsLang.setValueStateText("");
     }
     langExists = true;
     oCorsLangName.fireEvent("change");
     break;
    }
   }
   if (langExists === false) {
    //If correspondence language is not found, raise an error
    oCorsLangName.setValue();
    oCorsLang.setValueState("Error");
    var sFieldName = "";

    sFieldName = this.oController.i18nBundle.getText("CLANG");
    var errorMsg = sFieldName + " " + oCorsLang.getValue() + " " + this.oController.i18nBundle.getText("NO_EXISTENCE");
    oCorsLang.setValueStateText(errorMsg);
   }

  } else {
   oCorsLang.setValue();
   oCorsLang.setValueStateText("");
   oCorsLangName.setValue();
  }
  fcg.mdg.editbp.handlers.ContactPerson.oController.onChange(oEvent);
 },

 onCLangVH: function() {
  var i18 = this.oController.i18nBundle;
  var langKey = sap.ui.getCore().byId("SF-BP_Person-LanguageKey");
  var langName = sap.ui.getCore().byId("SF-BP_Person-LanguageDesc");
  var aCorrLangValues = this.oController.aCorrLangValues;

  if (sap.ui.getCore().byId("CorrespodingLangDialog") !== undefined) {
   sap.ui.getCore().byId("CorrespodingLangDialog").destroy();
  }

  var oSelectDialog = new sap.m.SelectDialog({
   id: "CorrespodingLangDialog",
   title: i18.getText("LANG"),
   noDataText: i18.getText("LOAD") + "...",
   confirm: function(oEvent) {
    langKey.setValueState("None");
    langKey.setValueStateText("");
    langKey.setValue(oEvent.getParameters().selectedItem.getProperty("description"));
    langName.setValue(oEvent.getParameters().selectedItem.getProperty("title"));
    sap.ui.getCore().byId("SF-BP_Person-LanguageKey").fireEvent("change");
   },
   search: function(oEvent) {
    var sValue = oEvent.getParameter("value").toUpperCase();
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
    var oItems = oSelectDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
      var sLangKey = oItems[i].getBindingContext().getProperty("KEY");
      var sLangDesc = oItems[i].getBindingContext().getProperty("TEXT");

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
    sValue = sValue.replace(/^[ ]+|[ ]+$/g, '');
    var oItems = oSelectDialog.getItems();
    for (var i = 0; i < oItems.length; i++) {
     if (sValue.length > 0) { //Get all the rows of the table and compare the string one by one across all columns
      var sLangKey = oItems[i].getBindingContext().getProperty("KEY");
      var sLangDesc = oItems[i].getBindingContext().getProperty("TEXT");

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

  if (!this.isNull(aCorrLangValues)) {
   if (aCorrLangValues.results.length > 0) {
    var oItemTemplate = new sap.m.StandardListItem({
     title: "{TEXT}",
     description: "{KEY}",
     active: true
    });
    var oInputHelpModel = new sap.ui.model.json.JSONModel();
    oInputHelpModel.setData(aCorrLangValues);
    oSelectDialog.setModel(oInputHelpModel);
    oSelectDialog.setGrowingThreshold(aCorrLangValues.results.length);
    oSelectDialog.bindAggregation("items", "/results", oItemTemplate);
   } else {
    oSelectDialog.setNoDataText(i18.getText("NO_DATA"));
   }
  } else {
   oSelectDialog.setNoDataText(i18.getText("NO_DATA"));
  }
  oSelectDialog.open();
 },

 setWPAddressArray: function(result) {
  var addArray = "";
  var results = [];
  var obj;

  if (this.oController.isAddressVisited === "X") {
   addArray = this.oController.oDetailComm.BP_AddressesRel.results;
  } else {
   addArray = result.BP_AddressesRel.results;
  }

  for (var i = 0; i < addArray.length; i++) {
   obj = {};
   obj.AD_ID = addArray[i].AD_ID;
   obj.AD_ID__TXT = addArray[i].AD_ID__TXT;
   obj.ATTR_NAME = "ADDRESS_NUMBER";
   results.push(obj);
  }

  if (fcg.mdg.editbp.handlers.Communication.oCreateModel.length > 0) {
   var createAddrModel = fcg.mdg.editbp.handlers.Communication.oCreateModel;
   for (var j = 0; j < createAddrModel.length; j++) {
    obj = {};
    obj.AD_ID = createAddrModel[j].body.AD_ID;
    obj.AD_ID__TXT = createAddrModel[j].body.AD_ID__TXT;
    obj.ATTR_NAME = "ADDRESS_NUMBER";
    results.push(obj);
   }
  }

  this.oWpAddressResults.results = results;
 },

 setWPIavArray: function(result) {
  var addArray = "";
  var results = [];
  var obj, iavObj, arr;

  if (this.oController.isAddressVisited === "X") {
   addArray = this.oController.oDetailComm.BP_AddressesRel.results;
  } else {
   addArray = result.BP_AddressesRel.results;
  }

  for (var i = 0; i < addArray.length; i++) {
   obj = {};
   arr = [];
   obj.AD_ID = addArray[i].AD_ID;
   obj.AD_ID__TXT = addArray[i].AD_ID__TXT;
   obj.ATTR_NAME = "ADDRESS_NUMBER";
   var iavRes = addArray[i].BP_AddressVersionsOrgRel.results;
   for (var j = 0; j < iavRes.length; j++) {
    iavObj = {};
    iavObj.ADDR_VERS = iavRes[j].ADDR_VERS;
    iavObj.ADDR_VERS__TXT = iavRes[j].ADDR_VERS__TXT;
    arr.push(iavObj);
   }
   obj.IAV = arr;
   results.push(obj);
  }

  if (fcg.mdg.editbp.handlers.Communication.oCreateModel.length > 0) {
   var createAddrModel = fcg.mdg.editbp.handlers.Communication.oCreateModel;
   var iavAdrRes = [];
   for (var k = 0; k < createAddrModel.length; k++) {
    obj = {};
    arr = [];
    obj.AD_ID = createAddrModel[k].body.AD_ID;
    obj.AD_ID__TXT = createAddrModel[k].body.AD_ID__TXT;
    obj.ATTR_NAME = "ADDRESS_NUMBER";

    if (createAddrModel[k].body.BP_AddressVersionsOrgRel !== undefined) {
     iavAdrRes = createAddrModel[k].body.BP_AddressVersionsOrgRel.results;
    }

    for (var l = 0; l < iavAdrRes.length; l++) {
     iavObj = {};
     iavObj.ADDR_VERS = iavAdrRes[l].ADDR_VERS;
     iavObj.ADDR_VERS__TXT = iavAdrRes[l].ADDR_VERS__TXT;
     arr.push(iavObj);
    }
    obj.IAV = arr;
    results.push(obj);
   }
  }

  this.oWpIavResults.results = results;
 },

 getWPAddressArray: function() {
  return this.oWpAddressResults;
 },

 getWPIavArray: function() {
  return this.oWpIavResults;
 },

 isNull: function(value) {
  return typeof value === "undefined" || value === "unknown" || value === null || value === "null" || value === "" || parseInt(value, 10) ===
   0;
 },

 // **************************Existing Contact Person *********************
 onPartnerVH: function() {
  var wController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = wController.i18nBundle;
  var vFirstName = sap.ui.getCore().byId("SF-BP_Person-FirstName").getValue();
  var vLastName = sap.ui.getCore().byId("SF-BP_Person-LastName").getValue();
  var fPartnerId = sap.ui.getCore().byId("SF-BP_Relation-partnerId");

  var query;
  var queryFilter;
  if (vLastName === "" && vFirstName === "") {
   fPartnerId.setValueState("Warning");
   fPartnerId.setValueStateText(i18.getText("ERROR_PARTNER_CHECK"));
   return;
  } else if (vFirstName === "" && vLastName !== "") {
   queryFilter = "LastName eq '" + vLastName + "'";
  } else if (vLastName === "" && vFirstName !== "") {
   queryFilter = "FirstName eq '" + vFirstName + "'";
  } else {
   queryFilter = "FirstName eq '" + vFirstName + "' and LastName eq '" + vLastName + "'";
  }

  if (this.oDialogCP) {
   this.oDialogCP.destroy();
  }
  //get the instance of Duplicate contact person list fragment
  this.oDialogCP = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DuplicateContactPersonList", this);

  var oInputHelpModel = new sap.ui.model.json.JSONModel();
  fcg.mdg.editbp.handlers.ContactPerson.oPartnerModel = new sap.ui.model.odata.ODataModel(wController.getView().getModel().sServiceUrl,
   true);
  var vGlobalInstance = this;
  query = "/SearchContactPersons?$filter=";
  query = query + jQuery.sap.encodeURL(queryFilter);
  var tempData = {
   "results": []
  };
  fcg.mdg.editbp.handlers.ContactPerson.oPartnerModel.read(query, null, null, true,
   function(data, oError) {
    var aCPModel = fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel;

    for (var z = 0; z < data.results.length; z++) {
     var vCPIdAlreadyUsed = false;
     for (var k = 0; k < aCPModel.length; k++) {
      if (parseInt(aCPModel[k].partner2, 10) === parseInt(data.results[z].CpId, 10)) {
       vCPIdAlreadyUsed = true;
       break;
      }
     }
     if (!vCPIdAlreadyUsed) {
      if (fPartnerId.getValue() !== "") {
       if (fPartnerId.getValue() !== data.results[z].CpId) {
        tempData.results.push(data.results[z]);
       }
      } else {
       tempData.results.push(data.results[z]);
      }
     }
    }

    oInputHelpModel.setData(tempData);
    if (tempData.results.length > 0) {
     var oLocalizationModel = new sap.ui.model.resource.ResourceModel({
      bundleUrl: jQuery.sap.getModulePath("fcg.mdg.editbp") + "/i18n/i18n.properties"
     });

     oLocalizationModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
     vGlobalInstance.oDialogCP.setModel(oLocalizationModel, "i18n");
     vGlobalInstance.oDialogCP.setContentWidth("50%");
     vGlobalInstance.oDialogCP.setModel(oInputHelpModel);
     vGlobalInstance.oDialogCP.open();

    } else {
     fPartnerId.setValueState("Warning");
     if (data.results.length === 0) {
      fPartnerId.setValueStateText(i18.getText("MSG_NO_CP_DATA"));
     } else {
      fPartnerId.setValueStateText(i18.getText("MSG_NO_FURTHER_CP_DATA"));
     }

    }

   },
   function(oError) {

   });
 },

 handleSearch: function(oEvent) {
  var wController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = wController.i18nBundle;
  var vGlobalInstance = this;
  var sValue = oEvent.getParameter("value");

  var oFilter = new sap.ui.model.Filter(
   [
    new sap.ui.model.Filter("CpDesc", sap.ui.model.FilterOperator.Contains, sValue),
    new sap.ui.model.Filter("CpId", sap.ui.model.FilterOperator.Contains, sValue),
    new sap.ui.model.Filter("AssignedOrgDesc", sap.ui.model.FilterOperator.Contains, sValue),
    new sap.ui.model.Filter("AssignedOrgId", sap.ui.model.FilterOperator.Contains, sValue)
   ],
   false);

  var oBinding = oEvent.getSource().getBinding("items");
  oBinding.filter([oFilter]);
  var vTableDialog = sap.ui.getCore().byId("duplicateCPList");
  if (vTableDialog.getItems().length === 0) {
   vGlobalInstance.oDialogCP.setNoDataText(i18.getText("MSG_NO_CP_DATA"));
  } else {
   vGlobalInstance.oDialogCP.setNoDataText(i18.getText("LOAD"));
  }
 },
 handleClose: function(oEvent) {
  var wController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = wController.i18nBundle;
  var aContexts = oEvent.getParameter("selectedContexts");
  var fName = sap.ui.getCore().byId("SF-BP_Person-FirstName");
  var lName = sap.ui.getCore().byId("SF-BP_Person-LastName");
  var partnerId = sap.ui.getCore().byId("SF-BP_Relation-partnerId");
  var langKey = sap.ui.getCore().byId("SF-BP_Person-LanguageKey");
  var langDesc = sap.ui.getCore().byId("SF-BP_Person-LanguageDesc");
  var title = sap.ui.getCore().byId("SF-BP_RelationPartner-title");
  var acdTitle = sap.ui.getCore().byId("SF-BP_Person-AcadTitle");
  var gender = sap.ui.getCore().byId("SF-BP_Person-Gender");
  var aCorrLangValues = wController.aCorrLangValues;

  if (this.isNull(aContexts)) {
   return;
  }

  if (aContexts.length) {
   var selectedObj = aContexts[0].getObject();
   var duplicateCP = false;
   this.cpDesc = fcg.mdg.editbp.util.Formatter.descriptionAndCode(selectedObj.CpDesc, selectedObj.CpId);

   var allFields = [fName, lName, gender, title, acdTitle, langKey];
   var lang = [langKey, langDesc];

   fName.setValue(selectedObj.FirstName);
   fName.fireEvent("change");
   lName.setValue(selectedObj.LastName);
   lName.fireEvent("change");
   partnerId.setValue(selectedObj.CpId);
   partnerId.setValueState("None");
   gender.setSelectedKey(selectedObj.CpGender);
   gender.fireEvent("change");
   title.setSelectedKey(selectedObj.CpTitle);
   title.fireEvent("change");
   acdTitle.setSelectedKey(selectedObj.CpAcademicTitle);
   acdTitle.fireEvent("change");
   this.setEnableForFields(allFields, false);

   if (!this.isNull(aCorrLangValues)) {
    if (aCorrLangValues.results.length > 0 && selectedObj.CpCorrLang !== "") {
     for (var j = 0; j < aCorrLangValues.results.length; j++) {
      if (selectedObj.CpCorrLang === aCorrLangValues.results[j].KEY) {
       langDesc.setValue(aCorrLangValues.results[j].TEXT);
       langKey.setValue(aCorrLangValues.results[j].KEY);
       langKey.fireEvent("change");
       break;
      }
     }
    } else {
     this.setValueForFieds(lang, "");
    }
   } else {
    this.setValueForFieds(lang, "");
   }
   var fields = [fName, lName, partnerId];
   if (duplicateCP) {
    fName.setEnabled(true);
    lName.setEnabled(true);
    this.setValueStateForFieds(fields, "Error");
    this.setValueStateTextForFieds(fields, i18.getText("DUPLICATE_CP_CHECK"));
   } else {
    fName.setEnabled(false);
    lName.setEnabled(false);
    this.setValueStateForFieds(fields, "None");
    this.setValueStateTextForFieds(fields, "");
   }
   fcg.mdg.editbp.handlers.ContactPerson.onPartnerIdChange();
  }
  oEvent.getSource().getBinding("items").filter([]);
 },

 partnerIdChange: function(oControlEvent) {
  sap.ui.getCore().byId("SF-BP_Relation-partnerId").setValueState("None");
 },

 onPartnerIdChange: function(oEvent) {
  this.ChangeDeferred = jQuery.Deferred();

  var wController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var i18 = wController.i18nBundle;
  var fName = sap.ui.getCore().byId("SF-BP_Person-FirstName");
  var lName = sap.ui.getCore().byId("SF-BP_Person-LastName");
  var partnerId = sap.ui.getCore().byId("SF-BP_Relation-partnerId");
  var langKey = sap.ui.getCore().byId("SF-BP_Person-LanguageKey");
  var langDesc = sap.ui.getCore().byId("SF-BP_Person-LanguageDesc");
  var title = sap.ui.getCore().byId("SF-BP_RelationPartner-title");
  var acdTitle = sap.ui.getCore().byId("SF-BP_Person-AcadTitle");
  var gender = sap.ui.getCore().byId("SF-BP_Person-Gender");
  var aCorrLangValues = wController.aCorrLangValues;

  var allFields = [fName, lName, gender, title, acdTitle, langKey];
  var fields = [fName, lName, partnerId];
  var lang = [langKey, langDesc];

  var vGlobalInstance = this;
  partnerId.attachEventOnce("change", function() {}, this);
  var partnerValue = partnerId.getValue();
  partnerValue = partnerValue.trim();
  var query;
  var vEncodeURI = "";

  if (partnerValue !== "") {
   vEncodeURI = jQuery.sap.encodeURL("CpId eq '" + partnerValue + "' and ChangeRequestType eq '" + wController.crType + "'");
   fcg.mdg.editbp.handlers.ContactPerson.oPartnerModel = new sap.ui.model.odata.ODataModel(wController.getView().getModel().sServiceUrl,
    true);
   var vIsLocked = "";
   vGlobalInstance.vgIsLocked = "";
   query = "/SearchContactPersons?$filter=" + vEncodeURI;
   fcg.mdg.editbp.handlers.ContactPerson.oPartnerModel.read(query, null, null, false,
    function(data, oError) {
     var errorHeader = "";
     var vIsLockedMessage = "";
     if (oError.headers["sap-message"] !== undefined) {
      errorHeader = oError.headers["sap-message"];
      var parseMessage = JSON.parse(errorHeader);
      vIsLockedMessage = parseMessage.message;
     }

     if (data.results.length > 0) {
      var aCPModel = fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel;
      var duplicateCPId = false;
      for (var i = 0; i < aCPModel.length; i++) {
       if (parseInt(partnerValue, 10) === parseInt(aCPModel[i].partner2, 10)) {
        duplicateCPId = true;
        break;
       }
      }

      vIsLocked = data.results[0].IsLocked;
      vGlobalInstance.vgIsLocked = vIsLocked;
      fName.setValue(data.results[0].FirstName);
      lName.setValue(data.results[0].LastName);
      gender.setSelectedKey(data.results[0].CpGender);
      title.setSelectedKey(data.results[0].CpTitle);
      acdTitle.setSelectedKey(data.results[0].CpAcademicTitle);

      fName.fireEvent("change");
      lName.fireEvent("change");
      gender.fireEvent("change");
      title.fireEvent("change");
      acdTitle.fireEvent("change");

      if (duplicateCPId) {
       fName.setValueState("Error");
       lName.setValueState("Error");
       fName.setValueStateText(i18.getText("DUPLICATE_CP_CHECK"));
       lName.setValueStateText(i18.getText("DUPLICATE_CP_CHECK"));
       partnerId.setValueState("Error");
       partnerId.setValueStateText(i18.getText("DUPLICATE_CP_CHECK"));
       fName.setEnabled(true);
       lName.setEnabled(true);
       title.setEnabled(false);
       acdTitle.setEnabled(false);
       langKey.setEnabled(false);
       gender.setEnabled(false);
      } else {
       vGlobalInstance.setValueStateForFieds([fName, lName], "None");
       vGlobalInstance.setValueStateTextForFieds([fName, lName], "");
       vGlobalInstance.setEnableForFields(allFields, false);
       // If this PartnerID is already locked in CR, show this warning message
       if (vIsLocked) {
        partnerId.setValueState("Warning");
        partnerId.setValueStateText(vIsLockedMessage);
       } else {
        partnerId.setValueState("None");
        partnerId.setValueStateText("");
       }
      }

      if (!vGlobalInstance.isNull(aCorrLangValues)) {
       if (aCorrLangValues.results.length > 0 && data.results[0].CpCorrLang !== "") {
        for (var j = 0; j < aCorrLangValues.results.length; j++) {
         if (data.results[0].CpCorrLang === aCorrLangValues.results[j].KEY) {
          langDesc.setValue(aCorrLangValues.results[j].TEXT);
          langKey.setValue(aCorrLangValues.results[j].KEY);
          langKey.fireEvent("change");
          break;
         }
        }
       } else {
        vGlobalInstance.setValueForFieds(lang, "");
       }
      } else {
       vGlobalInstance.setValueForFieds(lang, "");
      }
      fcg.mdg.editbp.handlers.ContactPersonCreate.deleteWorkplaceAddress();
      if (!duplicateCPId) {
       fcg.mdg.editbp.handlers.ContactPerson.getBPGuid2(data.results[0].CpId);
      }
     } else {
      partnerId.setValueState("Error");
      partnerId.setValueStateText(i18.getText("PARTNERID_CHECK"));
      vGlobalInstance.setValueForFieds([fName, lName, langKey, langDesc], "");
      vGlobalInstance.setValueStateForFieds([fName, lName], "None");
      vGlobalInstance.setValueStateTextForFieds([fName, lName], "");
      gender.setSelectedKey();
      title.setSelectedKey();
      acdTitle.setSelectedKey();
      fName.fireEvent("change");
      lName.fireEvent("change");
      gender.fireEvent("change");
      title.fireEvent("change");
      acdTitle.fireEvent("change");
      langKey.fireEvent("change");
      vGlobalInstance.setEnableForFields(allFields, true);
     }
     vGlobalInstance.ChangeDeferred.resolve();

    },
    function(oError) {});
  } else {
   if (!fName.getEnabled()) {
    vGlobalInstance.setValueForFieds([fName, lName, langKey, langDesc], "");
    gender.setSelectedKey();
    title.setSelectedKey();
    acdTitle.setSelectedKey();

    this.setEnableForFields(allFields, true);
    this.setValueStateForFieds(fields, "None");
    this.setValueStateTextForFieds(fields, "");
   } else {

    if (fName.getValue() !== "") {
     fName.setValue("");
    }
    if (lName.getValue() !== "") {
     lName.setValue("");
    }
    this.setValueForFieds(lang, "");
    this.setValueStateForFieds([fName, lName], "None");
    this.setEnableForFields(allFields, true);
    gender.setSelectedKey();
    title.setSelectedKey();
    acdTitle.setSelectedKey();
   }
   fName.fireEvent("change");
   lName.fireEvent("change");
   gender.fireEvent("change");
   title.fireEvent("change");
   acdTitle.fireEvent("change");
   langKey.fireEvent("change");
   this.ChangeDeferred.resolve();
  }
  var newvalue = {};
  newvalue.value = partnerId.getValue();
  newvalue.entity = "BP_Relation";
  newvalue.field = "PARTNER2";

  if (wController.vCurrentActionId === "createRB") {
   for (var j = 0; j < wController.createdArray.length; j++) {
    if (wController.createdArray[j].field === newvalue.field && wController.createdArray[j].entity === newvalue.entity) {
     wController.createdArray[j].value = newvalue.value;
     return;
    }
   }
   wController.createdArray.push(newvalue);
  }
 },

 getBPGuid2: function(partnerId) {
  var path = "SearchCollection?$filter=" + jQuery.sap.encodeURL("PARTNER eq '" + partnerId + "'");
  var oBatchModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
  var mheaders = {};
  oBatchModel.getHeaders(mheaders);
  mheaders.SEARCH_MODE = "DB";
  oBatchModel.setHeaders(mheaders);
  oBatchModel.setUseBatch(true);
  var aBatchOperation = [];
  var oBatchOperation1 = oBatchModel.createBatchOperation(path, "GET");
  aBatchOperation.push(oBatchOperation1);
  oBatchModel.clearBatch();
  oBatchModel.addBatchReadOperations(aBatchOperation);
  aBatchOperation = [];
  oBatchModel.submitBatch(function(odata, response) {
   var data = JSON.parse(odata.__batchResponses[0].body);
   var guid2 = data.d.results[0].BP_RootToSearchRel.__deferred.uri;
   var start = guid2.indexOf("'") + 1;
   var stop = guid2.indexOf(")") - 1;
   guid2 = guid2.substring(start, stop);
   fcg.mdg.editbp.handlers.ContactPerson.vBPguid2 = guid2;
   fcg.mdg.editbp.handlers.ContactPerson.getContactPersonAddressData(guid2);
  }, null, false);
  oBatchModel.clearBatch();
 },

 getContactPersonAddressData: function(bpguid, index) {
  var wController = fcg.mdg.editbp.handlers.ContactPerson.oController;
  var path = "/BP_RootCollection(BP_GUID=binary'" + bpguid + "')?$expand=";
  var vPerQuery = path + "BP_AddressesRel,BP_AddressesRel/BP_AddressVersionsPersRel/BP_AddressPersonVersionRel,BP_AddressUsagesRel";

  var oDataModel = new sap.ui.model.odata.ODataModel(wController.getView().getModel().sServiceUrl, false);
  oDataModel.read(
   vPerQuery,
   null,
   null,
   false,
   function(oResult) {
    for (var i = 0; i < oResult.BP_AddressUsagesRel.results.length; i++) {
     if (oResult.BP_AddressUsagesRel.results[i].ADDRESSTYPE === "XXDEFAULT") {
      for (var j = 0; j < oResult.BP_AddressesRel.results.length; j++) {
       if (oResult.BP_AddressesRel.results[j].AD_ID !== oResult.BP_AddressUsagesRel.results[i].AD_ID) {
        oResult.BP_AddressesRel.results.splice(j, 1);
       }
      }
     }
    }
    fcg.mdg.editbp.handlers.ContactPerson.standardAddress = oResult.BP_AddressesRel.results;
   });
 },

 //for setting the values for Fields in Contact Person IAV Fragment
 setValueForFieds: function(fields, value) {
  for (var i = 0; i < fields.length; i++) {
   fields[i].setValue(value);
  }
 },

 //for setting Enable to true for Fields in Contact Person IAV Fragment
 setValueStateForFieds: function(fields, status) {
  for (var i = 0; i < fields.length; i++) {
   fields[i].setValueState(status);
  }
 },

 setValueStateTextForFieds: function(fields, status) {
  for (var i = 0; i < fields.length; i++) {
   fields[i].setValueStateText(status);
  }
 },

 //for setting State (error/None - if validation fails) for Fields in Contact Person IAV Fragment
 setEnableForFields: function(fields, status) {
  for (var i = 0; i < fields.length; i++) {
   fields[i].setEnabled(status);
  }
 },

 removeDuplicate: function(arr) {
  var newArr = [];
  var found, a, b;
  for (var i = 0; i < arr.length; i++) {
   found = false;
   a = JSON.stringify(arr[i]);
   for (var j = 0; j < newArr.length; j++) {
    b = JSON.stringify(newArr[j]);
    if (a === b) {
     found = true;
     break;
    }
   }
   if (found === false) {
    newArr[i] = arr[j];
   }
  }
  return newArr;
 },

 //Validations
 performUIValidations: function(wController) {
  var errorMsg = "";
  var partnerId = sap.ui.getCore().byId("SF-BP_Relation-partnerId");
  if (partnerId.getValueState() === "Error") {
   errorMsg = wController.i18nBundle.getText("ERROR_CHECK");
   this.showPopUp(wController, errorMsg);
   return false;
  }

  var langKey = sap.ui.getCore().byId("SF-BP_Person-LanguageKey");
  var vCorrLangValues = wController.aCorrLangValues;
  if (langKey.getValue() !== "") {
   var langExists = false;
   langKey.setValue(langKey.getValue().toUpperCase());
   var sLangKey = langKey.getValue();

   for (var i = 0; i < vCorrLangValues.results.length; i++) {
    if (wController.vCurrentActionId === "createRB" && vCorrLangValues.results[i].KEY === sLangKey) {
     langExists = true;
     break;
    }

    if (wController.vCurrentActionId === "changeRB" && vCorrLangValues.results[i].KEY === sLangKey) {
     langExists = true;
     break;
    }
   }
   if (langExists === false) {
    var sFieldName = "";
    if (wController.sCategory === "2")
     sFieldName = wController.i18nBundle.getText("LANGUAGE");
    errorMsg = sFieldName + " " + sLangKey + " " + wController.i18nBundle.getText("NO_EXISTENCE");
    this.showPopUp(wController, errorMsg);
    return false;
   }
  }

  var errorName = jQuery('.sapMInputBaseErrorInner');
  if (errorName.length !== 0) {
   errorMsg = wController.i18nBundle.getText("ERROR_CHECK");
   this.showPopUp(wController, errorMsg);
   return false;
  }

  var createArray = wController.createdArray;
  var createdFlag;
  var wpFlag;
  if (wController.vCurrentActionId === "createRB") {
   createdFlag = false;
   wpFlag = true;
   for (var j = 0; j < createArray.length; j++) {
    if (createArray[j].field.indexOf("__TXT") !== -1) {
     continue;
    }

    if (createArray[j].value !== "" && createArray[j].value !== "None") {
     createdFlag = true;
     break;
    }
   }

   for (var k = 0; k < createArray.length; k++) {
    if (createArray[k].entity === "BP_ContactPersonWorkplacesRel" || createArray[k].entity.indexOf("BP_Workplace") !== -1) {
     wpFlag = false;
     if (createArray[k].key !== undefined && createArray[k].key !== "") {
      wpFlag = true;
      break;
     }
    }
   }
  }

  if (createdFlag === false || wpFlag === false) {
   errorMsg = wController.i18nBundle.getText("ERROR_CHECK");
   this.showPopUp(wController, errorMsg);
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
 }

};