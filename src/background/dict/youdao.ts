import { makeQuery } from './network-dict'
import { domParser } from '../dom-parser'
import { zip } from 'lodash-es'

export const query = makeQuery({
  url: phrase => `https://dict.youdao.com/result?word=${phrase}&lang=en`,
  parser: async (text) => {
    await domParser.setHtml(text)
    const pronounceUK = await domParser.queryContent('.phone_con>.per-phone:first-child .phonetic')
    const pronounceUA = await domParser.queryContent('.phone_con>.per-phone:nth-child(2) .phonetic')
    const explaintions = zip(
      await domParser.queryAllContent('.basic .word-exp .pos'),
      await domParser.queryAllContent('.basic .word-exp .trans')
    ).map(([pos, trans]) => ({ pos: pos ?? '', trans: trans ?? '' }))
    const examples = zip(
      await domParser.queryAllContent('.word-exp .sen-eng'),
      await domParser.queryAllContent('.word-exp .sen-ch')
    ).map(([a, b]) => [a ?? '', b ?? ''] as [string, string])


    return {
      pronounceUA,
      pronounceUK,
      explaintions,
      examples,
    }
  }
})
