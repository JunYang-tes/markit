<script lang="ts">
  let {
    syllables,
  }: {
    syllables: Array<{
      word: string;
      syllables: string[];
    }>;
  } = $props();
</script>

<div>
  {#each syllables as { word, syllables: sylls }}
    <div class="word-container is-flex">
      {#if sylls.length > 0}
        <div class="syllables">
          {#each sylls as syllable}
            <span class="syllable is-size-4">{syllable}</span>
          {/each}
        </div>
        <div class="word is-size-6">{word}</div>
      {:else}
        <span class="syllable is-size-4">{word}</span>
      {/if}
    </div>
  {/each}
</div>

<style>
  .word-container {
    gap: 10px;
    align-items: baseline;
  }
  .syllable::after {
    content: "";
    width: 0;
    height: 0;
    display: inline-block;
    border: 2px solid var(--markit-text-secondary);
    border-radius: 50%;
    vertical-align: middle;
    margin-inline: 2px;
  }
  .syllable:last-child::after {
    display: none;
  }
  .word {
    color: var(--markit-text-secondary);
  }
  .syllable {
    color: var(--markit-text-primary);
  }
</style>
