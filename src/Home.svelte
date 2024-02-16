<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import Swal from 'sweetalert2';

  import { Link, navigate } from 'svelte-routing';
  import Shop from './Shop.svelte';
  import Bagpack from './Bagpack.svelte';
  import Real_shop from './Real_shop.svelte';

  import Popup from './Popup.svelte';

  let showPopup = false;

  let money = 10000;
  let crystals = 0;
  let gems = 10;
  let clickPower = 1;
  let crystalsPerSecond = 0;
  let somme = 0;
  let reset_somme = 0;
  let spaw_rate;
  let rocks = [];
  let worker_popup_show = 'display: none;';

  const rock_collect_sound = new Audio('rock_collect.mp3');

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

  // Ajoutez cette fonction dans votre script
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

  // Appelez loadData dans onMount
  onMount(() => {
    showRock();
    loadData();
  });


  let minerals = [
    { name: "cobblestone", quantity: 0, price: 1 },
  ];

  let tools = [
    { name: "Brosse", cost: 0, am: 1, mr: 1, image: "dustpan.png", description: "Un outil très rudimentaire, vous ne trouverez pas pire", buy: true, equip: true },
    { name: "Jouets de plage", cost: 20, am: 1, mr: 2, image: "beatch_toy.png", description: "Rassurez-moi, vous ne les avez tout de même pas volé?", buy: false, equip: false },
    { name: "Truelle", cost: 100, am: 1.2, mr: 3, image: "trowel.png", description: "Ce n'est pas son utilité première mais ça devrait faire l'affaire.", buy: false, equip: false },
    { name: "Pelle", cost: 350, am: 1.45, mr: 3.45, image: "shovel.png", description: "Un outil des plus classiques, avec une prise en main rapide!", buy: false, equip: false },
    { name: "Pelle à neige", cost: 350, am: 1.15, mr: 4.35, image: "snow_shovel.png", description: "Un outil plus atypique, efficace pour attraper pleins de minerais à la fois!", buy: false, equip: false },
    { name: "Grande pelle", cost: 1000, am: 1.2, mr: 4.5, image: "large_shovel.png", description: "Un outil des plus classiques, avec une prise en main rapide, mais en plus grand!", buy: false, equip: false },
  ];

  let bagpacks = [
    { name: "Banane", cost: 0, capacity: 10, image: "fanny.png", description: "Vous pourrez y ranger quelques minerais entre vos clés et votre portefeuille...", buy: true, equip: true },
    { name: "Sac", cost: 110, capacity: 70, image: "bag.png", description: "Un sac plastique résistant, mais n’y mettez pas trop de minerais!", buy: false, equip: false },
    { name: "Mallete", cost: 1150, capacity: 300, image: "mallet.png", description: "Adorée des professeurs de Maths, cette mallette vous garantie une grande capacité pour vos minerais!", buy: false, equip: false },
    { name: "Sac à dos", cost: 7300, capacity: 800, image: "backpack.png", description: "Un sac à dos classique qui permet un stockage important de minerai.", buy: false, equip: false },
    { name: "Sac de gym", cost: 18000, capacity: 2000, image: "gymbag.png", description: "Un sac cylindrique énorme qui assure un grand stockage de minerai et de rechange!", buy: false, equip: false },
    { name: "Sac d'aventurier", cost: 45000, capacity: 6500, image: "adventurebag.png", description: "Idéal pour ramasser les cailloux sur le bord des routes au cours de vos aventures !", buy: false, equip: false },
    { name: "Sac militaire", cost: 200000, capacity: 15000, image: "militarybag.png", description: "Tout grand soldat a besoin d’un sac aussi grand que lui !", buy: false, equip: false }
  ];

  let equipments = [
    { level: 1, price: 0, gain: 1, current: true },
    { level: 2, price: 30, gain: 2, current: false },
    { level: 3, price: 100, gain: 3, current: false },
  ];

  let tireds = [
    { level: 1, price: 0, gain: 1, current: true },
    { level: 2, price: 30, gain: 2, current: false },
    { level: 3, price: 100, gain: 3, current: false },
  ];

  let crystals_error = "Fonds insuffisants pour acheter cet outil de minage !";

  function afficherPopup() {
    saveData();
    showPopup = true;
  }

  function fermerPopup() {
    showPopup = false;
  }

  function redirigerPage(page) {
    fermerPopup();
  }

  function worker_open_popup(){
    worker_popup_show = 'display: block;';
  }

  function worker_close_popup(){
    worker_popup_show = 'display: none;';
  }

  function showError(title, message){
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#35b850',
    });
  }

  function showRock() {
    const newRock = {
      X: window.innerWidth / 10 + Math.random() * (window.innerWidth / 1.4),
      Y: window.innerHeight / 1.7 + Math.random() * (window.innerHeight / 5),
      visible: true
    };

    if (rocks.length < 10){
      rocks = [...rocks, newRock];
    } else {
      rocks.shift();
      rocks = [...rocks, newRock];
    }

    tools.forEach(item => {
      if (item.equip){
        spaw_rate = 1000 / item.am;
        console.log("spawn rate : " + spaw_rate);
      }
    });

    setTimeout(() =>{
      showRock();
    },spaw_rate);
  }

  function hideRock(rock) {
    rock.visible = false;
    rocks = [...rocks];
  }

  function mineRock(rock) {
    if (rock.visible) {
      tools.forEach(tool => {
        if (tool.equip){
          let current_tool = tool;
          bagpacks.forEach(bagpack => {
            if (bagpack.equip){
              if ((somme + current_tool.mr) <= bagpack.capacity){
                minerals[0].quantity += 1 * current_tool.mr;

                rock_collect_sound.play();
                rock_collect_sound.volume = 0.5;

                minerals.forEach(mineral => {
                  reset_somme = reset_somme + mineral.quantity;

                });
                somme = reset_somme;
                reset_somme = 0;
              } else {
                showError("Videz votre sac!", "Votre sac est rempli, videz le pour y ranger de nouvelles chose.");
                minerals[0].quantity += bagpack.capacity - somme; 
                somme = bagpack.capacity;
              }
            }
          })
        }
      });
      hideRock(rock);
      saveData();
    }
  }

  function sell(){
    minerals.forEach(mineral => {
      money += mineral.price * mineral.quantity;
      somme -= mineral.quantity;
      mineral.quantity = 0;
      saveData()
    })
  }

  function buyEquipment(equipment) {
    if (money >= equipment.price) {
        money -= equipment.price;
        equipment.current = true;
        saveData();
        equipments = [...equipment]
    } else {
        showError('Pas asser d\'argent', 'Vous n\'avez pas asser d\'argent pour cet outils!');
    }
  }

  function buyTired(tired) {
    if (money >= tired.price) {
        money -= tired.price;
        tired.current = true;
        saveData();
        tireds = [...tired]
    } else {
        showError('Pas asser d\'argent', 'Vous n\'avez pas asser d\'argent pour cet outils!');
    }
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
        <div class="nav_item real_shop"><a href="/Real_shop"><img src="shopping_basket.png" alt="shopping_basket"></a></div>
    </nav>
  </div>

  {#each bagpacks as bagpack}
    {#if (bagpack.equip)}
    <div class="current_bagpack">
      <img src={bagpack.image} alt="bagpack">
      <h2>{Math.trunc(somme)}/{bagpack.capacity}</h2>
    </div>
    {/if}
  {/each}

  <div class="sell">
    <button on:click={sell}>Vendre</button>
  </div>


  {#each rocks as rock}
    {#if rock.visible}
      <button on:click={() => mineRock(rock)} class="rock_button">
        <img src="/rock.png" alt="rock" style="position: absolute; left: {rock.X}px; top: {rock.Y}px; max-width: 30px;">
      </button>
    {/if}
  {/each}


  <div class="nav_container">
    <div class="bottom_menu">
      <div class="nav_item"><button on:click={afficherPopup}><img src="shop.png" alt=shop></button></div>
      <div class="nav_item center"><button on:click={worker_open_popup}><img src="worker.png" alt="workers"></button></div>
      <div class="nav_item"><button on:click={() => showError('C\'est pas pour maintenant!', 'Une mise à jour arrive prochainement.')}><img src="lock.png" alt="lock"></button></div>
    </div>
  </div>

  <Popup bind:show={showPopup} on:rediriger={redirigerPage}/>

  <div class="worker_overlay" style={worker_popup_show}>
    <div class="worker_popup">
      <button class="close_button" on:click={() => worker_close_popup()}>x</button>
      <h3><img src="worker.png" alt="worker">Gestions des ouvriers</h3><br><br>
      <div class="equipment">
        <div class="worker_left">
          <img src="worker_risk.png" alt="worker"><br>
          {#each equipments as equipment}
            {#if (equipment.current)}
              <p>Niv{equipment.level}:{equipment.gain}/s</p>
            {/if}
          {/each}
        </div>
        <div class="worker_right">
          <h5>Equipement de l'ouvrier</h5>
          <p>Investissez dans l’équipement de votre ouvrier afin qu’il vous rapporte plus de minerais par seconde</p>
          {#each equipments as equipment}
            {#if (!equipment.current)}
            <button class="level_price" on:click={() => buyEquipment(equipment)}>
              Niveau suivant ( {equipment.gain}/s ) : {equipment.price}$
            </button>
            {/if}
          {/each}
        </div>
      </div><br><br>
      <div class="tired">
        <div class="worker_left">
          <img src="worker_old.png" alt="worker"><br>
          {#each tireds as tired}
            {#if (tired.current)}
              <p>Niv{tired.level}:{tired.gain}/s</p>
            {/if}
          {/each}
        </div>
        <div class="worker_right">
          <h5>Fatigue de l'ouvrier</h5>
          <p>Améliorez l’assurance santé de votre ouvrier, plus celle-ci est importante, plus votre ouvrier la paiera cher</p>
          {#each tireds as tired}
            {#if (!tired.current)}
            <button class="level_price" on:click={() => buyTired(tired)}>
              Niveau suivant ( {tired.gain}/s ) : {tired.price}$
            </button>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>

</main>
<style>
  /* Worker Popup */

  .worker_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .worker_popup {
    background: white;
    color: #333;
    padding: 0 20px 20px 20px;
    border-radius: 8px;
    text-align: center;
    margin: 100% 10px 0 10px;
    transform: translate(0, -50%);
  }

  .worker_popup button{
    margin: 20px 0 0 0;
  }

  h3 img{
      max-width: 40px;
      margin: 0 10px 0 0;
      transform: translate(0, 50%);
  }

  .equipment, .tired{
    width: 85%;
    margin: auto;
  }

  .equipment .worker_left img, .tired .worker_left img{
    position: absolute;
    max-width: 50px;
    left: 0;
    margin: 5% 0 0 10px;
  }

  .equipment .worker_left p, .tired .worker_left p{
    position: absolute;
    left: 0;
    margin: 15% 0 0 3px;
    transform: translate(0, -50%);
  }

  .equipment .worker_right, .tired .worker_right{
    width: 90%;
    margin: 0 0 0 10%;
  }

  .equipment .worker_right .level_price, .tired .worker_right .level_price{
    background-color: #35b850;
    border-radius: 5px;
    color: #fff;
    padding: 5px;
    font-size: 0.6em;
    margin: 0;
  }

  .equipment p, .tired p{
    font-size: 0.6em;
    margin: 5px 0 5px 0;
  }

  .equipment button, .tired button{
    color: #fff;
    background-color: #35b850;
    border-radius: 10px;
    border: none;
    outline: none;
    padding: 10px;
  }
</style>