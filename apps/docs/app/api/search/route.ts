import { source } from '@/lib/api-source';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(source);
