// 新着記事の並べ方（天燈報とトップページで共通）
//
// ・記事の date は「書いた日」なので、同じ日付の記事が多い。
//   同じ日付のときは、ファイル名の番号（slug の先頭）が大きいほうを新しいとみなす。
// ・「原文で読む——〇〇」という記事は、同じ題の本編と一行にまとめる。
import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

const GENBUN_PREFIX = '原文で読む——';

/** 新しい順に並べるための比較関数 */
export function compareNewestFirst(a: Post, b: Post): number {
  const byDate = new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  if (byDate !== 0) return byDate;
  // 001, 007b, 099 … のように番号が先頭にあるので、文字列の大小で番号順になる
  return b.slug.localeCompare(a.slug, 'en', { numeric: true });
}

// 題の小さな表記ゆれ（読点・空白）を無視して比べる
const normalize = (title: string) => title.replace(/[、，,\s　]/g, '');

const isGenbun = (p: Post) => p.data.title.startsWith(GENBUN_PREFIX);

export interface RecentItem {
  /** 一行の代表となる記事（本編があれば本編） */
  main: Post;
  /** 対になる「原文で読む」記事（ないときは undefined） */
  genbun?: Post;
  /** この行の日付として表示する記事（二つのうち新しいほう） */
  newest: Post;
}

/** 本編と原文をまとめたうえで、新しい順に limit 件を返す */
export function getRecentItems(posts: Post[], limit: number): RecentItem[] {
  const sorted = [...posts].sort(compareNewestFirst);

  const mainByTitle = new Map<string, Post>();
  const genbunByTitle = new Map<string, Post>();
  for (const p of sorted) {
    if (isGenbun(p)) {
      const key = normalize(p.data.title.slice(GENBUN_PREFIX.length));
      if (!genbunByTitle.has(key)) genbunByTitle.set(key, p);
    } else {
      const key = normalize(p.data.title);
      if (!mainByTitle.has(key)) mainByTitle.set(key, p);
    }
  }

  const used = new Set<string>();
  const items: RecentItem[] = [];
  for (const p of sorted) {
    if (items.length >= limit) break;
    if (used.has(p.slug)) continue;
    used.add(p.slug);

    if (isGenbun(p)) {
      const main = mainByTitle.get(normalize(p.data.title.slice(GENBUN_PREFIX.length)));
      if (main && !used.has(main.slug)) {
        used.add(main.slug);
        items.push({ main, genbun: p, newest: p });
      } else {
        items.push({ main: p, newest: p });
      }
    } else {
      const genbun = genbunByTitle.get(normalize(p.data.title));
      if (genbun && !used.has(genbun.slug)) {
        used.add(genbun.slug);
        items.push({ main: p, genbun, newest: p });
      } else {
        items.push({ main: p, newest: p });
      }
    }
  }
  return items;
}
