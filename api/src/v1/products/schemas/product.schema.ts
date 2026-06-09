import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().uuid(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
