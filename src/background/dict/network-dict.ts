import type { DictItem } from "../../share/types"

type ParseResult =
  | { type: 'error', message: string }
  | { type: 'ok', data: DictItem }

export type Option = {
  url: (phrase: string) => string
  parser: (text: string) => Promise<Omit<DictItem, 'phrase'>>
}

export function makeQuery(opt: Option) {
  return async (phrase: string) => {
    try {
      const resp = await fetch(opt.url(phrase))
      const text = await resp.text()
      const item = await opt.parser(text)
      return {
        type: 'ok',
        data: { ...item, phrase }
      } as ParseResult
    } catch (e) {
      console.error("Failed to query:")
      console.error(e)
      return {
        type: 'error',
        message: (e as Error).message ?? String(e)
      } as ParseResult
    }
  }
}
