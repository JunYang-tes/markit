import { Dexie, type EntityTable } from 'dexie'
import type { DictItem, MarkedItem, Syllable } from '../../share/types'

const db = new Dexie("markit") as Dexie & {
  markers: EntityTable<MarkedItem, 'content'>,
  markTrash: EntityTable<MarkedItem, 'content'>,
  dict: EntityTable<DictItem, 'phrase'>
  syllables: EntityTable<Syllable, 'word'>
}

db.version(1)
  .stores({
    markers: "&content,context,comment,viewCount,date,url,unmarked",
    syllables: "&word",
    dict: "&phrase"
  })


export const markers = db.markers
export const dict = db.dict
export const syllables = db.syllables
