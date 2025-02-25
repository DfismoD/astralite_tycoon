<script lang="ts">
    import '../../app.css';
    import { goto } from "$app/navigation";
    import Layout from '../+layout.svelte';
	import { shopTools, shopBags, owned_tool, equipped_tool, owned_bag, equipped_bag, zone } from "../../stores/shop";
    import { playerProgress } from '../../stores/store';
    import type { Tool, Bag } from '../../stores/shop';

    function buy_tool(tool: Tool): void {
        if ($playerProgress.money >= tool.price && !$owned_tool.includes(tool.id)) {
            $playerProgress.money -= tool.price;
            $owned_tool = [...$owned_tool, tool.id];
            equip_tool(tool);
        }
        // if (quests[1].progression != quests[1].objectif) {
        //     quests[1].progression += 1;
        // }
    }

    function equip_tool(tool: Tool): void {
        if ($owned_tool.includes(tool.id)) {
            $equipped_tool = tool.id;
        }
    }

    function buy_bag(bag: Bag): void {
        if ($playerProgress.money >= bag.price && !$owned_bag.includes(bag.id)) {
            $playerProgress.money -= bag.price;
            $owned_bag = [...$owned_bag, bag.id];
            equip_bag(bag);
        // }
        // if (quests[1].progression != quests[1].objectif) {
        //     quests[1].progression += 1;
        }
    }

    function equip_bag(bag: Bag): void {
        if ($owned_bag.includes(bag.id)) {
            $equipped_bag = bag.id;
        }
    }

    function showTools() {
        const first_section = document.getElementById('first_section');
        const second_section = document.getElementById('second_section');

        if(first_section && second_section){
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function showBags() {
        const first_section = document.getElementById('first_section');
        const second_section = document.getElementById('second_section');

        if(first_section && second_section){
            first_section.style.display = 'none';
            second_section.style.display = 'block';
        }
    }
</script>

<main>
    <div id="shop">
        <div class="pop_header">
            <button class="exit_button" on:click={() => goto('../../')}><h1>Magasin</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
            <button class="pop_nav_button" on:click={() => showTools()}>Outils</button>
            <button class="pop_nav_button" on:click={() => showBags()}>Sacs</button>
        </div>
        <div id="first_section" class="pop_content">
            <div class="pop_class">
                <div class="pop_class_img"><img src="tools/tool10.png" alt="pickaxe"></div>
                <div class="pop_class_text">
                    <h3>Magasin d'outlis</h3>
                    <p>Achetez ici de nouveaux outils afin de remplir plus facilement votre sac et d'obtenir de meilleurs minerais !</p>
                </div>
            </div>
            <div class="pop_items_container">
                {#each $shopTools as item}
                    <div class="pop_item">
                        <img src={item.image} alt={item.name}>
                        <div class="item_text">
                            <h5>{item.name}</h5>
                            <p>{item.description}</p>
                        </div>
                        <div class="item_info">
                            <p class="capacity">Capacité de minage: {item.capacity_min}-{item.capitcity_max}</p>
                            <p class="multiplicator">Chance de minerai rares: {item.multiplier}</p>
                        </div>
                        {#if !$owned_tool.includes(item.id)}
                            <button class="buy" on:click={() => buy_tool(item)}>{item.price}$</button>
                        {:else if $equipped_tool !== item.id}
                            <button class="equip" on:click={() => equip_tool(item)}>Équiper</button>
                        {:else}
                            <p class="equipped">Equipé</p>
                        {/if}
                        {#if item.zone > $zone}
                            <div class="locked">
                                <img src="lock.png" alt="lock">
                                <h3>Débloquer à la zone <br> de minage: {item.zone}</h3>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <div id="second_section" class="pop_content" style="display: none;">
            <div class="pop_class">
                <div class="pop_class_img"><img src="bags/bag7.png" alt="sac"></div>
                <div class="pop_class_text">
                    <h3>Magasin de sacs</h3>
                    <p>Achetez ici de nouveaux sacs pour augmenter votre capacité de transport de minerais !</p>
                </div>
            </div>
            <div class="pop_items_container">
                {#each $shopBags as item}
                    <div class="pop_item">
                        <img src={item.image} alt={item.name}>
                        <div class="item_text">
                            <h5>{item.name}</h5>
                            <p>{item.description}</p>
                        </div>
                        <div class="item_info">
                            <p class="capacity">Capacité: {item.capacity}</p>
                            <p class="multiplicator">Multiplicateur: {item.multiplier}</p>
                        </div>
                        {#if !$owned_bag.includes(item.id)}
                            <button class="buy" on:click={() => buy_bag(item)}>{item.price}$</button>
                        {:else if $equipped_bag !== item.id}
                            <button class="equip" on:click={() => equip_bag(item)}>Équiper</button>
                        {:else}
                            <p class="equipped">Equipé</p>
                        {/if}
                        {#if item.zone > $zone}
                            <div class="locked">
                                <img src="lock.png" alt="lock">
                                <h3>Débloquer à la zone <br> de minage: {item.zone}</h3>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</main>

<style>
    #shop{
        background-color: #8CC4DB;
    }
</style>