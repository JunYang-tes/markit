import browser from 'webextension-polyfill'
function isBackend() {
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
  let id = 0;
  let is_content = true
  if (is_content) { }
  const pending: Record<number, (val: any) => void> = {}
  const isBackground = isBackend()
  let port: browser.Runtime.Port | null = null
  const handleMessage = async (msg: any) => {
    if (msg.type === 'req') {
      port!.postMessage({
        id: msg.id,
        type: 'response',
        body: await responser(msg.body)
      })
    } else {
      console.log("pending handler--------:",pending,msg)
      pending[msg.id](msg.body)
      console.log("delete pending:",msg.id)
      delete pending[msg.id]
    }
  }
  let disconnected = false
  function create() {
    port = browser.runtime.connect({ name: `channel.${name}` })
    disconnected = false
    port.onMessage.addListener(handleMessage)
    port.onDisconnect.addListener(() => {
      disconnected = true
    })
  }

  if (!isBackend()) {
    create()
  } else {
    browser.runtime.onConnect.addListener(p => {
      if (p.name === `channel.${name}`) {
        console.log('connect:', p.name)
        port = p;
        port.onMessage.addListener(handleMessage)
      }
    })
  }

  return (message: any) => {
    if (port) {
      if (disconnected) {
        create()
      }
      const msgId = id++;
      return new Promise<any>((res) => {
        pending[msgId] = res
        console.log("send message:", msgId, message)
        console.log("handlers",pending,pending[msgId])
        port!.postMessage({
          id: msgId,
          body: message,
          type: 'req'
        })
      })
    }
    throw new Error("Port is not ready")
  }
}

