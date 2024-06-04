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
    <div>
      <div class="word" >{word}</div>
      <div class="syllables">
        {#each sylls as syllable}
          <span class="syllable">{syllable}</span>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  
  .syllable::after {
    content: "";
    width: 0;
    height: 0;
    display: inline-block;
    border: 2px solid red;
    border-radius: 50%;
    vertical-align: middle;
    margin-inline: 2px;
  }
  .word {
    color: var(--markit-text-primary);
  }
</style>
