<script lang="ts">
  let { type = "UA", content = "" } = $props();
</script>

<div class=" pro-container">
  <div class="chip">
    {type}
  </div>
  <div>
    {content}
  </div>
</div>

<style>
  .pro-container {
    display: flex;
    gap: 8px;
  }
  .chip {
    background: var(--markit-text-secondary);
    padding-inline: 4px;
    color: white;
  }
</style>
