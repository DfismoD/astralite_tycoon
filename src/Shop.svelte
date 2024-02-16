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

    const money_sound = new Audio('money_sound.mp3');

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
      money
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
        }
    }

    onMount(() => {
        loadData();
    });
    

    function close_button(){
        saveData();
        window.location.href = '/';
    }

    function showError(title, message){
        Swal.fire({
        icon: 'error',
        title: title,
        text: message,
        confirmButtonColor: '#35b850',
        });
    }

    function buyMiningTool(tool) {
        if (money >= tool.cost) {
            money -= tool.cost;
            money_sound.play();
            tools.forEach((otherTool) => {
                if (otherTool !== tool) {
                    otherTool.equip = false;
                }
            });
            tool.buy = true;
            tool.equip = true;
            saveData();
            tools = [...tools]
        } else {
            showError('Pas asser d\'argent', 'Vous n\'avez pas asser d\'argent pour cet outils!');
        }
    }

    function equip_tool(tool){
        tools.forEach((otherTool) => {
            if (otherTool !== tool) {
                otherTool.equip = false;
            }
        });
        money_sound.play();
        tool.equip = true;
        saveData();
        tools = [...tools]
    }
</script>

<main>
    <div class="nav_container">
        <nav class="top_menu">
            <div class="nav_item counter"><img src="dollar.png" alt="money">{Math.trunc(money)}</div>
            <div class="nav_item counter"><img src="diamond.png" alt="gems">{gems}</div>
            {#each tools as item}
                {#if (item.equip)}
                    <div class="nav_item"><a href="/Shop"><img src={item.image} alt="curent_tool"></a></div>
                {/if}                
            {/each}
            <div class="nav_item real_shop"><a href="real_shop.svelte"><img src="shopping_basket.png" alt="shopping_basket"></a></div>
        </nav>
      </div>

      <div class="overlay">
        <div class="market">
            <button class="close_button" on:click={() => close_button()} style="margin: 0px; padding: 10px;">x</button>
            <h2><img class="" src="pioche.png" alt="pioche">Outils</h2>
                {#each tools as tool (tool.name)}
                <button
                    class="item"
                    class:affordable={money >= tool.cost}
                >
                    <div class="left_content">
                        <img src={`./${tool.image}`} alt={tool.name}>
                    </div>
                    <div class="right_content">
                        <div class="top_content">
                            <h4>{tool.name}</h4>
                            <p>{tool.description}</p>
                        </div>
                        <div class="bottom_content">
                            <div class="left">
                                <p>-Apparition minerai: x{tool.am}</p>
                                <p>-Minerai ramassés:  x{tool.mr}</p>
                            </div>
                            <div class="right">
                                {#if (tool.buy)}
                                    {#if (tool.equip)}
                                        <p class="equip">Equipé</p>
                                    {:else}
                                        <button class="price" on:click={() => equip_tool(tool)}>Equiper</button>
                                    {/if}
                                {:else}
                                    <button class="price" on:click={() => buyMiningTool(tool)}>{tool.cost}$</button>
                                {/if}
                            </div>
                        </div>
                    </div>
                </button>
                {/each}
          </div>
      </div>
</main>