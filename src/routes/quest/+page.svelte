<script lang="ts">
    import { goto } from "$app/navigation";

    import { quests, mine_quest, versatile_quest, collector_quest, act_mine_quest_index, act_versatile_quest, act_collector_quest, act_mine_quest } from "../../stores/quest";
    import { playerProgress } from "../../stores/store";

    import type { Quest } from "../../stores/quest";

    function showTarget() {
        const first_section = document.getElementById('progression_first_section');
        const second_section = document.getElementById('progression_second_section');

        if(first_section && second_section){
            first_section.style.display = 'block';
            second_section.style.display = 'none';
        }
    }

    function showEncyclopedia() {
        const first_section = document.getElementById('progression_first_section');
        const second_section = document.getElementById('progression_second_section');

        if(first_section && second_section){
            first_section.style.display = 'none';
            second_section.style.display = 'block';
        }
    }

    function quest_reward(quest: Quest): void{
        if (quest.owned != 1){
            playerProgress.update(m => ({...m, money: m.money += quest.reward_money}));
            // if (quest.reward_xp){
            //     add_xp(quest.reward_xp);
            // }
            // if (quest.reward_gem){
            //     gem += quest.reward_gem;
            // }
            // if (quest.reward_coin){
            //     coin += quest.reward_coin;
            // }
            $act_mine_quest += 1;
        }
    }


</script>

<main>
    <!-- <div id="quest" display="none">
        <div class="pop_header">
            <button class="exit_button" on:click={() => goto('../../')}><h1>Quêtes</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
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
                {#each $quests as quest}
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
    </div> -->

    <div id="progression">
        <div class="pop_header">
            <button class="exit_button" on:click={() => goto('/')}><h1>Progression</h1> <i class="fa-solid fa-arrow-right-from-bracket"></i></button>
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
                {#each $mine_quest as quest}
                    {#if quest.id == $act_mine_quest}
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
                                <p>Récompense:<span class="money">{quest.reward_money}</span> <img src="money.png" alt="money"> <span class="gem">{quest.reward_gem}</span> <img src="gem.png" alt="gem"> <span class="coin">{quest.reward_coin}</span> <img src="coin.png" alt="coin"></p>
                            </div>
                            {#if quest.objectif > quest.progression}
                                <button class="incomplete">Réclamer</button>
                            {:else}
                                <button class="complete" on:click={() => quest_reward(quest)}>Réclamer</button>
                            {/if}
                        </div>
                    {/if}
                {/each}
                {#if $act_versatile_quest}
                    <div class="pop_item">
                        <div class="grade">
                            <img class="succes" src="Succes/minor_{$act_versatile_quest.id}.png" alt={$act_versatile_quest.name}>
                            {#if $act_versatile_quest.id != 1}
                                <img class="laurel" src="Laurel/laurel_{$act_versatile_quest.id - 1}.png" alt={$act_versatile_quest.name}>
                            {/if}
                        </div>
                        <div class="item_text">
                            <h3>{$act_versatile_quest.name}</h3>
                            <p>{$act_versatile_quest.description}</p>
                        </div>
                        <div class="item_info">
                            <div class="progression_bar_container">
                                <p>{$act_versatile_quest.progression} / {$act_versatile_quest.objectif}</p>
                                <div class="progression_bar" style={'width: ' + ($act_versatile_quest.progression / $act_versatile_quest.objectif) * 100 + '%'}></div>
                            </div>
                            <p>Récompense:<span class="money">{$act_versatile_quest.reward_money}</span> <img src="money.png" alt="money"> <span class="gem">{$act_versatile_quest.reward_gem}</span> <img src="gem.png" alt="gem"> <span class="coin">{$act_versatile_quest.reward_coin}</span> <img src="coin.png" alt="coin"></p>
                        </div>
                        {#if $act_versatile_quest.objectif != $act_versatile_quest.progression}
                            <button class="incomplete">Réclamer</button>
                        {:else}
                            <button class="complete" on:click={() => quest_reward($act_versatile_quest)}>Réclamer</button>
                        {/if}
                    </div>
                {/if}
                {#if $act_collector_quest}
                    <div class="pop_item">
                        <div class="grade">
                            <img class="succes" src="Succes/medal_{$act_collector_quest.id}.png" alt={$act_collector_quest.name}>
                            {#if $act_collector_quest.id != 1}
                                <img class="laurel" src="Laurel/laurel_{$act_collector_quest.id - 1}.png" alt={$act_collector_quest.name}>
                            {/if}
                        </div>
                        <div class="item_text">
                            <h3>{$act_collector_quest.name}</h3>
                            <p>{$act_collector_quest.description}</p>
                        </div>
                        <div class="item_info">
                            <div class="progression_bar_container">
                                <p>{$act_collector_quest.progression} / {$act_collector_quest.objectif}</p>
                                <div class="progression_bar" style={'width: ' + ($act_collector_quest.progression / $act_collector_quest.objectif) * 100 + '%'}></div>
                            </div>
                            <p>Récompense:<span class="money">{$act_collector_quest.reward_money}</span> <img src="money.png" alt="money"> <span class="gem">{$act_collector_quest.reward_gem}</span> <img src="gem.png" alt="gem"> <span class="coin">{$act_collector_quest.reward_coin}</span> <img src="coin.png" alt="coin"></p>
                        </div>
                    {#if $act_collector_quest.objectif != $act_collector_quest.progression}
                        <button class="incomplete">Réclamer</button>
                    {:else}
                        <button class="complete" on:click={() => quest_reward($act_collector_quest)}>Réclamer</button>
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
</main>

<style>
    #progression{
        background-color: #8CC4DB;
    }
</style>