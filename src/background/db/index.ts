import { Dexie, type EntityTable } from 'dexie'
import type { DbJournal, DictItem, MarkedItem, Syllable, SyncInfo } from '../../share/types'

const db = new Dexie("markit") as Dexie & {
  markers: EntityTable<MarkedItem, 'content'>,
  markTrash: EntityTable<MarkedItem, 'content'>,
  dict: EntityTable<DictItem, 'phrase'>
  syllables: EntityTable<Syllable, 'word'>
  syncInfo: EntityTable<SyncInfo, 'deviceId'>
  journal: EntityTable<DbJournal & { id: number }, 'id'>
}

db.version(1)
  .stores({
    markers: "&content,context,comment,viewCount,date,url,unmarked",
    syllables: "&word",
    dict: "&phrase",
    syncInfo: "&deviceId",
    journal: '++id'
  })


export const markers = db.markers
export const dict = db.dict
export const syllables = db.syllables
export const syncInfo = db.syncInfo
export const journal = db.journal
