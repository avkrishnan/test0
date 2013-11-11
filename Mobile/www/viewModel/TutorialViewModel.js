/*globals ko*/
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
		var newUser = localStorage.getItem('newusername');
		if(token == '' || token == null){
			goToView('loginView');
		} else if(newUser == '' || newUser == null) {
			goToView('channelListView');
		}
		$('.tutorial ul li').removeClass('active');
		$('.tutorial ul li:first-child').addClass('active');		
		$('.tutorials .tutorialslides').hide();
		$('.tutorials .tutorialslides:first-child').show();
		SwipeSlide('div.tutorialslides', 'swipeleft', 'next');
		SwipeSlide('div.tutorialslides', 'swiperight', 'prev');
		navigation('.msg-content span', 'next', 'div.tutorialslides');

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
				var slideview = $(this).parent().parent()[functionName]("div "+Element).attr('id');
				if(typeof slideview == 'undefined') {
					slideview = $(this).parent().parent().attr('id');
				}
				$('#'+slideview).show();
				$('header ul li#' + slideview + 'Active').addClass('active');
			});
		}
		$('img').on('dragstart', function(event) {
			event.preventDefault();
		});
  };

  that.getStartedCommand = function() {
		localStorage.removeItem('newuseremail');
		localStorage.removeItem('newusername');
		localStorage.removeItem('newuserpassword');		
    if(localStorage.getItem("action") == 'follow_channel') {
			localStorage.removeItem('action');
			goToView('channelMessagesView');
		}
		else {
			goToView('channelListView');
		}
  }
}