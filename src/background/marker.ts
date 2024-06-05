import { markerBuilder } from '../share/services/marker'
import type { DictItem, QueryResult } from '../share/types'
import { getByContent, isMarked, getList, add, unmark, updateViewCount, deleteMark } from './db/markers'
import * as dictDb from './db/dict'
import * as db from './db'
import { query as youdao } from './dict/youdao'
import { getByPhrase } from './db/syllables'
import { downloadDb } from './download-db'
import { importDb } from './db/utils'


async function query(phrase: string, ignoreCache?: boolean): Promise<QueryResult | undefined> {
  if (!ignoreCache) {
    const item = await dictDb.get(phrase);
    if (item) {
      updateViewCount(phrase)
      return {
        ...item,
        syllables: await getByPhrase(phrase)
      }
    }
  }
  const item = await youdao(phrase)
  if (item.type === 'ok') {
    dictDb.add(item.data)
    updateViewCount(phrase)
    return {
      ...item.data,
      syllables: await getByPhrase(phrase)
    }
  }
}

function resetDb() {
  db.markers.clear()
  db.markTrash.clear()
  db.dict.clear()
}

export function init() {
  markerBuilder.provider({
    getByContent,
    isMarked,
    getList,
    add,
    unmark,
    query,
    updateViewCount,
    downloadDb,
    importDb,
    resetDb,
    deleteMark
  })
}

