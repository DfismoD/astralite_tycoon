import { writable } from "svelte/store";

export type Quest = {
    id: number;
    name: string;
    description: string;
    image?: string;
    objectif: number;
    progression: number;
    reward_money: number;
    reward_xp?: number;
    reward_gem: number;
    reward_coin: number;
    owned: number;
}

export const quests: Quest[] = [
    {id:1, name:"Les bonnes habitudes", description:"Récolter un total de 500 minerais", image:"manage/mineral.png", objectif:500, progression:0, reward_money:500, reward_xp:20, reward_gem:0, reward_coin:0, owned:0},
    {id:2, name:"Du shopping !!", description:"Acheter un nouvel objet", image:"manage/chariot-de-chariot.png", objectif:1, progression:0, reward_money:500, reward_xp:20, reward_gem:0, reward_coin:0, owned:0},
    {id:3, name:"Le temps c'est de l'argent", description:"Cumuler 15 minutes de jeu", image:"manage/hourglass.png", objectif:15, progression:0, reward_money:500, reward_xp:20, reward_gem:0, reward_coin:0, owned:0}
];

export const mine_quests: Quest[] = [
    {id:1, name:"Mineur novice", description:"Ramassez un total de 500 minerais", objectif:500, progression:0, reward_money:1000, reward_gem:5, reward_coin:1, owned:0},
    {id:2, name:"Mineur expérimenté", description:"Ramassez un total de 5000 minerais", objectif:5000, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    {id:3, name:"Mineur expert", description:"Ramassez un total de 100 000 minerais", objectif:100000, progression:0, reward_money:100000, reward_gem:50, reward_coin:0, owned:0},
    {id:4, name:"As de la mine", description:"Ramassez un total de 50M minerais", objectif:50000000, progression:0, reward_money:100000, reward_gem:50, reward_coin:0, owned:0},
];

export const act_mine_quest_index = mine_quests.findIndex(item => item.owned != 1 ? mine_quests : null);

export const versatile_quests = [
    {id:1, name:"Apprenti polyvalent", description:"Améliorez toutes les optimisations de logistique au niveau 25", objectif:25, progression:0, reward_money:5000, reward_gem:50, reward_coin:0, owned:0},
    {id:2, name:"Professionel polyvalent", description:"Améliorez toutes les optimisations de logistique au niveau 50", objectif:50, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    {id:3, name:"Expert en polyvalence", description:"Améliorez toutes les optimisations de logistique au niveau 150", objectif:150, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    {id:4, name:"Génie de la polyvalence", description:"Améliorez toutes les optimisations de logistique au niveau 300", objectif:300, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
];

export const act_versatile_quest = writable(versatile_quests.find(item => item.owned != 1));

export const collector_quests = [
    {id:1, name:"Collectionneur amateur", description:"Découvrez 5 types de minerais différents", objectif:5, progression:0, reward_money:3000, reward_gem:50, reward_coin:0, owned:0},
    {id:2, name:"Collectionneur hors-pair", description:"Découvrez un quart de l'encyclopédie", objectif:25, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    {id:3, name:"Grand collectionneur", description:"Découvrez la moitié de l'encyclopédie", objectif:50, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    {id:4, name:"Détenteur du tout", description:"Atteignez 90% de l'encyclopédie", objectif:90, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
    {id:5, name:"Génie de la polyvalence", description:"??", objectif:100, progression:0, reward_money:20000, reward_gem:50, reward_coin:0, owned:0},
];

export const act_collector_quest = writable(collector_quests.find(item => item.owned != 1));

function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored): defaultValue;
    }
    return defaultValue;
}

function persistantWritable<T>(key: string, defaultValue: T) {
    const store = writable<T>(loadFromLocalStorage(key, defaultValue));

    store.subscribe((value) => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    return store;
}

export const quest = writable<Quest[]>(quests);
export const mine_quest = persistantWritable<Quest[]>('mine_quest', mine_quests);

export const act_mine_quest = persistantWritable<number>('act_mine_quest', 1);
export const versatile_quest = writable(versatile_quests);
export const collector_quest = writable(collector_quests);