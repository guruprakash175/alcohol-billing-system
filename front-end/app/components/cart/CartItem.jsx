'use client';

import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
        🍺
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
          <span>{item.volume}L</span>
          <span>{item.alcoholContent}% ABV</span>
          <span className="font-medium text-gray-900">₹{item.price}</span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={item.quantity <= 1}
        >
          <FiMinus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[100px]">
        <p className="text-lg font-bold text-gray-900">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">{(item.volume * item.quantity).toFixed(2)}L total</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item._id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <FiTrash2 className="w-5 h-5" />
      </button>
    </div>
  );
}