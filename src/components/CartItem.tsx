'use client';
import Image from 'next/image';
import { Game } from '@/utils/endpoint';

interface CartItemProps {
  game: Game;
  onRemove: (gameId: string) => void;
}

export default function CartItem({ game, onRemove }: CartItemProps) {
  return (
    <div 
      className="flex gap-4 items-start bg-white rounded-lg p-4"
    >
      <div className="relative w-24 h-32 flex-shrink-0 rounded-md overflow-hidden">
      {game.isNew && <div className="absolute top-2 left-2 bg-white text-black px-1 py-1 rounded-md text-xs z-10 ">New</div>}
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          {game.genre}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{game.name}</h3>
        {game.description && (
          <p className="text-sm text-gray-600 mb-2">{game.description}</p>
        )}
        <p className="text-lg font-bold text-gray-900 mt-2 text-right">
          ${game.price.toFixed(2)}
        </p>
      </div>

      <button
        onClick={() => onRemove(game.id)}
        className="cursor-pointer flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Remove item"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M15 5L5 15M5 5L15 15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

