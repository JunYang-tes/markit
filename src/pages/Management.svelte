<script lang="ts">
  import { marker } from "../content/marker";
  import Sync from "./management/Sync.svelte";
  import Statistics from "./management/Statistics.svelte";
  import Setting from "./management/Setting.svelte";
  import "../style.css";
  const components = {
    Statistics,
    Sync,
    Setting
  };
  let selectedSubModule = $state("Sync" as keyof typeof components);
  function handleSideItemClick(e: MouseEvent) {
    if (e.target) {
      const li = e.target as HTMLLIElement;
      const key = li.getAttribute("data-key");
      if (key && key in components) {
        selectedSubModule = key as any;
      }
    }
  }
</script>

<aside>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <ul class="menu menu-list" onclick={handleSideItemClick}>
    <li data-key="Sync">同步</li>
    <li data-key="Statistics">统计</li>
    <li data-key="Setting">设置</li>
  </ul>
</aside>
<main>
  <svelte:component this={components[selectedSubModule]} />
</main>
