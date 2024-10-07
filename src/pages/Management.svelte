<script lang="ts">
  import './style.css';
  import Icon from "../components/Icon.svelte";
  import {mdiMenu} from '@mdi/js'
  import { marker } from "../content/marker";
  import Sync from "./management/Sync.svelte";
  import Statistics from "./management/Statistics.svelte";
  import Setting from "./management/Setting.svelte";
  import MarkList from "./management/Markers.svelte";
  import "../style.css";
  import { getId } from "../share/setting";
  import { management } from "webextension-polyfill";
    import { useMediaQuery } from '../hooks/use-media-query.svelte';
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
  const indicatorIndex = {
    Sync:0,
    MarkList:1,
    Statistics:2,
    Setting:3
  }

  const isMobile = useMediaQuery('(max-width: 500px)');
  let isNavMenuVisible = $state(false);
</script>

{#snippet nav()}
    <aside class="menu">
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <ul class="menu-list" onclick={handleSideItemClick}>
        <li class:selected={selectedSubModule === 'Sync'}><a data-key="Sync">同步</a></li>
        <li class:selected={selectedSubModule === 'MarkList'}>
          <a data-key="MarkList"> 单词表 </a>
        </li>
        <li class:selected={selectedSubModule === 'Statistics'}>
          <a data-key="Statistics"> 统计 </a>
        </li>
        <li class:selected={selectedSubModule === 'Setting'}>
          <a data-key="Setting"> 设置 </a>
        </li>
        <div class="indicator" style="--top: {indicatorIndex[selectedSubModule]}"/>
      </ul>
      {#await id then id}
        <div class="client-info">
          <div>client id</div>
          <div>{id}</div>
        </div>
      {/await}
    </aside>
{/snippet}

<div class="management-container">
  <div class="management card {isMobile.match ? 'mobile' : ''}">
    {#if isMobile.match}
      <div class="dropdown nav-menu {isNavMenuVisible ? 'is-active':''}">
        <div class="dropdown-trigger">
          <Icon
            path={mdiMenu}
            role="button"
            onclick={()=>isNavMenuVisible=!isNavMenuVisible}
          />
        </div>
        <div class="dropdown-menu" id="dropdown-menu3" role="menu">
          <div class="dropdown-content">
            {@render nav()}
          </div>
        </div>
      </div>
    {:else}
     {@render nav()}
    {/if}

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
  .management.mobile {
    flex-direction: column;
  }
  
  @media (max-width: 900px) {
    .management {
      width: 100vw;
      height: 100vh;
    }
  }
  .nav-menu {
    margin-left: var(--markit-space-m);
    margin-top: var(--markit-space-m);
  }
  aside {
    width: 260px;
    padding: var(--markit-space-m);
    border-right: 1px solid var(--bulma-border-weak);
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: center; */
  }
  aside .menu-list {
    position: relative;
  }
  .indicator {
    --size: 40px;
    --top:0;
    position:absolute;
    top:0;    
    background: white;
    position: absolute;
    height: var(--size);
    border-right: 2px solid var(--markit-color-primary);
    right: -24px;
    transform: translateY(calc(var(--top) * var(--size)));
    transition: all 0.5s;
  }  
  .selected a {
    color: var(--markit-color-primary) !important;
    font-weight: bolder;
  }
  li:not(.selected) a {
    color: var(--markit-text-secondary) !important;
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
