<script lang="ts">
  import { marker } from "../content/marker";
  import Sync from "./management/Sync.svelte";
  import Statistics from "./management/Statistics.svelte";
  import Setting from "./management/Setting.svelte";
  import "../style.css";
  import { getId } from "../share/setting";
  import { management } from "webextension-polyfill";
  const components = {
    Statistics,
    Sync,
    Setting,
  };
  let selectedSubModule = $state("Sync" as keyof typeof components);
  let id = getId();
  function handleSideItemClick(e: MouseEvent) {
    if (e.target) {
      console.log(e.target);
      const li = e.target as HTMLLIElement;
      const key = li.getAttribute("data-key");
      if (key && key in components) {
        selectedSubModule = key as any;
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
    width: 80vw;
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
  }
</style>
