import type { WebdavAccount } from '../setting'
import type { DictItem, MarkedItem, QueryResult } from '../types'
import { build } from './builder'

export const markerBuilder = build<{
  getList: () => Promise<MarkedItem[]>,
  add: (content: string, url: string, context?: string) => Promise<MarkedItem | undefined>,
  unmark: (content: string) => Promise<void>,
  deleteMark: (content: string) => Promise<void>,
  isMarked: (content: string) => Promise<boolean>
  getByContent: (content: string) => Promise<MarkedItem | undefined>,
  query: (phrase: string, ignoreCache?: boolean) => Promise<QueryResult | undefined>,
  updateViewCount: (content: string) => Promise<void>,
  downloadDb: () => Promise<void>,
  exportToWebdav: (account:WebdavAccount)=>Promise<void>,
  importDb: (data: {
    dict: DictItem[],
    markers: MarkedItem[],
    markTrash: MarkedItem[]
  }) => Promise<void>
  resetDb: () => void
}>('marker', [
  'getList', 'add', 'unmark', 'isMarked', 'getByContent', 'query', 'updateViewCount',
  'downloadDb',
  'importDb',
  'resetDb',
  'exportToWebdav',
  'deleteMark'
])
