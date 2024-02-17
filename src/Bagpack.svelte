<script>
    import { Link } from "svelte-routing";
    import Home from  './Home.svelte';
    import { onMount } from "svelte";
    import Swal from "sweetalert2";

    let money;
    let tools = [];
    let bagpacks = [];
    let minerals = [];
    let somme;
    let crystals;
    let gems;
    let clickPower;
    let crystalsPerSecond;

    let equipment_price;
    let equipment_level;
    let tired_price;
    let tired_level;
    let equipment_rock;
    let tired_money;

    const error = new Audio('error.mp3');
    const pop_sound = new Audio('pop_sound.mp3');

    function saveData() {
    const dataToSave = {
      crystals,
      gems,
      clickPower,
      crystalsPerSecond,
      tools,
      bagpacks,
      minerals,
      somme,
      money,
      equipment_price,
      equipment_level,
      tired_price,
      tired_level,
      equipment_rock,
      tired_money
    };

    // Convertissez les données en JSON et enregistrez-les dans le stockage local
    localStorage.setItem('astralite_tycoon_data', JSON.stringify(dataToSave));
  }

    function loadData() {
        const savedData = localStorage.getItem('astralite_tycoon_data');

        if (savedData) {
            const parsedData = JSON.parse(savedData);

            // Mettez à jour les variables avec les données chargées
            crystals = parsedData.crystals;
            gems = parsedData.gems;
            clickPower = parsedData.clickPower;
            crystalsPerSecond = parsedData.crystalsPerSecond;
            tools = parsedData.tools;
            bagpacks = parsedData.bagpacks;
            minerals = parsedData.minerals;
            somme = parsedData.somme;
            money = parsedData.money;
            equipment_price = parsedData.equipment_price;
            equipment_level = parsedData.equipment_level;
            tired_price = parsedData.tired_price;
            tired_level = parsedData.tired_level;
            equipment_rock = parsedData.equipment_rock;
            tired_money = parsedData.tired_money;
        }
    }

    onMount(() => {
        loadData();
    });
    

    function close_button(){
        pop_sound.play();
        saveData();
        setTimeout(() => {
            window.location.href = '/';
        }, 50);
    }

    function showError(title, message){
        Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#35b850',
        });
        error.play();
    }

    function buyMiningBagpack(bagpack) {
        if (money >= bagpack.cost) {
            money -= bagpack.cost;
            bagpacks.forEach((otherbagback) => {
                if (otherbagback !== bagpack) {
                    otherbagback.equip = false;
                }
            });
            bagpack.buy = true;
            bagpack.equip = true;
            saveData();
            bagpacks = [...bagpacks];
        } else {
            showError('Pas asser d\'argent', 'Vous n\'avez pas asser d\'argent pour ce sac!');
        }
    }

    function equip_bagpack(bagpack){
        bagpacks.forEach((otherbagpack) => {
            if (otherbagpack !== bagpack) {
                otherbagpack.equip = false;
            }
        });
        bagpack.equip = true;
        saveData();
        bagpacks = [...bagpacks];
    }
</script>

<main>
    <div class="nav_container">
        <nav class="top_menu">
            <div class="nav_item counter"><img src="dollar.png" alt="money">{Math.trunc(money)}</div>
            <div class="nav_item counter"><img src="diamond.png" alt="gems">{gems}</div>
            {#each bagpacks as item}
                {#if (item.equip)}
                    <div class="nav_item"><a href="/Shop"><img src={item.image} alt="curent_bagback"></a></div>
                {/if}                
            {/each}
            <div class="nav_item real_shop"><a href="real_shop.svelte"><img src="shopping_basket.png" alt="shopping_basket"></a></div>
        </nav>
      </div>

      <div class="overlay">
        <div class="market">
            <button class="close_button" on:click={() => close_button()} style="margin: 0px; padding: 10px;">x</button>
            <h2><img class="" src="bag.png" alt="bag">Sac</h2>
                {#each bagpacks as item (item.name)}
                <button
                    class="item"
                    class:affordable={money >= item.cost}
                >
                    <div class="left_content">
                        <img src={`./${item.image}`} alt={item.name}>
                    </div>
                    <div class="right_content">
                        <div class="top_content">
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>
                        </div>
                        <div class="bottom_content">
                            <div class="left">
                                <p>-Capacité: {item.capacity}</p>
                            </div>
                            <div class="right">
                                {#if (item.buy)}
                                    {#if (item.equip)}
                                        <p class="equip">Equipé</p>
                                    {:else}
                                        <button class="price" on:click={() => equip_bagpack(item)}>Equiper</button>
                                    {/if}
                                {:else}
                                    <button class="price" on:click={() => buyMiningBagpack(item)}>{item.cost}$</button>
                                {/if}
                            </div>
                        </div>
                    </div>
                </button>
                {/each}
          </div>
      </div>
</main>