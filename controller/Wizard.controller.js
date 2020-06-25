/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/m/MessageToast", 'sap/m/UploadCollectionParameter',
	"sap/m/MessageBox"
], function (C, H, M, d) {
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
	return C.extend("fcg.mdg.editbp.controller.Wizard", {
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
		onInit: function () {
			var c = sap.ui.core.Component.getOwnerIdFor(this.getView());
			var m = sap.ui.component(c);
			fcg.mdg.editbp.util.DataAccess.setCtrlInstance(this);
			if (m && m.getComponentData() && m.getComponentData().startupParameters) {
				if (m.getComponentData().startupParameters.USMD_CREQ_TYPE !== undefined) {
					this.crType = m.getComponentData().startupParameters.USMD_CREQ_TYPE[0];
				}
				if (m.getComponentData().startupParameters.MAXDUPREC !== undefined) {
					this.vMaxDupRec = m.getComponentData().startupParameters.MAXDUPREC[0];
				}
				if (m.getComponentData().startupParameters.CONF_MSG !== undefined) {
					this.showPopup = m.getComponentData().startupParameters.CONF_MSG[0];
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
		_initializeBusyDialog: function () {
			this._busyDialog = new sap.m.BusyDialog();
		},
		onSelectOtherOption: function (s) {
			this.stepName = s;
			var t = this;
			var m = t.i18nBundle.getText("CANCEL_EDIT");
			var a = new sap.m.Dialog({
				title: t.i18nBundle.getText("WARNING"),
				type: 'Message',
				state: 'Warning',
				content: [new sap.m.Text({
					text: m
				})],
				beginButton: new sap.m.Button({
					text: t.i18nBundle.getText("YES"),
					press: function () {
						t.resetFormData();
						t.clearAllData();
						t.oWizard.discardProgress(t.getView().byId(t.stepName));
						a.close();
					}
				}),
				endButton: new sap.m.Button({
					text: t.i18nBundle.getText("NO"),
					press: function () {
						switch (t.stepName) {
						case "entityStep":
							sap.ui.getCore().byId(t.vCurrentEntityTemp).setSelected(true);
							t.vCurrentEntity = t.vCurrentEntityTemp;
							break;
						case "actionStep":
							sap.ui.getCore().byId(t.vCurrentActionIdTemp).setSelected(true);
							t.vCurrentActionId = t.vCurrentActionIdTemp;
							break;
						case "selectEntityInstanceStep":
							sap.ui.getCore().byId(t.vCurrentSelectdDataIdTemp).setSelected(true);
							t.vCurrentSelectdDataId = t.vCurrentSelectdDataIdTemp;
							break;
						default:
						}
						a.close();
					}
				}),
				afterClose: function () {
					a.destroy();
				}
			});
			a.open();
		},
		onClickDuplicateMsg: function () {
			if (this.oDupDialog === "") {
				this.oDupDialog = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.DispDuplicate", this);
			}
			var l = new sap.ui.model.resource.ResourceModel({
				bundleUrl: jQuery.sap.getModulePath("fcg.mdg.editbp") + "/i18n/i18n.properties"
			});
			l.setDefaultBindingMode(sap.ui.model.BindingMode.OneTime);
			this.oDupDialog.setModel(l, "i18n");
			var j = new sap.ui.model.json.JSONModel();
			j.setData(this.oDuplicatesResult[0].data);
			if (this.oDuplicatesResult !== undefined) {
				if (this.oDuplicatesResult[0].data.results.length !== 0) {
					this.oDupDialog.setModel(j);
					sap.ui.getCore().byId("duplicatesDialog").open();
				}
			}
		},
		handleClose: function (e) {
			sap.ui.getCore().byId("duplicatesDialog").close();
		},
		_getRouter: function () {
			this.clearAllData();
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		clearAllData: function () {
			this.changedArray = [];
			this.createdArray = [];
			fcg.mdg.editbp.handlers.GeneralData.changedArray = [];
		},
		checkModel: function () {
			for (var i = 0; i < this.getView().byId("communicationLayout").getItems().length; i++) {
				this.oModelTemp[i] = (JSON.parse(JSON.stringify(this.getView().byId("communicationLayout").getItems()[i].getModel().getData())));
			}
		},
		setBackModel: function () {
			var m = new sap.ui.model.json.JSONModel();
			for (var i = 0; i < this.getView().byId("communicationLayout").getItems().length; i++) {
				m.setData(this.oModelTemp[i]);
				this.getView().byId("communicationLayout").getItems()[i].setModel(null);
				this.getView().byId("communicationLayout").getItems()[i].setModel(m);
			}
		},
		onRouteMatched: function (e) {
			if (this.oEntityFrag === "") {
				this.oEntityFrag = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntity', this);
			} else {
				this.oEntityFrag.destroy();
				this.oEntityFrag = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntity', this);
			}
			this.getView().byId("entityLayout").removeAllContent();
			this.getView().byId("entityLayout").setVisible(true);
			this.getView().byId("entityLayout").addContent(this.oEntityFrag);
			if (this.oRequestDisplayFragment !== "") {
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
			if (e.getParameter("name") !== "wizard") {
				return;
			}
			fcg.mdg.editbp.handlers.BankAccount.clearGlobalVariables();
			fcg.mdg.editbp.handlers.GeneralData.clearGlobalVariables(this);
			fcg.mdg.editbp.handlers.Communication.clearGlobalVariables(this);
			fcg.mdg.editbp.handlers.TaxNumbers.clearGlobalVariables(this);
			fcg.mdg.editbp.handlers.ContactPerson.clearGlobalVariables(this);
			fcg.mdg.editbp.handlers.Identification.clearGlobalVariables();
			if (this.extHookClearHandlerVariables() !== undefined) {
				this.extHookClearHandlerVariables(this);
			}
			this.sCategory = e.getParameters().arguments.cateogory;
			this.vCustomerID = e.getParameters().arguments.customerID;
			this.vTaxCat = e.getParameters().arguments.TAXTYPE;
			this.vRowId = e.getParameters().arguments.RowId;
			this.sItemPath = e.getParameters().arguments.selectedItem;
			this.sItemPath = this.sItemPath.split("(");
			this.sItemPath = this.sItemPath[1].split(")");
			this.sItemPath = this.sItemPath[0];
			this.setGeneralActionText(this.sCategory);
			var p = "SearchCollection?$filter=" + jQuery.sap.encodeURL("PARTNER eq '" + this.vCustomerID + "'");
			var r = "";
			var b = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
			var m = {};
			b.getHeaders(m);
			m.SEARCH_MODE = "DB";
			b.setHeaders(m);
			b.setUseBatch(true);
			var B = [];
			var o = b.createBatchOperation(p, "GET");
			B.push(o);
			b.clearBatch();
			b.addBatchReadOperations(B);
			B = [];
			b.submitBatch(function (h, i) {
				r = h.__batchResponses;
			}, null, false);
			b.clearBatch();
			var a = r[0].data.results[0].MCNAME1;
			var c = r[0].data.results[0].POST_COD1;
			var f = r[0].data.results[0].CITY1;
			var P = r[0].data.results[0].PARTNER;
			this.vPARTNERID = r[0].data.results[0].PARTNER;
			var g = this.i18nBundle.getText("customer_header_msg") + " " + ":" + " " + a + " " + c + " " + f + " " + "(" + P + ")";
			this.byId("customerHeader").setText(g);
			sap.ui.getCore().byId("idInvTextRBG").setText(g);
			this.customerHeaderMsg = g.split(":")[1];
		},
		resetFormData: function () {
			for (var i = 0; i < this.oOldValuePairModel.length; i++) {
				sap.ui.getCore().byId(this.oOldValuePairModel[i].ID).setValue(this.oOldValuePairModel[i].value);
			}
			this.oOldValuePairModel = [];
		},
		checkEntitySelected: function () {
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
			if (this.extHookCheckEntitySelected() !== undefined) {
				this.extHookCheckEntitySelected(this);
			}
		},
		checkActionSelected: function () {
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
				this.onSelectOtherOption("actionStep");
			}
			this.vCurrentActionId = sap.ui.getCore().byId("actionRBG").getSelectedButton().getId();
			if (this.vCurrentActionId === "") {
				this.oWizard.invalidateStep(this.getView().byId("actionStep"));
			} else {
				this.oWizard.validateStep(this.getView().byId("actionStep"));
			}
			if (this.extHookCheckActionSelected() !== undefined) {
				this.extHookCheckActionSelected(this);
			}
		},
		checkDataListSelected: function () {
			this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
			this.vCurrentSelectdDataIdTemp = this.vCurrentSelectdDataId;
			if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
				if (sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex() === -1) {
					if (this.vCurrentActionId === "deleteRB") {
						this.oWizard.invalidateStep(this.getView().byId("editStep"));
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
						this.oWizard.validateStep(this.getView().byId("selectEntityInstanceStep"));
					}
				}
			}
			if (this.changedArray.length === 0 && this.createdArray.length === 0 && fcg.mdg.editbp.handlers.GeneralData.changedArray.length ===
				0) {
				this.oWizard.discardProgress(this.getView().byId("selectEntityInstanceStep"));
			} else {
				this.onSelectOtherOption("selectEntityInstanceStep");
			}
			if (this.extHookCheckDataListSelected() !== undefined) {
				this.extHookCheckDataListSelected(this);
			}
		},
		checkEditValidated: function () {
			if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
				this.vDataLoss = this.i18nBundle.getText("SELECT_LOSS");
				if (sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex() === -1) {
					if (this.vCurrentActionId === "deleteRB") {
						this.oWizard.invalidateStep(this.getView().byId("editStep"));
						return;
					} else if (this.vCurrentActionId === "createRB") {
						this.oWizard.invalidateStep(this.getView().byId("editStep"));
						this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
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
						this.oWizard.validateStep(this.getView().byId("selectEntityInstanceStep"));
						this.oWizard.invalidateStep(this.getView().byId("editStep"));
					}
				}
			} else {
				this.oWizard.invalidateStep(this.getView().byId("editStep"));
			}
		},
		setRadioButtonText: function () {
			var i = ["createRB", "changeRB", "deleteRB"];
			var t = "",
				a = "",
				b = "";
			switch (this.vCurrentEntity) {
			case "communicationRB":
				t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("Addr_Comm");
				a = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("Addr_Comm");
				b = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("Addr_Comm");
				break;
			case "BankRB":
				t = this.i18nBundle.getText("create_new_bank");
				a = this.i18nBundle.getText("change_existing_bank");
				b = this.i18nBundle.getText("delete_existing_bank");
				break;
			case "ContactPerRB":
				t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("contact_person");
				a = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("contact_person");
				b = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("contact_person");
				break;
			case "identificationRB":
				t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("identification");
				a = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("identification");
				b = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("identification");
				break;
			case "taxRB":
				t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("tax_num");
				a = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("tax_num");
				b = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("tax_num");
				break;
			}
			sap.ui.getCore().byId("createRB").setText(t);
			sap.ui.getCore().byId("idInvTextCreateRBG").setText(t);
			sap.ui.getCore().byId("changeRB").setText(a);
			sap.ui.getCore().byId("idInvTextChangeRBG").setText(a);
			sap.ui.getCore().byId("deleteRB").setText(b);
			sap.ui.getCore().byId("idInvTextDeleteRBG").setText(b);
			if (this.extHookSetRadioButtonText() !== undefined) {
				this.extHookSetRadioButtonText(this);
			}
		},
		goToActionStep: function (e) {
			if (this.vCurrentEntity === "OrgRB") {
				this.vCurrentActionId = "";
				this.aEntity = this.i18nBundle.getText("select_OrgData");
				this.vDataLoss = this.i18nBundle.getText("DATA_LOSS", this.aEntity);
				this.getView().byId("entityStep").setNextStep(this.getView().byId("requestStep"));
				this.getView().byId("requestStep").setTitle(this.i18nBundle.getText("select_genOrg"));
				this.setActionView("requestStep", "select_genOrg");
				fcg.mdg.editbp.handlers.GeneralData.editGeneralData(this.sItemPath, this.sCategory, this.i18nBundle, this);
				return;
			} else if (this.vCurrentEntity === "PersRB") {
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
			if (this.extHookGoToActionStep() !== undefined) {
				this.extHookGoToActionStep(this);
			}
		},
		goToNextActionStep: function (e) {
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
			var t = "";
			if (this.vCurrentEntity === "communicationRB") {
				if (this.vCurrentActionId === "createRB") {
					t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("Addr_Comm");
					this.byId("communicationStep").setTitle(t);
				} else if (this.vCurrentActionId === "changeRB") {
					t = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("Addr_Comm");
					this.byId("communicationStep").setTitle(t);
					t = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("Addr_Comm");
					this.byId("selectEntityInstanceStep").setTitle(t);
				} else if (this.vCurrentActionId === "deleteRB") {
					t = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("Addr_Comm");
					this.byId("communicationStep").setTitle(t);
					this.byId("editStep").setTitle(t);
				}
			}
			if (this.vCurrentEntity === "BankRB") {
				if (this.vCurrentActionId === "createRB") {
					t = this.i18nBundle.getText("create_new_bank");
					this.byId("editStep").setTitle(t);
				} else if (this.vCurrentActionId === "changeRB") {
					t = this.i18nBundle.getText("change_existing_bank");
					this.byId("editStep").setTitle(t);
					t = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("bank_acc");
					this.byId("selectEntityInstanceStep").setTitle(t);
				} else if (this.vCurrentActionId === "deleteRB") {
					t = this.i18nBundle.getText("delete_existing_bank");
					this.byId("editStep").setTitle(t);
				}
			}
			if (this.vCurrentEntity === "identificationRB") {
				if (this.vCurrentActionId === "createRB") {
					t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("identification");
					this.byId("editStep").setTitle(t);
				} else if (this.vCurrentActionId === "changeRB") {
					t = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("identification");
					this.byId("editStep").setTitle(t);
					t = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("identification");
					this.byId("selectEntityInstanceStep").setTitle(t);
				} else if (this.vCurrentActionId === "deleteRB") {
					t = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("identification");
					this.byId("editStep").setTitle(t);
				}
			}
			if (this.vCurrentEntity === "ContactPerRB") {
				if (this.vCurrentActionId === "createRB") {
					t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("contact_person");
					this.byId("editStep").setTitle(t);
				} else if (this.vCurrentActionId === "changeRB") {
					t = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("contact_person");
					this.byId("editStep").setTitle(t);
					t = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("contact_person");
					this.byId("selectEntityInstanceStep").setTitle(t);
				} else if (this.vCurrentActionId === "deleteRB") {
					t = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("contact_person");
					this.byId("editStep").setTitle(t);
				}
			}
			if (this.vCurrentEntity === "OrgRB") {
				if (this.vCurrentActionId === "createRB") {
					t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("organization");
					this.byId("editStep").setTitle(t);
				} else if (this.vCurrentActionId === "changeRB") {
					t = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("organization");
					this.byId("editStep").setTitle(t);
					t = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("organization");
					this.byId("selectEntityInstanceStep").setTitle(t);
				} else if (this.vCurrentActionId === "deleteRB") {
					t = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("organization");
					this.byId("editStep").setTitle(t);
				}
			}
			if (this.vCurrentEntity === "taxRB") {
				if (this.vCurrentActionId === "createRB") {
					t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("tax_num");
					this.byId("editStep").setTitle(t);
				} else if (this.vCurrentActionId === "changeRB") {
					t = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("tax_num");
					this.byId("editStep").setTitle(t);
					t = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("tax_num");
					this.byId("selectEntityInstanceStep").setTitle(t);
				} else if (this.vCurrentActionId === "deleteRB") {
					t = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("tax_num");
					this.byId("editStep").setTitle(t);
				}
			}
			if (this.vCurrentEntity === "PersRB") {
				if (this.vCurrentActionId === "createRB") {
					t = this.i18nBundle.getText("create") + " " + this.i18nBundle.getText("PERSON");
					this.byId("editStep").setTitle(t);
				} else if (this.vCurrentActionId === "changeRB") {
					t = this.i18nBundle.getText("change") + " " + this.i18nBundle.getText("PERSON");
					this.byId("editStep").setTitle(t);
					t = this.i18nBundle.getText("select") + " " + this.i18nBundle.getText("PERSON");
					this.byId("selectEntityInstanceStep").setTitle(t);
				} else if (this.vCurrentActionId === "deleteRB") {
					t = this.i18nBundle.getText("delete") + " " + this.i18nBundle.getText("PERSON");
					this.byId("editStep").setTitle(t);
				}
			}
			if (this.extHookGoToNextActionStep() !== undefined) {
				this.extHookGoToNextActionStep(this);
			}
		},
		goToSelectDataStep: function (e) {
			var l = this.vCurrentSelectdDataId.length,
				i = this.vCurrentSelectdDataId.substring(l - 1, l),
				r = "";
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
				r = fcg.mdg.editbp.handlers.Identification.getIdentificationResults();
				fcg.mdg.editbp.handlers.Identification.deleteIdentification();
			}
			if (this.extHookGoToSelectDataStep() !== undefined) {
				this.extHookGoToSelectDataStep(this);
			}
		},
		pressBack: function (e) {
			var t = this;
			var h, p;
			h = H.getInstance();
			p = h.getPreviousHash();
			var m = this.vDataLoss;
			var a = new sap.m.Dialog({
				title: t.i18nBundle.getText("WARNING"),
				type: 'Message',
				state: 'Warning',
				content: [new sap.m.Text({
					text: m
				})],
				beginButton: new sap.m.Button({
					text: t.i18nBundle.getText("YES"),
					press: function () {
						t.submitButtonState();
						var l = t.checkReviewPageLayoutVisible();
						if (l) {
							t.vCancelFlag = true;
							t.resetFormData();
							t._oNavContainer = t.getView().byId("wizardNavContainer");
							var r = t._oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent();
							var b = r[0].getContent()[1].getContent()[0];
							t.attachDataModel.setData(JSON.parse(JSON.stringify(b.getModel().getData())));
							if (t.oRequestReason !== "") {
								var o = r[0].getContent()[0].getContent()[1].getText();
								t.oRequestReason.setValue(o);
							}
							t.getView().byId("wizardId").fireEvent("complete");
						} else {
							t.returnToSearchPage();
						}
						a.close();
					}
				}),
				endButton: new sap.m.Button({
					text: t.i18nBundle.getText("NO"),
					press: function () {
						a.close();
					}
				}),
				afterClose: function () {
					a.destroy();
				}
			});
			a.open();
		},
		onCancel: function (e) {
			var t = this;
			var l = false;
			var m = this.vDataLoss;
			var h, p;
			h = H.getInstance();
			p = h.getPreviousHash();
			var i = e.getSource().getId().split("--");
			i = i[i.length - 1];
			if (i === "wizardCancel") {
				l = this.checkReviewPageLayoutVisible();
				if (!l) {
					m = t.i18nBundle.getText("NO_SELECT_LOSS");
				}
			}
			if (i === "reviewCancel") {
				if (!t.getView().byId("idSubmit").getEnabled()) m = t.i18nBundle.getText("NO_SELECT_LOSS");
				else m = t.i18nBundle.getText("CANCEL_EDIT");
			}
			var a = new sap.m.Dialog({
				title: t.i18nBundle.getText("WARNING"),
				type: 'Message',
				state: 'Warning',
				content: [new sap.m.Text({
					text: m
				})],
				beginButton: new sap.m.Button({
					text: t.i18nBundle.getText("YES"),
					press: function () {
						if (l) {
							t.vCancelFlag = true;
							t.clearAllData();
							t.getView().byId("wizardId").fireEvent("complete");
						} else {
							t.returnToSearchPage();
						}
						a.close();
					}
				}),
				endButton: new sap.m.Button({
					text: t.i18nBundle.getText("NO"),
					press: function () {
						a.close();
					}
				}),
				afterClose: function () {
					a.destroy();
				}
			});
			a.open();
		},
		checkReviewPageLayoutVisible: function () {
			var r = 0;
			r = this._oNavContainer.getPages()[1].getContent().length;
			for (var i = 0; i < r; i++) {
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
		returnToSearchPage: function () {
			var r = 0;
			r = this._oNavContainer.getPages()[1].getContent().length;
			for (var i = 0; i < r; i++) {
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
			if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) sap.ui.getCore().byId("selectDataListRBG").setSelectedIndex(-1);
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
		setActionView: function (e, t) {
			var T = this;
			var a = this.getView().byId(e);
			a.addEventDelegate({
				onAfterRendering: function () {
					var i = this.$().find('.sapMWizardStepTitle');
					i[0].innerHTML = T.i18nBundle.getText(t);
				}
			}, a);
		},
		onBankCountryChange: function (e) {
			var b = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
			var B = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY__TXT");
			if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
				this.onChange(e);
			} else {
				if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue() === "") {
					b.setValueState("Error");
					b.setValueStateText(this.i18nBundle.getText("BlnkCountryMSG"));
					B.setValue();
					sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").setValue();
				} else {
					sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").setValue(sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue()
						.toUpperCase());
					var c = b.getValue();
					this.onChange(e);
					var a = c.replace(/^[ ]+|[ ]+$/g, '');
					var o = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
					if (o.results.length > 0) {
						var t = o.results.length - 1;
						for (var i = 0; i < o.results.length; i++) {
							if (o.results[i].KEY === c) {
								b.setValueState("None");
								b.setValueStateText("");
								B.setValue(o.results[i].TEXT);
								B.fireEvent("change");
								if (b.getValueState() === "None" && sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").getValueState() === "None") {
									sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").setValueState("None");
								}
								this._fetchBankName();
								if (fcg.mdg.editbp.handlers.BankAccount.ibanFlag !== "X") {
									fcg.mdg.editbp.handlers.BankAccount._deriveIban(b, e, this);
								}
								return;
							} else if (i === t && o.results[i].KEY !== c) {
								b.setValueState("Error");
								b.setValueStateText(this.i18nBundle.getText("CountryMSG", c));
								B.setValue();
							}
						}
					}
				}
			}
		},
		onBankKeyChange: function (e, a) {
			if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
				this.onChange(e);
			} else {
				var c = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
				var b = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue();
				var B = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
				var o = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
				var f = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY").getValue();
				var i = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN");
				if (f.replace(/^[ ]+|[ ]+$/g, '') === "") {
					o.setValue();
					B.setValue();
					i.setValue();
					i.setValueState("None");
					B.setValueState("None");
					if (c.getValue() === "") {
						c.setValueState("None");
					}
					if (c.getValueState() === "None" && B.getValueState() === "None") {
						sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").setValueState("None");
					}
					return;
				}
				if (b.replace(/^[ ]+|[ ]+$/g, '') === "" || c.getValueState() === "Error") {
					o.setValue();
					B.setValueState("Error");
					if (c.getValueState() === "Error" && c.getValue() !== "") {
						B.setValueStateText(c.getValueStateText());
					} else {
						B.setValueStateText(this.getView().getModel("i18n").getProperty("BANK_COUNTRY_CHECK"));
						c.setValueState("Error");
						c.setValueStateText(this.getView().getModel("i18n").getProperty("BlnkCountryMSG"));
					}
				} else {
					this._fetchBankName(e, a);
				}
			}
		},
		_fetchBankName: function (e, a) {
			var c = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
			var b = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue();
			var B = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
			var o = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
			var f = B.getValue();
			var g = f.replace(/^[ ]+|[ ]+$/g, '');
			var i = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN");
			var h = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT");
			var b = c.getValue();
			var G = this;
			if (g !== "") {
				var q = "/ValueHelpCollection?$filter=" + jQuery.sap.encodeURL(
					"ENTITY eq 'BP_BankAccount' and ATTR_NAME eq 'BANK_KEY' and FILTER eq " + "'COUNTRY=" + b + "'" + "and ATTR_VALUE eq'" + f + "'"
				);
				a = a === undefined ? true : a;
				var m = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
				m.read(q, null, null, a, function (j, E) {
					if (B.getValue() !== "") {
						fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "X";
						h.setValueState("None");
						h.setValueStateText("");
						B.fireEvent("change");
						fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "";
						var s = j.results[0].TEXT;
						B.setValueState("None");
						B.setValueStateText("");
						o.setValue(s);
						o.fireEvent("change");
						if (c.getValueState() === "None" && B.getValueState() === "None") {
							h.setValueState("None");
						}
						if (fcg.mdg.editbp.handlers.BankAccount.ibanFlag !== "X") {
							fcg.mdg.editbp.handlers.BankAccount._deriveIban(B, e, G);
						} else {
							fcg.mdg.editbp.handlers.BankAccount.ibanFlag = "";
						}
					}
				}, function (E) {
					o.setValue();
					B.setValueState("Error");
					var j = JSON.parse(E.response.body);
					var k = j.error.message.value;
					B.setValueStateText(k);
					i.setValueState("None");
					i.setValue();
					h.setValueState("None");
				});
			} else {
				B.setValue();
				B.setValueState("None");
			}
		},
		onIBANChange: function (e) {
			if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
				this.onChange(e);
			} else {
				var i = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").getValue();
				sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").setValueState("None");
				if (i.replace(/^[ ]+|[ ]+$/g, '') !== "") {
					this._deriveBankDetails(i);
				} else {
					sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").setValue();
					this.onChange(e);
				}
			}
		},
		_deriveBankDetails: function (i) {
			var g = this;
			var q = "/BP_BankAccountCollection?$filter=" + jQuery.sap.encodeURL("IBAN eq '" + i + "'");
			var I = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN");
			var b = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY");
			var B = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_KEY");
			var o = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT");
			var a = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_NAME");
			var c = sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY__TXT");
			var m = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
			m.read(q, null, null, true, function (e, E) {
				if (e.results.length > 0) {
					fcg.mdg.editbp.handlers.BankAccount.ibanFlag = "X";
					b.setValue(e.results[0].BANK_CTRY);
					b.fireEvent("change");
					B.setValue(e.results[0].BANK_KEY);
					B.fireEvent("change");
					o.setValue(e.results[0].BANK_ACCT);
					fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "X";
					o.fireEvent("change");
					I.fireEvent("change");
					b.setValueState("None");
					B.setValueState("None");
					o.setValueState("None");
					fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag = "";
				}
			}, function (e) {
				if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_IBAN").getValue() !== "") {
					I.setValueState("Error");
					var f = JSON.parse(e.response.body);
					var h = f.error.message.value;
					I.setValueStateText(h);
				}
			});
		},
		taxNumberChange: function (e) {
			if (this.vCurrentEntity === "taxRB") {
				if (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB") {
					var t = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
					var T = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
					var a = t.getValue();
					var b = a.length;
					var c = T.getValue();
					var f = c.length;
					if (f === 0) {
						t.setValueState("Error");
						t.setValueStateText(this.i18nBundle.getText("TAX_CAT_CHECK"));
					}
					if (b === 0 && f !== 0 || b === 0 && f === 0 || b !== 0 && f !== 0) {
						t.setValueState("None");
					}
				}
			}
		},
		onChange: function (e) {
			var o = {};
			var m = "";
			if (this.vCurrentEntity === "taxRB") {
				if (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB") {
					var t = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
					var T = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
					var a = t.getValue();
					var b = a.length;
					var c = T.getValue();
					var f = c.length;
					var g = t.getValueState();
					var h = T.getValueState();
					if (c !== "" && a.trim() !== "" && g !== "Error" && h !== "Error") {
						this.oWizard.validateStep(this.getView().byId("editStep"));
					} else {
						this.oWizard.invalidateStep(this.getView().byId("editStep"));
					}
				}
			}
			if (this.vCurrentEntity !== "taxRB" && this.vCurrentEntity !== "BankRB" && this.getView().byId("editStep").getValidated() === false) {
				this.getView().byId("wizardId").validateStep(this.getView().byId("editStep"));
			}
			var n = new Object();
			n = {};
			if (e.getSource()._sPickerType !== undefined) {
				n.key = e.getSource().getSelectedItem().getKey();
				n.value = e.getSource().getSelectedItem().getText();
				n.entity = e.getSource().sId.split("-")[1];
			} else {
				var l = e.getSource().getId();
				o.ID = l;
				if (document.getElementById(l + "-inner") !== null) {
					o.value = document.getElementById(l + "-inner").getAttribute("value");
				} else {
					o.value = "";
				}
				this.oOldValuePairModel.push(o);
				n.value = e.getSource().getValue().trim();
				n.entity = e.getSource().sId.split("-")[1];
			}
			m = n.entity;
			switch (n.entity) {
			case 'BP_Address':
				var p = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
				if (p.getValueState() === "None" && p.getValue() !== "") {
					this.oWizard.validateStep(this.getView().byId("communicationStep"));
				} else {
					p.setValueState("Error");
					p.setValueStateText(this.i18nBundle.getText("BlnkCountryMSG"));
					this.oWizard.invalidateStep(this.getView().byId("communicationStep"));
				}
				this.selectedIndex = fcg.mdg.editbp.handlers.Communication.selectedIndex;
				var B = e.getSource().mBindingInfos;
				if (B !== undefined && jQuery.isEmptyObject(B) === false) {
					n.field = B.value.parts[0].path.slice(1);
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
				var q = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
				var p = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
				var r = 0;
				if (p.getValueState() === "None" && p.getValue() !== "") {
					this.oWizard.validateStep(this.getView().byId("communicationStep"));
				}
				fcg.mdg.editbp.handlers.Communication.handleCommIconEnableDisable(n.entity, e.getSource().getId());
				n.field = e.getSource().mBindingInfos.value.parts[0].path.slice(1);
				if (this.vCurrentActionId === "changeRB") {
					this.selectedIndex = fcg.mdg.editbp.handlers.Communication.selectedIndex;
					if (q.BP_AddressesRel.results.length === 0) {
						r = 0;
					} else {
						switch (n.entity) {
						case 'BP_CommPhone':
							r = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numPhn;
							break;
						case 'BP_CommMobile':
							r = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numMob;
							break;
						case 'BP_CommFax':
							r = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numFax;
							break;
						case 'BP_CommURI':
							r = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numURI;
							break;
						case 'BP_CommEMail':
							for (var i = 0; i < fcg.mdg.editbp.handlers.Communication.aErrorStateFlag.length; i++) {
								if (fcg.mdg.editbp.handlers.Communication.aErrorStateFlag[i].split(":")[0] === e.getSource().getId()) {
									fcg.mdg.editbp.handlers.Communication.aErrorStateFlag.splice(i, 1);
									i = i - 1;
								}
							}
							r = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numEmail;
							break;
						}
					}
				}
				if (e.getSource().getId().split('-')[3] >= r) {
					n.action = "N";
				}
				if (this.vCurrentActionId === "createRB") {
					n.currentEntityKey = e.getSource().getId().split('-')[3];
				} else if (n.action === 'N' || n.action === 'D') {
					var q = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
					this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + q.BP_AddressesRel.results[parseInt(this.selectedIndex)].AD_ID +
						"\')";
					n.createdIndex = e.getSource().getId().split('-')[3];
					break;
				} else {
					n.currentIndex = e.getSource().getId().split('-')[3];
				}
				if (this.vCurrentActionId === "changeRB") {
					this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + q.BP_AddressesRel.results[parseInt(this.selectedIndex)].AD_ID +
						"\',COMM_TYPE=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(q, "BP_AddressesRel/results/" + this.selectedIndex + "/" + n.entity +
							"Rel/results/" + e.getSource().getId().split('-')[3] + "/COMM_TYPE") + "\',CONSNUMBER=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(
							q, "BP_AddressesRel/results/" + this.selectedIndex + "/" + n.entity + "Rel/results/" + e.getSource().getId().split('-')[3] +
							"/CONSNUMBER") + "\')";
				}
				break;
			case 'BP_AddressVersionsPers':
			case 'BP_AddressVersionsOrg':
			case 'BP_AddressPersonVersion':
				var r;
				var s;
				var q = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
				var p = sap.ui.getCore().byId("INP-BP_Address-COUNTRY");
				if (p.getValueState() === "None" && p.getValue() !== "") {
					this.oWizard.validateStep(this.getView().byId("communicationStep"));
				}
				this.selectedIndex = fcg.mdg.editbp.handlers.Communication.selectedIndex;
				if (e.getSource().mBindingInfos.value !== undefined) {
					n.field = e.getSource().mBindingInfos.value.parts[0].path.slice(1);
					if (n.entity === "BP_AddressPersonVersion") {
						n.field = n.field.split("/")[1];
					}
				} else {
					if (e.getSource().getModel().getData().results[0].ATTR_NAME === "TITLE_KEY") {
						if (this.sCategory === "1") {
							e.getSource().getModel().getData().results[0].ATTR_NAME = "TITLE_P";
						} else {
							e.getSource().getModel().getData().results[0].ATTR_NAME = "TITLE";
						}
					}
					n.field = e.getSource().getModel().getData().results[0].ATTR_NAME
				}
				if (q.BP_AddressesRel.results.length === 0) {
					r = 0;
				} else {
					r = fcg.mdg.editbp.handlers.Communication.oCountDeepEntities[parseInt(this.selectedIndex, 10)].numIAV;
				}
				if (e.getSource().getId().split('-')[3] >= r) {
					n.action = "N";
				}
				if (this.vCurrentActionId === "createRB") {
					n.currentEntityKey = e.getSource().getId().split('-')[3];
				} else if (n.action === 'N' || n.action === 'D') {
					var q = fcg.mdg.editbp.util.DataAccess.getCurrentModel();
					this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + q.BP_AddressesRel.results[parseInt(this.selectedIndex)].AD_ID +
						"\')";
					n.createdIndex = e.getSource().getId().split('-')[3];
					break;
				}
				if (this.vCurrentActionId === "changeRB" && n.action != "N") {
					if (n.entity === "BP_AddressPersonVersion") {
						s = n.entity;
						n.entity = "BP_AddressVersionsPers";
					}
					this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + q.BP_AddressesRel.results[parseInt(this.selectedIndex)].AD_ID +
						"\',ADDR_VERS=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(q, "BP_AddressesRel/results/" + this.selectedIndex + "/" + n.entity +
							"Rel/results/" + e.getSource().getId().split('-')[3] + "/ADDR_VERS") + "\')";
					n.createdIndex = e.getSource().getId().split('-')[3];
					if (s === "BP_AddressPersonVersion") {
						n.entity = s;
						s === "";
					}
				}
				break;
			case 'BP_Root':
			case 'BP_Organization':
			case 'BP_Person':
				this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ")";
				if (this.vCurrentEntity === "PersRB" || this.vCurrentEntity === "OrgRB") {
					fcg.mdg.editbp.handlers.GeneralData.setChangedArray(e, n, n.entity, this);
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
					if (e.getParameters().selectedItem !== undefined || e.getSource()._sPickerType !== undefined) {
						n.field = e.getSource().getModel().getData().results[0].ATTR_NAME;
					} else {
						n.field = e.getSource().mBindingInfos.value.parts[0].path.slice(1);
					}
				}
				break;
			case 'BP_TaxNumber':
				if (e.getParameters().selectedItem !== undefined || e.getSource()._sPickerType !== undefined) {
					n.field = e.getSource().getModel().getData().results[0].ATTR_NAME;
				} else {
					n.field = e.getSource().mBindingInfos.value.parts[0].path.slice(1);
				}
				if (n.field === "TAXNUMBER") {
					var v = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
					var b = a.length;
					if (b > 20) {
						n.field = "TAXNUMXL";
					}
				}
				var u = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
				this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",TAXTYPE=" + "'" + u + "'" + ")";
				break;
			case 'BP_BankAccounts':
				if (sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_CTRY").getValue() !== "" && sap.ui.getCore().byId(
						"SF-BP_BankAccounts-Txt_BANK_KEY").getValue() !== "" && sap.ui.getCore().byId("SF-BP_BankAccounts-Txt_BANK_ACCT").getValue() !==
					"") {
					this.getView().byId("wizardId").validateStep(this.getView().byId("editStep"));
				} else {
					this.getView().byId("wizardId").invalidateStep(this.getView().byId("editStep"));
				}
				n.field = e.getSource().mBindingInfos.value.binding.sPath.slice(1);
				if (this.vCurrentActionId === "changeRB") {
					var w = fcg.mdg.editbp.handlers.BankAccount.oBankRslts.BP_BankAccountsRel.results[fcg.mdg.editbp.handlers.BankAccount.vSelectedIndex]
						.BANKDETAILID;
					this.currentEntityKey = "(BP_GUID=" + this.sItemPath + ",BANKDETAILID=\'" + w + "\'" + ")";
				}
				m = "BP_BankAccount";
				break;
			case 'BP_IdentificationNumbersRel':
				if (e.getParameters().newValue !== undefined) {
					n.field = "IDENTIFICATIONNUMBER";
				}
				if (e.getParameters().selectedItem !== undefined) {
					n.field = "IDENTIFICATIONTYPE";
				}
				m = "BP_IdentificationNumber";
				break;
			case 'BP_RelationPARTNER':
			case 'BP_RelationPartner':
				if (e.getParameters().selectedItem !== undefined || e.getSource()._sPickerType !== undefined) {
					n.field = "TITLE_KEY";
				}
				break;
			case 'BP_ContactPersonWorkplacesRel':
				var F;
				var x;
				var y = e.getSource().getParent().getParent().getParent().getParent();
				if (e.getSource().mBindingInfos.value !== undefined) {
					n.field = e.getSource().mBindingInfos.value.parts[0].path.slice(1);
				} else if (e.getSource().getSelectedItem() !== undefined) {
					n.field = "ADDRESS_NUMBER";
				}
				n.wpKey = y.getId().split('-')[1];
				if (this.vCurrentActionId === "changeRB") {
					var z = 0;
					var A = 0;
					for (var i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length; i++) {
						if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[i].action !== undefined && fcg.mdg.editbp.handlers.ContactPersonChange
							.oWPResults[i].action === "D") {
							A = A + 1;
						}
					}
					z = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length - A;
					if (e.getSource().getId().split('-')[3] >= z) {
						n.action = "N";
					}
					if (n.action === 'N') {
						var S;
						if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
							S = 0;
						} else {
							if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
								S = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
							}
						}
						n.cpIndex = S;
						if (this.vTimedependency == "X") {
							F = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[S].BP_RelationContactPersonRel.VALIDUNTILDATE;
							F = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(F);
							n.createdIndex = e.getSource().getId().split('-')[3];
							n.currentkey = "BP_ContactPersonCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPerson.oRelResults
								.BP_RelationsRel.results[S].BP_RelationContactPersonRel.PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPerson.oRelResults
								.BP_RelationsRel.results[S].BP_RelationContactPersonRel.PARTNER2 + "\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPerson
								.oRelResults.BP_RelationsRel.results[S].BP_RelationContactPersonRel.RELATIONSHIPCATEGORY + "\',VALIDUNTILDATE=datetime\'" +
								escape(F) + "\')";
						} else {
							n.createdIndex = e.getSource().getId().split('-')[3];
							n.currentkey = "BP_ContactPersonCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPerson.oRelResults
								.BP_RelationsRel.results[S].BP_RelationContactPersonRel.PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPerson.oRelResults
								.BP_RelationsRel.results[S].BP_RelationContactPersonRel.PARTNER2 + "\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPerson
								.oRelResults.BP_RelationsRel.results[S].BP_RelationContactPersonRel.RELATIONSHIPCATEGORY + "\')";
						}
					} else {
						var D = "INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + n.wpKey;
						var E = sap.ui.getCore().byId(D).getSelectedKey();
						for (var i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length; i++) {
							if (fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[i].ADDRESS_NUMBER === E) {
								x = i;
								break;
							}
						}
						n.addrIndex = x;
						if (this.vTimedependency == "X") {
							F = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].VALIDUNTILDATE;
							F = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(F);
							n.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
								.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
								"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
								"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
								"\',VALIDUNTILDATE=datetime\'" + escape(F) + "\')";
						} else {
							n.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
								.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
								"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
								"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER + "\')";
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
				var G, x, F, I, J = "";
				var y = e.getSource().getParent().getParent().getParent().getParent();
				n.currentEntityKey = e.getSource().getId().split('-')[3];
				var W = e.getSource().getId().split('-')[4];
				var K = e.getSource().getId().split('-')[3];
				var D = "INP-BP_ContactPersonWorkplacesRel-Addr_Num-" + W;
				var E = sap.ui.getCore().byId(D).getSelectedKey();
				if (this.isAddressVisited === "X" && this.vCurrentActionId === "createRB") {
					J = fcg.mdg.editbp.handlers.ContactPerson.oController.oDetailComm.BP_AddressesRel.results;
				} else if (this.vCurrentActionId === "createRB") {
					J = fcg.mdg.editbp.handlers.ContactPerson.oBPAddrResults.BP_AddressesRel.results;
				} else {
					J = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults;
				}
				if (this.vCurrentActionId === "createRB") {
					for (var j = 0; j < J.length; j++) {
						if (J[j].AD_ID === E) {
							x = j;
							break;
						}
					}
				} else {
					for (var j = 0; j < J.length; j++) {
						if (J[j].ADDRESS_NUMBER === E) {
							x = j;
							break;
						}
					}
				}
				if (x === undefined) {
					var L = fcg.mdg.editbp.handlers.Communication.oCreateModel;
					for (var k = 0; k < L.length; k++) {
						if (L[k].body.AD_ID === E) {
							x = J.length + k;
							break;
						}
					}
				}
				n.addrIndex = x;
				if (n.entity === "BP_WorkplaceIntPersVersionRel" || n.entity === "BP_WorkplaceIntAddressVersRel") {
					G = y.getParent().getParent().getParent().getParent().getParent().getId();
					G = G.split("-")[1];
					n.wpKey = G;
				} else {
					n.wpKey = y.getId().split('-')[1];
				}
				if (n.entity === "BP_WorkplaceIntPersVersionRel" && e.getParameters().selectedItem !== undefined) {
					n.field = "TITLE_P";
				} else if (n.entity === "BP_WorkplaceIntAddressVersRel" && e.getSource()._sPickerType !== undefined) {
					n.field = "ADDR_VERS";
				} else {
					n.field = this.getFieldValue(e);
				}
				if ((e.getSource().getId().split('-')[4] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults.length) && this.vCurrentActionId ===
					"changeRB") {
					I = "N";
					n.action = "N";
					n.addrIndex = n.wpKey;
					var S;
					if (fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results.length === 1) {
						S = 0;
					} else {
						if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
							S = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
						}
					}
					n.cpIndex = S;
				}
				if (this.vCurrentActionId === "changeRB" && I !== "N") {
					switch (n.entity) {
					case 'BP_WorkplaceCommPhonesRel':
						if (e.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[x].BP_WorkplaceCommPhonesRel.results
							.length) {
							n.action = "N";
						}
						break;
					case 'BP_WorkplaceCommMobilesRel':
						if (e.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[x].BP_WorkplaceCommMobilesRel.results
							.length) {
							n.action = "N";
						}
						break;
					case 'BP_WorkplaceCommFaxesRel':
						if (e.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[x].BP_WorkplaceCommFaxesRel.results
							.length) {
							n.action = "N";
						}
						break;
					case 'BP_WorkplaceCommEMailsRel':
						if (e.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[x].BP_WorkplaceCommEMailsRel.results
							.length) {
							n.action = "N";
						}
						break;
					case 'BP_WorkplaceIntAddressVersRel':
					case 'BP_WorkplaceIntPersVersionRel':
						if (e.getSource().getId().split('-')[3] >= fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[x].BP_WorkplaceIntAddressVersRel
							.results.length) {
							n.action = "N";
						}
						break;
					}
					F = fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].VALIDUNTILDATE;
					F = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(F);
					if (n.entity === 'BP_WorkplaceCommPhonesRel' || n.entity === 'BP_WorkplaceCommMobilesRel' || n.entity ===
						'BP_WorkplaceCommFaxesRel' || n.entity === 'BP_WorkplaceCommEMailsRel') {
						if (n.action === 'N' || n.action === 'D') {
							n.createdIndex = e.getSource().getId().split('-')[3];
							if (this.vTimedependency == "X") {
								n.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
									.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
									"\',VALIDUNTILDATE=datetime\'" + escape(F) + "\')";
							} else {
								n.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
									.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER + "\')";
							}
						} else {
							var Q;
							if (n.entity === 'BP_WorkplaceCommFaxesRel') {
								Q = n.entity.substring(0, n.entity.length - 5) + "Collection";
							} else {
								Q = n.entity.substring(0, n.entity.length - 4) + "Collection";
							}
							if (this.vTimedependency == "X") {
								n.currentkey = Q + "(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
										parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
									"\',COMM_TYPE=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
										parseInt(x)], n.entity + "/results/" + K + "/COMM_TYPE") + "\',CONSNUMBER=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(
										fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)], n.entity + "/results/" + K + "/CONSNUMBER") +
									"\',VALIDUNTILDATE=datetime\'" + escape(F) + "\')";
							} else {
								n.currentkey = Q + "(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
										parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
									"\',COMM_TYPE=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
										parseInt(x)], n.entity + "/results/" + K + "/COMM_TYPE") + "\',CONSNUMBER=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(
										fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)], n.entity + "/results/" + K + "/CONSNUMBER") + "\')";
							}
						}
					} else if (n.entity === 'BP_WorkplaceIntAddressVersRel') {
						if (n.action === 'N' || n.action === 'D') {
							n.createdIndex = e.getSource().getId().split('-')[3];
							if (this.vTimedependency == "X") {
								n.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
									.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
									"\',VALIDUNTILDATE=datetime\'" + escape(F) + "\')";
							} else {
								n.currentkey = "BP_WorkplaceAddressCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
									.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER + "\')";
							}
						} else {
							if (this.vTimedependency == "X") {
								n.currentkey = "BP_WorkplaceIntAddressVersCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
									.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
									"\',ADDR_VERS=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
										parseInt(x)], n.entity + "/results/" + K + "/ADDR_VERS") + "\',VALIDUNTILDATE=datetime\'" + escape(F) + "\')";
							} else {
								n.currentkey = "BP_WorkplaceIntAddressVersCollection(BP_GUID=" + this.sItemPath + ",PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange
									.oWPResults[parseInt(x)].PARTNER1 + "\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
									"\',ADDR_VERS=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
										parseInt(x)], n.entity + "/results/" + K + "/ADDR_VERS") + "\')";
							}
						}
					} else if (n.entity === 'BP_WorkplaceIntPersVersionRel') {
						var P = {};
						var N;
						if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
							var O = fcg.mdg.editbp.handlers.ContactPerson.oController.vCurrentSelectdDataId.length;
							N = fcg.mdg.editbp.handlers.ContactPerson.oController.vCurrentSelectdDataId.substring(O - 1, O);
						} else {
							N = 0;
						}
						var R = fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[N].BP_GUID2;
						R = R.replace(/-/g, '');
						for (i = 0; i < fcg.mdg.editbp.handlers.ContactPersonChange.ocpAddressRslts.length; i++) {
							if (fcg.mdg.editbp.handlers.ContactPersonChange.ocpAddressRslts[i].PARTNER === fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
									parseInt(x)].PARTNER2) {
								P = fcg.mdg.editbp.handlers.ContactPersonChange.ocpAddressRslts[i];
								break;
							}
						}
						if (n.action === 'N') {
							n.createdIndex = e.getSource().getId().split('-')[3];
							if (this.vTimedependency == "X") {
								n.currentkey = "(BP_GUID=binary'" + R + "',PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER1 +
									"\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER +
									"\',VALIDUNTILDATE=datetime\'" + escape(F) + "\')";
							} else {
								n.currentkey = "(BP_GUID=binary'" + R + "',PARTNER1=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER1 +
									"\',PARTNER2=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].PARTNER2 +
									"\',RELATIONSHIPCATEGORY=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].RELATIONSHIPCATEGORY +
									"\',ADDRESS_NUMBER=\'" + fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[parseInt(x)].ADDRESS_NUMBER + "\')";
							}
						} else {
							n.currentkey = "BP_PersonVersionCollection(BP_GUID=binary'" + R + "',AD_ID=\'" + P.BP_AddressesRel.results[0].AD_ID +
								"\',ADDR_VERS=\'" + fcg.mdg.editbp.util.DataAccess.getDataFromPath(fcg.mdg.editbp.handlers.ContactPersonChange.oWPResults[
									parseInt(x)], "BP_WorkplaceIntAddressVersRel/results/" + K + "/ADDR_VERS") + "\')";
						}
					}
				}
				break;
			}
			var U = fcg.mdg.editbp.util.DataAccess.aMatchProMandt;
			var V = 0;
			var X = {};
			for (var i = 0; i < U.length; i++) {
				if (U[i].entity === m && U[i].attr === n.field) {
					X.entity = m;
					X.attribute = n.field;
					X.value = n.value;
					if (this.vCurrentActionId === "createRB") {
						X.createdIndex = this.getNewRecordIndex(n.entity);
					}
					if (this.vCurrentActionId === "changeRB" || m === "BP_Organization" || m === "BP_Person") {
						X.entityKey = this.currentEntityKey.substr(1).slice(0, -1).split("=").join("-").split("\'").join("").replace("binary", "");
					}
					for (var j = 0; j < this.oDupCheckData.length; j++) {
						if (X.entity === this.oDupCheckData[j].entity && X.attribute === this.oDupCheckData[j].attribute) {
							if ((this.vCurrentActionId === "changeRB" && X.entityKey === this.oDupCheckData[j].entityKey) || (this.vCurrentActionId ===
									"createRB" && X.createdIndex === this.oDupCheckData[j].createdIndex)) {
								this.oDupCheckData[j].value = X.value;
								V = 1;
								X = {};
								break;
							}
						}
					}
					if (V === 0) {
						this.oDupCheckData.push(X);
					} else {
						V === 0;
					}
					X = {};
				}
			}
			if (this.vCurrentActionId === "createRB") {
				for (var j = 0; j < this.createdArray.length; j++) {
					if (this.createdArray[j].field == n.field && this.createdArray[j].entity == n.entity && this.createdArray[j].currentEntityKey ==
						n.currentEntityKey && this.createdArray[j].wpKey == n.wpKey) {
						if (e.getSource()._sPickerType !== undefined) {
							this.createdArray[j].key = n.key;
							this.createdArray[j].value = n.value;
						} else {
							this.createdArray[j].value = n.value;
						}
						return;
					}
				}
				this.createdArray.push(n);
			} else if (this.vCurrentActionId === "changeRB") {
				if (this.vCurrentEntity === "communicationRB") {
					n.entityKey = this.currentEntityKey;
				}
				for (var i = 0; i < this.changedArray.length; i++) {
					if (this.changedArray[i].field == n.field && this.changedArray[i].entity == n.entity && this.changedArray[i].createdIndex == n.createdIndex &&
						n.createdIndex !== undefined) {
						if (e.getParameters().selectedItem !== undefined) {
							this.changedArray[i].key = n.key;
							this.changedArray[i].value = n.value;
						} else {
							this.changedArray[i].value = n.value;
						}
						return;
					}
				}
				this.changedArray.push(n);
			}
			if (this.extWizardOnChange() !== undefined) {
				this.extWizardOnChange(this, e, U);
			}
		},
		onBankAccountChange: function (c) {
			if (fcg.mdg.editbp.handlers.BankAccount.valueHelpFlag === "X") {
				this.onChange(c);
			} else {
				var g = this;
				g.onChange(c);
				fcg.mdg.editbp.handlers.BankAccount._deriveIban("SF-BP_BankAccounts-Txt_BANK_ACCT", c, g);
			}
		},
		setDuplCheckModel: function () {
			var t = (JSON.parse(JSON.stringify(this.oDupCheckData)));;
			var D = [];
			this.oDupCheckFinalData = [];
			for (var i = 0; i < t.length;) {
				this.oDupCheckFinalData.push(t[i]);
				for (var j = i + 1; j < t.length;) {
					if (t[i].entity === t[j].entity && ((t[j].entityKey === t[j].entityKey && t[j].entityKey !== undefined) || t[i].createdIndex ===
							t[j].createdIndex && t[j].createdIndex !== undefined)) {
						this.oDupCheckFinalData.push(t[j]);
						t.splice(j, 1);
					} else {
						j++;
					}
				}
				t.splice(i, 1);
			}
		},
		checkDuplicates: function () {
			var f = "";
			this.setDuplCheckModel();
			for (var i = 0; i < this.oDupCheckFinalData.length;) {
				f = f + "(EntityType eq \'" + this.oDupCheckFinalData[i].entity + "\'" + " and Attribute eq \'" + this.oDupCheckFinalData[i].attribute +
					"\'" + " and CharacteristicValue eq \'" + this.oDupCheckFinalData[i].value + "\'";
				if (this.oDupCheckFinalData[i].createdIndex === undefined) {
					f = f + " and KeyValue eq \'" + this.oDupCheckFinalData[i].entityKey + "\')";
				} else {
					f = f + " and KeyValue eq \'" + "\' and ParentKeys eq \'BP_GUID-" + this.sItemPath.replace("binary", "").replace("\'", "") + ")";
				}
				i++;
				if (i < this.oDupCheckFinalData.length) {
					f = f + " and ";
				} else {
					f = f + " or ";
					break;
				}
			}
			f = f + "(KeyValue eq " + this.sItemPath.replace("binary", "") + ")";
			var p = "DuplicateCollection?$filter=" + jQuery.sap.encodeURL(f);
			if (this.vMaxDupRec !== undefined) {
				var m = "&$top=" + this.vMaxDupRec;
				p = p + m;
			}
			var b = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
			var a = {};
			b.getHeaders(a);
			a.SEARCH_MODE = "DB";
			b.setHeaders(a);
			var B = [];
			var o = b.createBatchOperation(p, "GET");
			B.push(o);
			b.clearBatch();
			b.addBatchReadOperations(B);
			B = [];
			var t = this;
			b.submitBatch(function (c, r) {
				t.oDuplicatesResult = c.__batchResponses;
			}, null, false);
			b.clearBatch();
		},
		onWizardComplete: function () {
			this.getView().byId("reviewtitle").setText(this.i18nBundle.getText("REVIEW", this.customerHeaderMsg));
			fcg.mdg.editbp.handlers.ContactPerson.aAllCounters = [];
			var t = this;
			if (this.vCancelFlag) {
				this.vCancelFlag = false;
				this._oNavContainer.to(this.getView().byId("idSummary"));
				return;
			}
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
			this.submitButtonState();
			this.oOldValuePairModel = [];
			this.getView().byId("idSubmit").setEnabled(true);
			var c = true;
			if (this.vCurrentEntity === "identificationRB" && this.vCurrentActionId === "createRB") {
				c = fcg.mdg.editbp.handlers.Identification.performUIValidations(this);
			}
			if (this.vCurrentEntity === "ContactPerRB" && (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB")) {
				c = fcg.mdg.editbp.handlers.ContactPerson.performUIValidations(this);
			}
			if (this.vCurrentEntity === "PersRB" && this.vCurrentActionId === "") {
				c = fcg.mdg.editbp.handlers.GeneralData.performUIValidations(this);
			}
			if (this.vCurrentEntity === "OrgRB" && this.vCurrentActionId === "") {
				c = fcg.mdg.editbp.handlers.GeneralData.performOrgUIValidations(this);
			}
			if (this.vCurrentEntity === "communicationRB" && (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB")) {
				c = fcg.mdg.editbp.handlers.Communication.performUIValidations(this);
			}
			if (fcg.mdg.editbp.handlers.Attachment.oUpload === true) {
				var e = this.i18nBundle.getText("ATTACH_UPLOAD");
				this.showErrorDialog(e);
				return;
			}
			if (c === false) {
				return;
			}
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
			this.oDuplicatesResult = "";
			if (this.oDupCheckData.length !== 0) {
				this.checkDuplicates();
			}
			var q = {};
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
				var a = (JSON.parse(JSON.stringify(this.changedArray)));
				var b = (JSON.parse(JSON.stringify(this.changedArray)));;
				var u;
				var T;
				for (var i = 0; i < a.length;) {
					u = "{";
					q.header = a[i].entityKey;
					q.entity = a[i].entity;
					if (a[i].key !== undefined) {
						u = u + "\"" + a[i].field + "\":\"" + a[i].key + "\",";
					} else {
						var v = "";
						if (this.vCurrentEntity === "taxRB") {
							var f = q.header.split(",")[1];
							T = f.substring(2, 3);
							if (a[i].field == "5") {
								u = u + "\"" + "TAXNUMXL" + "\":\"" + a[i].value + "\",";
							} else {
								if (a[i].value.length > 20) {
									if (T !== "0") {
										v = a[i].value.substring(0, 20);
										u = u + "\"" + "TAXNUMBER" + "\":\"" + v + "\",";
									} else {
										u = u + "\"" + "TAXNUMXL" + "\":\"" + a[i].value + "\",";
									}
								} else {
									u = u + "\"" + "TAXNUMBER" + "\":\"" + a[i].value + "\",";
								}
							}
						} else {
							u = u + "\"" + a[i].field + "\":\"" + a[i].value + "\",";
						}
					}
					for (var j = i + 1; j < a.length;) {
						if (a[i].entity === a[j].entity & a[i].entityKey === a[j].entityKey) {
							if (a[i].key !== undefined) {
								u = u + "\"" + a[j].field + "\":\"" + a[j].value + "\",";
							} else {
								var g = a[j].field + "__TXT";
								u = u + "\"" + a[i].field + "\":\"" + a[i].key + "\"," + "\"" + g + "\":\"" + a[i].value + "\",";
							}
							a.splice(j, 1);
						} else {
							j++;
						}
					}
					a.splice(i, 1);
					u = u.substring(0, u.length - 1) + "}";
					q.body = JSON.parse(u);
					this.finalQueryModel.push(q);
					q = {};
				}
				var h = {};
				var l = [];
				for (var k = 0; k < b.length; k++) {
					h.Entity = b[k].entity;
					if (b[k].key !== undefined) {
						h.Attribute = b[k].field + "__TXT";
					} else {
						h.Attribute = b[k].field;
					}
					h.EntityAction = "U";
					h.NewValue = b[k].value;
					l.push(h);
					h = {};
					if (b[k].key !== undefined) {
						var m = b[k].field;
						h.Entity = b[k].entity;
						h.Attribute = m;
						h.EntityAction = "U";
						h.NewValue = b[k].key;
						l.push(h);
						h = {};
					}
				}
				if (this.oCommunicationLayout !== "") {
					this.oCommunicationLayout.destroy();
				}
				if (this.vCurrentEntity === "taxRB") {
					var o = this.changedData.TAXTYPE__TXT;
					var p = this.changedData.TAXTYPE;
					var r = fcg.mdg.editbp.util.Formatter.getKeyDesc(p, o);
					if (this.changedData.TAXNUMBER !== '' && this.changedData.TAXNUMBER !== undefined) {
						this.changedData.TAXNUMXL = this.changedData.ChangeSets[0].NewValue;
					}
					if (this.changedData.TAXNUMXL === '') {
						for (var n = 0; n < b.length; n++) {
							if (b[n].field === "TAXNUMXL") {
								this.changedData.TAXNUMXL = b[n].value;
							}
						}
					}
				}
			}
			if (this.vCurrentEntity === "communicationRB") {
				if (this.vCurrentActionId === "createRB") {
					this.changedData = fcg.mdg.editbp.handlers.Communication.addresscrtModel;
				} else if (this.vCurrentActionId === "deleteRB") {
					this.changedData = fcg.mdg.editbp.handlers.Communication.addressdelModel;
				} else if (this.vCurrentActionId === "changeRB") {
					this.changedData = fcg.mdg.editbp.handlers.Communication.addresschnModel;
				}
			}
			var s = new sap.ui.model.json.JSONModel();
			s.setData(this.changedData);
			this.summaryofRequest();
			if (this.vCurrentEntity === "communicationRB") {
				this.getView().byId("addrsCommnctnLayout").setVisible(true);
				var w = "";
				this.CommDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispAddress", this);
				if (this.reEdit !== "X") {
					if (this.vCurrentActionId === "createRB") {
						w = this._oNavContainer.getPages()[1].getContent()[2].getContent()[0];
						w.addContent(this.CommDisplayFragment);
					} else if (this.vCurrentActionId === "changeRB") {
						w = this._oNavContainer.getPages()[1].getContent()[2].getContent()[1];
						var x = "";
						if (sap.ui.getCore().byId("selectDataListRBG") === undefined) {
							x = 0;
						} else {
							x = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
						}
						var A = "";
						if (fcg.mdg.editbp.handlers.Communication.addresschnModel.COUNTRY === "US") {
							A = fcg.mdg.editbp.handlers.Communication.addresschnModel.HOUSE_NO + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel
								.STREET + " / " + fcg.mdg.editbp.handlers.Communication.addresschnModel.CITY + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel
								.REGION + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel.POSTL_COD1;
						} else {
							A = fcg.mdg.editbp.handlers.Communication.addresschnModel.STREET + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel.HOUSE_NO +
								" / " + fcg.mdg.editbp.handlers.Communication.addresschnModel.POSTL_COD1 + " " + fcg.mdg.editbp.handlers.Communication.addresschnModel
								.CITY;
						}
						fcg.mdg.editbp.handlers.Communication.addresschnModel.AD_ID__TXT = A;
						var y = fcg.mdg.editbp.handlers.Communication.addresschnModel;
						var z = y.EDIT;
						var B = y.INDEX - 1;
						var S = y.SelectIndex;
						if (z === "X") {
							w.insertContent(this.CommDisplayFragment, B);
							var D = w.removeContent(w.getContent()[B + 1]);
							D.destroy();
						} else {
							w.addContent(this.CommDisplayFragment);
							y["EDIT"] = "X";
						}
						this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.Communication.addresschnModel.AD_ID);
					} else if (this.vCurrentActionId === "deleteRB") {
						w = this._oNavContainer.getPages()[1].getContent()[2].getContent()[2];
						this.CommDisplayFragment.getToolbar().getContent()[3].setVisible(true);
						w.addContent(this.CommDisplayFragment);
					}
					w.setVisible(true);
					fcg.mdg.editbp.handlers.Communication.setCommlayout(w);
				} else {
					var R = this.reEditSource.getParent().getParent().getParent();
					var E = R.getParent();
					E.getContent()[E.indexOfContent(R)].destroy();
					this.CommDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispAddress", this);
					E.insertContent(this.CommDisplayFragment, E.indexOfContent(R));
					if (this.vCurrentActionId === "createRB") {
						this.changedData = fcg.mdg.editbp.handlers.Communication.oReEditCrtModel;
						w = this.getView().byId("addrsCommnCreateLayout");
						w.getContent()[fcg.mdg.editbp.handlers.Communication.vReEditIndex];
					} else if (this.vCurrentActionId === "changeRB") {
						this.changedData = fcg.mdg.editbp.handlers.Communication.oReEditChngModel;
						w = this.getView().byId("addrsCommnChangeLayout");
						w.getContent()[fcg.mdg.editbp.handlers.Communication.vReEditIndex];
					}
					fcg.mdg.editbp.handlers.Communication.setCommlayout(w);
				}
				if (this.vCurrentActionId === "createRB" || this.vCurrentActionId === "changeRB" || this.vCurrentActionId === "deleteRB") {
					var F = new sap.ui.layout.GridData({
						linebreak: true
					});
					var G = false;
					var I = false;
					var J = false;
					var K = false;
					var L = false;
					var N = false;
					var O = false;
					var P = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommPhoneRel);
					if (P !== undefined && P.length > 0) {
						for (i in P) {
							if (P[i].TELEPHONE !== undefined && P[i].TELEPHONE !== "") {
								G = true;
								break;
							}
						}
						P = fcg.mdg.editbp.handlers.Communication.setCommDefaultCountry(P, s);
						fcg.mdg.editbp.handlers.Communication.displayCommunication(this, P,
							"{parts:[{path:'/COUNTRY'},{path:'/TELEPHONE'},{path:'/EXTENSION'}, {path:'/ChangeData/TELEPHONE'}, {path:'/ChangeData/EXTENSION'}],formatter:'fcg.mdg.editbp.util.Formatter.extensionWithNumber'}",
							this.i18nBundle.getText("Telephone"), "{path:'/TELEPHONE',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}", G);
					}
					var Q = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommMobileRel);
					if (Q !== undefined && Q.length > 0) {
						for (i in Q) {
							if (Q[i].TELEPHONE !== undefined && Q[i].TELEPHONE !== "") {
								I = true;
								break;
							}
						}
						Q = fcg.mdg.editbp.handlers.Communication.setCommDefaultCountry(Q, s);
						fcg.mdg.editbp.handlers.Communication.displayCommunication(this, Q,
							"{parts: [{path:'/COUNTRY'},{path: '/TELEPHONE'}, {path:'/ChangeData/TELEPHONE'}], formatter: 'fcg.mdg.editbp.util.Formatter.mobNumber'}",
							this.i18nBundle.getText("Mobile"), "{path:'/TELEPHONE',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}", I);
					}
					var U = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommFaxRel);
					if (U !== undefined && U.length > 0) {
						for (i in U) {
							if (U[i].FAX !== undefined && U[i].FAX !== "") {
								J = true;
								break;
							}
						}
						U = fcg.mdg.editbp.handlers.Communication.setCommDefaultCountry(U, s);
						fcg.mdg.editbp.handlers.Communication.displayCommunication(this, U,
							"{parts:[{path:'/COUNTRY'},{path:'/FAX'},{path:'/EXTENSION'},{path:'/ChangeData/FAX'},{path:'/ChangeData/EXTENSION'}],formatter:'fcg.mdg.editbp.util.Formatter.extensionWithNumber'}",
							this.i18nBundle.getText("Fax"), "{path:'/FAX',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}", J);
					}
					var V = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommEMailRel);
					if (V !== undefined && V.length > 0) {
						for (i in V) {
							if (V[i].E_MAIL !== undefined && V[i].E_MAIL !== "") {
								K = true;
								break;
							}
						}
						fcg.mdg.editbp.handlers.Communication.displayCommunication(this, V,
							"{parts: [{path: '/E_MAIL'}, {path:'/ChangeData/E_MAIL'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}", this.i18nBundle
							.getText("Email Address"), "{path:'/E_MAIL',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}", K);
					}
					var W = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_CommURIRel);
					if (W !== undefined && W.length > 0) {
						for (i in W) {
							if (W[i].URI !== undefined && W[i].URI !== "") {
								L = true;
								break;
							}
						}
						fcg.mdg.editbp.handlers.Communication.displayCommunication(this, W,
							"{parts: [{path: '/URI'}, {path:'/ChangeData/URI'}], formatter: 'fcg.mdg.editbp.util.Formatter.getBoldText'}", this.i18nBundle
							.getText("WEB"), "{path:'/URI',formatter:'fcg.mdg.editbp.util.Formatter.visibility'}", L);
					}
					var X = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_AddressVersionsOrgRel);
					if (X !== undefined && X.length > 0) {
						N = true;
						fcg.mdg.editbp.handlers.Communication.displayIAV(X, this);
					}
					var Y = fcg.mdg.editbp.handlers.Communication.checkModelData(this.changedData.BP_AddressVersionsPersRel);
					if (Y !== undefined && Y.length > 0) {
						O = true;
						fcg.mdg.editbp.handlers.Communication.displayIAV(Y, this);
					}
					if (!G && !I && !J && !K && !L) {
						fcg.mdg.editbp.handlers.Communication.setDispAddressTitle(this, this.i18nBundle.getText("Communication"));
					}
					if (!N && !O) {
						fcg.mdg.editbp.handlers.Communication.setDispAddressTitle(this, this.i18nBundle.getText("IAV"));
					}
					this.CommDisplayFragment.setModel(s);
					var t = this;

					function Z() {
						t._oNavContainer.detachAfterNavigate(Z);
						for (var i in t.CommDisplayFragment.getParent().getContent()) {
							t.CommDisplayFragment.getParent().getContent()[i].getModel().refresh();
							t.CommDisplayFragment.getParent().getContent()[i].rerender();
							t.CommDisplayFragment.getParent().getContent()[i].getModel().refresh();
						}
					};
					t._oNavContainer.attachAfterNavigate(Z);
				}
				fcg.mdg.editbp.handlers.Communication.setDispAddressTitle(this, "address");
			} else if (this.vCurrentEntity === "BankRB") {
				if (fcg.mdg.editbp.handlers.BankAccount.getBankModel() !== undefined && this.reEdit !== "X") {
					var $ = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DisplayBank", this);
					this._oNavContainer.getPages()[1].getContent()[3].setVisible(true);
					if (this.vCurrentActionId === "createRB") {
						this._oNavContainer.getPages()[1].getContent()[3].getContent()[0].setVisible(true);
						this._oNavContainer.getPages()[1].getContent()[3].getContent()[0].addContent($);
						$.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
						$.getToolbar().getContent()[1].addStyleClass("text_bold");
					} else if (this.vCurrentActionId === "changeRB") {
						var z = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().EDIT;
						var B = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().INDEX;
						var S = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().SelectIndex;
						this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].setVisible(true);
						if (z === "X") {
							var _ = fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().BANKDETAILID;
							var a1 = fcg.mdg.editbp.handlers.BankAccount.aChangedBanks.indexOf(_);
							$ = this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].getContent()[a1];
						} else {
							this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].addContent($);
							$.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
							$.getToolbar().getContent()[1].addStyleClass("text_bold");
							fcg.mdg.editbp.handlers.BankAccount.oBankRslts.BP_BankAccountsRel.results[S]["EDIT"] = "X";
						}
						this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.BankAccount.oChngBankModel.getData().BANKDETAILID);
					} else if (this.vCurrentActionId === "deleteRB") {
						$.getToolbar().getContent()[3].setVisible(false);
						this._oNavContainer.getPages()[1].getContent()[3].getContent()[2].setVisible(true);
						this._oNavContainer.getPages()[1].getContent()[3].getContent()[2].addContent($);
						$.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
						$.getToolbar().getContent()[1].addStyleClass("text_bold");
					}
					$.setModel(fcg.mdg.editbp.handlers.BankAccount.getBankModel(), "Bank");
				} else {
					if (this.vCurrentActionId === "createRB") {
						var b1 = fcg.mdg.editbp.handlers.BankAccount.oReEditModel;
						this._oNavContainer.getPages()[1].getContent()[3].getContent()[0].getContent()[fcg.mdg.editbp.handlers.BankAccount.vReEditIndex]
							.setModel(b1, "Bank");
					} else if (this.vCurrentActionId === "changeRB") {
						var c1 = fcg.mdg.editbp.handlers.BankAccount.oReEditChngModel;
						this._oNavContainer.getPages()[1].getContent()[3].getContent()[1].getContent()[fcg.mdg.editbp.handlers.BankAccount.vReEditIndex]
							.setModel(c1, "Bank");
					}
				}
			} else if (this.vCurrentEntity === "identificationRB") {
				if (fcg.mdg.editbp.handlers.Identification.getIDModel() !== undefined && this.reEdit !== "X") {
					var d1 = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispIdentification", this);
					this._oNavContainer.getPages()[1].getContent()[4].setVisible(true);
					if (this.vCurrentActionId === "createRB") {
						this._oNavContainer.getPages()[1].getContent()[4].getContent()[0].setVisible(true);
						this._oNavContainer.getPages()[1].getContent()[4].getContent()[0].addContent(d1);
						d1.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
						d1.getToolbar().getContent()[1].addStyleClass("text_bold");
						d1.setModel(fcg.mdg.editbp.handlers.Identification.getIDModel(), "ID");
					} else if (this.vCurrentActionId === "deleteRB") {
						this._oNavContainer.getPages()[1].getContent()[4].getContent()[1].setVisible(true);
						this._oNavContainer.getPages()[1].getContent()[4].getContent()[1].addContent(d1);
						d1.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
						d1.getToolbar().getContent()[1].addStyleClass("text_bold");
						d1.setModel(fcg.mdg.editbp.handlers.Identification.getDeletedIDModel(), "ID");
					}
				} else {
					var b1 = fcg.mdg.editbp.handlers.Identification.oReEditModel;;
					this._oNavContainer.getPages()[1].getContent()[4].getContent()[0].getContent()[fcg.mdg.editbp.handlers.Identification.vReEditIndex]
						.setModel(b1, "ID");
				}
			} else if (this.vCurrentEntity === "ContactPerRB") {
				if (fcg.mdg.editbp.handlers.ContactPerson.getCPModel() !== undefined && this.reEdit !== "X") {
					var e1 = fcg.mdg.editbp.handlers.ContactPerson.getCPModel();
					var f1 = fcg.mdg.editbp.handlers.ContactPerson.getDispCPModel();
					var w;
					var g1 = e1.BP_RelationContactPersonRel;
					this._oNavContainer.getPages()[1].getContent()[6].setVisible(true);
					if (this.vCurrentActionId === "createRB") {
						var h1 = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispContactPerson", this);
						this._oNavContainer.getPages()[1].getContent()[6].getContent()[0].setVisible(true);
						this._oNavContainer.getPages()[1].getContent()[6].getContent()[0].addContent(h1);
						h1.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
						h1.getToolbar().getContent()[1].addStyleClass("text_bold");
						w = this.getView().byId("cpCreateLayout");
						var i1 = new sap.ui.model.json.JSONModel();
						i1.setData(f1);
						h1.setModel(i1, "person");
						fcg.mdg.editbp.handlers.ContactPerson.destroyAddressTittle(f1, w, this);
						fcg.mdg.editbp.handlers.ContactPerson.displayWPAddress(g1.BP_ContactPersonWorkplacesRel, w, this);
						fcg.mdg.editbp.handlers.ContactPerson.displayCpIAV(g1.BP_ContactPersonWorkplacesRel, w, this);
					} else if (this.vCurrentActionId === "changeRB") {
						var z = fcg.mdg.editbp.handlers.ContactPersonChange.ocpChangeModel.EDIT;
						var S = fcg.mdg.editbp.handlers.ContactPersonChange.ocpChangeModel.SelectIndex;
						var h1 = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DisplayChangeCP", this);
						this._oNavContainer.getPages()[1].getContent()[6].getContent()[1].setVisible(true);
						h1.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
						h1.getToolbar().getContent()[1].addStyleClass("text_bold");
						w = this.getView().byId("cpChangeLayout");
						if (z !== "X") {
							w.addContent(h1);
							w = w.getContent()[w.getContent().length - 1];
							fcg.mdg.editbp.handlers.ContactPerson.oRelResults.BP_RelationsRel.results[S]["EDIT"] = "X";
						} else {
							var j1 = fcg.mdg.editbp.handlers.ContactPersonChange.aChangedCP.indexOf(e1.PARTNER2);
							w.insertContent(h1, j1);
							w.removeContent(w.getContent()[j1 + 1]);
							w = w.getContent()[j1];
						}
						var i1 = new sap.ui.model.json.JSONModel();
						i1.setData(f1);
						h1.setModel(i1, "ChPerson");
						fcg.mdg.editbp.handlers.ContactPerson.displayWPAddress(g1.BP_ContactPersonWorkplacesRel.results, w, this);
						fcg.mdg.editbp.handlers.ContactPerson.displayCpIAV(g1.BP_ContactPersonWorkplacesRel.results, w, this);
						this.setEntityValue(this.vCurrentEntity, e1.PARTNER2);
					} else if (this.vCurrentActionId === "deleteRB") {
						var k1 = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispDeleteContactPerson", this);
						this._oNavContainer.getPages()[1].getContent()[6].getContent()[2].setVisible(true);
						this._oNavContainer.getPages()[1].getContent()[6].getContent()[2].addContent(k1);
						k1.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
						k1.getToolbar().getContent()[1].addStyleClass("text_bold");
						w = this.getView().byId("cpDeleteLayout");
						var i1 = new sap.ui.model.json.JSONModel();
						i1.setData(e1);
						k1.setModel(i1, "person");
						fcg.mdg.editbp.handlers.ContactPerson.displayWPAddress(g1.BP_ContactPersonWorkplacesRel.results, w, this);
						fcg.mdg.editbp.handlers.ContactPerson.displayCpIAV(g1.BP_ContactPersonWorkplacesRel.results, w, this);
					}
				} else {
					var b1 = fcg.mdg.editbp.handlers.ContactPerson.oReEditModel;;
					this._oNavContainer.getPages()[1].getContent()[6].getContent()[0].getContent()[fcg.mdg.editbp.handlers.ContactPerson.vReEditIndex]
						.setModel(b1, "CP");
				}
			} else if (this.vCurrentEntity === "OrgRB") {
				var l1 = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispGeneralOrg", this);
				this._oNavContainer.getPages()[1].getContent()[1].setVisible(true);
				var w = this._oNavContainer.getPages()[1].getContent()[1].getContent()[0];
				w.setVisible(true);
				w.removeAllContent();
				w.addContent(l1);
				l1.setModel(fcg.mdg.editbp.handlers.GeneralData.getGenDataModel(), "Gen");
				fcg.mdg.editbp.handlers.GeneralData.setDispFragTitle(this, w);
				this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.GeneralData.getGenDataModel().getData().PARTNER);
			} else if (this.vCurrentEntity === "PersRB") {
				var m1 = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispGeneralPerson", this);
				this._oNavContainer.getPages()[1].getContent()[1].setVisible(true);
				var w = this._oNavContainer.getPages()[1].getContent()[1].getContent()[0];
				w.setVisible(true);
				w.removeAllContent();
				w.addContent(m1);
				m1.setModel(fcg.mdg.editbp.handlers.GeneralData.getGenDataModel(), "Gen");
				fcg.mdg.editbp.handlers.GeneralData.setDispFragTitle(this, w);
				this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.GeneralData.getGenDataModel().getData().PARTNER);
			}
			this._oNavContainer.to(this.getView().byId("idSummary"));
			if (this.vCurrentActionId === "changeRB") {
				this.setBoldingBP();
			}
			if (this.extHookOnWizardComplete() !== undefined) {
				this.extHookOnWizardComplete(this);
			}
		},
		setEntityValue: function (c, I) {
			var f = false;
			for (var i = 0; i < this.aEntityValue.length; i++) {
				if (this.aEntityValue[i].split("-")[0] === c && this.aEntityValue[i].split("-")[1] === I) {
					f = true;
				}
			}
			if (!f) this.aEntityValue.push(c + "-" + I);
			else f = false;
		},
		setBoldingBP: function () {
			var s;
			if (this.changedData.ChangeSets !== undefined) {
				for (var i = 0; i < this.changedData.ChangeSets.length; i++) {
					s = "SF-" + this.changedData.ChangeSets[i].Entity + "-" + this.changedData.ChangeSets[i].Attribute.split("/");
					if (sap.ui.getCore().byId(s) !== undefined) sap.ui.getCore().byId(s).addStyleClass("text_bold");
				}
			}
		},
		onExit: function () {},
		getRouter: function () {
			var t = this;
			return sap.ui.core.UIComponent.getRouterFor(t);
		},
		createTax: function () {
			var t = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
			var T = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
			var a = t.getValue();
			var b = T.getValue();
			this.clearAllData();
			if (a === "" || b === "") {
				if (a === "") {
					t.setValueState("Error");
				}
				if (b === "") {
					T.setValueState("Error");
				}
				return;
			}
			var r = fcg.mdg.editbp.handlers.TaxNumbers.createTNModel(this.vTaxCat, this);
			var c = new sap.ui.model.json.JSONModel();
			c.setData(r);
			if (this.reEdit === "") {
				var o = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
				this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
				this._oNavContainer.getPages()[1].getContent()[5].getContent()[0].setVisible(true);
				this._oNavContainer.getPages()[1].getContent()[5].getContent()[0].addContent(o);
				o.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("NEW") + ")");
				o.getToolbar().getContent()[1].addStyleClass("text_bold");
				o.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oTaxModel, "Tax");
				this._oNavContainer.to(this.getView().byId("idSummary"));
				this.summaryofRequest();
			} else if (this.reEdit === "X") {
				this._oNavContainer.getPages()[1].getContent()[5].getContent()[0].getContent()[this.vTaxEntityIndex].setModel(fcg.mdg.editbp.handlers
					.TaxNumbers.oTaxModel, "Tax");
				this._oNavContainer.to(this.getView().byId("idSummary"));
				this.summaryofRequest();
				this.vTaxEntityIndex = "";
			}
			this.vContEditTax = "";
			return;
		},
		changeTax: function () {
			var t = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
			var T = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
			var a = t.getValue();
			var b = T.getValue();
			if (a === "" || b === "") {
				if (a === "") {
					t.setValueState("Error");
				}
				if (b === "") {
					T.setValueState("Error");
				}
				return;
			}
			if (this.vContEditTax === "") {
				if (this.reEdit === "") {
					fcg.mdg.editbp.handlers.TaxNumbers.changeModel(this);
					var o = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
					this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
					this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].setVisible(true);
					this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].addContent(o);
					o.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
					o.getToolbar().getContent()[1].addStyleClass("text_bold");
					o.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel, "Tax");
					this._oNavContainer.to(this.getView().byId("idSummary"));
					this.summaryofRequest();
				}
				if (this.reEdit === "X") {
					fcg.mdg.editbp.handlers.TaxNumbers.changeModel(this);
					this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[this.vTaxEntityIndex].setModel(fcg.mdg.editbp.handlers
						.TaxNumbers.oChangeTaxModel, "Tax");
					this._oNavContainer.to(this.getView().byId("idSummary"));
					this.summaryofRequest();
					this.vTaxEntityIndex = "";
				}
			} else if (this.vContEditTax === "X") {
				var r = "";
				fcg.mdg.editbp.handlers.TaxNumbers.changeModel(this);
				r = fcg.mdg.editbp.handlers.TaxNumbers.vRIndex;
				if (r !== "") {
					this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[r].setModel(fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel,
						"Tax");
					this._oNavContainer.to(this.getView().byId("idSummary"));
					this.summaryofRequest();
				} else {
					var o = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
					this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
					this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].setVisible(true);
					this._oNavContainer.getPages()[1].getContent()[5].getContent()[1].addContent(o);
					o.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("CHANGE") + ")");
					o.getToolbar().getContent()[1].addStyleClass("text_bold");
					o.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel, "Tax");
					this._oNavContainer.to(this.getView().byId("idSummary"));
					this.summaryofRequest();
				}
			}
			this.vContEditTax = "";
			this.vTaxEntityIndex = "";
			this.setEntityValue(this.vCurrentEntity, fcg.mdg.editbp.handlers.TaxNumbers.oChangeTaxModel.getData().TAXTYPE);
			return;
		},
		deleteTax: function () {
			fcg.mdg.editbp.handlers.TaxNumbers.deleteModel(this);
			var t = sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.DispTaxNumber", this);
			this._oNavContainer.getPages()[1].getContent()[5].setVisible(true);
			this._oNavContainer.getPages()[1].getContent()[5].getContent()[2].setVisible(true);
			this._oNavContainer.getPages()[1].getContent()[5].getContent()[2].addContent(t);
			t.getToolbar().getContent()[1].setText(" (" + this.i18nBundle.getText("DELETED") + ")");
			t.getToolbar().getContent()[1].addStyleClass("text_bold");
			t.setModel(fcg.mdg.editbp.handlers.TaxNumbers.oDltTaxModel, "Tax");
			this._oNavContainer.to(this.getView().byId("idSummary"));
			this.summaryofRequest();
			this.vContEditTax = "";
			this.vTaxEntityIndex = "";
			return;
		},
		undoEntityData: function (e) {
			this.reEditSource = e.getSource();
			var a = this.reEditSource.getParent().getParent().getParent().getParent();
			var E = this.reEditSource.getParent().getParent().getParent().getParent().getParent();
			var A = E.indexOfContent(a);
			var v = this.reEditSource.getParent().getParent().getParent();
			var b = a.indexOfContent(v);
			var m;
			switch (this.getView().byId("idSummary").indexOfContent(E)) {
			case 0:
			case 1:
				m = fcg.mdg.editbp.handlers.GeneralData.undoGenDataChanges(A, b);
				break;
			case 2:
				m = fcg.mdg.editbp.handlers.Communication.undoAddressChanges(A, b);
				break;
			case 3:
				m = fcg.mdg.editbp.handlers.BankAccount.undoBankChanges(this.reEditSource, A, b, v, this);
				break;
			case 4:
				m = fcg.mdg.editbp.handlers.Identification.undoIdentificationChanges(A, b);
				break;
			case 5:
				m = fcg.mdg.editbp.handlers.TaxNumbers.undoTaxNumberChanges(A, b);
				break;
			case 6:
				m = fcg.mdg.editbp.handlers.ContactPersonChange.undoContactPersonChanges(A, b);
				break;
			}
			if (m === "ERROR") {
				return;
			}
			v.destroy();
			M.show(this.i18nBundle.getText("REVERT_CHNG_MSG"));
			this.clearAllData();
			this.submitButtonState();
			this.oDuplicatesResult = "";
			if (this.oDupCheckData.length !== 0) {
				this.checkDuplicates();
			} else {
				this.displayDuplicateMessage(this.oDuplicatesResult, this._oNavContainer);
			}
			if (this.extHookUndoEntityData() !== undefined) {
				this.extHookUndoEntityData(this, e);
			}
		},
		displayDuplicateMessage: function (D, n) {
			if (D !== "") {
				n.getPages()[1].getContent()[0].getContent()[0].getContent()[0].setVisible(true);
				if (D[0].data === undefined) {
					if (D[0].response.body !== undefined) {
						var e = JSON.parse(D[0].response.body).error.message.value;
						n.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].setText(this.i18nBundle.getText(
							"Duplicate Check - Error Occured : ") + e);
					} else {
						n.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].setText(this.i18nBundle.getText(
							"Duplicate Check - Error Occured"));
					}
					sap.ui.getCore().byId("idDuplCheckMsg").setVisible(true);
					n.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].mAggregations.link.setVisible(false);
					return;
				}
				if (D[0].data.results.length > 0) {
					sap.ui.getCore().byId("idDuplCheckMsg").setVisible(true);
					n.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].setText(this.i18nBundle.getText("DUP_CHK_MSG",
						this.vPARTNERID));
					n.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].mAggregations.link.setText(this.i18nBundle.getText(
						"VIEW_DUP_MSG"));
					n.getPages()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[2].mAggregations.link.setVisible(true);
				} else if (D[0].data.results.length === 0) {
					sap.ui.getCore().byId("idDuplCheckMsg").setVisible(false);
				}
			} else if (this.vCurrentActionId !== "deleteRB") {
				sap.ui.getCore().byId("idDuplCheckMsg").setVisible(false);
			} else {
				sap.ui.getCore().byId("idDuplCheckMsg").setVisible(false);
			}
		},
		navBackToEditEntityData: function (e) {
			this.clearAllData();
			this.reEdit = "X";
			this.reEditSource = e.getSource();
			var a = this.reEditSource.getParent().getParent().getParent().getParent();
			var E = this.reEditSource.getParent().getParent().getParent().getParent().getParent();
			var A = E.indexOfContent(a);
			var v = this.reEditSource.getParent().getParent().getParent();
			var b = a.indexOfContent(v);
			if (A === 0) {
				this.vCurrentActionId = "createRB";
			} else if (A === 1) {
				this.vCurrentActionId = "changeRB";
			}
			switch (this.getView().byId("idSummary").indexOfContent(E)) {
			case 0:
				break;
			case 1:
				if (this.sCategory === "2") {
					this.vCurrentEntity = "OrgRB";
				} else if (this.sCategory === "1") {
					this.vCurrentEntity = "PersRB";
				}
				this._navBackToStep(this.getView().byId("requestStep"));
				this.oWizard.invalidateStep(this.getView().byId("requestStep"));
				break;
			case 2:
				this.vCurrentEntity = "communicationRB";
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
				this.vTaxEntityIndex = b;
				this._navBackToStep(this.getView().byId("editStep"));
				this.oWizard.invalidateStep(this.getView().byId("editStep"));
				break;
			case 6:
				break;
			}
		},
		_navBackToStep: function (s) {
			var t = this;

			function a() {
				t.oWizard.goToStep(s);
				if (t.oCommunicationLayout !== "") {
					t.oCommunicationLayout.destroyContent();
				}
				if (t.vCurrentEntity === "OrgRB" || t.vCurrentEntity === "PersRB") {
					fcg.mdg.editbp.handlers.GeneralData.editGeneralData(this.sItemPath, t.sCategory, t.i18nBundle, t);
				} else if (t.vCurrentEntity === "taxRB") {
					fcg.mdg.editbp.handlers.TaxNumbers.handleTaxNumber(t);
				} else if (t.vCurrentEntity === "BankRB") {
					fcg.mdg.editbp.handlers.BankAccount.handleBankAccounts(t);
				} else if (t.vCurrentEntity === "identificationRB") {
					fcg.mdg.editbp.handlers.Identification.handleIdentification(t);
				} else if (t.vCurrentEntity === "communicationRB") {
					fcg.mdg.editbp.handlers.Communication.handleCommunication(t);
				} else if (t.vCurrentEntity === "ContactPerRB") {
					fcg.mdg.editbp.handlers.ContactPerson.handleContactPerson(t);
				}
				t._oNavContainer.detachAfterNavigate(a);
			}
			this._oNavContainer.attachAfterNavigate(a);
			this._oNavContainer.to(this._oWizardContentPage);
		},
		onBankCountryVH: function (c) {
			var g = this;
			fcg.mdg.editbp.handlers.BankAccount._countryVH("SF-BP_BankAccounts-Txt_BANK_CTRY", c, g);
		},
		onBankKeyVH: function (c) {
			var g = this;
			fcg.mdg.editbp.handlers.BankAccount._BankKeyVH("SF-BP_BankAccounts-Txt_BANK_KEY", c, g);
		},
		onTaxCategoryVH: function (c) {
			var g = this;
			fcg.mdg.editbp.handlers.TaxNumbers._TaxTypeVH("SF-BP_TaxNumber-TaxNumCat", c, g);
		},
		onChangeTaxType: function (e) {
			if (fcg.mdg.editbp.handlers.TaxNumbers.valueHelpFlag === "X") {
				this.onChange(e);
			} else {
				sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setValue(sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue().toUpperCase());
				var t = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
				var a = t.getValue();
				var T = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
				var b = T.getValue();
				var c = a.replace(/^[ ]+|[ ]+$/g, '');
				var o = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm");
				var f = T.getValueState();
				var g = t.getValueState();
				var h = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[8].data;
				if (h.results.length > 0) {
					var v = h.results.length - 1;
					for (var i = 0; i < h.results.length; i++) {
						if (h.results[i].KEY === a) {
							t.setValueState("None");
							t.setValueStateText("");
							o.setValue(h.results[i].TEXT);
							T.setValueState("None");
							if (a !== "" && b !== "" && f !== "Error" && g !== "Error") {
								this.oWizard.validateStep(this.getView().byId("editStep"));
							} else {
								this.oWizard.invalidateStep(this.getView().byId("editStep"));
							}
							return;
						} else if (i === v && h.results[i].KEY !== a) {
							if (a !== "") {
								t.setValueState("Error");
								t.setValueStateText(this.i18nBundle.getText("Tax_Type_MSG", a));
								o.setValue("");
								this.oWizard.invalidateStep(this.getView().byId("editStep"));
							}
						}
					}
				}
			}
		},
		taxCatChange: function (e) {
			var t = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
			var T = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat");
			var o = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm");
			var a = T.getValue();
			var b = t.getValue();
			var c = b.length;
			if (a !== "") {
				t.setValueState("None");
				T.setValueState("None");
			}
			if (a === "") {
				o.setValue("");
			}
		},
		submitButtonState: function () {
			if (fcg.mdg.editbp.handlers.BankAccount.BankQueryModel.length > 0 || fcg.mdg.editbp.handlers.BankAccount.BankChngQueryModel.length >
				0 || fcg.mdg.editbp.handlers.BankAccount.BankDltQueryModel.length > 0 || fcg.mdg.editbp.handlers.TaxNumbers.taxCreateModel.length >
				0 || fcg.mdg.editbp.handlers.TaxNumbers.TaxChngQueryModel.length > 0 || fcg.mdg.editbp.handlers.TaxNumbers.TaxDltQueryModel.length >
				0 || fcg.mdg.editbp.handlers.Communication.oCreateModel.length > 0 || fcg.mdg.editbp.handlers.Communication.oDeleteModel.length >
				0 || fcg.mdg.editbp.handlers.Communication.oChangeModel.length > 0 || fcg.mdg.editbp.handlers.Identification.oIDQueryModel.length >
				0 || fcg.mdg.editbp.handlers.Identification.oIDDeleteQueryModel.length > 0 || fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel.length >
				0 || fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteQueryModel.length > 0 || fcg.mdg.editbp.handlers.ContactPersonChange.aChangedCP
				.length > 0 || fcg.mdg.editbp.handlers.GeneralData.GenDataQueryModel.length > 0) {
				this.getView().byId("idSubmit").setEnabled(true);
			} else {
				this.getView().byId("idSubmit").setEnabled(false);
			}
			if (this.extHookSubmitButtonState() !== undefined) {
				this.extHookSubmitButtonState(this);
			}
		},
		buildCPWPQuery: function (c, b, m, o, a, i) {
			var w = o[a].BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel.results;
			for (var W = 0; W < w.length; W++) {
				i = undefined;
				var A = undefined;
				if (w[W].action === "U") {
					A = "MERGE";
				} else if (w[W].action === "N") {
					A = "POST";
				} else if (w[W].action === "D") {
					A = "DELETE";
				}
				if (w[W].action !== undefined) {
					if (w[W].action === "U") {
						delete w[W].ChangeData.__deferred;
						i = "X";
						b.push(m.createBatchOperation(w[W].header, A, w[W].ChangeData));
					} else if (w[W].action === "N") {
						delete w[W].ChangeData.__deferred;
						c.postDeepWorkplaceAddrs(c, b, m, o, a, w, W);
					} else if (w[W].action === "D") {
						b.push(m.createBatchOperation(w[W].header, A));
					}
				}
				if (w[W].action !== "N" && w[W].action !== "D") {
					c.buildWpEntityQuery(c, b, m, o, a, w, W, i);
				}
			}
		},
		postDeepWorkplaceAddrs: function (o, a, m, e, f, w, W) {
			var t, v, F, g, i;
			var V = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(w[W].VALIDUNTILDATE);
			delete w[W].ChangeData.__deferred;
			var s = w[W].header + "/BP_ContactPersonWorkplacesRel";
			var p = [];
			var h = [];
			p = w[W].ChangeData;
			p["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
			if (w[W].BP_WorkplaceCommPhonesRel !== undefined) {
				var T = w[W].BP_WorkplaceCommPhonesRel.results;
				for (var j = 0; j < T.length; j++) {
					delete T[j].ChangeData.__deferred;
					T[j].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
					h.push(T[j].ChangeData);
					if (j === T.length - 1) {
						p["BP_WorkplaceCommPhonesRel"] = h;
						h = [];
					}
				}
			}
			if (w[W].BP_WorkplaceCommMobilesRel !== undefined) {
				var k = w[W].BP_WorkplaceCommMobilesRel.results;
				for (var l = 0; l < k.length; l++) {
					delete k[l].ChangeData.__deferred;
					k[l].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
					h.push(k[l].ChangeData);
					if (l === k.length - 1) {
						p["BP_WorkplaceCommMobilesRel"] = h;
						h = [];
					}
				}
			}
			if (w[W].BP_WorkplaceCommFaxesRel !== undefined) {
				var n = w[W].BP_WorkplaceCommFaxesRel.results;
				for (var q = 0; q < n.length; q++) {
					delete n[q].ChangeData.__deferred;
					n[q].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
					h.push(n[q].ChangeData);
					if (q === n.length - 1) {
						p["BP_WorkplaceCommFaxesRel"] = h;
						h = [];
					}
				}
			}
			if (w[W].BP_WorkplaceCommEMailsRel !== undefined) {
				var E = w[W].BP_WorkplaceCommEMailsRel.results;
				for (var r = 0; r < E.length; r++) {
					delete E[r].ChangeData.__deferred;
					E[r].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
					h.push(E[r].ChangeData);
					if (r === E.length - 1) {
						p["BP_WorkplaceCommEMailsRel"] = h;
						h = [];
					}
				}
			}
			if (w[W].BP_WorkplaceIntAddressVersRel !== undefined) {
				var I = w[W].BP_WorkplaceIntAddressVersRel.results;
				for (var u = 0; u < I.length; u++) {
					var x = undefined;
					delete I[u].ChangeData.__deferred;
					I[u].ChangeData["VALIDUNTILDATE"] = "9999-12-31T00:00:00";
					if (I[u].BP_WorkplaceIntPersVersionRel !== undefined && Object.getOwnPropertyNames(I[u].BP_WorkplaceIntPersVersionRel.ChangeData)
						.length !== 0) {
						I[u].ChangeData["BP_WorkplaceIntPersVersionRel"] = I[u].BP_WorkplaceIntPersVersionRel.ChangeData;
					}
					h.push(I[u].ChangeData);
					if (u === I.length - 1) {
						p["BP_WorkplaceIntAddressVersRel"] = h;
						h = [];
					}
				}
			}
			a.push(m.createBatchOperation(s, "POST", p));
			var y = fcg.mdg.editbp.handlers.ContactPersonChange.stdChangeAddress;
			var z = "",
				A, B = "";
			if (y !== "" && y.length > 0) {
				z = y[0].BP_AddressVersionsPersRel.results;
				A = p.BP_WorkplaceIntAddressVersRel;
				if (z !== undefined) {
					for (var b = 0; b < z.length; b++) {
						if (A !== undefined) {
							for (var c = 0; c < A.length; c++) {
								if (z[b].ADDR_VERS === A[c].ADDR_VERS) {
									var D = "BP_PersonVersionCollection(BP_GUID=X'" + fcg.mdg.editbp.handlers.ContactPersonChange.vChgBpguid2 + "',ADDR_VERS='" +
										A[c].ADDR_VERS + "',AD_ID='" + y[0].AD_ID + "')";
									a.push(m.createBatchOperation(D, "MERGE", A[c].BP_WorkplaceIntPersVersionRel));
									delete(A[c].BP_WorkplaceIntPersVersionRel);
								}
							}
						}
					}
				}
			}
		},
		buildWpEntityQuery: function (c, a, m, o, e, w, W, i) {
			var t, v, f, g, I;
			var T = w[W].BP_WorkplaceCommPhonesRel.results;
			var h = w[W].BP_WorkplaceCommMobilesRel.results;
			var F = w[W].BP_WorkplaceCommFaxesRel.results;
			var E = w[W].BP_WorkplaceCommEMailsRel.results;
			var j = w[W].BP_WorkplaceIntAddressVersRel.results;
			var V = fcg.mdg.editbp.util.Formatter.validUntilDateFormat(w[W].VALIDUNTILDATE);
			for (var k = 0; k < T.length; k++) {
				t = undefined;
				if (T[k].action === "U") {
					t = "MERGE";
				} else if (T[k].action === "N") {
					t = "POST";
					T[k].header = T[k].header + "/BP_WorkplaceCommPhonesRel";
					T[k].ChangeData["VALIDUNTILDATE"] = V;
				} else if (T[k].action === "D") {
					t = "DELETE";
				}
				if (T[k].action !== undefined) {
					if (T[k].action === "D") {
						a.push(m.createBatchOperation("BP_WorkplaceCommPhoneCollection" + T[k].header, t));
					} else {
						delete T[k].ChangeData.__deferred;
						i = "X";
						a.push(m.createBatchOperation(T[k].header, t, T[k].ChangeData));
					}
				}
			}
			for (var l = 0; l < h.length; l++) {
				v = undefined;
				if (h[l].action === "U") {
					v = "MERGE";
				} else if (h[l].action === "N") {
					v = "POST";
					h[l].header = h[l].header + "/BP_WorkplaceCommMobilesRel";
					h[l].ChangeData["VALIDUNTILDATE"] = V;
				} else if (h[l].action === "D") {
					v = "DELETE";
				}
				if (h[l].action !== undefined) {
					if (h[l].action === "D") {
						a.push(m.createBatchOperation("BP_WorkplaceCommMobileCollection" + h[l].header, v));
					} else {
						delete h[l].ChangeData.__deferred;
						i = "X";
						a.push(m.createBatchOperation(h[l].header, v, h[l].ChangeData));
					}
				}
			}
			for (var n = 0; n < F.length; n++) {
				f = undefined;
				if (F[n].action === "U") {
					f = "MERGE";
				} else if (F[n].action === "N") {
					f = "POST";
					F[n].header = F[n].header + "/BP_WorkplaceCommFaxesRel";
					F[n].ChangeData["VALIDUNTILDATE"] = V;
				} else if (F[n].action === "D") {
					f = "DELETE";
				}
				if (F[n].action !== undefined) {
					if (F[n].action === "D") {
						a.push(m.createBatchOperation("BP_WorkplaceCommFaxCollection" + F[n].header, f));
					} else {
						delete F[n].ChangeData.__deferred;
						i = "X";
						a.push(m.createBatchOperation(F[n].header, f, F[n].ChangeData));
					}
				}
			}
			for (var p = 0; p < E.length; p++) {
				g = undefined;
				if (E[p].action === "U") {
					g = "MERGE";
				} else if (E[p].action === "N") {
					g = "POST";
					E[p].header = E[p].header + "/BP_WorkplaceCommEMailsRel";
					E[p].ChangeData["VALIDUNTILDATE"] = V;
				} else if (E[p].action === "D") {
					g = "DELETE";
				}
				if (E[p].action !== undefined) {
					if (E[p].action === "D") {
						a.push(m.createBatchOperation("BP_WorkplaceCommEMailCollection" + E[p].header, g));
					} else {
						delete E[p].ChangeData.__deferred;
						i = "X";
						a.push(m.createBatchOperation(E[p].header, g, E[p].ChangeData));
					}
				}
			}
			for (var q = 0; q < j.length; q++) {
				I = undefined;
				var r = undefined;
				if (j[q].action === "U") {
					I = "MERGE";
				} else if (j[q].action === "N") {
					I = "POST";
				} else if (j[q].action === "D") {
					I = "DELETE";
				}
				if (j[q].action !== undefined) {
					if (I === "MERGE") {
						delete j[q].ChangeData.__deferred;
						i = "X";
						a.push(m.createBatchOperation(j[q].header, I, j[q].ChangeData));
					} else if (I === "DELETE") {
						a.push(m.createBatchOperation("BP_WorkplaceIntAddressVersCollection" + j[q].header, I));
					}
				}
				if (I === "POST") {
					delete j[q].ChangeData.__deferred;
					delete j[q].BP_WorkplaceIntPersVersionRel.ChangeData.__deferred;
					var s = j[q].header + "/BP_WorkplaceIntAddressVersRel";
					var D = j[q].ChangeData;
					D["VALIDUNTILDATE"] = V;
					D["BP_WorkplaceIntPersVersionRel"] = j[q].BP_WorkplaceIntPersVersionRel.ChangeData;
					a.push(m.createBatchOperation(s, I, D));
					var u = fcg.mdg.editbp.handlers.ContactPersonChange.stdChangeAddress;
					var x = "",
						y, z = "";
					if (u !== "" && u.length > 0) {
						x = u[0].BP_AddressVersionsPersRel.results;
						y = D;
						if (x !== undefined) {
							for (var b = 0; b < x.length; b++) {
								if (x[b].ADDR_VERS === D.ADDR_VERS) {
									var A = "BP_PersonVersionCollection(BP_GUID=X'" + fcg.mdg.editbp.handlers.ContactPersonChange.vChgBpguid2 + "',ADDR_VERS='" +
										D.ADDR_VERS + "',AD_ID='" + u[0].AD_ID + "')";
									a.push(m.createBatchOperation(A, "MERGE", D.BP_WorkplaceIntPersVersionRel));
									delete(D.BP_WorkplaceIntPersVersionRel);
								}
							}
						}
					}
				} else if (I === undefined) {
					if (j[q].BP_WorkplaceIntPersVersionRel.action === "U") {
						r = "MERGE";
					} else if (j[q].BP_WorkplaceIntPersVersionRel.action === "N") {
						r = "POST";
					} else if (j[q].BP_WorkplaceIntPersVersionRel.action === "D") {
						r = "DELETE";
					}
					if (r === "MERGE" && i === "X") {
						delete j[q].BP_WorkplaceIntPersVersionRel.ChangeData.__deferred;
						a.push(m.createBatchOperation(j[q].BP_WorkplaceIntPersVersionRel.header, r, j[q].BP_WorkplaceIntPersVersionRel.ChangeData));
					} else if (r === "MERGE" && i === undefined) {
						var P = {};
						P["FUNCTION"] = j[q].FUNCTION;
						var B = "BP_WorkplaceIntAddressVersCollection(BP_GUID=" + c.sItemPath + ",PARTNER1=\'" + j[q].PARTNER1 + "\',PARTNER2=\'" + j[q]
							.PARTNER2 + "\',RELATIONSHIPCATEGORY=\'" + j[q].RELATIONSHIPCATEGORY + "\',ADDRESS_NUMBER=\'" + j[q].ADDRESS_NUMBER +
							"\',ADDR_VERS=\'" + j[q].ADDR_VERS + "\',VALIDUNTILDATE=datetime\'" + escape(V) + "\')";
						a.push(m.createBatchOperation(B, r, P));
						delete j[q].BP_WorkplaceIntPersVersionRel.ChangeData.__deferred;
						a.push(m.createBatchOperation(j[q].BP_WorkplaceIntPersVersionRel.header, r, j[q].BP_WorkplaceIntPersVersionRel.ChangeData));
					}
				}
			}
		},
		onSubmit: function () {
			var g = this;
			if (this.showPopup === "Y" || this.showPopup === "y") {
				sap.m.MessageBox.show(g.getView().getModel("i18n").getProperty("CONFIRMATION_MSG"), {
					icon: sap.m.MessageBox.Icon.WARNING,
					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
					title: "Warning",
					onClose: function (a) {
						if (a === "CANCEL") {
							return;
						} else {
							g._onSubmit();
						}
					}
				});
			} else {
				this._onSubmit();
			}
		},
		_onSubmit: function () {
			var t = this;
			t._busyDialog.setBusyIndicatorDelay(0);
			t._busyDialog.open();
			var m = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/MDG_EDIT_CUSTOMER", true);
			var e = {};
			e.USMD_CREQ_TYPE = this.crType;
			m.setHeaders(e);
			m.setUseBatch(true);
			var f = [];
			if (fcg.mdg.editbp.handlers.BankAccount.BankChngQueryModel.length > 0) {
				var B, v;
				var g = fcg.mdg.editbp.handlers.BankAccount.BankChngQueryModel;
				for (B = 0; B < g.length; B++) {
					v = g[B].header;
					f.push(m.createBatchOperation(v, "MERGE", g[B].body.ChangeData));
				}
			}
			if (fcg.mdg.editbp.handlers.BankAccount.BankDltQueryModel.length > 0) {
				var h, k;
				var l = fcg.mdg.editbp.handlers.BankAccount.BankDltQueryModel;
				for (h = 0; h < l.length; h++) {
					k = l[h].header;
					f.push(m.createBatchOperation(k, "DELETE"));
				}
			}
			if (fcg.mdg.editbp.handlers.BankAccount.BankQueryModel.length > 0) {
				var n, o;
				var p = fcg.mdg.editbp.handlers.BankAccount.BankQueryModel;
				for (n = 0; n < p.length; n++) {
					o = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + p[n].entity + "Rel";
					f.push(m.createBatchOperation(o, "POST", p[n].body));
				}
			}
			if (fcg.mdg.editbp.handlers.TaxNumbers.TaxDltQueryModel.length > 0) {
				var T, q;
				var r = fcg.mdg.editbp.handlers.TaxNumbers.TaxDltQueryModel;
				for (T = 0; T < r.length; T++) {
					q = r[T].header;
					f.push(m.createBatchOperation(q, "DELETE"));
				}
			}
			if (fcg.mdg.editbp.handlers.TaxNumbers.taxCreateModel.length > 0) {
				var s, u;
				var w = fcg.mdg.editbp.handlers.TaxNumbers.taxCreateModel;
				for (s = 0; s < w.length; s++) {
					u = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + w[s].entity + "Rel";
					f.push(m.createBatchOperation(u, "POST", w[s].body));
				}
			}
			if (fcg.mdg.editbp.handlers.TaxNumbers.TaxChngQueryModel.length > 0) {
				var x, y;
				var z = fcg.mdg.editbp.handlers.TaxNumbers.TaxChngQueryModel;
				for (x = 0; x < z.length; x++) {
					y = z[x].header;
					f.push(m.createBatchOperation(y, "MERGE", z[x].body));
				}
			}
			if (fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteQueryModel.length > 0) {
				var D, A;
				var E = fcg.mdg.editbp.handlers.ContactPersonChange.oCPDeleteQueryModel;
				for (D = 0; D < E.length; D++) {
					A = E[D].header;
					f.push(m.createBatchOperation(A, "DELETE"));
				}
			}
			if (fcg.mdg.editbp.handlers.Communication.oCreateModel.length > 0) {
				var N, F;
				var G = fcg.mdg.editbp.handlers.Communication.oCreateModel;
				var I = fcg.mdg.editbp.handlers.Communication.submitCreateQuery(G);
				for (N = 0; N < I.length; N++) {
					F = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/BP_AddressesRel";
					f.push(m.createBatchOperation(F, "POST", I[N].body));
				}
			}
			if (fcg.mdg.editbp.handlers.ContactPersonChange.cpQueryModel.length > 0) {
				var J = undefined;
				var K = fcg.mdg.editbp.handlers.ContactPersonChange.cpQueryModel;
				for (var L = 0; L < K.length; L++) {
					t.buildCPWPQuery(t, f, m, K, L, J);
				}
			}
			if (fcg.mdg.editbp.handlers.Communication.oDeleteModel.length > 0) {
				var O, P;
				var Q = fcg.mdg.editbp.handlers.Communication.oDeleteModel;
				for (O = 0; O < Q.length; O++) {
					P = Q[O].header;
					f.push(m.createBatchOperation(P, "DELETE"));
				}
			}
			if (fcg.mdg.editbp.handlers.Communication.oChangeModel.length > 0) {
				var N, F;
				var G = fcg.mdg.editbp.handlers.Communication.oChangeModel;
				var I = fcg.mdg.editbp.handlers.Communication.submitChangeQuery(G);
				for (N = 0; N < I.length; N++) {
					if (I[N].body === "N") {
						F = "BP_AddressCollection" + I[N].header + "/" + I[N].entity + "Rel";
						f.push(m.createBatchOperation(F, "POST", I[N].changes));
					} else if (I[N].body === "D") {
						F = I[N].entity + "Collection" + I[N].header;
						"\')/" + I[N].entity + "Rel";
						f.push(m.createBatchOperation(F, "DELETE"));
					} else {
						if (I[N].changes.length !== 0) F = G[N].entity + "Collection" + G[N].header;
						f.push(m.createBatchOperation(F, "MERGE", I[N].changes));
					}
				}
			}
			if (this.oDetailComm.BP_AddressesRel !== undefined) {
				var S = "";
				if (this.oDetailComm.BP_AddressesRel.results.length > 1) {
					for (i = 0; i < this.oDetailComm.BP_AddressesRel.results.length; i++) {
						if (this.oDetailComm.BP_AddressesRel.results[i].AD_ID === fcg.mdg.editbp.handlers.Communication.vStdAddress) {
							S = "X";
							break;
						}
					}
				}
				if ((this.oDetailComm.BP_AddressesRel.results.length > 1 && S !== "X") || (this.oDetailComm.BP_AddressesRel.results.length === 1 &&
						(fcg.mdg.editbp.handlers.Communication.vStdAddress === undefined || fcg.mdg.editbp.handlers.Communication.vStdAddress !== this.oDetailComm
							.BP_AddressesRel.results[0].AD_ID))) {
					var R = {
						STANDARDADDRESS: "X"
					};
					var F = "BP_AddressCollection(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + this.oDetailComm.BP_AddressesRel.results[0].AD_ID +
						"\')";
					f.push(m.createBatchOperation(F, "MERGE", R));
					var U = {
						ADDRESSTYPE: "XXDEFAULT"
					};
					var V = "BP_AddressCollection(BP_GUID=" + this.sItemPath + ",AD_ID=\'" + this.oDetailComm.BP_AddressesRel.results[0].AD_ID +
						"\')/BP_UsagesOfAddressRel";
					f.push(m.createBatchOperation(V, "POST", U));
				}
			}
			if (fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel.length > 0) {
				var W, X;
				var Y = fcg.mdg.editbp.handlers.ContactPerson.aCPQueryModel;
				var Z = fcg.mdg.editbp.handlers.ContactPerson.standardAddress;
				var $ = "",
					_, a1 = "";
				for (W = 0; W < Y.length; W++) {
					X = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + Y[W].entity + "sRel";
					f.push(m.createBatchOperation(X, "POST", Y[W].body));
					if (Z !== "" && Z.length > 0) {
						$ = Z[0].BP_AddressVersionsPersRel.results;
						var b1 = Y[W].body.BP_RelationContactPersonRel.BP_ContactPersonWorkplacesRel;
						if (b1 !== undefined && b1.length > 0) {
							for (var a = 0; a < b1.length; a++) {
								_ = b1[a].BP_WorkplaceIntAddressVersRel;
								if ($ !== undefined) {
									for (var b = 0; b < $.length; b++) {
										if (_ !== undefined) {
											for (var c = 0; c < _.length; c++) {
												if ($[b].ADDR_VERS === _[c].ADDR_VERS) {
													a1 = "X";
													var c1 = fcg.mdg.editbp.handlers.ContactPerson.vBPguid2;
													var d1 = "BP_PersonVersionCollection(BP_GUID=X'" + c1 + "',ADDR_VERS='" + _[c].ADDR_VERS + "',AD_ID='" + Z[0].AD_ID +
														"')";
													f.push(m.createBatchOperation(d1, "MERGE", _[c].BP_WorkplaceIntPersVersionRel));
													delete(_[c].BP_WorkplaceIntPersVersionRel);
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
			if (fcg.mdg.editbp.handlers.Identification.oIDDeleteQueryModel.length > 0) {
				var e1, f1;
				var g1 = fcg.mdg.editbp.handlers.Identification.oIDDeleteQueryModel;
				for (e1 = 0; e1 < g1.length; e1++) {
					f1 = g1[e1].header;
					f.push(m.createBatchOperation(f1, "DELETE"));
				}
			}
			if (fcg.mdg.editbp.handlers.Identification.oIDQueryModel.length > 0) {
				var h1, i1;
				var j1 = fcg.mdg.editbp.handlers.Identification.oIDQueryModel;
				for (h1 = 0; h1 < j1.length; h1++) {
					i1 = "BP_RootCollection(BP_GUID=" + this.sItemPath + ")/" + j1[h1].entity;
					f.push(m.createBatchOperation(i1, "POST", j1[h1].body));
				}
			}
			if (fcg.mdg.editbp.handlers.GeneralData.GenDataQueryModel.length > 0) {
				var k1 = [];
				var l1 = fcg.mdg.editbp.handlers.GeneralData.createSubmitQuery(fcg.mdg.editbp.handlers.GeneralData.GenDataQueryModel);
				for (var i = 0; i < l1.length; i++) {
					k1[i] = l1[i].entity + "Collection" + l1[i].header;
					f.push(m.createBatchOperation(k1[i], "MERGE", l1[i].body));
				}
			}
			if (this.oAttach.length !== 0) {
				for (var j = 0; j < this.oAttach.length; j++) {
					f.push(m.createBatchOperation("/AttachmentMasterCollection", "POST", this.oAttach[j]));
				}
			}
			if (this.vRequestReason !== "") {
				var m1 = {
					Text: this.vRequestReason
				};
				f.push(m.createBatchOperation("/NoteCollection", "POST", m1));
			}
			if (this.extHookOnSubmit() !== undefined) {
				var n1 = this.extHookOnSubmit(this, f, m);
				if (n1 != undefined) {
					f = n1;
				}
			}
			m.addBatchChangeOperations(f);
			m.submitBatch(function (o1, p1, q1) {
				t._busyDialog.close();
				var r1 = t._checkForSaveSuccessful(o1, p1, q1);
				var s1 = "";
				if (r1 === false) {
					m.refresh();
					var t1 = o1.__batchResponses;
					if (t1 && t1 instanceof Array && t1.length) {
						var u1 = t1[0].__changeResponses;
						if (u1 && u1 instanceof Array && u1.length) {
							if (u1[0].headers && u1[0].headers.cr_id) {
								var v1 = u1[0].headers.cr_id;
								s1 = v1.replace(/^[0]+/g, "");
							}
						}
					}
					var w1 = t.i18nBundle.getText("SUBMIT_SUCCESS", s1);
					sap.m.MessageBox.success(w1, {
						icon: sap.m.MessageBox.Icon.SUCCESS,
						actions: [sap.m.MessageBox.Action.OK],
						onClose: jQuery.proxy(function (x1) {
							if (x1 === "OK") {
								var y1 = 0;
								y1 = t._oNavContainer.getPages()[1].getContent().length;
								for (var i = 0; i < y1; i++) {
									if (t._oNavContainer.getPages()[1].getContent()[i].getContent()[0] !== undefined) {
										t._oNavContainer.getPages()[1].getContent()[i].getContent()[0].removeAllContent();
									}
									if (t._oNavContainer.getPages()[1].getContent()[i].getContent()[1] !== undefined) {
										t._oNavContainer.getPages()[1].getContent()[i].getContent()[1].removeAllContent();
									}
									if (t._oNavContainer.getPages()[1].getContent()[i].getContent()[2] !== undefined) {
										t._oNavContainer.getPages()[1].getContent()[i].getContent()[2].removeAllContent();
									}
								}
								fcg.mdg.editbp.util.DataAccess.setFromWizardFlag(1);
								t.returnToSearchPage();
								var z1 = sap.ui.getCore().byId("searchFilterBar");
								z1.fireEvent("search");
							}
						}, this)
					});
				}
			}, function (o1) {
				t._busyDialog.close();
				var p1 = "";
				if (o1.response && o1.response.body) {
					if (JSON.parse(o1.response.body).error.message.value) {
						p1 = JSON.parse(o1.response.body).error.message.value;
						p1 = p1.split(": ")[1];
					}
				}
				t.showErrorDialog(p1);
			});
		},
		_handleReviewToSearch: function (i) {
			var t = this;

			function a() {
				t.oWizard.goToStep(t.oWizard.getSteps()[0]);
				t._oNavContainer.detachAfterNavigate(a);
			}
			this._oNavContainer.attachAfterNavigate(a);
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},
		initializeAttachments: function () {
			fcg.mdg.editbp.handlers.Attachment.oController = this;
			var g = this;
			g.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(), "json");
			g.oFileUpload = this.requestFrag.getContent()[1].getContent()[0];
			var a = {
				dataitems: []
			};
			g.attachDataModel = new sap.ui.model.json.JSONModel(a);
			g.oFileUpload.setModel(g.attachDataModel, "json");
		},
		getXsrfToken: function () {
			var l = this;
			var t = l.getOwnerComponent().getModel().getHeaders()['x-csrf-token'];
			if (!t) {
				l.getOwnerComponent().getModel().refreshSecurityToken(function (e, o) {
					t = o.headers['x-csrf-token'];
				}, function () {
					sap.m.MessageBox.error({
						icon: sap.m.MessageBox.Icon.ERROR,
						title: this.i18nBundle.getText("TOKENMSG"),
						details: '',
					});
				}, false);
			}
			return t;
		},
		navToSelectEntity: function () {
			this.vDataLoss = this.i18nBundle.getText("NO_SELECT_LOSS");
			this.reEdit = "";
			this.clearAllData();
			this._navToEntityStep(this.getView().byId("entityStep"));
			this.vContEditTax = "X";
		},
		_navToEntityStep: function (s) {
			var t = this;

			function a() {
				t._oNavContainer.detachAfterNavigate(a);
			}
			this._oNavContainer.to(this._oWizardContentPage);
			this.oWizard.discardProgress(s);
			this.oWizard.goToStep(s);
			if (sap.ui.getCore().byId("entityRBG") !== undefined) {
				sap.ui.getCore().byId("entityRBG").setSelectedIndex(-1);
				t.oWizard.invalidateStep(this.getView().byId("entityStep"));
			}
			if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) sap.ui.getCore().byId("selectDataListRBG").setSelectedIndex(-1);
			if (this.oCommunicationListRBG !== "") {
				try {
					this.oCommunicationListRBG.destroy();
					this.oCommunicationListRBG = "";
				} catch (e) {}
			}
		},
		setGeneralActionText: function (c) {
			if (c === "2") {
				sap.ui.getCore().byId("OrgRB").setVisible(true);
				sap.ui.getCore().byId("PersRB").setVisible(false);
				sap.ui.getCore().byId("ContactPerRB").setVisible(true);
			} else {
				sap.ui.getCore().byId("PersRB").setVisible(true);
				sap.ui.getCore().byId("OrgRB").setVisible(false);
				sap.ui.getCore().byId("ContactPerRB").setVisible(false);
			}
		},
		SetAllModelEmpty: function () {
			this.oAttach = [];
			this.attachDataModel = "";
			this.changedData = "";
			this.finalQueryModel = [];
			this.sumAdd = [];
			this.requestFrag = "";
			this.clearAllData();
			this.finalChangedArray = [];
			this.changeSet = [];
		},
		onReasonChange: function (e) {
			this.vRequestReason = e.getSource().getValue();
			if (this.vRequestReason.replace(/^[ ]+|[ ]+$/g, '') === "") e.getSource().setValue("");
			this.setVisibleReviewButton();
		},
		onAttachmentChange: function () {
			this.setVisibleReviewButton();
		},
		entityPresentInReview: function (e, r) {
			var s = false;
			for (var i = 0; i < this.aEntityValue.length; i++) {
				if (this.aEntityValue[i].split("-")[0] === e && this.aEntityValue[i].split("-")[1] === r) {
					s = true;
				}
			}
			if (s) {
				s = false;
				return true;
			} else {
				return false;
			}
		},
		setVisibleReviewButton: function () {
			var s;
			var a = "";
			if (sap.ui.getCore().byId("selectDataListRBG") === undefined) {
				a = 0;
			} else {
				a = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
			}
			if (this.vCurrentEntity === "OrgRB" || this.vCurrentEntity === "PersRB") {
				this.vCurrentActionId = "changeRB";
			}
			if (this.vCurrentActionId === "changeRB") {
				switch (this.vCurrentEntity) {
				case "OrgRB":
				case "PersRB":
					s = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().PARTNER);
					if (s) this.oWizard.validateStep(this.getView().byId("requestStep"));
					break;
				case "communicationRB":
					s = this.entityPresentInReview(this.vCurrentEntity, this.oDetailComm.BP_AddressesRel.results[a].AD_ID);
					if (s) this.oWizard.validateStep(this.getView().byId("communicationStep"));
					break;
				case "BankRB":
					s = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.BankAccount.oBankRslts.BP_BankAccountsRel.results[a].BANKDETAILID);
					if (s) this.oWizard.validateStep(this.getView().byId("editStep"));
					break;
				case "ContactPerRB":
					s = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.ContactPerson.getCPModel().PARTNER2);
					if (s) this.oWizard.validateStep(this.getView().byId("editStep"));
					break;
				case "taxRB":
					s = this.entityPresentInReview(this.vCurrentEntity, fcg.mdg.editbp.handlers.TaxNumbers.oTaxResults.BP_TaxNumbersRel.results[a].TAXTYPE);
					if (s) this.oWizard.validateStep(this.getView().byId("editStep"));
					break;
				}
			}
			if (this.extHookSetVisibleReviewButton() !== undefined) {
				this.extHookSetVisibleReviewButton(this);
			}
		},
		getFileUploadData: function (v) {
			var r = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.RequestDetail', this);
			if (this.getView().byId(v).addContent !== undefined) {
				this.getView().byId(v).addContent(r);
			}
			if (this.getView().byId(v).addItem !== undefined) {
				this.getView().byId(v).addItem(r);
			}
			this.oFileUpload = r.getContent()[1].getContent()[0];
			this.oFileUpload._oList.setShowNoData(false);
			this.oFileUpload.setModel(this.attachDataModel, "json");
			this.oFileUpload.getBinding("items").refresh(true);
			this.oFileUpload.rerender();
			this.oRequestReason = r.getContent()[0].getContent()[2];
			this.oRequestReason.setValue(this.vRequestReason);
		},
		summaryofRequest: function () {
			if (this.oRequestDisplayFragment === "") {
				this.oRequestDisplayFragment = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.DisplayRequestDetail", this);
			}
			this._oNavContainer.getPages()[1].getContent()[0].setVisible(true);
			this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].setVisible(true);
			if (this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent().length === 0) {
				this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].addContent(this.oRequestDisplayFragment);
			}
			var r = this._oNavContainer.getPages()[1].getContent()[0].getContent()[0].getContent();
			var a = r[0].getContent()[0].getContent()[1].setText(this.vRequestReason);
			if (this.vRequestReason === "") {
				r[0].getContent()[0].setVisible(false);
			} else {
				r[0].getContent()[0].setVisible(true);
			}
			if (this.oAttach.length !== 0) {
				r[0].getContent()[1].setVisible(true);
				r[0].getContent()[1].getContent()[0].setVisible(true);
				var l = r[0].getContent()[1].getContent()[0];
				l.setModel(new sap.ui.model.json.JSONModel());
				l.getModel().setData(JSON.parse(JSON.stringify(this.attachDataModel.getData())));
			} else {
				r[0].getContent()[1].setVisible(false);
			}
			if (this.oAttach.length === 0 && this.vRequestReason === "") {
				r[0].getContent()[0].getToolbar().setVisible(false);
			} else {
				r[0].getContent()[0].getToolbar().setVisible(true);
			}
			this.displayDuplicateMessage(this.oDuplicatesResult, this._oNavContainer);
			if (this.extHookSummaryofRequest() !== undefined) {
				this.extHookSummaryofRequest(this);
			}
		},
		setFinOdataError: function (e, E, c) {
			this.sFinOdataError = e;
			this.sFinOdataErrorMessage = E;
			this.vCRCode = c;
		},
		displayPageTitle: function (m) {
			this.getView().byId("reviewtitle").setText("");
			var t = this.i18nBundle.getText("REVIEW") + " : " + m.getData().DESCRIPTION + "(" + m.getData().PARTNER + ")";
			this.getView().byId("reviewtitle").setText(t);
		},
		countryCPVH: function (c) {
			var g = this;
			var o = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[5].data;
			if (sap.ui.getCore().byId("CountryDialog") !== undefined) {
				sap.ui.getCore().byId("CountryDialog").destroy();
				this.oCountryValueHelp = "";
			}
			var a = new sap.m.SelectDialog({
				id: "CountryDialog",
				title: this.getView().getModel("i18n").getProperty("COUNTRIES"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/CountryValues",
					template: new sap.m.StandardListItem({
						title: "{TEXT}",
						description: "{KEY}"
					})
				},
				confirm: function (e) {
					c.setValueState("None");
					c.setValueStateText("");
					c.setValue(e.getParameters().selectedItem.getProperty("description"));
					c.fireEvent("change");
				},
				search: function (e) {
					var v = e.getParameter("value").toUpperCase();
					v = v.replace(/^[ ]+|[ ]+$/g, '');
					var f = a.getItems();
					for (var i = 0; i < f.length; i++) {
						if (v.length > 0) {
							var s = f[i].getBindingContext().getProperty("KEY");
							var h = f[i].getBindingContext().getProperty("TEXT");
							if (s.toUpperCase().indexOf(v) === -1 && h.toUpperCase().indexOf(v) === -1) {
								f[i].setVisible(false);
							} else {
								f[i].setVisible(true);
							}
						} else {
							f[i].setVisible(true);
						}
					}
				},
				liveChange: function (e) {
					var v = e.getParameter("value").toUpperCase();
					v = v.replace(/^[ ]+|[ ]+$/g, '');
					var f = a.getItems();
					for (var i = 0; i < f.length; i++) {
						if (v.length > 0) {
							var h = f[i].getBindingContext().getProperty("KEY");
							var j = f[i].getBindingContext().getProperty("TEXT");
							if (h.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
								f[i].setVisible(false);
							} else {
								f[i].setVisible(true);
							}
						} else {
							f[i].setVisible(true);
						}
					}
				}
			});
			if (o.results.length > 0) {
				a.open();
				var I = new sap.m.StandardListItem({
					title: "{TEXT}",
					description: "{KEY}",
					active: true
				});
				var b = new sap.ui.model.json.JSONModel();
				b.setData(o);
				a.setModel(b);
				a.setGrowingThreshold(o.results.length);
				a.bindAggregation("items", "/results", I);
			} else {
				a.setNoDataText(wizardController.i18nBundle.getText("NO_DATA"));
			}
			a.open();
		},
		getFieldValue: function (e) {
			if (e.getParameters().selectedItem !== undefined) {
				return e.getSource().getModel().getData().results[0].ATTR_NAME;
			} else {
				return e.getSource().mBindingInfos.value.parts[0].path.slice(1);
			}
		},
		isNull: function (v) {
			return typeof v === "undefined" || v === 'unknown' || v === null || v === 'null' || v === '' || parseInt(v) === 0;
		},
		_checkForSaveSuccessful: function (D, r, e) {
			var f = false;
			var a;
			var m = "ERROR_ON_SAVE";
			if (e && e instanceof Array && e.length) {
				f = true;
				if (e[0].response && e[0].response.body) {
					if (JSON.parse(e[0].response.body).error.message.value) {
						a = JSON.parse(e[0].response.body).error.message.value;
					} else a = "";
				}
				this.showErrorDialog(a);
			}
			return f;
		},
		showErrorDialog: function (e) {
			if (e && e.trim()) {
				var a = {};
				a.details = e;
				sap.m.MessageBox.error(a.details);
			} else {
				var f = this.i18nBundle.getText("ERROR_ON_SAVE");
				sap.m.MessageBox.error(f);
			}
		},
		getNewRecordIndex: function (e) {
			switch (e) {
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
			if (this.extHookGetNewRecordIndex() !== undefined) {
				this.extHookGetNewRecordIndex(this, e);
			}
		},
		extHookCheckEntitySelected: function (c) {},
		extHookCheckActionSelected: function (c) {},
		extHookCheckDataListSelected: function (c) {},
		extHookSetRadioButtonText: function (c) {},
		extHookGoToActionStep: function (c) {},
		extHookGoToNextActionStep: function (c) {},
		extHookGoToSelectDataStep: function (c) {},
		extWizardOnChange: function (c, e, m) {},
		extHookOnWizardComplete: function (c) {},
		extHookUndoEntityData: function (c, e) {},
		extHookSubmitButtonState: function (c) {},
		extHookOnSubmit: function (c, b, m) {},
		extHookSetVisibleReviewButton: function (c) {},
		extHookGetNewRecordIndex: function (c, e) {},
		extHookSummaryofRequest: function (c) {},
		extHookClearHandlerVariables: function (c) {},
		bpHookModifyRelQueryCall: function (q, c) {
			if (this.extHookbpHookModifyRelQueryCall) {
				var e = this.extHookbpHookModifyRelQueryCall(q, c);
				return e;
			}
		},
		bpHookReadAddressData: function (h, q, r) {
			if (this.extHookbpHookReadAddressData) {
				var e = this.extHookbpHookReadAddressData(h, q, r);
				return e;
			}
		},
		bpHookModifygetContactPersonData: function (q, r) {
			if (this.extHookbpHookModifygetContactPersonData) {
				var e = this.extHookbpHookModifygetContactPersonData(q, r);
				return e;
			}
		},
		bpHookModifygetAddressData: function (q, r) {
			if (this.extHookbpHookModifygetAddressData) {
				var e = this.extHookbpHookModifygetAddressData(q, r);
				return e;
			}
		},
		bpHookModifyCreateContactPerson: function (c) {
			if (this.extHookbpHookModifyCreateContactPerson) {
				var e = this.extHookbpHookModifyCreateContactPerson(c);
				return e;
			}
		},
		bpHookModifyLoadWPToolBar: function (c) {
			if (this.extHookbpHookModifyLoadWPToolBar) {
				var e = this.extHookbpHookModifyLoadWPToolBar(c);
				return e;
			}
		},
		bpHookModifyCPCreateModel: function (c) {
			if (this.extHookbpHookModifyCPCreateModel) {
				var e = this.extHookbpHookModifyCPCreateModel(c);
				return e;
			}
		},
		bpHookModifyCPDeleteModel: function (c) {
			if (this.extHookbpHookModifyCPDeleteModel) {
				var e = this.extHookbpHookModifyCPDeleteModel(c);
				return e;
			}
		},
		bpHookModifyCPChangeModel: function (c) {
			if (this.extHookbpHookModifyCPChangeModel) {
				var e = this.extHookbpHookModifyCPChangeModel(c);
				return e;
			}
		},
		bpHookModifygetIdentificationData: function (q, r) {
			if (this.extHookbpHookModifygetIdentificationData) {
				var e = this.extHookbpHookModifygetIdentificationData(q, r);
				return e;
			}
		},
		bpHookModifycreateIdentification: function (c) {
			if (this.extHookbpHookModifycreateIdentification) {
				var e = this.extHookbpHookModifycreateIdentification(c);
				return e;
			}
		},
		bpHookModifyIDDeleteModel: function (c) {
			if (this.extHookbpHookModifyIDDeleteModel) {
				var e = this.extHookbpHookModifyIDDeleteModel(c);
				return e;
			}
		},
		bpHookModifyIDCreateModel: function (c) {
			if (this.extHookbpHookModifyIDCreateModel) {
				var e = this.extHookbpHookModifyIDCreateModel(c);
				return e;
			}
		},
		bpHookModifyBankAccounts: function (q, r, b) {
			if (this.extHookbpHookModifyBankAccounts) {
				var e = this.extHookbpHookModifyBankAccounts(q, r, b);
				return e;
			}
		},
		bpHookModifyBanklayout: function (c, b) {
			if (this.extHookbpHookModifyBanklayout) {
				var e = this.extHookbpHookModifyBanklayout(c, b);
				return e;
			}
		},
		bpHookModifyBankCreateModel: function (c, b) {
			if (this.extHookbpHookModifyBankCreateModel) {
				var e = this.extHookbpHookModifyBankCreateModel(c, b);
				return e;
			}
		},
		bpHookModifyBankChangeModel: function (c, b) {
			if (this.extHookbpHookModifyBankChangeModel) {
				var e = this.extHookbpHookModifyBankChangeModel(c, b);
				return e;
			}
		},
		bpHookModifyBankDeleteModel: function (c, b) {
			if (this.extHookbpHookModifyBankDeleteModel) {
				var e = this.extHookbpHookModifyBankDeleteModel(c, b);
				return e;
			}
		},
		bpHookModifyBankUndoChanges: function (q, m, c, b) {
			if (this.extHookbpHookModifyBankUndoChanges) {
				var e = this.extHookbpHookModifyBankUndoChanges(q, m, c, b);
				return e;
			}
		},
		bpHookModifyBankCountryValueHelp: function (p, c, o, a, b) {
			if (this.extHookbpHookModifyBankCountryValueHelp) {
				var e = this.extHookbpHookModifyBankCountryValueHelp(p, c, o, a, b);
				return e;
			}
		},
		bpHookModifyBankKeyValueHelp: function (p, c, s, o, b) {
			if (this.extHookbpHookModifyBankKeyValueHelp) {
				var e = this.extHookbpHookModifyBankKeyValueHelp(p, c, s, o, b);
				return e;
			}
		},
		bpHookModifyBankDeriveIban: function (p, c, q, o, b) {
			if (this.extHookbpHookModifyBankDeriveIban) {
				var e = this.extHookbpHookModifyBankDeriveIban(p, c, q, o, b);
				return e;
			}
		},
		bpHookOnChangeOfAddress: function (h, w) {
			if (this.extHookbpHookOnChangeOfAddress) {
				this.extHookbpHookOnChangeOfAddress(h, w);
			}
		},
		bpHookOnCreateOfAddress: function (h, w) {
			if (this.extHookbpHookOnCreateOfAddress) {
				this.extHookbpHookOnCreateOfAddress(h, w);
			}
		},
		bpHookCreateAddressDescrText: function (h, a) {
			if (this.extHookbpHookCreateAddressDescrText) {
				var e = this.extHookbpHookCreateAddressDescrText(h, a);
				return e;
			}
		},
		bpHookReadGenData: function (h, q, D) {
			if (this.extHookbpHookReadGenData) {
				var e = this.extHookbpHookReadGenData(h, q, D);
				return extModifiedGenData;
			}
		},
		bpHookGeneralVH: function (h) {
			if (this.extHookbpHookGeneralVH) {
				var e = this.extHookbpHookGeneralVH(h);
				return e;
			}
		},
		bpHookGenCreateSubmitQuery: function (g) {
			if (this.extHookbpHookGenCreateSubmitQuery) {
				var e = this.extHookbpHookGenCreateSubmitQuery(g);
				return e;
			}
		},
		bpHookSetDeepEntityCount: function (h, r, i) {
			if (this.extHookbpHookSetDeepEntityCount) {
				this.extHookbpHookSetDeepEntityCount(h, r, i);
			}
		},
		bpHookSetSelectRecordLayout: function (h, r, s) {
			if (this.extHookbpHookSetSelectRecordLayout) {
				var e = this.extHookbpHookSetSelectRecordLayout(h, r, s);
				return e;
			}
		},
		bpHookAddressModelHandling: function (h, a, A) {
			if (this.extHookbpHookAddressModelHandling) {
				var e = this.extHookbpHookAddressModelHandling(h, a, A);
				return e;
			}
		},
		bpHookReadTaxData: function (h, q, r) {
			if (this.extHookbpHookReadTaxData) {
				var e = this.extHookbpHookReadTaxData(h, q, r);
				return e;
			}
		},
		bpHookCreateTaxData: function (h, m) {
			if (this.extHookbpHookCreateTaxData) {
				var e = this.extHookbpHookCreateTaxData(h, m);
				return e;
			}
		},
		bpHookChangeTaxData: function (h, q, D) {
			if (this.extHookbpHookChangeTaxData) {
				var e = this.extHookbpHookChangeTaxData(h, q, D);
				return e;
			}
		},
		bpHookDeleteTaxData: function (h, m) {
			if (this.extHookbpHookDeleteTaxData) {
				var e = this.extHookbpHookDeleteTaxData(h, m);
				return e;
			}
		},
		bpHookAddressSubmitChangeQuery: function (h, q) {
			if (this.extHookbpHookAddressSubmitChangeQuery) {
				var e = this.extHookbpHookAddressSubmitChangeQuery(h, q);
				return e;
			}
		},
		bpHookAddressSubmitCreateQuery: function (h, q) {
			if (this.extHookbpHookAddressSubmitCreateeQuery) {
				var e = this.extHookbpHookAddressSubmitCreateeQuery(h, q);
				return e;
			}
		},
		bpHookReadCommunicationData: function (h, q) {
			if (this.extHookbpHookReadCommunicationData) {
				var e = this.extHookbpHookReadCommunicationData(h, queryCrtModel);
				return e;
			}
		},
		bpHookDisplayIAV: function (h, w, m) {
			if (this.extHookbpHookDisplayIAV) {
				this.extHookbpHookDisplayIAV(h, w, m);
			}
		},
		bpHooksetDispAddressTitle: function (h, w, a) {
			if (this.extHookbpHooksetDispAddressTitle) {
				this.extHookbpHooksetDispAddressTitle(h, w, a);
			}
		},
		bpHookAddNewTelAddress: function (h, w, a) {
			if (this.extHookbpHookAddNewTelAddress) {
				this.extHookbpHookAddNewTelAddress(h, w, a);
			}
		},
		bpHookAddNewMobAddress: function (h, w, a) {
			if (this.extHookbpHookAddNewMobAddress) {
				this.extHookbpHookAddNewMobAddress(h, w, a);
			}
		},
		bpHookAddNewFaxAddress: function (h, w, a) {
			if (this.extHookbpHookAddNewFaxAddress) {
				this.extHookbpHookAddNewFaxAddress(h, w, a);
			}
		},
		bpHookAddNewEmailAddress: function (h, w, a) {
			if (this.extHookbpHookAddNewEmailAddress) {
				this.extHookbpHookAddNewEmailAddress(h, w, a);
			}
		},
		bpHookAddNewURIAddress: function (h, w, a) {
			if (this.extHookbpHookAddNewURIAddress) {
				this.extHookbpHookAddNewURIAddress(h, w, a);
			}
		},
		bpHookAddNewIAVAddress: function (h, w, n) {
			if (this.extHookbpHookAddNewIAVAddress) {
				this.extHookbpHookAddNewIAVAddress(h, w, n);
			}
		},
		bpHookDisplayWPAddress: function (m, c, w, h, f) {
			if (this.extHookbpHookDisplayWPAddress) {
				this.extHookbpHookDisplayWPAddress(m, c, w, h, f);
			}
		},
		bpHookDisplayWPAddressCP: function (m, c, w, h, f, i) {
			if (this.extHookbpHookDisplayWPAddressCP) {
				this.extHookbpHookDisplayWPAddressCP(m, c, w, h, f, i);
			}
		},
		bpHookAddNewWPAddress: function (h, f) {
			if (this.extHookbpHookAddNewWPAddress) {
				this.extHookbpHookAddNewWPAddress(h, f);
			}
		},
		bpHookSetEnabledWPFields: function (h, w) {
			if (this.extHookbpHookSetEnabledWPFields) {
				this.extHookbpHookSetEnabledWPFields(h, w);
			}
		},
		bpHookAddNewWPAddressCP: function (h, f, n) {
			if (this.extHookbpHookAddNewWPAddressCP) {
				this.extHookbpHookAddNewWPAddressCP(h, f, n);
			}
		},
		bpHookDisplayCommunicationAddress: function (w, m, v, a, t, h, f, b, i) {
			if (this.extHookbpHookDisplayCommunicationAddress) {
				this.extHookbpHookDisplayCommunicationAddress(w, m, v, a, t, h, f, b, i);
			}
		}
	});
});