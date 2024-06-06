
import type { MarkedItem } from "../../share/types"
import { markers } from "."

const Yes = 1
const No = 0

export async function getList(): Promise<MarkedItem[]> {
  return markers
    .where('unmarked')
    .equals(No)
    .toArray()
}
export async function getListOrderByViewCount() {
  return markers
    .orderBy('viewCount')
    .filter(item => item.unmarked === No)
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
      unmarked: No,
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
    markers.put({
      ...item,
      unmarked: Yes
    })
  }
}
export async function isMarked(content: string) {
  return (await markers.where('content')
    .equals(content)
    .count()) == 1
}
export async function deleteMark(content: string) {
  await Promise.all([
    markers
      .delete(content),
  ])
}
