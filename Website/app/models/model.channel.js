define('model.channel',
	['ko'],
	function (ko) {
		var
			Channel = function () {
				var self = this;
				self.id = ko.observable();
				self.name = ko.observable();
				self.isNullo = false;
				return self;
			};
		
		Channel.Nullo = new Channel().id(0).name('Not a channel');
		Channel.Nullo.isNullo = true;

		return Channel;
	});