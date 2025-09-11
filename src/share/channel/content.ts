import browser from 'webextension-polyfill'
import { genId, onMessage, registerSenderResolver } from './common';
import { isBackground } from '../utils';
let port: browser.Runtime.Port | null = null;

if (!isBackground()) {
  browser.runtime.onConnect.addListener(port => {
    if (port.name === 'channel.bg2fg') {
      port.onMessage.addListener(onMessage)
    }
  })
}


function connect() {
  // port = browser.runtime.connect(undefined, {
  //   name: 'channel'
  // });
  port = browser.runtime.connect({ name: 'channel' })
  port.onMessage.addListener(onMessage)
  port.onDisconnect.addListener(() => {
    port = null
  })
}
const id = genId()
export function sendMessage(channelName: string, message: any): Promise<any> {
  if (port === null) {
    connect()
  }
  return new Promise(async (resolve, reject) => {
    const seq = id.next().value;
    registerSenderResolver(channelName, seq, resolve, reject)
    await browser.runtime.sendMessage({ type: 'ping' })
    if (port) {
      console.log("[content] send:", {
        type: 'req',
        id: seq,
        channelName,
        body: message
      })
      port.postMessage({
        type: 'req',
        id: seq,
        channelName,
        body: message
      })
    } else {
      console.log("[content] No connected port")
    }
  })

}
