import { syllables } from '../db'
import browser from 'webextension-polyfill'

export async function installSyllable() {
  const resp = await fetch(browser.runtime.getURL("syllable.dict"))
  const data = new Uint8Array(await resp.arrayBuffer())
  console.log("dict byte length:", data.length)
  let index = 0;
  let counter = 0;
  const items = []
  while (index < data.length) {
    const result = readEntity(data, index)
    index = result.index;
    items.push({
      word: result.word,
      syllables: result.syllables
    })
    counter++;
  }
  syllables.bulkAdd(items)

}
function readEntity(data: Uint8Array, start: number) {
  const words = [];
  const splitPoint = [];
  let idx = start;
  for (; idx < data.length; idx++) {
    if (data[idx] !== 0) {
      words.push(data[idx])
    } else {
      idx++;
      break
    }
  }
  for (; idx < data.length; idx++) {
    if (data[idx] !== 0) {
      splitPoint.push(data[idx])
    } else {
      idx++;
      break
    }
  }
  const word = new TextDecoder().decode(new Uint8Array(words))
  return {
    index: idx,
    word,
    syllables: split(word, splitPoint)
  }
}

function split(word: string, index: number[]) {
  let parts = [];
  let start = 0;
  for (const idx of index) {
    const w = word.slice(start, idx);
    parts.push(w);
    start = idx;
  }
  if (start < word.length) {
    parts.push(word.slice(start))
  }
  return parts;
}

