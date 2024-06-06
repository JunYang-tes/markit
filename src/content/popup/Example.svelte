<script lang="ts">
  import Collapse from "../../components/Collapse.svelte";
  let {examples}:{examples:Array<[string,string]>} = $props()
</script>

{#snippet example([eng,zh]:[string,string])}
  <div class="example">
    <div>
      {eng}
    </div>
    <div>
      {zh}
    </div>
  </div>
{/snippet}

{#if examples.length > 0}
  <div class="chip">例</div>
  {#if examples.length == 1}
    {@render example(examples[0])}
  {:else}
    {@render example(examples[0])}
    <Collapse expanderPosition='bottom'>
      {#snippet expander(expanded)}
        <div class="expander">
          {expanded ? '收起':'更多'}
        </div>
      {/snippet}
      {#snippet body()}
            {#each examples as ex}
              {@render example(ex)}
            {/each}
      {/snippet}
    </Collapse>
  {/if}
{/if}

<style>
.expander {
  text-align: end;
  text-decoration: underline;
}
.example {
  margin-bottom: 10px;
}
</style>
