<script lang="ts"> 
    import type { FileStat } from "webdav";
    import { getJournalList } from "../../background/sync/im-export";
  import Button from "../../components/Button.svelte";
  import { marker } from "../../content/marker";
    import MarkButton from "../../content/popup/MarkButton.svelte";
  import { getWebdavAccount } from "../../share/setting";
  import type { WebdavAccount  } from "../../share/setting";
    import JournalList from "./Sync/JournalList.svelte";
    import Icon from "../../components/Icon.svelte";
    import { mdiInformation,mdiExport,mdiImport } from "@mdi/js";
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

<div>
  <section>
    <h3 class="title is-4">本地</h3>
    <div class="columns is-mobile is-vcentered" style="flex-wrap: wrap;">
      <div class="column is-half" style="flex-basis: 100%;">
        <div class="notification is-info">
          <Icon path={mdiInformation} role="img" class="info-icon" />
          <p>此操作将当前数据导出为JSON文件，可在其它设备上导入。</p>
        </div>
        <Button variant="primary-outline"
          onclick={() => {
            console.log(marker.downloadDb());
          }}
        >
        <div class="is-flex is-align-items-center">
          <span class="mr-2">导出</span>
          <Icon path={mdiExport} role="img" class="info-icon" />
        </div>
          
        </Button>
      </div>
      <div class="column is-half" style="flex-basis: 100%;">
        <div class="notification is-info">
          <Icon path={mdiInformation} role="img" class="info-icon" />
          <p>此操作将JSON文件导入为当前设备的数据。</p>
        </div>
        <Button variant="primary-outline"
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
        <div class="is-flex is-align-items-center">
          <span class="mr-2">导入</span>
          <Icon path={mdiImport} role="img" class="info-icon" />
        </div>
      </Button>
      </div>
    </div>
  </section>

  <section>
    <h3 class="title is-4">网盘</h3>
    {#if account}
      <div class="field">
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
      </div>
    {:else}
      <div class="notification is-warning">账号未设置</div>
    {/if}
  </section>

  <section>
    <h3 class="title is-4">网盘同步</h3>
    <div>
      通过应用其它设备的日志来同步数据
    </div>
    {#if account !=null}
      <div class="field">
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
      </div>
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
    <h3 class="title is-4">其它</h3>
    <div class="field">
      <Button onclick={()=>marker.resetDb()}>
        重置
      </Button>
    </div>
  </section>
</div>

<style>
  section {
    margin-block: var(--markit-space-m);
  }
  .field {
    margin-bottom: var(--markit-space-s);
  }
</style>
