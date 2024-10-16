import browser from 'webextension-polyfill'
import * as bg from './channel/background'
import * as fg from './channel/content'
import { registerChannelHandler } from './channel/common'
import { isBackground } from './utils'



export function makeChannel(
  name: string,
  responser: (message: any) => any
) {
  registerChannelHandler(name, responser)
  return (message: any) => {
    if (isBackground()) {
      console.log("will send:",message," to ",name)
      return bg.sendMessage(name, message)
    } else {
      return fg.sendMessage(name, message)
    }
  }
}

