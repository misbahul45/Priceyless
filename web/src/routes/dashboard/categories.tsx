import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '../../lib/route-guard';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../features/categories/hooks';
import { CategoryForm } from '../../features/categories/components/CategoryForm';
import { getStoredUser } from '../../lib/auth-storage';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Edit2, Trash2 } from 'lucide-react';
import type { Category } from '../../features/categories/types';

export const Route = createFileRoute('/dashboard/categories')({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <RequireAuth>
      <DashboardLayout>
        <CategoriesContent />
      </DashboardLayout>
    </RequireAuth>
  );
}

function CategoriesContent() {
  const { data: categories, isLoading, isError, error, refetch } = useCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();
  const { toast } = useToast();
  const user = getStoredUser();
  const isAdmin = user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  const filteredCategories = categories?.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) || [];

  const handleCreate = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast('Category created successfully', 'success');
        setIsFormOpen(false);
      },
      onError: (err: any) => toast(err.message, 'error'),
    });
  };

  const handleUpdate = (values: any) => {
    if (!editingCategory) return;
    updateMutation.mutate({ id: editingCategory.id, payload: values }, {
      onSuccess: () => {
        toast('Category updated successfully', 'success');
        setEditingCategory(null);
      },
      onError: (err: any) => toast(err.message, 'error'),
    });
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => {
        toast('Category deleted successfully', 'success');
        setDeletingCategory(null);
      },
      onError: (err: any) => toast(err.message, 'error'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#222222]">Categories</h1>
        {isAdmin && (
          <Button onClick={() => setIsFormOpen(true)}>Add Category</Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#dddddd] overflow-hidden">
        <div className="p-4 border-b border-[#dddddd]">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 h-10 px-3 rounded-lg border border-[#dddddd] text-sm focus:outline-none focus:border-[#222222]"
          />
        </div>
        
        {filteredCategories.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              title="No categories found" 
              message={search ? `No results for "${search}"` : "Create a category to get started."} 
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                {isAdmin && <TableHead className="w-24 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-[#6a6a6a] max-w-xs truncate">{category.description || '-'}</TableCell>
                  <TableCell>{category._count?.products || 0}</TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-2 text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f7f7f7] rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          className="p-2 text-[#6a6a6a] hover:text-[#c13515] hover:bg-[#fff8f9] rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Category"
      >
        <CategoryForm 
          onSubmit={handleCreate} 
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
      >
        {editingCategory && (
          <CategoryForm 
            initialValues={editingCategory}
            onSubmit={handleUpdate} 
            onCancel={() => setEditingCategory(null)}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
