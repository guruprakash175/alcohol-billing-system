'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    calculateTotals();
  }, [cartItems]);

  const calculateTotals = () => {
    const amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const volume = cartItems.reduce((sum, item) => sum + (item.volume * item.quantity), 0);
    setTotalAmount(amount);
    setTotalVolume(volume);
  };

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      // Update quantity
      setCartItems(cartItems.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
      toast.success(`Updated ${product.name} quantity`);
    } else {
      // Add new item
      setCartItems([...cartItems, { ...product, quantity }]);
      toast.success(`Added ${product.name} to cart`);
    }
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find(i => i._id === productId);
    setCartItems(cartItems.filter(item => item._id !== productId));
    if (item) {
      toast.success(`Removed ${item.name} from cart`);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item._id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalAmount(0);
    setTotalVolume(0);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    totalAmount,
    totalVolume,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;