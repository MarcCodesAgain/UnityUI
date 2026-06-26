import type { CommandItem } from './CommandPalette';

// ─── Scoring ──────────────────────────────────────────────────────────────────
//
// Higher score = better match. Returns 0 when the item should be excluded.
//
// Priority ladder:
//   100  exact label match
//    80  label starts with query
//    60  label contains query
//    45  keywords contain query
//    30  description contains query
//    15  all query chars appear in order inside label (fuzzy)
//     0  no match

export function scoreItem(item: CommandItem, query: string): number {
  if (!query) return 1;

  const q     = query.toLowerCase();
  const label = item.label.toLowerCase();
  const desc  = (item.description ?? '').toLowerCase();
  const keys  = (item.keywords ?? []).join(' ').toLowerCase();

  if (label === q)          return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q))   return 60;
  if (keys.includes(q))    return 45;
  if (desc.includes(q))    return 30;

  // All chars appear in order (fuzzy)
  let i = 0;
  for (const ch of q) {
    const found = label.indexOf(ch, i);
    if (found === -1) return 0;
    i = found + 1;
  }
  return 15;
}

// ─── Group builder ────────────────────────────────────────────────────────────

export interface SearchGroup {
  group: string | undefined;
  items: CommandItem[];
}

export function filterAndGroup(items: CommandItem[], query: string): SearchGroup[] {
  const scored = items
    .filter((item) => !item.disabled)
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return [];

  // Searching → flatten into a single relevance-ordered group
  if (query) {
    return [{ group: undefined, items: scored.map(({ item }) => item) }];
  }

  // No query → preserve declared group structure
  const groupMap = new Map<string, CommandItem[]>();
  const ungrouped: CommandItem[] = [];

  for (const { item } of scored) {
    if (!item.group) {
      ungrouped.push(item);
    } else {
      const arr = groupMap.get(item.group) ?? [];
      arr.push(item);
      groupMap.set(item.group, arr);
    }
  }

  const result: SearchGroup[] = [];
  if (ungrouped.length) result.push({ group: undefined, items: ungrouped });
  for (const [group, grpItems] of groupMap) {
    result.push({ group, items: grpItems });
  }
  return result;
}
