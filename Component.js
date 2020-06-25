/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "fcg/mdg/editbp/model/models"], function (U, D, m) {
	"use strict";
	return U.extend("fcg.mdg.editbp.Component", {
		metadata: {
			manifest: "json",
			includes: ["css/style.css"]
		},
		init: function () {
			U.prototype.init.apply(this, arguments);
			this.setModel(m.createDeviceModel(), "device");
			this.setModel(m.createFLPModel(), "FLP");
			this.getRouter().initialize();
		},
		destroy: function () {
			U.prototype.destroy.apply(this, arguments);
		},
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!D.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});