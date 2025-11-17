'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/utils/endpoint';
import Button from './Button';
import { removeFromCart, getCart } from '@/utils/cart';

  export default function YourCart() {
  const [cartItems, setCartItems] = useState<Game[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  const handleRemoveFromCart = (gameId: string) => {
    console.log('Removing from cart:', gameId);
    removeFromCart(gameId);
    setCartItems(getCart());
  };

  const itemCount = cartItems.length;
  const orderTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
    <div className="w-full max-w-7xl mx-auto">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12.5 15L7.5 10L12.5 5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <span>Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600 mb-6">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Your cart is empty</p>
              <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((game) => (
                <div 
                  key={game.id} 
                  className="flex gap-4 items-start bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="relative w-24 h-32 flex-shrink-0 rounded-md overflow-hidden">
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
                    {game.isNew && (
                      <span className="inline-block bg-black text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        New
                      </span>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${game.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(game.id)}
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
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Order Summary</h2>
            <p className="text-gray-600 mb-4">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>

            <div className="space-y-3 mb-4">
              {cartItems.map((game) => (
                <div key={game.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate pr-2">{game.name}</span>
                  <span className="text-gray-900 font-medium whitespace-nowrap">
                    ${game.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-300 my-4"></div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">Order Total</span>
              <span className="text-lg font-bold text-gray-900">
                ${orderTotal.toFixed(2)}
              </span>
            </div>

            <Button 
              onClick={() => {
                console.log('Checkout clicked');
              }}
              disabled={cartItems.length === 0}
              className="w-full"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
      </div>
    );
  }
