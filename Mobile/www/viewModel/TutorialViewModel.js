/*globals ko*/

function TutorialViewModel() {  
	// --- properties
	
	var that = this;
	
	this.template = "tutorialView";
	this.viewid = "V-51";
	this.viewname = "Tutorial";
	this.displayname = "Tutorials";

	this.hasfooter = false;
	
	this.applyBindings = function(){
		$("#" + that.template).on("pagebeforeshow", function (e, data) {	
			that.activate();		
		});
	};
	
	this.activate = function () {	
		CustomSwipe('div.tutorialslides', 'swipeleft', 'next');
		CustomSwipe('div.tutorialslides', 'swiperight', 'prev');
		
		function CustomSwipe(Element, Event, functionName) {							
			$(Element).on(Event, function() {
				$('header ul li').removeClass('active');
				var slideDiv = $(this)[functionName]("div.tutorialslides").attr('id');				
				$(this).hide();	 
				if(typeof slideDiv == 'undefined') {
					slideDiv = $(this).attr('id');     
				}			
				$('header ul li#'+slideDiv+'Active').addClass('active');
				$('#'+slideDiv).show();
			});	 			
		}     	   
	};
}
