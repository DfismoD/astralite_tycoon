<script>
    import { fly } from 'svelte/transition';

    document.addEventListener('DOMContentLoaded', (event) => {
        loadData();
        updateMultiplier();
        incrementTimer();
    });

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
        logistic: logistic.map(item => ({ id: item.id, level: item.level, price: item.currentPrice }))
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

            parsedData.logistic.forEach(savedItem => {
                const item = logistic.find(i => i.id === savedItem.id);
                if (item) {
                    item.level = savedItem.level;
                    item.currentPrice = savedItem.price; // Correction ici
                }
            });

        }
    }

    let float_mineral = [];

    let tools = [
        {id:1, name:"Brosse à dents", image:"tools/tool1.png", price:0, multiplier:1, capacity_min:1, capitcity_max:2, cooldown:0.1, description:"Un outil très rudimentaire, vous ne trouverez pas pire.", zone:1},
        {id:2, name:"Pelle à poussière", image:"tools/tool2.png", price:20, multiplier:1, capacity_min:2, capitcity_max:3, cooldown:0.1, description:"Très utile pour balayer la poussière chez soi, un peu moins pour creuser...", zone:1},
        {id:3, name:"Jouets de plage", image:"tools/tool3.png", price:100, multiplier:1, capacity_min:2, capitcity_max:5, cooldown:0.1, description:"Un outil efficace, si l’on imagine pas le petit qui n’a plus de jouets...", zone:1},
        {id:4, name:"Truelle", image:"tools/tool4.png", price:400, multiplier:1.02, capacity_min:4, capitcity_max:6, cooldown:0.1, description:"Ce n’est pas son utilité première, mais ça devrait faire l’affaire !", zone:2},
        {id:5, name:"Pelle", image:"tools/tool5.png", price:950, multiplier:1.2, capacity_min:6, capitcity_max:8, cooldown:0.1, description:"Un outil des plus classiques, avec une prise en main rapide !", zone:2},
        {id:6, name:"Pelle à neige", image:"tools/tool6.png", price:1000, multiplier:1.05, capacity_min:7, capitcity_max:10, cooldown:0.1, description:"Un outil plus atypique, efficace pour attraper plein de minerais à la fois !", zone:2},
        {id:7, name:"Grande pelle", image:"tools/tool7.png", price:4000, multiplier:1.055, capacity_min:9, capitcity_max:13, cooldown:0.1, description:"Un outil des plus classiques, avec une prise en main rapide, en plus grand !", zone:2},
    ];

    let bags = [
        {id:1, name:"Poches", image:"bags/bag1.png", price:0, multiplier:1, capacity:20, description:"Avoir les poches vides permet de mieux les remplir...", zone:1},
        {id:2, name:"Sac plastique", image:"bags/bag2.png", price:50, multiplier:1, capacity:50, description:"Habitué aux légumes de saison, esperons que ce sac ne se déchire pas...", zone:1},
        {id:3, name:"Sac alimentaire", image:"bags/bag3.png", price:130, multiplier:1.05, capacity:110, description:"Plus solide que son homologue en plastoc.", zone:1},
        {id:4, name:"Banane de chantier", image:"bags/bag4.png", price:850, multiplier:1.12, capacity:200, description:"Vous pourrez y ranger quelques minerais entre vos clés et portefeuille...", zone:2},
        {id:5, name:"Sac à main", image:"bags/bag5.png", price:3000, multiplier:1.18, capacity:380, description:"Un sac à main, vous ne savez pas ce que c’est ?", zone:2},
        {id:6, name:"Malette", image:"bags/bag6.png", price:5500, multiplier:1.25, capacity:600, description:"Adorée des professeurs de Maths, la mallette permet une grande capacité !", zone:2},
    ];

    let logistic = [
        {id:1, name:"Équipement des mineurs", image:"manage/accident.png", color:"#73BEDD", amelioration:"Rendement des mineurs", level:0, price:20, baseYield:2, currentYield:2, description:"Plus vos mineurs sont protégés, plus ils sont efficaces dans leurs sessions !"},
        {id:2, name:"Nourriture sur les sites", image:"manage/food.png", color:"#B573DD", amelioration:"Amélioration du rendement", level:0, price:20, baseYield:2, currentYield:2, description:"Améliorez la qualité de la nourriture sur vos sites de minage pour améliorer le rendement de vos mineurs"},
        {id:3, name:"Livraison des minerais", image:"manage/delivery.png", color:"#BCBE61", amelioration:"Multiplicateur de vente", level:0, price:20, baseYield:2, currentYield:2, description:"Une livraison rapide aux raffineries vous assure un bon retour de la clientèle"},
        {id:4, name:"Horaires des mineurs", image:"manage/time.png", color:"#737EDD", amelioration:"Temps supplémentaire", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Améliorez le salaire de vos mineurs afin qu’ils travaillent pendant votre absence !"},
        {id:5, name:"Motivation des mineurs", image:"manage/motivation.png", color:"#BE7761", amelioration:"Bonus gain d'absence", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Mettez en place des structures pour motiver vos mineurs lors de votre absence"},
        {id:6, name:"Sécurité des sites", image:"manage/security.png", color:"#61BE8C", amelioration:"Gain d'expérience", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Renforcez la sécurité de vos sites afin d’éviter les pertes et accidents qui dégradent votre image"},
    ];

    let general = [
        {id:1, name:"Réduction du délai", image:"manage/hourglass.png", color:"#5664E2", amelioration:"Réduction du délai sur les outils", level:0, price:1, description:"Améliorez l’entretien de vos outils afind de diminuer leur surchauffe pour les utiliser plus souvent"},
        {id:2, name:"Contact fournisseurs", image:"manage/contact.png", color:"#6BBC73", amelioration:"Réduction des prix", level:0, price:1, description:"Renforcez les contacts avec vos fournisseurs afin d’obtenir des réductions sur vos futurs achats de matériel"},
        {id:3, name:"Rafinage des minerais", image:"manage/mineral.png", color:"#B1B422", amelioration:"Multiplicateur de vente", level:0, price:1, description:"Améliorez la qualité de votre système de rafinage afin d’augmenter vos prix de vente"},
        {id:4, name:"Champs de trèfles", image:"manage/clover.png", color:"#DD73A6", amelioration:"Chance supplémentaire", level:0, price:1, description:"Entretenez un champ de trèfles pour que la chance soit avec vous"},
        {id:5, name:"Sacs améliorés", image:"manage/renforced_bag.png", color:"#1DAFEE", amelioration:"Bonus de stockage", level:0, price:1, description:"Vous pouvez investir dans un rouleau d’adhésif pour renforcer vos sacs"},
        {id:6, name:"Outlis améliorés", image:"manage/renforced_tool.png", color:"#ED4F4F", amelioration:"Bonus de récolte", level:0, price:1, description:"Aprovisionnez-vous d’outils de meilleure qualité pour des sessions plus efficaces"},
    ];

    let mine_quests = [
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

    let quests = [
        {id:1, name:"Les bonnes habitudes", description:"Récolter un total de 500 minerais", image:"manage/mineral.png", objectif:500, progression:0, reward_money:500, reward_xp:20, owned:0},
        {id:2, name:"Du shopping !!", description:"Acheter un nouvel objet", image:"manage/chariot-de-chariot.png", objectif:1, progression:0, reward_money:500, reward_xp:20, owned:0},
        {id:3, name:"Le temps c'est de l'argent", description:"Cumuler 15 minutes de jeu", image:"manage/hourglass.png", objectif:15, progression:0, reward_money:500, reward_xp:20, owned:0}
    ];

    let mineral_1 = [
        {id:1, name:"Cailloux", image:"Mineral/rock.png", price:0, level:1, multiplier:1, owned:1},
        {id:2, name:"Grés", image:"Mineral/likings.png", price:100, level:1, multiplier:3, owned:0},
        {id:3, name:"Argile", image:"Mineral/clay.png", price:1000, level:1, multiplier:5, owned:0}
    ];
    let act_mineral = mineral_1[0];

    let mineral_2 = [
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

    function stats_update(id, adding_quantity){
        stats[id - 1].quantity += adding_quantity;
    }

    function open_popup(popup_name){
        document.getElementById(popup_name).style.display = 'block';
        document.getElementById('left_menu').style.display = 'none';
        document.getElementById('right_menu').style.display = 'none';
        document.getElementById('mineral').style.zIndex = '-10';
        document.getElementById('bottom_menu').style.zIndex = '-10';
    }

    function close_popup(popup_name){
        document.getElementById(popup_name).style.display = 'none';
        document.getElementById('left_menu').style.display = 'block';
        document.getElementById('right_menu').style.display = 'block';
        document.getElementById('mineral').style.zIndex = '1';
        document.getElementById('bottom_menu').style.zIndex = '1';
    }

    function buy_tool(tool) {
        if (money >= tool.price && !owned_tool.includes(tool.id)) {
            money -= tool.price;
            owned_tool = [...owned_tool, tool.id];
            equip_tool(tool);
        }
        if (quests[1].progression != quests[1].objectif) {
            quests[1].progression += 1;
        }
    }

    function equip_tool(tool) {
        if (owned_tool.includes(tool.id)) {
            equipped_tool = tool.id;
            updateMultiplier();
            saveData();
        }
    }

    function buy_bag(bag) {
        if (money >= bag.price && !owned_bag.includes(bag.id)) {
            money -= bag.price;
            owned_bag = [...owned_bag, bag.id];
            equip_bag(bag);
        }
        if (quests[1].progression != quests[1].objectif) {
            quests[1].progression += 1;
        }
    }

    function equip_bag(bag) {
        if (owned_bag.includes(bag.id)) {
            equipped_bag = bag.id;
            updateMultiplier();
            saveData();
        }
    }

    function showTools() {
        document.getElementById('first_section').style.display = 'block';
        document.getElementById('second_section').style.display = 'none';
    }

    function showBags() {
        document.getElementById('first_section').style.display = 'none';
        document.getElementById('second_section').style.display = 'block';
    }

    function showWorcker() {
        document.getElementById('manage_first_section').style.display = 'block';
        document.getElementById('manage_second_section').style.display = 'none';
    }

    function showLogic() {
        document.getElementById('manage_first_section').style.display = 'none';
        document.getElementById('manage_second_section').style.display = 'block';
    }

    function showTarget() {
        document.getElementById('progression_first_section').style.display = 'block';
        document.getElementById('progression_second_section').style.display = 'none';
    }

    function showEncyclopedia() {
        document.getElementById('progression_first_section').style.display = 'none';
        document.getElementById('progression_second_section').style.display = 'block';
    }

    function updateMultiplier() {
        const tool = tools.find(t => t.id === equipped_tool);
        const bag = bags.find(b => b.id === equipped_bag);
        const totalMultiplier = (bag ? bag.multiplier : 0);
        document.querySelector('.multiplier span').textContent = totalMultiplier.toString();
    }

    function add_xp(xp_montant) {
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

    function mineMineral(mineral){
        const tool = tools.find(t => t.id === equipped_tool);
        const mining_capacity = tool.capacity_min;
        const bag_capacity = bags.find(b => b.id === equipped_bag).capacity;
        var adding_minerals = (mining_capacity * (mineral.level * mineral.multiplier))

        if (bag_content + adding_minerals <= bag_capacity) {
            bag_content += adding_minerals;
            add_xp(1)
            stats_update(1, adding_minerals)
            document.getElementById(mineral.name).animate(
                [
                    { transform: "scale(1.2)" },
                    { transform: "scale(1)" }
                ],
                    { duration: 150 }
            )
            if (quests[0].progression < quests[0].objectif){
                quests[0].progression += adding_minerals;
            }
            if (act_mine_quest.progression < act_mine_quest.objectif){
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

    function buy_mineral(mineral){
        if(money >= mineral.price){
            money -= mineral.price
            mineral.owned = 1
            saveData()
            location.reload()
        }
    }

    function edit_pseudo(){
        document.getElementById("pseudo").style.display = 'none';
        document.getElementById("edit_button").style.display = 'none';
        document.getElementById("valid_button").style.display = 'block';
        document.getElementById("pseudo_edit").style.display = 'block';
    }

    function valid_pseudo(){
        // @ts-ignore
        var pseudo_input = document.getElementById('pseudo_edit').value;
        pseudo = pseudo_input;
        document.getElementById("pseudo").style.display = 'block';
        document.getElementById("edit_button").style.display = 'block';
        document.getElementById("valid_button").style.display = 'none';
        document.getElementById("pseudo_edit").style.display = 'none';
    }

    function quest_reward(quest){
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

    function upgrade_mineral_popup(mineral){
        document.getElementById("upgrade_mineral_popup").style.display = 'block';
        act_mineral = mineral;
    }

    function close_upgrade_mineral_popup(){
        document.getElementById("upgrade_mineral_popup").style.display = 'none';
    }

    function upgrade_mineral(mineral){
        if (mineral.price <= money){
            money -= mineral.price;
            mineral.level += 1;
        }
    }

    function upgrade_logistic(item){
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

    function upgrade_manager(manager){
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
        <div class="capacity_container"><img src="{bags.find(b => b.id === equipped_bag).image}" alt="bagpack"><span>{bag_content} / {bags.find(b => b.id === equipped_bag).capacity}</span><button on:click={() => sell_bag_content()} class="sell_button">VENDRE</button></div>
        <div class="market"><button><img src="shop.png" alt="market"></button></div>
    </div>

    <div id="mineral">
        {#each mineral_1 as mineral}
        {#if mineral.owned == 1}
        <div class="mineral_content">
            <button on:click={() => mineMineral(mineral)}>
                <img src={mineral.image} alt={mineral.name} id={mineral.name}>
                <p>+ {(mineral.level * mineral.multiplier) * tools.find(t => t.id === equipped_tool).capacity_min}</p>
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
            <button class="exit_button" on:click={() => close_popup("profile")}><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
        </div>
        <div class="pop_class">
            <div class="pop_class_img">
                <img src="profile.png" alt="profile">
            </div>
            <p id="pseudo">{pseudo}</p>
            <input id ="pseudo_edit" type="text" placeholder="Votre pseudo" style="display: none;">
            <button id="valid_button" on:click={() => valid_pseudo()} style="display: none;"><i class="fa-solid fa-check"></i></button>
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
                        {#if act_mine_quest.id == quest.id}
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