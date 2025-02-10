import type { Snippet } from "svelte"

export const dialogs = $state<Array<{
  dialogSnippet: Snippet<[{
    onClose: (...args: any[]) => void
  }]>,
  props:any,
  onClose: (...args: any[]) => void
}>
>([])

export async function openDialog<
R extends any[],
P extends { onClose: (...args: R) => void }
>(
  dialog: Snippet<[P]>,
  props: Omit<P,'onClose'>

) {
  return new Promise<R>((res, rej) => {
    dialogs.unshift({
      dialogSnippet: dialog as any,
      props:props,
      onClose:res
    })
  })
}
// export const topmost = $derived(() => {
//   if (dialogs.length > 0) {
//     return dialogs[dialogs.length - 1]
//   }
//   return null
// })

// export function useTopmostDialog() {
//   return topmost
// }
