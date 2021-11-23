jQuery(document).ready(function($) {
    jQuery.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
    jQuery.addTemplateFormatter("MyRestaurantId",
        function(value, template) {
            return 'restaurant_'+value;
        });
    jQuery.addTemplateFormatter("MyRestaurantName",
        function(value, template) {
            if (value.length >= 26){
                return '<span class="text-lg">'+value+'</span>';
            }
            return value;
        });
    jQuery.addTemplateFormatter("MyBg",
        function(value, template) {
            return '--bg-image: url(\''+value+'\');';
        });
    jQuery.addTemplateFormatter("MyRestaurantTags",
        function(value, template) {
            if (typeof value == 'undefined'){
                return '';
            }
            var phrase = '';
            for (let i = 0; i < value.length; i++) {
                if (phrase.length !== 0){
                    phrase += ' - ';
                }
                phrase += value[i].name;
            }
            return phrase;
        });
    jQuery.addTemplateFormatter("MyDataTags",
        function(value, template) {
            if (typeof value == 'undefined'){
                return '';
            }
            var phrase = '';
            for (let i = 0; i < value.length; i++) {
                phrase += value[i].name;
            }
            return phrase;
        });
    jQuery.addTemplateFormatter("MyOpeningHours",
        function(value, template) {
            if (typeof value == 'undefined'){
                return '';
            }
            var phrase = '';
            for (let i = 0; i < value.length; i++) {
                if (phrase.length !== 0){
                    phrase += '<br/>';
                }
                phrase += value[i];
            }
            return phrase;
        });

    jQuery("#dabba-carto .zones").loadTemplate(jQuery("#zone_template"), window.zones);

    window.myIcon = L.icon({
        iconUrl: ajax_object.plugins_url+'img/pin2.png',
        iconSize: [40, 51],
        iconAnchor: [20, 51],
        popupAnchor: [0, -50]
    });

    //
    jQuery("#meal_types").change( function (){ console.log(this.val()) });
    getMealTypes();
    getTags();
    //create map
    initMap('mapid');
    if (window.dabba_map){
        // Request access to the user's location
        navigator.geolocation.getCurrentPosition(setLocation, logError);
    }

    jQuery('#restaurants-list').on('click','div.restaurant_card',function (e){
        if (e.target.tagName !== 'A'){
            e.preventDefault();
            if (typeof window.markers[this.id] != "undefined"){
                var id = this.id;
                if (jQuery(this).hasClass('active')){
                    window.current_restaurant_id = null;
                    window.markers[id].closePopup();
                    window.dabba_map.setZoom(window.upper_zoom);
                    jQuery(this).removeClass('active');
                }else{
                    //window.dabba_map.setView(window.markers[id].getLatLng(),window.close_zoom);
                    window.markers[id].openPopup();
                    window.current_restaurant_id = '#'+id;
                    highlightMe(window.current_restaurant_id);
                }
            }
        }
    });
    jQuery('.zones').on('click','a',function (e){
        e.preventDefault();
        jQuery('.zones').find('a.active').removeClass('active');
        jQuery(this).addClass('active');
        var lat = jQuery(this).data('lat');
        var lng = jQuery(this).data('lng');
        var latlng = new L.latLng(lat,lng);
        window.dabba_map.setView(latlng, window.upper_zoom);
    });
});

window.dabba_map = null;
window.current_restaurant_id = null;
window.upper_zoom = 12;
window.close_zoom = 16;
window.markers = {};
window.meal_types = [];
window.tags = [];
window.zones = [
    {"name" : "Grenoble", "lat" : 45.1841642, "lng" : 5.6980329},
    {"name" : "Lyon", "lat" : 45.7579502,"lng" : 4.8001018},
    // {"name" : "Savoie", "lat" : 45.5822142,"lng" : 5.871334},
    {"name" : "Annecy", "lat" : 45.8898747,"lng" : 6.0934833},
    {"name" : "Chamonix-Mont-Blanc", "lat" : 45.9320419,"lng" : 6.8589215}
];

window.myIcon = null;

function getMealTypes(){
    var post_data = {
        'action': 'dabba_meal_types'
    };
    jQuery.ajax({
        type : 'POST',
        url : ajax_object.ajax_url,
        data : post_data,
        dataType : 'json',
        success : function(data){
            if (typeof data == 'object'){
                $meal_container = jQuery('#meal_types');
                var i = 0,select = $meal_container.find('select');
                for (; i < data.length; i += 1) {
                    var $option = jQuery('<option></option>');
                    $option.attr('value', data[i].id);
                    $option.html(data[i].name);
                    $meal_container.find('select').append($option);
                }
                $meal_container.multiSelect({
                    label: $meal_container.data('placeholder')
                });
                jQuery('[name="meal_types"]').val('');
                $meal_container.on('click','.multiselect-wrap', function(){
                    var list = jQuery('[name="meal_types"]').val();
                    var has_change = false;
                    if (list){
                        var meal_types_array = list.split(",");
                        if (meal_types_array != window.meal_types)
                        {
                            window.meal_types = meal_types_array;
                            has_change = true;
                        }
                    }else{
                        $meal_container.find('.multiselect-selected').html($meal_container.data('placeholder'));
                        if (window.meal_types.length > 0)
                        {
                            window.meal_types = [];
                            has_change = true;
                        }
                    }
                    if (window.dabba_map && has_change){
                        getRestaurants(window.dabba_map.getBounds());
                    }
                });
            }else{
                console.log(data);
            }
        }
    });
}

