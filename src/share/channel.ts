import browser from 'webextension-polyfill'
import * as bg from './channel/background'
import * as fg from './channel/content'
import { registerChannelHandler } from './channel/common'


function isBackground() {
  try {
    return globalThis.document == null
  } catch (e) {
    return false
  }
}

export function makeChannel(
  name: string,
  responser: (message: any) => any
) {
  registerChannelHandler(name, responser)
  return (message: any) => {
    if (isBackground()) {
      return bg.sendMessage(name, message)
    } else {
      return fg.sendMessage(name, message)
    }
  }
}

