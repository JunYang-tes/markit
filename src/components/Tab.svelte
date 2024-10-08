<script lang="ts" generics="T">
import type {Snippet} from 'svelte'
let {
  tab,
  active,
  onAcitve,
  tabs
} : {
  tabs:T[]
  active: T,
  onAcitve: (tab:T)=>void
  tab: Snippet<[T]>
}= $props()

</script>
<div class="tabs">
  <ul>
    {#each tabs as t}
      <!-- svelte-ignore event_directive_deprecated -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <li role="tab" class:is-active={active == t} on:click={() => onAcitve(t)}>
        <a href="#">
          {@render tab(t)}
        </a>
      </li>
    {/each}
  </ul>
</div>
<style>
  .tabs {
    --bulma-tabs-link-active-color: var(--markit-color-primary);
    --bulma-tabs-link-active-border-bottom-color: var(--markit-color-primary);
  }
</style>
