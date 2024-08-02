<script lang="ts">
    import type { FileStat } from "webdav";
    import { getJournalList } from "../../background/sync/im-export";
  import Button from "../../components/Button.svelte";
  import { marker } from "../../content/marker";
    import MarkButton from "../../content/popup/MarkButton.svelte";
  import { getWebdavAccount } from "../../share/setting";
  import type { WebdavAccount  } from "../../share/setting";
    import JournalList from "./Sync/JournalList.svelte";
  //let account = getWebdavAccount()
  let account = $state<WebdavAccount|null>(null)
  let journalList =  $state([] as FileStat[])
  getWebdavAccount().then(async a=>{
    account = a
    if(account) {
    journalList = await getJournalList(account)
    }
  });
  async function refreshJournalList() {
    if(account) {
      journalList = await getJournalList(account)
    }
  }



</script>
<section>
  <h1>本地</h1>
<Button variant="primary"
  onclick={() => {
    console.log(marker.downloadDb());
  }}
>
  导出
</Button>
<Button variant="primary"
  onclick={async () => {
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

}}

>
  导入
</Button>
</section>

<section>
  <h1>网盘</h1>
  {#if account}
    <Button onclick={async()=>{
      try {
        await marker.exportToWebdav(account!)
        alert("Ok")
      }catch (e) {
        alert(e)
      }
    }}>
      导出
    </Button>
    <Button onclick={async()=>{
      try {
        const cnt = await marker.importFromWebdav(account!)
        alert("Imported "+cnt)
      }catch(e) {
        alert(e)
      }
    }}>
      导入
    </Button>
  {:else}
    <div>账号未设置</div>
  {/if}
</section>

<section>
  <h1>网盘同步</h1>
  <div>
    通过应用其它设备的日志来同步数据
  </div>
  {#if account !=null}
    <Button onclick={async ()=>{
    try {
      await marker.uploadJournal(account!)
      refreshJournalList()
    }catch(e) {
      alert(e)
    }
    }}>
      上传
    </Button>
    <Button onclick={async() => {
      try {
        await marker.syncFromJournal(account!)
      } catch(e) {
        alert(e)
      }
    }}>
      同步
    </Button>
    <div>
      日志
    </div>
    <JournalList 
          data={journalList}
    />


  {:else}
  <div>账号未设置</div>
  {/if}
</section>

<section>
  <h1>其它</h1>
  <Button onclick={()=>marker.resetDb()}>
    重置
  </Button>
</section>


