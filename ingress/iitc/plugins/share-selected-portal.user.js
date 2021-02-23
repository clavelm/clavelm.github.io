// ==UserScript==
// @author         Mathieu CLAVEL
// @name           IITC plugin: Share selected portal
// @category       Controls
// @version        0.1.1.20210223.210304
// @description    Add a share link when a portal is selected
// @id             share-selected-portal
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL      https://clavelm.github.io/ingress/iitc/plugins/share-selected-portal.user.js
// @downloadURL    https://clavelm.github.io/ingress/iitc/plugins/share-selected-portal.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'local';
plugin_info.dateTimeVersion = '2021-02-23-210304';
plugin_info.pluginId = 'share-selected-portal';
//END PLUGIN AUTHORS NOTE

// use own namespace for plugin
window.plugin.ssp = function() {};

window.plugin.ssp.shareLink = undefined;

// Append a share link in sidebar.
window.plugin.ssp.onPortalDetailsUpdated = function() {

  var portalGuid = window.selectedPortal;

  if(portalGuid == null) return;

  var data = window.portals[portalGuid].options.data;

  var lat = data.latE6 / 1E6;
  var lng = data.lngE6 / 1E6;
  var title = (data && data.title) || 'null';

  var posOnClick = window.showPortalPosLinks.bind(this, lat, lng, title);

  window.plugin.ssp.shareLink.off('click').on('click', posOnClick);

  // Prepend the share link to mobile status-bar
  $('#updatestatus').prepend(window.plugin.ssp.shareLink);

}

window.plugin.ssp.onPortalSelected = function() {
  window.plugin.ssp.shareLink.remove();
}

var setup = function() {

  if (typeof android !== 'undefined' && android && android.intentPosLink) {
    window.addHook('portalDetailsUpdated', window.plugin.ssp.onPortalDetailsUpdated);
    window.addHook('portalSelected', window.plugin.ssp.onPortalSelected);

    var span = $('<span>')
      .css('background-image', 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQflAhcVAAgpZfV+AAAAw0lEQVQoz3WRsQ7BYBSFj8YgdGLxDiab6EMw4QmsXqCtF7F3kngMsRiwsti1UdFK5DP4G8HfM93knuR+51zJIubExISyiwlXAFLGkmNxDORKkhoaWgx01TNjpsPvss2CJxuOJCTscIubEQEtZiScmeJQpU+fakGcAhkPUkLq/8wxb+UMbZkc8fHaU4dcgYy85ITEiAif5hekh2cgS2LGJOxNzN+iOBnsO76lycpWazPW1LH/YqWbJCnVsuyfARcu+JL0AjA1mAmE9DgjAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTIzVDIxOjAwOjA4KzAwOjAwneNzuQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0yM1QyMTowMDowOCswMDowMOy+ywUAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC")')
      .css('background-size', 'cover')
      .css('background-repeat', 'no-repeat')
      .css('display', 'inline-block')
      .css('float', 'left')
      .css('margin', '3px 1px 0 4px')
      .css('width', '16px')
      .css('height', '15px')
      .css('overflow', 'hidden');

    window.plugin.ssp.shareLink = $('<a>')
      .addClass('shareLink')
      .css('float', 'left')
      .css('margin', '-19px 0 0 -5px')
      .css('padding', '0 3px 1px 4px')
      .css('background', '#262c32')
      .append(span);
  }

};
setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

