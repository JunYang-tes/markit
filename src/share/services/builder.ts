import browser from "webextension-polyfill";
import type { WrapInPromise } from "../types";
import { makeChannel } from "../channel";
import { noop } from "lodash-es";

const refsHolderKey = Symbol('refsHolder')
export function build<D extends Record<string, Function>>(
  ns: string,
  descriptor: Array<keyof D>
) {
  type Consumer = {
    [k in keyof D]: D[k] extends (...args: any) => any
    ? (...args: Parameters<D[k]>) => WrapInPromise<ReturnType<D[k]>>
    : never
  }
  return {
    provider(apis: D) {
      console.log("provider:", ns)
      const refsHolder = ((globalThis as any)[refsHolderKey] || ((globalThis as any)[refsHolderKey] = []))
      const send = makeChannel(ns, async (req: any) => {
        if (req.type === 'call' && req.namespace === ns) {
          const f = (apis as any)[req.fn];
          if (f) {
            try {
              const r = await f(...req.args)
              console.log("call:", req, r)
              return r
            } catch (e) {
              console.log(e)
            }
          }
        }
      });
      // hold this reference to prevent deleted by gc
      refsHolder.push(send)
    },
    consumer(): Consumer {
      const send = makeChannel(ns, noop)
      async function call<Args extends any[], T>(fn: string, args: Args): Promise<T> {
        const resp = await send({
          type: 'call',
          namespace: ns,
          fn,
          args,
        })
        return resp as T
      }
      return Object.fromEntries(descriptor.map(fn => [fn, (...args: any) => call(fn as string, args)])) as Consumer
    }
  }
}

