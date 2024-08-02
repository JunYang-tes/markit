<script lang="ts">
  import { format } from "date-fns";
  import Dialog from "../../../components/Dialog.svelte";
  import type { FileStat } from "webdav";
  import { getJournalContent } from "../../../background/sync/im-export";
  import { getWebdavAccount } from "../../../share/setting";
  import JsonViewer from "../../../components/JsonViewer.svelte";
  import type { DbJournal } from "../../../share/types";
    import { reverse } from "lodash-es";

  let { data } = $props<{
    data: FileStat[];
  }>();
  let viewing = $state<DbJournal[]>([]);
  let dialog: HTMLDialogElement;
  let account = getWebdavAccount();

  function journalSummary(item:DbJournal) {
    if(item.storeName=="markers") {
      switch(item.operation.kind) {
        case 'add':
        return `新增:${item.operation.data.content}`
        case 'update':
        return `更新${item.operation.data.content}的标记次数 :${item.operation.data.viewCount}`
        case 'delete':
        return `删除${item.operation.key}`
      }

    } else {
      return `${item.operation.kind} on ${item.storeName}`
    }
  }


</script>

<table class="table">
  <thead>
    <tr>
      <th> 操作 </th>
      <th> 设备 Id </th>
      <th> 上次更新时间 </th>
    </tr>
  </thead>
  <tbody>
{#each data as item}
      <tr>
        <td>
          <button
            onclick={async () => {
              viewing = (await getJournalContent((await account)!, item)).reverse();
              console.log(viewing)
              dialog.showModal();
            }}
          >
            查看
          </button>
        </td>
        <td>{item.basename}</td>
        <td>{format(item.lastmod, "yyyy-MM-dd hh:mm:ss")}</td>
      </tr>
    {/each}
  </tbody>
</table>

<Dialog
  class="journal-detail"
  bind:dialog onclose={() => dialog.close()}>
    <table class="table">
      <thead>
        <tr>
          <th>动作</th>
          <th>时间</th>
        </tr>
      </thead>
      <tbody>
        {#each viewing as item}
          <tr>
            <td>{journalSummary(item)}</td>
            <td>{format(item.date,'yyyy-MM-dd hh:mm:ss')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
</Dialog>

<style>
:global(.journal-detail)
   {
    overflow: auto;
  }
</style>
