<script lang="ts">
  import { marker } from "../content/marker";
  import Sync from "./management/Sync.svelte";
  import Statistics from "./management/Statistics.svelte";
  import Setting from "./management/Setting.svelte";
  import MarkList from "./management/Markers.svelte";
  import "../style.css";
  import { getId } from "../share/setting";
  import { management } from "webextension-polyfill";
  const components = {
    Statistics,
    Sync,
    Setting,
    MarkList,
  };
  let initialKey =
    location.hash.substring(1) in components
      ? location.hash.substring(1)
      : "Sync";
  console.log("initialKey", location.hash, initialKey);
  let selectedSubModule = $state(initialKey as keyof typeof components);
  let id = getId();
  function handleSideItemClick(e: MouseEvent) {
    if (e.target) {
      const li = e.target as HTMLLIElement;
      const key = li.getAttribute("data-key");
      if (key && key in components) {
        selectedSubModule = key as any;
        location.hash = key;
      }
    }
  }
</script>

<div class="management-container">
  <div class="management card">
    <aside class="menu">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <ul class="menu-list" onclick={handleSideItemClick}>
        <li><a data-key="Sync">同步</a></li>
        <li>
          <a data-key="MarkList"> 单词表 </a>
        </li>
        <li>
          <a data-key="Statistics"> 统计 </a>
        </li>
        <li>
          <a data-key="Setting"> 设置 </a>
        </li>
      </ul>
      {#await id then id}
        <div class="client-info">
          <div>client id</div>
          <div>{id}</div>
        </div>
      {/await}
    </aside>
    <main>
      <svelte:component this={components[selectedSubModule]} />
    </main>
  </div>
</div>

<style>
  .management-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
  }
  .management {
    display: flex;
    width: 60vw;
    height: 80vh;
    border-radius: var(--markit-radius-m);
    overflow: hidden;
  }
  aside {
    width: 260px;
    padding: var(--markit-space-m);
    border-right: 1px solid var(--bulma-border-weak);
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: center; */
  }
  .client-info {
    text-align: center;
  }
  main {
    padding: var(--markit-space-m);
    flex-grow: 1;
    overflow: auto;
  }
</style>
