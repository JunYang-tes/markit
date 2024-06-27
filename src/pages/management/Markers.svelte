<script lang="ts">
  import { format } from "date-fns";
  import { getAll, deleteMark, unmark } from "../../background/db/markers";
  import type { MarkedItem } from "../../share/types";
  let data = $state([] as MarkedItem[]);
  async function refresh() {
    data = await getAll("viewCount");
    console.log(data);
  }
  refresh();
</script>

<table class="table">
  <thead>
    <tr>
      <th>操作</th>
      <th>单词</th>
      <th>查询次数</th>
      <th>首查日期</th>
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
        <td>{item.content}</td>
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
