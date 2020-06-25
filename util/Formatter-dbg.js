/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.util.Formatter");

fcg.mdg.editbp.util.Formatter = {
 country: "",
 countryCode: "",
 mobCountry: "",
 mobCountryCode: "",
 titleWithName: function(title, name, vChAtt, vChAtt2) {
  var vBoldStyle = "text_bold";
  if (name !== undefined) {
   if (name === vChAtt) {
    this.addStyleClass(vBoldStyle);
   }
  }
  if (title !== undefined) {
   if (title === vChAtt || title === vChAtt2) {
    this.addStyleClass(vBoldStyle);
   }
  }
  if (title === undefined) {
   return name;
  } else {
   return title + " " + name;
  }
 },

 getIcon: function(mimetype) {

  if (mimetype == "text/plain") {
   return "sap-icon://document-text";
  }
   if (mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ) {
   return "sap-icon://doc-attachment";
  }
  if (mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ) {
   return "sap-icon://excel-attachment";
  }
  if ( mimetype == "application/vnd.openxmlformats-officedocument.presentationml.presentation" ) {
   return "sap-icon://ppt-attachment";
  }
  if (mimetype == "application/pdf" ){
   return "sap-icon://ppt-attachment";
  }
   if (mimetype == "image/png") {
   return "sap-icon://picture";
   }
   else 
   {
   return "sap-icon://picture";
   }

 },

 checkEmail: function(sEmail) {
  var mail = sEmail.trim();
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!filter.test(mail)) {
   return false;
  }
 },

 extensionWithNumber: function(country, number, ext, vChAtt, vChExt) {
  number = fcg.mdg.editbp.util.Formatter.formatCommNumber(number);
  number = fcg.mdg.editbp.util.Formatter.removeLeadingZeroes(number);
  vChAtt = fcg.mdg.editbp.util.Formatter.formatCommNumber(vChAtt);
  ext = fcg.mdg.editbp.util.Formatter.formatCommNumber(ext);
  vChExt = fcg.mdg.editbp.util.Formatter.formatCommNumber(vChExt);

  var vBoldStyle = "text_bold";
  if (number !== undefined || ext !== undefined) {
   if (number !== "" || ext !== "") {
    var countryCode = "";
    if (this.country !== country) {
     countryCode = fcg.mdg.editbp.util.Formatter.setISDCodefromCountry(country);
     this.countryCode = countryCode;
     this.country = country;
    } else {
     countryCode = this.countryCode;
    }
    if (number === vChAtt) {
     this.addStyleClass(vBoldStyle);
    }
    if (ext !== undefined) {
     if (ext === vChExt) {
      this.addStyleClass(vBoldStyle);
     }
     return "+" + countryCode + " (" + number + ")" + ext;
    } else if (ext === undefined) {
     return "+" + countryCode + " (" + number + ")";
    }
   }

  }
 },

 mobNumber: function(country, number, vChAtt) {
  number = fcg.mdg.editbp.util.Formatter.formatCommNumber(number);
  number = fcg.mdg.editbp.util.Formatter.removeLeadingZeroes(number);
  vChAtt = fcg.mdg.editbp.util.Formatter.formatCommNumber(vChAtt);
  var vBoldStyle = "text_bold";
  if (number !== undefined) {
   if (number !== "") {
    var countryCode = "";
    if (this.country === country) {
     this.mobCountry = country;
     this.mobCountryCode = this.countryCode;
     countryCode = this.mobCountryCode;
    } else if (this.mobCountry === country) {
     countryCode = this.mobCountryCode;
    } else if (this.mobCountry !== country) {
     countryCode = fcg.mdg.editbp.util.Formatter.setISDCodefromCountry(country);
     this.mobCountryCode = countryCode;
    }

    if (number === vChAtt) {
     this.addStyleClass(vBoldStyle);
    }
    return "+" + countryCode + " (" + number + ")";
   }
  }
 },

 descriptionAndCode: function(sDesc, sCode) {
  if ((sDesc === "" ||
    sDesc === undefined || sDesc === null) && (sCode === "" || sCode === undefined || sCode === null))
   return "";
  if (sDesc !== "" && sCode === "")
   return sDesc;
  else if (sDesc === "" && sCode !== "")
   return sCode;
  else if (sDesc !== "" && sCode !== "")
   return sDesc + '(' + sCode + ')';
 },

 // View visibility formatter
 visibility: function(sValue1, sValue2) {
  if ((sValue1 === undefined || sValue1 === "" || sValue1 === null || sValue1 === "|#|" || sValue1 === "|#-#|" || sValue1 === "None") &&
   (sValue2 === undefined ||
    sValue2 === "" || sValue2 === null || sValue1 === "|#|" || sValue1 === "|#-#|")) {
   return false;
  } else {
   return true;
  }
 },
 mergeOrgData: function(OrgDesc, OrgId) {
  var Org = "";
  if (OrgId === "") {
   Org = OrgDesc;
  } else {
   Org = OrgDesc + " (" + OrgId + ")";
  }
  return Org;
 },
 passS1Instance: function(os1Controller) {
  this.oS1Controller = os1Controller;
 },

 getS1Instance: function() {
  return this.oS1Controller;
 },

 // Get the concatenated value of the supplied key and description 
 getKeyDesc: function(key, desc, vChAtt) {
  var vBoldStyle = "text_bold";
  if (key !== undefined) {
   if (desc === vChAtt) {
    this.addStyleClass(vBoldStyle);
   }
   if (key === vChAtt) {
    this.addStyleClass(vBoldStyle);
   }
  }
  if (desc === "" || desc === undefined || desc === null) {
   return key;
  } else if (key === "" || key === undefined || key === null) {
   return key;
  } else {
   return desc + ' (' + key + ')';
  }
 },
 getCateogoryDesc: function(value) {
  var locale = fcg.mdg.editbp.util.DataAccess.i18nModel;
  if (value === "1") {
   return locale.getText("PERSON");
  } else if (value === "2") {
   return locale.getText("ORGANIZATION");
  } else if (value === "3") {
   return locale.getText("GROUP");
  } else {
   return " ";
  }
 },

 isActive: function(value) {
  var sCrequestNum = value;
  sCrequestNum = sCrequestNum.replace(/^0+/, '');
  if (sCrequestNum !== "") {
   return "Inactive";
  } else {
   return "DetailAndActive";
  }
 },

 isLocked: function(value) {
  var i;
  var vRowId;
  var sCrequestNum = value;
  sCrequestNum = sCrequestNum.replace(/^0+/, '');
  var vTbl = sap.ui.getCore().byId("defaultRsltTbl");
  var sStyleClass = "sapGreyCell";
  if (fcg.mdg.editbp.util.DataAccess.fromWizard === 1) {
   vRowId = fcg.mdg.editbp.util.DataAccess.selectedRecord;
  } else {
   vRowId = vTbl.getItems().length - 1;
  }
  fcg.mdg.editbp.util.DataAccess.setFromWizardFlag(0);
  if (sCrequestNum !== "") {
   if (vTbl !== undefined) {
    // vTbl.getItems()[vRowId].setProperty("type", "Inactive");
    //vTbl.getItems()[vRowId].getNavigationControl().setProperty("src", "");
    for (i = 0; i < vTbl.getItems()[vRowId].getCells().length; i++) {
     vTbl.getItems()[vRowId].getCells()[i].addStyleClass(sStyleClass);
    }
   }
   return true;
  } else {
   if (vTbl !== undefined) {
    // vTbl.getItems()[vRowId].setProperty("type", "DetailAndActive");
    // vTbl.getItems()[vRowId].getNavigationControl().setProperty("src", "");
    for (i = 0; i < vTbl.getItems()[vRowId].getCells().length; i++) {
     if (vTbl.getItems()[vRowId].getCells()[i].hasStyleClass(sStyleClass) === true) {
      vTbl.getItems()[vRowId].getCells()[i].removeStyleClass(sStyleClass);
     }
    }
   }
   return false;
  }
 },

 getBankTitle: function(vCntry, vName, vAccount) {
  var vTitle;
  var oI18nModel = fcg.mdg.editbp.handlers.BankAccount.i18nModel;
  if (vName === "") {
   vTitle = oI18nModel.getText('bank_acc') + ": " + vCntry + " (" + oI18nModel.getText('Account') + ": " + vAccount +
    ")";
  } else {
   vTitle = oI18nModel.getText('bank_acc') + ": " + vName + ", " + vCntry + " (" + oI18nModel.getText('Account') + ": " + vAccount +
    ")";
  }
  return vTitle;
 },

 getIdentificationTitle: function(idText, idNumber) {
  var oI18nModel = fcg.mdg.editbp.util.DataAccess.i18nModel;
  var vTitle = oI18nModel.getText('identification') + ": " + idText + ": " + idNumber;
  return vTitle;
 },

 getBoldText: function(vAttribute, vChAttribute) {
  var vBoldStyle = "text_bold";
  if (vAttribute !== undefined) {
   if (vAttribute === vChAttribute) {
    this.addStyleClass(vBoldStyle);
   }
  }
  return vAttribute;

 },

 getChangeCPTitle: function(desc, Key) {
  var oI18nModel = fcg.mdg.editbp.util.DataAccess.i18nModel;
  var vTitle = oI18nModel.getText("contact_person") + ": ";
  var vPartner = fcg.mdg.editbp.util.Formatter.removeLeadingZeroes(Key);
  if (desc === "" || desc === undefined || desc === null) {
   return vTitle + vPartner;
  } else if (vPartner === "" || vPartner === undefined || vPartner === null) {
   return vTitle + vPartner;
  } else {
   return vTitle + desc + ' (' + vPartner + ')';
  }
 },

 getCPTitle: function(name1, name2) {
  var oI18nModel = fcg.mdg.editbp.util.DataAccess.i18nModel;
  var vTitle = oI18nModel.getText("contact_person") + ": ";
  var cpDesc = fcg.mdg.editbp.handlers.ContactPerson.cpDesc;
  fcg.mdg.editbp.handlers.ContactPerson.cpDesc = "";
  if (cpDesc !== "") {
   vTitle = vTitle + " " + cpDesc;
   return vTitle;
  }
  if (fcg.mdg.editbp.util.Formatter.isNull(name1) && fcg.mdg.editbp.util.Formatter.isNull(name2)) {
   return vTitle;
  } else if (!fcg.mdg.editbp.util.Formatter.isNull(name1) && fcg.mdg.editbp.util.Formatter.isNull(name2)) {
   return vTitle + " " + name1;
  } else if (fcg.mdg.editbp.util.Formatter.isNull(name1) && !fcg.mdg.editbp.util.Formatter.isNull(name2)) {
   return vTitle + " " + name2;
  } else if (!fcg.mdg.editbp.util.Formatter.isNull(name1) && !fcg.mdg.editbp.util.Formatter.isNull(name2)) {
   return vTitle + " " + name1 + " " + name2;
  }
 },

 isNull: function(value) {
  return typeof value === "undefined" || value === "unknown" || value === null || value === "null" || value === "" || parseInt(value, 10) ===
   0;
 },

 // getEnabled: function(value) {
 //  if (value !== "X") {
 //   return true;
 //  } else {
 //   return false;
 //  }
 // },

 createRecordsToProcess: function(i18n, oBank) {
  var vRecord = oBank.BANK_NAME + ", " + oBank.BANK_CTRY__TXT + " (" + i18n.getText("Account") + ": " + oBank.BANK_ACCT + ")";
  return vRecord;
 },

 createRecordsToProcessForAddress: function(oAddr) {
  return oAddr.AD_ID__TXT;
 },

 getLabelVisibility: function(value) {
  if (value !== undefined) {
   return true;
  } else {
   return false;
  }
 },

 getTaxTitle: function(vTaxType, vTaxDesc, vTaxNum) {
  var oI18nModel = fcg.mdg.editbp.handlers.BankAccount.i18nModel;
  var vTitle = oI18nModel.getText('TNUM') + ": " + vTaxDesc + " " + "(" + vTaxType + ")" + " : " + vTaxNum;
  return vTitle;
 },

 getCustomer: function(name1, name2, id) {
  var result = name1 + " " + name2 + "(" + id + ")";
  return result;
 },
 getStreetAndHouseNo: function(street, houseNum) {
  var result = street + " " + houseNum;
  return result;
 },

 createTaxRecordsToProcess: function(oTax) {
  var vRecord;
  if (oTax.TAXNUMBER !== "") {
   vRecord = oTax.TAXTYPE__TXT + " (" + oTax.TAXTYPE + ")" + " : " + oTax.TAXNUMBER;
  } else {
   vRecord = oTax.TAXTYPE__TXT + " (" + oTax.TAXTYPE + ")" + " : " + oTax.TAXNUMXL;
  }
  return vRecord;
 },

 formatCommNumber: function(value) {
  if (value !== undefined) {
   value = value.replace(/-/g, "");
   return value;
  }
 },

 removeLeadingZeroes: function(sValue) {
  if (sValue !== undefined && sValue !== "") {
   var res = sValue.replace(/^0+/, '');
   return res;
  } else {
   return "";
  }
 },

 setISDCodefromCountry: function(country) {
  var isdCode;
  var oWController = fcg.mdg.editbp.util.DataAccess.owizardController;
  var query = "/ValueHelpCollection?$filter=ENTITY+eq+'BP_Root'+and+ATTR_NAME+eq+'DAILCODE'+and+FILTER+eq+'COUNTRY=" + country + "'";
  var oModel = new sap.ui.model.odata.ODataModel(oWController.getView().getModel().sServiceUrl, true);
  oModel.read(query, null, null, false,
   function(data, oError) {
    isdCode = data.results[0].TEXT;
   });
  return isdCode;
 },

 boldCPChanges: function(vAttribute, vChAttribute, oTextControl) {
  var vBoldStyle = "text_bold";
  if (vAttribute !== undefined) {
   if (vAttribute === vChAttribute) {
    oTextControl.addStyleClass(vBoldStyle);
   }
  }
  return vAttribute;
 },

 validUntilDateFormat: function(vDate) {
  var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
   pattern: "yyyy-MM-dd'T'HH:mm:ss"
  });
  return oDateFormat.format(new Date(vDate));
 }
};