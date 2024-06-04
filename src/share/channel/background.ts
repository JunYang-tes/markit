import browser from 'webextension-polyfill'
import { genId, onMessage, registerSenderResolver } from './common';
import { isBackground } from '../utils';

let port: browser.Runtime.Port | null = null

if (isBackground()) {
  browser.runtime.onConnect.addListener(port => {
    console.log("port connected:", port.name)
    if (port.name === "channel") {
      port.onMessage.addListener(onMessage)
    }
  })
}

async function connect() {
  const tab = (await browser.tabs.query({
    active: true,
    currentWindow: true
  }))[0]
  port = browser.tabs.connect(tab.id!, {
    name: 'channel.bg2fg'
  })
  port.onMessage.addListener(onMessage)
  port.onDisconnect.addListener(() => {
    port = null
  })

}

const id = genId();
export function sendMessage(channelName: string, message: any): Promise<any> {
  if (port === null) {
    connect()
  }
  return new Promise((resolve, reject) => {
    const seq = id.next().value;
    registerSenderResolver(channelName, seq, resolve, reject)
    port?.postMessage({
      type: 'req',
      id: seq,
      channelName,
      body: message
    })
  })

}

