<script lang="ts">
  import type { MarkedItem, QueryResult } from "../../share/types";
  import Syllable from "./Syllable.svelte";
  import { marker } from "../marker";
  import Loading from "../../components/Loading.svelte";
  import { cancelHighlight } from "../highlight";
  import Pronounce from "./Pronounce.svelte";
  import Explanation from "./Explanation.svelte";
  import { createTabState } from "../../components/Tab.svelte.ts";
  import Tab from '../../components/Tab.svelte'
  import Icon from "../../components/Icon.svelte";
  import { mdiClose } from "@mdi/js";


  let {
    translation,
    markedItem,
    onClose,
  }: {
    markedItem: Promise<MarkedItem|undefined>,
    translation: Promise<QueryResult>;
    onClose:()=>void
  } = $props();
  type TabKeys = "translation" | "comment" | "context"
  let [tabState, {isActived,setActive}] = createTabState<TabKeys>(
    "translation",
  );
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

<div class="markit-container">
  {#await Promise.all([translation,markedItem] as const)}
    <Loading />
  {:then [translation,markedItem]}
    {@const autoplayItem = translation.pronounce.find((i) => i.ipa !== "")}
    <div style="position:relative;">
      <Icon path={mdiClose} role="button" style="position: absolute;right: 0;" 
        onclick={onClose}
      />
      <div class="pronounce">
        {#each translation.pronounce as pronounce}
          {#if pronounce.ipa}
            <Pronounce {pronounce} autoplay={autoplayItem === pronounce} />
          {/if}
        {/each}
      </div>

      {#if markerState === "marked"}
        <button class="button is-small" onclick={unmark}>取消标记</button>
      {/if}
      {#if markerState === "marked" || markerState === "canceled"}
        <button class="button is-small" onclick={deleteMark}>删除标记</button>
      {/if}
      <button class="button is-small" onclick={requery}> 重新查询 </button>
      <hr />
      <Tab 
        tabs={["translation", "comment", "context"] as TabKeys[]} 
        active={tabState.active} 
        onAcitve={(tab)=> {
         setActive(tab); 
      }}
      >
          {#snippet tab(t)}
            {#if t === "translation"}
              <div>释义</div>
            {:else if t === "comment"}
              <div>备注</div>
            {:else if t === "context"}
              <div>上下文</div>
            {/if}
          {/snippet}
      </Tab>
      {#if isActived('translation')}
        {#each translation.explanations as explanation}
          <Explanation {explanation} />
        {/each}
      {/if}
      {#if isActived('comment') && markedItem!=null}
        <textarea
          class="textarea"
          rows="10"
          bind:value={markedItem.comment}
          onblur={() => marker.updateMarker(markedItem.content, {
            comment:markedItem.comment
          })}
        ></textarea>
      {/if}
      {#if isActived('context') && markedItem!=null}
        <textarea
          class="textarea"
          rows="10"
          bind:value={markedItem.context}
          onblur={() => marker.updateMarker(markedItem.content, {
            context:markedItem.context
          })}
        ></textarea>
      {/if}

    </div>
  {:catch err}
    <div class="message is-danger">{err}</div>
  {/await}
</div>

<style>
  .markit-container {
    background: white;
    max-width: 500px;
    min-width: 50px;
    max-height: 500px;
    padding: 16px;
    overflow: auto;
  }
  .pronounce {
    display: flex;
    gap: 20px;
    margin-block: 10px;
  }

  .markit-container :global(*[data-markit_marked]) {
    pointer-events: none;
  }
</style>
