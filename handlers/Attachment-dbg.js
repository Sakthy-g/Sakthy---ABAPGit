/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* eslint-disable */
jQuery.sap.declare("fcg.mdg.editbp.handlers.Attachment");
jQuery.sap.require("sap.m.UploadCollectionParameter");
jQuery.sap.require("sap.m.MessageBox");

fcg.mdg.editbp.handlers.Attachment = {
 oController: "",
 oUpload: false,
 onBeforeUploadFile: function(oEvent) {
  var sFilename = "";
  //Sending the CSRF token as a header parameter
  var sToken = this.getXsrfToken();
  var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
   name: "X-CSRF-Token",
   value: sToken
  });
  var headerparams = this.oFileUpload.getHeaderParameters();
  if (headerparams[0] === undefined) {
   this.oFileUpload.addHeaderParameter(oCustomerHeaderToken);
  }
  var token = this.oFileUpload.getHeaderParameters()[0].getValue("X-CSRF-Token");
  if (token === "") {
   this.oFileUpload.addHeaderParameter(oCustomerHeaderToken);
  }

  // if (oController.isMock) {
  //  sFilename = "57_iPhone_Desktop_Launch.png";
  // } else {
  sFilename = oEvent.getParameter("mParameters").files[0].name;
  // }
  //Set the slug i.e.Filename
  var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
   name: "slug",
   value: sFilename
  });

  var headerparams = this.oFileUpload.getHeaderParameters();
  this.oFileUpload.removeHeaderParameter(headerparams[1]);
  this.oFileUpload.addHeaderParameter(oCustomerHeaderSlug);

 },
 onFileStartsUploading: function(oEvent) {
  this.oFileUpload.setUploadEnabled(false);
  fcg.mdg.editbp.handlers.Attachment.oUpload = true;
 },

 /* handle on upload file event */
 onUploadFile: function(oEvent) {
  var createdby, mimetype, guid, url, newurl, fileName;
  /* eslint-disable sap-no-event-prop */
  var rawxml = oEvent.getParameters().getParameters().responseRaw;
 /* if (sap.ui.Device.browser.chrome || sap.ui.Device.browser.safari) {
   var parsexml = jQuery.sap.parseXML(rawxml);
   var xmldocument = $(parsexml);
   createdby = xmldocument.find("CreatedBy").text();
   mimetype = xmldocument.find("MimeType").text();
   guid = xmldocument.find("Guid").text();
   url = xmldocument.find("id").text();
  } else { */
   /* eslint-disable no-undef */
   var parser = new DOMParser();
   /* eslint-enable no-undef */
   var xmlDoc = parser.parseFromString(rawxml, "text/xml");
   createdby = xmlDoc.getElementsByTagName("d:CreatedBy")[0].childNodes[0].nodeValue;
   mimetype = xmlDoc.getElementsByTagName("d:MimeType")[0].childNodes[0].nodeValue;
   guid = xmlDoc.getElementsByTagName("d:Guid")[0].childNodes[0].nodeValue;
   url = xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
 // }
  newurl = url + '/$value';
  fileName = oEvent.getParameters().getParameters().fileName;
  var fnCurrentDate = function() {
   var date = new Date();
   var day = date.getDate();
   var month = date.getMonth() + 1;
   var year = date.getFullYear();

   if (day < 10) {
    day = '0' + day;
   }
   if (month < 10) {
    month = '0' + month;
   }
   return year + '-' + month + '-' + day;
  };
  if (guid !== "") {
   var data = this.attachDataModel.getData();
   var object = {
    "mimeType": mimetype,
    "contributor": createdby,
    "uploaded": fnCurrentDate(),
    "enableEdit": false,
    "enableDelete": true,
    "filename": fileName,
    "url": newurl,
    "documentId": guid
   };

   data.dataitems.unshift(object);
   this.attachDataModel.setData(data);

   this.oFileUpload.getBinding("items").refresh(true);
   this.oFileUpload.rerender();

   var aGuid = {
    Guid: guid
   };
   this.oAttach.push(aGuid);

   var requestReason = fcg.mdg.editbp.handlers.Attachment.oController.oRequestReason;
   if (requestReason.getValue() === "") {
    requestReason.setValue(this.i18nBundle.getText("AFTER_UPLOAD"));
   }
   requestReason.fireEvent("change");
   this.onAttachmentChange();
  } 
  this.oFileUpload.setUploadEnabled(true);
  fcg.mdg.editbp.handlers.Attachment.oUpload = false;
  /* eslint-enable sap-no-event-prop */
 },

 onFileDeleted: function(oEvent) {
  var sDocumentId = oEvent.getParameter("documentId");
  var data = this.attachDataModel.getData();
  if(this.oFileUpload.getUploadEnabled() === true){
   for (var i = 0; i < data.dataitems.length; i++) {
    if (data.dataitems[i].documentId === sDocumentId) {
     data.dataitems.splice(i, 1);
     break;
    }
   }
   for (var i = 0; i < this.oAttach.length; i++) {
    if (this.oAttach[i].Guid === sDocumentId) {
     this.oAttach.splice(i, 1);
     break;
    }
   }
   this.attachDataModel.setData(data);
   this.oFileUpload.getBinding("items").refresh(true);
   this.oFileUpload.rerender();
   this.onAttachmentChange();
   if (this.oAttach.length === 0) {
    if (fcg.mdg.editbp.handlers.Attachment.oController.oRequestReason.getValue() === this.i18nBundle.getText("AFTER_UPLOAD")) {
     fcg.mdg.editbp.handlers.Attachment.oController.oRequestReason.setValue("");
     fcg.mdg.editbp.handlers.Attachment.oController.oRequestReason.fireEvent("change");
    }
   }
   this.oFileUpload.setUploadEnabled(true);
   fcg.mdg.editbp.handlers.Attachment.oUpload = false;
  } else {
   var errorDetails = this.i18nBundle.getText("ATTACH_UPLOAD");
   this.showErrorDialog(errorDetails);
  }

 },

 /* handle file upload failed event */
 onFileUploadFailed: function(e) {
  MessageBox.error(e.getParameters().exception.message);
 },

 //Called when the Upload is terminated in case of huge files
 uploadTerminated: function(oEvent) {
  var sFilename= oEvent.getParameters("fileName");
  var oFileId=sFilename.id;
  var items = this.oFileUpload.getItems();
  for (var i = 0; i < items.length; i++) {
   if (this.oFileUpload.getId() === oFileId) {
    items.splice(i, 1);
    break;
   }
  } 
  this.oFileUpload.setUploadEnabled(true);
  fcg.mdg.editbp.handlers.Attachment.oUpload = false;
 },

 showErrorDialog: function(errorDetails) {
  if (errorDetails && errorDetails.trim()) {
   var errorObject = {};
   errorObject.details = errorDetails;
   sap.m.MessageBox.error(errorObject.details);
  }
 }

};