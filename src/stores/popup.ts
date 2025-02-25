import { writable } from "svelte/store";

export const popupToOpen = writable<string | null>(null);