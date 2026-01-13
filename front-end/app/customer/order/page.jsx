'use client';

import { useState, useEffect } from 'react';
import ProductList from '@/app/components/product/ProductList';
import QuotaStatus from '@/app/components/QuotaStatus';
import { useCart } from '@/app/hooks/useCart';
import { productService } from '@/app/services/productService';
import { userAPI } from '@/app/services/api';
import toast from 'react-hot-toast';

export default function CustomerOrderPage() {
  const [products, setProducts] = useState([]);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, quotaRes] = await Promise.all([
        productService.getAllProducts({ inStock: true }),
        userAPI.getQuota(),
      ]);

      // ✅ Safe product handling
      setProducts(productsRes?.products ?? []);

      // ✅ Safe quota handling (supports multiple API formats)
      setQuota(quotaRes?.data?.quota ?? quotaRes?.quota ?? null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;

    const productVolume = product.volume ?? 0;

    if (
      quota &&
      typeof quota.used === 'number' &&
      typeof quota.limit === 'number' &&
      quota.used + productVolume > quota.limit
    ) {
      toast.error('Adding this item would exceed your daily quota!');
      return;
    }

    addToCart(product);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Browse Products
        </h1>
        <p className="text-gray-600">
          Select alcohol products within your daily limit
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            showStock={false}
          />
        </div>

        <div className="lg:col-span-1">
          {quota && <QuotaStatus quota={quota} className="mb-6" />}
        </div>
      </div>
    </div>
  );
}
