export type IsPromise<T> = T extends Promise<any> ? true : false
export type WrapInPromise<T>
  = IsPromise<T> extends true
  ? T
  : Promise<T>

export type MarkedItem = {
  content: string
  context: string
  comment: string
  viewCount: number
  unmarked: number
  date: number
  url: string
}
export type Syllable = {
  word: string,
  syllables: string[]
}

// export type Explaintion = {
//   pos: string
//   trans: string
// }
export type Pronounce = {
  type: string // UA/UK
  ipa: string
  url?: string
}
export type Explanation = {
  source: string // 来源
  items: Array<{
    pos: string,
    trans: string,
    examples: Array<[eng: string, zh: string]>
  }>
}
export type DictItem = {
  phrase: string,
  pronounce: Pronounce[]
  explanations: Explanation[],
}


export type QueryResult = DictItem &
{
  syllables: Array<{ word: string, syllables: string[] }>
}
