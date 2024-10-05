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
  import {
    computePosition,
    shift,
    flip,
    autoPlacement,
  } from "@floating-ui/dom";
  import type {
    MiddlewareState,
    Middleware,
  } from '@floating-ui/dom'
  import { onMount, untrack } from "svelte";
  import { useMediaQuery } from "../../hooks/use-media-query.svelte.ts";
  let container: HTMLElement;
  let isMobile = useMediaQuery('(max-width:500px)')

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
        middleware: [
          status.visibility == "show-button" ? autoPlacement() : null,
          status.visibility == "show-win"
            ? isMobile.match
              ? ({
                  name: "center",
                  fn(state: MiddlewareState) {
                    const { width, height } = state.rects.floating;
                    const x = (window.innerWidth - width) / 2;
                    const y = (window.innerHeight - height) / 2;
                    return {
                      ...state,
                      x,
                      y,
                    };
                  },
                } as Middleware)
              : autoPlacement()
            : null,
          //shift(),
        ].filter((i) => i != null),
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
        location.href,
        status.context,
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
  class="mk-container card"
  style:color={`${status.visibility === "show-button"}?'block':'none'`}
>
  {#if status.visibility === "show-button"}
    <button class="button is-white" disabled={mark.loading} onclick={mark.call}>
      标记
    </button>
  {:else if status.visibility === "show-win" && status.translation}
    <Translation translation={status.translation} />
  {/if}
</div>

<style>
  .mk-container {
    overflow: hidden;
  }
</style>
