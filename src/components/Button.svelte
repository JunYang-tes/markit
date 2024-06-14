<script lang="ts">
  let {
    type,
  }: {
    type: "primary" | "primary-outline";
  } = $props();
  let cls = $derived(`button ${type ==='primary' ? 'is-primary' : 'primary-outline'}`);
</script>

<button class={cls}> Button </button>

<style>
  .is-primary {
    color: white;
  }
</style>
