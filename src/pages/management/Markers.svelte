<script lang="ts">
  import { format } from "date-fns";
  import { getAll, deleteMark, unmark } from "../../background/db/markers";
  import {marker} from '../../content/marker'
  import type { MarkedItem, QueryResult } from "../../share/types";
    import Translation from "../../content/popup/Translation.svelte";
    import { markers } from "../../background/db";
    import Dialog from "../../components/Dialog.svelte";
  let data = $state([] as MarkedItem[]);
  let sortBy = $state("viewCount" as "viewCount" | "date");
  let translation = $state(null as null|Promise<QueryResult>);
  $effect(() => {
    refresh();
  });
  let dialog: HTMLDialogElement;

  async function refresh() {
    data = await getAll(sortBy);
  }
</script>

{#snippet sortable(
  column:string,
  by:'viewCount'|'date')}
  <button 
    style="white-space: nowrap;"
    onclick={()=>{
    sortBy = by;
  }}>
    {column}
    {#if sortBy == by}
      v
    {/if}
  </button>
{/snippet}

<Dialog
  bind:dialog={dialog}
  onclose={()=>{
  translation = null;
    dialog.close();
    refresh();
}}>
{#if translation!= null}
  <Translation translation={translation} />
{/if}
</Dialog>
<table class="table">
  <thead>
    <tr>
      <th>操作</th>
      <th>单词</th>
      <th>
        {@render sortable("查询次数","viewCount")}
      </th>
      <th>{@render sortable("首查日期","date")}</th>
    </tr>
  </thead>
  <tbody>
    {#each data as item}
      <tr>
        <td>
          <button
            class="button is-small"
            onclick={async () => {
              await deleteMark(item.content);
              refresh();
            }}
          >
            删除
          </button>
          <button
            class="button is-small"
            onclick={async () => {
              await unmark(item.content);
              refresh();
            }}
          >
            取消标记
          </button>
        </td>
        <td>
          <button onclick={()=>{
            console.log(dialog)
            translation = marker.query(item.content)
              .then(item=>item || Promise.reject("Failed to query"));
            dialog.showModal();
          }}>
          {item.content}
          </button>
        </td>
        <td>{item.viewCount}</td>
        <td>{format(item.date, "yyyy-MM-dd hh:mm")}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  thead {
    position: sticky;
    top: -24px;
    background: white;
    z-index: 1;
  }
</style>
