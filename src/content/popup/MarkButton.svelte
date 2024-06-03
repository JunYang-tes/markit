<script lang="ts">
  import { status, withLoading, showWin, hide } from "./state.svelte.ts";
  import { hightlightUnderNode, cancelHighlight } from "../highlight";
  import { marker } from "../marker";
  import Translation from "./Translation.svelte";
  let container: HTMLDivElement | null;
  document.body.addEventListener(
    "click",
    (e) => {
      if (e && container) {
        if (!container.contains(e.target as HTMLElement)) {
          hide();
        }
      }
    },
    { capture: true },
  );

  const mark = withLoading(async () => {
    console.log("mark/unmark");
    if (status.content === "") {
      return;
    }
    const marked = await marker.isMarked(status.content);
    if (marked) {
      await marker.unmark(status.content);
      cancelHighlight(document.body, status.content);
    } else {
      const item = await marker.add(
        status.content,
        status.context,
        location.href,
      );
      if (item) {
        hightlightUnderNode(document.body, [item]);
      }
      status.translation = marker.query(status.content)
    }
    showWin(status.content, status.x, status.y);
  });
</script>

<div
  bind:this={container}
  class="container"
  style:color={`${status.visibility === "show-button"}?'block':'none'`}
  style:transform={`translate(${status.x}px,${status.y}px)`}
>
  {#if status.visibility === "show-button"}
    <button disabled={mark.loading} onclick={mark.call}> Markit </button>
  {:else if status.visibility === "show-win"}
    <Translation translation={status.translation} />
  {/if}
</div>

<style>
  .container {
    border: 1px solid red;
    transition: transform 1s;
  }
</style>
