/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/mvc/Controller"], function (C) {
	"use strict";
	jQuery.sap.require("fcg.mdg.editbp.util.Formatter");
	jQuery.sap.require("fcg.mdg.editbp.util.DataAccess");
	return C.extend("fcg.mdg.editbp.controller.Search", {
		vSearchFragmnt: "",
		i18nBundle: "",
		vSearchType: "",
		vInitialFlag: "",
		extHookbpModifySearchResultsOnInit: null,
		extHookbpModifySearchTblPersonalization: null,
		extHookbpModifySearchTblBindingComplete: null,
		extHookbpModifySearchTblBindinglessrecord: null,
		extHookbpModifyhandleitemPressed: null,
		extHookbpModifyopenRequestApp: null,
		onInit: function () {
			var v = this.setInitialFlag(this.vInitialFlag);
			this.vSearchType = "";
			var c = sap.ui.core.Component.getOwnerIdFor(this.getView());
			var m = sap.ui.component(c);
			if (m && m.getComponentData() && m.getComponentData().startupParameters) {
				if (m.getComponentData().startupParameters.SEARCH_MODE !== undefined) {
					this.vSearchType = m.getComponentData().startupParameters.SEARCH_MODE[0];
				}
			}
			this.i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			fcg.mdg.editbp.util.DataAccess.seti18nModel(this.i18nBundle);
			var a = {};
			a.SEARCH_MODE = this.vSearchType;
			var M = this.getOwnerComponent().getModel();
			M.setHeaders(a);
			M.setUseBatch(true);
			this.getOwnerComponent().setModel(M);
			if (this.vSearchFragmnt === "") {
				this.vSearchFragmnt = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.search", this);
			} else {
				this.vSearchFragmnt.destroy();
				this.vSearchFragmnt = sap.ui.xmlfragment("fcg.mdg.editbp.frag.generic.search", this);
			}
			this.getView().byId("SearchPage").removeAllContent();
			this.getView().byId("SearchPage").addContent(this.vSearchFragmnt);
			var f = sap.ui.getCore().byId("searchFilterBar");
			var r = sap.ui.getCore().byId("searchRsltTbl");
			var d = sap.ui.getCore().byId("defaultRsltTbl");
			if (f !== undefined && f.getControlConfiguration()[0] !== undefined) {
				f.getControlConfiguration()[0].setLabel(this.i18nBundle.getText("Customer_ID"));
			}
			if (this.vSearchType === "DB") {
				if (f !== undefined) {
					f.setEnableBasicSearch(false);
					f.setFilterBarExpanded(true);
				}
				this.setFilterLabel(f, this.i18nBundle.getText("DB_Name1"), this.i18nBundle.getText("DB_Name2"));
			} else if (this.vSearchType === "HA") {
				this.setFilterLabel(f, this.i18nBundle.getText("DB_Name1"), this.i18nBundle.getText("DB_Name2"));
			} else if (this.vSearchType === "ES") {
				this.setFilterLabel(f, this.i18nBundle.getText("FrstName"), this.i18nBundle.getText("ScndName"));
			}
			if (r !== undefined) {
				r.setHeader(this.i18nBundle.getText("CUSTOMERS"));
			}
			if (d !== undefined) {
				d.getColumns()[1].getHeader().setText(this.i18nBundle.getText("CUSTOMER"));
			}
			fcg.mdg.editbp.util.DataAccess.getValueHelpData();
			if (this.extHookbpModifySearchResultsOnInit) {
				this.extHookbpModifySearchResultsOnInit(this, M);
			}
		},
		getPersonalization: function () {
			var r = sap.ui.getCore().byId("searchRsltTbl");
			r.getCustomToolbar().getContent()[3].setType("Transparent");
			if (this.extHookbpModifySearchTblPersonalization) {
				this.extHookbpModifySearchTblPersonalization(this);
			}
		},
		setFilterLabel: function (f, n, N) {
			if (f !== undefined) {
				if (f.getControlConfiguration()[6] !== undefined) {
					f.getControlConfiguration()[6].setLabel(n);
				}
				if (f.getControlConfiguration()[7] !== undefined) {
					f.getControlConfiguration()[7].setLabel(N);
				}
			}
		},
		onAfterRendering: function () {
			sap.ui.getCore().byId("searchRsltTbl").setIgnoreFromPersonalisation("PARTNER_GUID,CATEGORY");
		},
		onCountryChange: function (e) {},
		onBindingComplete: function (e) {
			var c = e.getParameters().getParameters().data.__count;
			if (c !== "0" && c !== undefined && c !== null && c !== "") {
				sap.ui.getCore().byId("moreRecordsMsg").setVisible(true);
				if (this.extHookbpModifySearchTblBindingComplete) {
					this.extHookbpModifySearchTblBindingComplete(this, dialog);
				}
				return;
			}
			sap.ui.getCore().byId("moreRecordsMsg").setVisible(false);
			if (this.extHookbpModifySearchTblBindinglessrecord) {
				this.extHookbpModifySearchTblBindinglessrecord(this);
			}
		},
		handleItemPressed: function (e) {
			var t = sap.ui.getCore().byId("defaultRsltTbl");
			var r = t.indexOfItem(e.getSource());
			fcg.mdg.editbp.util.DataAccess.setSelectedRecord(r);
			var c = e.getSource().getBindingContext().getProperty("CREQUEST");
			c = c.replace(/^0+/, '');
			var a = [c];
			var b = e.getSource().getBindingContext().getProperty("PARTNER");
			if (c !== "") {
				var m = this.i18nBundle.getText("MSG1", a);
				var d = new sap.m.Dialog({
					title: this.i18nBundle.getText("WARNING"),
					type: 'Message',
					state: 'Warning',
					content: [new sap.m.Text({
						text: m
					})],
					beginButton: new sap.m.Button({
						text: this.i18nBundle.getText("OK"),
						press: function () {
							d.close();
						}
					}),
					afterClose: function () {
						d.destroy();
					}
				});
				d.open();
				return;
			}
			if (this.extHookbpModifyhandleitemPressed) {
				this.extHookbpModifyhandleitemPressed(e, this);
			}
			this.getRouter().navTo("wizard", {
				cateogory: e.getSource().getBindingContext().getProperty("TYPE"),
				selectedItem: e.getSource().getBindingContext().getPath().substr(1),
				customerID: b,
				RowId: r
			}, true);
		},
		getRouter: function () {
			var t = this;
			return sap.ui.core.UIComponent.getRouterFor(t);
		},
		setInitialFlag: function (i) {
			return i;
		},
		openRequestApp: function (e) {
			if (this.extHookbpModifyopenRequestApp) {
				this.extHookbpModifyopenRequestApp(e, this);
			}
			var h = (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({
				target: {
					semanticObject: "Customer",
					action: "requestCustomer"
				},
				params: {
					"MAXDUPREC": "20",
					"CATEGORY": "",
					"USMD_CREQ_TYPE": "CUF1P1"
				}
			})) || "";
			var c = sap.ushell.Container.getService("CrossApplicationNavigation");
			c.hrefForExternal({
				target: {
					semanticObject: "Customer",
					action: "requestCustomer"
				},
				params: {
					"MAXDUPREC": "20",
					"CATEGORY": "",
					"USMD_CREQ_TYPE": "CUF1P1"
				}
			});
			c.toExternal({
				target: {
					semanticObject: "Customer",
					action: "requestCustomer"
				},
				params: {
					"MAXDUPREC": "20",
					"CATEGORY": "",
					"USMD_CREQ_TYPE": "CUF1P1"
				}
			});
		}
	});
});