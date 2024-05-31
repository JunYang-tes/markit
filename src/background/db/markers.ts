
import type { MarkedItem } from "../../share/types"
import { markTrash, markers } from "."

export async function getList(): Promise<MarkedItem[]> {
  return markers.toArray()
}
export async function getListOrderByViewCount() {
  return markers
    .orderBy('viewCount')
    .toArray()

}
export async function add(content: string, url: string, context?: string) {
  if (content == '') {
    return
  }
  if (await markers
    .where('content')
    .equals(content)
    .count() === 0) {
    const id = await markers.add({
      content,
      context: context ?? '',
      comment: '',
      url: url ?? '',
      viewCount: 1,
      date: Date.now()
    })
    return (await markers.get(id))!
  }
}
export async function getByContent(content: string) {
  return markers.where('content')
    .equals(content)
    .first()
}
export async function updateViewCount(content: string) {
  const item = await getByContent(content)
  if (item) {
    item.viewCount++;
    markers.put(item)
  }
}
export async function unmark(content: string) {
  let item = await getByContent(content);
  if (item) {
    await markTrash.put(item)
    await markers.delete(content)
  }
}
export async function isMarked(content: string) {
  return (await markers.where(content)
    .equals(content)
    .count()) == 1
}
