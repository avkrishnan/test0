function TutorialViewModel() {
	var self = this;
  self.template = 'tutorialView';
  self.viewid = 'V-51';
  self.viewname = 'Introduction';
  self.displayname = 'Introduction to Evernym Channels';		

  self.activate = function() {				
		$('.tutorial ul li').removeClass('active');
		$('.tutorial ul li:first-child').addClass('active');		
		$('.tutorials .tutorialslides').hide();
		$('.tutorials .tutorialslides:first-child').show();
		dotSlide('.tutorial ul li', 'next', 'div.tutorialslides');
		SwipeSlide('div.tutorialslides', 'swipeleft', 'next');
		SwipeSlide('div.tutorialslides', 'swiperight', 'prev');
		navigation('div.new-user', 'next', 'div.tutorialslides');

		/* This function will slide tutorial slides on arrow click */
		function dotSlide(clickElement, functionName, Element) {
			$(clickElement).on('click',function() {
				$('header ul li').removeClass('active');
				$(this).addClass('active');
				$(Element).hide();
				var dotId = $(this).attr('id');
				var slideview = dotId.substr(0,6);
				$('#'+slideview).show();
			});
		}

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
		};
		
		/* This function will slide tutorial slides on arrow click */
		function navigation(clickElement, functionName, Element) {
			$(clickElement).on('click',function() {
				$('header ul li').removeClass('active');
				$(Element).hide();
				var slideview = $(this).parent()[functionName]("div "+Element).attr('id');
				if(typeof slideview == 'undefined') {
					slideview = $(this).parent().attr('id');
				}
				$('#'+slideview).show();
				$('header ul li#' + slideview + 'Active').addClass('active');
			});
		}
		$('img').on('dragstart', function(event) {
			event.preventDefault();
		});
  };

  self.getStartedCommand = function() {
		goToView('userGuideView');
  };
};

TutorialViewModel.prototype = new ENYM.ViewModel();
TutorialViewModel.prototype.constructor = TutorialViewModel;