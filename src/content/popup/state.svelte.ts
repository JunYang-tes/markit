import type { DictItem } from "../../share/types";
import { marker } from '../marker'

export type Visibility = 'show-button' | 'show-win' | 'hidden'
export const status = $state({
  visibility: 'hidden' as Visibility,
  content: '',
  context: '',
  translation: Promise.resolve(undefined as DictItem | undefined),
  x: 0,
  y: 0,
})

export function showMarkerButton(content: string, context: string, x: number, y: number) {
  status.x = x;
  status.y = y;
  status.visibility = 'show-button'
  status.context = context
  status.content = content
}

export function showWin(content: string, x: number, y: number) {
  status.x = x;
  status.y = y;
  status.translation =
    marker.query(content)
      .then(item => item || Promise.reject("Failed to query"))
  status.visibility = 'show-win'
}

export function hide() {
  status.visibility = 'hidden'
}

export function withLoading<Args extends any[], T>(fn: (...args: Args) => Promise<T>) {
  let loading = $state(false)
  let data = $state<T | null>(null)
  const handler = async (...args: Args) => {
    try {
      loading = true
      data = await fn(...args);
    } finally {
      loading = false
    }
  }
  return {
    get loading() {
      return loading
    },
    get data() {
      return data
    },
    call: handler
  }
}

