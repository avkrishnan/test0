/*globals ko*/
/* To do - Pradeep Kumar */
function TutorialViewModel() {
  var that = this;
  this.template = 'tutorialView';
  this.viewid = 'V-51';
  this.viewname = 'Tutorial';
  this.displayname = 'Tutorials';		

  this.applyBindings = function() {
    $('#' + that.template).on('pagebeforeshow', function(e, data) {
      that.activate();
    });
  };

  /* Methods */
  this.activate = function() {
		var token = ES.evernymService.getAccessToken();		
		var newUser = appCtx.getItem('newusername');
		if(token == '' || token == null){
			goToView('loginView');
		} else if(newUser == '' || newUser == null) {
				goToView('homeView');
		}			
		$('.tutorial ul li').removeClass('active');
		$('.tutorial ul li:first-child').addClass('active');		
		$('.tutorials .tutorialslides').hide();
		$('.tutorials .tutorialslides:first-child').show();
		SwipeSlide('div.tutorialslides', 'swipeleft', 'next');
		SwipeSlide('div.tutorialslides', 'swiperight', 'prev');
		navigation('.msg-content em', 'next', 'div.tutorialslides');

		/* This function will swipe tutorial slides */
		function SwipeSlide(Element, Event, functionName) {
			$(Element).on(Event, function() {
				$('header ul li').removeClass('active');
				var swipeView = $(this)[functionName](Element).attr('id');
				$(this).hide();
				if (typeof swipeView == 'undefined') {
					swipeView = $(this).attr('id');
				}
				$('header ul li#' + swipeView + 'Active').addClass('active');
				$('#' + swipeView).show();
			});
		}
		
		/* This function will slide tutorial slides on arrow click */
		function navigation(clickElement, functionName, Element) {
			$(clickElement).on('click',function() {
				$('header ul li').removeClass('active');
				$(Element).hide();
				var slideview = $(this).parent().parent().parent()[functionName]("div "+Element).attr('id');
				if(typeof slideview == 'undefined') {
					slideview = $(this).parent().parent().parent().attr('id');
				}
				$('#'+slideview).show();
				$('header ul li#' + slideview + 'Active').addClass('active');
			});
		}
		$('img').on('dragstart', function(event) {
			event.preventDefault();
		});
  };

  this.getStartedCommand = function() {
		appCtx.removeItem('newuseremail');
		appCtx.removeItem('newusername');
		appCtx.removeItem('newuserpassword');	
    if(appCtx.getItem("action") == 'follow_channel') {
			var callbacks = {
				success: function() {
					appCtx.removeItem('action');
					var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+channel.name};
					showToast(toastobj);
					goToView('channelMessagesView');					
				},
				error: function(data, status, details) {
					var toastobj = {type: 'toast-error', text: details.message};
					showToast(toastobj);
				}
			};						
			var channel = JSON.parse(appCtx.getItem('currentChannel'));
			ES.channelService.followChannel(channel.id, callbacks);
		}
		else {
			goToView('homeView');
		}
  }
	
}