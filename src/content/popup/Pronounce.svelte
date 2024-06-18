<script lang="ts">
  import Icon from "../../components/Icon.svelte";
  import type { Pronounce } from "../../share/types";
  import { mdiVolumeHigh } from "@mdi/js";
  let { pronounce }: { pronounce: Pronounce } = $props();
  let audio: HTMLAudioElement;
</script>

<div class=" pro-container">
  <div class="chip">
    {pronounce.type}
  </div>
  <div>
    {pronounce.ipa.startsWith("/") ? pronounce.ipa : `/${pronounce.ipa}/`}
  </div>
  {#if pronounce.url}
    <audio bind:this={audio}>
      <source src={pronounce.url} type="audio/mpeg" />
      <source src={"http://" + pronounce.url} type="audio/mpeg" />
      <source src={"https://" + pronounce.url} type="audio/mpeg" />
    </audio>
    <Icon
      class="play"
      role="button"
      path={mdiVolumeHigh}
      onclick={() => {
        audio.play();
      }}
    />
  {/if}
</div>

<style>
  .pro-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .chip {
    background: var(--markit-text-secondary);
    padding-inline: 4px;
    color: white;
  }
  .pro-container :global(.play) {
    cursor: pointer;
  }
</style>
