import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    authors: z.array(z.string()),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // 訂正履歴（省略できる）。版の数＝1＋（bump が true の件数）
    revisions: z.array(z.object({
      date: z.string(),          // 直した日（YYYY-MM-DD）
      note: z.string(),          // 何を直したか（日本語で一行）
      bump: z.boolean(),         // true＝版を上げる（中国語の直し）／false＝履歴のみ
    })).optional(),
  }),
});

export const collections = { blog };
