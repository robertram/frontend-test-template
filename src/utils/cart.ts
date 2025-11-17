// cartUtils.ts

import { Game } from "./endpoint";

const CART_KEY = "cart";

export const getCart = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveCart = (cart: Game[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (item: Game) => {
  const cart = getCart();

  const exists = cart.some((cartItem: Game) => cartItem.id === item.id);
  if (exists) return cart;

  const updatedCart = [...cart, item];
  saveCart(updatedCart);
  return updatedCart;
};

export const removeFromCart = (id: string) => {
  const cart = getCart();
  const updatedCart = cart.filter((item: Game) => item.id !== id);
  saveCart(updatedCart);
  return updatedCart;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};
