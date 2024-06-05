<script lang="ts">
  import type { DictItem, QueryResult } from "../../share/types";
  import { zip } from "lodash-es";
  import Syllable from "./Syllable.svelte";
  import { marker } from "../marker";
  import Loading from "../../components/Loading.svelte";
  import { cancelHighlight } from "../highlight";
  import Pronounce from "./Pronounce.svelte";

  let {
    translation,
  }: {
    translation: Promise<QueryResult>;
  } = $props();
  let markerState = $state("marked" as "marked" | "canceled" | "deleted");
  async function unmark() {
    const t = await translation;
    markerState = "canceled";
    marker.unmark(t.phrase);
    cancelHighlight(document.body, t.phrase);
  }
  async function deleteMark() {
    const t = await translation;
    markerState = "deleted";
    marker.deleteMark(t.phrase);
    cancelHighlight(document.body, t.phrase);
  }
  async function requery() {
    const t = await translation;
    translation = marker
      .query(t.phrase, true)
      .then((data) => (data ? data : Promise.reject("Failed to query")));
  }
</script>

<div class="container">
  {#await translation}
    <Loading />
  {:then item}
    <div>
      <Syllable syllables={item.syllables} />
      <div class="pronounce">
        {#if item.pronounceUA}
          <Pronounce type="UA" content={item.pronounceUA} />
        {/if}
        {#if item.pronounceUK}
          <Pronounce type="UK" content={item.pronounceUK} />
        {/if}
      </div>

      {#if markerState === "marked"}
        <button class="button is-small" onclick={unmark}>取消标记</button>
      {/if}
      {#if markerState === "marked" || markerState === "canceled"}
        <button class="button is-small" onclick={deleteMark}>删除标记</button>
      {/if}
      <button class="button is-small" onclick={requery}> 重新查询 </button>
      <hr />
      <section>
        <h1 class="is-size-5 section_title">释意</h1>
        <ul>
          {#each item.explaintions as explaintion}
            <li class="is-flex is-flex-direction-row">
              <div class="pos">
                {explaintion.pos}
              </div>
              <div class="trans">
                {explaintion.trans}
              </div>
            </li>
          {/each}
        </ul>
      </section>
      <section>
        <h1 class="is-size-5 section_title">例句</h1>
        <ul class="example-list">
          {#each item.examples as [eng, zh], index}
            <li class="is-flex is-flex-direction-row">
              <div class="example-seq">{index + 1}</div>
              <div>
                <div>{eng}</div>
                <div>{zh}</div>
              </div>
            </li>
          {/each}
        </ul>
      </section>
    </div>
  {/await}
</div>

<style>
  .container {
    background: white;
    max-width: 500px;
    max-height: 500px;
    padding: 16px;
    overflow: auto;
  }
  .pronounce {
    display: flex;
    gap: 20px;
    margin-block: 10px;
  }

  .container :global(*[data-markit_marked]) {
    pointer-events: none;
  }
  .pos {
    color: var(--markit-text-secondary);
    width: 30px;
    margin-right: 16px;
    flex-shrink: 0;
  }
  .trans {
    color: var(--markit-text-primary);
  }
  .example-seq {
    color: var(--markit-text-secondary);
    width: 30px;
    margin-right: 16px;
    flex-shrink: 0;
  }
  section {
    margin-top: 10px;
  }
  .section_title {
    border-bottom: 1px solid var(--markit-text-secondary);
  }
</style>