function getTags(){
    var post_data = {
        'action': 'dabba_get_tags'
    };
    jQuery.ajax({
        type : 'POST',
        url : ajax_object.ajax_url,
        data : post_data,
        dataType : 'json',
        success : function(data){
            if (typeof data == 'object'){
                $tags_container = jQuery('#tags');
                var i = 0,select = $tags_container.find('select');
                for (; i < data.length; i += 1) {
                    var $option = jQuery('<option></option>');
                    $option.attr('value', data[i].id);
                    $option.html(data[i].name);
                    $tags_container.find('select').append($option);
                }
                $tags_container.multiSelect({
                    label: $tags_container.data('placeholder')
                });
                jQuery('[name="tags"]').val('');
                $tags_container.on('click','.multiselect-wrap', function(){
                    var has_change = false;
                    var list = jQuery('[name="tags"]').val();
                    if (list){
                        var tags_array = list.split(",");
                        if (tags_array != window.tags)
                        {
                            window.tags = tags_array;
                            has_change = true;
                        }
                    }else{
                        $tags_container.find('.multiselect-selected').html($tags_container.data('placeholder'));
                        if (window.tags.length > 0)
                        {
                            window.tags = [];
                            has_change = true;
                        }
                    }
                    if (window.dabba_map && has_change){
                        getRestaurants(window.dabba_map.getBounds());
                    }
                });
            }else{
                console.log(data);
            }
        }
    });
}

function getRestaurants(bounds){
    //console.log(bounds);
    var post_data = {
        'action': 'dabba_get_restaurants'
    };
    if (bounds){
        post_data.west = bounds.getWest()
        post_data.south = bounds.getSouth()
        post_data.east = bounds.getEast()
        post_data.north = bounds.getNorth()
    }
    if (window.tags.length > 0){
        post_data.tags = window.tags;
    }
    if (window.meal_types.length > 0){
        post_data.meal_types = window.meal_types;
    }
    jQuery.ajax({
        type : 'POST',
        url : ajax_object.ajax_url,
        data : post_data,
        dataType : 'json',
        success : function(data){
            if (typeof data == 'object'){
                //console.log(data);
                if (typeof window.markers == 'object') {
                    Object.keys(window.markers).forEach(key => {
                        window.markers[key].remove();
                    });
                }
                data.forEach(obj => {
                    addMarker(obj);
                    //addCard(obj);
                });
                jQuery("#restaurants-list").loadTemplate(jQuery("#restaurant_card_template"), data);
                if (window.current_restaurant_id){
                    highlightMe(window.current_restaurant_id);
                }
            }else{
                console.log(data);
            }
        }
    });
}

function highlightMe(id){
    var $restaurants_list = jQuery('#restaurants-list');
    $restaurants_list.find('.active').removeClass('active');
    var $current = $restaurants_list.find(id);
    $current.addClass("active");
    if (!$current.isInViewport())
        $current.prependTo('#restaurants-list');
}

function Deg2Rad(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
}

function NearestZone(latitude, longitude) {
    var minDif = 99999;
    var closest;

    for (index = 0; index < window.zones.length; ++index) {
        var dif = PythagorasEquirectangular(latitude, longitude, window.zones[index].lat, window.zones[index].lng);
        if (dif < minDif) {
            closest = index;
            minDif = dif;
        }
    }

    return window.zones[closest];
}

function initMap(id){
    if (document.getElementById(id)){
        window.dabba_map = L.map(id,{ dragging: !L.Browser.mobile, tap: !L.Browser.mobile, fullscreenControl: true , scrollWheelZoom: false});
        centerToZone(window.zones[0]);

        L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( window.dabba_map );

        window.dabba_map.on("zoomend", update);
        window.dabba_map.on("moveend", update);
        update();
    }
}

function update(){
    jQuery('#restaurants-list').html('');
    //load restaurants
    getRestaurants(window.dabba_map.getBounds());
}

/**
 * Log the user's location details
 * @param  {Object} position The location details
 */
function setLocation (position) {
    if (window.dabba_map) {
        var latlng = new L.latLng(position.coords.latitude, position.coords.longitude);
        zone = NearestZone(position.coords.latitude, position.coords.longitude);
        centerToZone(zone);
    }
}

function centerToZone(zone) {
    if (window.dabba_map){
        var latlng = new L.latLng(zone.lat,zone.lng);
        window.dabba_map.setView(latlng, window.upper_zoom);
        var $zones = jQuery('.zones');
        $zones.find('a.active').removeClass('active');
        $zones.find('a[data-name="'+zone.name+'"]').addClass('active');
    }
}

/**
 * Log an error message
 * @param  {Object} error The error details
 */
function logError (error) {
    console.warn(error);
}

function addMarker(obj){
    if (window.dabba_map) {
        if (typeof window.markers['restaurant_'+obj.id] == "undefined"){
            // console.log(obj);
            var latlng = new L.latLng(obj.lat, obj.lng);
            var marker = L.marker(latlng,{'icon': window.myIcon}).addTo(window.dabba_map);
            var $popup = jQuery('<div>').loadTemplate(jQuery("#popup_template"), obj);
            marker.bindPopup($popup.html());
            marker.on("click",function(ev) {
                window.current_restaurant_id = '#restaurant_'+obj.id;
                highlightMe(window.current_restaurant_id)
                //window.dabba_map.setView(ev.latlng,window.close_zoom);
            });
            window.markers['restaurant_'+obj.id] = marker;
        }else{
            window.markers['restaurant_'+obj.id].addTo(window.dabba_map);
        }
    }
}

function addCard(obj){
    jQuery("#restaurants-list").loadTemplate(jQuery("#restaurant_card"), obj);
}

