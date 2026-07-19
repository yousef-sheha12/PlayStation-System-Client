"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Users, Mail, Phone } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Search from "@/components/ui/search";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import Pagination from "@/components/ui/pagination";
import Loader from "@/components/ui/loader";
import CustomerForm from "./customer-form";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/use-customers";
import { Customer } from "@/types";
import { useTranslation } from "@/hooks/use-translation";

export default function CustomersContent() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useCustomers({
    pageNumber: page,
    pageSize: 10,
    searchTerm: search,
  });
  const { mutate: createCustomer, isPending: creating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: updating } = useUpdateCustomer();
  const { mutate: deleteCustomer, isPending: deleting } = useDeleteCustomer();

  const handleFormSubmit = (
    formData: import("@/features/customers/types").CustomerFormData,
  ) => {
    if (editingCustomer) {
      updateCustomer(
        { id: editingCustomer.id, data: formData },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingCustomer(null);
          },
        },
      );
    } else {
      createCustomer(formData, { onSuccess: () => setFormOpen(false) });
    }
  };

  const customers = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <PageHeader
        title={t("customers.title")}
        subtitle={t("customers.subtitle")}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => {
              setEditingCustomer(null);
              setFormOpen(true);
            }}
          >
            {t("customers.addCustomer")}
          </Button>
        }
      />
      <Card hover={false} className="mb-6">
        <Search
          placeholder={t("customers.searchCustomers")}
          onSearch={setSearch}
        />
      </Card>
      <Card hover={false} padding={false}>
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader size="lg" text={t("customers.loadingCustomers")} />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">{t("customers.noCustomers")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-gray-600">{t("customers.customer")}</th>
                  <th className="text-gray-600">{t("customers.contact")}</th>
                  <th className="text-gray-600">{t("customers.address")}</th>
                  <th className="text-gray-600">{t("common.since")}</th>
                  <th className="text-gray-600 text-right">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer: Customer, index: number) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/50"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail size={12} /> {customer.email}
                          </div>
                        )}
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone size={12} /> {customer.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-sm text-gray-500 max-w-[200px] truncate">
                      {customer.address || t("common.none")}
                    </td>
                    <td className="text-sm text-gray-500">
                      {customer.sessionCount} Sessions
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Edit3 size={14} />}
                          onClick={() => {
                            setEditingCustomer(customer);
                            setFormOpen(true);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={14} className="text-red-500" />}
                          onClick={() => setDeleteId(customer.id)}
                        />
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>
      <CustomerForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCustomer(null);
        }}
        customer={editingCustomer}
        onSubmit={handleFormSubmit}
        isLoading={creating || updating}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId)
            deleteCustomer(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        title={t("customers.deleteTitle")}
        message={t("customers.deleteMessage")}
        confirmText={t("common.delete")}
        loading={deleting}
      />
    </div>
  );
}
