/*
 * Based on
 *
 * jReject (jQuery Browser Rejection Plugin)
 * Version 1.0.2
 * URL: http://jreject.turnwheel.com/
 * Description: jReject is a easy method of rejecting specific browsers on your site
 * Author: Steven Bower (TurnWheel Designs) http://turnwheel.com/
 * Copyright: Copyright (c) 2009-2013 Steven Bower under dual MIT/GPLv2 license.
 *
 * jQuery Browser Plugin
 * Version 2.4 / jReject 1.0.x
 * URL: http://jquery.thewikies.com/browser
 * Description: jQuery Browser Plugin extends browser detection capabilities and
 * can assign browser selectors to CSS classes.
 * Author: Nate Cavanaugh, Minhchau Dang, Jonathan Neal, & Gregory Waxman
 * Updated By: Steven Bower for use with jReject plugin
 * Copyright: Copyright (c) 2008 Jonathan Neal under dual MIT/GPL license.
 *
 */

(function($) {
$.testBrowser = function(options) {
	var opts = $.extend(true,{
		reject : { // Rejection flags for specific browsers
			all: false, // Covers Everything (Nothing blocked)
			// chrome: true, safari: true,
			opera14: true, trident: true, khtml: true, presto: true, msie: true, firefox: true, unknown: true
			/*
			 * Possibilities are endless...
			 *
			 * // MSIE Flags (Global, 5-8)
			 * msie, msie5, msie6, msie7, msie8,
			 * // Firefox Flags (Global, 1-3)
			 * firefox, firefox1, firefox2, firefox3,
			 * // Konqueror Flags (Global, 1-3)
			 * konqueror, konqueror1, konqueror2, konqueror3,
			 * // Chrome Flags (Global, 1-4)
			 * chrome, chrome1, chrome2, chrome3, chrome4,
			 * // Safari Flags (Global, 1-4)
			 * safari, safari2, safari3, safari4,
			 * // Opera Flags (Global, 7-10)
			 * opera, opera7, opera8, opera9, opera10,
			 * // Rendering Engines (Gecko, Webkit, Trident, KHTML, Presto)
			 * gecko, webkit, trident, khtml, presto,
			 * // Operating Systems (Win, Mac, Linux, Solaris, iPhone)
			 * win, mac, linux, solaris, iphone,
			 * unknown // Unknown covers everything else
			 */
		},
		display: ['chrome', 'safari', 'opera', 'gcf'], // What browsers to display and their order (default set below)
		browserShow: true, // Should the browser options be shown?
		browserInfo: { // Settings for which browsers to display
			firefox: { text: 'Mozilla Firefox', url: 'http://www.mozilla.com/firefox/'},
			chrome: { text: 'Google Chrome', url: 'http://www.google.com/chrome/' },
			safari: { text: 'Safari', url: 'http://www.apple.com/safari/download/' },
			opera: { text: 'Opera', url: 'http://www.opera.com/download/' },
			msie: { text: 'Internet Explorer 9', url: 'http://www.microsoft.com/windows/Internet-explorer/' },
			gcf: { text: 'Google Chrome Frame', url: 'http://code.google.com/chrome/chromeframe/',
				allow: { all: false, msie: true } }// This browser option will only be displayed for MSIE
		},

		// Message
		header: 'We do require a webkit browser to run this website',
		paragraph1: 'Just click on the icons below to get to a download page:',
		paragraph2: '&nbsp;',
		close: false, // Allow closing of window
		// Message displayed below closing link
		closeMessage: '',
		closeLink: '', // Text for closing link
		closeURL: '#', // Close URL
		closeESC: false, // Allow closing of window with esc key

		imagePath: 'libs/img/', // Path where images are located
		overlayBgColor: '#000', // Background color for overlay
		overlayOpacity: 0.8, // Background transparency (0-1)

		// Fade in time on open ('slow','medium','fast' or integer in ms)
		fadeInTime: 'fast',
		// Fade out time on close ('slow','medium','fast' or integer in ms)
		fadeOutTime: 'fast',

	}, options);

	// Set default browsers to display if not already defined
	if (opts.display.length < 1) {
		opts.display = ['chrome','firefox','safari','opera','gcf','msie'] }

	// beforeRject: Customized Function
	if ($.isFunction(opts.beforeReject)) { opts.beforeReject() }

	// Disable 'closeESC' if closing is disabled (mutually exclusive)
	if (!opts.close) { opts.closeESC = false }

	// This function parses the advanced browser options
	var browserCheck = function(settings) {
		// Check 1: Look for 'all' forced setting
		// Check 2: Operating System (eg. 'win','mac','linux','solaris','iphone')
		// Check 3: Rendering engine (eg. 'webkit', 'gecko', 'trident')
		// Check 4: Browser name (eg. 'firefox','msie','chrome')
		// Check 5: Browser+major version (eg. 'firefox3','msie7','chrome4')
		return (settings['all'] ? true : false) ||
			(settings[$.browserID.os.name] ? true : false) ||
			(settings[$.browserID.layout.name] ? true : false) ||
			(settings[$.browserID.name] ? true : false) ||
			(settings[$.browserID.className] ? true : false);
	};

	// Determine if we need to display rejection for this browser, or exit
	if (!browserCheck(opts.reject)) {
		if ($.isFunction(opts.onFail)) { opts.onFail() } // onFail: Customized Function
		return false }

	// Load background overlay (jr_overlay) + Main wrapper (jr_wrap) +
	// Inner Wrapper (jr_inner) w/ opts.header (jr_header) +
	// opts.paragraph1/opts.paragraph2 if set
	var html = '<div id="jr_overlay"></div><div id="jr_wrap"><div id="jr_inner">'+
		'<h1 id="jr_header">'+opts.header+'</h1>'+
		(opts.paragraph1 === '' ? '' : '<p>'+opts.paragraph1+'</p>')+
		(opts.paragraph2 === '' ? '' : '<p>'+opts.paragraph2+'</p>');

	if (opts.browserShow) {
		html += '<ul>';
		var displayNum = 0;
		for (var x in opts.display) { // Generate the browsers to display
			var browser = opts.display[x]; // Current Browser
			var info = opts.browserInfo[browser] || false; // Browser Information
			// If no info exists for this browser
			// or if this browser is not suppose to display to this user
			if (!info || (info['allow'] != undefined && !browserCheck(info['allow']))) { continue }
			var url = info.url || '#'; // URL to link text/icon to
			// Generate HTML for this browser option
			html += '<li id="jr_'+browser+'"><div class="jr_icon"></div>'+
					'<div><a href="'+url+'">'+(info.text || 'Unknown')+'</a>'+
					'</div></li>';
			++displayNum; }
		html += '</ul>'; }

	
	html += '<div id="jr_close">'+ // Close list and #jr_list
	// Display close links/message if set
	(opts.close ? '<a href="'+opts.closeURL+'">'+opts.closeLink+'</a>'+
		'<p>'+opts.closeMessage+'</p>' : '')+'</div>'+
	'</div></div>'; // Close #jr_inner and #jr_wrap

	var element = $('<div>'+html+'</div>'); // Create element
	var size = $.fn.window_pageSize(); // Get page size
	var scroll = $.fn.window_scrollSize(); // Get page scroll

	// This function handles closing this reject window
	// When clicked, fadeOut and remove all elements
	element.bind('closejr', function() {
		
		if (!opts.close) { return false } // Make sure the permission to close is granted
		if ($.isFunction(opts.beforeClose)) { opts.beforeClose() } // Customized Function

		$(this).unbind('closejr'); // Remove binding function so it doesn't get called more than once

		// Fade out background and modal wrapper
		$('#jr_overlay,#jr_wrap').fadeOut(opts.fadeOutTime,function() {
			$(this).remove(); // Remove element from DOM
			if ($.isFunction(opts.afterClose)) { opts.afterClose() } });// afterClose: Customized Function

		// Show elements that were hidden for layering issues
		var elmhide = 'embed.jr_hidden, object.jr_hidden, select.jr_hidden, applet.jr_hidden';
		$(elmhide).show().removeClass('jr_hidden');

		return true });

	// Called onClick for browser links (and icons)
	// Opens link in new window
	var openBrowserLinks = function(url) {
		// Open window, generate random id value
		window.open(url, 'jr_'+ Math.round(Math.random()*11));
		return false };

	/*
	 * Traverse through element DOM and apply JS variables
	 */

	// Creates 'background' (div)
	element.find('#jr_overlay').css({
		width: size[0],
		height: size[1],
		background: opts.overlayBgColor,
		opacity: opts.overlayOpacity });

	// Wrapper for our pop-up (div)
	element.find('#jr_wrap').css({ top: scroll[1]+(size[3]/4), left: scroll[0] });

	// Wrapper for inner centered content (div)
	element.find('#jr_inner').css({
		minWidth: displayNum*200,
		maxWidth: displayNum*200,
		// min/maxWidth not supported by IE
		width: $.browserID.layout.name == 'trident' ? displayNum*280 : 'auto' });

	element.find('#jr_inner li').css({ // Browser list items (li)
		background: 'transparent url("'+opts.imagePath+'background_browser.gif") no-repeat scroll left top' });

	element.find('#jr_inner li .jr_icon').each(function() {
		var self = $(this); // Dynamically sets the icon background image
		self.css('background','transparent url('+opts.imagePath+'browser_'+
				(self.parent('li').attr('id').replace(/jr_/,''))+'.gif)'+
					' no-repeat scroll left top');
		self.click(function () { // Send link clicks to openBrowserLinks
			var url = $(this).next('div').children('a').attr('href');
			openBrowserLinks(url); }) });

	element.find('#jr_inner li a').click(function() {
		openBrowserLinks($(this).attr('href'));
		return false; });

	// Bind closing event to trigger closejr
	// to be consistant with ESC key close function
	element.find('#jr_close a').click(function() {
		$(this).trigger('closejr');
		// If plain anchor is set, return false so there is no page jump
		if (opts.closeURL === '#') { return false } });

	// Set focus (fixes ESC key issues with forms and other focus bugs)
	$('#jr_overlay').focus();

	// Hide elements that won't display properly
	$('embed, object, select, applet').each(function() {
		if ($(this).is(':visible')) {
			$(this).hide().addClass('jr_hidden') } });

	// Append element to body of document to display
	$('body').append(element.hide().fadeIn(opts.fadeInTime));

	// Handle window resize/scroll events and update overlay dimensions
	$(window).bind('resize scroll',function() {
		var size = $.fn.window_pageSize(); // Get size
		$('#jr_overlay').css({ width: size[0], height: size[1] });

		var scroll = $.fn.window_scrollSize(); // Get page scroll
		$('#jr_wrap').css({ top: scroll[1] + (size[3]/4), left: scroll[0] }); });

	// Add optional ESC Key functionality
	if (opts.closeESC) {
		$(document).bind('keydown',function(event) {
			if (event.keyCode == 27) { element.trigger('closejr') } }) }

	// afterReject: Customized Function
	if ($.isFunction(opts.afterReject)) { opts.afterReject() }

	return true;
};

})(jQuery);

