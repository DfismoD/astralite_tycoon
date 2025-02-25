<script lang="ts">
    import '../app.css';
    import { goto } from '$app/navigation';

    import { playerProgress } from '../stores/store';
    import { shopBags, owned_bag, equipped_bag } from '../stores/shop';

    function sell_bag_content() {
        $playerProgress.money += $playerProgress.bag_content;
        // stats_update(2, $playerProgress.bag_content)
        $playerProgress.bag_content = 0;
    }

</script>

<header>
    <div class="top_menu">
        <div class="money"><img src="money.png" alt="money"><span id="money">{$playerProgress.money}</span>+</div>
        <div class="coin"><img src="coin.png" alt="coin"><span id="coin">{$playerProgress.coin}</span></div>
        <div class="gems"><img src="Mineral/diamond.png" alt="diamond"><span id="gems">{$playerProgress.gem}</span><button>+</button></div>
        <div class="xp">
            <p class="level">{$playerProgress.level}</p>
            <div class="xp_bar_container">
                <img src="worker.png" alt="user">
                <p>{$playerProgress.xp} / {$playerProgress.xp_max} xp</p>
                <div class="xp_bar" style={'width: ' + ($playerProgress.xp / $playerProgress.xp_max) * 100 + '%'}></div>
            </div>
        </div>
    </div>
</header>

<div class="left_menu" id="left_menu">
    <div class="shop"><button on:click={() => goto('shop')}><img src="shop.png" alt="shop"></button></div>
    <div class="workers"><button on:click={() => goto('manage')}><img src="manage/dashboard.png" alt="worker"></button></div>
    <div class="profile"><button on:click={() => goto('profile')}><img src="profile.png" alt="profile"></button></div>
</div>

<div class="right_menu" id="right_menu">
    <div class="map"><button on:click="{() => goto('map')}"><img src="map.png" alt="map"></button></div>
    <div class="settings"><button><img src="settings.png" alt="settings"></button></div>
</div>

<div class="bottom_menu" id="bottom_menu">
    <div class="quests"><button on:click={() => goto('quest')}><img src="quest.png" alt="quest"></button></div>
    <div class="capacity_container"><img src="{$shopBags.find(b => b.id === $equipped_bag)?.image}" alt="bagpack"><span>{$playerProgress.bag_content} / {$shopBags.find(b => b.id === $equipped_bag)?.capacity}</span><button on:click={() => sell_bag_content()} class="sell_button">VENDRE</button></div>
    <div class="market"><button><img src="shop.png" alt="market"></button></div>
</div>

<slot/>