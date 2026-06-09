import React from 'react';
import { useProductsQuery } from '../../products/hooks';
import { useCategoriesQuery } from '../../categories/hooks';
import { useMeQuery } from '../../auth/hooks';
import { StatsCard } from './StatsCard';
import { Package, Tags, DollarSign, Archive } from 'lucide-react';
import { LoadingSkeleton } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';
import { EmptyState } from '../../../components/common/EmptyState';
import { Link } from '@tanstack/react-router';
import { Button } from '../../../components/ui/Button';

export function DashboardOverview() {
  const { data: user, isLoading: isUserLoading } = useMeQuery();
  const { data: products, isLoading: isProductsLoading, isError: isProductsError, error: productsError } = useProductsQuery();
  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useCategoriesQuery();

  if (isUserLoading || isProductsLoading || isCategoriesLoading) {
    return <LoadingSkeleton />;
  }

  if (isProductsError || isCategoriesError) {
    return <ErrorState message={productsError?.message || categoriesError?.message || 'Failed to load dashboard data'} />;
  }

  const productsList = products || [];
  const categoriesList = categories || [];

  const totalProducts = productsList.length;
  const totalCategories = categoriesList.length;
  const totalStock = productsList.reduce((acc, curr) => acc + curr.stock, 0);
  const totalInventoryValue = productsList.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);

  if (totalProducts === 0 && totalCategories === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-[#222222]">Welcome back, {user?.name}</h1>
        <EmptyState
          title="Your dashboard is ready"
          message="Add categories and products to see insights."
          action={
            <Link to="/dashboard/categories">
              <Button>Add Category</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#222222]">Welcome back, {user?.name}</h1>
        <div className="flex space-x-4">
          <Link to="/dashboard/categories">
            <Button variant="outline">Add Category</Button>
          </Link>
          <Link to="/dashboard/products">
            <Button>Add Product</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Products" 
          value={totalProducts} 
          icon={<Package size={20} />} 
        />
        <StatsCard 
          title="Total Categories" 
          value={totalCategories} 
          icon={<Tags size={20} />} 
        />
        <StatsCard 
          title="Total Stock" 
          value={totalStock} 
          icon={<Archive size={20} />} 
        />
        <StatsCard 
          title="Inventory Value" 
          value={`$${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<DollarSign size={20} />} 
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#222222] mb-4">Recent Products</h2>
        {productsList.length > 0 ? (
          <div className="bg-white rounded-xl border border-[#dddddd] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[#222222]">
                <thead className="text-xs text-[#6a6a6a] uppercase bg-[#f7f7f7] border-b border-[#dddddd]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.slice(0, 5).map((product) => (
                    <tr key={product.id} className="border-b border-[#dddddd] last:border-0 hover:bg-[#f7f7f7]/50">
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4">${product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-[#6a6a6a]">No products added yet.</p>
        )}
      </div>
    </div>
  );
}
