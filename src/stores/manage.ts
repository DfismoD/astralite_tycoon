import { writable } from "svelte/store";

export type Logistic = {
    id: number;
    name: string;
    image: string;
    color: string;
    amelioration: string;
    level: number;
    price: number;
    baseYield: number;
    currentYield: number;
    description: string;
}

export const logistics: Logistic[] = [
    {id:1, name:"Équipement des mineurs", image:"manage/accident.png", color:"#73BEDD", amelioration:"Rendement des mineurs", level:0, price:20, baseYield:2, currentYield:2, description:"Plus vos mineurs sont protégés, plus ils sont efficaces dans leurs sessions !"},
    {id:2, name:"Nourriture sur les sites", image:"manage/food.png", color:"#B573DD", amelioration:"Amélioration du rendement", level:0, price:20, baseYield:2, currentYield:2, description:"Améliorez la qualité de la nourriture sur vos sites de minage pour améliorer le rendement de vos mineurs"},
    {id:3, name:"Livraison des minerais", image:"manage/delivery.png", color:"#BCBE61", amelioration:"Multiplicateur de vente", level:0, price:20, baseYield:2, currentYield:2, description:"Une livraison rapide aux raffineries vous assure un bon retour de la clientèle"},
    {id:4, name:"Horaires des mineurs", image:"manage/time.png", color:"#737EDD", amelioration:"Temps supplémentaire", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Améliorez le salaire de vos mineurs afin qu’ils travaillent pendant votre absence !"},
    {id:5, name:"Motivation des mineurs", image:"manage/motivation.png", color:"#BE7761", amelioration:"Bonus gain d'absence", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Mettez en place des structures pour motiver vos mineurs lors de votre absence"},
    {id:6, name:"Sécurité des sites", image:"manage/security.png", color:"#61BE8C", amelioration:"Gain d'expérience", level:0, price:20, baseYield:1.25, currentYield:1.25, description:"Renforcez la sécurité de vos sites afin d’éviter les pertes et accidents qui dégradent votre image"},
];

export type General = {
    id: number;
    name: string;
    image: string;
    color: string;
    amelioration: string;
    level: number;
    price: number;
    description: string;
}

export const generals: General[] = [
    {id:1, name:"Réduction du délai", image:"manage/hourglass.png", color:"#5664E2", amelioration:"Réduction du délai sur les outils", level:0, price:1, description:"Améliorez l’entretien de vos outils afind de diminuer leur surchauffe pour les utiliser plus souvent"},
    {id:2, name:"Contact fournisseurs", image:"manage/contact.png", color:"#6BBC73", amelioration:"Réduction des prix", level:0, price:1, description:"Renforcez les contacts avec vos fournisseurs afin d’obtenir des réductions sur vos futurs achats de matériel"},
    {id:3, name:"Rafinage des minerais", image:"manage/mineral.png", color:"#B1B422", amelioration:"Multiplicateur de vente", level:0, price:1, description:"Améliorez la qualité de votre système de rafinage afin d’augmenter vos prix de vente"},
    {id:4, name:"Champs de trèfles", image:"manage/clover.png", color:"#DD73A6", amelioration:"Chance supplémentaire", level:0, price:1, description:"Entretenez un champ de trèfles pour que la chance soit avec vous"},
    {id:5, name:"Sacs améliorés", image:"manage/renforced_bag.png", color:"#1DAFEE", amelioration:"Bonus de stockage", level:0, price:1, description:"Vous pouvez investir dans un rouleau d’adhésif pour renforcer vos sacs"},
    {id:6, name:"Outlis améliorés", image:"manage/renforced_tool.png", color:"#ED4F4F", amelioration:"Bonus de récolte", level:0, price:1, description:"Aprovisionnez-vous d’outils de meilleure qualité pour des sessions plus efficaces"},
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

export const logistic = persistantWritable<Logistic[]>('logistic', logistics);
export const general = persistantWritable<General[]>('general', generals);