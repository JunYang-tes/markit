import type browser from 'webextension-polyfill'

export type ChannelMessage = {
  type: 'req' | 'resp',
  id: number,
  channelName: 'string',
  body: any
}

const messageDispacher: Record<string, (body: any) => Promise<unknown>> = {}
const pendingSender: Record<string, { resolve: (val: any) => void, reject: (err: string) => void }> = {}
function pendingId(msg: ChannelMessage) {
  return `${msg.channelName}.${msg.id}`
}
export async function onMessage(message: any, port: browser.Runtime.Port) {
  const { id, channelName, body, type } = message
  if (type === 'req') {
    const handler = messageDispacher[channelName]
    if (handler) {
      let resp = null;
      try {
        resp = await handler(body)
      } catch (e) {
        console.error(e)
        port.postMessage({
          type: 'resp',
          channelName,
          id,
          body: {
            type: 'error',
            data: (e as Error).message ?? 'Failed to handle message',
          }
        })
        return
      }
      port.postMessage({
        type: 'resp',
        channelName,
        id,
        body: {
          type: 'ok',
          data: resp
        }
      })
    }
  } else {
    console.log("port.sender",port.sender,message)
    const resolver = pendingSender[`${channelName}.${id}`]
    if (resolver == null) {
      console.error(`No resolver for ${channelName}.${id}`)
    } else {
      delete pendingSender[`${channelName}.${id}`]
      if (body.type === 'ok') {
        resolver.resolve(body.data)
      } else {
        resolver.reject(body.data)
      }
    }

  }
}
export function registerChannelHandler<T>(channelName: string, handler: (msg: T) => Promise<any>) {
  messageDispacher[channelName] = handler
}

export function* genId() {
  let i = 0;
  while (true) {
    yield i++;
  }
  return i
};
export function registerSenderResolver(channelName: string, id: number, resolve: (val: any) => void, reject: (err: string) => void) {
  pendingSender[`${channelName}.${id}`] = {
    resolve,
    reject
  }
}
