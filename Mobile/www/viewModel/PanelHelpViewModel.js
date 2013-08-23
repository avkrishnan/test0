/*globals ko*/

function PanelHelpViewModel() {

	
	
	var that = this;
	
	
	this.template = "panelHelpView";
    
    this.viewid = "V-00";
    this.viewname = "panelhelp";
    
    
	this.title = ko.observable();
    this.relationship = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
	this.dirty = [];
    
    this.setAllDirty = function(){
        that.dirty = [];
    }
    
    this.setClean = function(viewName){
        that.dirty.push(viewName);
    }
    
    this.isDirty = function(viewName){
        
        return !(( that.dirty.indexOf(viewName) != -1));
    }
    
		

	
	

	
	
}
