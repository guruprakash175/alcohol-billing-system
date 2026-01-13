'use client';

import { FiPlus } from 'react-icons/fi';

export default function ProductCard({ product, onAddToCart, showStock = true }) {
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="card-hover group">
      {/* Product Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🍺
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">OUT OF STOCK</span>
          </div>
        )}
        {lowStock && inStock && (
          <div className="absolute top-2 right-2">
            <span className="badge-warning">Low Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{product.volume}L</span>
          <span>{product.alcoholContent}% ABV</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="capitalize">{product.category}</span>
          {showStock && <span>Stock: {product.stock}</span>}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <FiPlus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}