'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/app/services/orderService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function CustomerHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled': return <FiXCircle className="w-5 h-5 text-red-600" />;
      case 'pending': return <FiClock className="w-5 h-5 text-yellow-600" />;
      default: return <FiPackage className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      completed: 'badge-success',
      cancelled: 'badge-danger',
      pending: 'badge-warning',
    };
    return <span className={classes[status] || 'badge-info'}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">View your past purchases and orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage className="mx-auto w-24 h-24 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{order._id?.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy - hh:mm a')}
                    </p>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="space-y-2 mb-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} ({item.volume}L) x {item.quantity}
                    </span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Total Volume: <span className="font-semibold">{order.totalVolume}L</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{order.totalAmount?.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}