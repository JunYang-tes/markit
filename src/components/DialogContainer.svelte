<script lang="ts">
import type {Snippet} from 'svelte'
import {dialogs} from './DialogContainerState.svelte'
import Dialog from './Dialog.svelte'
let dialog: HTMLDialogElement;
$effect(()=>{
  if(dialogs.length>0) {
    dialog.showModal()
  }
})
</script>

<Dialog bind:dialog={dialog}>
  {#if dialogs.length>0}
    {@render dialogs[0].dialogSnippet({
      ...dialogs[0].props,
      onClose: (...args:any[]) => {
        dialog.close()
        dialogs[0].onClose(args)
        dialogs.shift()
      }
    })}
  {/if}
</Dialog>

