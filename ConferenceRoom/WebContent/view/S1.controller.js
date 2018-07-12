jQuery.sap.require("sap.m.MessageBox");

sap.ui.core.mvc.Controller.extend("ConferenceRoom.view.S1", {
	
	
	
onInit:function(){
		var that = this;
		var mainModel = this.getOwnerComponent().getModel();
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent){
		var locationArray = [];
		var finalArray = [];
		var localModel = new sap.ui.model.json.JSONModel();
		that.getView().setModel(localModel,"localModel");
		that.getView().byId("idcreatedate").setDateValue(new Date());
		that.getView().byId("idbookdate").setDateValue(new Date());
	var mParameters = {
			success: function(oData) {
    localModel.setSizeLimit(oData.results.length);
    that.getView().getModel("localModel").setProperty("/mainService",oData.results);
		$.each(oData.results, function(i, el){
	  if($.inArray(el.Location, locationArray) === -1) {
	  locationArray.push(el.Location);
	  }
      });
		finalArray.push({"Location":"Select"});
	$.each(locationArray,function(i,e){
		finalArray.push({"Location":e});
	})
      
      that.getView().getModel("localModel").setProperty("/LocationsData",finalArray);

			},
			error: function(errorResponse) {
			
			},
			async: true
		};
	  mainModel.read("/GeoLocationSet",mParameters);
		},this);
	
		
},


onLocationSelect:function(oEvent){
		var that = this;
	var locationSelectedKey = oEvent.getSource().getSelectedKey();
	var oModel = that.getView().getModel("localModel");
	var buildingArray = [];
	var finalArray = [];
	if(locationSelectedKey !== "Select"){
	$.each(oModel.getProperty("/mainService"),function(index,element){
		if(locationSelectedKey === element.Location){
			if($.inArray(element.Building, buildingArray) === -1) {
				buildingArray.push(element.Building);
				  }	
		}
	});	
	$.each(buildingArray,function(i,e){
		finalArray.push({"Building":e})
	});
	that.getView().byId("idBuildingselect").setEnabled(true);
	finalArray.unshift({"Building":"Select"});
	oModel.setProperty("/BuildingData",finalArray);
	}else{
	that.getView().byId("idBuildingselect").setEnabled(false);
	that.getView().byId("idBuildingselect").setSelectedKey("Select");
	that.getView().byId("idroomselect").setEnabled(false);
	that.getView().byId("idroomselect").setSelectedKey("Select");
	}
},

onBuildingSelect:function(oEvent){
		var that = this;
	var buildingSelectedKey = oEvent.getSource().getSelectedKey();
	var buildingEnabled = that.getView().byId("idBuildingselect").getEnabled();
	var oModel = that.getView().getModel("localModel");
	var confRoomArray = [];
	if(buildingSelectedKey !== "Select" && buildingEnabled === true){
	$.each(oModel.getProperty("/mainService"),function(index,element){
		if(buildingSelectedKey === element.Building){
			confRoomArray.push(element);
		}
	});	
	that.getView().byId("idroomselect").setEnabled(true);
	confRoomArray.unshift({"Confroom":"Select"});
	oModel.setProperty("/ConfroomData",confRoomArray);
	}else{
	that.getView().byId("idroomselect").setEnabled(false);
	that.getView().byId("idroomselect").setSelectedKey("Select");
	}
},

//table filter start
handleChangeSearch: function(oEvent) {

var tableId = this.byId("idtable");
var inputValue = oEvent.getParameter("query");
var trimValue = inputValue.trim();
var filterArr = [];
var items = tableId.getBinding("items");
var filter1 = new sap.ui.model.Filter("Building", sap.ui.model.FilterOperator.Contains, trimValue);
var filter2 = new sap.ui.model.Filter("Bookdate", sap.ui.model.FilterOperator.Contains, trimValue);

filterArr = [filter1, filter2];
var finalFilter = new sap.ui.model.Filter({
filters: filterArr,
and: false
});
items.filter(finalFilter);
},
// table filter end


