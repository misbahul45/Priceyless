import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types';

interface CategoryFormProps {
  initialValues?: Partial<CreateCategoryRequest>;
  isSubmitting?: boolean;
  onSubmit: (values: CreateCategoryRequest | UpdateCategoryRequest) => void;
  onCancel?: () => void;
}

export function CategoryForm({ initialValues, isSubmitting, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

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
          placeholder="e.g., Electronics"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Category description..."
          disabled={isSubmitting}
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t border-[#dddddd]">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || name.length < 2}>
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  );
}
