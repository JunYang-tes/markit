<script lang="ts">
  import { format } from "date-fns";
  import Dialog from "../../../components/Dialog.svelte";
  import type { FileStat } from "webdav";
  import { getJournalContent } from "../../../background/sync/im-export";
  import { getWebdavAccount } from "../../../share/setting";
  import JsonViewer from "../../../components/JsonViewer.svelte";

  let { data } = $props<{
    data: FileStat[];
  }>();
  let viewing = $state([]);
  let dialog: HTMLDialogElement;
  let account = getWebdavAccount();
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
              viewing = await getJournalContent(await account, item);
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

<Dialog bind:dialog onclose={() => dialog.close()}>
  <JsonViewer data={viewing} />
</Dialog>
