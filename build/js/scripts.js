function getMealTypes(){jQuery.ajax({type:"POST",url:ajax_object.ajax_url,data:{action:"dabba_meal_types"},dataType:"json",success:function(e){if("object"==typeof e){$meal_container=jQuery("#meal_types");var t=0;for($meal_container.find("select");t<e.length;t+=1){var n=jQuery("<option></option>");n.attr("value",e[t].id),n.html(e[t].name),$meal_container.find("select").append(n)}$meal_container.multiSelect({label:$meal_container.data("placeholder")}),jQuery('[name="meal_types"]').val(""),$meal_container.on("click",".multiselect-wrap",(function(){var e=jQuery('[name="meal_types"]').val(),t=!1;if(e){var n=e.split(",");n!=window.meal_types&&(window.meal_types=n,t=!0)}else $meal_container.find(".multiselect-selected").html($meal_container.data("placeholder")),window.meal_types.length>0&&(window.meal_types=[],t=!0);window.dabba_map&&t&&getRestaurants(window.dabba_map.getBounds())}))}else console.log(e)}})}function getTags(){jQuery.ajax({type:"POST",url:ajax_object.ajax_url,data:{action:"dabba_get_tags"},dataType:"json",success:function(e){if("object"==typeof e){$tags_container=jQuery("#tags");var t=0;for($tags_container.find("select");t<e.length;t+=1){var n=jQuery("<option></option>");n.attr("value",e[t].id),n.html(e[t].name),$tags_container.find("select").append(n)}$tags_container.multiSelect({label:$tags_container.data("placeholder")}),jQuery('[name="tags"]').val(""),$tags_container.on("click",".multiselect-wrap",(function(){var e=!1,t=jQuery('[name="tags"]').val();if(t){var n=t.split(",");n!=window.tags&&(window.tags=n,e=!0)}else $tags_container.find(".multiselect-selected").html($tags_container.data("placeholder")),window.tags.length>0&&(window.tags=[],e=!0);window.dabba_map&&e&&getRestaurants(window.dabba_map.getBounds())}))}else console.log(e)}})}function getRestaurants(e){var t={action:"dabba_get_restaurants"};e&&(t.west=e.getWest(),t.south=e.getSouth(),t.east=e.getEast(),t.north=e.getNorth()),window.tags.length>0&&(t.tags=window.tags),window.meal_types.length>0&&(t.meal_types=window.meal_types),jQuery.ajax({type:"POST",url:ajax_object.ajax_url,data:t,dataType:"json",success:function(e){"object"==typeof e?("object"==typeof window.markers&&Object.keys(window.markers).forEach((e=>{window.markers[e].remove()})),e.forEach((e=>{addMarker(e)})),jQuery("#restaurants-list").loadTemplate(jQuery("#restaurant_card_template"),e),window.current_restaurant_id&&highlightMe(window.current_restaurant_id)):console.log(e)}})}function highlightMe(e){var t=jQuery("#restaurants-list");t.find(".active").removeClass("active");var n=t.find(e);n.addClass("active"),n.isInViewport()||n.prependTo("#restaurants-list")}function Deg2Rad(e){return e*(Math.PI/180)}function PythagorasEquirectangular(e,t,n,a){e=Deg2Rad(e),n=Deg2Rad(n),t=Deg2Rad(t);var o=((a=Deg2Rad(a))-t)*Math.cos((e+n)/2),i=n-e;return 6371*Math.sqrt(o*o+i*i)}function NearestZone(e,t){var n,a=99999;for(index=0;index<window.zones.length;++index){var o=PythagorasEquirectangular(e,t,window.zones[index].lat,window.zones[index].lng);o<a&&(n=index,a=o)}return window.zones[n]}function initMap(e){document.getElementById(e)&&(window.dabba_map=L.map(e,{dragging:!L.Browser.mobile,tap:!L.Browser.mobile,fullscreenControl:!0,scrollWheelZoom:!1}),centerToZone(window.zones[0]),L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',subdomains:["a","b","c"]}).addTo(window.dabba_map),window.dabba_map.on("zoomend",update),window.dabba_map.on("moveend",update),update())}function update(){jQuery("#restaurants-list").html(""),getRestaurants(window.dabba_map.getBounds())}function setLocation(e){if(window.dabba_map){new L.latLng(e.coords.latitude,e.coords.longitude);zone=NearestZone(e.coords.latitude,e.coords.longitude),centerToZone(zone)}}function centerToZone(e){if(window.dabba_map){var t=new L.latLng(e.lat,e.lng);window.dabba_map.setView(t,window.upper_zoom);var n=jQuery(".zones");n.find("a.active").removeClass("active"),n.find('a[data-name="'+e.name+'"]').addClass("active")}}function logError(e){console.warn(e)}function addMarker(e){if(window.dabba_map)if(void 0===window.markers["restaurant_"+e.id]){var t=new L.latLng(e.lat,e.lng),n=L.marker(t,{icon:window.myIcon}).addTo(window.dabba_map),a=jQuery("<div>").loadTemplate(jQuery("#popup_template"),e);n.bindPopup(a.html()),n.on("click",(function(t){window.current_restaurant_id="#restaurant_"+e.id,highlightMe(window.current_restaurant_id)})),window.markers["restaurant_"+e.id]=n}else window.markers["restaurant_"+e.id].addTo(window.dabba_map)}function addCard(e){jQuery("#restaurants-list").loadTemplate(jQuery("#restaurant_card"),e)}!function(e){var t;if("function"==typeof define&&define.amd)define(["leaflet"],e);else if("undefined"!=typeof module)t=require("leaflet"),module.exports=e(t);else{if(void 0===window.L)throw new Error("Leaflet must be loaded first");e(window.L)}}((function(e){e.Control.Fullscreen=e.Control.extend({options:{position:"topleft",title:{false:"View Fullscreen",true:"Exit Fullscreen"}},onAdd:function(t){var n=e.DomUtil.create("div","leaflet-control-fullscreen leaflet-bar leaflet-control");return this.link=e.DomUtil.create("a","leaflet-control-fullscreen-button leaflet-bar-part",n),this.link.href="#",this._map=t,this._map.on("fullscreenchange",this._toggleTitle,this),this._toggleTitle(),e.DomEvent.on(this.link,"click",this._click,this),n},_click:function(t){e.DomEvent.stopPropagation(t),e.DomEvent.preventDefault(t),this._map.toggleFullscreen(this.options)},_toggleTitle:function(){this.link.title=this.options.title[this._map.isFullscreen()]}}),e.Map.include({isFullscreen:function(){return this._isFullscreen||!1},toggleFullscreen:function(e){var t=this.getContainer();this.isFullscreen()?e&&e.pseudoFullscreen?this._disablePseudoFullscreen(t):document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitCancelFullScreen?document.webkitCancelFullScreen():document.msExitFullscreen?document.msExitFullscreen():this._disablePseudoFullscreen(t):e&&e.pseudoFullscreen?this._enablePseudoFullscreen(t):t.requestFullscreen?t.requestFullscreen():t.mozRequestFullScreen?t.mozRequestFullScreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT):t.msRequestFullscreen?t.msRequestFullscreen():this._enablePseudoFullscreen(t)},_enablePseudoFullscreen:function(t){e.DomUtil.addClass(t,"leaflet-pseudo-fullscreen"),this._setFullscreen(!0),this.fire("fullscreenchange")},_disablePseudoFullscreen:function(t){e.DomUtil.removeClass(t,"leaflet-pseudo-fullscreen"),this._setFullscreen(!1),this.fire("fullscreenchange")},_setFullscreen:function(t){this._isFullscreen=t;var n=this.getContainer();t?e.DomUtil.addClass(n,"leaflet-fullscreen-on"):e.DomUtil.removeClass(n,"leaflet-fullscreen-on"),this.invalidateSize()},_onFullscreenChange:function(e){var t=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;t!==this.getContainer()||this._isFullscreen?t!==this.getContainer()&&this._isFullscreen&&(this._setFullscreen(!1),this.fire("fullscreenchange")):(this._setFullscreen(!0),this.fire("fullscreenchange"))}}),e.Map.mergeOptions({fullscreenControl:!1}),e.Map.addInitHook((function(){var t;if(this.options.fullscreenControl&&(this.fullscreenControl=new e.Control.Fullscreen(this.options.fullscreenControl),this.addControl(this.fullscreenControl)),"onfullscreenchange"in document?t="fullscreenchange":"onmozfullscreenchange"in document?t="mozfullscreenchange":"onwebkitfullscreenchange"in document?t="webkitfullscreenchange":"onmsfullscreenchange"in document&&(t="MSFullscreenChange"),t){var n=e.bind(this._onFullscreenChange,this);this.whenReady((function(){e.DomEvent.on(document,t,n)})),this.on("unload",(function(){e.DomEvent.off(document,t,n)}))}})),e.control.fullscreen=function(t){return new e.Control.Fullscreen(t)}})),function(e){"use strict";function t(t,n,i){var s,c,u,d=this;return n=n||{},u=e.extend(!0,{async:!0,overwriteCache:!1,complete:null,success:null,error:function(){e(this).each((function(){e(this).html(u.errorMessage)}))},errorMessage:"There was an error loading the template.",paged:!1,pageNo:1,elemPerPage:10,append:!1,prepend:!1,beforeInsert:null,afterInsert:null,bindingOptions:{ignoreUndefined:!1,ignoreNull:!1,ignoreEmptyString:!1}},i),"array"===e.type(n)?(!0,a.call(this,t,n,u)):(function(e){return"string"==typeof e&&e.indexOf("/")>-1}(t)||(s=e(t),"string"==typeof t&&0===t.indexOf("#")&&(u.isFile=!1)),(c=u.isFile||void 0===u.isFile&&(void 0===s||0===s.length))&&!u.overwriteCache&&g[t]?o(t,d,n,u):c&&!u.overwriteCache&&g.hasOwnProperty(t)?function(e,t,n,a){w[e]?w[e].push({data:n,selection:t,settings:a}):w[e]=[{data:n,selection:t,settings:a}]}(t,d,n,u):c?r(t,d,n,u):l(s,d,n,u),this)}function n(t,n){n?v[t]=n:v=e.extend(v,t)}function a(n,a,o){o=o||{};var i,r=this,l=a.length,s=o.prepend&&!o.append,c=0,u=0,d=!1,p=[];if(o.paged){var f=(o.pageNo-1)*o.elemPerPage;a=a.slice(f,f+o.elemPerPage),l=a.length}return o.append||o.prepend||r.html(""),i=e.extend({},o,{append:!o.prepend&&!0,complete:function(e){(++c===l||d)&&(d&&o&&"function"==typeof o.error&&o.error.call(r,p),o&&"function"==typeof o.complete&&o.complete())},success:function(){++u===l&&o&&"function"==typeof o.success&&o.success()},error:function(e){d=!0,p.push(e)}}),s&&a.reverse(),e(a).each((function(){if(t.call(r,n,this,i),d)return!1})),this}function o(e,t,n,a){var o=g[e].clone();s.call(t,o,n,a),"function"==typeof a.success&&a.success()}function i(){return(new Date).getTime()}function r(t,n,a,o){g[t]=null;var r=t;o.overwriteCache&&(r=function(e){return-1!==e.indexOf("?")?e+"&_="+i():e+"?_="+i()}(r)),e.ajax({url:r,async:o.async,success:function(i){!function(e,t,n,a,o){var i;for(g[t]=e.clone(),s.call(n,e,a,o),"function"==typeof o.success&&o.success.call(n);w[t]&&(i=w[t].shift());)s.call(i.selection,g[t].clone(),i.data,i.settings),"function"==typeof i.settings.success&&i.settings.success.call(i.selection)}(e(i),t,n,a,o)},error:function(e){c(t,n,a,o,e)}})}function l(t,n,a,o){(t.is("script")||t.is("template"))&&(t=e.parseHTML(e.trim(t.html()))),s.call(n,t,a,o),"function"==typeof o.success&&o.success()}function s(t,n,a){(function(t,n,a){u("data-content",t,n=n||{},a,(function(e,t){e.html(h(e,t,"content",a))})),u("data-content-append",t,n,a,(function(e,t){e.append(h(e,t,"content",a))})),u("data-content-prepend",t,n,a,(function(e,t){e.prepend(h(e,t,"content",a))})),u("data-content-text",t,n,a,(function(e,t){e.text(h(e,t,"content",a))})),u("data-innerHTML",t,n,a,(function(e,t){e.html(h(e,t,"content",a))})),u("data-src",t,n,a,(function(e,t){e.attr("src",h(e,t,"src",a))}),(function(e){e.remove()})),u("data-href",t,n,a,(function(e,t){e.attr("href",h(e,t,"href",a))}),(function(e){e.remove()})),u("data-alt",t,n,a,(function(e,t){e.attr("alt",h(e,t,"alt",a))})),u("data-title",t,n,a,(function(e,t){e.attr("title",h(e,t,"title",a))})),u("data-id",t,n,a,(function(e,t){e.attr("id",h(e,t,"id",a))})),u("data-css",t,n,a,(function(e,t){e.css(h(e,t,"css",a))})),u("data-class",t,n,a,(function(e,t){e.addClass(h(e,t,"class",a))})),u("data-link",t,n,a,(function(t,n){var o=e("<a/>");o.attr("href",h(t,n,"link",a)),o.html(t.html()),t.html(o)})),u("data-link-wrap",t,n,a,(function(t,n){var o=e("<a/>");o.attr("href",h(t,n,"link-wrap",a)),t.wrap(o)})),u("data-options",t,n,a,(function(t,n){e(n).each((function(){e("<option/>").attr("value",this).text(this).appendTo(t)}))})),function(t,n,a){e("[data-template-bind]",t).each((function(){var t=e(this),o=e.parseJSON(t.attr("data-template-bind"));t.removeAttr("data-template-bind"),e(o).each((function(){var o;if(o="object"==typeof this.value?m(n,this.value.data):m(n,this.value),this.attribute){if(!d(this,o,a))return void t.remove();switch(this.attribute){case"content":case"innerHTML":t.html(f(t,o,this));break;case"contentAppend":t.append(f(t,o,this));break;case"contentPrepend":t.prepend(f(t,o,this));break;case"contentText":t.text(f(t,o,this));break;case"options":var i=this;e(o).each((function(){e("<option/>").attr("value",this[i.value.value]).text(f(t,this[i.value.content],i)).attr("selected",null!=typeof this[i.value.selected]&&this[i.value.selected]).appendTo(t)}));break;default:t.attr(this.attribute,f(t,o,this))}}}))}))}(t,n,a),u("data-value",t,n,a,(function(e,t){e.val(h(e,t,"value",a))}))})(t=e("<div/>").append(t),n,a),e(this).each((function(){var o=t.children().clone(!0);e("select",o).each((function(n,a){e(this).val(e("select",t).eq(n).val())})),a.beforeInsert&&a.beforeInsert(o,n),a.append?e(this).append(o):a.prepend?e(this).prepend(o):e(this).html("").append(o),a.afterInsert&&a.afterInsert(o,n)})),"function"==typeof a.complete&&a.complete.call(e(this),n)}function c(t,n,a,o,i){var r;for("function"==typeof o.error&&o.error.call(n,i),e(w[t]).each((function(e,t){"function"==typeof t.settings.error&&t.settings.error.call(t.selection,i)})),"function"==typeof o.complete&&o.complete.call(n);w[t]&&(r=w[t].shift());)"function"==typeof r.settings.complete&&r.settings.complete.call(r.selection);void 0!==w[t]&&w[t].length>0&&(w[t]=[])}function u(t,n,a,o,i,r){e("["+t+"]",n).each((function(){var n=e(this),l=n.attr(t),s=m(a,l);d(n,s,o)?(n.removeAttr(t),void 0!==s&&i?i(n,s):r&&r(n)):n.remove()}))}function d(e,t,n){var a=p(e,n);return!(a.ignoreUndefined&&void 0===t||a.ignoreNull&&null===t||a.ignoreEmptyString&&""===t)}function p(t,n){var a={};return t instanceof jQuery&&t.attr("data-binding-options")?(a=e.parseJSON(t.attr("data-binding-options")),t.removeAttr("data-binding-options")):"object"==typeof t&&t.hasOwnProperty("bindingOptions")&&(a=t.bindingOptions),e.extend({},n.bindingOptions,a)}function f(e,t,n,a){return n.formatter&&v[n.formatter]?function(a){return v[n.formatter].call(e,t,n.formatOptions,a)}(a):t}function m(e,t){if("this"===t)return e;for(var n,a=t.split("."),o=e;(n=a.shift())&&void 0!==o&&null!=o;)o=o[n];return o}function h(t,n,a,o){var i,r=t.attr("data-format-target");if((r===a||!r&&"content"===a)&&(i=t.attr("data-format"))&&"function"==typeof v[i]){var l=t.attr("data-format-options");return function(a){return v[i].call(t[0],n,l,e.extend({},a))}(o)}return n}var g={},w={},v={};n("nestedTemplateFormatter",(function(t,n,a){if(n){"string"==typeof n&&"{"===n[0]&&(n=e.parseJSON(n));var o=n.parentElement||"div",i=n.template||n;return n.parentElement?e("<"+o+"/>").loadTemplate(i,t,a):e("<"+o+"/>").loadTemplate(i,t,a).children()}})),e.fn.loadTemplate=t,e.addTemplateFormatter=n}(jQuery),$=jQuery,$.fn.multiSelect=function(e){var t=$.extend({label:"Select"},e),n=this,a=n.children("select"),o=n.children("input"),i=$("<div></div>").addClass("multiselect-wrap"),r=$("<div></div>").addClass("multiselect-selected").text(t.label),l=$("<div></div>").addClass("multiselect-list").css("display","none");return a.find("option").each((function(){var e=$(this),t=$("<div></div>").text(e.text()).attr("data-val",e.val());t.appendTo(l),t.on("click",(function(){$(this).toggleClass("selected-option"),r.empty(),selectedVal=[],l.find(".selected-option").each((function(){var e=$(this);$("<span></span>").text(e.text()).appendTo(r),selectedVal.push(e.attr("data-val"))})),o.length>0&&o.val(selectedVal.join(","))}))})),r.on("click",(function(){l.hasClass("multi-list-opened")?l.slideUp((function(){l.removeClass("multi-list-opened")})):l.slideDown((function(){l.addClass("multi-list-opened")}))})),i.append(r).append(l),n.append(i),a.hide(),$("html").click((function(e){$(e.target).is(n)||$(e.target).is(l)||$(e.target).is(r)||$(e.target).is(i)||$(e.target).is(l.children())||$(e.target).is(r.children())||l.hasClass("multi-list-opened")&&l.slideUp((function(){l.removeClass("multi-list-opened")}))})),this},jQuery(document).ready((function(e){jQuery.fn.isInViewport=function(){var t=e(this).offset().top,n=t+e(this).outerHeight(),a=e(window).scrollTop(),o=a+e(window).height();return n>a&&t<o},jQuery.addTemplateFormatter("MyRestaurantId",(function(e,t){return"restaurant_"+e})),jQuery.addTemplateFormatter("MyBg",(function(e,t){return"--bg-image: url('"+e+"');"})),jQuery.addTemplateFormatter("MyRestaurantTags",(function(e,t){if(void 0===e)return"";var n="";for(let t=0;t<e.length;t++)0!==n.length&&(n+=" - "),n+=e[t].name;return n})),jQuery.addTemplateFormatter("MyDataTags",(function(e,t){if(void 0===e)return"";var n="";for(let t=0;t<e.length;t++)n+=e[t].name;return n})),jQuery.addTemplateFormatter("MyOpeningHours",(function(e,t){if(void 0===e)return"";var n="";for(let t=0;t<e.length;t++)0!==n.length&&(n+="<br/>"),n+=e[t];return n})),jQuery("#dabba-carto .zones").loadTemplate(jQuery("#zone_template"),window.zones),window.myIcon=L.icon({iconUrl:ajax_object.plugins_url+"img/pin2.png",iconSize:[40,51],iconAnchor:[20,51],popupAnchor:[0,-50]}),jQuery("#meal_types").change((function(){console.log(this.val())})),getMealTypes(),getTags(),initMap("mapid"),window.dabba_map&&navigator.geolocation.getCurrentPosition(setLocation,logError),jQuery("#restaurants-list").on("click","div.restaurant_card",(function(e){if("A"!==e.target.tagName&&(e.preventDefault(),void 0!==window.markers[this.id])){var t=this.id;jQuery(this).hasClass("active")?(window.current_restaurant_id=null,window.markers[t].closePopup(),window.dabba_map.setZoom(window.upper_zoom),jQuery(this).removeClass("active")):(window.markers[t].openPopup(),window.current_restaurant_id="#"+t,highlightMe(window.current_restaurant_id))}})),jQuery(".zones").on("click","a",(function(e){e.preventDefault(),jQuery(".zones").find("a.active").removeClass("active"),jQuery(this).addClass("active");var t=jQuery(this).data("lat"),n=jQuery(this).data("lng"),a=new L.latLng(t,n);window.dabba_map.setView(a,window.upper_zoom)}))})),window.dabba_map=null,window.current_restaurant_id=null,window.upper_zoom=12,window.close_zoom=16,window.markers={},window.meal_types=[],window.tags=[],window.zones=[{name:"Grenoble",lat:45.1841642,lng:5.6980329},{name:"Lyon",lat:45.7579502,lng:4.8001018},{name:"Annecy",lat:45.8898747,lng:6.0934833},{name:"Chamonix-Mont-Blanc",lat:45.9320419,lng:6.8589215}],window.myIcon=null;