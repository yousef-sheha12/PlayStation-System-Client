'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, DollarSign } from 'lucide-react';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Search from '@/components/ui/search';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader';
import ExpenseForm from './expense-form';
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '@/hooks/use-expenses';
import { formatCurrency, formatDate } from '@/utils';
import { Expense } from '@/types';
import type { ExpenseFormData } from '../types';
import { useTranslation } from '@/hooks/use-translation';

export default function ExpensesContent() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useExpenses({ pageNumber: page, pageSize: 10, searchTerm: search });
  const { mutate: createExpense, isPending: creating } = useCreateExpense();
  const { mutate: updateExpense, isPending: updating } = useUpdateExpense();
  const { mutate: deleteExpense, isPending: deleting } = useDeleteExpense();

  const handleFormSubmit = (formData: ExpenseFormData) => {
    if (editingExpense) {
      updateExpense({ id: editingExpense.id, data: formData }, { onSuccess: () => { setFormOpen(false); setEditingExpense(null); } });
    } else {
      createExpense(formData, { onSuccess: () => setFormOpen(false) });
    }
  };

  const expenses = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <PageHeader title={t('expenses.title')} subtitle={t('expenses.subtitle')} actions={<Button icon={<Plus size={16} />} onClick={() => { setEditingExpense(null); setFormOpen(true); }}>{t('expenses.addExpense')}</Button>} />

      <Card hover={false} className="mb-6">
        <Search placeholder={t('expenses.searchExpenses')} onSearch={setSearch} />
      </Card>

      <Card hover={false} padding={false}>
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader size="lg" text={t('expenses.loadingExpenses')} />
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">{t('expenses.noExpenses')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-gray-600">{t('expenses.expenseTitle')}</th>
                  <th className="text-gray-600">{t('products.category')}</th>
                  <th className="text-gray-600">{t('expenses.amount')}</th>
                  <th className="text-gray-600">{t('expenses.date')}</th>
                  <th className="text-gray-600 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense: Expense, index: number) => (
                  <motion.tr
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/50"
                  >
                    <td>
                      <div className="font-semibold text-gray-800">{expense.description}</div>
                      {expense.notes && (
                        <p className="text-xs text-gray-500 mt-0.5">{expense.notes}</p>
                      )}
                    </td>
                    <td><Badge variant="secondary">{expense.category}</Badge></td>
                    <td className="font-bold text-red-500">{formatCurrency(expense.amount)}</td>
                    <td className="text-sm text-gray-500">{formatDate(expense.expenseDate)}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" icon={<Edit3 size={14} />}
                          onClick={() => { setEditingExpense(expense); setFormOpen(true); }} />
                        <Button variant="ghost" size="sm" icon={<Trash2 size={14} className="text-red-500" />}
                          onClick={() => setDeleteId(expense.id)} />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center p-4 border-t border-gray-100">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <ExpenseForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingExpense(null); }}
        expense={editingExpense}
        onSubmit={handleFormSubmit}
        isLoading={creating || updating}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteExpense(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        title={t('expenses.deleteTitle')}
        message={t('expenses.deleteMessage')}
        confirmText={t('common.delete')}
        loading={deleting}
      />
    </div>
  );
}
