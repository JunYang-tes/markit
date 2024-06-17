<script lang="ts">
  import Button from "../../components/Button.svelte";
  import { marker } from "../../content/marker";
  import { createClient } from "webdav/web"
  import { getWebdavAccount } from "../../share/setting";
  let account = getWebdavAccount()


</script>


<button
  class="button is-primary"
  onclick={() => {
    console.log(marker.downloadDb());
  }}
>
  Export
</button>

{#await account}
{:then account} 
{#if account}
  <button onclick={async()=>{
    console.log(
    marker.exportToWebdav(account)
    )
  }}>
    导出到网盘
  </button>
{:else }
  <button disabled>
    导出到网盘
  </button>
  <div>账号未设置</div>
{/if}
{/await}

<button onclick={async () => {
  function openFile() {
    const input = document.createElement('input')
    input.type="file"
    input.accept="*.json"
    return new Promise<File>((res)=>{
      input.addEventListener('change',e=>{
        const file = input.files?.[0]
        if(file) {
          res(file)
        }
      })
      input.click()
    })
  }
  function readJSON(file:File) {
    const reader = new FileReader();
    return new Promise<any>((res)=>{
      reader.addEventListener('load',e=>{
        const data = reader.result as string
        res(JSON.parse(data))
      })
      reader.readAsText(file)
    })

  }
  const file = await openFile()
  const data = await readJSON(file)
  marker.importDb(data)


}}>Import </button>
<button onclick={() => console.log(marker.resetDb())}> Reset </button>

