import { z } from 'zod';
export const merchantReviewReplySchema=z.object({reply:z.string().trim().min(1,'Reply is required.').max(1000,'Reply must not exceed 1000 characters.')}).strict();
