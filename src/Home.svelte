<script lang="ts">
  import { onMount } from 'svelte';
  import Swal from 'sweetalert2';

  import { Link, navigate } from 'svelte-routing';
  import Shop from './Shop.svelte';
  import Bagpack from './Bagpack.svelte';
  import Real_shop from './Real_shop.svelte';

  import Popup from './Popup.svelte';

  import { AdMob, AdmobConsentStatus, AdmobConsentDebugGeography, type RewardAdOptions, type AdLoadInfo, RewardAdPluginEvents, type AdMobRewardItem } from '@capacitor-community/admob';

  async function showConsent() {
    const consentInfo = await AdMob.requestConsentInfo();

    if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
      const { status } = await AdMob.showConsentForm();
    }
  }

  async function rewardVideo(): Promise<void> {
    console.log('Début de la fonction rewardVideo');
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      // Subscribe prepared rewardVideo
      console.log('Publicité chargée avec succès', info);
    });

    AdMob.addListener(RewardAdPluginEvents.Rewarded, (rewardItem: AdMobRewardItem) => {
      // Subscribe user rewarded
      console.log(rewardItem);
      console.log('Utilisateur récompensé', rewardItem);
    });

    const options: RewardAdOptions = {
      adId: 'ca-app-pub-3917461892557500/7126849771',
      isTesting: true,
      // npa: true
      // ssv: {
      //   userId: "A user ID to send to your SSV"
      //   customData: JSON.stringify({ ...MyCustomData })
      //}
    };
    console.log('Avant AdMob.prepareRewardVideoAd');
    await AdMob.prepareRewardVideoAd(options);
    console.log('Après AdMob.prepareRewardVideoAd');

    console.log('Avant AdMob.showRewardVideoAd');
    const rewardItem = await AdMob.showRewardVideoAd();
    console.log('Après AdMob.showRewardVideoAd', rewardItem);
  }

  export async function initialize(): Promise<void> {
    await AdMob.initialize();

    const [trackingInfo, consentInfo] = await Promise.all([
      AdMob.trackingAuthorizationStatus(),
      AdMob.requestConsentInfo(),
    ]);

    if (trackingInfo.status === 'notDetermined') {
      await AdMob.requestTrackingAuthorization();
    }

    const authorizationStatus = await AdMob.trackingAuthorizationStatus();
    if (
      authorizationStatus.status === 'authorized' &&
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      await AdMob.showConsentForm();
    }
  }

  let showPopup = false;

  let money = 100000;
  let crystals = 0;
  let gems = 10;
  let clickPower = 1;
  let crystalsPerSecond = 0;
  let somme = 0;
  let reset_somme = 0;
  let spaw_rate;
  let rocks = [];
  let worker_popup_show = 'display: none;';
  let settings_popup_show = 'display : none;';
  let quest_popup_show = 'display: none;';
  let sound = true;

  let equipment_price = 30;
  let equipment_level = 0;
  let tired_price = 50;
  let tired_level = 0;
  let equipment_rock = 0;
  let tired_money = 0;

  const rock_collect_sound = new Audio('rock_collect.mp3');
  const sell_sound = new Audio('sell_sound.mp3');
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
    equipment_price = parsedData.equipment_price;
    equipment_level = parsedData.equipment_level;
    tired_price = parsedData.tired_price;
    tired_level = parsedData.tired_level;
    equipment_rock = parsedData.equipment_rock;
    tired_money = parsedData.tired_money;
  }
}

  // Appelez loadData dans onMount
  onMount(() => {
    loadData();
    showRock();
    equipment_bonus();
    tired_bonus();
  });

  onMount(async () => {
    await initialize();
    await rewardVideo();
  })


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
    pop();
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
    pop();
    worker_popup_show = 'display: block;';
  }

  function worker_close_popup(){
    pop();
    worker_popup_show = 'display: none;';
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
    if (somme != 0){
      sell_sound.play();
      sell_sound.volume = 0.5;
    }
    minerals.forEach(mineral => {
      money += mineral.price * mineral.quantity;
      somme -= mineral.quantity;
      mineral.quantity = 0;
      saveData()
    })
  }

  function buyEquipment(equipment) {
    if (money >= equipment_price) {
        money -= equipment_price;
        equipment_level ++;
        if (equipment_level < 10) {
          equipment_price = equipment_price * 1.2;
          equipment_rock ++;
        }
        if (equipment_level < 20 && equipment_level > 9) {
          equipment_price = equipment_price * 1.25;
          equipment_rock += 2;
        }
        saveData();
    } else {
        showError('Pas asser d\'argent', 'Vous n\'avez pas asser d\'argent pour améliorer son équipement!');
    }
  }

  function buyTired(tired) {
    if (money >= tired_price) {
        money -= tired_price;
        tired_price = tired_price * 1.2;
        tired_level ++;
        tired_money += 5;
        saveData();
    } else {
        showError('Pas asser d\'argent', 'Vous n\'avez pas asser d\'argent pour améliorer l\'assurance!');
    }
  }

  function equipment_bonus() {
    bagpacks.forEach(bagpack => {
      if (bagpack.equip){
        if (somme + equipment_rock <= bagpack.capacity) {
          minerals[0].quantity += equipment_rock;
          minerals.forEach(mineral => {
            reset_somme = reset_somme + mineral.quantity;
          });
          somme = reset_somme;
          reset_somme = 0;
        }
        if (somme + equipment_rock > bagpack.capacity) {
          minerals[0].quantity += (bagpack.capacity - somme);
          minerals.forEach(mineral => {
            reset_somme = reset_somme + mineral.quantity;
          });
          somme = reset_somme;
          reset_somme = 0;
        }
      }
    });
    // minerals = [...minerals];
    setTimeout(() =>{
      equipment_bonus();
    },3000);
  }

  function tired_bonus() {
    
    money += tired_money;

    setTimeout(() =>{
      tired_bonus();
    },3000);
  }

  function pop() {
    if (sound){
      pop_sound.play();
    }
  }

  function settings_open_popup(){
    pop();
    settings_popup_show = 'display: block;';
  }

  function settings_close_popup(){
    pop();
    settings_popup_show = 'display: none;';
  }

  function sound_settings(){
    if (sound){
      sound = false;
    } else {
      sound = true;
    }
  }

  function testpub(){
    initialize();
    rewardVideo();
  }

  function quest_open_popup(){
    pop();
    quest_popup_show = 'display: block;';
  }

  function quest_close_popup(){
    pop();
    quest_popup_show = 'display: none;';
  }

