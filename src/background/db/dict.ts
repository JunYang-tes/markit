import type { DictItem } from "../../share/types";
import { dict } from '.'

export function get(phrase: string): Promise<DictItem | undefined> {
  return (dict.where('phrase')
    .equals(phrase)
    .first())
}
export async function add(item: DictItem) {
  await dict.add(item)
}
