import { writable } from "svelte/store";

export type Tool = {
    id: number;
    name: string;
    image: string;
    price: number;
    multiplier: number;
    capacity_min: number;
    capitcity_max: number;
    cooldown: number;
    description: string;
    zone: number;
};

export const tools: Tool[] = [
    {id:1, name:"Brosse à dents", image:"tools/tool1.png", price:0, multiplier:1, capacity_min:1, capitcity_max:2, cooldown:0.1, description:"Un outil très rudimentaire, vous ne trouverez pas pire.", zone:1},
    {id:2, name:"Pelle à poussière", image:"tools/tool2.png", price:20, multiplier:1, capacity_min:2, capitcity_max:3, cooldown:0.1, description:"Très utile pour balayer la poussière chez soi, un peu moins pour creuser...", zone:1},
    {id:3, name:"Jouets de plage", image:"tools/tool3.png", price:100, multiplier:1, capacity_min:2, capitcity_max:5, cooldown:0.1, description:"Un outil efficace, si l’on imagine pas le petit qui n’a plus de jouets...", zone:1},
    {id:4, name:"Truelle", image:"tools/tool4.png", price:400, multiplier:1.02, capacity_min:4, capitcity_max:6, cooldown:0.1, description:"Ce n’est pas son utilité première, mais ça devrait faire l’affaire !", zone:2},
    {id:5, name:"Pelle", image:"tools/tool5.png", price:950, multiplier:1.2, capacity_min:6, capitcity_max:8, cooldown:0.1, description:"Un outil des plus classiques, avec une prise en main rapide !", zone:2},
    {id:6, name:"Pelle à neige", image:"tools/tool6.png", price:1000, multiplier:1.05, capacity_min:7, capitcity_max:10, cooldown:0.1, description:"Un outil plus atypique, efficace pour attraper plein de minerais à la fois !", zone:2},
    {id:7, name:"Grande pelle", image:"tools/tool7.png", price:4000, multiplier:1.055, capacity_min:9, capitcity_max:13, cooldown:0.1, description:"Un outil des plus classiques, avec une prise en main rapide, en plus grand !", zone:2},
];

export type Bag = {
    id: number;
    name: string;
    image: string;
    price: number;
    multiplier: number;
    capacity: number;
    description: string;
    zone: number;
}

export const bags: Bag[] = [
    {id:1, name:"Poches", image:"bags/bag1.png", price:0, multiplier:1, capacity:20, description:"Avoir les poches vides permet de mieux les remplir...", zone:1},
    {id:2, name:"Sac plastique", image:"bags/bag2.png", price:50, multiplier:1, capacity:50, description:"Habitué aux légumes de saison, esperons que ce sac ne se déchire pas...", zone:1},
    {id:3, name:"Sac alimentaire", image:"bags/bag3.png", price:130, multiplier:1.05, capacity:110, description:"Plus solide que son homologue en plastoc.", zone:1},
    {id:4, name:"Banane de chantier", image:"bags/bag4.png", price:850, multiplier:1.12, capacity:200, description:"Vous pourrez y ranger quelques minerais entre vos clés et portefeuille...", zone:2},
    {id:5, name:"Sac à main", image:"bags/bag5.png", price:3000, multiplier:1.18, capacity:380, description:"Un sac à main, vous ne savez pas ce que c’est ?", zone:2},
    {id:6, name:"Malette", image:"bags/bag6.png", price:5500, multiplier:1.25, capacity:600, description:"Adorée des professeurs de Maths, la mallette permet une grande capacité !", zone:2},
];

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

export const owned_tool = persistantWritable<number[]>('owned_tool', [1]);
export const equipped_tool = persistantWritable<number>('equipped_tool', 1);

export const owned_bag = persistantWritable<number[]>('owned_bag', [1]);
export const equipped_bag = persistantWritable<number>('equipped_bag', 1);

export const zone = writable<number>(1);

export const shopTools = writable<Tool[]>(tools);
export const shopBags = writable<Bag[]>(bags);