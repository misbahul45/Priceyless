import { z } from 'zod';

export const uuidParamSchema = z.object({
  id: z.string().uuid(),
});

export type UuidParamDto = z.infer<typeof uuidParamSchema>;
