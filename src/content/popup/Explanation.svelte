<script lang="ts">
  import type { Explanation } from "../../share/types";
    import Example from "./Example.svelte";
  const wordClass = {
    "N-COUNT": "可数名词",
    "N-UNCOUNT": "不可数名词",
    "N-PLURAL": "复数名词",
    "N-PROPER": "专有名词",
    ADJ: "形容词",
    "ADJ-GRADED":"可分级的形容词",
    ADV: "副词",
    V: "动词",
    VERB: "动词",
    "V-T": "及物动词",
    "V-I": "不及物动词",
    PHRASE: "短语",
    PREP: "介词",
    CONJ: "连词",
    PRON: "代词",
    DET: "限定词",
    MODAL: "情态动词",
  };

  let { explanation }: { explanation: Explanation } = $props();
</script>

{#if explanation.items.length > 0}
  <section>
    <h1 class="is-size-5 section_title">
      {explanation.source}
    </h1>
    <ul>
      {#each explanation.items as item}
        <li class="is-flex is-flex-direction-row">
          <div class="pos">{item.pos}</div>
          <div class="definition-container">
            <div class="definition">{@html item.trans}</div>
            <Example examples={item.examples}/>
          </div>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  section {
    margin-top: 16px;
  }
  .section_title {
    border-bottom: 1px solid var(--markit-text-secondary);
  }
  li {
    margin-block: 10px;
  }
  .pos {
    color: var(--markit-text-secondary);
    word-wrap: break-word;
    width: 50px;
    margin-right: 16px;
    flex-shrink: 0;
  }
  .definition-container {
    flex-grow: 1;
  }
  .definition {
    color: var(--markit-text-primary);
  }
</style>
