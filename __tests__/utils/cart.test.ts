import { getCart, addToCart, removeFromCart, clearCart } from '@/utils/cart';
import { Game } from '@/utils/endpoint';

const mockGame1: Game = {
  id: '1',
  genre: 'Action',
  image: '/test1.jpg',
  name: 'Game 1',
  description: 'Description 1',
  price: 59.99,
  isNew: true,
};

const mockGame2: Game = {
  id: '2',
  genre: 'RPG',
  image: '/test2.jpg',
  name: 'Game 2',
  description: 'Description 2',
  price: 39.99,
  isNew: false,
};

describe('cart utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getCart', () => {
    it('returns empty array when cart is empty', () => {
      const cart = getCart();
      expect(cart).toEqual([]);
    });

    it('returns cart items from localStorage', () => {
      localStorage.setItem('cart', JSON.stringify([mockGame1]));
      const cart = getCart();
      expect(cart).toEqual([mockGame1]);
    });

    it('returns empty array when localStorage is invalid JSON', () => {
      localStorage.setItem('cart', 'invalid json');
      const cart = getCart();
      expect(cart).toEqual([]);
    });
  });

  describe('addToCart', () => {
    it('adds item to empty cart', () => {
      const result = addToCart(mockGame1);
      expect(result).toEqual([mockGame1]);
      
      const cart = getCart();
      expect(cart).toEqual([mockGame1]);
    });

    it('adds item to existing cart', () => {
      localStorage.setItem('cart', JSON.stringify([mockGame1]));
      
      const result = addToCart(mockGame2);
      expect(result).toEqual([mockGame1, mockGame2]);
      
      const cart = getCart();
      expect(cart).toHaveLength(2);
      expect(cart).toContainEqual(mockGame1);
      expect(cart).toContainEqual(mockGame2);
    });

    it('does not add duplicate items', () => {
      localStorage.setItem('cart', JSON.stringify([mockGame1]));
      
      const result = addToCart(mockGame1);
      expect(result).toEqual([mockGame1]);
      
      const cart = getCart();
      expect(cart).toHaveLength(1);
      expect(cart).toEqual([mockGame1]);
    });

    it('saves cart to localStorage', () => {
      addToCart(mockGame1);
      
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(savedCart).toEqual([mockGame1]);
    });
  });

  describe('removeFromCart', () => {
    it('removes item from cart', () => {
      localStorage.setItem('cart', JSON.stringify([mockGame1, mockGame2]));
      
      const result = removeFromCart(mockGame1.id);
      expect(result).toEqual([mockGame2]);
      
      const cart = getCart();
      expect(cart).toEqual([mockGame2]);
    });

    it('does nothing when item is not in cart', () => {
      localStorage.setItem('cart', JSON.stringify([mockGame1]));
      
      const result = removeFromCart(mockGame2.id);
      expect(result).toEqual([mockGame1]);
      
      const cart = getCart();
      expect(cart).toEqual([mockGame1]);
    });

    it('handles empty cart', () => {
      const result = removeFromCart(mockGame1.id);
      expect(result).toEqual([]);
    });

    it('saves updated cart to localStorage', () => {
      localStorage.setItem('cart', JSON.stringify([mockGame1, mockGame2]));
      
      removeFromCart(mockGame1.id);
      
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      expect(savedCart).toEqual([mockGame2]);
    });
  });
});

