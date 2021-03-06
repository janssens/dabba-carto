<?php
/*
 * Plugin Name: Dabba carto SHORTCODE for wp
 * Plugin URI: https://github.com/stuff
 * Description: Add dabba map and marker to your site
 * Author: Janssens Gaetan
 * Author URI: https://plopcom.fr
 * Version: 1.3.0
 */

$is_dev = false;

if ($is_dev){
    $path = 'dist';
}else{
    $path = 'build';
}

//include_once "inc/widget.php";
//include_once "inc/settings.php";
include_once "inc/admin.php";
include_once "inc/ajax.php";

add_shortcode('dabba', 'shortcode_function');
function shortcode_function($attributes = array() , $content = null ) {

    if (!is_admin()){
        // Start output buffering
        ob_start();
        // Include the template file
        include __DIR__."/template.php";
        // End buffering and return its contents
        $output = ob_get_clean();

        echo $output;
    }

}

if (!is_admin()) {
    //scripts
    wp_enqueue_script('dabba', plugins_url('/' . $path . '/js/scripts.js', __FILE__), array('jquery', 'leaflet'),'1.3.0');

    wp_localize_script('dabba', 'ajax_object',
        array('ajax_url' => admin_url('admin-ajax.php'), 'plugins_url' => plugins_url('/' . $path . '/', __FILE__)));

    wp_enqueue_script('leaflet', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js');

    //styles
    wp_enqueue_style('leaflet', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
    wp_enqueue_style('dabba', plugins_url('/' . $path . '/css/style.css', __FILE__));
}else{
    add_action( 'admin_menu', 'dabba_register_top_level_menu' );
    add_action( 'admin_init', 'dabba_register_settings' );
    add_action( 'admin_notices', 'dabba_admin_notice');
    add_action( 'init', 'dabba_session_init' );
}