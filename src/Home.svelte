<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import Swal from 'sweetalert2';

  import { Link, navigate } from 'svelte-routing';
  import Shop from './Shop.svelte';
  import Bagpack from './Bagpack.svelte';
  import Worker from './Worker.svelte';
  import Real_shop from './Real_shop.svelte';

  import Popup from './Popup.svelte';

  let showPopup = false;

  let crystals = 100;
  let gems = 10;
  let curent_tool = 0;
  let clickPower = 1;
  let crystalsPerSecond = 0;

  let rockX = 0;
  let rockY = 0;
  let rockVisible = false;
  let display;

  let update = false;

  let spaw_rate;

  let rocks = [];

  function saveData() {
    const dataToSave = {
      crystals,
      gems,
      clickPower,
      crystalsPerSecond,
      itemList
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
    itemList = parsedData.itemList;
  }
}

  // Appelez loadData dans onMount
  onMount(() => {
    showRock();
    loadData();
  });


  let itemList = [
    { name: "Brosse", cost: 0, am: 1, mr: 1, image: "dustpan.png", description: "Un outil très rudimentaire, vous ne trouverez pas pire", buy: true, equip: true },
    { name: "Jouets de plage", cost: 20, am: 1, mr: 2, image: "beatch_toy.png", description: "Rassurez-moi, vous ne les avez tout de même pas volé?", buy: false, equip: false },
    { name: "Truelle", cost: 100, am: 1.1, mr: 3, image: "trowel.png", description: "Ce n'est pas son utilité première mais ça devrait faire l'affaire.", buy: false, equip: false },
    { name: "Pelle", cost: 420, am: 1.45, mr: 3.2, image: "shovel.png", description: "Un outil des plus classiques, avec une prise en main rapide!", buy: false, equip: false },
    { name: "Pelle à neige", cost: 420, am: 1.15, mr: 4, image: "snow_shovel.png", description: "Un outil plus atypique, efficace pour attraper pleins de minerais à la fois!", buy: false, equip: false },
    { name: "Grande pelle", cost: 1400, am: 1.2, mr: 4.5, image: "large_shovel.png", description: "Un outil des plus classiques, avec une prise en main rapide, mais en plus grand!", buy: false, equip: false },
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
      Y: window.innerHeight / 1.7 + Math.random() * (window.innerHeight / 4.8),
      visible: true
    };

    if (rocks.length < 10){
      rocks = [...rocks, newRock];
    } else {
      rocks.shift();
      rocks = [...rocks, newRock];
    }

    itemList.forEach(item => {
      if (item.equip){
        spaw_rate = 1000 / item.am;
        console.log("spawn rate : " + spaw_rate);
      }
    });

    setTimeout(() =>{
      showRock();
    },spaw_rate)
  }

  function hideRock(rock) {
    rock.visible = false;
    rocks = [...rocks];
  }

  function mineRock(rock) {
    if (rock.visible) {
      itemList.forEach(item => {
        if (item.equip){
          crystals = crystals + 1 * item.mr;
        }
      });
      hideRock(rock);
      saveData();
    }
  }

</script>
  
<main>
  <div class="nav_container">
    <nav class="top_menu">
        <div class="nav_item counter"><img src="dollar.png" alt="money">{Math.trunc(crystals)}</div>
        <div class="nav_item counter"><img src="diamond.png" alt="gems">{gems}</div>
        {#each itemList as item}
          {#if (item.equip)}
              <div class="nav_item"><a href="/Shop"><img src={item.image} alt="curent_tool"></a></div>
          {/if}                
      {/each}
        <div class="nav_item real_shop"><a href="/Real_shop"><img src="shopping_basket.png" alt="shopping_basket"></a></div>
    </nav>
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
      <div class="nav_item center"><a href="/Worker"><img src="worker.png" alt="workers"></a></div>
      <div class="nav_item"><button on:click={() => showError('C\'est pas pour maintenant!', 'Une mise à jour arrive prochainement.')}><img src="lock.png" alt="lock"></button></div>
    </div>
  </div>

  <Popup bind:show={showPopup} on:rediriger={redirigerPage}/>
</main>