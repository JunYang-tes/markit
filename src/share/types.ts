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
  date: number
  url: string
}
export type Syllable = {
  word: string,
  syllables: string[]
}

export type Explaintion = {
  pos: string
  trans: string
}
export type DictItem = {
  phrase: string,
  pronounceUA: string,
  pronounceUK: string,
  explaintions: Explaintion[],
  examples: string[]
}

export type QueryResult = DictItem &
{
  syllables: Array<{ word: string, syllables: string[] }>
}
