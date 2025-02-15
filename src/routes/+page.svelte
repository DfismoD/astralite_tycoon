<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    onMount(() => {
        loadData();
        updateMultiplier();
        incrementTimer();
    })

    let pseudo = "User";

    let money = 1000;
    let gem = 0;
    let coin = 100;
    let level = 0;
    let xp = 0;
    let xp_max = 25;
    let xp_tempory = 0;

    let zone = 1;

    let bag_content = 0;

    let owned_tool = [1];
    let equipped_tool = 1;
    let owned_bag = [1];
    let equipped_bag = 1;

    let found = false;

    function saveData() {
        const dataToSave = {
        pseudo,
        stats,
        quests,
        money,
        coin,
        level,
        xp,
        zone,
        bag_content,
        owned_tool,
        equipped_tool,
        owned_bag,
        equipped_bag,
        mineral_1,
        general,
        mine_quests,
        versatile_quests,
        collector_quests,
        logistic
        };

        localStorage.setItem('astralite_tycoon_data', JSON.stringify(dataToSave));
    }

    function loadData() {
        const savedData = localStorage.getItem('astralite_tycoon_data');

        if (savedData) {
            const parsedData = JSON.parse(savedData);

            pseudo = parsedData.pseudo;
            stats = parsedData.stats;
            quests = parsedData.quests;
            money = parsedData.money;
            coin = parsedData.coin;
            level = parsedData.level;
            xp = parsedData.xp;
            zone = parsedData.zone;
            bag_content = parsedData.bag_content;
            owned_tool = parsedData.owned_tool;
            equipped_tool = parsedData.equipped_tool;
            owned_bag = parsedData.owned_bag;
            equipped_bag = parsedData.equipped_bag;
            mineral_1 = parsedData.mineral_1;
            general = parsedData.general;
            mine_quests = parsedData.mine_quests;
            versatile_quests = parsedData.versatile_quests;
            collector_quests = parsedData.collector_quests;
            logistic = parsedData.logistic;

        }
    }

    let float_mineral: { id: number }[] = [];

    interface Tool {
        id: number;
        name: string;
        image: string;
        price: number;
        multiplier: number;
        capacity_min: number;
        capitcity_max: number;
        cooldown: number;
        description: string;
        zone: number;
    }

    let tools: Tool[] = [
        {id:1, name:"Brosse à dents", image:"tools/tool1.png", price:0, multiplier:1, capacity_min:1, capitcity_max:2, cooldown:0.1, description:"Un outil très rudimentaire, vous ne trouverez pas pire.", zone:1},
        {id:2, name:"Pelle à poussière", image:"tools/tool2.png", price:20, multiplier:1, capacity_min:2, capitcity_max:3, cooldown:0.1, description:"Très utile pour balayer la poussière chez soi, un peu moins pour creuser...", zone:1},
        {id:3, name:"Jouets de plage", image:"tools/tool3.png", price:100, multiplier:1, capacity_min:2, capitcity_max:5, cooldown:0.1, description:"Un outil efficace, si l’on imagine pas le petit qui n’a plus de jouets...", zone:1},
        {id:4, name:"Truelle", image:"tools/tool4.png", price:400, multiplier:1.02, capacity_min:4, capitcity_max:6, cooldown:0.1, description:"Ce n’est pas son utilité première, mais ça devrait faire l’affaire !", zone:2},
        {id:5, name:"Pelle", image:"tools/tool5.png", price:950, multiplier:1.2, capacity_min:6, capitcity_max:8, cooldown:0.1, description:"Un outil des plus classiques, avec une prise en main rapide !", zone:2},
        {id:6, name:"Pelle à neige", image:"tools/tool6.png", price:1000, multiplier:1.05, capacity_min:7, capitcity_max:10, cooldown:0.1, description:"Un outil plus atypique, efficace pour attraper plein de minerais à la fois !", zone:2},
        {id:7, name:"Grande pelle", image:"tools/tool7.png", price:4000, multiplier:1.055, capacity_min:9, capitcity_max:13, cooldown:0.1, description:"Un outil des plus classiques, avec une prise en main rapide, en plus grand !", zone:2},
    ];

    interface Bag {
        id: number;
        name: string;
        image: string;
        price: number;
        multiplier: number;
        capacity: number;
        description: string;
        zone: number;
    }

    let bags: Bag[] = [
        {id:1, name:"Poches", image:"bags/bag1.png", price:0, multiplier:1, capacity:20, description:"Avoir les poches vides permet de mieux les remplir...", zone:1},
        {id:2, name:"Sac plastique", image:"bags/bag2.png", price:50, multiplier:1, capacity:50, description:"Habitué aux légumes de saison, esperons que ce sac ne se déchire pas...", zone:1},
        {id:3, name:"Sac alimentaire", image:"bags/bag3.png", price:130, multiplier:1.05, capacity:110, description:"Plus solide que son homologue en plastoc.", zone:1},
        {id:4, name:"Banane de chantier", image:"bags/bag4.png", price:850, multiplier:1.12, capacity:200, description:"Vous pourrez y ranger quelques minerais entre vos clés et portefeuille...", zone:2},
        {id:5, name:"Sac à main", image:"bags/bag5.png", price:3000, multiplier:1.18, capacity:380, description:"Un sac à main, vous ne savez pas ce que c’est ?", zone:2},
        {id:6, name:"Malette", image:"bags/bag6.png", price:5500, multiplier:1.25, capacity:600, description:"Adorée des professeurs de Maths, la mallette permet une grande capacité !", zone:2},
    ];

    interface Logistic{
        id: number;
        name: string;
        image: string;
        color: string;
        amelioration: string;
        level: number;
        price: number;
        baseYield: number;
        currentYield: number;
        description: string;
    }

    let logistic: Logistic[] = [
        {id:1, name:"Équipement des mineurs", image:"manage/accident.png", color:"#73BEDD", amelioration:"Rendement des mineurs", level:0, price:20, baseYield:2, currentYield:2, description:"Plus vos mineurs sont protégés, plus ils sont efficaces dans leurs sessions !"},
        {id:2, name:"Nourriture sur les sites", image:"manage/food.png", color:"#B573DD", amelioration:"Amélioration du rendement", level:0, price:20, baseYield:2, currentYield:2, description:"Améliorez la qualité de la nourriture sur vos sites de minage pour améliorer le rendement de vos mineurs"},
        {id:3, name:"Livraison des minerais", image:"manage/delivery.png", color:"#BCBE61", amelioration:"Multiplicateur de vente", level:0, price:20, baseYield:2, currentYield:2, description:"Une livraison rapide aux raffineries vous assure un bon retour de la clientèle"},
        {id:4, name:"Horaires des mineurs", image:"manage/time.png", color:"#737EDD", amelioration:"Temps supplémentaire", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Améliorez le salaire de vos mineurs afin qu’ils travaillent pendant votre absence !"},
        {id:5, name:"Motivation des mineurs", image:"manage/motivation.png", color:"#BE7761", amelioration:"Bonus gain d'absence", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Mettez en place des structures pour motiver vos mineurs lors de votre absence"},
        {id:6, name:"Sécurité des sites", image:"manage/security.png", color:"#61BE8C", amelioration:"Gain d'expérience", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Renforcez la sécurité de vos sites afin d’éviter les pertes et accidents qui dégradent votre image"},
    ];

    interface General{
        id: number;
        name: string;
        image: string;
        color: string;
        amelioration: string;
        level: number;
        price: number;
        description: string;
    }

    let general: General[] = [
        {id:1, name:"Réduction du délai", image:"manage/hourglass.png", color:"#5664E2", amelioration:"Réduction du délai sur les outils", level:0, price:1, description:"Améliorez l’entretien de vos outils afind de diminuer leur surchauffe pour les utiliser plus souvent"},
        {id:2, name:"Contact fournisseurs", image:"manage/contact.png", color:"#6BBC73", amelioration:"Réduction des prix", level:0, price:1, description:"Renforcez les contacts avec vos fournisseurs afin d’obtenir des réductions sur vos futurs achats de matériel"},
        {id:3, name:"Rafinage des minerais", image:"manage/mineral.png", color:"#B1B422", amelioration:"Multiplicateur de vente", level:0, price:1, description:"Améliorez la qualité de votre système de rafinage afin d’augmenter vos prix de vente"},
        {id:4, name:"Champs de trèfles", image:"manage/clover.png", color:"#DD73A6", amelioration:"Chance supplémentaire", level:0, price:1, description:"Entretenez un champ de trèfles pour que la chance soit avec vous"},
        {id:5, name:"Sacs améliorés", image:"manage/renforced_bag.png", color:"#1DAFEE", amelioration:"Bonus de stockage", level:0, price:1, description:"Vous pouvez investir dans un rouleau d’adhésif pour renforcer vos sacs"},
        {id:6, name:"Outlis améliorés", image:"manage/renforced_tool.png", color:"#ED4F4F", amelioration:"Bonus de récolte", level:0, price:1, description:"Aprovisionnez-vous d’outils de meilleure qualité pour des sessions plus efficaces"},
    ];

    let mine_quests: Quest[] = [
        {id:1, name:"Mineur novice", description:"Ramassez un total de 500 minerais", objectif:500, progression:0, reward_money:1000, reward_gem:5, reward_coin:1, owned:0},
        {id:2, name:"Mineur expérimenté", description:"Ramassez un total de 5000 minerais", objectif:5000, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
        {id:3, name:"Mineur expert", description:"Ramassez un total de 100 000 minerais", objectif:100000, progression:0, reward_money:100000, reward_gem:50, reward_coin:0, owned:0},
        {id:4, name:"As de la mine", description:"Ramassez un total de 50M minerais", objectif:50000000, progression:0, reward_money:100000, reward_gem:50, reward_coin:0, owned:0},
    ];

    let act_mine_quest_index = mine_quests.findIndex(item => item.owned != 1);
    let act_mine_quest = act_mine_quest_index !== -1 ? mine_quests[act_mine_quest_index] : null;

    let versatile_quests = [
        {id:1, name:"Apprenti polyvalent", description:"Améliorez toutes les optimisations de logistique au niveau 25", objectif:25, progression:0, reward_money:5000, reward_gem:50, reward_coin:0, owned:0},
        {id:2, name:"Professionel polyvalent", description:"Améliorez toutes les optimisations de logistique au niveau 50", objectif:50, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
        {id:3, name:"Expert en polyvalence", description:"Améliorez toutes les optimisations de logistique au niveau 150", objectif:150, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
        {id:4, name:"Génie de la polyvalence", description:"Améliorez toutes les optimisations de logistique au niveau 300", objectif:300, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    ];

    let act_versatile_quest = versatile_quests.find(item => item.owned != 1);

    let collector_quests = [
        {id:1, name:"Collectionneur amateur", description:"Découvrez 5 types de minerais différents", objectif:5, progression:0, reward_money:3000, reward_gem:50, reward_coin:0, owned:0},
        {id:2, name:"Collectionneur hors-pair", description:"Découvrez un quart de l'encyclopédie", objectif:25, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
        {id:3, name:"Grand collectionneur", description:"Découvrez la moitié de l'encyclopédie", objectif:50, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
        {id:4, name:"Détenteur du tout", description:"Atteignez 90% de l'encyclopédie", objectif:90, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
        {id:5, name:"Génie de la polyvalence", description:"??", objectif:100, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    ];

    let act_collector_quest = collector_quests.find(item => item.owned != 1);
    
    interface Quest {
        id: number;
        name: string;
        description: string;
        image?: string;
        objectif: number;
        progression: number;
        reward_money: number;
        reward_xp?: number;
        reward_gem: number;
        reward_coin: number;
        owned: number;
    }

    let quests: Quest[] = [
        {id:1, name:"Les bonnes habitudes", description:"Récolter un total de 500 minerais", image:"manage/mineral.png", objectif:500, progression:0, reward_money:500, reward_xp:20, reward_gem:0, reward_coin:0, owned:0},
        {id:2, name:"Du shopping !!", description:"Acheter un nouvel objet", image:"manage/chariot-de-chariot.png", objectif:1, progression:0, reward_money:500, reward_xp:20, reward_gem:0, reward_coin:0, owned:0},
        {id:3, name:"Le temps c'est de l'argent", description:"Cumuler 15 minutes de jeu", image:"manage/hourglass.png", objectif:15, progression:0, reward_money:500, reward_xp:20, reward_gem:0, reward_coin:0, owned:0}
    ];

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

    function incrementTimer(){
        stats[3].quantity += 1;
        if (quests[2].progression != quests[2].objectif){
            quests[2].progression += 1;
        }
    }

    function stats_update(id: number, adding_quantity: number): void{
        stats[id - 1].quantity += adding_quantity;
    }

    function open_popup(popup_name: string): void{
        const popup = document.getElementById(popup_name);
        const leftMenu = document.getElementById('left_menu');
        const rightMenu = document.getElementById('right_menu');
        const mineral = document.getElementById('mineral');
        const bottomMenu = document.getElementById('bottom_menu');

        if (popup && leftMenu && rightMenu && mineral && bottomMenu) {
            popup.style.display = 'block';
            leftMenu.style.display = 'none';
            rightMenu.style.display = 'none';
            mineral.style.zIndex = '-10';
            bottomMenu.style.zIndex = '-10';
        }
    }

    function close_popup(popup_name: string): void {
        const popup = document.getElementById(popup_name);
        const leftMenu = document.getElementById('left_menu');
        const rightMenu = document.getElementById('right_menu');
        const mineral = document.getElementById('mineral');
        const bottomMenu = document.getElementById('bottom_menu');

        if (popup && leftMenu && rightMenu && mineral && bottomMenu) {
            popup.style.display = 'none';
            leftMenu.style.display = 'block';
            rightMenu.style.display = 'block';
            mineral.style.zIndex = '1';
            bottomMenu.style.zIndex = '1';
        }
    }

    function buy_tool(tool: Tool): void {
        if (money >= tool.price && !owned_tool.includes(tool.id)) {
            money -= tool.price;
            owned_tool = [...owned_tool, tool.id];
            equip_tool(tool);
        }
        if (quests[1].progression != quests[1].objectif) {
            quests[1].progression += 1;
        }
    }

    function equip_tool(tool: Tool): void {
        if (owned_tool.includes(tool.id)) {
            equipped_tool = tool.id;
            updateMultiplier();
            saveData();
        }
    }

    function buy_bag(bag: Bag): void {
        if (money >= bag.price && !owned_bag.includes(bag.id)) {
            money -= bag.price;
            owned_bag = [...owned_bag, bag.id];
            equip_bag(bag);
        }
        if (quests[1].progression != quests[1].objectif) {
            quests[1].progression += 1;
        }
    }

    function equip_bag(bag: Bag): void {
        if (owned_bag.includes(bag.id)) {
            equipped_bag = bag.id;
            updateMultiplier();
            saveData();
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
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function showWorcker() {
        const first_section = document.getElementById('first_section');
        const second_section = document.getElementById('second_section');

        if(first_section && second_section){
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function showLogic() {
        const first_section = document.getElementById('first_section');
        const second_section = document.getElementById('second_section');

        if(first_section && second_section){
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function showTarget() {
        const first_section = document.getElementById('first_section');
        const second_section = document.getElementById('second_section');

        if(first_section && second_section){
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function showEncyclopedia() {
        const first_section = document.getElementById('first_section');
        const second_section = document.getElementById('second_section');

        if(first_section && second_section){
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function updateMultiplier() {
        const tool = tools.find(t => t.id === equipped_tool);
        const bag = bags.find(b => b.id === equipped_bag);
        const totalMultiplier = (bag ? bag.multiplier : 0);
        const multiplier = document.querySelector('.multiplier span');

        if(multiplier){
            multiplier.textContent = totalMultiplier.toString();
        }
    }

    function add_xp(xp_montant: number): void {
        if (xp + xp_montant < xp_max) {
            xp += xp_montant;
        } else {
            xp_tempory = xp_max - xp;
            xp_montant -= xp_tempory;
            level += 1;
            xp = xp_montant
        }
        stats_update(3, xp_montant)
        saveData()
    }

    function mineMineral(mineral: Mineral): void{
        const tool = tools.find(t => t.id === equipped_tool) ?? { capacity_min: 1 };
        const mining_capacity = tool.capacity_min;
        const bag  = bags.find(b => b.id === equipped_bag) ?? { capacity: 20 };
        var adding_minerals = (mining_capacity * (mineral.level * mineral.multiplier))

        if (bag_content + adding_minerals <= bag.capacity) {
            bag_content += adding_minerals;
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

            if (quests[0].progression < quests[0].objectif){
                quests[0].progression += adding_minerals;
            }
            if (act_mine_quest && act_mine_quest.progression < act_mine_quest.objectif){
                act_mine_quest.progression += adding_minerals;
            }
            saveData()

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

    function sell_bag_content() {
        money += bag_content;
        stats_update(2, bag_content)
        bag_content = 0;
        saveData();
    }

    // function add_mineral_level(mineral){
    //     if(money >= (mineral.level * mineral.multiplier * 10)){
    //         money -= (mineral.level * mineral.multiplier * 10)
    //         saveData();
    //     }
    // }

    function buy_mineral(mineral: Mineral): void{
        if(money >= mineral.price){
            money -= mineral.price
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

    function quest_reward(quest: Quest): void{
        if (quest.owned != 1){
            money += quest.reward_money;
            if (quest.reward_xp){
                add_xp(quest.reward_xp);
            }
            if (quest.reward_gem){
                gem += quest.reward_gem;
            }
            if (quest.reward_coin){
                coin += quest.reward_coin;
            }
            quest.owned = 1;
        }
        saveData();
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
        if (mineral.price <= money){
            money -= mineral.price;
            mineral.level += 1;
        }
    }

    function upgrade_logistic(item: Logistic): void{
        if (item.price <= money){
            money -= item.price;
            item.level += 1;

            if(item.level < 24){
                item.price += 5;
            } else {
                item.price += 10;
            }
        }
        logistic = [...logistic];
        saveData();
    }

    function upgrade_manager(manager: General): void{
        if(manager.price <= coin){
            coin -= manager.price;
            manager.level += 1;
        }
        general = [...general];
        saveData();
    }

    setInterval(incrementTimer, 60000);
</script>

<main>
    <header>
        <div class="top_menu">
            <div class="money"><img src="money.png" alt="money"><span id="money">{money}</span>+</div>
            <div class="coin"><img src="coin.png" alt="coin"><span id="coin">{coin}</span></div>
            <div class="gems"><img src="Mineral/diamond.png" alt="diamond"><span id="gems">{gem}</span><button>+</button></div>
            <div class="xp">
                <p class="level">{level}</p>
                <div class="xp_bar_container">
                    <img src="worker.png" alt="user">
                    <p>{xp} / {xp_max} xp</p>
                    <div class="xp_bar" style={'width: ' + (xp / xp_max) * 100 + '%'}></div>
                </div>
            </div>
        </div>
    </header>

    <div class="left_menu" id="left_menu">
        <div class="shop"><button on:click={() => open_popup("shop")}><img src="shop.png" alt="shop"></button></div>
        <div class="workers"><button on:click={() => open_popup("manage")}><img src="manage/dashboard.png" alt="worker"></button></div>
        <div class="profile"><button on:click={() => open_popup("profile")}><img src="profile.png" alt="profile"></button></div>
    </div>

    <div class="right_menu" id="right_menu">
        <div class="lock"><button><img src="lock.png" alt="lock"></button></div>
        <div class="settings"><button><img src="settings.png" alt="settings"></button></div>
    </div>

    <div class="bottom_menu" id="bottom_menu">
        <div class="quests"><button on:click={() => open_popup("progression")}><img src="quest.png" alt="quest"></button></div>
        <div class="capacity_container"><img src="{bags.find(b => b.id === equipped_bag)?.image}" alt="bagpack"><span>{bag_content} / {bags.find(b => b.id === equipped_bag)?.capacity}</span><button on:click={() => sell_bag_content()} class="sell_button">VENDRE</button></div>
        <div class="market"><button><img src="shop.png" alt="market"></button></div>
    </div>

    <div id="mineral">
        {#each mineral_1 as mineral}
        {#if mineral.owned == 1}
        <div class="mineral_content">
            <button on:click={() => mineMineral(mineral)}>
                <img src={mineral.image} alt={mineral.name} id={mineral.name}>
                <p>+ {(mineral.level * mineral.multiplier) * (tools.find(t => t.id === equipped_tool)?.capacity_min ?? 0)}</p>
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

    <div id="map_2">
    </div>

    <div id="shop" style="display: none;">
        <div class="pop_header">
            <button class="exit_button" on:click={() => close_popup("shop")}><h1>Magasin</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
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
                {#each tools as item}
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
                        {#if !owned_tool.includes(item.id)}
                            <button class="buy" on:click={() => buy_tool(item)}>{item.price}$</button>
                        {:else if equipped_tool !== item.id}
                            <button class="equip" on:click={() => equip_tool(item)}>Équiper</button>
                        {:else}
                            <p class="equipped">Equipé</p>
                        {/if}
                        {#if item.zone > zone}
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
                {#each bags as item}
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
                        {#if !owned_bag.includes(item.id)}
                            <button class="buy" on:click={() => buy_bag(item)}>{item.price}$</button>
                        {:else if equipped_bag !== item.id}
                            <button class="equip" on:click={() => equip_bag(item)}>Équiper</button>
                        {:else}
                            <p class="equipped">Equipé</p>
                        {/if}
                        {#if item.zone > zone}
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

    <div id="profile" style="display: none;">
        <div class="profile_header">
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="exit_button" on:click={() => close_popup("profile")}><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
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

    <div id="manage" style="display: none;">
        <div class="pop_header">
            <button class="exit_button" on:click={() => close_popup("manage")}><h1>Gestion</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
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
                {#each logistic as item}
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
                {#each general as item}
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

    <div id="progression" style="display: none;">
        <div class="pop_header">
            <button class="exit_button" on:click={() => close_popup("progression")}><h1>Progression</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
            <button class="pop_nav_button" on:click={() => showTarget()}>Objectifs</button>
            <button class="pop_nav_button" on:click={() => showEncyclopedia()}>Encyclopédie</button>
        </div>
        <div id="progression_first_section" class="pop_content">
            <div class="pop_class">
                <div class="pop_class_img"><img src="quest.png" alt="worker"></div>
                <div class="pop_class_text">
                    <h3>Progression Objectifs</h3>
                    <p>Ici vous pouvez optimiser chaque élément de votre exploitation minière de manière permanente</p>
                </div>
            </div>
            <div class="pop_items_container">
                {#each mine_quests as quest}
                    {#if act_mine_quest?.id == quest.id}
                        <div class="pop_item">
                            <div class="grade">
                                <img class="succes" src="Succes/pickaxe_{quest.id}.png" alt={quest.name}>
                                {#if quest.id != 1}
                                    <img class="laurel" src="Laurel/laurel_{quest.id - 1}.png" alt={quest.name}>
                                {/if}
                            </div>
                            <div class="item_text">
                                <h3>{quest.name}</h3>
                                <p>{quest.description}</p>
                            </div>
                            <div class="item_info">
                                <div class="progression_bar_container">
                                    <p>{quest.progression} / {quest.objectif}</p>
                                    <div class="progression_bar" style={'width: ' + (quest.progression / quest.objectif) * 100 + '%'}></div>
                                </div>
                                <p>Récompense: {quest.reward_money} {quest.reward_gem} {quest.reward_coin}</p>
                            </div>
                            {#if quest.objectif != quest.progression}
                                <button class="incomplete">Réclamer</button>
                            {:else}
                                <button class="complete" on:click={() => quest_reward(quest)}>Réclamer</button>
                            {/if}
                        </div>
                    {/if}
                {/each}
                {#if act_versatile_quest}
                    <div class="pop_item">
                        <div class="grade">
                            <img class="succes" src="Succes/minor_{act_versatile_quest.id}.png" alt={act_versatile_quest.name}>
                            <img class="laurel" src="Laurel/laurel_{act_versatile_quest.id}.png" alt={act_versatile_quest.name}>
                        </div>
                        <div class="item_text">
                            <h3>{act_versatile_quest.name}</h3>
                            <p>{act_versatile_quest.description}</p>
                        </div>
                        <div class="item_info">
                            <div class="progression_bar_container">
                                <p>{act_versatile_quest.progression} / {act_versatile_quest.objectif}</p>
                                <div class="progression_bar" style={'width: ' + (act_versatile_quest.progression / act_versatile_quest.objectif) * 100 + '%'}></div>
                            </div>
                            <p>Récompense: {act_versatile_quest.reward_money} {act_versatile_quest.reward_gem} {act_versatile_quest.reward_coin}</p>
                        </div>
                        {#if act_versatile_quest.objectif != act_versatile_quest.progression}
                            <button class="incomplete">Réclamer</button>
                        {:else}
                            <button class="complete" on:click={() => quest_reward(act_versatile_quest)}>Réclamer</button>
                        {/if}
                    </div>
                {/if}
                {#if act_collector_quest}
                    <div class="pop_item">
                        <div class="grade">
                            <img class="succes" src="Succes/medal_{act_collector_quest.id}.png" alt={act_collector_quest.name}>
                            <img class="laurel" src="Laurel/laurel_{act_collector_quest.id}.png" alt={act_collector_quest.name}>
                        </div>
                        <div class="item_text">
                            <h3>{act_collector_quest.name}</h3>
                            <p>{act_collector_quest.description}</p>
                        </div>
                        <div class="item_info">
                            <div class="progression_bar_container">
                                <p>{act_collector_quest.progression} / {act_collector_quest.objectif}</p>
                                <div class="progression_bar" style={'width: ' + (act_collector_quest.progression / act_collector_quest.objectif) * 100 + '%'}></div>
                            </div>
                            <p>Récompense: {act_collector_quest.reward_money} {act_collector_quest.reward_gem} {act_collector_quest.reward_coin}</p>
                        </div>
                    {#if act_collector_quest.objectif != act_collector_quest.progression}
                        <button class="incomplete">Réclamer</button>
                    {:else}
                        <button class="complete" on:click={() => quest_reward(act_collector_quest)}>Réclamer</button>
                    {/if}
                </div>
            {/if}
        </div>


        <div id="progression_second_section" class="pop_content" style="display: none;">
            <div class="pop_class">
                <div class="pop_class_img"><img src="open_book.png" alt="open_book"></div>
                <div class="pop_class_text">
                    <h3>Encyclopédie</h3>
                    <p>Complétez chaque partie de cet encyclopédie afin d’obtenir de précieuses récompenses</p>
                </div>
            </div>
            <div class="pop_items_container">
            </div>
        </div>
    </div>
    </div>
    


    <div id="quest" style="display: none;">
        <div class="pop_header">
            <button class="exit_button" on:click={() => close_popup("quest")}><h1>Quêtes</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
            <button class="pop_nav_button" on:click={() => showTarget()}>Objectifs</button>
            <button class="pop_nav_button" on:click={() => showEncyclopedia()}>Encyclopédie</button>
        </div>
        <div id="quest_first_section" class="pop_content">
            <div class="pop_class">
                <div class="pop_class_img"><img src="quest.png" alt="worker"></div>
                <div class="pop_class_text">
                    <h3>Progression Objectifs</h3>
                    <p>Ici vous pouvez trouverez des taches à accomplir. Et biensûr, tout travail mérite salaire.</p>
                </div>
            </div>
            <div class="pop_items_container">
                {#each quests as quest}
                    <div class="pop_item">
                        <img src={quest.image} alt={quest.name}>
                        <div class="pop_text">
                            <h5>{quest.name}</h5>
                            <p>{quest.description}</p>
                            <div class="quest_bar_container">
                                <p>{quest.progression} / {quest.objectif}</p>
                                <div class="quest_bar" style={'width: ' + (quest.progression / quest.objectif) * 100 + '%'}></div>
                            </div>
                        </div>
                        {#if quest.objectif <= quest.progression}
                            {#if quest.owned == 1}
                                <div class="done">
                                    <img src="checked.png" alt="checked">
                                </div>
                            {:else}
                                <div class="recover">
                                    <button on:click={() => quest_reward(quest)}>Récupéré</button>
                                </div>
                            {/if}
                        {/if}
                    </div>
                {/each}
            </div>
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
    /* Base */

    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

    *{
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;

    --primary-color: #18202B;
    }


    /* Body */

    /* body{
    background-image: url(background.png);
    background-size: 100%;
    } */

    body{
    background-color: #29ABE2;
    }

    /* header */

    .top_menu{
    width: 96%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    align-items: center;
    padding: 15px 5px 0 5px;
    z-index: 10;
    font-size: 12px;
    }

    .money{
    width: 98px;
    }

    .coin{
    width: 50px;
    }

    .gems{
    width: 71px;
    }

    .gems, .money, .coin{
    background-color: var(--primary-color);
    color: #fff;
    border-radius: 5px;
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    }

    .gems img, .money img, .coin img{
    max-width: 17px;
    }

    .gems button{
    border: none;
    outline: none;
    background: none;
    color: #fff;
    }

    .xp{
    width: 100px;
    color: #17202A;
    font-size: 4px;
    margin: 0;
    }

    .xp .level{
    position: absolute;
    background-color: #17202A;
    color: #fff;
    font-size: 8px;
    padding: 1px 2px 0px 3px;
    border-radius: 10px;
    transform: translate(47px, -5px);
    }

    .xp_bar_container{
    width: 100%;
    height: 20px;
    border: 2px solid #17202A;
    border-radius: 5px;
    background-color: #fff;
    color: #17202A;
    }

    .xp_bar_container img{
    position: absolute;
    width: 19px;
    transform: translateY(1px);
    }

    .xp_bar_container p{
    position: absolute;
    font-size: 7px;
    transform: translate(33px, 7px);
    }

    .xp_bar{
    height: 100%;
    background-color: #F48400;
    border-radius: 3px;
    }

    /* Left menu */

    .left_menu{
    transform: translateY(100px);
    margin-left: 5px;
    }

    .left_menu button{
    border: none;
    outline: none;
    background-color: lightblue;
    padding: 5px 6px 1px 6px;
    border-radius: 10px;
    margin: 3px;
    }

    .left_menu img{
    width: 40px;
    }

    /* right menu */

    .right_menu{
    position: absolute;
    right: 0;
    transform: translateY(-77px);
    padding: 0 5px 0 0;
    }

    .right_menu .lock button{
    border: none;
    outline: none;
    background-color: lightblue;
    padding: 5px 6px 1px 6px;
    border-radius: 10px;
    margin: 3px;
    }

    .right_menu .lock img{
    width: 40px;
    }

    .right_menu .settings button{
    background-color: #fff;
    border: none;
    outline: none;
    transform: translate(10px, 10px);
    padding: 5px 5px 0 5px ;
    border-radius: 5px;
    }

    .right_menu .settings img{
    max-width: 30px;
    }

    /* bottom menu */

    .bottom_menu{
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #29ABE2;
    width: 100%;
    height: 80px;
    z-index: 1;
    }

    .bottom_menu button{
    border: none;
    outline: none;
    background-color: #0770FF;
    border-radius: 10px;
    padding: 5px 6px 1px 6px;
    margin: 0 10px;
    }

    .bottom_menu img{
    width: 40px;
    }

    .bottom_menu .capacity_container{
    width: 50%;
    height: 60px;
    background-color: var(--primary-color);
    border-radius: 10px 10px 0 0;
    color: #fff;
    transform: translateY(10px);
    display: flex;
    justify-content: space-around;
    align-items: center;
    }

    .bottom_menu .capacity_container img{
    width: 30px;
    background-color: #2B384A;
    border-radius: 10px;
    padding: 2px;
    }

    .bottom_menu .capacity_container button.sell_button{
    background-color: #00B912;
    padding: 5px 15px;
    margin: 0;
    color: #fff;
    font-weight: bold;
    border-radius: 5px;
    }

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

    /* Quest page */

    .quest_bar_container{
    width: 100%;
    height: 15px;
    border: 1px solid #17202A;
    border-radius: 10px;
    background-color: #fff;
    color: #17202A;
    }

    .quest_bar_container p{
    position: absolute;
    text-align: center;
    transform: translate(15px, 3px);
    }

    .quest_bar{
    height: 100%;
    border-radius: 10px;
    background-color: #0770FF;
    }

    .pop_item .recover{
    position: absolute;
    width: 92.4%;
    transform: translate(-10px, -10px);
    background-color: #434343;
    opacity: 0.9;
    border-radius: 15px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 5.5% 0;
    }

    .pop_item .recover button{
    outline: none;
    border: none;
    background: none;
    color: #00B912;
    font-size: large;
    }

    .pop_item .recover img{
    width: 65px;
    }

    .done{
    position: absolute;
    width: 92.4%;
    transform: translate(-10px, -10px);
    background-color: #434343;
    opacity: 0.9;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 2.5% 0;
    }

    /* Shop */

    #shop, #manage, #progression{
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    }

    .pop_header{
    color: #fff;
    padding: 80px 5px 0 15px;
    }

    .pop_header .pop_nav_button{
    border: none;
    outline: non;
    padding: 1px 15%;
    border-radius: 10px 10px 0 0;
    transform: translateY(1px);
    }

    .pop_header .exit_button{
    color: #fff;
    border: none;
    outline: non;
    background: none;
    display: flex;
    align-items: center;
    }

    .pop_header .exit_button :nth-child(2){
    margin-left: 10px;
    font-size: 2em;
    }

    .pop_header button:nth-child(2n){
    background-color: #E2E2E2;
    }

    .pop_header button:nth-child(3n){
    background-color: orange;
    padding: 1px 13%;
    }

    .pop_content{
    width: 100%;
    height: 100%;
    background-color: #8CC4DB;
    border-radius: 5px 5px 0 0;
    overflow-y: scroll;
    }

    .pop_class{
    margin: 0 15px 10px 15px;
    padding: 15px;
    font-size: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    }

    #first_section .pop_class, #manage_first_section .pop_class, #progression_first_section .pop_class, #quest_first_section .pop_class{
    background-color: #E2E2E2;
    border-radius: 0 10px 10px 10px;
    }

    #second_section .pop_class, #manage_second_section .pop_class, #progression_second_section .pop_class, #quest_second_section .pop_class{
    background-color: orange;
    border-radius: 10px;
    }

    .pop_class_img img{
    width: 50px;
    margin-right: 10px;
    }

    .pop_items_container{
    margin: 10px 15px 10px 15px;
    }

    .pop_item{
    background-color: #fff;
    border-radius: 15px;
    margin: 10px 0;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    max-height: 150px;
    text-align: center;
    filter: drop-shadow(0 4px 4px #575757);
    }

    .pop_item>* {
    flex: 1 1 auto;
    }

    .pop_item>*:nth-child(1){
    max-width: 50px;
    }

    .pop_item>*:nth-child(2){
    width: 80%;
    }

    .pop_item img{
    width: 50px;
    margin-right: 10px;
    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));
    }

    .pop_item h3{
    font-size: 18px;
    }

    .pop_item p{
    font-size: 8px;
    }

    .pop_item .capacity, .pop_item .multiplicator{
    width: 172px;
    height: 13px;
    border-radius: 3px;
    margin: 5px 0;
    padding: 2px 0 0 5px;
    color: #fff;
    text-align: start;
    }

    .pop_item .capacity{
    background-color: #29ABE2;
    }

    .pop_item .multiplicator{
    background-color: #9747FF;
    }

    .pop_item .buy, .pop_item .equip, .pop_item .equipped{
    color: #fff;
    background-color: #FF382B;
    outline: none;
    border: none;
    border-radius: 3px;
    margin: 9px 10px;
    }

    .pop_item .equipped{
    background-color: #00B912;
    text-align: center;
    padding: 1px 0 0 0;
    font-size: 14px;
    }

    .pop_item .locked{
    position: absolute;
    width: 100%;
    transform: translate(-10px, -10px);
    color: #fff;
    background-color: #434343;
    opacity: 0.95;
    border-radius: 10px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    text-align: center;
    padding: 6.5% 0;
    }

    .pop_item .locked img{
    width: 65px;
    }

    #manage .pop_item>*:nth-child(3){
    width: 100%;
    align-items: center;
    justify-content: center;
    }

    #manage .pop_item button.buy{
    margin: 0 32%;
    padding: 2px 0;
    }

    #manage_first_section .pop_item button.buy{
    background-color: #00B912;
    }

    #manage_second_section .pop_item button.buy{
    background-color: #9747FF;
    }

    #manage_second_section .pop_item button.buy img{
    width: 15px;
    right: 0;
    transform: translate(60%, 20%);
    }

    #progression_first_section .pop_item .grade{
    position: relative;
    width: 70px;
    height: 70px;
    }

    #progression_first_section .pop_item .succes{
    position: absolute;
    width: 50px;
    height: 50px;
    top: 6px;
    left: 10px;
    z-index: 2;
    }

    #progression_first_section .pop_item .laurel{
    position: absolute;
    width: 70px;
    height: 70px;
    top: 0;
    left: 0;
    }

    #progression_first_section .pop_item button{
    outline: none;
    border: none;
    border-radius: 5px;
    background: none;
    color: white;
    font: bold;
    margin: 0 30%;
    padding: 3px 0;
    }

    #progression_first_section .pop_item button.incomplete{
    background-color: #666;
    opacity: 0.9;
    }

    #progression_first_section .pop_item button.complete{
    background-color: #00B912;
    }

    #progression_first_section .pop_item .progression_bar_container{
    width: 100%;
    height: 20px;
    border: 1px solid #17202A;
    border-radius: 5px;
    background-color: #fff;
    color: #17202A;
    }

    #progression_first_section .pop_item .progression_bar_container p{
    position: absolute;
    text-align: center;
    transform: translate(50%, 50%);
    }

    #progression_first_section .pop_item .progression_bar{
    height: 100%;
    border-radius: 5px;
    background-color: #78D4FB;
    }

    #progression_first_section .pop_item{
    row-gap: 5px;
    }

    #progression_first_section .pop_item>*:nth-child(3){
    width: 100%;
    }

    /* Profile */

    #profile{
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
    }



    /* Map 2 */

    /* #map_2{
    z-index: 10000;
    transform: translate(100%, 0);
    width: 100%;
    height: 100%;
    background-color: #00B912;
    } */

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
</style>