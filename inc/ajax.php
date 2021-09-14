<?php
//ajax
function get_restaurants(){

    $west = floatval( $_POST['west'] );
    $south = floatval( $_POST['south'] );
    $east = floatval( $_POST['east'] );
    $north = floatval( $_POST['north'] );

    $params = array('lat[gte]'=>$south,'lat[lte]'=>$north,'lng[gte]'=>$west,'lng[lte]'=>$east);

    //  Initiate curl
    $ch = curl_init();
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt($ch, CURLOPT_URL,'https://dabba.plopcom.fr/api/restaurants?'.http_build_query($params));
    // Execute
    $result=curl_exec($ch);
    // Closing
    curl_close($ch);

    echo $result;

    wp_die(); // this is required to terminate immediately and return a proper response
}
add_action( 'wp_ajax_dabba_get_restaurants', 'get_restaurants' );
add_action( 'wp_ajax_nopriv_dabba_get_restaurants', 'get_restaurants' );