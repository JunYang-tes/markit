import { marker } from './marker'
import { highlight } from './highlight'
import './popup'
import './selection'
import './dom-parser'
import { makeChannel } from '../share/channel'
import browser from 'webextension-polyfill'

console.log(browser.runtime.getURL('html/viewer.html'))


marker.getList()
  .then(highlight)

