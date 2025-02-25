<script lang="ts">
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { playerProgress } from '../stores/store';
    import { owned_tool, equipped_tool, equipped_bag, shopTools, shopBags } from '../stores/shop';
    import { quest, mine_quest, act_mine_quest_index } from '../stores/quest';

    import type { Quest } from '../stores/quest';

    onMount(() => {
        loadData();
        // incrementTimer();
        console.log("✅ +page.svelte est monté !");
    })

    let pseudo = "User";
    let xp_tempory = 0;
    let found = false;

    function saveData() {
        const dataToSave = {
        pseudo,
        stats,
        mineral_1,
        };

        localStorage.setItem('astralite_tycoon_data', JSON.stringify(dataToSave));
    }

    function loadData() {
        const savedData = localStorage.getItem('astralite_tycoon_data');

        if (savedData) {
            const parsedData = JSON.parse(savedData);

            pseudo = parsedData.pseudo;
            stats = parsedData.stats;
            mineral_1 = parsedData.mineral_1;
        }
    }

    let float_mineral: { id: number }[] = [];

    interface Mineral {
        id: number;
        name: string;
        image: string;
        price: number;
        level: number;
        multiplier: number;
        owned: number;
    }

    let mineral_1: Mineral[] = [
        {id:1, name:"Cailloux", image:"Mineral/rock.png", price:0, level:1, multiplier:1, owned:1},
        {id:2, name:"Grés", image:"Mineral/likings.png", price:100, level:1, multiplier:3, owned:0},
        {id:3, name:"Argile", image:"Mineral/clay.png", price:1000, level:1, multiplier:5, owned:0}
    ];
    let act_mineral = mineral_1[0];

    let mineral_2: Mineral[] = [
        {id:1, name:"Cailloux", image:"Mineral/rock.png", price:0, level:1, multiplier:1, owned:1},
        {id:2, name:"Grés", image:"Mineral/likings.png", price:100, level:1, multiplier:3, owned:0},
        {id:3, name:"Argile", image:"Mineral/clay.png", price:1000, level:1, multiplier:5, owned:0}
    ];

    let stats = [
        {id:1, name:"Minerais obtenus", quantity:0},
        {id:2, name:"Argent obtenus", quantity:0},
        {id:3, name:"Expérience obtenus", quantity:0},
        {id:4, name:"Temps de jeu", quantity:0}
    ];

    // function incrementTimer(){
    //     stats[3].quantity += 1;
    //     if (quests[2].progression != quests[2].objectif){
    //         quests[2].progression += 1;
    //     }
    // }

    function stats_update(id: number, adding_quantity: number): void{
        stats[id - 1].quantity += adding_quantity;
    }

    function add_xp(xp_montant: number): void {
        if ($playerProgress.xp + xp_montant < $playerProgress.xp_max) {
            playerProgress.update(x => ({ ...x, xp: x.xp += xp_montant}));
        } else {
            xp_tempory = $playerProgress.xp_max - $playerProgress.xp;
            xp_montant -= xp_tempory;
            playerProgress.update(l => ({...l, level: l.level += 1}));
            playerProgress.update(x => ({...x, xp: x.xp = xp_montant}));
        }
        stats_update(3, xp_montant)
        saveData()
    }

    function mineMineral(mineral: Mineral): void{
        const tool = $shopTools.find(t => t.id === $equipped_tool) ?? { capacity_min: 1 };
        const mining_capacity = tool.capacity_min;
        const bag  = $shopBags.find(b => b.id === $equipped_bag) ?? { capacity: 20 };
        var adding_minerals = (mining_capacity * (mineral.level * mineral.multiplier))

        if ($playerProgress.bag_content + adding_minerals <= bag.capacity) {
            $playerProgress.bag_content += adding_minerals;
            add_xp(1)
            stats_update(1, adding_minerals)
            const animation = document.getElementById(mineral.name);

            if(animation){
                animation.animate(
                [
                    { transform: "scale(1.2)" },
                    { transform: "scale(1)" }
                ],
                    { duration: 150 }
                )
            }

            if ($quest[0].progression < $quest[0].objectif){
                console.log('test');
                quest.update(p => ({...p, progression: p[0].progression += adding_minerals}));
            }
            if ($mine_quest[act_mine_quest_index] && $mine_quest[act_mine_quest_index].progression < $mine_quest[act_mine_quest_index].objectif){
                mine_quest.update((quests: Quest[]) => {
                    const quest = quests[act_mine_quest_index];
                    if (quest) {
                        quest.progression += adding_minerals;
                    }
                    return quests;
                });
            }

            const mineral_item = {
                id: Date.now(),
            }

            float_mineral = [...float_mineral, mineral_item];

            setTimeout(() => {
                float_mineral = float_mineral.filter(i => i.id !== mineral_item.id);
            }, 1000);

        } else {
            alert("Votre sac est plein !");
        }
    }

    // function add_mineral_level(mineral){
    //     if(money >= (mineral.level * mineral.multiplier * 10)){
    //         money -= (mineral.level * mineral.multiplier * 10)
    //         saveData();
    //     }
    // }

    function buy_mineral(mineral: Mineral): void{
        if($playerProgress.money >= mineral.price){
            $playerProgress.money -= mineral.price
            mineral.owned = 1
            saveData()
            location.reload()
        }
    }

    function edit_pseudo(){
        const pseudo_name = document.getElementById("pseudo");
        const edit_button = document.getElementById("edit_button");
        const valid_button = document.getElementById("valid_button");
        const pseudo_edit = document.getElementById("pseudo_edit");

        if(pseudo_name && edit_button && valid_button && pseudo_edit){
            pseudo_name.style.display = 'none';
            edit_button.style.display = 'none';
            valid_button.style.display = 'block';
            pseudo_edit.style.display = 'block';
        }
    }

    function valid_pseudo(){
        // @ts-ignore
        var pseudo_input = document.getElementById('pseudo_edit').value;
        pseudo = pseudo_input;
        const pseudo_name = document.getElementById("pseudo");
        const edit_button = document.getElementById("edit_button");
        const valid_button = document.getElementById("valid_button");
        const pseudo_edit = document.getElementById("pseudo_edit");

        if(pseudo_name && edit_button && valid_button && pseudo_edit){
            pseudo_name.style.display = 'none';
            edit_button.style.display = 'none';
            valid_button.style.display = 'block';
            pseudo_edit.style.display = 'block';
        }
    }

    function upgrade_mineral_popup(mineral: Mineral): void{
        const mineral_popup = document.getElementById("upgrade_mineral_popup");

        if(mineral_popup){
            mineral_popup.style.display = 'block';
        }
        act_mineral = mineral;
    }

    function close_upgrade_mineral_popup(){
        const mineral_popup = document.getElementById("upgrade_mineral_popup");

        if(mineral_popup){
            mineral_popup.style.display = 'none';
        }
    }

    function upgrade_mineral(mineral: Mineral): void{
        if (mineral.price <= $playerProgress.money){
            $playerProgress.money -= mineral.price;
            mineral.level += 1;
        }
    }

    // setInterval(incrementTimer, 60000);

    function test(){
        playerProgress.update((progress) => {
            $playerProgress.money += 1;
            return progress;
        });
    }
