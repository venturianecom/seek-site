import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const releases = defineCollection({
  loader: glob({ base: "./src/content/releases", pattern: "**/*.md" }),
  schema: z.object({
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    version: z
      .string()
      .trim()
      .regex(/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1).max(160),
    pubDate: z.coerce.date(),
    minimumMacOS: z.string().trim().min(1),
    downloadUrl: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { releases };
