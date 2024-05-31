import { build } from './builder'

export const domParserBuilder = build<{
  setHtml: (html: string) => void,
  queryContent: (selector: string) => string
  queryAllContent:(selector:string)=> string[]
}>('dom-parser', ['setHtml', 'queryContent','queryAllContent'])
