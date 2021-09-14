function getRestaurants(t){var e={action:"dabba_get_restaurants"};t&&(e.west=t.getWest(),e.south=t.getSouth(),e.east=t.getEast(),e.north=t.getNorth()),jQuery.ajax({type:"POST",url:ajax_object.ajax_url,data:e,dataType:"json",success:function(t){"object"==typeof t?(t.forEach((t=>{addMarker(t)})),jQuery("#restaurants-list").loadTemplate(jQuery("#restaurant_card_template"),t),window.current_restaurant_id&&highlightMe(window.current_restaurant_id)):console.log(t)}})}function highlightMe(t){var e=jQuery("#restaurants-list");e.find(".active").removeClass("active");var n=e.find(t);n.addClass("active"),n.isInViewport()||n.prependTo("#restaurants-list")}function Deg2Rad(t){return t*(Math.PI/180)}function PythagorasEquirectangular(t,e,n,a){t=Deg2Rad(t),n=Deg2Rad(n),e=Deg2Rad(e);var r=((a=Deg2Rad(a))-e)*Math.cos((t+n)/2),o=n-t;return 6371*Math.sqrt(r*r+o*o)}function NearestZone(t,e){var n,a=99999;for(index=0;index<window.zones.length;++index){var r=PythagorasEquirectangular(t,e,window.zones[index].lat,window.zones[index].lng);r<a&&(n=index,a=r)}return window.zones[n]}function initMap(t){document.getElementById(t)&&(window.dabba_map=L.map(t),centerToZone(window.zones[0]),L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',subdomains:["a","b","c"]}).addTo(window.dabba_map),window.dabba_map.on("zoomend",update),window.dabba_map.on("moveend",update),update())}function update(){jQuery("#restaurants-list").html(""),getRestaurants(window.dabba_map.getBounds())}function setLocation(t){if(window.dabba_map){new L.latLng(t.coords.latitude,t.coords.longitude);zone=NearestZone(t.coords.latitude,t.coords.longitude),centerToZone(zone)}}function centerToZone(t){if(window.dabba_map){var e=new L.latLng(t.lat,t.lng);window.dabba_map.setView(e,window.upper_zoom);var n=jQuery(".zones");n.find("a.active").removeClass("active"),n.find('a[data-name="'+t.name+'"]').addClass("active")}}function logError(t){console.warn(t)}function addMarker(t){if(window.dabba_map&&void 0===window.markers["restaurant_"+t.id]){var e=new L.latLng(t.lat,t.lng),n=L.marker(e,{icon:window.myIcon}).addTo(window.dabba_map),a=jQuery("<div>").loadTemplate(jQuery("#popup_template"),t);n.bindPopup(a.html()),n.on("click",(function(e){window.current_restaurant_id="#restaurant_"+t.id,highlightMe(window.current_restaurant_id)})),window.markers["restaurant_"+t.id]=n}}function addCard(t){jQuery("#restaurants-list").loadTemplate(jQuery("#restaurant_card"),t)}!function(t){"use strict";function e(e,n,o){var c,u,d,l=this;return n=n||{},d=t.extend(!0,{async:!0,overwriteCache:!1,complete:null,success:null,error:function(){t(this).each((function(){t(this).html(d.errorMessage)}))},errorMessage:"There was an error loading the template.",paged:!1,pageNo:1,elemPerPage:10,append:!1,prepend:!1,beforeInsert:null,afterInsert:null,bindingOptions:{ignoreUndefined:!1,ignoreNull:!1,ignoreEmptyString:!1}},o),"array"===t.type(n)?(!0,a.call(this,e,n,d)):(function(t){return"string"==typeof t&&t.indexOf("/")>-1}(e)||(c=t(e),"string"==typeof e&&0===e.indexOf("#")&&(d.isFile=!1)),(u=d.isFile||void 0===d.isFile&&(void 0===c||0===c.length))&&!d.overwriteCache&&w[e]?r(e,l,n,d):u&&!d.overwriteCache&&w.hasOwnProperty(e)?function(t,e,n,a){g[t]?g[t].push({data:n,selection:e,settings:a}):g[t]=[{data:n,selection:e,settings:a}]}(e,l,n,d):u?i(e,l,n,d):s(c,l,n,d),this)}function n(e,n){n?v[e]=n:v=t.extend(v,e)}function a(n,a,r){r=r||{};var o,i=this,s=a.length,c=r.prepend&&!r.append,u=0,d=0,l=!1,p=[];if(r.paged){var f=(r.pageNo-1)*r.elemPerPage;a=a.slice(f,f+r.elemPerPage),s=a.length}return r.append||r.prepend||i.html(""),o=t.extend({},r,{append:!r.prepend&&!0,complete:function(t){(++u===s||l)&&(l&&r&&"function"==typeof r.error&&r.error.call(i,p),r&&"function"==typeof r.complete&&r.complete())},success:function(){++d===s&&r&&"function"==typeof r.success&&r.success()},error:function(t){l=!0,p.push(t)}}),c&&a.reverse(),t(a).each((function(){if(e.call(i,n,this,o),l)return!1})),this}function r(t,e,n,a){var r=w[t].clone();c.call(e,r,n,a),"function"==typeof a.success&&a.success()}function o(){return(new Date).getTime()}function i(e,n,a,r){w[e]=null;var i=e;r.overwriteCache&&(i=function(t){return-1!==t.indexOf("?")?t+"&_="+o():t+"?_="+o()}(i)),t.ajax({url:i,async:r.async,success:function(o){!function(t,e,n,a,r){var o;for(w[e]=t.clone(),c.call(n,t,a,r),"function"==typeof r.success&&r.success.call(n);g[e]&&(o=g[e].shift());)c.call(o.selection,w[e].clone(),o.data,o.settings),"function"==typeof o.settings.success&&o.settings.success.call(o.selection)}(t(o),e,n,a,r)},error:function(t){u(e,n,a,r,t)}})}function s(e,n,a,r){(e.is("script")||e.is("template"))&&(e=t.parseHTML(t.trim(e.html()))),c.call(n,e,a,r),"function"==typeof r.success&&r.success()}function c(e,n,a){(function(e,n,a){d("data-content",e,n=n||{},a,(function(t,e){t.html(m(t,e,"content",a))})),d("data-content-append",e,n,a,(function(t,e){t.append(m(t,e,"content",a))})),d("data-content-prepend",e,n,a,(function(t,e){t.prepend(m(t,e,"content",a))})),d("data-content-text",e,n,a,(function(t,e){t.text(m(t,e,"content",a))})),d("data-innerHTML",e,n,a,(function(t,e){t.html(m(t,e,"content",a))})),d("data-src",e,n,a,(function(t,e){t.attr("src",m(t,e,"src",a))}),(function(t){t.remove()})),d("data-href",e,n,a,(function(t,e){t.attr("href",m(t,e,"href",a))}),(function(t){t.remove()})),d("data-alt",e,n,a,(function(t,e){t.attr("alt",m(t,e,"alt",a))})),d("data-title",e,n,a,(function(t,e){t.attr("title",m(t,e,"title",a))})),d("data-id",e,n,a,(function(t,e){t.attr("id",m(t,e,"id",a))})),d("data-css",e,n,a,(function(t,e){t.css(m(t,e,"css",a))})),d("data-class",e,n,a,(function(t,e){t.addClass(m(t,e,"class",a))})),d("data-link",e,n,a,(function(e,n){var r=t("<a/>");r.attr("href",m(e,n,"link",a)),r.html(e.html()),e.html(r)})),d("data-link-wrap",e,n,a,(function(e,n){var r=t("<a/>");r.attr("href",m(e,n,"link-wrap",a)),e.wrap(r)})),d("data-options",e,n,a,(function(e,n){t(n).each((function(){t("<option/>").attr("value",this).text(this).appendTo(e)}))})),function(e,n,a){t("[data-template-bind]",e).each((function(){var e=t(this),r=t.parseJSON(e.attr("data-template-bind"));e.removeAttr("data-template-bind"),t(r).each((function(){var r;if(r="object"==typeof this.value?h(n,this.value.data):h(n,this.value),this.attribute){if(!l(this,r,a))return void e.remove();switch(this.attribute){case"content":case"innerHTML":e.html(f(e,r,this));break;case"contentAppend":e.append(f(e,r,this));break;case"contentPrepend":e.prepend(f(e,r,this));break;case"contentText":e.text(f(e,r,this));break;case"options":var o=this;t(r).each((function(){t("<option/>").attr("value",this[o.value.value]).text(f(e,this[o.value.content],o)).attr("selected",null!=typeof this[o.value.selected]&&this[o.value.selected]).appendTo(e)}));break;default:e.attr(this.attribute,f(e,r,this))}}}))}))}(e,n,a),d("data-value",e,n,a,(function(t,e){t.val(m(t,e,"value",a))}))})(e=t("<div/>").append(e),n,a),t(this).each((function(){var r=e.children().clone(!0);t("select",r).each((function(n,a){t(this).val(t("select",e).eq(n).val())})),a.beforeInsert&&a.beforeInsert(r,n),a.append?t(this).append(r):a.prepend?t(this).prepend(r):t(this).html("").append(r),a.afterInsert&&a.afterInsert(r,n)})),"function"==typeof a.complete&&a.complete.call(t(this),n)}function u(e,n,a,r,o){var i;for("function"==typeof r.error&&r.error.call(n,o),t(g[e]).each((function(t,e){"function"==typeof e.settings.error&&e.settings.error.call(e.selection,o)})),"function"==typeof r.complete&&r.complete.call(n);g[e]&&(i=g[e].shift());)"function"==typeof i.settings.complete&&i.settings.complete.call(i.selection);void 0!==g[e]&&g[e].length>0&&(g[e]=[])}function d(e,n,a,r,o,i){t("["+e+"]",n).each((function(){var n=t(this),s=n.attr(e),c=h(a,s);l(n,c,r)?(n.removeAttr(e),void 0!==c&&o?o(n,c):i&&i(n)):n.remove()}))}function l(t,e,n){var a=p(t,n);return!(a.ignoreUndefined&&void 0===e||a.ignoreNull&&null===e||a.ignoreEmptyString&&""===e)}function p(e,n){var a={};return e instanceof jQuery&&e.attr("data-binding-options")?(a=t.parseJSON(e.attr("data-binding-options")),e.removeAttr("data-binding-options")):"object"==typeof e&&e.hasOwnProperty("bindingOptions")&&(a=e.bindingOptions),t.extend({},n.bindingOptions,a)}function f(t,e,n,a){return n.formatter&&v[n.formatter]?function(a){return v[n.formatter].call(t,e,n.formatOptions,a)}(a):e}function h(t,e){if("this"===e)return t;for(var n,a=e.split("."),r=t;(n=a.shift())&&void 0!==r&&null!=r;)r=r[n];return r}function m(e,n,a,r){var o,i=e.attr("data-format-target");if((i===a||!i&&"content"===a)&&(o=e.attr("data-format"))&&"function"==typeof v[o]){var s=e.attr("data-format-options");return function(a){return v[o].call(e[0],n,s,t.extend({},a))}(r)}return n}var w={},g={},v={};n("nestedTemplateFormatter",(function(e,n,a){if(n){"string"==typeof n&&"{"===n[0]&&(n=t.parseJSON(n));var r=n.parentElement||"div",o=n.template||n;return n.parentElement?t("<"+r+"/>").loadTemplate(o,e,a):t("<"+r+"/>").loadTemplate(o,e,a).children()}})),t.fn.loadTemplate=e,t.addTemplateFormatter=n}(jQuery),jQuery(document).ready((function(t){jQuery.fn.isInViewport=function(){var e=t(this).offset().top,n=e+t(this).outerHeight(),a=t(window).scrollTop(),r=a+t(window).height();return n>a&&e<r},jQuery.addTemplateFormatter("MyRestaurantId",(function(t,e){return"restaurant_"+t})),jQuery.addTemplateFormatter("MyBg",(function(t,e){return"--bg-image: url('"+t+"');"})),jQuery.addTemplateFormatter("MyRestaurantTags",(function(t,e){if(void 0===t)return"";var n="";for(let e=0;e<t.length;e++)0!==n.length&&(n+=" - "),n+=t[e].name;return n})),jQuery.addTemplateFormatter("MyOpeningHours",(function(t,e){if(void 0===t)return"";var n="";for(let e=0;e<t.length;e++)0!==n.length&&(n+="<br/>"),n+=t[e];return n})),jQuery("#dabba-carto .zones").loadTemplate(jQuery("#zone_template"),window.zones),window.myIcon=L.icon({iconUrl:ajax_object.plugins_url+"img/pin2.png",iconSize:[40,51],iconAnchor:[20,51],popupAnchor:[0,-50]}),initMap("mapid"),window.dabba_map&&navigator.geolocation.getCurrentPosition(setLocation,logError),jQuery("#restaurants-list").on("click","div.restaurant_card",(function(t){if(t.preventDefault(),void 0!==window.markers[this.id]){var e=this.id;jQuery(this).hasClass("active")?(window.current_restaurant_id=null,window.markers[e].closePopup(),window.dabba_map.setZoom(window.upper_zoom),jQuery(this).removeClass("active")):(window.markers[e].openPopup(),window.current_restaurant_id="#"+e,highlightMe(window.current_restaurant_id))}})),jQuery(".zones").on("click","a",(function(t){t.preventDefault(),jQuery(".zones").find("a.active").removeClass("active"),jQuery(this).addClass("active");var e=jQuery(this).data("lat"),n=jQuery(this).data("lng"),a=new L.latLng(e,n);window.dabba_map.setView(a,window.upper_zoom)}))})),window.dabba_map=null,window.current_restaurant_id=null,window.upper_zoom=12,window.close_zoom=16,window.markers={},window.zones=[{name:"Grenoble",lat:45.1841642,lng:5.6980329},{name:"Lyon",lat:45.7579502,lng:4.8001018},{name:"Annecy",lat:45.8898747,lng:6.0934833},{name:"Chamonix-Mont-Blanc",lat:45.9320419,lng:6.8589215}],window.myIcon=null;