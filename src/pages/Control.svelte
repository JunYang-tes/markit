<script lang="ts">
  import { marker } from "../content/marker";
</script>

<button
  onclick={() => {
    console.log(marker.downloadDb());
  }}
>
  Export
</button>
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
