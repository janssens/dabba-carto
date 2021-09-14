<div id="dabba-carto" class="alignfull p-4">
    <div class="sm:flex">
        <div class="sm:hidden w-100">
            <div class="content text-white rounded-2xl m-4 text-center py-12 px-8">
                Commandez un plat à emporter dans un contenant consigné. <br>
                Rapportez-le une fois dégusté et rincé dans n'importe quel resto du réseau dabba !
            </div>
        </div>
        <div class="sm:w-2/3 w-100">
            <div class="h-36 w-100 sm:block hidden"></div>
            <div class="zones w-100 text-center"></div>
        </div>
        <div class="sm:w-1/3 w-100 hidden sm:block">
            <div class="content text-white rounded-2xl m-4 text-center py-12 px-8">
                Commandez un plat à emporter dans un contenant consigné. <br>
                Rapportez-le une fois dégusté et rincé dans n'importe quel resto du réseau dabba !
            </div>
        </div>
    </div>
    <div class="sm:flex">
        <div id="mapid" class="rounded-2xl sm:w-2/3 w-100 h-100"></div>
        <div id="restaurants-list" class="sm:w-1/3 w-100 pt-10 sm:pt-0"></div>
    </div>
</div>

<script type="text/html" id="restaurant_card_template">
    <div data-template-bind='[{"attribute": "id", "value": "id", "formatter": "MyRestaurantId"}]'
         class="restaurant_card rounded-2xl flex bg-white m-4 overflow-hidden h-64 shadow">
        <img data-src="image" data-alt="name" class="w-64 h-64 cursor-pointer" >
        <div class="p-5">
            <div data-content="name" class="name"></div>
            <div data-template-bind='[{"attribute": "content", "value": "tags", "formatter": "MyRestaurantTags"}]' class="font-size-xs"></div>
            <div data-content="address" class="font-size-2xs address"></div>
            <div data-content="phone" class="font-size-xs"></div>
            <a data-href="website" class="no-underline" target="_blank">voir le site web</a>
        </div>
    </div>
</script>

<script type="text/html" id="zone_template">
    <a href="#" data-content="name" data-template-bind='[{"attribute": "data-name", "value": "name"},{"attribute": "data-lat", "value": "lat"},{"attribute": "data-lng", "value": "lng"}]' class="no-underline p-5"></a>
</script>

<script type="text/html" id="popup_template">
    <div class="flex">
        <div class="w-24 h-24"><img class="w-24 h-24" data-src="image"/></div>
        <div class="p-4"><b class="uppercase" data-content="name"></b></div>
    </div>
    <div data-template-bind='[{"attribute": "content", "value": "opening_hours", "formatter": "MyOpeningHours"}]'></div>
</script>