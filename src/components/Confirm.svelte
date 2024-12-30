<script lang="ts">
  import Dialog from './Dialog.svelte';
  import Button from './Button.svelte';

  let {
    title = 'Confirm',
    message = 'Are you sure?',
    onConfirm = () => {},
    onCancel = () => {},
    dialog = $bindable()
  } = $props<{
    title?: string;
    message?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    dialog?: HTMLDialogElement;
  }>();


  function handleConfirm() {
    onConfirm();
    dialog?.close();
  }

  function handleCancel() {
    onCancel();
    dialog?.close();
  }

</script>

<Dialog bind:dialog={dialog}>
  <h2>{title}</h2>
  <p>{message}</p>
  <div class="actions">
    <Button variant="primary-outline" onclick={handleCancel}>取消</Button>
    <Button variant="primary" onclick={handleConfirm}>确认</Button>
  </div>
</Dialog>

<style>
  h2 {
    margin-top: 0;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
</style>

