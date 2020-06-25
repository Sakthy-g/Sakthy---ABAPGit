/*
 * Copyright (C) 2009-2018 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("fcg.mdg.editbp.handlers.GeneralData");jQuery.sap.require("fcg.mdg.editbp.handlers.Attachment");fcg.mdg.editbp.handlers.GeneralData={oGenDataFrag:"",oGenDataModel:"",GenDataQueryModel:[],ocurrentDataModel:"",changedArray:[],oController:"",vLangKey:"",resultsRoot:{},resultsOrg:{},resultsPers:{},clearGlobalVariables:function(c){if(this.oGenDataFrag!==undefined&&this.oGenDataFrag!==""){try{this.oGenDataFrag.destroy();}catch(e){}}c.oGenData="";this.oGenDataFrag="";this.oGenDataModel="";this.GenDataQueryModel=[];this.ocurrentDataModel="";this.changedArray=[];this.changedArray=[];this.vLangKey="";this.resultsRoot={};this.resultsOrg={};this.resultsPers={};c.oGenData="";},editGeneralData:function(i,c,a,C){this.oController=C;var q="";var p="/BP_RootCollection(BP_GUID="+i+")?$expand=";if(c==="1"){q=p+"BP_PersonRel";}else{q=p+"BP_OrganizationRel";}var m=new sap.ui.model.json.JSONModel();if(fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel===""){var d=fcg.mdg.editbp.util.DataAccess.readData(q,C);var e=C.bpHookReadGenData(this,q,d);if(e!==undefined){d=e;}if(d.BP_OrganizationRel.BP_GUID!==undefined){if(this.oGenDataFrag===""){this.oGenDataFrag=sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralOrg",C);}else{this.oGenDataFrag.destroy();this.oGenDataFrag=sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralOrg",C);}}else if(d.BP_PersonRel.BP_GUID!==undefined){if(this.oGenDataFrag===""){this.oGenDataFrag=sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralPerson",C);}else{this.oGenDataFrag.destroy();this.oGenDataFrag=sap.ui.xmlfragment("fcg.mdg.editbp.frag.bp.EditGeneralPerson",C);}}C.getView().byId("requestLayout").setVisible(true);C.getView().byId("requestLayout").removeAllContent();C.getFileUploadData("requestLayout");C.getView().byId("requestLayout").addContent(this.oGenDataFrag);C.getView().byId("requestLayout").setVSpacing(0);m.setData(d);fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel="";fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel=m;fcg.mdg.editbp.handlers.GeneralData.getValueHelp(a,c,m,C);}this.oGenDataFrag.setModel(fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel);if(c==="1")this.setDobFormat(sap.ui.getCore().byId("SF-BP_Person-DOB"));},getValueHelp:function(a,c,m,C){var r=fcg.mdg.editbp.util.DataAccess.getValueHelpData();var e=C.bpHookGeneralVH(this);if(e!==undefined){r=e;}var d=a.getText("NONE");if(c==="1"){var g=new sap.ui.model.json.JSONModel();var b={results:[{KEY:"",TEXT:d,ATTR_NAME:"SEX"},{KEY:"1",TEXT:a.getText("FEMALE"),ATTR_NAME:"SEX"},{KEY:"2",TEXT:a.getText("MALE"),ATTR_NAME:"SEX"}]};g.setData(b);var f=new sap.ui.core.Item({key:"{KEY}",text:"{TEXT}"});var G=sap.ui.getCore().byId("SF-BP_Person-sex");G.setModel(g);G.bindItems("/results",f);G.setSelectedKey(m.getData().BP_PersonRel.SEX);for(var i=0;i<r.length;i++){switch(i){case 0:var A=new sap.ui.model.json.JSONModel();A.setData(r[i].data);var h=new sap.ui.core.Item({key:"{KEY}",text:"{TEXT}"});var k=sap.ui.getCore().byId("SF-BP_Person-Title_aca1");k.setModel(A);k.bindItems("/results",h);var l=new sap.ui.core.Item({key:"",text:d});k.addItem(l);k.setSelectedKey(m.getData().BP_PersonRel.TITLE_ACA1);break;case 1:var M=new sap.ui.model.json.JSONModel();M.setData(r[i].data);var n=new sap.ui.core.Item({key:"{KEY}",text:"{TEXT}"});var o=sap.ui.getCore().byId("SF-BP_Person-Maritalstatus");o.setModel(M);o.bindItems("/results",n);var p=new sap.ui.core.Item({key:"",text:d});o.addItem(p);o.setSelectedKey(m.getData().BP_PersonRel.MARITALSTATUS);break;case 2:C.aCorrLangValues=r[i].data;break;case 3:var t=new sap.ui.model.json.JSONModel();t.setData(r[i].data);var q=new sap.ui.core.Item({key:"{KEY}",text:"{TEXT}"});var T=sap.ui.getCore().byId("SF-BP_Root-titlePers");T.setModel(t);T.bindItems("/results",q);var s=new sap.ui.core.Item({key:"",text:d});T.addItem(s);T.setSelectedKey(m.getData().TITLE_KEY);break;}}}else{for(var j=4;j<r.length;j++){switch(j){case 4:var u=new sap.ui.model.json.JSONModel();u.setData(r[j].data);var v=new sap.ui.core.Item({key:"{KEY}",text:"{TEXT}"});var w=sap.ui.getCore().byId("SF-BP_Root-titleOrg");w.setModel(u);w.bindItems("/results",v);var s=new sap.ui.core.Item({key:"",text:d});w.addItem(s);w.setSelectedKey(m.getData().TITLE_KEY);break;}}}},onName1Change:function(e){var n=e.getSource().getValue();if(n.replace(/^[ ]+|[ ]+$/g,"")===""){e.getSource().setValue("");e.getSource().setValueState("Error");}else{e.getSource().setValueState("None");}this.onChange(e);},onName2Change:function(e){var n=e.getSource().getValue();if(n.replace(/^[ ]+|[ ]+$/g,"")===""){e.getSource().setValue("");}this.onChange(e);},onDobChange:function(e){var d=e.getSource();var a=d.getDateValue();var v=d.getValue();var s=v.replace(/^[ ]+|[ ]+$/g,"");if(s===""){d.setValueState("None");d.setValue(s);return;}var f=sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd.MM.yyyy"});var D=f.format(new Date(a));var l=new sap.ui.core.Locale(fcg.mdg.editbp.handlers.GeneralData.oController.getOwnerComponent().getModel("i18n").getResourceBundle().sLocale);var o=sap.ui.core.format.DateFormat.getDateInstance(l);var b="";if(D===v){b=o.format(new Date(a));v=a;}else{b=o.format(new Date(v));}if(b.indexOf("Na")>-1||b===""){d.setValueState("Error");d.setPlaceholder(o.oFormatOptions.pattern);}else{d.setDateValue(new Date(v));d.setValueState("None");d.setValue(b);}var c=new Date();var g=Number(c.getFullYear()+("0"+(c.getMonth()+1)).slice(-2)+("0"+c.getDate()).slice(-2));var h=new Date(v);var i=Number(h.getFullYear()+("0"+(h.getMonth()+1)).slice(-2)+("0"+h.getDate()).slice(-2));if(i>g){d.setValueState("Error");}else{this.onChange(e);}},setDobFormat:function(f){if(f.getValue()!==""){var d=f.getDateValue();var l=new sap.ui.core.Locale(fcg.mdg.editbp.handlers.GeneralData.oController.getOwnerComponent().getModel("i18n").getResourceBundle().sLocale);var D=sap.ui.core.format.DateFormat.getDateInstance(l);var v=D.format(new Date(d));f.setValue(v);}},onST1Change:function(c){c.getSource().setValue(c.getSource().getValue().toUpperCase());var s=c.getSource().getValue();if(s.replace(/^[ ]+|[ ]+$/g,"")===""){c.getSource().setValue("");}this.onChange(c);},onST2Change:function(c){c.getSource().setValue(c.getSource().getValue().toUpperCase());var s=c.getSource().getValue();if(s.replace(/^[ ]+|[ ]+$/g,"")===""){c.getSource().setValue("");}this.onChange(c);},onTitleChange:function(c){var v=c.getSource().getSelectedItem().getText();if(c.getSource().getId()==="SF-BP_Root-titlePers"&&v!=="None"){var g=sap.ui.getCore().byId("SF-BP_Person-sex");if(c.getSource().getSelectedItem().getKey()==="0001"){if(g.getSelectedKey()!=="1"){g.setSelectedKey("1");g.fireEvent("change");}}else{if(g.getSelectedKey()!=="2"){g.setSelectedKey("2");g.fireEvent("change");}}}this.onChange(c);},onGenderChange:function(c){var v=c.getSource().getSelectedItem().getText();if(c.getSource().getId()==="SF-BP_Person-sex"&&v!=="None"){var t=sap.ui.getCore().byId("SF-BP_Root-titlePers");if(c.getSource().getSelectedItem().getKey()==="1"){if(t.getSelectedKey()!=="0001"){t.setSelectedKey("0001");t.fireEvent("change");}}else{if(t.getSelectedKey()!=="0002"){t.setSelectedKey("0002");t.fireEvent("change");}}}this.onChange(c);},onCorsLangChange:function(c){var f=c.getSource().getId().split("-");f=f[0];sap.ui.getCore().byId("SF-BP_Person-CLANGKey").setValue(sap.ui.getCore().byId("SF-BP_Person-CLANGKey").getValue().toUpperCase());var C=sap.ui.getCore().byId("SF-BP_Person-CLANGKey");var a=C.getValue();var b=a.replace(/^[ ]+|[ ]+$/g,"");b=b.toUpperCase();var o=sap.ui.getCore().byId("SF-BP_Person-CLANGText");if(b!==""){var l=false;for(var i=0;i<this.aCorrLangValues.results.length;i++){if(this.aCorrLangValues.results[i].KEY===b){fcg.mdg.editbp.handlers.GeneralData.vLangKey=this.aCorrLangValues.results[i].ATTR_VALUE;if(C.getValue()!==""){o.setValue(this.aCorrLangValues.results[i].TEXT);}l=true;this.onChange(c);o.fireEvent("change");break;}}if(l===false){o.setValue();C.setValueState("Error");var F="";if(this.bpCategory==="1"){F=this.i18nBundle.getText("CLANG");}if(this.bpCategory==="2"){F=this.i18nBundle.getText("LANGUAGE");}var e=F+" "+C.getValue()+" "+this.i18nBundle.getText("NO_EXISTENCE");C.setValueStateText(e);}}else{C.setValue();o.setValue();this.onChange(c);o.fireEvent("change");}},onCLangVH:function(c){var g=this;if(sap.ui.getCore().byId("CorrespodingLangDialog")!==undefined){sap.ui.getCore().byId("CorrespodingLangDialog").destroy();}var s=new sap.m.SelectDialog({id:"CorrespodingLangDialog",title:this.i18nBundle.getText("LANG"),noDataText:this.i18nBundle.getText("LOAD")+"...",confirm:function(e){sap.ui.getCore().byId("SF-BP_Person-CLANGKey").setValueState("None");sap.ui.getCore().byId("SF-BP_Person-CLANGText").setValueStateText("");sap.ui.getCore().byId("SF-BP_Person-CLANGKey").setValue(e.getParameters().selectedItem.getProperty("description"));sap.ui.getCore().byId("SF-BP_Person-CLANGText").setValue(e.getParameters().selectedItem.getProperty("title"));sap.ui.getCore().byId("SF-BP_Person-CLANGKey").fireEvent("change");sap.ui.getCore().byId("SF-BP_Person-CLANGText").fireEvent("change");},search:function(e){var v=e.getParameter("value").toUpperCase();v=v.replace(/^[ ]+|[ ]+$/g,"");var a=s.getItems();for(var i=0;i<a.length;i++){if(v.length>0){var l=a[i].getBindingContext().getProperty("TEXT");var L=a[i].getBindingContext().getProperty("KEY");if(l.toUpperCase().indexOf(v)===-1&&L.toUpperCase().indexOf(v)===-1){a[i].setVisible(false);}else{a[i].setVisible(true);}}else{a[i].setVisible(true);}}},liveChange:function(e){var v=e.getParameter("value").toUpperCase();v=v.replace(/^[ ]+|[ ]+$/g,"");var a=s.getItems();for(var i=0;i<a.length;i++){if(v.length>0){var l=a[i].getBindingContext().getProperty("TEXT");var L=a[i].getBindingContext().getProperty("KEY");if(l.toUpperCase().indexOf(v)===-1&&L.toUpperCase().indexOf(v)===-1){a[i].setVisible(false);}else{a[i].setVisible(true);}}else{a[i].setVisible(true);}}}});if(this.aCorrLangValues!==null&&this.aCorrLangValues.results.length>0){var I=new sap.m.StandardListItem({title:"{TEXT}",description:"{KEY}",active:true});var o=new sap.ui.model.json.JSONModel();o.setData(this.aCorrLangValues);s.setModel(o);s.setGrowingThreshold(this.aCorrLangValues.results.length);s.bindAggregation("items","/results",I);}else{s.setNoDataText(g.i18nBundle.getText("NO_DATA"));}s.open();},setWizardTitle:function(c,m){var w=c.getView().byId("wizardContentPage").getTitle();var t=w+" : "+m.getData().DESCRIPTION+"("+m.getData().PARTNER+")";c.getView().byId("wizardContentPage").setTitle(t);},createGenDataModel:function(c){var a=(JSON.parse(JSON.stringify(fcg.mdg.editbp.handlers.GeneralData.changedArray)));var n={};var C=[];var A="";var h="";for(var k=0;k<a.length;k++){n.Entity=a[k].entity;if(a[k].key!==undefined){n.Attribute=a[k].field+"__TXT";}else{n.Attribute=a[k].field;}n.EntityAction="U";n.NewValue=a[k].value;n.header=a[k].entityKey;C.push(n);n={};if(a[k].key!==undefined){var b=a[k].field;n.Entity=a[k].entity;n.Attribute=b;n.EntityAction="U";n.NewValue=a[k].key;n.header=a[k].entityKey;C.push(n);n={};}}for(var i=0;i<C.length;i++){if(C[i].Attribute!==undefined&&C[i].Entity==="BP_Root"){var A="/"+C[i].Attribute;if(A==="/TITLE_KEY__TXT"&&C[i].NewValue==="None"){C[i].NewValue="";}fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty(A,C[i].NewValue);this.resultsRoot[C[i].Attribute]=C[i].NewValue;h=C[i].header;}if(C[i].Attribute!==undefined){if(C[i].Entity==="BP_Organization"){var A="/"+C[i].Entity+"Rel/"+C[i].Attribute;fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty(A,C[i].NewValue);this.resultsOrg[C[i].Attribute]=C[i].NewValue;h=C[i].header;}else if(C[i].Entity==="BP_Person"){var A="/"+C[i].Entity+"Rel/"+C[i].Attribute;if(A==="/BP_PersonRel/SEX__TXT"||A==="/BP_PersonRel/TITLE_ACA1__TXT"||A==="/BP_PersonRel/MARITALSTATUS__TXT"){if(C[i].NewValue==="None"){C[i].NewValue="";}}if(A==="/BP_PersonRel/CORRESPONDLANGUAGEISO"){fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty("/BP_PersonRel/CORRESPONDLANGUAGE",fcg.mdg.editbp.handlers.GeneralData.vLangKey);this.resultsPers["CORRESPONDLANGUAGE"]=fcg.mdg.editbp.handlers.GeneralData.vLangKey;}fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty("/BP_PersonRel/BIRTHDATE",sap.ui.getCore().byId("SF-BP_Person-DOB").getValue());fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.setProperty(A,C[i].NewValue);this.resultsPers[C[i].Attribute]=C[i].NewValue;h=C[i].header;}}}fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().ChangeData=this.resultsRoot;fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().BP_OrganizationRel.ChangeData=this.resultsOrg;fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData().BP_PersonRel.ChangeData=this.resultsPers;if(c.reEdit!=="X"){this.createSummaryData(this.resultsRoot,this.resultsPers,this.resultsOrg,h);}else{this.GenDataQueryModel=[];this.createSummaryData(this.resultsRoot,this.resultsPers,this.resultsOrg,h);}},createSummaryData:function(r,a,b,h){var q={};if(Object.getOwnPropertyNames(r).length!==0){q.header=h;q.entity="BP_Root";q.body=r;this.GenDataQueryModel.push(q);q={};}if(Object.getOwnPropertyNames(a).length!==0){q.header=h;q.entity="BP_Person";q.body=a;this.GenDataQueryModel.push(q);q={};}else if(Object.getOwnPropertyNames(b).length!==0){q.header=h;q.entity="BP_Organization";q.body=b;this.GenDataQueryModel.push(q);q={};}},getGenDataModel:function(){var t=new sap.ui.model.json.JSONModel();var a=JSON.parse(JSON.stringify(fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel.getData()));t.setData(a);return t;},setChangedArray:function(e,n,a,c){if(e.getSource().mBindingInfos.value!==undefined){if(a==="BP_Root"){n.field=(e.getSource().mBindingInfos.value.binding.sPath).split("/")[1];}else{n.field=(e.getSource().mBindingInfos.value.binding.sPath).split("/")[2];}}else{n.field=e.getSource().getModel().getData().results[0].ATTR_NAME;}c.currentEntityKey="(BP_GUID="+c.sItemPath+")";n.entityKey=c.currentEntityKey;for(var i=0;i<fcg.mdg.editbp.handlers.GeneralData.changedArray.length;i++){if(fcg.mdg.editbp.handlers.GeneralData.changedArray[i].field==n.field){if(e.getParameters().selectedItem!==undefined){fcg.mdg.editbp.handlers.GeneralData.changedArray[i].key=n.key;fcg.mdg.editbp.handlers.GeneralData.changedArray[i].value=n.value;}else{fcg.mdg.editbp.handlers.GeneralData.changedArray[i].value=n.value;}return;}}fcg.mdg.editbp.handlers.GeneralData.changedArray.push(n);},changeDobFormat:function(v){var f=sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd.MM.yyyy"});var d=f.format(new Date(v));var l=new sap.ui.core.Locale(fcg.mdg.editbp.handlers.GeneralData.oController.getOwnerComponent().getModel("i18n").getResourceBundle().sLocale);var D=sap.ui.core.format.DateFormat.getDateInstance(l);return D.format(new Date(d));},setDispFragTitle:function(c,l){var f=l.getContent()[0];var a=f.getToolbar().getContent()[1];a.setText(" ("+c.i18nBundle.getText("CHANGE")+")").addStyleClass("text_bold");},undoGenDataChanges:function(a,e){for(i=0;i<this.oController.oDupCheckData.length;){if(this.oController.oDupCheckData[i].entity==="BP_Organization"||this.oController.oDupCheckData[i].entity==="BP_Person"){this.oController.oDupCheckData.splice(i,1);}else{i++;}}for(i=0;i<this.oController.aEntityValue.length;i++){if("OrgRB"===this.oController.aEntityValue[i].split("-")[0]||"PersRB"===this.oController.aEntityValue[i].split("-")[0]){this.oController.aEntityValue.splice(i,1);break;}}this.GenDataQueryModel=[];fcg.mdg.editbp.handlers.GeneralData.ocurrentDataModel="";this.oController.oGenData="";fcg.mdg.editbp.handlers.GeneralData.changedArray=[];this.oController.aEntityValue.splice(e,1);},createSubmitQuery:function(g){for(var i=0;i<g.length;i++){if(g[i].entity==="BP_Person"){for(var l=0;l<Object.keys(g[i].body).length;l++){if(Object.keys(g[i].body)[l]==="BIRTHDATE"){var v=g[i].body[Object.keys(g[i].body)[l]];v=new Date(v);g[i].body["BIRTHDATE"]=v;}if(Object.keys(g[i].body)[l]==="CORRESPONDLANGUAGE__TXT"){delete g[i].body.CORRESPONDLANGUAGE__TXT;}}}}var e=this.oController.bpHookGenCreateSubmitQuery(g);if(e!==undefined){g=e;}return g;},performOrgUIValidations:function(c){var e="";var t=sap.ui.getCore().byId("SF-BP_Organization-name1");if(t.getValueState()==="Error"){e=c.i18nBundle.getText("ERROR_CHECK");this.showPopUp(c,e);return false;}return true;},performUIValidations:function(c){var e="";var t=sap.ui.getCore().byId("SF-BP_Person-FName");if(t.getValueStateText()==="Error"){e=c.i18nBundle.getText("ERROR_TITLE");this.showPopUp(c,e);return false;}var p=sap.ui.getCore().byId("SF-BP_Person-FName");if(p.getValueState()==="Error"){e=c.i18nBundle.getText("ERROR_FNAME");this.showPopUp(c,e);return false;}var a=sap.ui.getCore().byId("SF-BP_Person-LName");if(a.getValueState()==="Error"){e=c.i18nBundle.getText("ERROR_LNAME");this.showPopUp(c,e);return false;}var b=sap.ui.getCore().byId("SF-BP_Person-CLANGKey");if(b.getValueState()==="Error"){e=c.i18nBundle.getText("ERROR_CLANG");this.showPopUp(c,e);return false;}var d=sap.ui.getCore().byId("SF-BP_Person-CLANGText");if(b.getValueState()==="Error"){e=c.i18nBundle.getText("ERROR_CLANGTEXT");this.showPopUp(c,e);return false;}var f=sap.ui.getCore().byId("SF-BP_Person-DOB");if(f.getValueState()==="Error"){e=c.i18nBundle.getText("ERROR_DOB");this.showPopUp(c,e);return false;}},showPopUp:function(c,t){var d=new sap.m.Dialog({title:c.i18nBundle.getText("ERROR"),type:"Message",state:c.i18nBundle.getText("ERROR"),content:[new sap.m.Text({text:t})],beginButton:new sap.m.Button({text:c.i18nBundle.getText("OK"),press:function(){d.close();}}),afterClose:function(){d.destroy();}});d.open();}};