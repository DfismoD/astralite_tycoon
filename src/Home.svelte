<script>
  import { onMount } from 'svelte';
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
    rockX = Math.random() * window.innerWidth;
    rockY = Math.random() * window.innerHeight;
    rockVisible = true;

    // Set a timeout to hide the rock after a few seconds (e.g., 3 seconds)
    setTimeout(() => {
      hideRock();
    }, 3000);
  }

  function hideRock() {
    rockVisible = false;
  }

  function mineRock() {
    if (rockVisible) {
      crystals += 1;
      hideRock();
      saveData();
    }
  }

</script>
  
<main>
  <div class="nav_container">
    <nav class="top_menu">
        <div class="nav_item counter"><img src="dollar.png" alt="money">{crystals}</div>
        <div class="nav_item counter"><img src="diamond.png" alt="gems">{gems}</div>
        <div class="nav_item"><a href="/Shop"><img src="dustpan.png" alt="curent_tool"></a></div>
        <div class="nav_item real_shop"><a href="/Real_shop"><img src="shopping_basket.png" alt="shopping_basket"></a></div>
    </nav>
  </div>

  <img class="background" src="/background.png" alt="background">
  <button
    style="position: absolute; left: {rockX}px; top: {rockY}px;"
    on:click={mineRock}
  >
    <img src="rock.png" alt="rock" >
  </button>

  <div class="nav_container">
    <div class="bottom_menu">
      <div class="nav_item"><button on:click={afficherPopup}><img src="shop.png" alt=shop></button></div>
      <div class="nav_item center"><a href="/Worker"><img src="worker.png" alt="workers"></a></div>
      <div class="nav_item"><button on:click={() => showError('C\'est pas pour maintenant!', 'Une mise à jour arrive prochainement.')}><img src="lock.png" alt="lock"></button></div>
    </div>
  </div>

  <Popup bind:show={showPopup} on:rediriger={redirigerPage}/>
</main>