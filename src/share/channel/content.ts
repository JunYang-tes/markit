import browser from 'webextension-polyfill'
import { genId, onMessage, registerSenderResolver } from './common';
import { isBackground } from '../utils';
let port: browser.Runtime.Port | null = null;

if (!isBackground()) {
  browser.runtime.onConnect.addListener(port => {
    if (port.name === 'channel') {
      port.onMessage.addListener(onMessage)
    }
  })
}


function connect() {
  port = browser.runtime.connect(undefined,{
    name:'channel'
  });
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
  return new Promise((resolve, reject) => {
    const seq = id.next().value;
    registerSenderResolver(channelName, seq, resolve, reject)
    console.log("send:", {
      type: 'req',
      id: seq,
      channelName,
      body: message
    })
    port?.postMessage({
      type: 'req',
      id: seq,
      channelName,
      body: message
    })
  })

}
