import * as db from '.'
import type { DictItem, MarkedItem } from '../../share/types'
export async function exportDb() {
  const entities = await Promise.all([
    db.dict.toArray().then(data => ['dict', data]),
    db.markers.toArray().then(data => ['markers', data]),
    db.markTrash.toArray().then(data => ['markTrash', data])
  ])
  const data = Object.fromEntries(entities)
  return data
}
export async function importDb(data: {
  dict: DictItem[],
  markers: MarkedItem[],
  markTrash: MarkedItem[]
}) {
  Promise.all([
    db.dict.bulkPut(data.dict),
    db.markers.bulkPut(data.markers),
    db.markTrash.bulkPut(data.markTrash)
  ])
}
