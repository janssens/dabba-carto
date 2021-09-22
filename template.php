<div id="dabba-carto" class="alignfull p-4">
    <div class="lg:flex">
        <div class="lg:hidden w-100">
            <?php if ($content) : ?>
            <div class="content text-white rounded-3xl m-4 text-center py-12 px-8 shadow-xl">
                <?php echo $content; ?>
            </div>
            <?php endif; ?>
        </div>
        <div class="lg:w-2/3 w-100">
            <div class="h-24 w-100 lg:block hidden"></div>
            <div class="zones w-100 text-center mb-12 text-lg"></div>
            <form id="filter" class="sm:flex mb-12" >
                <div id="meal_types" data-placeholder="Type de repas :" class="w-full sm:w-1/2">
                    <select >
                    </select>
                    <input type="text" name="meal_types" disabled="disabled" class="hidden"/>
                </div>
                <div id="tags" data-placeholder="Je veux manger un plat :" class="w-full sm:w-1/2">
                    <select >
                    </select>
                    <input type="text" name="tags" disabled="disabled" class="hidden"/>
                </div>
            </form>
        </div>
        <div class="lg:w-1/3 w-100 hidden sm:block">
            <?php if ($content) : ?>
            <div class="content text-white rounded-3xl m-4 text-center py-12 px-8 shadow-xl">
                <?php echo $content; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>
    <div class="lg:flex">
        <div id="mapid" class="rounded-3xl lg:w-2/3 w-100 h-100"></div>
        <div id="restaurants-list" class="lg:w-1/3 w-100 pt-10 md:pt-0"></div>
    </div>
</div>

<script type="text/html" id="restaurant_card_template">
    <div data-template-bind='[{"attribute": "id", "value": "id", "formatter": "MyRestaurantId"}]'
         class="restaurant_card rounded-3xl flex bg-white m-4 overflow-hidden h-64 shadow">
        <img data-src="image" data-alt="name" class="w-64 h-64 cursor-pointer" >
        <div class="p-5">
            <div data-content="name" class="name text-2xl"></div>
            <div data-template-bind='[{"attribute": "content", "value": "tags", "formatter": "MyRestaurantTags"}]' class="text-sm font-bold"></div>
            <div data-content="address" class="text-base address"></div>
            <div data-content="phone" class="text-lg"></div>
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