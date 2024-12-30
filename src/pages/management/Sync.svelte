<script lang="ts"> 
    import type { FileStat } from "webdav";
    import { getJournalList } from "../../background/sync/im-export";
    import { addToast } from "../../components/Toast/state.svelte";
  import Button from "../../components/Button.svelte";
  import { marker } from "../../content/marker";
    import MarkButton from "../../content/popup/MarkButton.svelte";
  import { getWebdavAccount } from "../../share/setting";
  import type { WebdavAccount  } from "../../share/setting";
    import JournalList from "./Sync/JournalList.svelte";
    import Icon from "../../components/Icon.svelte";
    import { mdiInformation,mdiExport,mdiImport,mdiArrowExpandUp,mdiArrowExpandDown,
      mdiChevronUp,
      mdiChevronDown
     } from "@mdi/js";
    import Collapse from "../../components/Collapse.svelte";
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

<div class="sync">
<Collapse className="card" 
>
  {#snippet expander(expanded:boolean)}
  <div class="is-flex is-align-items-center collapse-expander {expanded ? 'expanded':''}">
      <div class="title is-4">导入/导出</div>
      <Icon path={expanded ? mdiChevronUp : mdiChevronDown} />      
  </div>
  {/snippet}
  {#snippet body()}
    
  <section>
    <h3 class="title is-5">本地</h3>
    <div class="columns is-mobile is-vcentered" style="flex-wrap: wrap;">
      <div class="column is-half" style="flex-basis: 100%;">
        <div class="notification is-info">
          <Icon path={mdiInformation} role="img" class="info-icon" />
          <p>将当前数据导出为JSON文件，可在其它设备上导入。</p>
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
          <p>将JSON文件导入为当前设备的数据。</p>
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
            return new Promise<any>((res,rej)=>{
              reader.addEventListener('load',e=>{
                const data = reader.result as string
                try {
                  res(JSON.parse(data))
                }catch(e) {
                  rej(e)
                }
              })
              reader.readAsText(file)
            })
          }
          const file = await openFile()
          let data;
          try {
            data = await readJSON(file);
          } catch (e) {
            addToast({ message: '数据格式错误', type: 'error' });
            return;
          }
          try {
            await marker.importDb(data)
            addToast({ message: '成功导入'+data.markers.length+'条数据', type: 'success' });
          }catch(e) {
            addToast({ message: '导入失败 '+e, type: 'error' });
          }
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
    <h3 class="title is-5">网盘</h3>
    {#if account}
      <div class="field">
        <div class="field">
          <div class="notification is-info">
            <Icon path={mdiInformation} role="img" class="info-icon" />
            <p>将数据导出到网盘</p>
          </div>
          <Button 
          variant="primary-outline"
          onclick={async()=>{
            try {
              await marker.exportToWebdav(account!)
              addToast({ message: '成功导出数据', type: 'success' });
            }catch (e) {
              addToast({ message: '导出失败 '+e, type: 'error' });
            }
          }}>
            <div class="is-flex is-align-items-center">
              <span class="mr-2">导出</span>
              <Icon path={mdiExport} role="img" class="info-icon" />
            </div>
          </Button>
        </div>
        <div>
          <div class="notification is-info">
            <Icon path={mdiInformation} role="img" class="info-icon" />
            <p>从网盘导入数据</p>
          </div>
          <Button 
          variant="primary-outline"
          onclick={async()=>{
            try {
              const cnt = await marker.importFromWebdav(account!)
              addToast({ message: '成功导入'+cnt+'条数据', type: 'success' });
            }catch(e) {
              addToast({ message: '导入失败 '+e, type: 'error' });
            }
          }}>
            <div class="is-flex is-align-items-center">
              <span class="mr-2">导入</span>
              <Icon path={mdiImport} role="img" class="info-icon" />
            </div>
          </Button>
        </div>
      </div>
    {:else}
      <div class="notification is-warning">账号未设置</div>
    {/if}
  </section>

  {/snippet}
</Collapse>
<Collapse className="card">
  {#snippet expander(expanded:boolean)}
  <div class="is-flex is-align-items-center collapse-expander {expanded ? 'expanded':''}">
      <div class="title is-4">网盘同步</div>
      <Icon path={expanded ? mdiChevronUp:mdiChevronDown  } />      
  </div>
  {/snippet}
  {#snippet body()}
  <section>
    <h3 class="title is-5">网盘同步</h3>
        {#if account}
          <div class="notification is-info">
            <Icon path={mdiInformation} role="img" class="info-icon" />
            <p>
              通过应用其它设备的日志来同步数据
            </p>
          </div>
          <div class="field">
            <Button 
              variant="primary-outline"
              onclick={async ()=>{
                try {
                  await marker.uploadJournal(account!)
                  refreshJournalList()
                  addToast({ message: '上传成功', type: 'success' });
                  refreshJournalList()
                }catch(e) {
                  addToast({ message: '上传失败 ' + e, type: 'error' });
                }
              }}>
              上传
            </Button>
            <Button 
              variant="primary-outline"
              onclick={async() => {
                try {
                  await marker.syncFromJournal(account!)
                  addToast({ message: '同步成功', type: 'success' });
                } catch(e) {
                  addToast({ message: '同步失败 ' + e, type: 'error' });
                }
              }}>
              同步
            </Button>
          </div>
        {:else}
          <div class="notification is-warning">账号未设置</div>
        {/if}
    <div>
    </div>
    {#if account !=null}
    {:else}
      <div class="notification is-warning">账号未设置</div>
    {/if}
  </section>
  <section>
    <h3 class="title is-5">设备日志</h3>
    {#if account != null}
      <JournalList 
        data={journalList}
      />
    {:else}
      <div class="notification is-warning">账号未设置</div>
    {/if}
  </section>
  {/snippet}
</Collapse>

  <section>
    <h3 class="title is-4">其它</h3>
    <div class="field">
      <Button variant="primary-outline" onclick={()=>marker.resetDb()}>
        重置
      </Button>
    </div>
  </section>
</div>

<style>
.sync {
}
:global(.card) {
  padding: var(--markit-space-s);
}
.collapse-expander {
  justify-content: space-between;
  .is-4{
    margin-bottom: 0;
  }
  .expanded
   {
    border-bottom: 1px solid var(--markit-color-primary);
  }
}
  section {
    margin-block: var(--markit-space-m);
  }
  .field {
    margin-bottom: var(--markit-space-s);
  }
</style>
