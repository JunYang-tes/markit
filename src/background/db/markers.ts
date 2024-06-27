
import type { MarkedItem } from "../../share/types"
import { journal, markers } from "."

const Yes = 1
const No = 0

export async function getList(): Promise<MarkedItem[]> {
  return markers
    .where('unmarked')
    .equals(No)
    .toArray()
}

export async function getAll(orderBy: 'date' | 'viewCount'): Promise<MarkedItem[]> {
  return markers
    .orderBy(orderBy)
    .reverse()
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
    const item = {
      content,
      context: context ?? '',
      comment: '',
      url: url ?? '',
      unmarked: No,
      viewCount: 1,
      date: Date.now()
    }
    const id = await markers.add(item)
    journal.add({
      storeName: 'markers',
      date: Date.now(),
      operation: {
        kind: 'add',
        data: item
      }
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
    await markers.put(item)
    journal.add({
      storeName: 'markers',
      date: Date.now(),
      operation: {
        kind: 'update',
        key: content,
        data: { content, viewCount: item.viewCount }
      }
    }).catch(e => {
      console.error("Failed to add journal", e)
    })
  }
}
export async function unmark(content: string) {
  let item = await getByContent(content);
  if (item) {
    await markers.put({
      ...item,
      unmarked: Yes
    })
    journal.add({
      storeName: 'markers',
      date: Date.now(),
      operation: {
        kind: 'update',
        key: content,
        data: { unmarked: Yes }
      }
    })
  }
}
export async function isMarked(content: string) {
  return (await markers.where('content')
    .equals(content)
    .count()) == 1
}
export async function deleteMark(content: string) {
  await markers.delete(content)
  journal.add({
    storeName: 'markers',
    date: Date.now(),
    operation: { kind: 'delete', key: content }
  })
}
