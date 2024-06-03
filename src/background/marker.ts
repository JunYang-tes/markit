import { markerBuilder } from '../share/services/marker'
import type { DictItem, QueryResult } from '../share/types'
import { getByContent, isMarked, getList, add, unmark, updateViewCount } from './db/markers'
import * as dictDb from './db/dict'
import { query as youdao } from './dict/youdao'
import { getByPhrase } from './db/syllables'


async function query(phrase: string): Promise<QueryResult | undefined> {
  updateViewCount(phrase)
  {
    const item = await dictDb.get(phrase);
    if (item) {
      return {
        ...item,
        syllables: await getByPhrase(phrase)
      }
    }
  }
  const item = await youdao(phrase)
  if (item.type === 'ok') {
    dictDb.add(item.data)
    return {
      ...item.data,
      syllables: await getByPhrase(phrase)
    }
  }
}

export function init() {
  markerBuilder.provider({
    getByContent,
    isMarked,
    getList,
    add,
    unmark,
    query,
    updateViewCount
  })
}

