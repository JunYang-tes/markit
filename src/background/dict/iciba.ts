import { domParser } from '../dom-parser'
import { makeQuery } from './network-dict'

export const query = makeQuery({
  url: phrase => `https://iciba.com/word?w=${phrase}`,
  parser: async (text) => {
    await domParser.setHtml(text)
    const data = JSON.parse(await domParser.queryContent('#__NEXT_DATA__'))
    const wordInfo = data.props.pageProps.initialReduxState.word.wordInfo
    const baseInfo = wordInfo.baesInfo ??
      wordInfo.baseInfo;
    const pronounce = baseInfo.symbols?.flatMap(
      (i: any) => {
        const arr = [{
          type: 'UA',
          ipa: i.ph_am,
          url: (i.ph_am_mp3 ?? i.ph_am_mp3_bk ?? '').replace(/^http:/, '')
        },
        {
          type: 'UK',
          ipa: i.ph_en,
          url: (i.ph_en_mp3 ?? i.ph_en_mp3_bk ?? '').replace(/^http:/, '')
        }
        ]
        if (arr[0].url == '' && arr[1].url == '') {
          arr.push({
            type: "TTS",
            ipa: i.ph_other,
            url: (i.ph_tts_mp3 ?? i.ph_tts_mp3_bk).replace(/^http:/, '')
          })
        }
        return arr
      }
    ) ?? []
    const explanations = [
      {
        source: "简明",
        items:
          baseInfo.symbols?.flatMap((i: any) => {
            return i.parts.map(
              (i: any) => ({
                pos: i.part,
                trans: i.means.join(';'),
                examples: []
              })
            )
          }) ?? []
      },
      {
        source: "柯林斯",
        items: wordInfo.collins?.[0]?.entry?.map((i: any) => ({
          pos: i.posp,
          trans: i.def,
          examples: i.example?.map((i: any) => [i.ex, i.tran] as [string, string])
        })) ?? []
      },
      {
        source: "英英",
        items: wordInfo.ee_mean?.map((i: any) => ({
          pos: i.part_name,
          trans: i.means.map((i: any) => i.word_mean).join(';'),
          examples: []
        })) ?? []
      }
    ]
    return {
      pronounce,
      explanations
    }


  }
})
