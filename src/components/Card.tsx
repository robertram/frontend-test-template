'use client';
import { Game } from "@/utils/endpoint";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { getCart } from "@/utils/cart";

export default function Card({ game, handleAddToCart, handleRemoveFromCart }: { game: Game, handleAddToCart: (game: Game) => void, handleRemoveFromCart: (gameId: string) => void }) {
  const [isInCart, setIsInCart] = useState(false);

  const checkCartStatus = useCallback(() => {
    const cart = getCart();
    setIsInCart(cart.some((item: Game) => item.id === game.id));
  }, [game.id]);

  useEffect(() => {
    checkCartStatus();
    // Listen for cart updates (same tab)
    window.addEventListener('cartUpdated', checkCartStatus);
    // Listen for storage changes to update cart status across tabs
    window.addEventListener('storage', checkCartStatus);
    
    return () => {
      window.removeEventListener('cartUpdated', checkCartStatus);
      window.removeEventListener('storage', checkCartStatus);
    };
  }, [game.id, checkCartStatus]);

  const handleClick = () => {
    if (isInCart) {
      handleRemoveFromCart(game.id);
    } else {
      handleAddToCart(game);
    }
    checkCartStatus();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col w-full">
      <div className="relative w-full aspect-[3/4] rounded-t-lg overflow-hidden h-[240px]">
        {game.isNew && <div className="absolute top-6 left-6 bg-white text-black px-4 py-2 rounded-md text-base z-10 ">New</div>}
        
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover p-4 h-[200px]"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <p className="text-base font-bold text-[#737373] uppercase tracking-wide">
            {game.genre}
          </p>
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex-1 pr-2">
            {game.name}
          </h3>
          <p className="text-lg font-bold text-gray-800 whitespace-nowrap">
            ${game.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 relative">
        <button onClick={handleClick} className="cursor-pointer w-full py-3 px-4 bg-white border border-gray-600 rounded-md font-bold text-sm text-gray-800 uppercase tracking-wide hover:bg-gray-50 transition-colors">
          {isInCart ? 'REMOVE' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}