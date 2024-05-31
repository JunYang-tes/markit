import { makeChannel } from '../share/channel'
import { domParserBuilder } from '../share/services/dom-parser'
import browser from 'webextension-polyfill'
const send = makeChannel('dom-parser', () => 0)
export const domParser = domParserBuilder.consumer()
