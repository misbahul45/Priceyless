import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '../../lib/route-guard';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../../features/products/hooks';
import { useCategoriesQuery } from '../../features/categories/hooks';
import { ProductForm } from '../../features/products/components/ProductForm';
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
import type { Product } from '../../features/products/types';

export const Route = createFileRoute('/dashboard/products')({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <RequireAuth>
      <DashboardLayout>
        <ProductsContent />
      </DashboardLayout>
    </RequireAuth>
  );
}

function ProductsContent() {
  const { data: products, isLoading: isProductsLoading, isError: isProductsError, error: productsError, refetch: refetchProducts } = useProductsQuery();
  const { data: categories, isLoading: isCategoriesLoading } = useCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();
  
  const { toast } = useToast();
  const user = getStoredUser();
  const isAdmin = user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  if (isProductsLoading || isCategoriesLoading) return <LoadingState />;
  if (isProductsError) return <ErrorState message={productsError.message} onRetry={refetchProducts} />;

  const safeCategories = categories || [];
  
  const filteredProducts = (products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? p.categoryId === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast('Product created successfully', 'success');
        setIsFormOpen(false);
      },
      onError: (err: any) => toast(err.message, 'error'),
    });
  };

  const handleUpdate = (values: any) => {
    if (!editingProduct) return;
    updateMutation.mutate({ id: editingProduct.id, payload: values }, {
      onSuccess: () => {
        toast('Product updated successfully', 'success');
        setEditingProduct(null);
      },
      onError: (err: any) => toast(err.message, 'error'),
    });
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    deleteMutation.mutate(deletingProduct.id, {
      onSuccess: () => {
        toast('Product deleted successfully', 'success');
        setDeletingProduct(null);
      },
      onError: (err: any) => toast(err.message, 'error'),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#222222]">Products</h1>
        {isAdmin && (
          <Button onClick={() => {
            if (safeCategories.length === 0) {
              toast('You need to create a category first', 'error');
            } else {
              setIsFormOpen(true);
            }
          }}>
            Add Product
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#dddddd] overflow-hidden">
        <div className="p-4 border-b border-[#dddddd] flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:max-w-xs h-10 px-3 rounded-lg border border-[#dddddd] text-sm focus:outline-none focus:border-[#222222]"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-48 h-10 px-3 rounded-lg border border-[#dddddd] text-sm bg-white focus:outline-none focus:border-[#222222]"
          >
            <option value="">All Categories</option>
            {safeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="p-6">
            <EmptyState 
              title="No products found" 
              message={search || filterCategory ? "No results match your filters." : "Create a product to get started."} 
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                {isAdmin && <TableHead className="w-24 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-[#6a6a6a]">{product.category?.name || '-'}</TableCell>
                  <TableCell>${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <span className={product.stock <= 5 ? 'text-[#c13515] font-medium' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 text-[#6a6a6a] hover:text-[#222222] hover:bg-[#f7f7f7] rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(product)}
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
        title="Add Product"
      >
        <ProductForm 
          categories={safeCategories}
          onSubmit={handleCreate} 
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
      >
        {editingProduct && (
          <ProductForm 
            initialValues={editingProduct}
            categories={safeCategories}
            onSubmit={handleUpdate} 
            onCancel={() => setEditingProduct(null)}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
