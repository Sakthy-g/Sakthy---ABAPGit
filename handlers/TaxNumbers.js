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
	oTaxChangeArray: [],
	oTaxDelArray: [],
	vRIndex: "",
	vDelResetFlag: "",
	vvDelTaxNum: "",
	clearGlobalVariables: function (w) {
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
	getTaxNumData: function (w) {
		this.oController = w;
		var p = "/BP_RootCollection(BP_GUID=" + this.oController.sItemPath + ")?$expand=";
		var q = p + "BP_TaxNumbersRel";
		var r = fcg.mdg.editbp.util.DataAccess.readData(q, w);
		fcg.mdg.editbp.util.DataAccess.setTNResults(r);
		if (w.vContEditTax === "" || this.oTaxResults === "") {
			this.oTaxResults = "";
			this.oTaxChangeArray.length = 0;
			this.oTaxDelArray.length = 0;
			this.oTaxResults = r;
			var c = "";
			var d = "";
			for (var i = 0; i < this.oTaxResults.BP_TaxNumbersRel.results.length; i++) {
				c = {};
				c.RINDEX = null;
				c.index = i;
				c.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
				c.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
				c.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
				c.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;
				d = {};
				d.RINDEX = null;
				d.index = i;
				d.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
				d.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
				d.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
				d.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;
				this.oTaxChangeArray.push(c);
				this.oTaxDelArray.push(d);
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
		var e = this.oController.bpHookReadTaxData(this, q, r);
		if (e !== undefined) {
			r = e;
		}
	},
	setActionLayout: function (r) {
		this.oController.getView().byId("entityStep").setNextStep(this.oController.getView().byId("actionStep"));
		if (this.oController.oActionLayout === "") {
			this.oController.oActionLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectAction', this.oController);
		}
		this.oController.getView().byId("actionLayout").setVisible(true);
		this.oController.getView().byId("actionLayout").addContent(this.oController.oActionLayout);
		sap.ui.getCore().byId("changeRB").setVisible(true);
		this.oController.setRadioButtonText();
		if (r.BP_TaxNumbersRel.results.length === 0) {
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
	createTaxNumber: function (c) {
		c.getView().byId("actionStep").setNextStep(c.getView().byId("editStep"));
		if (c.oCommunicationLayout !== "" && c.oCommunicationLayout !== undefined) {
			try {
				c.oCommunicationLayout.destroy();
			} catch (e) {}
			c.oCommunicationLayout = "";
		}
		if (c.oCommunicationListRBG !== "" && c.oCommunicationListRBG !== undefined) {
			try {
				c.oCommunicationListRBG.destroy();
			} catch (e) {}
			c.oCommunicationListRBG = "";
		}
		if (c.oCommunicationLayout === "") {
			c.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', c);
		}
		c.getView().byId("editLayout").removeAllContent();
		c.getFileUploadData("editLayout");
		c.getView().byId("editLayout").addContent(c.oCommunicationLayout);
		if (c.reEdit === "X") {
			sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setValue(this.taxCreateModel[c.vTaxEntityIndex].body["TAXTYPE"]);
			sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").setValue(this.taxCreateModel[c.vTaxEntityIndex].TAXTYPE__TXT);
			if (this.taxCreateModel[c.vTaxEntityIndex].body["TAXNUMXL"] !== undefined) {
				sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(this.taxCreateModel[c.vTaxEntityIndex].body["TAXNUMXL"]);
			} else {
				sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(this.taxCreateModel[c.vTaxEntityIndex].body["TAXNUMBER"]);
			}
		}
	},
	createTNModel: function (t, w) {
		var m = new Object();
		m.TAXTYPE = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
		m.TAXTYPE__TXT = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
		var a = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
		var b = a.length;
		if (b <= 20) {
			m.TAXNUMBER = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
		} else {
			m.TAXNUMXL = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
		}
		var q = {};
		q.entity = "BP_TaxNumbers";
		q.TAXTYPE__TXT = m.TAXTYPE__TXT;
		q.body = {};
		q.body["TAXTYPE"] = m.TAXTYPE;
		if (b <= 20) {
			q.body["TAXNUMBER"] = m.TAXNUMBER;
		} else if (b > 20) {
			q.body["TAXNUMXL"] = m.TAXNUMXL;
		}
		if (w.reEdit === "X") {
			this.taxCreateModel.splice(w.vTaxEntityIndex, 1, q);
		} else {
			this.taxCreateModel.push(q);
		}
		var d = {};
		d.entity = "BP_TaxNumbers";
		d.body = {};
		d.body["TAXTYPE"] = m.TAXTYPE;
		if (b <= 20) {
			d.body["TAXNUMBER"] = m.TAXNUMBER;
		} else {
			d.body["TAXNUMBER"] = m.TAXNUMXL;
		}
		d.body["TAXDESC"] = m.TAXTYPE__TXT;
		this.oTaxModel = new sap.ui.model.json.JSONModel();
		this.oTaxModel.setData(d.body);
		var e = w.bpHookCreateTaxData(this, m);
		if (e !== undefined) {
			m = e;
		}
		this.taxnummodel = m;
		return m;
	},
	editTaxNum: function (c) {
		var f = "";
		var v = "";
		var m = new sap.ui.model.json.JSONModel();
		this.oController = c;
		if (c.oCommunicationLayout !== "" && c.oCommunicationLayout !== undefined) {
			try {
				c.oCommunicationLayout.destroy();
			} catch (e) {}
			c.oCommunicationLayout = "";
		}
		if (c.oCommunicationLayout === "") {
			c.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', c);
		}
		if (c.oCommunicationListRBG !== "" && c.oCommunicationListRBG !== undefined) {
			try {
				c.oCommunicationListRBG.destroy();
			} catch (e) {}
			c.oCommunicationListRBG = "";
		}
		if (c.oCommunicationListRBG === "") {
			c.oCommunicationListRBG = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntityInstance', c);
		}
		if (this.oTaxChangeArray.length === 1) {
			c.getView().byId("actionStep").setNextStep(c.getView().byId("editStep"));
			c.getView().byId("editLayout").setVisible(true);
			c.getView().byId("editLayout").removeAllContent();
			c.getFileUploadData("editLayout");
			c.getView().byId("editLayout").addContent(c.oCommunicationLayout);
			f = sap.ui.getCore().byId("editTaxForm");
			m.setData(this.oTaxChangeArray[0]);
			f.setModel(m);
			c.currentDataModel = m;
			if (c.vContEditTax === "") {
				if (this.oTaxChangeArray[0].TAXNUMBER !== "") {
					v = this.oTaxChangeArray[0].TAXNUMBER;
				} else {
					v = this.oTaxChangeArray[0].TAXNUMXL;
				}
			} else if (c.vContEditTax === "X") {
				if (this.oTaxChangeArray[0].TAXNUMBER !== "") {
					v = this.oTaxChangeArray[0].TAXNUMBER;
				} else {
					v = this.oTaxChangeArray[0].TAXNUMXL;
				}
			}
			sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(v);
			sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setShowValueHelp(false);
			sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setEnabled(false);
			c.currentDataModel = m;
			var t = sap.ui.getCore().byId("selectDataListRBG");
			t.setSelectedIndex(0);
		} else {
			var s = {
				dataitems: []
			};
			c.getView().byId("actionStep").setNextStep(c.getView().byId("selectEntityInstanceStep"));
			c.getView().byId("selectEntityInstanceLayout").setVisible(true);
			c.getView().byId("selectEntityInstanceLayout").addContent(c.oCommunicationListRBG);
			for (var i = 0; i < this.oTaxChangeArray.length; i++) {
				var T = this.oTaxChangeArray[i];
				var d = {
					"RBText": fcg.mdg.editbp.util.Formatter.createTaxRecordsToProcess(T)
				};
				s.dataitems.push(d);
			}
			var o = sap.ui.getCore().byId("selectDataListRBG");
			m.setData(s);
			o.setModel(m);
			o.setSelectedIndex(-1);
		}
	},
	editmultiTaxNumber: function (c) {
		var v = "";
		if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
			var s = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
		}
		this.oController = c;
		var m = new sap.ui.model.json.JSONModel();
		if (c.oCommunicationLayout !== "" && c.oCommunicationLayout !== undefined) {
			try {
				c.oCommunicationLayout.destroy();
			} catch (e) {}
			c.oCommunicationLayout = "";
		}
		if (c.oCommunicationLayout === "") {
			c.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', c);
		}
		c.getView().byId("selectEntityInstanceStep").setNextStep(c.getView().byId("editStep"));
		c.getView().byId("editLayout").setVisible(true);
		c.getView().byId("editLayout").removeAllContent();
		c.getFileUploadData("editLayout");
		c.getView().byId("editLayout").addContent(c.oCommunicationLayout);
		var f = sap.ui.getCore().byId("editTaxForm");
		m.setData(this.oTaxChangeArray[s]);
		f.setModel(m);
		c.currentDataModel = m;
		if (this.oTaxChangeArray[s].TAXNUMBER !== "") {
			v = this.oTaxChangeArray[s].TAXNUMBER;
		} else {
			v = this.oTaxChangeArray[s].TAXNUMXL;
		}
		sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(v);
		sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setShowValueHelp(false);
		sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setEnabled(false);
		c.currentDataModel = m;
	},
	singleTaxRecordChangeModel: function (c) {
		var t = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
		var a = t.length;
		var q = {};
		q.header = "BP_TaxNumberCollection(BP_GUID=" + c.sItemPath + ",TAXTYPE='" + this.oTaxChangeArray[0].TAXTYPE + "')";
		q.index = this.oTaxChangeArray[0].index;
		q.body = {};
		if (a <= 20) {
			q.body["TAXNUMBER"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
			q.body["TAXNUMXL"] = "";
		} else if (a > 20) {
			q.body["TAXNUMXL"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
			q.body["TAXNUMBER"] = "";
		}
		var d = {};
		d.entity = "BP_TaxNumbers";
		d.body = {};
		d.body["TAXTYPE"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
		if (a <= 20) {
			d.body["TAXNUMBER"] = q.body["TAXNUMBER"];
		} else if (a > 20) {
			d.body["TAXNUMBER"] = q.body["TAXNUMXL"];
		}
		d.body["changeData"] = {};
		d.body.changeData["TAXNUMBER"] = q.body["TAXNUMBER"];
		d.body["TAXDESC"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
		this.oChangeTaxModel = new sap.ui.model.json.JSONModel();
		this.oChangeTaxModel.setData(d.body);
		if (a <= 20) {
			this.oTaxChangeArray[0].TAXNUMBER = q.body["TAXNUMBER"];
			this.oTaxChangeArray[0].TAXNUMXL = "";
		} else if (a > 20) {
			this.oTaxChangeArray[0].TAXNUMXL = q.body["TAXNUMXL"];
			this.oTaxChangeArray[0].TAXNUMBER = "";
		}
		var r = "";
		r = c._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent().length;
		if (c.vContEditTax === "") {
			if (this.oTaxChangeArray[0].RINDEX === null) {
				this.oTaxChangeArray[0].RINDEX = r;
			} else {
				r = this.oTaxChangeArray[0].RINDEX;
			}
			if (c.reEdit === "X") {
				if (a <= 20) {
					this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMBER"] = q.body["TAXNUMBER"];
					this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMXL"] = "";
				} else if (a > 20) {
					this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMBER"] = "";
					this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMXL"] = q.body["TAXNUMXL"];
				}
			} else {
				this.TaxChngQueryModel.push(q);
			}
			this.oChangeTaxModel.setData(d.body);
		} else if (c.vContEditTax === "X") {
			this.vRIndex = "";
			if (this.oTaxChangeArray[0].RINDEX !== null && this.oTaxChangeArray[0].RINDEX !== "" && this.oTaxChangeArray[0].RINDEX !== undefined) {
				if (c._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[this.oTaxChangeArray[0].RINDEX] !== undefined) {
					this.vRIndex = this.oTaxChangeArray[0].RINDEX;
					this.TaxChngQueryModel.splice(0, 1);
				}
			} else {
				this.oTaxChangeArray[0].RINDEX = r;
			}
			var e = c.bpHookChangeTaxData(this, q, d);
			if (e !== undefined) {
				q = e.queryModel;
				d = e.oDataModel;
			}
			this.TaxChngQueryModel.push(q);
			this.oChangeTaxModel.setData(d.body);
		}
	},
	multiTaxRecordChangeModel: function (c) {
		if (c.reEdit === "") {
			this.handleChangeModelNoReEdit(c);
		} else if (c.reEdit === "X") {
			this.handleChangeModelReEdit(c);
		}
	},
	handleChangeModelNoReEdit: function (c) {
		var t = 0;
		var r = "";
		if (sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum") !== undefined) {
			var a = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
			t = a.length;
		}
		if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
			var s = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
		}
		r = c._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent().length;
		this.oTaxChangeArray[s].TAXNUMBER = (t <= 20) ? sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue() : "";
		this.oTaxChangeArray[s].TAXNUMXL = (t <= 20) ? "" : sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
		if (this.oTaxChangeArray[s].RINDEX === null) {
			this.oTaxChangeArray[s].RINDEX = r;
		} else {
			r = this.oTaxChangeArray[s].RINDEX;
		}
		var q = {};
		q.header = "BP_TaxNumberCollection(BP_GUID=" + c.sItemPath + ",TAXTYPE='" + this.oTaxChangeArray[s].TAXTYPE + "')";
		q.index = this.oTaxChangeArray[s].index;
		q.body = {};
		q.body["TAXNUMBER"] = (t <= 20) ? sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue() : "";
		q.body["TAXNUMXL"] = (t <= 20) ? "" : sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
		var d = {};
		d.body = {};
		d.body["TAXTYPE"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
		d.body["TAXNUMBER"] = (t <= 20) ? q.body["TAXNUMBER"] : q.body["TAXNUMXL"];
		d.body["changeData"] = {};
		d.body.changeData["TAXNUMBER"] = (t <= 20) ? q.body["TAXNUMBER"] : q.body["TAXNUMXL"];
		d.body["TAXDESC"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
		this.oChangeTaxModel = new sap.ui.model.json.JSONModel();
		var e = c.bpHookChangeTaxData(this, q, d);
		if (e !== undefined) {
			q = e.queryModel;
			d = e.oDataModel;
		}
		this.oChangeTaxModel.setData(d.body);
		if (c.vContEditTax === "X") {
			this.vRIndex = "";
			if (c._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[r] !== undefined) {
				this.vRIndex = this.oTaxChangeArray[s].RINDEX;
			}
		}
		if (this.vRIndex === "") {
			this.TaxChngQueryModel.push(q);
		} else {
			this.TaxChngQueryModel[this.vRIndex].body["TAXNUMBER"] = (t <= 20) ? q.body["TAXNUMBER"] : "";
			this.TaxChngQueryModel[this.vRIndex].body["TAXNUMXL"] = (t <= 20) ? "" : q.body["TAXNUMXL"];
		}
	},
	handleChangeModelReEdit: function (c) {
		var I = "";
		var t = 0;
		if (sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum") !== undefined) {
			var a = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
			t = a.length;
		}
		for (var i = 0; i < this.oTaxChangeArray.length; i++) {
			if (this.oTaxChangeArray[i].RINDEX === c.vTaxEntityIndex) {
				I = i;
				if (t <= 20) {
					this.oTaxChangeArray[i].TAXNUMBER = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
					this.oTaxChangeArray[i].TAXNUMXL = "";
				} else if (t > 20) {
					this.oTaxChangeArray[i].TAXNUMXL = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
					this.oTaxChangeArray[i].TAXNUMBER = "";
				}
			}
		}
		var q = {};
		q.header = "BP_TaxNumberCollection(BP_GUID=" + c.sItemPath + ",TAXTYPE='" + this.oTaxChangeArray[I].TAXTYPE + "')";
		q.body = {};
		if (t <= 20) {
			q.body["TAXNUMBER"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
			q.body["TAXNUMXL"] = "";
		} else if (t > 20) {
			q.body["TAXNUMBER"] = "";
			q.body["TAXNUMXL"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").getValue();
		}
		var d = {};
		d.body = {};
		d.body["TAXTYPE"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").getValue();
		if (t <= 20) {
			d.body["TAXNUMBER"] = q.body["TAXNUMBER"];
		} else if (t > 20) {
			d.body["TAXNUMBER"] = q.body["TAXNUMXL"];
		}
		d.body["TAXDESC"] = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm").getValue();
		this.oChangeTaxModel = new sap.ui.model.json.JSONModel();
		this.oChangeTaxModel.setData(d.body);
		if (t <= 20) {
			this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMBER"] = q.body["TAXNUMBER"];
			this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMXL"] = "";
		} else if (t > 20) {
			this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMXL"] = q.body["TAXNUMXL"];
			this.TaxChngQueryModel[c.vTaxEntityIndex].body["TAXNUMBER"] = "";
		}
	},
	changeModel: function (c) {
		if (this.oTaxChangeArray.length === 1) {
			this.singleTaxRecordChangeModel(c);
		} else {
			this.multiTaxRecordChangeModel(c);
		}
	},
	deleteTaxNum: function (w) {
		if (this.oTaxDelArray.length === 0) {
			w.oWizard.discardProgress(w.oWizard.getSteps()[0]);
			w._oNavContainer.to(w._oWizardContentPage);
		}
		if (this.oTaxDelArray.length > 0) {
			this.setSelectTaxRecord(w);
		}
	},
	setSelectTaxRecord: function (c) {
		var m = new sap.ui.model.json.JSONModel();
		var s = {
			dataitems: []
		};
		if (c.vCurrentActionId === "deleteRB") {
			c.getView().byId("actionStep").setNextStep(c.getView().byId("editStep"));
		}
		if (c.oCommunicationListRBG !== "" && c.oCommunicationListRBG !== undefined) {
			try {
				c.oCommunicationListRBG.destroy();
			} catch (e) {}
			c.oCommunicationListRBG = "";
		}
		if (c.oCommunicationListRBG === "") {
			c.oCommunicationListRBG = sap.ui.xmlfragment('fcg.mdg.editbp.frag.generic.SelectEntityInstance', c);
		}
		if (c.vCurrentActionId === "deleteRB") {
			c.getView().byId("editLayout").setVisible(true);
			if (c.getView().byId("editLayout").getContent().length > 0) {
				c.getView().byId("editLayout").removeAllContent();
			}
			c.getView().byId("editLayout").addContent(c.oCommunicationListRBG);
		}
		for (var i = 0; i < this.oTaxDelArray.length; i++) {
			var t = this.oTaxDelArray[i];
			var d = {
				"RBText": fcg.mdg.editbp.util.Formatter.createTaxRecordsToProcess(t)
			};
			s.dataitems.push(d);
		}
		var T = sap.ui.getCore().byId("selectDataListRBG");
		m.setData(s);
		T.setModel(m);
		T.setSelectedIndex(-1);
	},
	deleteModel: function (c) {
		var d = {};
		if (sap.ui.getCore().byId("selectDataListRBG") !== undefined) {
			var s = sap.ui.getCore().byId("selectDataListRBG").getSelectedIndex();
		}
		d.body = this.oTaxDelArray[s];
		if (this.oTaxDelArray[s].TAXNUMBER === "") {
			d.body.TAXNUMBER = this.oTaxDelArray[s].TAXNUMXL;
		} else if (this.oTaxDelArray[s].TAXNUMXL === "") {
			d.body.TAXNUMBER = this.oTaxDelArray[s].TAXNUMBER;
		}
		d.header = "BP_TaxNumberCollection(BP_GUID=" + c.sItemPath + ",TAXTYPE='" + d.body.TAXTYPE + "')";
		d.index = this.oTaxDelArray[s].index;
		for (var i = 0; i < this.oTaxChangeArray.length; i++) {
			if (this.oTaxChangeArray[i].index === d.index) {
				var D = this.oTaxChangeArray[s].RINDEX;
				if (c._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[D] !== undefined) {
					c._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[D].getToolbar().destroy();
					c._oNavContainer.getPages()[1].getContent()[5].getContent()[1].getContent()[D].removeAllContent();
				}
				this.oTaxChangeArray.splice(i, 1);
			}
		}
		this.oTaxDelArray.splice(s, 1);
		this.TaxDltQueryModel.push(d);
		d.body.TAXDESC = d.body.TAXTYPE__TXT;
		var e = c.bpHookDeleteTaxData(this, d);
		if (e !== undefined) {
			d = e;
		}
		var l = d.body;
		this.oDltTaxModel = new sap.ui.model.json.JSONModel();
		this.oDltTaxModel.setData(l);
	},
	undoTaxNumberChanges: function (a, e) {
		var I = "";
		var i, j;
		if (a === 0) {
			for (i = 0; i < this.oController.oDupCheckData.length;) {
				if (this.oController.oDupCheckData[i].createdIndex === this.taxCreateModel[e].index && this.oController.oDupCheckData[i].entity ===
					"BP_TaxNumber") {
					this.oController.oDupCheckData.splice(i, 1);
				} else {
					i++;
				}
			}
			this.taxCreateModel.splice(e, 1);
		} else if (a === 1) {
			var t;
			if (this.oTaxChangeArray.length === 1) {
				I = this.oTaxChangeArray[0].index;
				for (j = 0; j < this.oTaxResults.BP_TaxNumbersRel.results.length; j++) {
					if (I === j) {
						this.oTaxChangeArray[0].RINDEX = null;
						this.oTaxChangeArray[0].TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMBER;
						this.oTaxChangeArray[0].TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMXL;
						t = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXTYPE;
					}
				}
				this.TaxChngQueryModel.splice(e, 1);
				fcg.mdg.editbp.handlers.TaxNumbers.removeTaxEntry(t);
			} else if (this.oTaxResults.BP_TaxNumbersRel.results.length > 1) {
				I = this.TaxChngQueryModel[e].index;
				for (j = 0; j < this.oTaxResults.BP_TaxNumbersRel.results.length; j++) {
					var r = 0;
					for (i = 0; i < this.oTaxChangeArray.length; i++) {
						if (this.oTaxChangeArray[i].index === j && I === j) {
							this.oTaxChangeArray[i].RINDEX = null;
							this.oTaxChangeArray[i].TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMBER;
							this.oTaxChangeArray[i].TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXNUMXL;
							t = this.oTaxResults.BP_TaxNumbersRel.results[j].TAXTYPE;
						} else if (this.oTaxChangeArray[i].index !== I) {
							this.oTaxChangeArray[i].RINDEX = r++;
						}
					}
				}
				this.TaxChngQueryModel.splice(e, 1);
				fcg.mdg.editbp.handlers.TaxNumbers.removeTaxEntry(t);
			}
			for (i = 0; i < this.oController.oDupCheckData.length;) {
				if (this.oController.oDupCheckData[0].entityKey.split("-")[2] === t && this.oController.oDupCheckData[i].entity === "BP_TaxNumber") {
					this.oController.oDupCheckData.splice(i, 1);
				} else {
					i++;
				}
			}
		} else if (a === 2) {
			var d = this.TaxDltQueryModel[e].index;
			var c = "";
			var D = "";
			for (i = 0; i < this.oTaxResults.BP_TaxNumbersRel.results.length; i++) {
				if (d === i) {
					c = {};
					c.RINDEX = null;
					c.index = i;
					c.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
					c.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
					c.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
					c.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;
					D = {};
					D.RINDEX = null;
					D.index = i;
					D.TAXNUMBER = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMBER;
					D.TAXNUMXL = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXNUMXL;
					D.TAXTYPE__TXT = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE__TXT;
					D.TAXTYPE = this.oTaxResults.BP_TaxNumbersRel.results[i].TAXTYPE;
					this.oTaxChangeArray.splice(i, 0, c);
					this.oTaxDelArray.splice(i, 0, D);
				}
			}
			this.TaxDltQueryModel.splice(e, 1);
			this.TaxChngQueryModel.splice(e, 1);
		}
	},
	removeTaxEntry: function (t) {
		for (var i = 0; i < this.oController.aEntityValue.length; i++) {
			if ("taxRB-" + t === this.oController.aEntityValue[i]) {
				this.oController.aEntityValue.splice(i, 1);
				break;
			}
		}
	},
	handleTaxNumber: function (w) {
		if (w.vCurrentActionId === "createRB") {
			this.createTaxNumber(w);
		} else if (w.vCurrentActionId === "changeRB") {
			if (this.oTaxChangeArray.length > 1) {
				this.editTaxNumRedit(w);
			} else if (this.oTaxChangeArray.length === 1) {
				this.editTaxNum(w);
			}
		}
	},
	editTaxNumRedit: function (c) {
		var f = "";
		var v = "";
		var m = new sap.ui.model.json.JSONModel();
		this.oController = c;
		if (c.oCommunicationLayout !== "" && c.oCommunicationLayout !== undefined) {
			try {
				c.oCommunicationLayout.destroy();
			} catch (e) {}
			c.oCommunicationLayout = "";
		}
		if (c.oCommunicationLayout === "") {
			c.oCommunicationLayout = sap.ui.xmlfragment('fcg.mdg.editbp.frag.bp.EditTaxNumber', c);
		}
		c.getView().byId("actionStep").setNextStep(c.getView().byId("editStep"));
		c.getView().byId("editLayout").setVisible(true);
		c.getView().byId("editLayout").removeAllContent();
		c.getFileUploadData("editLayout");
		c.getView().byId("editLayout").addContent(c.oCommunicationLayout);
		var I = "";
		for (var i = 0; i < this.oTaxChangeArray.length; i++) {
			if (this.oTaxChangeArray[i].RINDEX === c.vTaxEntityIndex) {
				I = i;
				if (this.oTaxChangeArray[i].TAXNUMBER !== "") {
					v = this.oTaxChangeArray[i].TAXNUMBER;
				} else {
					v = this.oTaxChangeArray[i].TAXNUMXL;
				}
			}
		}
		f = sap.ui.getCore().byId("editTaxForm");
		m.setData(this.oTaxChangeArray[I]);
		f.setModel(m);
		c.currentDataModel = m;
		sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum").setValue(v);
		sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setShowValueHelp(false);
		sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNumCat").setEnabled(false);
		c.currentDataModel = m;
	},
	_TaxTypeVH: function (p, c, C) {
		var t = fcg.mdg.editbp.util.DataAccess.getValueHelpData()[8].data;
		var g = C;
		var l = this;
		var a = sap.ui.getCore().byId(p);
		var T = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxNum");
		if (p === "SF-BP_TaxNumber-TaxNumCat") {
			var b = sap.ui.getCore().byId("SF-BP_TaxNumber-TaxCatNm");
		}
		if (sap.ui.getCore().byId("taxTypeDialog") !== undefined) {
			sap.ui.getCore().byId("taxTypeDialog").destroy();
			this.otaxTypeHelp = "";
		}
		var o = new sap.m.SelectDialog({
			id: "taxTypeDialog",
			title: this.i18nModel.getText("Tax_category"),
			noDataText: this.i18nModel.getText("LOAD") + "...",
			items: {
				template: new sap.m.StandardListItem({
					title: "{TEXT}",
					description: "{KEY}"
				})
			},
			confirm: function (e) {
				l.valueHelpFlag = "X";
				a.setValueState("None");
				a.setValueStateText("");
				if (e.getParameters().selectedItem !== null || e.getParameters().selectedItem !== "") {
					a.setValue(e.getParameters().selectedItem.getProperty("description"));
				}
				T.setValueState("None");
				T.setValueStateText("");
				a.fireEvent("change");
				l.valueHelpFlag = "";
				if (b !== undefined) {
					b.setValue(e.getParameters().selectedItem.getProperty("title"));
				}
			},
			search: function (e) {
				var v = e.getParameter("value").toUpperCase();
				v = v.replace(/^[ ]+|[ ]+$/g, '');
				var f = o.getItems();
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
				var f = o.getItems();
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
		if (t.results.length > 0) {
			var I = new sap.m.StandardListItem({
				title: "{TEXT}",
				description: "{KEY}",
				active: true
			});
			var d = new sap.ui.model.json.JSONModel();
			d.setData(t);
			o.setModel(d);
			o.setGrowingThreshold(t.results.length);
			o.bindAggregation("items", "/results", I);
		} else {
			o.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
		}
		o.open();
	},
	setSelectRecordView: function () {
		var t = this;
		var s = this.oController.getView().byId("selectEntityInstanceStep");
		s.addEventDelegate({
			onAfterRendering: function () {
				var i = this.$().find('.sapMWizardStepTitle');
			}
		}, s);
	},
	setTaxChangedArray: function (a) {
		return this.changedArray;
	},
	getTaxChangedArray: function (a) {
		return this.changedArray;
	},
	seti18nModel: function (i) {
		this.i18nModel = i;
	}
};