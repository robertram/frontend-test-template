'use client';
import { Game } from "@/utils/endpoint";
import Image from "next/image";
import { useState } from "react";

export default function Card({ game, handleAddToCart }: { game: Game, handleAddToCart: (game: Game) => void }) {
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleClick = () => {
    handleAddToCart(game);
    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col w-[380px]">
      <div className="relative w-full aspect-[3/4] h-[240px] rounded-t-lg overflow-hidden">
        {game.isNew && <div className="absolute top-6 left-6 bg-white text-black px-4 py-2 rounded-md text-sm z-10">New</div>}
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover p-4"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            {game.genre}
          </p>
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-base font-bold text-gray-800 flex-1 pr-2">
            {game.name}
          </h3>
          <p className="text-base font-bold text-gray-800 whitespace-nowrap">
            ${game.price.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 relative">
        {showAddedMessage && (
          <div className="mb-2 text-center text-green-600 font-semibold text-sm">
            Added to cart
          </div>
        )}
        <button onClick={handleClick} className="cursor-pointer w-full py-3 px-4 bg-white border border-gray-600 rounded-md font-bold text-sm text-gray-800 uppercase tracking-wide hover:bg-gray-50 transition-colors">
          ADD TO CART
        </button>
      </div>
    </div>
  );
}