</script>
  
<main>
  <div class="nav_container">
    <nav class="top_menu">
      <div class="settings">
        <button on:click={settings_open_popup}><img src="settings.png" alt="settings"></button>
      </div>
      <div class="nav_item counter"><img src="dollar.png" alt="money">{Math.trunc(money)}</div>
      <div class="nav_item counter"><img src="diamond.png" alt="gems">{gems} +</div>
      <div class="multiplier"><p>x</p></div>
      <div class="quest"><button on:click={quest_open_popup}><img src="quest_alert.png" alt="quest_alert"></button></div>
      <div class="nav_item real_shop"><a href="/Real_shop"><img src="shopping_basket.png" alt="shopping_basket"></a></div>
        <!-- {#each tools as item}
          {#if (item.equip)}
              <div class="nav_item"><a href="/Shop"><img src={item.image} alt="curent_tool"></a></div>
          {/if}                
      {/each} -->
    </nav>
  </div>

  <div class="side_nav_container">
    <div class="side_nav_content">
      <div class="nav_item"><button on:click={afficherPopup}><img src="shop.png" alt=shop></button></div>
      <div class="nav_item center"><button on:click={worker_open_popup}><img src="worker.png" alt="workers"></button></div>
      <div class="nav_item"><button on:click={() => showError('C\'est pas pour maintenant!', 'Une mise à jour arrive prochainement.')}><img src="lock.png" alt="lock"></button></div>
    </div>
  </div>

  {#each rocks as rock}
    {#if rock.visible}
      <button on:click={() => mineRock(rock)} class="rock_button">
        <img src="/rock.png" alt="rock" style="position: absolute; left: {rock.X}px; top: {rock.Y}px; max-width: 30px;">
      </button>
    {/if}
  {/each}

  <!-- <button on:click={testpub} style="width: 100%; z-index: 10000; background-color: red; margin: 50% 0 0 0;">Test pubs</button> -->


  <!-- <div class="nav_container">
    <div class="bottom_menu">
    </div>
  </div> -->

  <div class="bottom_menu">
    {#each bagpacks as bagpack}
      {#if (bagpack.equip)}
      <div class="current_bagpack">
        <img src={bagpack.image} alt="bagpack">
        <h2>{Math.trunc(somme)}/{bagpack.capacity}</h2>
        <div class="sell">
          <button on:click={sell}>Vendre</button>
        </div>
      </div>
      {/if}
    {/each}
  </div>

  <Popup bind:show={showPopup} on:rediriger={redirigerPage}/>

  <div class="worker_overlay" style={worker_popup_show}>
    <div class="worker_popup">
      <button class="close_button" on:click={() => worker_close_popup()}>x</button>
      <h3><img src="worker.png" alt="worker">Gestions des ouvriers</h3><br><br>
      <div class="equipment">
        <div class="worker_left">
          <img src="worker_risk.png" alt="worker"><br>
          <p>{equipment_level}</p>
        </div>
        <div class="worker_right">
          <h5>Equipement de l'ouvrier</h5>
          <p>Investissez dans l’équipement de votre ouvrier afin qu’il vous rapporte plus de minerais par seconde</p>
          {#each equipments as equipment}
            {#if (equipment.current)}
            <button class="level_price" on:click={() => buyEquipment(equipment)}>
              Améliorer: {Math.trunc(equipment_price)}$
            </button>
            {/if}
          {/each}
        </div>
      </div><br><br>
      <div class="tired">
        <div class="worker_left">
          <img src="worker_old.png" alt="worker"><br>
          <p>{tired_level}</p>
        </div>
        <div class="worker_right">
          <h5>Fatigue de l'ouvrier</h5>
          <p>Améliorez l’assurance santé de votre ouvrier, plus celle-ci est importante, plus votre ouvrier la paiera cher</p>
          {#each tireds as tired}
            {#if (tired.current)}
            <button class="level_price" on:click={() => buyTired(tired)}>
              Améliorer: {Math.trunc(tired_price)}$
            </button>
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>

  <div class="settings_overlay" style={settings_popup_show}>
    <div class="settings_popup">
      <button class="close" on:click={settings_close_popup}>x</button>
      <h3><img src="settings.png" alt="settings">Options</h3><br><br>
      <p>Musique <label class="switch"><input type="checkbox"><span></span></label></p><br>
      <p>Son <label class="switch"><input type="checkbox"><span></span></label></p>
    </div>
  </div>

  <div class="quest_overlay" style={quest_popup_show}>
    <div class="quest_popup">
      <button class="close" on:click={quest_close_popup}>x</button>
      <h3><img src="quest_alert.png" alt="quest">Quêtes</h3><br><br>
      <div class="quest_container">
        <h5>Nom de la quête</h5>
        <p>Faire une tâche</p>
        <progress max="100" value="70"></progress>
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

  .equipment .worker_left, .tired .worker_left{
    position: absolute;
    left: 0;
    margin: 2.5% 0 0 10px;
  }

  .equipment .worker_left img, .tired .worker_left img{
    max-width: 50px;
  }

  .equipment .worker_left p, .tired .worker_left p{
    background-color: #212F3D;
    color: #fff;
    padding: 7px;
    border-radius: 8px;
    z-index: 1000;
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

  /* Settings */

  .settings_overlay {
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

  .settings_popup {
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    margin: 100% 10px 0 10px;
    transform: translate(0, -50%);
  }

  .settings_popup button{
    position: absolute;
    margin: 20px 0 0 0;
    background-color: transparent;
    border-radius: 8px;
    border: none;
    padding: 10px;
    right: 0;
    margin: -10px 10px 0 0;
  }

  .settings_popup img{
      max-width: 20px;
      margin: 0 10px 0 0;
      transform: translate(0, 20%);
  }

  .switch {
    display: inline-block;
    position: relative;
    width: 50px;
    height: 20px;
    cursor: pointer;
    overflow: hidden;
    transform: translate(0, 5px);
  }
  .switch input {
    position: absolute;
    top: -30px;
    top: -30px;
    width: 0;
    height: 0;
    outline: none;
  }
  .switch input + span {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #99b4df;
    border-radius: 20px;
  }
  .switch input + span:before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 4px;
    width: 15px;
    height: 15px;
    background: white;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: all .5s;
  }
  .switch input:checked + span {
    background: #35b850;
  }
  .switch input:checked + span:before {
    left: 32px;
  }
</style>