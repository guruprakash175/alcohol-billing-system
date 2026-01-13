'use client';

import { useState } from 'react';
import BarcodeScanner from '@/app/components/pos/BarcodeScanner';
import ReceiptPreview from '@/app/components/pos/ReceiptPreview';
import { billingService } from '@/app/services/billingService';
import toast from 'react-hot-toast';
import { FiUser, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';

export default function CashierBillingPage() {
  const [customer, setCustomer] = useState(null);
  const [quota, setQuota] = useState(null);
  const [cart, setCart] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error) =>
    error?.response?.data?.message || error?.message || 'Something went wrong';

  const handleCustomerVerify = async (customerId) => {
    if (!customerId) return;

    try {
      const [customerRes, quotaRes] = await Promise.all([
        billingService.verifyCustomer(customerId),
        billingService.checkQuota(customerId),
      ]);

      setCustomer(customerRes?.customer ?? null);
      setQuota(quotaRes?.quota ?? null);

      toast.success('Customer verified');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleProductScan = async (barcode) => {
    if (!barcode) return;

    try {
      const productRes = await billingService.scanBarcode(barcode);
      const product = productRes?.product;

      if (!product) {
        toast.error('Product not found');
        return;
      }

      setCart((prev) => {
        const existing = prev.find((p) => p.id === product.id);

        if (existing) {
          return prev.map((p) =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          );
        }

        return [...prev, { ...product, quantity: 1 }];
      });

      toast.success(`Added: ${product.name}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCheckout = async () => {
    const validation = billingService.validateTransaction(cart, customer, quota);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setLoading(true);
    try {
      const transactionData = billingService.formatTransactionData(
        customer,
        cart,
        'cash'
      );

      const result = await billingService.createTransaction(transactionData);

      const receiptData = billingService.generateReceipt(
        result?.transaction,
        {
          name: 'Alcohol Control POS',
          address: '123 Main Street',
        }
      );

      setReceipt(receiptData);
      setCart([]);
      toast.success('Transaction completed!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const totalVolume = cart.reduce(
    (sum, item) => sum + (item.volume ?? 0) * (item.quantity ?? 1),
    0
  );

  const remainingQuota =
    quota && typeof quota.limit === 'number'
      ? quota.limit - (quota.used ?? 0)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">POS Billing</h1>

      {receipt ? (
        <ReceiptPreview receipt={receipt} onPrint={() => setReceipt(null)} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <BarcodeScanner onScan={handleProductScan} />

            {/* Cart */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiShoppingCart />
                Cart ({cart.length} items)
              </h3>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Scan products to add to cart
                </p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {(item.volume ?? 0)}L × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{((item.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiUser />
                Customer
              </h3>

              {!customer ? (
                <input
                  type="text"
                  placeholder="Enter Customer ID"
                  className="input-field"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomerVerify(e.target.value.trim());
                    }
                  }}
                />
              ) : (
                <div className="space-y-2">
                  <p>
                    <span className="text-gray-600">Name:</span>{' '}
                    <span className="font-medium">
                      {customer.name || customer.phoneNumber}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Quota Used:</span>{' '}
                    <span className="font-medium">
                      {quota?.used ?? 0}L / {quota?.limit ?? 1}L
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Remaining:</span>{' '}
                    <span className="font-medium text-green-600">
                      {remainingQuota}L
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span className="font-semibold">
                    {totalVolume.toFixed(2)}L
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{(totalAmount * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!customer || cart.length === 0 || loading}
                className="w-full mt-4 btn-primary py-3 disabled:opacity-50"
              >
                <FiCheckCircle className="inline mr-2" />
                {loading ? 'Processing...' : 'Complete Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
