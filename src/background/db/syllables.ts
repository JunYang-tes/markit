import { syllables } from '.'
import type { Syllable } from '../../share/types'

export async function get(word: string): Promise<Syllable> {
  const r = await syllables.get(word).catch((e) => {
    console.error("Failed to get syllables", e)
    return { word, syllables: [] }
  })

  return r || ({ word, syllables: [] })
}
export async function getByPhrase(phrase: string): Promise<Array<Syllable>> {
  return Promise.all(
    phrase.split(' ')
      .map(word => get(word))
  )
}
