import browser from 'webextension-polyfill'
import { domParserBuilder } from '../share/services/dom-parser'
const template = document.createElement('template')

domParserBuilder.provider({
  setHtml(html: string) {
    console.log("setHtml", html)
    template.innerHTML = html
  },
  queryContent(selector: string) {
    return template.content.querySelector(selector)?.textContent ?? ''
  },
  queryAllContent(selector: string) {
    return Array.from(template.content.querySelectorAll(selector))
      .map(item => item.textContent ?? '')
  }
})
