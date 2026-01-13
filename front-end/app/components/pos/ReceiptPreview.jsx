'use client';

import { FiPrinter, FiDownload } from 'react-icons/fi';

export default function ReceiptPreview({ receipt, onPrint }) {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
    if (onPrint) onPrint();
  };

  return (
    <div>
      {/* Print Controls - Hidden in print */}
      <div className="no-print flex gap-3 mb-4">
        <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
          <FiPrinter className="w-4 h-4" />
          Print Receipt
        </button>
        <button className="btn-outline flex items-center gap-2">
          <FiDownload className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Receipt */}
      <div className="receipt bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pb-6 border-b-2 border-dashed">
          <h1 className="text-2xl font-bold text-gray-900">{receipt.shopName}</h1>
          <p className="text-sm text-gray-600 mt-1">{receipt.shopAddress}</p>
          <p className="text-xs text-gray-500 mt-3">
            Receipt: {receipt.receiptNumber}
          </p>
          <p className="text-xs text-gray-500">
            {receipt.date}
          </p>
        </div>

        {/* Customer Info */}
        <div className="mb-6 pb-4 border-b">
          <p className="text-sm text-gray-600">
            Customer: <span className="font-semibold text-gray-900">{receipt.customerName}</span>
          </p>
        </div>

        {/* Items */}
        <div className="mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.volume}L, {item.alcoholContent}%</p>
                    </div>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-6 pb-6 border-b-2 border-dashed">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">₹{receipt.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (5%):</span>
            <span className="font-medium">₹{receipt.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total:</span>
            <span>₹{receipt.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Alcohol Info */}
        <div className="mb-6 p-3 bg-amber-50 rounded-lg">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            Total Alcohol Volume: {receipt.totalVolume.toFixed(2)}L
          </p>
          <p className="text-xs text-amber-700">
            Daily limit: 1L per person
          </p>
        </div>

        {/* Payment Method */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600">
            Payment Method: <span className="font-semibold uppercase">{receipt.paymentMethod}</span>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Thank you for your purchase!</p>
          <p>Please drink responsibly.</p>
          <p className="mt-4">This is a computer-generated receipt.</p>
        </div>
      </div>
    </div>
  );
}