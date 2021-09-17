<?php
//ajax
function get_restaurants(){

    $west = floatval( $_POST['west'] );
    $south = floatval( $_POST['south'] );
    $east = floatval( $_POST['east'] );
    $north = floatval( $_POST['north'] );

    $tags = [];
    if (isset($_POST['tags'])){
        $tags = $_POST['tags'];
    }

    $types = [];
    if (isset($_POST['meal_types'])){
        $types = $_POST['meal_types'];
    }

    $need_filter = true;

    $params = array('lat[gte]'=>$south,'lat[lte]'=>$north,'lng[gte]'=>$west,'lng[lte]'=>$east);

    //  Initiate curl
    $ch = curl_init();
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    $api_url = 'https://dabba.plopcom.fr/api/restaurants';
    if (count($tags) == 0 && count($types) == 0){
        $need_filter = false;
    }
    if (count($tags)==1 && count($types) == 0){
        $api_url = 'https://dabba.plopcom.fr/api/tags/'.$tags[0].'/restaurants';
        $need_filter = false;
    }
    if (count($tags)==0 && count($types) == 1){
        $api_url = 'https://dabba.plopcom.fr/api/meal_types/'.$types[0].'/restaurants';
        $need_filter = false;
    }
    curl_setopt($ch, CURLOPT_URL,$api_url.'?'.http_build_query($params));
    // Execute
    $result=curl_exec($ch);
    // Closing
    curl_close($ch);

    if ($need_filter){
        $restaurants = json_decode($result);
        foreach ($restaurants as $k => $restaurant){
            $match = true;
            foreach ($tags as $tag_id){
                $match = false;
                foreach ($restaurant->tags as $tag){
                    if ($tag->id == $tag_id){
                        $match = true;
                        break;
                    }
                }
                if (!$match){
                    break;
                }
            }
            if ($match){
                foreach ($types as $type_id){
                    $matcht = false;
                    foreach ($restaurant->mealTypes as $mealType){
                        if ($mealType->id == $type_id){
                            $matcht = true;
                            break;
                        }
                    }
                    if (!$matcht){ //restaurant does have this type
                        $match = false;
                        break;
                    }
                }
            }
            if (!$match){
                unset($restaurants[$k]);
            }
        }
        if (count($restaurants) == 1){
            foreach ($restaurants as $r){
                echo json_encode([$r]);
                break;
            }
        }else{
            echo json_encode(array_values($restaurants));
        }
    }else{
        echo $result;
    }

    wp_die(); // this is required to terminate immediately and return a proper response
}
add_action( 'wp_ajax_dabba_get_restaurants', 'get_restaurants' );
add_action( 'wp_ajax_nopriv_dabba_get_restaurants', 'get_restaurants' );

function get_meal_types(){
    //  Initiate curl
    $ch = curl_init();
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt($ch, CURLOPT_URL,'https://dabba.plopcom.fr/api/meal_types');
    // Execute
    $result=curl_exec($ch);
    // Closing
    curl_close($ch);

    echo $result;

    wp_die(); // this is required to terminate immediately and return a proper response
}
add_action( 'wp_ajax_dabba_get_meal_types', 'get_meal_types' );
add_action( 'wp_ajax_nopriv_dabba_meal_types', 'get_meal_types' );

function get_tagss(){
    //  Initiate curl
    $ch = curl_init();
    // Will return the response, if false it print the response
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // Set the url
    curl_setopt($ch, CURLOPT_URL,'https://dabba.plopcom.fr/api/tags');
    // Execute
    $result=curl_exec($ch);
    // Closing
    curl_close($ch);

    echo $result;

    wp_die(); // this is required to terminate immediately and return a proper response
}
add_action( 'wp_ajax_dabba_get_tags', 'get_tagss' );
add_action( 'wp_ajax_nopriv_dabba_get_tags', 'get_tagss' );