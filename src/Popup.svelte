<script>  
    export let show;

    const pop_sound = new Audio('pop_sound.mp3');
  
    function redirigerPage(page) {
      pop_sound.play();
      setTimeout(() => {
        window.location.href = page;
      }, 50);
    }

    function closePopup(){
      pop_sound.play();
      show = false;
    }
  </script>
  
  {#if show}
    <div class="overlay">
      <div class="popup">
        <button class="close_button" on:click={() => closePopup()}>x</button>
        <h2><img src="shop.png" alt="shop">Magasins</h2><br><br>
        <button class="nav_button" on:click={() => redirigerPage('/Shop')}>Outils</button>
        <button class="nav_button" on:click={() => redirigerPage('/Bagpack')}>Sac à dos</button>
        <!-- <button on:click={() => redirigerPage('/page3')}>Aller à la page 3</button> -->
      </div>
    </div>
  {/if}
  
  <style>
    *{
        transition: all 0.2s ease-in;
    }
    .overlay {
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
  
    .popup {
      background: white;
      color: #333;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 0 10px 0 10px;
    }

    h2 img{
        max-width: 25px;
        margin: 0 10px 0 0;
    }

    .close_button{
        background-color: transparent;
        border: none;
        border-radius: 10px;
        color: #333;
        float: right;
        margin: -10px -10px 10px 10px;
        padding: 10px;
    }

    .close_button:hover{
        background-color: lightgray;
    }

    .nav_button{
        color: #fff;
        background-color: #4CAF50;
        border: 3px solid transparent;
        border-radius: 10px;
        padding: 10px;
        width: 90%;
        margin: 10px 0 10px 0;
    }

    .nav_button:hover{
        opacity: 1.5;
        border: 3px solid #7FED84;
    }
  </style>
  