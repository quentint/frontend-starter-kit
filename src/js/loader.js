Modernizr.load([

	// Respond
	'js/vendor/respond.min.js'

	// jQuery
	,{
		load: '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
		complete: function () {
			if (!window.jQuery) {
				Modernizr.load('js/vendor/jquery-1.11.1.min.js');
			}
		}
	}

	// Smart menus
	,'js/vendor/jquery.smartmenus.min.js'

	// Slick (slideshow)
	,{
		load: '//cdn.jsdelivr.net/jquery.slick/1.3.9/slick.min.js',
		complete: function() {
			if (!window.jQuery.fn.slick) {
				Modernizr.load('slick/slick.min.js');
			}
		}
	}

	// Main script
	,'js/script.min.js'
]);