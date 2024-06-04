<script lang="ts">
  import {
    status,
    withLoading,
    showWin,
    hide,
    showWinAnyway,
  } from "./state.svelte.ts";
  import { hightlightUnderNode, cancelHighlight } from "../highlight";
  import { marker } from "../marker";
  import Translation from "./Translation.svelte";
  import { computePosition, shift, flip, autoPlacement } from "@floating-ui/dom";
  import { onMount, untrack } from "svelte";
  let container: HTMLElement;

  function place(pos: {
    x: number;
    y: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  }) {
    computePosition(
      {
        getBoundingClientRect() {
          return pos;
        },
      },
      container,
      {
        placement: "right-start",
        middleware: [autoPlacement()],
      },
    ).then(({ x, y }) => {
      container.style.transform = `translate(${x}px,${y}px)`;
    });
  }

  $effect(() => {
    const resize = new ResizeObserver(() => {
      const pos = untrack(() => {
        return {
          width: 0,
          height: 0,
          x: status.x,
          y: status.y,
          left: status.x,
          top: status.y,
          right: status.x,
          bottom: status.y,
        };
      });
      place(pos);
    });
    resize.observe(container);
    return () => {
      resize.disconnect();
    };
  });

  const mark = withLoading(async () => {
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
      status.translation = marker
        .query(status.content)
        .then((data) => (data ? data : Promise.reject("Failed to query")));
      showWinAnyway(status.x, status.y);
    }
  });
</script>

<div
  bind:this={container}
  class="container"
  style:color={`${status.visibility === "show-button"}?'block':'none'`}
>
  {#if status.visibility === "show-button"}
    <button disabled={mark.loading} onclick={mark.call}> Markit </button>
  {:else if status.visibility === "show-win" && status.translation}
    <Translation translation={status.translation} />
  {/if}
</div>

<style>
  .container {
    border: 1px solid red;
  }
</style>
