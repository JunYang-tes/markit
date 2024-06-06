<script lang="ts">
  import type { Pronounce } from "../../share/types";

  let { pronounce }: { pronounce: Pronounce } = $props();
</script>

<div class=" pro-container">
  <div class="chip">
    {pronounce.type}
  </div>
  <div>
    {pronounce.ipa.startsWith("/") ? pronounce.ipa : `/${pronounce.ipa}/`}
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
