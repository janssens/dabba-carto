<?php
class Dabba_Admin{

    const MESSAGE_TYPE_SUCCESS = 'SUCCESS';
    const MESSAGE_TYPE_NOTICE = 'NOTICE';
    const MESSAGE_TYPE_WARNING = 'WARNING';
    const MESSAGE_TYPE_ERROR = 'ERROR';

    static function addMessage($message,$type = self::MESSAGE_TYPE_NOTICE){
        if (!isset($_SESSION['messages'])){
            $_SESSION['messages'] = array();
        }
        if (!in_array($type,[self::MESSAGE_TYPE_NOTICE,self::MESSAGE_TYPE_WARNING,self::MESSAGE_TYPE_ERROR,self::MESSAGE_TYPE_SUCCESS])){
            $type = self::MESSAGE_TYPE_NOTICE;
        }
        if (!isset($_SESSION['messages'][$type])){
            $_SESSION['messages'][$type] = array();
        }
        $_SESSION['messages'][$type][] = strip_tags($message);
    }

    static function endsWith($haystack, $needle) {
        $length = strlen($needle);
        return $length > 0 ? substr($haystack, -$length) === $needle : true;
    }
}

function dabba_register_top_level_menu(){
    add_menu_page(
        'Dabba Carto',
        'Carte Restaurants',
        'manage_options',
        'dabba',
        'dabba_display_top_level_menu_page',
        'dashicons-location-alt',
        6
    );
}
function dabba_register_settings(){
    register_setting( 'dabba_option_group', 'dabba_fields', 'dabba_callback_function' );
}
function dabba_session_init() {
    if (!session_id()) {
        session_start();
    }
}

function dabba_callback_function( $input ){
    if ( ! isset( $_POST['dabba_option_group_nonce'] ) || ! wp_verify_nonce( $_POST['dabba_option_group_nonce'], 'dabba_save_option_group' ) ) {
        exit;
    }
    if (!isset($input['api_url'])||!$input['api_url']){
        Dabba_Admin::addMessage('/!\ an api url is mandatory to use this plugin',Dabba_Admin::MESSAGE_TYPE_WARNING);
    }else{
        $url = trim($input['api_url']);
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            Dabba_Admin::addMessage("Api url must be a valid one",Dabba_Admin::MESSAGE_TYPE_ERROR);
        }else{
            //end slash
            if (Dabba_Admin::endsWith($url,'/')){
                $error = false;
                try {
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    $api_url = $url.'restaurants';
                    curl_setopt($ch, CURLOPT_URL,$api_url);
                    $return = curl_exec($ch);
                    curl_close($ch);
                } catch (Exception $e){
                    Dabba_Admin::addMessage('Api call to '.$api_url.' failed, please check your URL.',Dabba_Admin::MESSAGE_TYPE_ERROR);
                    $error = true;
                }
                $r = json_decode($return);
                if ($r === null && json_last_error() !== JSON_ERROR_NONE) {
                    Dabba_Admin::addMessage('Api call to '.$api_url.' failed, please check your URL.',Dabba_Admin::MESSAGE_TYPE_ERROR);
                    $error = true;
                }else{
                    if (isset($r->code)&&$r->code>=300){
                        Dabba_Admin::addMessage('Api call to '.$api_url.' failed, please check your URL.',Dabba_Admin::MESSAGE_TYPE_ERROR);
                        $error = true;
                    }
                }
                if (!$error){
                    $input['api_url'] = $url;
                    Dabba_Admin::addMessage('API url successfully saved',Dabba_Admin::MESSAGE_TYPE_SUCCESS);
                }
            }else{
                Dabba_Admin::addMessage("Api url shuld end with '/'",Dabba_Admin::MESSAGE_TYPE_ERROR);
            }
        }
    }
    $zones = json_decode($input['zones']);
    if ($zones === null && json_last_error() !== JSON_ERROR_NONE) {
        Dabba_Admin::addMessage("json data for zone is incorrect",Dabba_Admin::MESSAGE_TYPE_ERROR);
    }else{
        $input['zones'] = json_encode($zones);
        Dabba_Admin::addMessage('Zones successfully saved',Dabba_Admin::MESSAGE_TYPE_SUCCESS);
    }

    return $input;
}

function dabba_admin_notice(){
    global $pagenow;
    if ( $pagenow == 'admin.php' && $_GET['page'] == 'dabba' ) {
        if (isset($_SESSION['messages'] )){
            foreach ($_SESSION['messages'] as $type => $messages){
                foreach ($messages as $key => $message){
                    echo '<div class="notice notice-'.strtolower($type).' is-dismissible"><p>'.$message.'</p></div>';
                    unset($_SESSION['messages'][$type][$key]);
                }
            }
        }
    }
}

function dabba_display_top_level_menu_page(){
    $settings 	= get_option( 'dabba_fields' );
    ?>
        <h1>Carte des restaurants acceptant Dabba</h1>
    <h2>options de configuration</h2>
    <form method="post" action="options.php">
        <?php settings_fields( 'dabba_option_group' ); ?>
        <?php echo wp_nonce_field( 'dabba_save_option_group', 'dabba_option_group_nonce' ); ?>

        <table>
            <tr>
                <td><label for="api_url"><strong>API url : </strong></label></td>
                <td><input type="text" name="dabba_fields[api_url]" id="api_url" value="<?php echo $settings[ 'api_url' ]; ?>" placeholder="https://..."/></td>
            </tr>
            <tr>
                <td colspan="2">
                    <hr>
                    <p>transformez un tableau au format csv en json avec <a href="https://csvjson.com/csv2json" target="_blank">csvjson.com</a></p>
                    <table style="border: 1px solid gray;">
                        <tr>
                            <th>name</th>
                            <th>lat</th>
                            <th>lng</th>
                        </tr>
                        <tr>
                            <td>Grenoble</td>
                            <td>45.1841642</td>
                            <td>5.6980329</td>
                        </tr>
                        <tr>
                            <td>Lyon</td>
                            <td>45.7579502</td>
                            <td>4.8001018</td>
                        </tr>
                        <tr>
                            <td>...</td>
                            <td>...</td>
                            <td>...</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td><label for="zones"><strong>Zones : </strong></label></td>
                <td><textarea cols="80" name="dabba_fields[zones]" id="zones"><?php echo $settings[ 'zones' ]; ?></textarea></td>
            </tr>
            <tr>
                <td colspan="2"><?php echo submit_button(); ?></td>
            </tr>
        </table>

    </form>
    <?php
}