</script>

<main>

    <div id="mineral">
        {#each mineral_1 as mineral}
        {#if mineral.owned == 1}
        <div class="mineral_content">
            <button on:click={() => mineMineral(mineral)}>
                <img src={mineral.image} alt={mineral.name} id={mineral.name}>
                <p>+ {(mineral.level * mineral.multiplier) * ($shopTools.find(t => t.id === $equipped_tool)?.capacity_min ?? 0)}</p>
            </button>
            <button class="upgrade_mineral" on:click={() => upgrade_mineral_popup(mineral)}>Améliorer</button>
        </div>
        {:else}
            <button on:click={() => buy_mineral(mineral)}>
                <img src="lock.png" alt="lock">
                <p>{mineral.price}</p>
            </button>
        {/if}
        {/each}
    </div>

    <div class="rock">
    {#each float_mineral as item (item.id)}
        <div
        class="floating-item" style="left:{Math.random() * (90 -  10) + 10}%"
        transition:fly="{{ y: 300, duration: 1000 }}">
        <img src="Mineral/rock.png" alt="rock">
        </div>
    {/each}
    </div>

    <div id="profile" style="display: none;">
        <div class="profile_header">
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <!-- <button class="exit_button" on:click={() => close_popup("profile")}><i class="fa-solid fa-arrow-right-from-bracket"></i></button> -->
        </div>
        <div class="pop_class">
            <div class="pop_class_img">
                <img src="profile.png" alt="profile">
            </div>
            <p id="pseudo">{pseudo}</p>
            <input id ="pseudo_edit" type="text" placeholder="Votre pseudo" style="display: none;">
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button id="valid_button" on:click={() => valid_pseudo()} style="display: none;"><i class="fa-solid fa-check"></i></button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button id="edit_button" on:click={() => edit_pseudo()}><i class="fa-solid fa-pen-to-square"></i></button>
        </div>
        <div id="stats">
            {#each stats as stat}
                <p>{stat.name}: {stat.quantity}</p>
            {/each}
        </div>
    </div>

    <div id="upgrade_mineral_popup" style="display: none;">
        <h5>{act_mineral.name}</h5>
        <button class="btn_close" on:click={() => close_upgrade_mineral_popup()}><img src="close.png" alt="close"></button>
        <p>Niveau: {act_mineral.level}</p>
        <p>Prix: {act_mineral.price}</p>
        <button class="btn_upgrade" on:click={() => upgrade_mineral(act_mineral)}>AMELIORE</button>
    </div>
</main>

<style>
    /* Mineral */

    #mineral {
        display: grid;
        grid-template-columns: repeat(2, 2fr);
        gap: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 0%);
        cursor: pointer;
        z-index: 1;
    }

    #mineral button {
        border: none;
        outline: none;
        background: none;
    }

    #mineral img {
        width: 75px;
        height: 75px;
    }

    #upgrade_mineral_popup{
        position: absolute;
        width: 150px;
        height: 150px;
        background-color: #8CC4DB;
        border-radius: 10px;
        transform: translate(50%, 50%);
        padding: 10px;
        opacity: 0.9;
        z-index: 100;
    }


    .btn_close{
        position: absolute;
        right: 10px;
        top: 10px;
        outline: none;
        border: none;
        background: none;
    }

    .btn_close img{
        width: 30px;
        height: 30px;
    }

    .btn_upgrade{
        position: absolute;
        width: 88%;
        padding: 7px 0;
        bottom: 10px;
        outline: none;
        border: none;
        border-radius: 10px;
        background-color: #00B912;
        color: white;
        font: large;
    }

        /* Floating mineral */

    .floating-item {
        position: absolute;
        font-size: 24px;
        font-weight: bold;
        color: white;
        pointer-events: none;
        bottom: 30%;
        transform: translateX(-50%);
        z-index: 0;
    }

    .floating-item img{
        width: 30px;
    }

    /* Profile */

    /* #profile{
    padding: 10% 0 160% 0;
    background-color: white;
    color: black;
    width: 100%;
    height: 100%;
    }

    .profile_header .exit_button{
    background: none;
    color: black;
    outline: none;
    border: none;
    width: 20px;
    }

    #edit_button, #valid_button{
    background: none;
    outline: none;
    border: none;
    } */
</style>