<script>
    import { goto } from '$app/navigation';
 </script>
 <main>
    <div class="sign">
        <h1 class="title">Map</h1>
     </div>
     <button class="bac_a_sable" on:click={() => goto('/')}>Bac à sable</button>
 </main>

 <style>

    main{
        width: 450vw;
        height: 100vh;
        background-image: url("Map/background.png");
        background-repeat: none;
        overflow-x: scroll;
        touch-action: manipulation;
    }

    div.sign{
        width: 65%;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        padding: 10px;
        background-color: burlywood;
        border: 2px solid brown;
        border-top: none;
        border-left: none;
        border-radius: 0 0 15px 0;
    }

    button.bac_a_sable{
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: darkgoldenrod;
        padding: 5px;
        border-radius: 10px;
        border: none;
        outline: none;
        margin: 75vh 0 0 45vw;
    }
 </style>