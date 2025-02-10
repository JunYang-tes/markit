<script lang="ts" module>
  import Dialog from './Dialog.svelte';
  import Button from './Button.svelte';
  export { confirmDialog };


</script>


{#snippet confirmDialog(props: {
  title: string
  message: string
  onClose:(reason:'confirm'|'cancel')=>void
})}
  <div>
    <h2>{props.title}</h2>
    <p>{props.message}</p>
    <div class="actions">
      <Button variant="primary-outline" onclick={()=>props.onClose('cancel')}>取消</Button>
      <Button variant="primary" onclick={()=>props.onClose('confirm')}>确认</Button>
    </div>
  </div>
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
  
{/snippet}


