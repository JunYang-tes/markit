<script lang="ts">
  import Button from "../../components/Button.svelte";
  import { marker } from "../../content/marker";
    import MarkButton from "../../content/popup/MarkButton.svelte";
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
    try {
      await marker.exportToWebdav(account)
      alert("Ok")
    }catch (e) {
      alert(e)
    }
  }}>
    导出到网盘
  </button>
  <button onclick={async()=>{
    try {
      const cnt = await marker.importFromWebdav(account)
      alert("Imported "+cnt)
    }catch(e) {
      alert(e)
    }
  }}>
    从网盘导入
  </button>
    <button onclick={async ()=>{
    try {
      await marker.uploadJournal(account)
        alert("OK")
    }catch(e) {
      alert(e)
    }
    }}>
      上传日志
    </button>
    <button onclick={async() => {
      try {
        await marker.syncFromJournal(account)
      } catch(e) {
        alert(e)
      }
    }}>
      按日志同步
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

