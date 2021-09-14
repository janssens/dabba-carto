<?php
// Creating the widget
class dabba_widget extends WP_Widget {

    // The construct part
    function __construct() {
        parent::__construct(
            // Base ID of your widget
            'dabba_widget',
            // Widget name will appear in UI
            __('Dabba carto', 'dabba_widget_domain'),
            // Widget description
            array( 'description' => __( 'Add dabba map and marker', 'dabba' ), )
        );
    }

     // Creating widget front-end
    public function widget( $args, $instance ) {
        $title = apply_filters( 'widget_title', $instance['title'] );

        // before and after widget arguments are defined by themes
        echo $args['before_widget'];
        if ( ! empty( $title ) )
            echo $args['before_title'] . $title . $args['after_title'];

        // This is where you run the code and display the output
        echo __( 'Hello, World!', 'dabba' );
        echo $args['after_widget'];
    }

    // Creating widget Backend
    public function form( $instance ) {
        if ( isset( $instance[ 'title' ] ) ) {
            $title = $instance[ 'title' ];
        }
        else {
            $title = __( 'New title', 'dabba' );
        }
        // Widget admin form
        ?>
        <p>
            <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label>
            <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
        </p>
        <?php
    }

    // Updating widget replacing old instances with new
    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
        return $instance;
    }

    // Class wpb_widget ends here
}

function dabba_load_widget() {
    register_widget( 'dabba_widget' );
}
add_action( 'widgets_init', 'dabba_load_widget' );