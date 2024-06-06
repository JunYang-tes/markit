<script lang="ts">
import type { Snippet } from 'svelte'
  let {
  expander,
  body,
  expanderPosition= 'top'

}:{
  expander:Snippet<[expanded:boolean]>,
  body:Snippet,
  expanderPosition?:'top'|'bottom'
} = $props()
  let expanderRow = $derived(expanderPosition == 'top'?1:2);
  let bodyRow = $derived(expanderPosition =='top'?2:1);

  let expanded = $state(false)
</script>

<div class={`collapse expander-${expanderPosition}`}>
  <input 
  type="checkbox" bind:checked={expanded} 
  style={`grid-row-start:${expanderRow};`}
/>
  <div class="collapse-title"
  style={`grid-row-start:${expanderRow};`}
  >
    {@render expander(expanded)}
  </div>
  <div class="collapse-content"
  style={`grid-row-start:${bodyRow};`}
  >
    {@render body()}
  </div>
</div>

<style>
  
  .collapse {
    position: relative;
    display: grid;
    overflow: hidden;
    grid-template-rows:  0fr auto;
    transition: grid-template-rows 0.2s;
    width: 100%;
  }
  .collapse.expander-top {
    grid-template-rows: auto 0fr;
  }
  .collapse.expander-top:not(.collapse-close):has(> input[type="checkbox"]:checked)
  {
    grid-template-rows: auto 1fr;
  }

  .collapse:not(.collapse-close):has(> input[type="checkbox"]:checked)
  {
    grid-template-rows: 1fr auto;
  }



  .collapse:not(.collapse-open):not(.collapse-close) > input[type="checkbox"],
  .collapse:not(.collapse-open):not(.collapse-close) > .collapse-title {
    cursor: pointer;
  }
  .collapse > input[type="checkbox"] {
    appearance: none;
    opacity: 0;
  }
  .collapse-title,
  .collapse > input[type="checkbox"],
  .collapse-content 
  {
    grid-column-start: 1;
  }
  .collapse-title,
  :where(.collapse > input[type="checkbox"]) {
    width: 100%;
    transition: background-color 0.2s ease-out;
  }
  .collapse:focus:not(.collapse-close) > .collapse-content,
  .collapse:not(.collapse-close)
    > input[type="checkbox"]:checked
    ~ .collapse-content {
    visibility: visible;
    min-height: -moz-fit-content;
    min-height: fit-content;
  }

  .collapse-content {
    visibility: hidden;
    grid-column-start: 1;
    min-height: 0;
    transition: visibility 0.2s;
    transition:
      padding 0.2s ease-out,
      background-color 0.2s ease-out;
    cursor: unset;
  }
</style>
