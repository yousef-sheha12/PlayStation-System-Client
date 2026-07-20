'use client';

import { motion } from 'framer-motion';
import { Printer, ArrowLeft, Calendar, Gamepad2, User, Hash } from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils';
import Button from '@/components/ui/button';

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
}

export default function InvoiceDetail({ invoice, onBack }: InvoiceDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button variant="ghost" icon={<ArrowLeft size={16} />} onClick={onBack}>
          Back to Invoices
        </Button>
        <Button variant="primary" icon={<Printer size={16} />} onClick={handlePrint}>
          Print Invoice
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-none"
      >
        <div className="bg-gradient-to-r from-blue-500 to-sky-400 p-8 text-white">
          <h1 className="text-2xl font-bold mb-2">PlayStation Management System</h1>
          <p className="text-blue-100 text-sm">Invoice</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Hash size={16} className="text-blue-500" />
                <span className="text-gray-500">Invoice:</span>
                <span className="font-semibold text-gray-800">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-gray-500">Date:</span>
                <span className="font-semibold text-gray-800">{formatDateTime(invoice.createdAt)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Gamepad2 size={16} className="text-blue-500" />
                <span className="text-gray-500">Device:</span>
                <span className="font-semibold text-gray-800">{invoice.deviceName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-blue-500" />
                <span className="text-gray-500">Customer:</span>
                <span className="font-semibold text-gray-800">{invoice.customerName || 'Walk-in'}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">Session Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Device</p>
                <p className="font-bold text-gray-800">{invoice.deviceName}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-bold text-gray-800">{invoice.paymentMethod}</p>
              </div>
            </div>
          </div>

          {invoice.items && invoice.items.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">Products</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-gray-600 text-sm">Product</th>
                      <th className="text-gray-600 text-sm">Qty</th>
                      <th className="text-gray-600 text-sm">Unit Price</th>
                      <th className="text-gray-600 text-sm text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="text-sm text-gray-800">{item.productName}</td>
                        <td className="text-sm text-gray-800">{item.quantity}</td>
                        <td className="text-sm text-gray-800">{formatCurrency(item.unitPrice)}</td>
                        <td className="text-sm text-right font-medium text-gray-800">{formatCurrency(item.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sub Total</span>
              <span className="font-medium text-gray-800">{formatCurrency(invoice.subTotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Discount</span>
                <span className="font-medium">-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
              <span className="font-medium text-gray-800">{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-800">Grand Total</span>
              <span className="text-green-600">{formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 text-center text-sm text-gray-500">
          <p>Thank you for your visit!</p>
        </div>
      </motion.div>
    </div>
  );
}
