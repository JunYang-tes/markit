<script lang="ts">
  let { defer = 100 } = $props();
  let timeout = $state(false);
  setTimeout(()=>{
    timeout=true;
  },defer)
</script>
{#if timeout}
  <progress class="progress is-small is-primary"></progress>
{/if}

