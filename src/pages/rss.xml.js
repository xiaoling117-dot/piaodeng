// RSS（/piaodeng/rss.xml）：天燈報の記事を新しい順に配信する
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { compareNewestFirst } from '../lib/recent';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(compareNewestFirst);
  return rss({
    title: '飄燈閣 天燈報',
    description: '飄燈閣 — 日本語で読む中国語の読み物マガジン',
    site: new URL('/piaodeng/', context.site).href,
    items: posts.map(post => ({
      title: post.data.title,
      // 記事の date は「書いた日」（公開日とずれることがある）
      pubDate: new Date(post.data.date),
      description: post.data.description,
      link: `/piaodeng/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: '<language>ja</language>',
  });
}
