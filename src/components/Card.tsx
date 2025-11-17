import { Game } from "@/utils/endpoint";
import Image from "next/image";

export default function Card({ game }: { game: Game }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col">
      {/* Game Cover Art */}
      <div className="relative w-full aspect-[3/4] h-[240px] rounded-t-lg overflow-hidden">
        <Image
          src={game.image}
          alt={game.name}
          fill
          className="object-cover p-4"
        />
      </div>

      {/* Product Information */}
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

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <button className="w-full py-3 px-4 bg-white border border-gray-600 rounded-md font-bold text-sm text-gray-800 uppercase tracking-wide hover:bg-gray-50 transition-colors">
          ADD TO CART
        </button>
      </div>
    </div>
  );
}