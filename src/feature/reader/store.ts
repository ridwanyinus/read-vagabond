import { atom } from "nanostores";

export const currentPage = atom(0);
export const percentageRead = atom(0);
export const navbarVisibility = atom<"visible" | "hidden">("visible");
export const isProgrammaticScroll = atom(false);
