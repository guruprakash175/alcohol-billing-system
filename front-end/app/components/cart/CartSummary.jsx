'use client';

export default function CartSummary({ 
  totalAmount, 
  totalVolume, 
  remainingQuota, 
  onCheckout, 
  loading = false 
}) {
  const exceedsQuota = remainingQuota !== undefined && totalVolume > remainingQuota;
  const tax = totalAmount * 0.05; // 5% tax
  const finalTotal = totalAmount + tax;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (5%)</span>
          <span className="font-semibold">₹{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Total Volume</span>
          <span className="font-semibold">{totalVolume.toFixed(2)}L</span>
        </div>

        {remainingQuota !== undefined && (
          <div className="flex justify-between text-gray-600">
            <span>Remaining Quota</span>
            <span className={`font-semibold ${exceedsQuota ? 'text-red-600' : 'text-green-600'}`}>
              {remainingQuota.toFixed(2)}L
            </span>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {exceedsQuota && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800 font-medium">
            ⚠️ Order exceeds daily quota limit by {(totalVolume - remainingQuota).toFixed(2)}L
          </p>
        </div>
      )}

      <button
        onClick={onCheckout}
        disabled={loading || exceedsQuota || totalAmount === 0}
        className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Daily limit: 1L per person
      </p>
    </div>
  );
}