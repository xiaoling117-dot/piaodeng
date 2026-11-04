import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://xiaoling117-dot.github.io',
  base: '/piaodeng',
  // サイトマップ（/piaodeng/sitemap-index.xml）を自動で作る
  integrations: [sitemap()],
});
