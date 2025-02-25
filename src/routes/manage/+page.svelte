<script lang="ts">
	import { goto } from "$app/navigation";

    import { playerProgress } from "../../stores/store";
    import { logistic, general } from "../../stores/manage";

    import type { Logistic, General } from "../../stores/manage";


    function showWorcker() {
        const first_section = document.getElementById('manage_first_section');
        const second_section = document.getElementById('manage_second_section');

        if(first_section && second_section){
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function showLogic() {
        const first_section = document.getElementById('manage_first_section');
        const second_section = document.getElementById('manage_second_section');

        if(first_section && second_section){
            first_section.style.display = 'none';
            second_section.style.display = 'block';
        }
    }

    function upgrade_logistic(item: Logistic): void{
        if (item.price <= $playerProgress.money){
            $playerProgress.money -= item.price;
            item.level += 1;

            if(item.level < 24){
                item.price += 5;
            } else {
                item.price += 10;
            }
        }
        $logistic = [...$logistic];
    }

    function upgrade_manager(manager: General): void{
        if(manager.price <= $playerProgress.coin){
            $playerProgress.coin -= manager.price;
            manager.level += 1;
        }
        $general = [...$general];
    }

</script>

<main>
    <div id="manage">
        <div class="pop_header">
            <button class="exit_button" on:click={() => goto('/')}><h1>Gestion</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
            <button class="pop_nav_button" on:click={() => showWorcker()}>Logistique</button>
            <button class="pop_nav_button" on:click={() => showLogic()}>Générale</button>
        </div>
        <div id="manage_first_section" class="pop_content">
            <div class="pop_class">
                <div class="pop_class_img"><img src="manage/logistic.png" alt="worker"></div>
                <div class="pop_class_text">
                    <h3>Gestion logistique</h3>
                    <p>Ici vous pouvez optimiser chaque élément présent sur votre site d’exploitation minière de manière propre à celui-ci</p>
                </div>
            </div>
            <div class="pop_items_container">
                {#each $logistic as item}
                    <div class="pop_item">
                        <img src={item.image} alt={item.name}>
                        <div class="item_text">
                            <h5>{item.name}</h5>
                            <p>{item.description}</p>
                        </div>
                        <div class="item_info">
                            <p class="capacity" style:background-color={item.color}>{item.level} {item.amelioration}: $/s -----> $/s</p>
                        </div>
                        <button class="buy" on:click={() => upgrade_logistic(item)}>Améliorer: {item.price}$</button>
                    </div>
                {/each}
            </div>
        </div>


        <div id="manage_second_section" class="pop_content" style="display: none;">
            <div class="pop_class">
                <div class="pop_class_img"><img src="manage/dashboard.png" alt="logistic"></div>
                <div class="pop_class_text">
                    <h3>Gestion générale</h3>
                    <p>Ici vous pouvez optimiser chaque élément de votre exploitation minière de manière permanente</p>
                </div>
            </div>
            <div class="pop_items_container">
                {#each $general as item}
                <div class="pop_item">
                    <img src={item.image} alt={item.name}>
                    <div class="item_text">
                        <h5>{item.name}</h5>
                        <p>{item.description}</p>
                    </div>
                    <div class="item_info">
                        <p class="capacity" style:background-color={item.color}>{item.level} {item.amelioration}: $/s -----> $/s</p>
                    </div>
                    <button class="buy" on:click={() => upgrade_manager(item)}>Améliorer: {item.price}<img src="coin.png" alt="coin"></button>
                </div>
            {/each}
            </div>
        </div>
    </div>
</main>

<style>
    #manage{
        background-color: #8CC4DB;
    }
</style>