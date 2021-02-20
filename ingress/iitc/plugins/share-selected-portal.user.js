// ==UserScript==
// @author         Mathieu CLAVEL
// @name           IITC plugin: Share selected portal
// @category       Controls
// @version        0.1.0
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
plugin_info.dateTimeVersion = '2021-02-20-200228';
plugin_info.pluginId = 'share-selected-portal';
//END PLUGIN AUTHORS NOTE

// use own namespace for plugin
window.plugin.ssp = function() {};

// Append a share link in sidebar.
window.plugin.ssp.onPortalDetailsUpdated = function() {
  $('.shareLink').remove();

  const portalGuid = window.selectedPortal;

  if(portalGuid == null) return;

  const data = window.portals[portalGuid].options.data;

  const lat = data.latE6 / 1E6;
  const lng = data.lngE6 / 1E6;
  const title = (data && data.title) || 'null';

  const posOnClick = window.showPortalPosLinks.bind(this, lat, lng, title);

  const shareLink = $('<a>', { class: 'shareLink' }).text('Share portal').click(posOnClick);

  // Prepend the share link to mobile status-bar
  $('#updatestatus').prepend(shareLink);
  $('#updatestatus .shareLink').attr('title', '');

}

const setup = function() {

  if (typeof android !== 'undefined' && android && android.intentPosLink) {
    window.addHook('portalDetailsUpdated', window.plugin.ssp.onPortalDetailsUpdated);
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