//create or book the room
onPressBook:function(){
	var oModel = this.getOwnerComponent().getModel();
	

	
							
	var oEntry = {};		
	oEntry.Description =this.byId("idinptdes").getValue();
	oEntry.Userid =this.byId("idinptusr").getText();
	oEntry.Location =this.byId("idlocationselect").getSelectedItem().getProperty("text");
	oEntry.Title =this.byId("idinpttitle").getValue();
	oEntry.Building =this.byId("idBuildingselect").getSelectedItem().getProperty("text");
	oEntry.Contactnum =this.byId("idinptpn").getValue();
	oEntry.Confroom =this.byId("idroomselect").getSelectedItem().getProperty("text");
	oEntry.Starttime =this.byId("idtimestart").getValue().replace(":","").replace(":","");
	oEntry.Endtime =this.byId("idtimeend").getValue().replace(":","").replace(":","");
	oEntry.Bookdate =this.byId("idbookdate").getValue().replace("-","").replace("-","");
	oEntry.Createdate =this.byId("idcreatedate").getValue().replace("-","").replace("-","");
	oEntry.Email =this.byId("idinputemail").getValue();	
	
	var sUrl = '/ReservationSet';
	oModel.create(sUrl,oEntry,{
		method: "POST",
		success: function(){sap.m.MessageToast.show("Your Conference Room booking is Successful");},
		error: function(){sap.m.MessageToast.show("Failed to book the Room");}
	});	
	},
	
	
	

// delete the booked room
	onPressDelete:function(){
		var oModel = this.getOwnerComponent().getModel();
		
		var oEntry = {};		
		oEntry.Description =this.byId("idinptdes").getValue();
		oEntry.Userid =this.byId("idinptusr").getText();
		oEntry.Location =this.byId("idlocationselect").getSelectedItem().getProperty("text");
		oEntry.Title =this.byId("idinpttitle").getValue();
		oEntry.Building =this.byId("idBuildingselect").getSelectedItem().getProperty("text");
		oEntry.Contactnum =this.byId("idinptpn").getValue();
		oEntry.Confroom =this.byId("idroomselect").getSelectedItem().getProperty("text");
		oEntry.Starttime =this.byId("idtimestart").getValue().replace(":","").replace(":","");
		oEntry.Endtime =this.byId("idtimeend").getValue().replace(":","").replace(":","");
		oEntry.Bookdate =this.byId("idbookdate").getValue().replace("-","").replace("-","");
		oEntry.Createdate =this.byId("idcreatedate").getValue().replace("-","").replace("-","");
		oEntry.Email =this.byId("idinputemail").getValue();	
		
		var sUrl = '/ReservationSet';
		oModel.remove(sUrl,oEntry,{
			method: "DELETE",
			success: function(){sap.m.MessageToast.show("your Booked Conference Room is Deleted");},
			error: function(){sap.m.MessageToast.show("Failed to Delete the Booked Room");}
		});	
		},
		
		
		
	
// icon tab button visible	
	handleIconTabBarSelect :function(oEvent){
		var skey = oEvent.getParameter("key"); 
		if (skey == "Reservation") 
		{
			/*this.getView().byId("userPanel").setVisible(false);
			this.getView().byId("iduserdtlform").setVisible(false);*/
			this.getView().byId("idcheckbtn").setVisible(false);
			this.getView().byId("idbookbtn").setVisible(false);
			this.getView().byId("iddeletebtn").setVisible(true);
			this.getView().byId("idprintbtn").setVisible(true);
			this.getView().byId("idmailbtn").setVisible(true);
		
		}
		else
		{
			/*this.getView().byId("userPanel").setVisible(true);
			this.getView().byId("iduserdtlform").setVisible(true);*/
			this.getView().byId("idcheckbtn").setVisible(true);
			this.getView().byId("idbookbtn").setVisible(true);
			this.getView().byId("iddeletebtn").setVisible(false);
			this.getView().byId("idprintbtn").setVisible(false);
			this.getView().byId("idmailbtn").setVisible(false);
		}
	},
	
	
	
	


});





