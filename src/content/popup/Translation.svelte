<script lang="ts">
  import type { DictItem,QueryResult } from "../../share/types";
  import { zip } from "lodash-es";
    import Syllable from "./Syllable.svelte";
    import { marker } from "../marker";

  let {
    translation,
  }: {
    translation: Promise<QueryResult>;
  } = $props();


</script>

<div class="container">
  {#await translation}
    <p>loading...</p>
  {:then item}
    <div>
      <button onclick={()=>marker.unmark(item.phrase)} >Unmark</button>
      <Syllable syllables={item.syllables} />
      <div>{item.pronounceUA}</div>
      <ul>
        {#each item.explaintions as explaintion}
          <li>
            {explaintion.trans}
          </li>
        {/each}
      </ul>
      <ul>
        {#each item.examples as example}
          <li>{example}</li>
        {/each}
      </ul>
    </div>
  {/await}
</div>

<style>
  .container {
    background: white;
    width: 300px;
    max-height: 500px;
    overflow: auto;
  }

  .container :global(*[data-markit_marked]) {
    pointer-events: none;
  }
</style>
