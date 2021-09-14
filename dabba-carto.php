<?php
/*
 * Plugin Name: Dabba carto widget for wp
 * Plugin URI: https://github.com/stuff
 * Description: Add dabba map and marker to your site
 * Author: Janssens Gaetan
 * Author URI: https://plopcom.fr
 * Version: 1.0.1
 */

include_once "inc/widget.php";
include_once "inc/settings.php";
include_once "inc/ajax.php";

add_shortcode('dabba', 'shortcode_function');
function shortcode_function($attributes = array() , $content = null ) {
    include_once __DIR__."/template.php";
}

//scripts
wp_enqueue_script( 'dabba', plugins_url( '/build/js/scripts.js', __FILE__ ), array('jquery','leaflet') );
wp_localize_script( 'dabba', 'ajax_object',
    array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'plugins_url' =>  plugins_url( '/build/', __FILE__ )) );

wp_enqueue_script('leaflet','https://unpkg.com/leaflet@1.7.1/dist/leaflet.js');

//styles
wp_enqueue_style('leaflet','https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
wp_enqueue_style('dabba',plugins_url( '/build/css/style.css', __FILE__ ));