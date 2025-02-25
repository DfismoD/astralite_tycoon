import { writable, type Writable } from "svelte/store";

// Fonction pour créer un store persistant
function createPersistentStore<T>(key: string, initialValue: T): Writable<T> {
    // Vérifie si `localStorage` est disponible (pour éviter l'erreur SSR)
    const isBrowser = typeof window !== "undefined";

    let storedValue: T = initialValue;

    if (isBrowser) {
        try {
            const json = localStorage.getItem(key);
            if (json) {
                storedValue = JSON.parse(json);
            }
        } catch (e) {
            console.error("Erreur lors du chargement de localStorage", e);
        }
    }

    const store = writable<T>(storedValue);

    if (isBrowser) {
        store.subscribe((value) => {
            if (value !== undefined) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        });
    }

    return store;
}

// Exemple d'utilisation

export const playerProgress = createPersistentStore("playerProgress", {
    money: 1000,
    coin: 0,
    gem: 10,
    level: 0,
    xp: 0,
    xp_max: 25,
    bag_content: 0
});
