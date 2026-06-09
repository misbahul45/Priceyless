import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import type { CreateProductRequest, UpdateProductRequest } from '../types';
import type { Category } from '../../categories/types';

interface ProductFormProps {
  initialValues?: Partial<CreateProductRequest>;
  categories: Category[];
  isSubmitting?: boolean;
  onSubmit: (values: CreateProductRequest | UpdateProductRequest) => void;
  onCancel?: () => void;
}

export function ProductForm({ initialValues, categories, isSubmitting, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [price, setPrice] = useState<number | ''>(initialValues?.price ?? '');
  const [stock, setStock] = useState<number | ''>(initialValues?.stock ?? '');
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price === '' || stock === '') return;
    
    onSubmit({ 
      name, 
      description, 
      price: Number(price), 
      stock: Number(stock), 
      categoryId 
    });
  };

  const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1">Name *</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          placeholder="e.g., iPhone 15"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1">Category *</label>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          options={categoryOptions}
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1">Price *</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            required
            placeholder="0.00"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#222222] mb-1">Stock *</label>
          <Input
            type="number"
            step="1"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value))}
            required
            placeholder="0"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description..."
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t border-[#dddddd]">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || name.length < 2 || price === '' || stock === '' || !categoryId}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