/*
 * jQuery Browser Plugin extension
 */

(function ($) {
	$.checkBrowser = function (a, z) {
		$.browserID = {};
		var u = 'unknown',
			x = 'X',
			m = function (r, h) {
				for (var i = 0; i < h.length; i = i + 1) { r = r.replace(h[i][0], h[i][1]) }
				return r; },
			c = function (i, a, b, c) {
				var r = { name: m((a.exec(i) || [u, u])[1], b) };
				r[r.name] = true;
				if (!r.opera) { r.version = (c.exec(i) || [x, x, x, x])[3] }
				else { r.version = window.opera.version() }
				if (/safari/.test(r.name)) {
					var safariversion = /(safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/;
					var res = safariversion.exec(i)
					if (res && res[3] && res[3] < 400) { r.version = '2.0' } }
				else if (r.name === 'presto') {
					r.version = ($.browserID.version > 9.27) ? 'futhark' : 'linear_b'; }
				r.versionNumber = parseFloat(r.version, 10) || 0;
				var minorStart = 1;
				if (r.versionNumber < 100 && r.versionNumber > 9) { minorStart = 2 }
				r.versionX = (r.version !== x) ? r.version.substr(0, minorStart) : x;
				r.className = r.name + r.versionX;
				return r };
		a = (/Opera|Navigator|Minefield|KHTML|Chrome|CriOS/.test(a) ? m(a, [
			[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
			['Chrome Safari', 'Chrome'],
			['CriOS', 'Chrome'],
			['KHTML', 'Konqueror'],
			['Minefield', 'Firefox'],
			['Navigator', 'Netscape'] ]) : a).toLowerCase();
		$.browserID = $.extend((!z) ? $.browserID : {}, c(a,
			/(camino|chrome|crios|firefox|netscape|konqueror|lynx|msie|opera|safari)/,
			[],
			/(camino|chrome|crios|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));
		$.browserID.layout = c(a, /(gecko|konqueror|msie|opera|webkit)/, [
			['konqueror', 'khtml'],
			['msie', 'trident'],
			['opera', 'presto']
		], /(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);
		$.browserID.os = {
			name: (/(win|mac|linux|sunos|solaris|iphone|ipad)/.
					exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris') };
		if (!z) {
			$('html').addClass([$.browserID.os.name, $.browserID.name, $.browserID.className,
				$.browserID.layout.name, $.browserID.layout.className].join(' ')); } };

	$.checkBrowser(navigator.userAgent);
}(jQuery));
