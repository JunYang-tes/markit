
import type { MarkedItem } from "../../share/types"
import { journal, markers } from "."
import { eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

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
  return (await markers
    .where('content')
    .equals(content)
    .and(i => i.unmarked == No)
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

export async function getStatistic() {
  const now = Date.now();
  const todayStartTime = startOfDay(new Date()).getTime();

  const [
    total,
    today,
    mostFrequent,
    unmarkedCount,
    markedCount
  ] = await Promise.all([
    markers.count(),
    markers.where('date')
      .between(todayStartTime, now)
      .count(),
    markers.orderBy('viewCount')
      .last(),
    markers.where('unmarked')
      .equals(Yes)
      .count(),
    markers.where('unmarked')
      .equals(No)
      .count()
  ]);


  return {
    total,
    today,
    mostFrequent,
    unmarked: unmarkedCount,
    marked: markedCount,
  };
}


export async function getMarkedCountsByDateRange(startDate: Date, endDate: Date) {
  const markedCounts: Array<{ day: Date; count: number }> = [];
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  for (let i = 0; i < days.length; i++) {
    const dayStartTime = startOfDay(days[i]).getTime();
    const dayEndTime = endOfDay(days[i]).getTime();
    const dayCount = await markers.where('date')
      .between(dayStartTime, dayEndTime)
      .count();
    markedCounts.push({ day: startOfDay(days[i]), count: dayCount });
  }

  return markedCounts;
}

export async function updateMarker(content: string, newData: Partial<MarkedItem>) {
  const item = await getByContent(content);
  if (item) {
    const updatedItem = { ...item, ...newData };
    await markers.put(updatedItem);
    journal.add({
      storeName: 'markers',
      date: Date.now(),
      operation: {
        kind: 'update',
        key: content,
        data: updatedItem
      }
    });
  }
}
