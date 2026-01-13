'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from '@/app/components/cart/CartItem';
import CartSummary from '@/app/components/cart/CartSummary';
import { useCart } from '@/app/hooks/useCart';
import { userAPI } from '@/app/services/api';
import { orderService } from '@/app/services/orderService';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';

export default function CustomerCartPage() {
  const router = useRouter();
  const { cartItems, totalAmount, totalVolume, updateQuantity, removeFromCart, clearCart } = useCart();
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuota();
  }, []);

  const fetchQuota = async () => {
    try {
      const response = await userAPI.getQuota();
      setQuota(response.data.quota);
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const orderData = orderService.formatOrderData(cartItems);
      await orderService.createOrder(orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      router.push('/customer/history');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <FiShoppingCart className="mx-auto w-24 h-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={() => router.push('/customer/order')}
            className="btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-600">{cartItems.length} items in your cart</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary
            totalAmount={totalAmount}
            totalVolume={totalVolume}
            remainingQuota={quota?.remaining}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}