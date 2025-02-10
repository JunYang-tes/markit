<script lang="ts">
  import type { HTMLDialogAttributes } from "svelte/elements";
  let {
    dialog = $bindable(),
    ...props
  }: HTMLDialogAttributes & {
    dialog: HTMLDialogElement;
  } = $props();
</script>

<dialog class="card modal" {...props} bind:this={dialog}>
  <slot />
</dialog>

{#snippet Dialog(props: {
  dialog: HTMLDialogElement
})}
  <dialog bind:this={dialog}>
    Hello
  </dialog> 
{/snippet}

<style>
dialog {
  border:none;
}
dialog[open] {
  display: block !important;
}
</style>
