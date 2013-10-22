/*globals ko*/

function SelectIconViewModel() {
	/// <summary>
	/// A view model that displays the communication means and urgency that user wants to recieve communications
	/// </summary>
	
	// --- properties
	
    this.template = "selectIconView";
    this.viewid = "V-??";
    this.viewname = "SelectIcon";
    this.displayname = "Set Icon";
    
    this.hasfooter = true;
    
    this.callback = function(){};
    this.iconSets = ko.observableArray();
	this.iconsToSelect = ko.observableArray([]);
    this.navText = ko.observable('Channel Settings');
	var that = this;
    
	this.applyBindings = function(){
        $("#" + that.template).on("pagebeforeshow", null, function (e, data) {
                            
                            
                     var setkeys = Object.keys(EVERNYM_ICONS);
                     that.iconSets(setkeys);
                     that.activate();               
                                    
        });
    };
    
    this.setCallBack = function(_callback){
        that.callback = _callback;
    };
    
    this.backNav = function(){
        $.mobile.changePage("#" + channelSettingsViewModel.template);
    };
    
    this.activate = function() {
        
        //alert(JSON.stringify(EVERNYM_ICONS));
        that.showIcons('sports');
        
            
	};
	
	
	this.showIcons = function(icon_set){
	    var _icons = [];
        
        //var icon_set = 'animals';
        
        var set = EVERNYM_ICONS[icon_set];
        
        var rows = set.rows;
        var cols = set.columns;
        
        var target_size = 60 ;
        
        var bgsize = target_size * set.columns; 
        
        for (var row = 0; row < rows; row ++){
            for (var col = 0; col < cols; col ++){
                if (row * cols + col >= set.count) {break;}
            
                _icons.push({
                image: set.image,
                set: icon_set,
                id: row * cols + col,
                left:col * target_size,
                top: row * target_size,
                width: target_size,
                height: target_size,
                'bgsize':  bgsize + 'px ' + bgsize + 'px'
                });
            }
        }
        
        that.iconsToSelect(_icons);
	
	};
	
	
	//TODO make a more general function to get the iconObj, so it's not in two places.
	
   
    this.mapImage = function(icon_set, id, target_size){
   
        var set = EVERNYM_ICONS[icon_set];
        var rows = set.rows;
        var cols = set.columns;
        var bgsize = target_size * set.columns;
        
        var col = id % cols;
        var row = Math.floor(id / cols);
        
        var iconObj = {
		    image: set.image,
		    set: icon_set,
			id: id,
			left: -(col * target_size) + 'px',
			top: -(row * target_size) + 'px',
			width: target_size + 'px',
			height: target_size + 'px',
			'bgsize':  bgsize + 'px ' + bgsize + 'px'
        };
        
        return iconObj;
   
    };
    this.pickImageSet = function(set){
        
        that.showIcons(set);
    };
   
    this.pickImage = function(imageObj){
        that.callback(imageObj);
    };
	
}
